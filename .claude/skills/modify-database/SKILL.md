---
name: modify-database
description: Modifies the database schema via Liquibase and Katappult MCP. Triggered when the user wants to add tables, columns, indexes, or constraints, or generate/modify entities through the Katappult MCP.
---

# Skill: modify-database

Used when the user asks to modify the database schema (add/modify tables, columns, indexes, constraints).

## Critical Rule: Use Katappult MCP

**Never add or remove entities manually.**

Always use **Katappult MCP** to generate or modify entities — it automatically creates Liquibase changelogs and keeps the code and database in sync.

If Katappult MCP is not reachable: **refuse the task** and ask for a different task that does not involve entity changes.

## Liquibase

- Changelogs in `src/main/resources/changelogs/`
- Executed via Maven profile `updateDb`
- **Every schema change requires a new backward-compatible changeset** — no destructive changes without a data migration

```bash
# Build + initialize local H2 database (first run or clean schema)
mvn clean install -PdropDb,updateDb -DskipTests

# Build and update DB without dropping (preserve data)
mvn install -PupdateDb -DskipTests
```

## Environments

| Env | Database |
|---|---|
| Dev/test | H2 file-based at `target/localDb/`, `MODE=PostgreSQL` |
| Production | PostgreSQL 16 |

## Schema Validation

`spring.jpa.hibernate.ddl-auto=validate` — Hibernate validates against the schema but never modifies it.

## Changeset Format

```xml
<changeSet id="short-unique-description" author="dev">
    <!-- backward-compatible change -->
    <addColumn tableName="gen_my_entity">
        <column name="my_new_column" type="VARCHAR(255)"/>
    </addColumn>
</changeSet>
```

Changeset ID rules:
- Must be unique across the entire application
- Must be descriptive (e.g. `add-is-active-to-vetoa-business-rule`)

## Checklist

- [ ] Modification done via Katappult MCP (not manually)
- [ ] New changeset created (never modify an existing one)
- [ ] Changeset is backward-compatible (no DROP without migration)
- [ ] Changeset ID is unique and descriptive
- [ ] Tested with `mvn install -PupdateDb -DskipTests`
