---
name: add-business-rule
description: >
  Adds or modifies a Spring business rule in the backend. Triggered when the user wants to implement
  a validation, transformation, or notification rule on pre/post events of a generated entity.
  Déclenche sur : "ajoute une règle métier", "valide avant création", "notifie après mise à jour",
  "empêche la suppression si", "génère une référence automatiquement", "envoie un email après".
---

# Skill: add-business-rule

Ajoute une règle métier dans un projet katappult suivant le pattern chain of responsibility + Spring events.

---

## Workflow obligatoire

```
1. Identifier l'événement → voir Catalog ci-dessous
2. Choisir le type → IVetoableBusinessRule ou INonVetoableBusinessRule
3. Écrire la classe Java @Component
4. Ajouter la déclaration Liquibase dans T_BUSINESS_RULES
5. Vérifier la checklist
```

> Pour les patterns complets avec templates, voir `.claude/references/katappult-business-rules-pattern.md`

---

## Catalog des événements

| EVENT_NAME | Déclenchement |
|---|---|
| `PRE_STORE` | Avant création (validation, numérotation auto) |
| `POST_STORE` | Après création (notification, initialisation) |
| `PRE_UPDATE` | Avant mise à jour (validation) |
| `POST_UPDATE` | Après mise à jour (notification, email) |
| `PRE_DELETE` | Avant suppression (empêcher si conditions) |
| `POST_DELETE` | Après suppression (nettoyage, notification) |
| `POST_CREATE_ACCOUNT` | Après création compte (initialiser profil, envoyer email bienvenue) |
| `PreCreateXxx` / `PostCreateXxx` | Événements spécifiques à l'entité Xxx |

---

## Choisir l'interface

| Cas | Interface |
|---|---|
| Validation bloquante, numérotation auto, effet de bord en transaction | `IVetoableBusinessRule` |
| Notification in-app, email, appel asynchrone | `INonVetoableBusinessRule` |

---

## Template Vetoable

```java
@Component("MON_RULE_001")  // ← identifiant unique dans tout le projet
public class MonRule001 implements IVetoableBusinessRule {

    @Override
    public void apply(KatappultEvent event) {
        MonEntite entite = (MonEntite) event.getSubject();
        if (conditionEchouee(entite)) {
            throw new BusinessRuleException("MON_RULE_001: message explicite");
        }
    }
}
```

## Template Non-Vetoable (notification)

```java
@Component("MON_NOTIF_001")
public class MonNotif001 extends BaseNotificationRule {

    @Override
    public void apply(KatappultEvent event) {
        MonEntite entite = (MonEntite) event.getSubject();
        Notification notif = new NotificationBuilder()
            .newOne(entite.getOwner())
            .withSubject("Titre")
            .withType(NotificationType.INFO)
            .build();
        saveAndPushNotification(notif, entite.getOwner(), event.getContainer());
    }
}
```

---

## Déclaration Liquibase (obligatoire)

```xml
<changeSet id="YYYY-MM-DD-add-rule-MON_RULE_001" author="dev">
    <insert tableName="T_BUSINESS_RULES">
        <column name="EVENT_NAME" value="PRE_STORE"/>
        <column name="BUSINESSRULE_IDENTIFIER" value="MON_RULE_001"/>
        <column name="BUSINESS_CLASS" value="com.monapp.model.generated.MonEntite"/>
        <column name="BR_RULE" value="MON_RULE_001"/>
        <column name="ISVETOABLE" valueNumeric="1"/>
        <column name="BR_ORDER" valueNumeric="10"/>
        <column name="CONTAINER_OID" valueNumeric="1"/>
        <column name="ISACTIVE" valueNumeric="1"/>
    </insert>
</changeSet>
```

---

## Checklist

- [ ] `@Component("NOM_UNIQUE")` — identifiant unique dans tout le projet
- [ ] Interface correcte : `IVetoableBusinessRule` ou `INonVetoableBusinessRule`
- [ ] Événement correct dans `EVENT_NAME` (voir catalog)
- [ ] `BUSINESS_CLASS` = classe complète de l'entité ciblée
- [ ] `BR_RULE` = même valeur que le `@Component`
- [ ] `BR_ORDER` cohérent avec les règles existantes sur le même événement
- [ ] Changeset Liquibase dans le fichier de changelogs custom du projet
- [ ] ID changeset unique et au format `YYYY-MM-DD-add-rule-NOM`
