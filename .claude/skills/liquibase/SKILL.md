---
name: liquibase-changeset
description: >
  Skill pour créer et gérer des changesets Liquibase selon les conventions du projet :
  numérotation incrémentale stricte, jamais de modification d'un changeset existant,
  toute correction ou ajout se fait dans un NOUVEAU changeset, compatibilité H2/PostgreSQL.
  Utiliser ce skill dès que l'utilisateur mentionne : Liquibase, changeset, changelog,
  migration de base de données, schema SQL, addColumn, createTable, dropColumn, ou
  demande d'écrire / modifier des fichiers de migration DB. Même pour une petite correction,
  toujours créer un nouveau changeset — ne jamais éditer un changeset existant.
---

# Skill : Liquibase Changeset

## Règles absolues (non négociables)

1. **Numérotation incrémentale** — l'`id` de chaque nouveau changeset est toujours `N+1` par rapport au plus grand `id` existant dans le fichier. Ne jamais réutiliser un id.
2. **Immuabilité des changesets existants** — on ne modifie JAMAIS un changeset déjà écrit, même pour corriger une typo ou un type de colonne. Toute modification passe par un nouveau changeset (`addColumn`, `modifyDataType`, `dropColumn`, `renameColumn`, etc.).
3. **Compatibilité H2 / PostgreSQL** — chaque changeset doit fonctionner sur les deux bases. Voir la section "Compatibilité" ci-dessous.
4. **Auteur cohérent** — utiliser l'auteur fourni par l'utilisateur ou `dev` par défaut.
5. **Un seul fichier changelog maître** — les nouveaux changesets s'ajoutent à la FIN du fichier existant.

---

## Structure d'un changeset

```xml
<changeSet id="42" author="dev">
    <!-- commentaire décrivant l'intention -->
    <preConditions onFail="MARK_RAN">
        <!-- optionnel, voir section Préconditions -->
    </preConditions>

    <createTable tableName="exemple">
        <column name="id" type="BIGINT" autoIncrement="true">
            <constraints primaryKey="true" nullable="false"/>
        </column>
        <column name="libelle" type="VARCHAR(255)">
            <constraints nullable="false"/>
        </column>
        <column name="actif" type="BOOLEAN" defaultValueBoolean="true">
            <constraints nullable="false"/>
        </column>
    </createTable>
</changeSet>
```

---

## Compatibilité H2 / PostgreSQL

| Besoin | À utiliser | À éviter |
|---|---|---|
| Clé primaire auto-incrémentée | `type="BIGINT" autoIncrement="true"` | `SERIAL`, `IDENTITY` |
| Booléen | `type="BOOLEAN"` | `type="BIT"` (H2 OK, PG moins) |
| Texte court | `type="VARCHAR(N)"` | `type="TEXT"` pour les colonnes contraintes |
| Texte long | `type="CLOB"` | `type="TEXT"` (H2 supporte, PG aussi — acceptable) |
| Timestamp | `type="TIMESTAMP"` | `TIMESTAMPTZ` (PostgreSQL only) |
| UUID | `type="UUID"` | `type="CHAR(36)"` |
| JSON | Utiliser `dbms` split (voir ci-dessous) | `type="JSON"` (pas H2 <2.x) |

### Split par SGBD (dbms tag)

Quand un type n'est pas portable, utiliser deux changesets ou le tag `dbms` :

```xml
<changeSet id="43" author="dev" dbms="postgresql">
    <addColumn tableName="exemple">
        <column name="metadata" type="JSONB"/>
    </addColumn>
</changeSet>

<changeSet id="44" author="dev" dbms="h2">
    <addColumn tableName="exemple">
        <column name="metadata" type="CLOB"/>
    </addColumn>
</changeSet>
```

---

## Opérations courantes

### Ajouter une colonne

```xml
<changeSet id="N" author="dev">
    <addColumn tableName="ma_table">
        <column name="nouvelle_colonne" type="VARCHAR(100)">
            <constraints nullable="true"/>
        </column>
    </addColumn>
</changeSet>
```

### Modifier un type de colonne (jamais via l'ancien changeset !)

```xml
<changeSet id="N" author="dev">
    <modifyDataType tableName="ma_table"
                    columnName="ma_colonne"
                    newDataType="VARCHAR(500)"/>
</changeSet>
```

### Renommer une colonne

```xml
<changeSet id="N" author="dev">
    <renameColumn tableName="ma_table"
                  oldColumnName="ancien_nom"
                  newColumnName="nouveau_nom"
                  columnDataType="VARCHAR(255)"/>
</changeSet>
```

### Supprimer une colonne

```xml
<changeSet id="N" author="dev">
    <dropColumn tableName="ma_table" columnName="colonne_obsolete"/>
</changeSet>
```

### Ajouter un index

```xml
<changeSet id="N" author="dev">
    <createIndex tableName="ma_table" indexName="idx_ma_table_colonne">
        <column name="ma_colonne"/>
    </createIndex>
</changeSet>
```

### Insérer des données de référence

```xml
<changeSet id="N" author="dev">
    <insert tableName="referentiel">
        <column name="code" value="TYPE_A"/>
        <column name="libelle" value="Type A"/>
    </insert>
</changeSet>
```

### Contrainte NOT NULL sur colonne existante

```xml
<changeSet id="N" author="dev">
    <!-- D'abord remplir les valeurs null si nécessaire -->
    <update tableName="ma_table">
        <column name="ma_colonne" value="valeur_par_defaut"/>
        <where>ma_colonne IS NULL</where>
    </update>
    <addNotNullConstraint tableName="ma_table"
                          columnName="ma_colonne"
                          columnDataType="VARCHAR(255)"/>
</changeSet>
```

---

## Préconditions (quand les utiliser)

Utiliser `<preConditions onFail="MARK_RAN">` quand le changeset pourrait être rejoué sur une base partiellement migrée :

```xml
<changeSet id="N" author="dev">
    <preConditions onFail="MARK_RAN">
        <not>
            <tableExists tableName="nouvelle_table"/>
        </not>
    </preConditions>
    <createTable tableName="nouvelle_table">
        ...
    </createTable>
</changeSet>
```

Options `onFail` :
- `MARK_RAN` — ignorer silencieusement (le plus courant)
- `WARN` — logguer un warning et continuer
- `ERROR` — stopper la migration (défaut)
- `HALT` — stopper immédiatement

---

## Processus de travail

1. **Lire le fichier changelog existant** pour identifier le dernier `id` utilisé.
2. **Calculer le prochain id** = dernier id + 1.
3. **Écrire le nouveau changeset** en fin de fichier.
4. **Vérifier la compatibilité H2/PG** — types, syntaxe, pas de fonctions propriétaires.
5. **Ne jamais toucher** aux changesets précédents.

### Exemple de détermination du prochain id

```bash
# Dernier id dans le fichier
grep 'changeSet id=' db.changelog.xml | tail -1
# → <changeSet id="37" author="dev">
# → Prochain id = 38
```

---

## Format du fichier changelog maître

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
    xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
        http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.20.xsd">

    <!-- changesets dans l'ordre croissant des ids -->

</databaseChangeLog>
```

---

## Erreurs fréquentes à éviter

| ❌ Mauvais | ✅ Correct |
|---|---|
| Éditer un `<column>` dans un changeset existant | Créer un nouveau changeset `modifyDataType` |
| Utiliser `SERIAL` ou `SEQUENCE` directement | `autoIncrement="true"` sur la colonne |
| Sauter des ids (ex : 10 → 15) | Numérotation strictement consécutive |
| `type="INT"` pour les FK | `type="BIGINT"` cohérent avec la PK référencée |
| Laisser `nullable` non défini sur une colonne obligatoire | Toujours spécifier `<constraints nullable="false"/>` |
| Utiliser `NOW()` dans un `defaultValue` | `defaultValueComputed="now()"` ou `CURRENT_TIMESTAMP` |