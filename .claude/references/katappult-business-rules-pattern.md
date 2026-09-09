# Katappult — Pattern Business Rules

## 1. Choisir le type de règle

| Cas d'usage | Interface | Processor | Transaction |
|---|---|---|---|
| Validation bloquante (annuler l'opération) | `IVetoableBusinessRule` | `VetoableRulesProcessor` | Même transaction (MANDATORY) |
| Effet de bord dans la transaction (ex: numérotation auto) | `IVetoableBusinessRule` | idem | idem |
| Notification / action asynchrone | `INonVetoableBusinessRule` | `NonVetoableRulesProcessor` | Async (@Async) |
| Action après commit (email, push, appel externe) | `INonVetoableBusinessRule` | `TransactionalRulesProcessor` | AFTER_COMMIT |

---

## 2. Catalog des événements katappult

Événements génériques disponibles pour toute entité :

| EVENT_NAME | Déclenchement |
|---|---|
| `PRE_STORE` | Avant la sauvegarde initiale (création) |
| `POST_STORE` | Après la sauvegarde initiale |
| `PRE_UPDATE` | Avant une mise à jour |
| `POST_UPDATE` | Après une mise à jour |
| `PRE_DELETE` | Avant une suppression |
| `POST_DELETE` | Après une suppression |
| `POST_CREATE_ACCOUNT` | Après création d'un compte utilisateur |
| `PRE_CHECKOUT` / `POST_CHECKOUT` | Checkout d'une entité versionnée |
| `PRE_CHECKIN` / `POST_CHECKIN` | Checkin d'une entité versionnée |

Les entités générées publient également des événements spécifiques :
`PreCreateXxx` / `PostCreateXxx` / `PreUpdateXxx` / `PostUpdateXxx` / `PreDeleteXxx` / `PostDeleteXxx`

> Si un événement spécifique n'existe pas, le créer dans `model/event/`.

---

## 3. Template — Règle Vetoable (validation / effet de bord)

```java
@Component("NOM_UNIQUE_001")
public class NomUnique001 implements IVetoableBusinessRule {

    @Override
    public void apply(KatappultEvent event) {
        MonEntite entite = (MonEntite) event.getSubject();

        // Validation bloquante
        if (entite.getStock() <= 0) {
            throw new BusinessRuleException("NOM_UNIQUE_001: stock insuffisant");
        }

        // OU effet de bord dans la même transaction
        if (entite.getReference() == null) {
            entite.setReference("REF-" + System.currentTimeMillis());
        }
    }
}
```

---

## 4. Template — Règle Non-Vetoable (notification)

```java
@Component("NOM_NOTIF_001")
public class NomNotif001 extends BaseNotificationRule {

    @Override
    public void apply(KatappultEvent event) {
        MonEntite entite = (MonEntite) event.getSubject();

        Notification notif = new NotificationBuilder()
            .newOne(entite.getOwner())
            .withSubject("Nouvelle commande créée")
            .withType(NotificationType.INFO)
            .build();

        saveAndPushNotification(notif, entite.getOwner(), event.getContainer());
    }
}
```

---

## 5. Template — Déclaration Liquibase (T_BUSINESS_RULES)

```xml
<changeSet id="YYYY-MM-DD-add-rule-NOM_UNIQUE_001" author="dev">
    <insert tableName="T_BUSINESS_RULES">
        <column name="EVENT_NAME" value="PRE_STORE"/>
        <column name="BUSINESSRULE_IDENTIFIER" value="NOM_UNIQUE_001"/>
        <column name="BUSINESS_CLASS" value="com.monapp.model.generated.MonEntite"/>
        <column name="BR_RULE" value="NOM_UNIQUE_001"/>
        <column name="ISVETOABLE" valueNumeric="1"/>
        <column name="BR_ORDER" valueNumeric="10"/>
        <column name="CONTAINER_OID" valueNumeric="1"/>
        <column name="DESCRIPTION" value="Valide le stock avant création"/>
        <column name="ISACTIVE" valueNumeric="1"/>
    </insert>
</changeSet>
```

**Champs T_BUSINESS_RULES :**

| Champ | Description | Exemple |
|---|---|---|
| `EVENT_NAME` | Nom de l'événement | `PRE_STORE`, `POST_CREATE_ACCOUNT` |
| `BUSINESSRULE_IDENTIFIER` | Identifiant unique de la règle | `NOM_UNIQUE_001` |
| `BUSINESS_CLASS` | Classe complète de l'entité ciblée | `com.monapp.model.generated.Commande` |
| `BR_RULE` | Nom du bean Spring (`@Component`) | `NomUnique001` |
| `ISVETOABLE` | 1 = vetoable, 0 = non-vetoable | `1` |
| `BR_ORDER` | Ordre d'exécution (plus petit = prioritaire) | `10` |
| `TRANSAC_PHASE` | Optionnel : `AFTER_COMMIT` ou `AFTER_ROLLBACK` | `AFTER_COMMIT` |
| `CONTAINER_OID` | OID du container (généralement 1) | `1` |
| `ISACTIVE` | 1 = actif | `1` |

---

## 6. Checklist

- [ ] Classe annotée `@Component("NOM_UNIQUE")` avec nom unique dans tout le projet
- [ ] Implémente `IVetoableBusinessRule` OU `INonVetoableBusinessRule`
- [ ] `apply(KatappultEvent event)` implémentée
- [ ] Changeset Liquibase créé dans le fichier de changelogs custom du projet
- [ ] `BUSINESSRULE_IDENTIFIER` = nom du `@Component`
- [ ] `BR_ORDER` cohérent avec les autres règles existantes sur le même événement
- [ ] Règle testée via test d'intégration (déclencher l'événement et vérifier le comportement)

---

## 7. Exemple concret (imb-backmarket)

```java
// Règle : avant validation du panier, vérifier que les articles sont en stock
@Component("PreValidatePanierEvent")
public class PreValidatePanierEvent implements IVetoableBusinessRule {
    
    private final PanierRepository panierRepository;
    
    @Override
    public void apply(KatappultEvent event) {
        Panier panier = (Panier) event.getSubject();
        panier.getLignesPanier().forEach(ligne -> {
            if (ligne.getProduct().getStock() < ligne.getQuantite()) {
                throw new BusinessRuleException(
                    "Stock insuffisant pour : " + ligne.getProduct().getNom());
            }
        });
    }
}
```

```xml
<changeSet id="2024-01-15-add-rule-PreValidatePanierEvent" author="dev">
    <insert tableName="T_BUSINESS_RULES">
        <column name="EVENT_NAME" value="PRE_VALIDATE_PANIER"/>
        <column name="BUSINESSRULE_IDENTIFIER" value="PreValidatePanierEvent"/>
        <column name="BUSINESS_CLASS" value="com.imb.model.generated.Panier"/>
        <column name="BR_RULE" value="PreValidatePanierEvent"/>
        <column name="ISVETOABLE" valueNumeric="1"/>
        <column name="BR_ORDER" valueNumeric="10"/>
        <column name="CONTAINER_OID" valueNumeric="1"/>
        <column name="ISACTIVE" valueNumeric="1"/>
    </insert>
</changeSet>
```
