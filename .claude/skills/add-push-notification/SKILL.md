---
name: add-push-notification
description: >
  Crée une business rule de notification push + in-app dans un projet Katappult.
  Couvre : notification in-app via INotificationService (katappult-core), push via
  l'infrastructure Firebase du projet, shouldSkip() pour filtrer par état lifecycle,
  et enregistrement Liquibase dans T_BUSINESS_RULES avec TRANSAC_PHASE=AFTER_COMMIT.
  Déclenche sur : "envoie une notification", "notifie le vendeur", "notifie l'acheteur",
  "notification push", "notification in-app", "alerte après annulation", "push Firebase".
---

# Skill: add-push-notification

Implémente une business rule de notification push (Firebase) + in-app dans un projet Katappult.

---

## Vue d'ensemble

Les notifications combinent généralement deux canaux :
1. **In-app** — via `INotificationService` (katappult-core), sauvegardée en base
2. **Push Firebase** — via l'infrastructure FCM propre au projet (classe à identifier)

**Ce skill est générique** : les services utilitaires (constructeurs de payload, service Firebase) sont propres à chaque projet. Avant de coder, identifier les classes existantes.

---

## Avant de coder — identifier l'infrastructure du projet

```
grep -r "INotificationService\|pushNotification\|FirebaseService\|FCM" src/main/java --include="*.java" -l
```

Chercher :
- La classe de base des notifications du projet (souvent `BaseNotificationRule`, `AbstractNotificationRule`)
- Le service Firebase (souvent `CustomFirebaseService`, `FirebaseMessagingService`)
- Les builders de payload s'ils existent (`NotificationBuilder`, `PushNotificationBuilder`)

**Si une classe abstraite de notification existe dans le projet → l'étendre.**  
**Si non → implémenter depuis `INotificationService` (katappult-core) directement.**

---

## Pattern A — Avec classe abstraite projet existante

Si le projet possède déjà un `Abstract{Domain}Notify{Who}` (ex: `AbstractOrderNotifyUser`), créer uniquement l'implémentation concrète :

```java
@RequiredArgsConstructor
@Component
@Slf4j
public class Post{State}{Entity}Notify{Who} extends Abstract{Entity}Notify{Who} {

    private static final String MESSAGE = "Votre {entity} #%s a été {state}.";

    @Override
    protected UserAccount getDestination({Entity} entity) {
        // Surcharger uniquement si le destinataire diffère de celui de la base
        // ex: notifier le vendeur plutôt que le client
        return entity.getOwner(); // ou via un service si relation indirecte
    }

    @Override
    public boolean shouldSkip(KatappultEvent event) {
        // Filtrer l'état lifecycle — sans filtre, déclenchement sur tous les POST_SET_STATE
        PostSetSateEvent postSetSateEvent = (PostSetSateEvent) event;
        {Entity} entity = ({Entity}) postSetSateEvent.getSubject();
        return !{Entity}LifecycleEnum.is{State}(entity.getLifecycleInfo().getCurrentState());
    }

    @Override
    protected String getMessage({Entity} entity, Container container) {
        return String.format(MESSAGE, entity.getNumber());
    }

    @Override
    protected String getTitle({Entity} entity, Container container) {
        return "{Entity} {state}!";
    }
}
```

---

## Pattern B — Sans classe abstraite projet (implémentation directe)

Si le projet n'a pas de classe abstraite de notification, implémenter depuis les services katappult-core :

```java
@RequiredArgsConstructor
@Component
@Slf4j
public class Post{State}{Entity}Notify{Who} implements INonVetoableBusinessRule {

    private final INotificationService notificationService;
    // + service FCM/push si disponible dans le projet

    @Override
    public void apply(KatappultEvent event) {
        {Entity} entity = ({Entity}) event.getSubject();
        UserAccount destination = resolveDestination(entity);

        try {
            Notification notification = new Notification();
            notification.setSubject(getTitle(entity));
            notification.setMessage(getMessage(entity));
            notification.setType(NotificationType.INFO);
            notificationService.createNotification(notification, destination);
            log.debug("Notification saved for user: {}", destination.getLogin());
        } catch (Exception e) {
            log.error("Failed to save notification for user: {}", destination.getLogin(), e);
        }

        // Push FCM — uniquement si l'infrastructure existe dans le projet
        // sendPushIfAvailable(destination, getTitle(entity), getMessage(entity));
    }

    @Override
    public boolean shouldSkip(KatappultEvent event) {
        // Filtrer l'état ou le type d'événement
        return false; // remplacer par la condition métier
    }

    private UserAccount resolveDestination({Entity} entity) {
        return entity.getOwner(); // adapter selon le domaine
    }

    private String getTitle({Entity} entity) {
        return "{Entity} {state}";
    }

    private String getMessage({Entity} entity) {
        return String.format("Votre {entity} #%s a été {state}.", entity.getNumber());
    }
}
```

---

## Pattern optionnel — Créer une classe abstraite pour le domaine

Si plusieurs notifications d'un même domaine partagent la logique de résolution du destinataire ou du push, créer une classe abstraite dans le projet :

```java
@RequiredArgsConstructor
public abstract class Abstract{Entity}Notify{Who} implements INonVetoableBusinessRule {

    protected final INotificationService notificationService;
    // + service push FCM si le projet en a un

    @Override
    public void apply(KatappultEvent event) {
        {Entity} entity = ({Entity}) event.getSubject();
        UserAccount destination = getDestination(entity);

        // notification in-app
        Notification notification = buildNotification(destination, getTitle(entity, event.getContainer()), getMessage(entity, event.getContainer()));
        saveNotification(notification, destination, event.getContainer());

        // push — déléguer au service FCM du projet si disponible
    }

    protected UserAccount getDestination({Entity} entity) {
        return entity.getOwner();
    }

    protected abstract String getMessage({Entity} entity, Container container);
    protected abstract String getTitle({Entity} entity, Container container);
}
```

---

## `shouldSkip()` — Filtre lifecycle

`shouldSkip()` est **impératif** pour les notifications déclenchées sur `POST_SET_STATE` : sans filtre, la règle se déclenche sur **toutes** les transitions de statut de l'entité.

```java
@Override
public boolean shouldSkip(KatappultEvent event) {
    PostSetSateEvent postSetSateEvent = (PostSetSateEvent) event;
    {Entity} entity = ({Entity}) postSetSateEvent.getSubject();
    // Vérifier l'enum de lifecycle du projet
    return !{Entity}LifecycleEnum.is{State}(entity.getLifecycleInfo().getCurrentState());
}
```

Pour les événements `POST_CREATE_{ENTITY}` ou `POST_UPDATE_{ENTITY}`, `shouldSkip()` peut retourner `false` directement (la notification s'applique toujours à la création/MAJ).

---

## Liquibase : enregistrement de la business rule

```xml
<changeSet id="{NEXT_ID}" author="{author}">
    <insert tableName="T_BUSINESS_RULES">
        <column name="EVENT_NAME" value="POST_SET_STATE"/>
        <column name="BUSINESSRULE_IDENTIFIER" value="Post{State}{Entity}Notify{Who}"/>
        <column name="ISACTIVE" value="1"/>
        <column name="BR_ORDER" value="4"/>
        <column name="ISVETOABLE" value="0"/>
        <column name="TRANSAC_PHASE" value="AFTER_COMMIT"/>
        <column name="DESCRIPTION" value="Send notification to {who} on {state}"/>
        <column name="BUSINESS_CLASS" value="{basePackage}.generated.model.{Entity}"/>
        <column name="BR_RULE" value="Post{State}{Entity}Notify{Who}"/>
        <column name="CONTAINER_OID" valueComputed="(select oid from T_CONTAINER where path='/')"/>
    </insert>
</changeSet>
```

`EVENT_NAME` selon le déclencheur :
- `POST_SET_STATE` — transition lifecycle
- `POST_CREATE_{ENTITY}` — création
- `POST_UPDATE_{ENTITY}` — mise à jour

Valeurs fixes :
- `ISVETOABLE=0` — notification = non-bloquant
- `TRANSAC_PHASE=AFTER_COMMIT` — données cohérentes lors de l'envoi

---

## Mailer vs Notification — Quand choisir quoi ?

| | Mailer (`/add-mailer`) | Notification (`/add-push-notification`) |
|---|---|---|
| Canal | Email | Push Firebase + in-app |
| Template | Fichier HTML en DB (`T_ENTEMPLATE`) | Message inline dans le code |
| Async | `@Async` obligatoire | Non (`AFTER_COMMIT` suffit) |
| Quand | Confirmation formelle, récapitulatif | Alerte temps réel, badge in-app |

> Les deux peuvent coexister sur le même événement lifecycle.

---

## Checklist

- [ ] Vérifier si une classe abstraite de notification existe dans le projet avant de créer
- [ ] `@Component` + `@RequiredArgsConstructor` sur le concret
- [ ] `shouldSkip()` filtre l'état lifecycle — pas de déclenchement universel sur `POST_SET_STATE`
- [ ] `getDestination()` résout le bon destinataire (client, vendeur, admin…)
- [ ] Erreurs FCM catchées silencieusement — ne jamais lever d'exception dans `apply()`
- [ ] Changeset Liquibase : `ISVETOABLE=0`, `TRANSAC_PHASE=AFTER_COMMIT`
- [ ] `EVENT_NAME` correspond à l'événement Spring publié
- [ ] ID du changeset unique et consécutif dans le fichier changelog
