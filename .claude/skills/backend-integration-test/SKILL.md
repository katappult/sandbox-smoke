---
name: backend-integration-test
description: Writes or modifies Spring Boot backend integration tests. Triggered when the user wants to test a REST API, a custom DAO (QueryDSL), a service, or an end-to-end business scenario using H2 in-memory database.
---

# Skill: backend-integration-test

Used when the user asks to write or modify backend integration tests — REST endpoints, custom DAOs (QueryDSL), or multi-step business scenarios that need a real Spring context + H2 database.

For a pure unit test with no Spring context (business rule, service with mockable collaborators), use `backend-unit-test` instead. A custom DAO built on QueryDSL's fluent `jpaQuery()`/`selectFrom()` chain must **always** be tested here, never mocked — see "Custom DAO tests" below.

## Maven Commands

```bash
# Run the whole suite (TU + TI both run under Surefire — Failsafe is declared in the parent
# pom's <properties> but never bound to a <plugins> execution, so `mvn verify -Dit.test=...`
# does NOT work; everything runs via `mvn test`)
mvn test

# Run one class
mvn test -Dtest=CustomLicenseDaoIntegrationTests

# Run one method
mvn test -Dtest=CustomLicenseDaoIntegrationTests#findLatestByTenantReturnsDefaultLicenseThenTheNewestOneAdded

# Run several classes at once (comma-separated, no spaces)
mvn test -Dtest=ClassA,ClassB,ClassC
```

## Base Class

Always extend `AbstractGeneratedTests` (`src/test/java/com/katappult/generated/integrationtests/AbstractGeneratedTests.java`):
- `@SpringBootTest(webEnvironment = RANDOM_PORT)` + `@AutoConfigureMockMvc` + `@TestInstance(PER_CLASS)`
- Loads `classpath:/application.properties` + `classpath:/env/test/application.properties` (H2, `MODE=PostgreSQL`, `ddl-auto=validate` — schema comes from Liquibase, not Hibernate)
- **The Spring context, and therefore the H2 database, is shared across the ENTIRE test run** — not just within one class, across *every* test class in the module. Data from other classes' tests can and will still be there. Never assert an absolute baseline count (e.g. "0 working copies exist"); measure a delta (`before`/`after`) around the action under test instead.

## Available Helpers

| Method | Description |
|---|---|
| `login()` | Authenticates as admin (`adminToken`) **and** provisions/logs in the shared non-admin client user (`clientToken`). Override it, annotate the override `@BeforeAll`, and call `super.login()` first. |
| `login(email, password)` | Returns raw JWT string (no `Bearer ` prefix — pass directly to `Authorization` header) |
| `adminToken` | JWT of the admin user (`admin@nexitia.com` / ROLE_SUPERADMIN) — use for every **admin** action |
| `clientToken` | JWT of a shared, fixed non-admin user (`CLIENT_USERNAME`, no roles) — use for every **client** action. Created once by `login()` and reused across all test classes; never recreate it in a test class. |
| `registerUser(email)` | Registers a brand-new user (no roles) — use with `uniqueEmail()` only when a test needs a *dedicated* user (e.g. to grant it a specific role), not for generic client calls |
| `getAccountId(email)` | Returns the account id of a registered user (needed to assign a role via `ROLES_URL`) |
| `randomString()` | Generates a random string |
| `randomInt()` | Generates a random integer |
| `uniqueEmail()` | Generates a unique email address |
| `grantPermissionsAndRelogin(email, password, accountUid, permKeys...)` | Grants exactly the given permission keys to an account via a fresh ad-hoc group, then re-logs in. Use instead of relying on the default "user" group — it already carries broad permissions via seed data, asynchronously, which is racy to assert against. |
| `stripDefaultGroupPermissions(accountUid)` | Waits for (then reverses) the async default-group assignment every account gets at signup, so a "this account has no authority" test isn't racy. Call **before** the final `login()` used for assertions. |
| `resolveTenant(accountUid)` | `@Transactional` — returns the `Tenant` auto-created for that account (`PostCreateAccountCreateTenantRule`). |
| `mutateLicense(accountUid, Consumer<License>)` | `@Transactional` — mutates and persists the tenant's current `License` (auto-created by `PostCreateTenantDefaultLicenseRule`), e.g. to set a quota for a test. |

## Which User/Token to Use

- **Admin actions** (endpoints requiring `ROLE_SUPERADMIN` / `ROLE_ADMIN` or an `ADMIN_ENTITY_*` authority): use `adminToken`.
- **Client actions** (any endpoint a plain authenticated user should be able to reach): use `clientToken`. Do **not** call `registerUser` + `login` again for this — `clientToken` is already provisioned by `login()` in `AbstractGeneratedTests` and shared by the whole suite.
- **Fine-grained role test** (an endpoint that requires a *specific* non-admin role/authority, e.g. `ROLE_READER`): create a dedicated user with `registerUser(uniqueEmail())`, fetch its account id with `getAccountId(...)`, assign the role via `POST {ROLES_URL}/{roleId}/members/{accountId}` (with `adminToken`), then re-`login(...)` to get a token with the role baked into the JWT. Keep this local to the test class — don't touch the shared `clientToken`.

## Security: Denied vs. Passing Tests

Every protected endpoint (generated or custom) must have **both**:
- At least one **denied** ("droits non passants") test: no `Authorization` header → `status().isUnauthorized()`, or a token without the required role/authority → `status().isForbidden()`.
- At least one **passing** ("droits passants") test: `adminToken` (for admin endpoints) or `clientToken` / a role-specific token (for client endpoints) → `status().isOk()`.

This applies to **every new custom endpoint** added to the backend — no endpoint ships without both a denied-access test and a passing-access test.

## Public Endpoints (`/pub/`)

Endpoints under `/api/pub/v1/...` (or `/core/api/pub/v1/...`) must never require authentication. Test them **twice**, and both must pass:
- Without any `Authorization` header → `status().isOk()`.
- With a valid `Authorization` header (`adminToken` or `clientToken`) → also `status().isOk()` (an authenticated caller must not be rejected either).

## Custom DAO Tests (QueryDSL)

Custom DAOs (`dao/impl/*.java`) built on `IPersistableRepository.jpaQuery()`/`selectFrom()` **cannot be reliably unit-tested with Mockito** — the fluent QueryDSL chain (`.select().from().where().orderBy().fetch()`) is inherently self-bound generic and mocking it hits real compile-time ambiguity between `where(Predicate)`/`where(Predicate...)`-style overloads (see `backend-unit-test` for the full explanation). Test them here instead, against real H2 data:

- File location convention: `src/test/java/com/katappult/generated/integrationtests/<DaoName>IntegrationTests.java` (package `com.katappult.generated.integrationtests`, **not** mirroring `dao.impl`'s package — this differs from unit tests, which do mirror the source package).
- `@TestInstance(PER_CLASS)`, extends `AbstractGeneratedTests`, `@Autowired` the DAO's interface (`dao.api`) plus whatever generated services are needed to build fixtures.
- **The one thing that actually matters**: prove the query's `where`/join scopes correctly — create at least two of the entity (or two under different tenants/parents/owners) and assert the DAO returns only the right one(s), not the whole table. A DAO that forgets a `where` clause and returns every row is the exact bug class this style of test exists to catch (see `PipelineExecutionGraphDaoIntegrationTests` for the canonical example — it documents the specific historical bug in its class-level Javadoc).
- Use unique data (`randomString()`/`uniqueEmail()`) for everything you create — the H2 context is shared across the whole test run (see above), so collisions with other tests' data are a real risk, not a theoretical one.
- **Lazy relations**: a custom DAO that doesn't explicitly `fetchJoin` a relation (most don't — that's deliberate; see the project's dao-fetchJoin convention) returns entities where that relation is a Hibernate proxy. By the time your `@Test` method runs its assertions, the DAO's own session is already closed, so calling `.getSomeRelation().getUid()` throws `LazyInitializationException: ... no session`. Don't dereference a relation the DAO didn't fetch-join — compare scalar fields (`uid`, oid) on the entities you already hold instead.

## REST Request Gotchas (learned the hard way)

- `AbstractRestRequest` (base of every generated `*RestRequest`) has explicit `containerId`/`businessType` fields **and** a separate generic `params` map (`getParams()`/`addParam(...)`). Putting a key into `params` does **not** automatically populate an entity attribute of the same name unless that specific `*RestRequest` DTO declares it as a real field — check the generated DTO's fields before assuming `request.getParams().put("nom", ...)` will set `ProjectMaster.nom`. When the create DTO doesn't expose the field you need, set it via a dedicated PATCH/update endpoint instead (e.g. `PATCH /api/v1/project/{id}` → `CustomProjectService.rename()` sets `nom`).
- Some entities' `/create` endpoint immediately opens a working copy alongside publishing the first iteration — the uid your test gets back from `/create` may be the **working copy**, a different `Project`/`Persistable` row than the "published, non-working-copy, latest iteration" row a DAO method like `getLatestProjectIterationByInternalId` looks for. Don't assume "the uid `/create` returned" and "the latest published iteration" are the same row — verify with `getWorkInfo().isWorkingCopy()` on what you got back before writing an assertion that depends on which one it is.
- When debugging an unexpected 4xx from `mockMvc.perform(...)`, temporarily add `.andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())` before `.andExpect(...)` to see the actual response body (the assertion failure message alone only shows the status code mismatch, not why). Remove it once diagnosed — don't leave `print()` in committed tests.

## Test Class Conventions

```java
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class MyEntityIT extends AbstractGeneratedTests {

    private static String createdEntityUid;

    @Override
    @BeforeAll
    void login() throws Exception {
        super.login(); // provisions adminToken + clientToken
        // Create prerequisite entities here (once — Spring context is shared)
    }

    @Test
    @Order(1)
    void createEntity_withoutAuth_returns401() { ... } // denied

    @Test
    @Order(2)
    void createEntity_withAdmin_isAllowed() { ... } // passing, uses adminToken

    @Test
    @Order(3)
    void updateEntity() { ... } // uses createdEntityUid from previous test
}
```

- Use `@TestMethodOrder(MethodOrderer.OrderAnnotation.class)` + `@Order(N)` when tests share state (created entity UIDs)
- Create prerequisite entities in `@BeforeAll` (not `@BeforeEach`) — the Spring context is shared
- Created entity UIDs must be stored in `static` fields

## Important Rules

- Always use `uid` in URLs, never `oid` (`uid` is stable across environments)
- Check `responseSuccess(res)` after every HTTP call (axios never throws on 4xx/5xx)
- The test environment uses H2 in `MODE=PostgreSQL`

## Checklist

- [ ] Class extends `AbstractGeneratedTests`
- [ ] `@TestMethodOrder` + `@Order` if tests share state
- [ ] Prerequisites created in `@BeforeAll`
- [ ] UIDs stored as `static` fields between tests
- [ ] URLs use `uid`, not `oid`
- [ ] Admin actions use `adminToken`, client actions use `clientToken`
- [ ] Each protected endpoint has at least one denied test (401/403) and one passing test (200)
- [ ] Each public (`/pub/`) endpoint is tested with and without a token, both passing (200)
- [ ] Custom DAO tests assert actual scoping (two+ entities, only the right one(s) returned) — not just "it doesn't crash"
- [ ] No absolute-baseline assertions against shared global counts — use before/after deltas
- [ ] No dereferencing of relations the DAO under test didn't fetch-join
