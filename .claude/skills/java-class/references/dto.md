# Archétype : DTO / Record

## Quand l'utiliser
- Transfert de données entre couches (API ↔ Service ↔ DB)
- Mots clés : DTO, request, response, payload, body, projection

## Java 16+ — Record (privilégier)

```java
package com.example.dto;

import jakarta.validation.constraints.*;

/**
 * Requête de création d'un utilisateur.
 */
public record CreateUserRequest(

    @NotBlank @Email @Size(max = 100)
    String email,

    @NotBlank @Size(min = 2, max = 50)
    String firstName,

    @NotBlank @Size(min = 2, max = 50)
    String lastName
) {}

/**
 * Réponse représentant un utilisateur.
 */
public record UserResponse(
    Long   id,
    String email,
    String firstName,
    String lastName,
    String status
) {
    /** Factory method depuis l'entité. */
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getStatus().name()
        );
    }
}
```

## Java 8–15 — Classe immuable

```java
public final class UserResponse {

    private final Long   id;
    private final String email;

    private UserResponse(Long id, String email) {
        this.id    = id;
        this.email = email;
    }

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail());
    }

    public Long   getId()    { return id; }
    public String getEmail() { return email; }
}
```

---

# Archétype : Exception personnalisée

```java
package com.example.exception;

/**
 * Lancée quand un utilisateur demandé n'existe pas.
 */
public class UserNotFoundException extends RuntimeException {

    private final Long userId;

    public UserNotFoundException(Long userId) {
        super("User not found with id: " + userId);
        this.userId = userId;
    }

    public UserNotFoundException(String message) {
        super(message);
        this.userId = null;
    }

    public Long getUserId() { return userId; }
}

// Classe de base recommandée pour les exceptions métier
public abstract class BusinessException extends RuntimeException {
    protected BusinessException(String message) { super(message); }
    protected BusinessException(String message, Throwable cause) { super(message, cause); }
}
```

---

# Archétype : Repository Spring Data

```java
package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository JPA pour les opérations sur {@link User}.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByStatus(UserStatus status);

    // JPQL pour requêtes complexes
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.firstName LIKE :name%")
    List<User> searchByNameAndStatus(@Param("name") String name, @Param("status") UserStatus status);

    // SQL natif si nécessaire
    @Query(value = "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'", nativeQuery = true)
    List<User> findRecentUsers();
}
```

---

# Archétype : Classe utilitaire

```java
package com.example.util;

import java.util.regex.Pattern;

/**
 * Utilitaires pour la validation et le formatage des données utilisateur.
 * <p>Classe non instanciable — tous les membres sont statiques.</p>
 */
public final class UserUtils {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$");

    // Empêche l'instanciation
    private UserUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Vérifie qu'un email est valide.
     *
     * @param  email  adresse email à valider
     * @return        {@code true} si valide
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Formate un nom complet.
     *
     * @param  firstName  prénom
     * @param  lastName   nom
     * @return            nom formaté "Prénom NOM"
     */
    public static String formatFullName(String firstName, String lastName) {
        return "%s %s".formatted(capitalize(firstName), lastName.toUpperCase());
    }

    private static String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
    }
}
```

---

# Archétype : Enum avancé

```java
package com.example.domain;

/**
 * Statut d'un utilisateur avec libellés et transitions autorisées.
 */
public enum UserStatus {

    ACTIVE("Actif") {
        @Override public boolean canTransitionTo(UserStatus target) {
            return target == INACTIVE || target == SUSPENDED;
        }
    },
    INACTIVE("Inactif") {
        @Override public boolean canTransitionTo(UserStatus target) {
            return target == ACTIVE;
        }
    },
    SUSPENDED("Suspendu") {
        @Override public boolean canTransitionTo(UserStatus target) {
            return target == ACTIVE || target == INACTIVE;
        }
    };

    private final String label;

    UserStatus(String label) { this.label = label; }

    public String getLabel() { return label; }

    /**
     * Vérifie si la transition vers un autre statut est autorisée.
     *
     * @param  target  statut cible
     * @return         {@code true} si la transition est permise
     */
    public abstract boolean canTransitionTo(UserStatus target);
}
```