---
name: senior-backend-dev
description: >
  Comprehensive backend development skill for building scalable backend systems using Java 21/25,
  Spring Boot 3/4, JPA, Hibernate, Postgres, H2, REST APIs. Use when designing APIs, optimizing
  database queries, implementing business logic, handling authentication/authorization, or
  reviewing backend code. Déclenche sur : "crée un service", "ajoute un endpoint", "implémente
  la logique métier", "crée une facade REST", "ajoute un repository custom", "génère du code Java".
---

# Senior Backend Dev — Java 21 & 25 / Spring Boot 3 & 4 / Katappult

Skill pour le développement backend dans un projet katappult-core.

---

## ⚠️ Règle fondamentale

**Ne jamais modifier `**/generated/**`** — ce code est géré par le MCP Katappult.

Le code custom à produire :
- `services/custom/` → `Custom*Service.java`
- `rest/` → `Custom*ServiceFacade.java`
- `rules/` → Business rules
- `src/main/resources/changelogs/` → Liquibase custom

---

## Délégation vers les skills spécialisés

| Besoin | Skill à utiliser |
|---|---|
| Créer une classe Java (service, exception, DTO, enum…) | `/java-class` |
| Moderniser du code Java legacy | `/refactor-java-class` |
| Écrire un changeset Liquibase | `/liquibase` |
| Ajouter une business rule | `/add-business-rule` |
| Écrire un test d'intégration | `/backend-integration-test` |

---

## APIs katappult déjà disponibles — vérifier avant de coder

**→ Consulter `.claude/references/katappult-core-api-catalog.md`**

Auth, utilisateurs, notifications, médias, thumbnails, contacts, préférences, email, lifecycle — tout est disponible via la dépendance katappult-core. Ne pas réimplémenter.

---

## Pattern service custom

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomProduitService {

    private final ProduitRepository produitRepository;

    public ProduitDto findByUid(String uid) {
        return produitRepository.findByUid(uid)
            .map(this::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Produit not found: " + uid));
    }

    @Transactional
    public ProduitDto update(String uid, UpdateProduitRequest request) {
        Produit produit = produitRepository.findByUid(uid)
            .orElseThrow(() -> new EntityNotFoundException("Produit not found: " + uid));
        // modification
        return toDto(produitRepository.save(produit));
    }

    private ProduitDto toDto(Produit p) { /* mapping */ return null; }
}
```

## Pattern facade REST custom

Deux variantes selon si l'endpoint nécessite une authentification :

```java
// Sécurisé — /api/v1/ — JWT requis
@RestController
@RequestMapping("/api/v1/produits")
@RequiredArgsConstructor
@Tag(name = "Produits", description = "Custom produit endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CustomProduitServiceFacade extends BaseKatappultRestService {

    private final CustomProduitService customProduitService;

    @GetMapping("/{uid}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get produit by uid")
    @ApiResponse(responseCode = "200", description = "OK")
    @ApiResponse(responseCode = "404", description = "Not found")
    public ResponseEntity<ProduitDto> getProduit(@PathVariable String uid) {
        return ResponseEntity.ok(customProduitService.findByUid(uid));
    }
}

// Public/anonyme — /api/pub/v1/ — pas d'auth
@RestController
@RequestMapping("/api/pub/v1/produits")
@RequiredArgsConstructor
@Tag(name = "Produits Public", description = "Public produit endpoints")
public class CustomPublicProduitServiceFacade extends BaseKatappultRestService {

    private final CustomProduitService customProduitService;

    @GetMapping("/search")
    @Operation(summary = "Recherche publique de produits")
    @ApiResponse(responseCode = "200", description = "OK")
    public ResponseEntity<List<ProduitDto>> search(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        return ResponseEntity.ok(customProduitService.searchPublic(searchTerm, page, pageSize));
    }
}
```

| Type | Préfixe | `@PreAuthorize` | `@SecurityRequirement` |
|------|---------|-----------------|------------------------|
| Sécurisé | `/api/v1/` | Obligatoire | Requis |
| Public | `/api/pub/v1/` | Interdit | Absent |

**Toujours étendre `BaseKatappultRestService`** — helpers de réponse standardisés.  
**Convention path param : `uid` obligatoire** (stable cross-env, jamais `oid` ni `fullId`).

---

## Standards non-négociables

| Règle | Détail |
|---|---|
| `@PreAuthorize` | Sur chaque endpoint `/api/v1/**` — absent sur `/api/pub/v1/**` |
| `@Operation` + `@ApiResponse` | Sur chaque endpoint |
| `BaseKatappultRestService` | Étendre sur toutes les facades |
| Injection constructeur | `@RequiredArgsConstructor`, jamais `@Autowired` field |
| Lombok | `@Getter @Setter @NoArgsConstructor` (entity), `@RequiredArgsConstructor @Slf4j` (service) |
| Tests | Unitaires (Mockito) + intégration (MockMVC) pour chaque service/controller |
| Liquibase | Tout changement DB = nouveau changeset backward compatible |
| Entity JPA | Ne pas créer manuellement — utiliser le MCP Katappult |
