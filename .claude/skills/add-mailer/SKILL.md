---
name: add-mailer
description: >
  Crée une business rule asynchrone de type mailer (email) dans un projet Katappult.
  Couvre : mailer concret étendant AbstractMailer (katappult-core), template HTML enregistré
  en base via Liquibase (T_ENTEMPLATE + T_CONTENTITEM + T_CONTENTLOCATION),
  et enregistrement dans T_BUSINESS_RULES avec TRANSAC_PHASE=AFTER_COMMIT.
  Déclenche sur : "envoie un mail", "notifie par email", "créer un mailer",
  "email de confirmation", "email d'annulation", "template d'email", "ajouter un template mail".
---

# Skill: add-mailer

Implémente une business rule asynchrone d'envoi d'email dans un projet Katappult.

---

## Vue d'ensemble

Les mailers sont des règles `INonVetoableBusinessRule` asynchrones (via `@Async`).
Ils ne bloquent jamais l'opération — ils s'exécutent **après le commit** (`TRANSAC_PHASE=AFTER_COMMIT`).

La classe de base katappult-core est **`AbstractMailer`** — elle gère l'envoi SMTP, la résolution du template, et le formatage des paramètres.

```
rules/
  {entity}/
    mailing/
      Post{State}{Entity}MailTo{Who}.java   ← @Component concret, extend AbstractMailer
src/main/resources/changelogs/{project}/
  {TEMPLATE_CODE}.html                      ← contenu HTML du mail
```

---

## Vérifier avant de coder

Avant de créer un nouveau mailer, vérifier si le projet possède déjà une classe abstraite mailer pour ce domaine (ex: dans `rules/{entity}/mailing/`). Si elle existe, l'étendre plutôt qu'`AbstractMailer` directement. Si non, étendre `AbstractMailer`.

---

## Pattern — Mailer concret

```java
@RequiredArgsConstructor
@NoArgsConstructor(force = true)
@Component
@Slf4j
public class Post{State}{Entity}MailTo{Who} extends AbstractMailer {

    private final I{Entity}Service {entity}Service;
    private final IContainedService containedService;
    // + autres services nécessaires pour résoudre le destinataire

    @Async
    @Override
    public void apply(KatappultEvent event) {
        try {
            if (event.getContainer() == null) {
                event.setContainer(containedService.getApplicationContainer());
            }
            this.preValidateEmailSending(event);
        } catch (IllegalArgumentException e) {
            return;
        }

        // Caster l'événement selon le déclencheur (PostSetSateEvent, PostCreate{Entity}, etc.)
        {Entity} entity = ({Entity}) event.getSubject();

        // Résoudre le destinataire (propriétaire, vendeur, admin, etc.)
        UserAccount toAccount = {entity}Service.getManyToOneLegacyOwner(entity);

        ENTemplate enTemplate = this.services.enTemplateService().getByName(getEmailTemplateId());
        this.sendEmail(enTemplate, event, List.of(toAccount.getLogin()), List.of());
    }

    @Override
    public Map<String, Object> getEmailsParamsForTemplate(ENTemplate enTemplate, KatappultEvent event) {
        {Entity} entity = ({Entity}) event.getSubject();
        Map<String, Object> params = new HashMap<>();
        // Renseigner les variables utilisées dans le template HTML
        // ex: params.put("reference", entity.getReference());
        //     params.put("pseudo_utilisateur", entity.getOwner().getNickName());
        return params;
    }

    @Override
    public boolean shouldSkip(KatappultEvent event) {
        // Filtrer : sans ce filtre, le mailer se déclenche sur TOUS les événements du même type
        // ex pour un lifecycle : PostSetSateEvent -> vérifier l'état courant
        return false; // remplacer par la condition métier
    }

    private String getEmailTemplateId() {
        return "{TEMPLATE_CODE}"; // doit correspondre à T_ENTEMPLATE.internal_name
    }
}
```

Règles :
- `@NoArgsConstructor(force = true)` obligatoire — Spring crée un proxy de la classe
- `@Async` obligatoire sur `apply()` — le mail s'envoie hors de la transaction principale
- `preValidateEmailSending()` gère les cas d'erreur silencieux — ne pas retirer
- `shouldSkip()` est impératif : un mailer sans filtre se déclenche sur tous les événements du même `EVENT_NAME`
- Aucune logique métier dans le mailer — déléguer à un service si nécessaire

---

## Pattern optionnel — Abstract base par domaine

Si plusieurs mailers d'un même domaine partagent la logique de résolution du destinataire ou des paramètres du template, créer une classe abstraite intermédiaire dans le projet :

```java
@RequiredArgsConstructor
@NoArgsConstructor(force = true)
public abstract class {Entity}ByStatusMailer extends AbstractMailer {

    // dépendances communes à tous les mailers du domaine

    @Async
    @Override
    public void apply(KatappultEvent event) {
        // logique commune (container, preValidate, résolution destinataire, sendEmail)
    }

    @Override
    public Map<String, Object> getEmailsParamsForTemplate(ENTemplate enTemplate, KatappultEvent event) {
        // paramètres communs à tous les mailers du domaine
        return new HashMap<>();
    }

    protected abstract String getEmailTemplateId();
}
```

Les mailers concrets n'ont alors besoin que de `getEmailTemplateId()` et `shouldSkip()`.

---

## Étape 2 — Template HTML

Créer `src/main/resources/changelogs/{project}/{TEMPLATE_CODE}.html` :

```html
<p>Bonjour [( ${pseudo_utilisateur} )],</p>

<p>Votre commande <strong>#[( ${reference} )]</strong> a été annulée.</p>

<p>Nous vous présentons nos excuses pour ce désagrément.</p>

<p>Cordialement,</p>
```

Variables injectées depuis `getEmailsParamsForTemplate()` :
- Syntaxe Thymeleaf : `[( ${nom_variable} )]`
- Noms libres, définis par `params.put("nom_variable", valeur)`

---

## Étape 3 — Liquibase : enregistrement du template email

Dans le changelog custom du projet (`changelogs/{project}/{project}-changelogs.xml`) :

```xml
<changeSet id="{NEXT_ID}" author="{author}">
    <validCheckSum>ANY</validCheckSum>
    <insert tableName="T_ENTEMPLATE">
        <column name="internal_name" value="{TEMPLATE_CODE}"/>
        <column name="display_name" value="Libellé lisible du template"/>
        <column name="description" value="Description"/>
        <column name="message_title" value="Objet du mail envoyé"/>
        <column name="content_type" value="text/html"/>
        <column name="type" value="MAIL_TEMPLATE"/>
        <column name="container_oid" value="1"/>
    </insert>
    <insert tableName="T_CONTENTITEM">
        <column name="content_size" value="10"/>
        <column name="md5" value="1"/>
        <column name="rating" valueNumeric="1"/>
        <column name="download_count" valueNumeric="1"/>
        <column name="name" value="{TEMPLATE_CODE}"/>
        <column name="dtype" value="PRIM"/>
        <column name="container_oid" value="1"/>
    </insert>
    <insert tableName="T_CONTENTLOCATION">
        <column name="content_type" value="BLOB"/>
        <column name="name" value="{TEMPLATE_CODE}"/>
        <column name="item_oid"
                valueComputed="(select oid from T_CONTENTITEM where name='{TEMPLATE_CODE}')"/>
    </insert>
    <update tableName="T_CONTENTLOCATION">
        <column name="content_blob" valueBlobFile="{TEMPLATE_CODE}.html"/>
        <where>name='{TEMPLATE_CODE}'</where>
    </update>
    <update tableName="T_ENTEMPLATE">
        <column name="primary_content_oid"
                valueComputed="(select oid from T_CONTENTITEM where name='{TEMPLATE_CODE}')"/>
        <where>oid=(select oid from T_ENTEMPLATE where internal_name='{TEMPLATE_CODE}')</where>
    </update>
</changeSet>
```

> `valueBlobFile` est résolu relativement au fichier XML — le `.html` doit être dans le même répertoire.

---

## Étape 4 — Liquibase : enregistrement de la business rule

```xml
<changeSet id="{NEXT_ID}" author="{author}">
    <insert tableName="T_BUSINESS_RULES">
        <column name="EVENT_NAME" value="POST_SET_STATE"/>
        <column name="BUSINESSRULE_IDENTIFIER" value="Post{State}{Entity}MailTo{Who}"/>
        <column name="ISACTIVE" value="1"/>
        <column name="BR_ORDER" value="2"/>
        <column name="ISVETOABLE" value="0"/>
        <column name="TRANSAC_PHASE" value="AFTER_COMMIT"/>
        <column name="DESCRIPTION" value="Send email on {state} to {who}"/>
        <column name="BUSINESS_CLASS" value="{basePackage}.generated.model.{Entity}"/>
        <column name="BR_RULE" value="Post{State}{Entity}MailTo{Who}"/>
        <column name="CONTAINER_OID" valueComputed="(select oid from T_CONTAINER where path='/')"/>
    </insert>
</changeSet>
```

`EVENT_NAME` selon le déclencheur :
- `POST_SET_STATE` — transition lifecycle
- `POST_CREATE_{ENTITY}` — création d'entité (ex: `POST_CREATE_ORDER`)
- `POST_UPDATE_{ENTITY}` — mise à jour

Valeurs fixes pour les mailers :
- `ISVETOABLE=0` — non-bloquant obligatoire
- `TRANSAC_PHASE=AFTER_COMMIT` — après commit, données cohérentes

---

## Checklist

- [ ] `@NoArgsConstructor(force = true)` + `@RequiredArgsConstructor` sur la classe mailer
- [ ] `@Async` sur `apply()` du concret
- [ ] `shouldSkip()` filtre l'événement/état — pas de déclenchement universel
- [ ] `getEmailsParamsForTemplate()` retourne toutes les variables du template HTML
- [ ] Fichier `.html` dans `changelogs/{project}/` (même dossier que le XML)
- [ ] 5 opérations dans le changeset template : insert ENT → insert ITEM → insert LOC → update blob → update FK
- [ ] Changeset business rule : `ISVETOABLE=0`, `TRANSAC_PHASE=AFTER_COMMIT`
- [ ] IDs de changesets consécutifs et uniques dans le fichier
