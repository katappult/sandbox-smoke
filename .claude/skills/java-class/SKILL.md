---
name: java-class
description: >
  Crée et met à jour des classes Java professionnelles respectant les normes et bonnes pratiques
  de l'industrie (Java 11–21). Utilise ce skill dès que l'utilisateur demande de créer, générer,
  scaffolder, refactorer ou mettre à jour une classe Java — entité, service, repository, DTO,
  exception, utilitaire, enum, record, interface, classe abstraite, ou tout autre type de fichier
  Java. Déclenche aussi pour : "ajoute une méthode à ma classe", "respecte les conventions Java",
  "génère un POJO", "ajoute des getters/setters", "implements l'interface X", "ajoute Javadoc",
  "applique les design patterns", "rends cette classe thread-safe", "convertis en record Java",
  ou toute demande de code Java structuré de plus de 10 lignes.
---

# Java Class Skill

Skill pour créer et mettre à jour des classes Java **professionnelles**, **lisibles** et **maintenables**, conformes aux normes Java (11–21) et aux conventions de l'industrie.

---

## Workflow obligatoire

1. **Analyser le contexte** — type de classe, version Java cible, framework (Spring, Jakarta EE, plain Java...), package, dépendances existantes.
2. **Choisir le bon archétype** → voir section [Archétypes de classes](#archétypes-de-classes).
3. **Appliquer les normes** → voir section [Normes et conventions](#normes-et-conventions).
4. **Générer le fichier `.java`** dans `/mnt/user-data/outputs/` ou indiquer clairement le chemin.
5. **Expliquer brièvement** les choix architecturaux si non évidents.

---

## Archétypes de classes

| Demande utilisateur | Archétype | Référence |
|---|---|---|
| entité JPA, model, table | `@Entity` JPA | [references/entity.md](references/entity.md) |
| service, logique métier | `@Service` / Service class | [references/service.md](references/service.md) |
| DTO, request body, response | Record ou classe immuable | [references/dto.md](references/dto.md) |
| repository, DAO, accès données | `interface` + Spring Data | [references/repository.md](references/repository.md) |
| exception personnalisée | Extends `RuntimeException` | [references/exception.md](references/exception.md) |
| utilitaire, helper | Classe `final` + méthodes `static` | [references/utility.md](references/utility.md) |
| enum avec comportement | `enum` avec champs/méthodes | [references/enum.md](references/enum.md) |
| controller REST, endpoint, API HTTP | `@RestController` + `ResponseEntity` | [references/rest.md](references/rest.md) |
| POJO générique | Class standard avec builder | ci-dessous |
| interface, contrat | `interface` avec `default` si besoin | ci-dessous |
| classe abstraite | `abstract class` avec template method | ci-dessous |

> **Si aucun archétype ne correspond clairement**, générer une classe POJO propre (voir template ci-dessous) et demander confirmation.

---

## Normes et conventions

### 1. Nommage (obligatoire)
```
Classes      → PascalCase         : UserService, OrderDto, PaymentException
Méthodes     → camelCase          : getUserById(), calculateTotal()
Variables    → camelCase          : firstName, totalAmount
Constantes   → UPPER_SNAKE_CASE   : MAX_RETRY_COUNT, DEFAULT_TIMEOUT
Packages     → lowercase, points  : com.company.module.submodule
Fichiers     → = nom de la classe : UserService.java
```

### 2. Structure d'une classe (ordre canonique)
```java
// 1. Déclaration du package
package com.example.module;

// 2. Imports (séparés par blocs : java.*, javax.*, tiers, interne)
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.module.dto.UserDto;

// 3. Javadoc de classe
/**
 * Description courte de la classe.
 *
 * @author  [auteur]
 * @since   [version]
 */
// 4. Annotations
@Service
// 5. Déclaration
public class UserService {

    // 6. Constantes statiques
    private static final int MAX_USERS = 1000;

    // 7. Champs (logger en premier, puis dépendances, puis état)
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    // 8. Constructeurs
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 9. Méthodes publiques

    // 10. Méthodes protégées

    // 11. Méthodes privées
}
```

### 3. Immutabilité et null-safety
- Préférer `final` pour les champs injectés (constructeur).
- Utiliser `Optional<T>` pour les retours qui peuvent être absents.
- Annoter avec `@NonNull` / `@Nullable` (Lombok ou Jakarta) si applicable.
- Ne jamais retourner `null` depuis une méthode publique → `Optional` ou `Collections.emptyList()`.

### 4. Javadoc
- **Obligatoire** sur toutes les classes publiques et méthodes publiques non triviales.
- Tags minimaux : `@param`, `@return`, `@throws` si applicable.
- Pas de Javadoc sur les getters/setters évidents (sauf si comportement particulier).

### 5. Gestion des exceptions
```java
// ✅ Exception métier explicite
throw new UserNotFoundException("User not found with id: " + id);

// ✅ Wrap exception checked → unchecked
try { ... } catch (IOException e) { throw new DataAccessException("...", e); }

// ❌ Ne jamais avaler une exception
catch (Exception e) { /* vide */ }

// ❌ Ne jamais utiliser Exception générique
throws Exception
```

### 6. Logging
```java
// Logger SLF4J standard (jamais System.out.println en production)
private static final Logger log = LoggerFactory.getLogger(MyClass.class);

log.debug("Processing user: {}", userId);   // paramétrisé, jamais concat string
log.info("User {} created successfully", userId);
log.warn("Retry attempt {} for {}", attempt, resource);
log.error("Failed to process order {}", orderId, exception);  // exception en dernier
```

### 7. Règles de style
- Longueur de ligne max : **120 caractères**.
- Méthode max : **30 lignes** (si plus → extraire des méthodes privées).
- Classe max : **300-500 lignes** (si plus → décomposer).
- **1 classe publique par fichier** (règle Java stricte).
- Accolades ouvrantes **sur la même ligne** (style K&R).
- Toujours des accolades même pour `if` d'une ligne.

### 8. Java moderne (préférer si Java 14+)
```java
// Records pour DTOs immuables (Java 16+)
public record UserDto(Long id, String email, String fullName) {}

// Sealed classes pour hiérarchies fermées (Java 17+)
public sealed interface Shape permits Circle, Rectangle {}

// Pattern matching instanceof (Java 16+)
if (obj instanceof String s) { return s.length(); }

// Switch expression (Java 14+)
String label = switch (status) {
    case ACTIVE  -> "Actif";
    case PENDING -> "En attente";
    default      -> "Inconnu";
};

// Text blocks pour SQL/JSON (Java 15+)
String query = """
        SELECT * FROM users
        WHERE active = true
        """;
```

---

## Template POJO générique

À utiliser quand aucun archétype spécifique ne s'applique :

```java
package com.example;

import java.util.Objects;

/**
 * Représente [description].
 *
 * @author  [auteur]
 * @since   1.0
 */
public final class MyEntity {

    private final String name;
    private final int value;

    private MyEntity(Builder builder) {
        this.name  = Objects.requireNonNull(builder.name,  "name must not be null");
        this.value = builder.value;
    }

    public String getName()  { return name; }
    public int    getValue() { return value; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MyEntity other)) return false;
        return value == other.value && Objects.equals(name, other.name);
    }

    @Override
    public int hashCode() { return Objects.hash(name, value); }

    @Override
    public String toString() {
        return "MyEntity{name='%s', value=%d}".formatted(name, value);
    }

    public static Builder builder() { return new Builder(); }

    public static final class Builder {
        private String name;
        private int value;

        public Builder name(String name)   { this.name  = name;  return this; }
        public Builder value(int value)    { this.value = value; return this; }
        public MyEntity build()            { return new MyEntity(this); }
    }
}
```

---

## Checklist avant de livrer le code

Avant de présenter la classe générée, vérifier mentalement :

- [ ] Package déclaré et cohérent avec la structure demandée
- [ ] Imports propres (pas de wildcard `import java.util.*`)
- [ ] Javadoc sur la classe et les méthodes publiques
- [ ] Pas de `null` retourné (Optional ou collections vides)
- [ ] Champs `final` quand possible
- [ ] Logger SLF4J si la classe a de la logique (pas de `System.out`)
- [ ] Exceptions explicites avec messages clairs
- [ ] `equals`, `hashCode`, `toString` présents sur les entités/valeurs
- [ ] Code Java compilable syntaxiquement correct
- [ ] Respect de la version Java cible (ne pas utiliser records si Java 8)

---

## Référence rapide : annotations courantes

```java
// Spring
@Component, @Service, @Repository, @Controller, @RestController
@Autowired (éviter — préférer injection constructeur)
@Value("${prop}"), @ConfigurationProperties
@Transactional, @Cacheable, @Async

// JPA / Hibernate
@Entity, @Table(name="..."), @Id, @GeneratedValue
@Column(nullable=false, length=100), @ManyToOne, @OneToMany
@CreationTimestamp, @UpdateTimestamp

// Validation (Jakarta Bean Validation)
@NotNull, @NotBlank, @Size(min,max), @Email, @Pattern
@Valid (sur les paramètres de méthode)

// Lombok (si utilisé)
@Data, @Value, @Builder, @RequiredArgsConstructor
@Slf4j, @EqualsAndHashCode, @ToString

// Tests
@SpringBootTest, @DataJpaTest, @WebMvcTest
@MockitoBean, @Mock, @InjectMocks, @ExtendWith(MockitoExtension.class)
```

---

## Références détaillées

Pour les archétypes complexes, lire le fichier de référence correspondant :

- **Entité JPA** → `references/entity.md`
- **Service métier** → `references/service.md`
- **DTO / Record** → `references/dto.md`
- **Repository** → `references/repository.md`
- **Exception personnalisée** → `references/exception.md`
- **Classe utilitaire** → `references/utility.md`
- **Enum avancé** → `references/enum.md`
- **Controller REST** → `references/rest.md`