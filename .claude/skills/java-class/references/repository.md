# Archétype : Repository / DAO

## Quand l'utiliser
- Accès aux données, requêtes base de données
- Mots clés : repository, dao, data access, findBy, query, persist, JPA, Spring Data

---

## Template : Spring Data JPA (standard)

```java
package com.example.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Repository JPA pour les opérations de persistance sur {@link User}.
 *
 * @author  [auteur]
 * @since   1.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // --- Derived queries (générées automatiquement par Spring Data) ---

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByStatus(UserStatus status);

    List<User> findAllByStatusOrderByCreatedAtDesc(UserStatus status);

    // --- Pagination ---

    Page<User> findAllByStatus(UserStatus status, Pageable pageable);

    // --- JPQL pour requêtes complexes ---

    /**
     * Recherche les utilisateurs actifs dont le prénom commence par {@code prefix}.
     *
     * @param  prefix  début du prénom (sensible à la casse)
     * @param  status  statut à filtrer
     * @return         liste des utilisateurs correspondants
     */
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.firstName LIKE :prefix%")
    List<User> searchByNamePrefixAndStatus(
        @Param("prefix") String prefix,
        @Param("status") UserStatus status
    );

    /**
     * Charge un utilisateur avec ses rôles en une seule requête (évite N+1).
     *
     * @param  id  identifiant de l'utilisateur
     * @return     utilisateur avec rôles initialisés
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") Long id);

    // --- SQL natif pour cas spécifiques ---

    @Query(
        value = "SELECT * FROM users WHERE created_at > :since",
        nativeQuery = true
    )
    List<User> findCreatedAfter(@Param("since") Instant since);

    // --- Bulk update (toujours @Modifying + @Transactional dans le service) ---

    /**
     * Désactive tous les utilisateurs dont le dernier accès est antérieur à {@code before}.
     * Appeler depuis un service annoté {@code @Transactional}.
     *
     * @param  before  date limite
     * @return         nombre de lignes affectées
     */
    @Modifying
    @Query("UPDATE User u SET u.status = 'INACTIVE' WHERE u.lastLoginAt < :before")
    int deactivateInactiveUsers(@Param("before") Instant before);
}
```

---

## Template : Repository avec Specification (filtres dynamiques)

```java
package com.example.repository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Repository étendu avec support des filtres dynamiques via {@link Specification}.
 */
@Repository
public interface UserRepository
        extends JpaRepository<User, Long>,
                JpaSpecificationExecutor<User> {
    // JpaSpecificationExecutor ajoute : findAll(Specification), count(Specification), etc.
}

// --- Classe de Specifications associée ---

public final class UserSpecifications {

    private UserSpecifications() {}

    public static Specification<User> hasStatus(UserStatus status) {
        return (root, query, cb) ->
            status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<User> emailContains(String fragment) {
        return (root, query, cb) ->
            fragment == null ? null : cb.like(cb.lower(root.get("email")), "%" + fragment.toLowerCase() + "%");
    }

    public static Specification<User> createdAfter(Instant date) {
        return (root, query, cb) ->
            date == null ? null : cb.greaterThan(root.get("createdAt"), date);
    }
}

// --- Utilisation dans le service ---
// List<User> results = userRepository.findAll(
//     where(hasStatus(ACTIVE)).and(emailContains("gmail"))
// );
```

---

## Template : DAO manuel (sans Spring Data)

À utiliser uniquement si Spring Data n'est pas disponible.

```java
package com.example.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DAO JPA manuel pour {@link User}.
 */
@Repository
public class UserDao {

    @PersistenceContext
    private EntityManager em;

    public User save(User user) {
        if (user.getId() == null) {
            em.persist(user);
            return user;
        }
        return em.merge(user);
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(em.find(User.class, id));
    }

    public Optional<User> findByEmail(String email) {
        TypedQuery<User> query = em.createQuery(
            "SELECT u FROM User u WHERE u.email = :email", User.class
        );
        query.setParameter("email", email);
        return query.getResultStream().findFirst();
    }

    public List<User> findAllActive() {
        return em.createQuery(
            "SELECT u FROM User u WHERE u.status = 'ACTIVE' ORDER BY u.createdAt DESC",
            User.class
        ).getResultList();
    }

    public void delete(User user) {
        em.remove(em.contains(user) ? user : em.merge(user));
    }
}
```

---

## Règles importantes

- **`@Repository`** sur l'interface/classe pour la traduction des exceptions JPA.
- **Jamais de logique métier** dans un repository — uniquement des requêtes.
- **`LEFT JOIN FETCH`** pour les relations lazy à charger en une seule requête (évite N+1).
- **`@Modifying`** obligatoire sur les `UPDATE`/`DELETE` JPQL ; toujours appeler depuis un `@Transactional`.
- **Pagination** : retourner `Page<T>` ou `Slice<T>` (plus léger, sans COUNT) pour les listes longues.
- **Nommage** des méthodes derived queries : `findBy`, `existsBy`, `countBy`, `deleteBy` + champs en PascalCase.
- **SQL natif** en dernier recours uniquement — préférer JPQL pour la portabilité.