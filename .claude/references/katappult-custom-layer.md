# Katappult Custom Layer — Generic Patterns

Reference for implementing the custom layer on any Katappult-generated project.
The generated code (`**/generated/**`) must never be modified. All business logic lives in the custom layer.

---

## Architecture overview

```
generated/                     ← Katappult-managed (never touch)
  services/api/IXxxService      ← Generated service interface
  services/impl/XxxServiceImpl  ← Generated implementation (publishes events)
  repository/api/XxxRepository  ← Generated repository interface
  repository/impl/XxxRepositoryImpl ← Generated QueryDSL impl
  rest/XxxGeneratedServiceFacade ← Generated CRUD controller
  model/event/Pre|PostXxx       ← Pre/post events for each operation

custom/   (or directly in the project package)
  services/custom/CustomXxxService.java  ← Custom business logic
  rest/CustomXxxServiceFacade.java       ← Custom REST endpoints
  dao/impl/CustomXxxRepositoryImpl.java  ← Custom queries (if needed)
  rules/XxxBusinessRule.java             ← Event-driven business rules
```

---

## Pattern 1 — Custom Service

Use when: adding business logic that doesn't fit in the generated service.

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomXxxService {

    private final XxxRepository xxxRepository;
    // inject other repositories or generated services as needed

    public XxxDto findByUid(String uid) {
        return xxxRepository.findByUid(uid)
            .map(this::toDto)
            .orElseThrow(() -> new EntityNotFoundException("Xxx not found: " + uid));
    }

    public Page<XxxDto> findByFilter(XxxFilter filter, Pageable pageable) {
        return xxxRepository.findAll(buildPredicate(filter), pageable)
            .map(this::toDto);
    }

    @Transactional
    public XxxDto update(String uid, UpdateXxxRequest request) {
        Xxx entity = xxxRepository.findByUid(uid)
            .orElseThrow(() -> new EntityNotFoundException("Xxx not found: " + uid));
        // apply changes to entity fields
        return toDto(xxxRepository.save(entity));
    }

    private XxxDto toDto(Xxx entity) {
        // map entity fields to DTO
        return null;
    }
}
```

Rules:
- `@Transactional(readOnly = true)` on class, `@Transactional` on write methods
- Throw `EntityNotFoundException` for missing entities (never return null)
- `@Slf4j` for logging; use `log.debug()` for tracing, `log.error()` for failures
- Inject `@RequiredArgsConstructor` — never `@Autowired` field injection

---

## Pattern 2 — Custom REST Facade

Use when: adding endpoints not covered by the generated `XxxGeneratedServiceFacade`.

```java
@RestController
@RequestMapping("/api/v1/xxx")
@RequiredArgsConstructor
@Tag(name = "Xxx", description = "Custom Xxx endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CustomXxxServiceFacade {

    private final CustomXxxService customXxxService;

    @GetMapping("/{uid}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get Xxx by uid")
    @ApiResponse(responseCode = "200", description = "OK")
    @ApiResponse(responseCode = "404", description = "Not found")
    public ResponseEntity<XxxDto> getXxx(@PathVariable String uid) {
        return ResponseEntity.ok(customXxxService.findByUid(uid));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "List Xxx with filters")
    public ResponseEntity<Page<XxxDto>> listXxx(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String status) {
        // build filter and call service
        return ResponseEntity.ok(customXxxService.findByFilter(/* filter */, PageRequest.of(page, pageSize)));
    }

    @PutMapping("/{uid}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Xxx")
    @ApiResponse(responseCode = "200", description = "Updated")
    @ApiResponse(responseCode = "404", description = "Not found")
    public ResponseEntity<XxxDto> updateXxx(@PathVariable String uid,
                                             @RequestBody @Valid UpdateXxxRequest request) {
        return ResponseEntity.ok(customXxxService.update(uid, request));
    }
}
```

Rules:
- Path param: always `uid` (stable across environments). Never `oid` (DB key) or `fullId` in path.
- `@PreAuthorize` required on **every** endpoint
- `@Operation` + `@ApiResponse` required on **every** endpoint
- No business logic in the controller — delegate entirely to the service
- `fullId` is available in responses via `ObjectIdentifierUtils.encode()` when needed

---

## Pattern 3 — Custom Repository (QueryDSL)

Use when: the generated repository doesn't expose a query the custom service needs.

```java
// Interface
public interface CustomXxxRepository {
    List<Xxx> findByCustomCriteria(String param1, LocalDate from, LocalDate to);
}

// Implementation
@Component
@RequiredArgsConstructor
public class CustomXxxRepositoryImpl implements CustomXxxRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Xxx> findByCustomCriteria(String param1, LocalDate from, LocalDate to) {
        QXxx xxx = QXxx.xxx;
        return queryFactory.selectFrom(xxx)
            .where(
                xxx.field1.eq(param1),
                xxx.createdAt.between(from.atStartOfDay(), to.plusDays(1).atStartOfDay())
            )
            .orderBy(xxx.createdAt.desc())
            .fetch();
    }
}
```

Rules:
- Always use QueryDSL `Q`-classes, never raw JPQL or native SQL
- All custom queries in `repository/impl/` — never in services or controllers
- Annotate with `@Component`

---

## Pattern 4 — Business Rule (Vetoable)

Use when: blocking an operation if a condition is not met.

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class CheckXxxUnicityRule implements IVetoableBusinessRule {

    private static final String RULE_CODE = "CHECK_XXX_UNICITY";
    private static final int PRIORITY = 10;

    private final XxxRepository xxxRepository;
    private final BusinessRuleRepository businessRuleRepository;

    @EventListener
    public void onPreCreate(PreCreateXxx event) {
        if (!isActive()) return;
        XxxDto dto = event.getDto();
        if (xxxRepository.existsByName(dto.getName())) {
            throw new BusinessRuleViolationException("Xxx with name '" + dto.getName() + "' already exists");
        }
    }

    private boolean isActive() {
        return businessRuleRepository.findByCode(RULE_CODE)
            .map(BusinessRule::isActive)
            .orElse(false);
    }
}
```

Liquibase changeset required:
```xml
<changeSet id="YYYYMMDD-add-check-xxx-unicity-rule" author="{author}">
    <insert tableName="vetoa_business_rule">
        <column name="code" value="CHECK_XXX_UNICITY"/>
        <column name="label" value="Check Xxx name unicity"/>
        <column name="priority" value="10"/>
        <column name="is_active" value="true"/>
    </insert>
</changeSet>
```

---

## Pattern 5 — Business Rule (Non-Vetoable)

Use when: reacting to an event without blocking it (notifications, emails, audits).

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class NotifyOnXxxCreatedRule implements INonVetoableBusinessRule {

    private final NotificationService notificationService;

    @EventListener
    public void onPostCreate(PostCreateXxx event) {
        XxxDto dto = event.getDto();
        log.debug("Sending notification for new Xxx: {}", dto.getUid());
        notificationService.send(/* notification data */);
    }
}
```

---

## uid / oid / fullId reference

| Field | Type | Use |
|---|---|---|
| `uid` | UUID string | Path params in REST. Stable across dev/staging/prod. |
| `oid` | Long | Internal DB primary key. Never expose in API. |
| `fullId` | Encoded string | Required by katappult-core API. Encoded via `ObjectIdentifierUtils.encode(oid, entityCode)`. |

```java
// Encode fullId from oid
String fullId = ObjectIdentifierUtils.encode(entity.getOid(), "XXX");

// Decode fullId to oid
long oid = ObjectIdentifierUtils.decode(fullId).getOid();
```

---

## Event reference

Each generated entity exposes 6 events:

| Event class | When fired |
|---|---|
| `PreCreateXxx` | Before entity creation (vetoable) |
| `PostCreateXxx` | After entity creation |
| `PreUpdateXxx` | Before entity update (vetoable) |
| `PostUpdateXxx` | After entity update |
| `PreDeleteXxx` | Before entity deletion (vetoable) |
| `PostDeleteXxx` | After entity deletion |

If an operation requires a custom event not in the generated set, create it manually under `model/event/`.

---

## Pattern 6 — Cron jobs (scheduled tasks)

Use when: a recurring background task is needed (publish/unpublish, reminders, rate updates, cleanup).

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class PublishScheduledXxx {

    private final CustomXxxService customXxxService;

    @Scheduled(cron = "0 0 * * * *")       // every hour — standard cron expression
    // @Scheduled(fixedDelay = 3_600_000)  // alternative: fixed delay in ms
    public void run() {
        log.info("Running scheduled publish for Xxx...");
        customXxxService.publishPending();  // always delegate to a service
    }
}
```

- Annotate with `@Component` — Spring manages lifecycle
- Keep the method body minimal: log + delegate, nothing else
- Use `@Scheduled(cron = "...")` for calendar-based triggers, `@Scheduled(fixedDelay = ...)` for interval-based
- Place in `cron/` package

---

## Pattern 7 — Data Loaders (reference/initial data)

Use when: populating reference data (regions, categories, statuses) that must exist before the app is usable.

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class RegionsLoader implements ApplicationListener<ApplicationReadyEvent> {

    private final RegionRepository regionRepository;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (regionRepository.count() > 0) {
            log.debug("Regions already loaded — skipping");
            return;  // idempotent guard — never insert twice
        }
        log.info("Loading reference regions...");
        // load from classpath JSON/CSV resource or hardcoded list
        regionRepository.saveAll(buildRegions());
    }
}
```

- Implement `ApplicationListener<ApplicationReadyEvent>` — fires after Spring context is ready
- **Idempotent guard is mandatory** — the loader must be safe to call multiple times
- Place in `loaders/` package

---

## Pattern 8 — External API Facades

Use when: integrating a third-party API (AI, media, storage, payment) that the frontend or other services consume via REST.

```java
@RestController
@RequestMapping("/api/v1/openai")
@RequiredArgsConstructor
@Tag(name = "OpenAI", description = "AI content generation")
@SecurityRequirement(name = "bearerAuth")
public class OpenAiServiceFacade extends BaseKatappultRestService {

    private final CustomOpenAIService customOpenAIService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Generate content via OpenAI")
    @ApiResponse(responseCode = "200", description = "Generated content")
    public ResponseEntity<String> generate(@Valid @RequestBody GenerateRequest request) {
        return ResponseEntity.ok(customOpenAIService.generate(request.getPrompt()));
    }
}
```

- Treat it as a regular secured facade: `@PreAuthorize`, `@Operation`, `BaseKatappultRestService`
- The actual API call lives in a dedicated `Custom{Api}Service` — never inline it in the facade
- If the external API does not require authentication from users, place under `/api/pub/v1/`

---

## Pattern 9 — Aggregated responses and CustomServicesHelper

Use when: an endpoint needs to return data from multiple entities in a single response (e.g., product detail with category, seller, images).

### Step 1 — Custom response DTO

Create a typed response class that combines fields from several entities. Never return raw entities or generated DTOs when the caller needs cross-entity data.

```java
// model/rest/ProduitDetailResponse.java  (adapt names to the project)
@Data
@Builder
public class ProduitDetailResponse {
    private String uid;
    private String nom;
    private String description;
    // embedded summaries from related entities
    private CategorieSummary categorie;
    private VendeurSummary vendeur;
    private List<ImageSummary> images;
}

// Nested summary — only expose what the caller needs
@Data
@Builder
public class CategorieSummary {
    private String uid;
    private String nom;
}
```

### Step 2 — CustomServicesHelper

Create a `CustomServicesHelper` component to centralise cross-entity fetching. Multiple services inject it instead of each reimplementing the same lookups.

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class CustomServicesHelper {

    private final CategorieRepository categorieRepository;
    private final VendeurRepository vendeurRepository;
    // add other repositories as the project grows

    public Categorie getCategorieByUid(String uid) {
        return categorieRepository.findByUid(uid)
            .orElseThrow(() -> new EntityNotFoundException("Categorie not found: " + uid));
    }

    public Optional<Categorie> findCategorieByUid(String uid) {
        return categorieRepository.findByUid(uid);
    }

    public Vendeur getVendeurByUid(String uid) {
        return vendeurRepository.findByUid(uid)
            .orElseThrow(() -> new EntityNotFoundException("Vendeur not found: " + uid));
    }
}
```

Rules:
- One `CustomServicesHelper` per project (not one per entity)
- Only add methods that are reused across ≥2 services — single-use lookups stay in the service
- `getXxx` throws `EntityNotFoundException`, `findXxx` returns `Optional`
- No business logic here — only data access

### Step 3 — Service uses the helper for aggregation

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomProduitService {

    private final ProduitRepository produitRepository;
    private final CustomServicesHelper helper;

    public ProduitDetailResponse getDetail(String uid) {
        Produit produit = produitRepository.findByUid(uid)
            .orElseThrow(() -> new EntityNotFoundException("Produit not found: " + uid));

        return ProduitDetailResponse.builder()
            .uid(produit.getUid())
            .nom(produit.getNom())
            .description(produit.getDescription())
            .categorie(toCategorieSummary(helper.getCategorieByUid(produit.getCategorieUid())))
            .vendeur(toVendeurSummary(helper.getVendeurByUid(produit.getVendeurUid())))
            .build();
    }

    private CategorieSummary toCategorieSummary(Categorie c) {
        return CategorieSummary.builder().uid(c.getUid()).nom(c.getNom()).build();
    }
}
```

### When to create a custom response vs reuse the generated DTO

| Situation | Use |
|-----------|-----|
| Simple CRUD on a single entity | Generated DTO — no custom response needed |
| Response needs fields from ≥2 entities | Custom `XxxDetailResponse` |
| List endpoint needs a lightweight projection | Custom `XxxListItem` (avoid loading full graph) |
| Response shape differs between admin/client | One response class per context |

---

## katappult-core available services

Before writing custom logic, check `.claude/references/katappult-core-api-catalog.md`.

Already available via the `katappult-core` dependency:
- Authentication / JWT
- User management (create, update, roles, permissions)
- Notifications (in-app + Firebase push)
- Media library / thumbnails
- Content holders (file attachments)
- Contacts (postal, telecom, web)
- User and system preferences
- Email dispatch
- Lifecycle state management
- Batch import/export (CSV/Excel)
