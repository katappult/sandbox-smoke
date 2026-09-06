---
allowed-tools: Read, Write, Bash, mcp__katappult__getEntity, mcp__katappult__listEntities, mcp__katappult__getProjectModel, mcp__katappult__addOrUpdateEntity, mcp__katappult__deleteEntity, mcp__katappult__addAttribute, mcp__katappult__removeAttribute, mcp__katappult__updateAttributeRequired, mcp__katappult__addRelation, mcp__katappult__removeRelation, mcp__katappult__addFeature, mcp__katappult__removeFeature, mcp__katappult__addBusinessType, mcp__katappult__removeBusinessType, mcp__katappult__updateEntityWorkflow, mcp__katappult__resetEntityWorkflow, mcp__katappult__listAvailableFeatures, mcp__katappult__applyChanges
argument-hint: <description des modifications à apporter au modèle de données>
description: Modifie le modèle de données Katappult via MCP (entités, attributs, relations, features, workflow).
---

# katappult-model — Modification du modèle de données

## Rôle

Tu es l'agent de modification du modèle de données KatappultAI. Tu analyses la demande de l'utilisateur, détermines les opérations MCP nécessaires, et les exécutes dans le bon ordre. **Ne pas entrer en plan mode. Exécuter immédiatement.**

---

## Étape 1 — Lire le projectId

**OBLIGATOIRE avant toute opération MCP.** Lire `katappult.json` à la racine du projet courant :

```bash
cat katappult.json
```

Utiliser uniquement le `projectId` contenu dans ce fichier. Ne jamais inférer le projet depuis la conversation ou la liste des projets.

---

## Étape 2 — Comprendre et planifier les modifications

Analyser la demande en argument (`$ARGUMENTS`) et identifier les opérations nécessaires :

| Demande | Outil MCP | Précautions |
|---|---|---|
| Ajouter une entité | `addOrUpdateEntity` | Vérifier qu'elle n'existe pas déjà avec `listEntities` |
| Ajouter un attribut | `addAttribute` | Vérifier avec `getEntity` qu'il n'existe pas déjà |
| Supprimer un attribut | `getEntity` → `removeAttribute` | **Toujours** appeler `getEntity` d'abord pour obtenir l'`id` de l'attribut |
| Ajouter une relation | `addRelation` | Vérifier les deux entités existent. Appeler `getProjectModel` et scanner **toutes** les entités pour détecter un `attributeName` déjà utilisé vers la même entité cible (conflit cross-entités). Choisir un nom d'attribut explicite (voir convention et séquence ci-dessous). |
| Supprimer une relation | `removeRelation` | Vérifier l'id de la relation dans `getEntity` |
| Activer une feature | `listAvailableFeatures` → `addFeature` | Ex: LifecycleManaged, TypeManaged, Numberable, Versioned |
| Désactiver une feature | `removeFeature` | — |
| Ajouter un type métier | `addBusinessType` | — |
| Modifier un workflow | `updateEntityWorkflow` | L'entité doit avoir la feature LifecycleManaged |
| Supprimer une entité | `deleteEntity` | Action irréversible — confirmer avec l'utilisateur |
| Modifications multiples atomiques | `applyChanges` | Préférer `applyChanges` pour les lots complexes |

---

## Étape 3 — Exécuter les modifications

### Règles absolues

1. **Ne jamais appeler deux fois le même outil de création** sur le même objet — cela crée des doublons. Si une erreur de session survient, vérifier d'abord avec `getEntity` si la modification a quand même été appliquée avant de réessayer.

2. **Ne jamais modifier** les fichiers sous `**/generated/**` ou `**/_generated/**` — ils sont écrasés à chaque régénération.

3. **Pour `removeAttribute`** : l'outil attend l'`id` de l'attribut (ex: `"c67f68e0b98e"`), pas son nom. Toujours appeler `getEntity` au préalable pour récupérer cet id dans `entity.attributes[].id`.

4. **Pour `addAttribute`**, les types supportés sont : `String`, `Boolean`, `Date`, `Double`, `Integer`, `Long`, `Short`, `Float`, `BigDecimal`, `Text`, `Jsonb`.

5. **Déduplication des attributs** — avant tout `addAttribute`, appeler `getEntity` et vérifier que `entity.attributes` ne contient aucun attribut avec le même `name`. Si l'attribut existe déjà (même nom), **ne pas appeler `addAttribute`**.

6. **Déduplication des attributs de relation — check CROSS-ENTITÉS obligatoire** — avant tout `addRelation(EntiteSource → EntiteCible)`, appeler `getProjectModel` et scanner **toutes** les entités du modèle pour vérifier qu'aucune autre entité n'a déjà une relation vers `EntiteCible` avec le même `attributeName` candidat. Un `attributeName` n'est valide que s'il est unique parmi toutes les relations pointant vers la même `roleBClass`. Si un conflit est détecté, choisir un nom qualifié selon la convention (ex: `runs`, `pipelineRuns`) avant d'appeler `addRelation`.

### Convention de nommage des attributs de relation

Le `attributeName` d'une relation doit être :

- **camelCase**, dérivé du nom de l'entité cible
- **Non ambigu** dans le contexte de l'entité source

| Situation | Convention | Exemple |
|---|---|---|
| Une seule relation vers l'entité cible | `<cibleCamelCase>` | `Order → Customer` → `customer` |
| Plusieurs relations vers des entités différentes | `<cibleCamelCase>` pour chacune | `order`, `product`, `customer` |
| Plusieurs relations vers la **même** entité cible | Préfixe de rôle + cible | `Order → Customer` ×2 → `billingCustomer`, `shippingCustomer` |
| Relation avec sémantique métier claire | Nom métier en camelCase | `assignedTo`, `createdBy`, `parentCategory` |

**Règle de choix** : si l'entité source a déjà une relation vers la même entité cible, ne jamais utiliser le nom simple (`customer`) — toujours qualifier (`billingCustomer`, `shippingCustomer`, `primaryContact`, etc.).

### Exemple de séquence — Ajouter un attribut

```
1. cat katappult.json → projectId
2. getEntity(projectId, "MonEntite")
   → vérifier que entity.attributes ne contient PAS déjà un attribut avec name == "monAttribut"
   → si trouvé : STOP, ne pas appeler addAttribute
3. addAttribute(projectId, "MonEntite", "monAttribut", "String", false, "", "", false, false)
4. Confirmer avec getEntity que l'attribut est présent une seule fois
```

### Exemple de séquence — Ajouter une relation

```
1. cat katappult.json → projectId
2. listEntities(projectId) → vérifier que les deux entités existent
3. getProjectModel(projectId)
   → scanner TOUTES les entités : pour chaque entité E, regarder E.oneToMany + E.oneToOne + E.manyToMany
   → collecter tous les attributeName existants dont roleBClass == "EntiteCible"
     (ex: Agent.agentRuns → AgentRun : attributeName "agentRuns" est déjà pris)
   → choisir un attributeName NON présent dans cette liste, selon la convention :
       · aucun conflit → nom dérivé de la cible : "agentRun", "agentRuns", etc.
       · conflit → nom qualifié par le rôle : "runs", "pipelineRuns", "assignedRuns", etc.
   → si aucun nom disponible sans conflit : STOP, consulter l'utilisateur
4. addRelation(projectId, "EntiteSource", "EntiteCible", <type>, <attributeName choisi>)
5. Confirmer avec getEntity que la relation est présente avec le bon attributeName
```

### Exemple de séquence — Supprimer un attribut

```
1. cat katappult.json → projectId
2. getEntity(projectId, "MonEntite") → récupérer l'id de l'attribut dans entity.attributes
3. removeAttribute(projectId, "MonEntite", "<id>")
```

### Exemple de séquence — Ajouter une entité complète

```
1. cat katappult.json → projectId
2. listEntities(projectId) → vérifier que l'entité n'existe pas
3. addOrUpdateEntity(projectId, <config entité>)
4. addAttribute(projectId, "NouvelleEntite", "attr1", "String", false, ...)
5. addFeature(projectId, "NouvelleEntite", "LifecycleManaged")
6. addFeature(projectId, "NouvelleEntite", "TypeManaged")
```

---

## Étape 4 — Vérifier le résultat MCP

Appeler `getEntity(projectId, "NomEntite")` après les modifications pour confirmer :
- Les attributs attendus sont présents et uniques
- Les relations sont correctement configurées
- Les features sont activées

---

## Étape 5 — Migration Liquibase (ajout/suppression d'attribut sur projet existant)

> **Pourquoi ?** Le changelog `_generated/<entite>/<entite>-schema.xml` crée la table à l'initialisation du projet et n'est exécuté qu'une seule fois par Liquibase. Sur une base existante, la nouvelle colonne ne sera jamais ajoutée automatiquement. Il faut un changeset dédié.

Cette étape est **obligatoire** dès qu'un attribut est ajouté ou supprimé d'une entité existante.

### 5a — Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Nom de table | `gen_<entity_snake_case>` | `LignePanier` → `gen_ligne_panier` |
| Nom de colonne | `<attr_snake_case>` | `codeDeReduction` → `code_de_reduction` |
| Nom du fichier | `<YYYYMMDDHHMMSS>-<add\|drop>-col-<colonne>-<table>.xml` | `20240613120000-add-col-code_de_reduction-gen_ligne_panier.xml` |
| ID du changeSet | même valeur que le nom de fichier sans `.xml` | — |

### 5b — Mapping Java → SQL

| Java | SQL |
|---|---|
| `String` | `VARCHAR(255)` |
| `Text` | `TEXT` |
| `Integer` | `INTEGER` |
| `Long` | `BIGINT` |
| `Double` | `DOUBLE PRECISION` |
| `Float` | `REAL` |
| `BigDecimal` | `NUMERIC` |
| `Boolean` | `BOOLEAN` |
| `Date` | `TIMESTAMP` |
| `Jsonb` | `JSONB` |
| `Short` | `SMALLINT` |

### 5c — Créer le fichier de migration

Créer le fichier dans `src/main/resources/changelogs/migrations/` (créer le dossier s'il n'existe pas).

**Template — ADD COLUMN :**

```xml
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
    http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.4.xsd">

    <changeSet id="<YYYYMMDDHHMMSS>-add-col-<colonne>-<table>" author="katappult-model">
        <preConditions onFail="MARK_RAN">
            <tableExists tableName="<table>"/>
            <not>
                <columnExists tableName="<table>" columnName="<colonne>"/>
            </not>
        </preConditions>
        <addColumn tableName="<table>">
            <column name="<colonne>" type="<SQL_TYPE>"/>
        </addColumn>
    </changeSet>

</databaseChangeLog>
```

**Template — DROP COLUMN :**

```xml
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
    http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.4.xsd">

    <changeSet id="<YYYYMMDDHHMMSS>-drop-col-<colonne>-<table>" author="katappult-model">
        <preConditions onFail="MARK_RAN">
            <tableExists tableName="<table>"/>
            <columnExists tableName="<table>" columnName="<colonne>"/>
        </preConditions>
        <dropColumn tableName="<table>" columnName="<colonne>"/>
    </changeSet>

</databaseChangeLog>
```

### 5d — Référencer dans le master changelog

Lire `src/main/resources/changelogs/coreapp-dbchangelog-master.xml` et ajouter l'include **après** le generated master, **avant** `</databaseChangeLog>` :

```xml
<include file="changelogs/migrations/<nom-fichier>.xml"/>
```

Ordre impératif dans le master :
1. `katappult-core-dbchangelog-master.xml` — tables système Katappult
2. `_generated/generated-dbchangelog-master.xml` — création des tables métier (exécuté 1 fois)
3. `changelogs/migrations/*.xml` — altérations sur tables existantes ← **ici**

---

## Étape 6 — Proposer la génération

Une fois les modifications confirmées et la migration créée, indiquer à l'utilisateur :

> ✓ Modèle mis à jour + migration Liquibase créée. Lance `/katappult-apply` pour régénérer le code source.
