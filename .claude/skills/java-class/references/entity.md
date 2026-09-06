# Archétype : Entité JPA

## Quand l'utiliser
- Classe mappée à une table de base de données
- Utilisée avec Spring Data JPA / Hibernate
- Mots clés : entité, model, table, persist, JPA, Hibernate

## Template complet

```java
package com.example.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Objects;

/**
 * Entité représentant [description métier].
 *
 * @author  [auteur]
 * @since   1.0
 */
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_user_email", columnList = "email", unique = true)
    }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Version
    private Long version;  // optimistic locking

    // Constructeur JPA (requis)
    protected User() {}

    // Constructeur de création
    public User(String email, String firstName, String lastName) {
        this.email     = Objects.requireNonNull(email, "email must not be null");
        this.firstName = Objects.requireNonNull(firstName, "firstName must not be null");
        this.lastName  = Objects.requireNonNull(lastName, "lastName must not be null");
    }

    // --- Getters (pas de setters sur les champs immutables) ---

    public Long        getId()        { return id; }
    public String      getEmail()     { return email; }
    public String      getFirstName() { return firstName; }
    public String      getLastName()  { return lastName; }
    public UserStatus  getStatus()    { return status; }
    public Instant     getCreatedAt() { return createdAt; }
    public Instant     getUpdatedAt() { return updatedAt; }

    // --- Méthodes métier (privilegier les méthodes sémantiques) ---

    public void activate()  { this.status = UserStatus.ACTIVE; }
    public void deactivate(){ this.status = UserStatus.INACTIVE; }
    public boolean isActive(){ return UserStatus.ACTIVE == this.status; }

    // --- equals/hashCode sur l'identifiant naturel (email) ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User other)) return false;
        return Objects.equals(email, other.email);
    }

    @Override
    public int hashCode() { return Objects.hashCode(email); }

    @Override
    public String toString() {
        return "User{id=%d, email='%s', status=%s}".formatted(id, email, status);
    }
}
```

## Relations JPA

```java
// ManyToOne (côté enfant)
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "department_id", nullable = false)
private Department department;

// OneToMany (côté parent) — toujours LAZY
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
private List<Order> orders = new ArrayList<>();

// ManyToMany via table d'association
@ManyToMany
@JoinTable(
    name = "user_roles",
    joinColumns        = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id")
)
private Set<Role> roles = new HashSet<>();
```

## Règles importantes
- **Jamais de `FetchType.EAGER`** sur les collections → problème N+1.
- **equals/hashCode** basés sur l'identifiant naturel (email, code...), jamais sur `id` seul.
- **`@Version`** recommandé pour le verrouillage optimiste.
- Constructeur `protected` vide pour JPA, constructeur public pour la création.
- Préférer des **méthodes métier** (`activate()`) plutôt que `setStatus()`.