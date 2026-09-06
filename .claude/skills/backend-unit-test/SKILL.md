---
name: backend-unit-test
description: Writes or modifies Spring Boot backend unit tests (JUnit 5 + Mockito, no Spring context). Triggered when the user wants to test a business rule (rules/), a custom service (services/impl/), or a plain utility class in isolation.
---

# Skill: backend-unit-test

Used when the user asks to write or modify a **unit** test for backend Java code: business rules (`rules/`), custom services (`services/impl/`), or utility classes (`utils/`). No Spring context, no H2 — pure JUnit 5 + Mockito, fast.

For a custom DAO (anything calling `IPersistableRepository.jpaQuery()`/`selectFrom()`), a REST facade, or any multi-step scenario that genuinely needs a database, use `backend-integration-test` instead — see "Never unit-test QueryDSL" below for why.

## Maven Commands

```bash
mvn test                                          # whole suite
mvn test -Dtest=BlockAccountCreationTest           # one class
mvn test -Dtest=ClassA,ClassB,ClassC               # several classes
```

## File Location & Naming

Mirror the source package exactly, suffix `Test` (not `IT`, not `_unit_Tests` — plain `Test` matches Surefire's default include pattern and is the convention used across `rules/` and `services/impl/`):

```
src/main/java/com/katappult/cloud/platform/rules/account/BlockAccountCreation.java
src/test/java/com/katappult/cloud/platform/rules/account/BlockAccountCreationTest.java
```

Class and method style: package-private test class (no `public`), JUnit 5 (`org.junit.jupiter.api.Test`), descriptive camelCase method names with no `test` prefix (e.g. `throwsWhenPipelineHasNoPlanner`, not `testThrows`).

## Testing a Business Rule (`rules/`)

Rules implement `IVetoableBusinessRule` or `INonVetoableBusinessRule` — one method, `void apply(KatappultEvent event)`. They're `@Component` (sometimes with an explicit bean name), `@RequiredArgsConstructor`-injected with custom services/DAOs or `KatappultCoreServicesHelper`.

```java
class BlockAccountCreationTest {

    @Test
    void doesNothingByDefault() {
        BlockAccountCreation rule = new BlockAccountCreation();
        KatappultEvent event = mock(KatappultEvent.class);
        assertDoesNotThrow(() -> rule.apply(event));
    }
}
```

- Instantiate the rule directly with mocked constructor args — never `@SpringBootTest`.
- Mock `KatappultEvent`, stub `getSubject()` (cast to the real entity type) and `getAdditionnalAttribute("key")` (returns `Optional`) as needed.
- If the rule reaches into `KatappultCoreServicesHelper`, mock the helper itself, then stub the specific sub-service accessor it calls (e.g. `when(services.userGroupService()).thenReturn(mockGroupService)`).
- `TenantContext` is a thread-local (`com.katappult.cloud.platform.tenant.TenantContext`) — `set(tenant)` in the test, `clear()` in an `@AfterEach` so it never leaks into the next test.
- Cover: the nominal path, the "related entity missing" / no-op path, and — for `IVetoableBusinessRule` — the exception path (right exception type, and whether it's the code's own `BusinessRuleException`/`ServicesException` or an unwrapped exception; check exactly which lines are inside a `try/catch` in the rule before asserting a wrap — a call made *before* the `try` block propagates raw).

## Testing a Custom Service (`services/impl/`)

Services are `@Service`/`@Component` `@RequiredArgsConstructor`, injected with custom DAOs (`dao.api`) and other services. Instantiate directly: `new ServiceImpl(mockDao1, mockDao2, ...)`.

```java
@ExtendWith(MockitoExtension.class)
class StructuralQuotaServiceTest {

    @Mock private ICustomLicenseDao customLicenseDao;
    @Mock private ICustomProjectDao customProjectDao;

    private StructuralQuotaService newService() {
        return new StructuralQuotaService(customLicenseDao, customProjectDao);
    }

    @Test
    void throwsWhenAtLimit() { ... }
}
```

Cover: nominal behavior, null/absent-limit no-ops, the exception path when a limit is exceeded, and (for methods that orchestrate several collaborators without a return value) `verify()` the interactions rather than asserting on internal state you can't observe.

## Never Unit-Test QueryDSL Fluent Chains

If a class calls `dao.jpaQuery().select(...).from(...).where(...).orderBy(...).fetch()` (or `dao.selectFrom(...)`), don't try to mock that chain with Mockito — put the test in `backend-integration-test` against real H2 instead. Two concrete failure modes if you try anyway:

1. **Ambiguous overload at compile time.** `any()` passed as the *sole* argument to a method overloaded as `foo(T)` / `foo(T...)` — which is exactly QueryDSL's `where(Predicate)`/`where(Predicate...)`, `orderBy(OrderSpecifier<?>)`/`orderBy(OrderSpecifier<?>...)`, `select(Expression<T>)`/`select(Expression<?>...)`, and also katappult-core's `mergeWithoutEvent(T)`/`mergeWithoutEvent(T...)`, `saveWithoutEvent`, `deleteWithoutEvent` — javac reports `reference to X is ambiguous`. `any()`'s return type is an unconstrained type variable, and it can be inferred as *either* `Predicate` or `Predicate[]`, so both overloads become simultaneously applicable. **Fix**: give it an explicit type witness — `any(Predicate.class)` instead of bare `any()`. This resolves the overload to the non-varargs form unambiguously. (A concrete, already-typed argument like a real `BooleanExpression` never hits this — only a bare `any()`/`eq(null)`-style matcher does.)
2. **Raw-type generic mismatch.** `mock(JPAQuery.class)` returns the *raw* `JPAQuery` (a generic class literal like `JPAQuery.class` has type `Class<JPAQuery>`, not `Class<JPAQuery<T>>`). If you then declare the receiving variable as `JPAQuery<Object>` and later `when(query.fetch()).thenReturn(someTypedList)`, you get a genuine generic type mismatch (`List<X> cannot be converted to List<Object>`). Fix: declare the variable with the *actual* entity type the query returns (`JPAQuery<DataModel>`, matching `dao.selectFrom(QDataModel.dataModel)`'s real return type), not `Object`.

Even with both fixed, a QueryDSL unit test asserts nothing about whether the `where` clause is *correct* — it only proves your stub returns what you told it to. That's the real reason this belongs in `backend-integration-test`: the interesting bug (a missing/wrong filter) only shows up against real data.

## Mockito Traps Specific to This Codebase

- **Overlapping stubs via unset `oid`.** A freshly `new`'d generated entity (`new StepExecution()`, `new PipelineRun()`, …) has `getOid() == null` until persisted. If a test stubs two different calls keyed by `eq(entityA.getOid())` and `eq(entityB.getOid())` without explicitly setting distinct oids first, **both stubs collapse to `eq(null)`** — Mockito applies the *last*-registered matching stub to *every* matching call, silently feeding the wrong return value into an earlier step of the scenario. Always `entity.setOid(<distinct literal>)` before using `getOid()` as a Mockito matcher key in a multi-step scenario.
- **Value-equal fresh entities in `verify()`.** Two freshly-`new`'d instances of the same generated entity can be `.equals()`-equal to each other (equality based on a null identifier) even though they're different objects. `verify(mock).someMethod(tab1, ...)` can then match an invocation that actually received `tab2`, and a `times(1)` verification silently passes when it shouldn't (or fails confusingly claiming N calls matched when you expected 1). If you need to assert *which specific instance* was passed, use `org.mockito.ArgumentMatchers.same(...)`, not the default equals-based matching.
- **Generated `Ixxx.create(UIAttributes)` mocks must return the UIAttributes' own target.** The real generated `create()` implementations pull the entity to persist from `uiAttributes.getTarget()` (set via `uiAttributes.form(entity)` in the code under test) and return that *same instance*. If your test stubs `when(xService.create(any())).thenReturn(new Entity())`, the returned object is a **different, blank** instance — any assertion on fields the code-under-test set on its local variable *before* calling `create()` will fail (`expected X but was null`). Stub it as an `Answer` instead:
  ```java
  when(xService.create(any())).thenAnswer(invocation ->
          ((UIAttributes) invocation.getArgument(0)).getTarget());
  ```
- **`org.apache.commons.lang(3).StringUtils.isEmpty(...)` only guards `null`/`""`.** It does **not** treat `"  "` (whitespace-only) as empty — that's `isBlank()`. If the code under test guards with `isEmpty`, a test asserting a `"  "` input throws a validation exception will fail with an unrelated `NullPointerException` further down instead (the guard let it through). Check which one the code actually calls before picking your "blank" test input.

## Checklist

- [ ] File mirrors the source package under `src/test/java`, suffix `Test`
- [ ] No `@SpringBootTest` — plain `new X(mocks...)` or `@ExtendWith(MockitoExtension.class)`
- [ ] `TenantContext.clear()` in `@AfterEach` if the test called `TenantContext.set(...)`
- [ ] No bare `any()` feeding a `foo(T)`/`foo(T...)`-overloaded call (QueryDSL, `mergeWithoutEvent`, `saveWithoutEvent`, `deleteWithoutEvent`) — use `any(Class.class)`
- [ ] No QueryDSL fluent-chain mocking — that logic belongs in `backend-integration-test`
- [ ] Distinct `setOid(...)` on every fixture entity used as a Mockito matcher key when more than one exists in the same test
- [ ] `create(UIAttributes)` mocks return the UIAttributes' target, not a fresh unrelated instance
- [ ] Covers: nominal path, no-op/absent-data path, and the exception path (with the *actual* exception type the code under test throws)
