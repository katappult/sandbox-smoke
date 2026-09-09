# Backend — Java / Spring Boot

## Commandes

```bash
# Build + init H2 (premier lancement ou reset schema)
mvn clean install -PdropDb,updateDb -DskipTests

# Build sans drop (préserve les données)
mvn install -PupdateDb -DskipTests

# Lancer le backend
mvn spring-boot:run

# Tests d'intégration
mvn clean verify
mvn clean verify -Dit.test=CarRentalGeneratedServiceFacadeIT
mvn clean verify -Dit.test=CarRentalGeneratedServiceFacadeIT#createCarRental
```

## Architecture générée

Le générateur produit un slice vertical complet par entité :

| Layer | Package | Pattern |
|---|---|---|
| Entity | `model/` | `@Entity`, table prefix `gen_` |
| DTO / QuerySpec | `model/dto/`, `model/queryspec/` | Used in service/repo calls |
| REST models | `model/rest/` | `XxxRestRequest`, `XxxRestResponse`, `XxxListRestModel` |
| Events | `model/event/` | `PreCreateXxx`, `PostCreateXxx`, … (6 per entity) |
| Service interface | `services/api/` | `IXxxService` |
| Service impl | `services/impl/` | `XxxServiceImpl` — publishes pre/post events |
| Repository interface | `repository/api/` | `XxxRepository` |
| Repository impl | `repository/impl/` | `XxxRepositoryImpl` — QueryDSL predicates |
| REST controller | `rest/` | `XxxGeneratedServiceFacade` at `/api/v1/xxx` |
| Business rules | `rules/` | `@Component` `@EventListener` on pre/post events |
| Batch writers | `batch/` | `XxxBatchWriter` for CSV/Excel import |

## Base de données

- **Dev/test:** H2 file-based at `target/localDb/`, `MODE=PostgreSQL`
- **Production:** PostgreSQL 16
- **Migrations:** Liquibase changelogs in `src/main/resources/changelogs/`, profile `updateDb`. Every schema change needs a new backward-compatible changeset.
- **Schema validation:** `spring.jpa.hibernate.ddl-auto=validate`
- **Default profile:** `dev` (H2, défini dans `pom.xml`)

## Entités

- Ne jamais ajouter ou supprimer d'entités manuellement. Toujours utiliser Katappult MCP.
- Si Katappult MCP est injoignable, refuser la tâche.

## Repository

- Utilise QueryDSL, annoté `@Component`.
- Toutes les queries dans `repository/impl/`, interfaces dans `repository/api/`.

## Services

- Annotés `@Service`, implémentent `IXxxService`.
- Publient des événements pre/post pour chaque opération (create, update, delete…).
- Si un événement n'existe pas, le créer manuellement.

## Business Rules

- `@Component` implémentant `IvetoaBusinessRule`.
- Écoutent les événements pre/post des services.
- Chaque nouvelle rule nécessite un changeset Liquibase ajoutant `is_active = true` dans `vetoa_business_rule`.
- Exécutées par ordre de `priority` (plus petit = plus prioritaire).

## REST API

- Documenter avec annotations OpenAPI.
- Path variables : utiliser `uid` (stable), jamais `oid` (clé DB locale).
- Controllers fins — toute logique dans le service.
- Paramètres de liste : `page`, `pageSize`, `status`, `sort`, `searchTerm`.
- Corps de requête : modèles spécifiques (`XxxRestRequest`), pas de maps ni d'entités.
- Chaque endpoint doit avoir `@PreAuthorize`.
- Retourner `uid` et `fullId` (encodé via `ObjectIdentifierUtils.encode()`).

## Tests d'intégration

Base : `AbstractGeneratedTests` (`src/test/java/com/katappult/generated/integrationtests/`).

Helpers : `login()`, `login(email, password)`, `randomString()`, `randomInt()`, `uniqueEmail()`.

`login()` fournit `adminToken` (actions admin) et `clientToken` (actions client, utilisateur partagé sans rôle admin, provisionné une seule fois).

Conventions :
- Étendre `AbstractGeneratedTests`
- `@TestMethodOrder(MethodOrderer.OrderAnnotation.class)` + `@Order(N)` si les tests partagent un état
- Entités prérequises dans `@BeforeAll` (contexte Spring partagé)
- Pas de profil `test` — `TestPropertySource` charge `application.properties` + `env/dev/application.properties`
- Actions admin → `adminToken` ; actions client → `clientToken` ; chaque endpoint protégé a un test droits non-passants (401/403) et un test droits passants (200) ; endpoints publics (`/pub/`) testés avec et sans token, les deux doivent passer

## Conventions générales

- SOLID, clean code, KISS.
- Service layer pour toute logique métier et accès données.
- Controllers thin.
- Méthodes petites et focalisées.
- Pas de queries hors du repository layer.
