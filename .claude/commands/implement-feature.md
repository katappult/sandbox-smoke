---
allowed-tools: Bash(git:*), Read, Edit, Write, Glob, Grep, Agent
argument-hint: [feature.md] [screen.png] [reference.jsx] [target.jsx] [notes libres...]
description: Implémente une feature ou un écran depuis une maquette, un .md, les deux, ou une simple description. 1 seul agent dev par défaut.
---

# Implement — Orchestrateur Universel

Paramètres reçus : **$ARGUMENTS**

## Étape 0 — Détection des inputs

Analyser `$ARGUMENTS` et le contexte du prompt pour identifier ce qui a été fourni.
**Aucun input n'est obligatoire.** Tout ce qui est absent est simplement ignoré.

| Input détecté | Extraction |
|---|---|
| Fichier `.md` | **FEATURE_MD** — premier argument se terminant par `.md` |
| Image (`.png`, `.jpg`, `.webp`, `.svg`, `.gif`) | **SCREEN** — premier argument image trouvé |
| Premier fichier `.jsx`/`.tsx` | **REFERENCE** — composant de référence (pattern à suivre) |
| Second fichier `.jsx`/`.tsx` | **TARGET** — composant cible à créer ou modifier |
| Texte libre restant dans les arguments | **DESCRIPTION** — instructions supplémentaires |
| Prompt initial si aucun argument | **DESCRIPTION** — utiliser le texte du prompt comme requirements |

Si un chemin de fichier est fourni mais n'existe pas, signaler et continuer avec les autres inputs.

## Étape 1 — Lecture du contexte

Lire **en parallèle** tout ce qui est disponible parmi :

- **FEATURE_MD** → lire le fichier `.md` (extraire : Feature Request, critères d'acceptation, contraintes métier, et section `## Agents` si présente)
- **SCREEN** → charger l'image pour analyse visuelle complète
- **REFERENCE** → lire le composant de référence et son `.module.css` associé
- **TARGET** → lire l'état actuel du composant cible et son `.module.css` associé

## Étape 2 — Détermination du plan d'exécution

### Nombre d'agents

**Par défaut : 1 seul agent de développement.**

Utiliser plusieurs agents uniquement si l'une de ces conditions est vraie :
1. Le fichier `.md` contient une section `## Agents` listant explicitement plusieurs agents
2. Le prompt de l'utilisateur mentionne explicitement plusieurs agents, "parallel", "en parallèle", ou nomme des agents distincts

### Choix de l'agent dev unique

| Contexte | Agent |
|---|---|
| SCREEN fournie (avec ou sans `.md`) | `frontend-developer` — focalisé UI/design |
| Seulement `.md` ou DESCRIPTION — scope frontend | `frontend-developer` |
| Seulement `.md` ou DESCRIPTION — scope backend | `backend-developer` |
| Scope fullstack ou ambigu | Agent unique fullstack (backend + frontend dans un seul agent) |

## Étape 3 — Construction du contexte pour l'agent dev

Assembler un bloc de contexte complet depuis toutes les sources disponibles :

```
FEATURE_REQUEST:
  [Depuis FEATURE_MD si disponible → sinon depuis DESCRIPTION → sinon depuis le prompt initial]

DESIGN:
  [Analyse visuelle complète du SCREEN si disponible :
   structure (layout, colonnes, sections), hiérarchie visuelle,
   cards, formulaires, boutons, icônes, badges, tableaux]

DESIGN_TOKENS (si SCREEN fournie):
  - Couleurs → uniquement var(--color-1), var(--text-primary), etc.
  - Espacements → var(--sp-*) uniquement
  - Rayons → var(--radius-*) uniquement
  - Ombres → var(--shadow-*) uniquement
  - Couleur de sélection → toujours var(--accent-color)

REFERENCE_COMPONENT:
  [Pattern JSX, imports, nommage CSS module, hooks, props, gestion événements
   — uniquement si REFERENCE disponible]

TARGET:
  [Composant cible à créer ou modifier — uniquement si TARGET disponible]

CONSTRAINTS:
  - Aucune modification sous **/generated/**
  [+ contraintes métier depuis FEATURE_MD si présentes]
```

## Étape 4 — Modélisation Katappult (si la feature implique des changements de modèle)

### Détection du besoin de modélisation

Déclencher cette étape si l'une des conditions suivantes est vraie :
- Le FEATURE_MD ou la DESCRIPTION mentionne de nouvelles entités, attributs, relations, features, ou workflow
- Le FEATURE_MD contient une section `## Modèle` ou `## Data Model`
- Le prompt initial demande explicitement de créer ou modifier des entités

Si aucune de ces conditions n'est vraie → passer directement à l'Étape 6.

### 4a — Modélisation avec /katappult-model

Invoquer le skill `/katappult-model` avec le contexte extrait :
- Entités à créer / modifier
- Attributs et leurs types
- Relations entre entités
- Features à activer (lifecycle, auth, content, etc.)
- Règles de workflow si définies

Attendre la confirmation de fin avant de passer à l'étape suivante.

### 4b — Génération et application du code avec /katappult-apply

Invoquer le skill `/katappult-apply` pour générer le code depuis le modèle mis à jour et l'appliquer localement.

Attendre la fin complète de l'application avant de continuer.

---

## Étape 5 — Correction des tests post-génération

Après un `/katappult-apply`, des tests peuvent échouer car le code généré est copié depuis un template générique qui **n'est pas adapté au contexte spécifique du projet** (multi-tenant, règles métier, contraintes de sécurité, etc.).

### 5a — Exécution des tests

```bash
mvn test -pl . 2>&1 | tail -100
```

Si tous les tests passent → passer à l'Étape 6.

### 5b — Identification des tests en échec

Pour chaque test en échec :
1. Lire le fichier de test concerné
2. Analyser le message d'erreur
3. Classifier la cause :

| Cause probable | Symptôme typique |
|---|---|
| Contexte multi-tenant manquant | `TenantContextException`, `NullPointerException` sur tenant, `No tenant found` |
| Données de test incomplètes | Contraintes NOT NULL violées, FK manquante |
| Règles métier spécifiques | Validation custom rejetée, état lifecycle incorrect |
| Permissions / auth | `AccessDeniedException`, `403 Forbidden` dans les tests |
| Configuration Spring manquante | `NoSuchBeanDefinitionException`, `@MockitoBean` manquant |

### 5c — Correction des tests

Pour chaque test en échec, tenter de corriger :
- Ajouter le contexte tenant manquant (via `TenantContextHolder` ou annotation de test du projet)
- Compléter les données de test avec les champs obligatoires manquants
- Adapter les assertions aux règles métier du projet (ex : états lifecycle attendus)
- Ajouter les mocks ou beans de configuration nécessaires

Règle : corriger **uniquement les fichiers de test** — ne pas modifier le code généré sous `**/generated/**`.

**La correction des tests de 5c ne bloque jamais l'Étape 6.** Qu'ils soient corrigés, en cours, ou escaladés → continuer l'implémentation de la feature. La correction des tests générés est une tâche parallèle au développement, pas un prérequis.

### 5d — Escalade si correction trop complexe

Si après analyse la correction nécessite :
- De comprendre une logique métier non documentée dans les inputs fournis
- De modifier l'architecture des tests de façon transverse
- Plus de 2 itérations de correction sans convergence

→ **Notifier l'utilisateur** (sans stopper le pipeline) avec :
- La liste des tests en échec (nom, classe, message d'erreur)
- La cause identifiée pour chacun
- Ce qui a été tenté
- La question précise à laquelle répondre pour débloquer

Puis **continuer à l'Étape 6** sans attendre la résolution.

---

## Étape 6 — Implémentation

### Mode standard (1 agent dev — défaut)

Lancer un seul agent avec le contexte complet construit à l'étape 3.

L'agent doit :
1. Implémenter la feature ou l'écran selon les inputs disponibles
2. Si SCREEN fournie → respecter les règles design system TAP (voir section ci-dessous)
3. Si FEATURE_MD fourni → respecter les critères d'acceptation et contraintes métier
4. Ne jamais modifier les fichiers sous `**/generated/**`
5. Committer le travail à la fin

### Mode multi-agents (uniquement si explicitement demandé)

Si le `.md` contient une section `## Agents` ou si l'utilisateur le demande explicitement :
exécuter les agents dans l'ordre défini avec les règles d'orchestration ci-dessous.

---

## Règles d'orchestration (mode multi-agents uniquement)

### Séquentialité stricte
Ne jamais lancer l'agent N+1 avant que l'agent N soit terminé avec succès.

### Transmission du contexte
Chaque agent reçoit :
- Le contexte complet (Feature Request + design + contraintes)
- Le nom de la branche courante
- Le résultat de l'agent précédent (si pertinent)

### Boucle de correction reviewer
Si un agent `*-code-reviewer` retourne des problèmes bloquants :
- Relancer l'agent développeur correspondant avec la liste des corrections
- Maximum **2 itérations** avant escalade humaine
- En cas d'escalade : stopper le pipeline, notifier l'utilisateur avec le contexte complet

### Gate de validation
Le `pr-creator` ne s'exécute **que si** le fichier `.reviewer-approved` existe à la racine.
Ce fichier est créé par le reviewer uniquement si aucun problème bloquant (🔴) ni majeur (🟠) n'est détecté.

### Arrêt sur erreur
Tout échec non récupérable stoppe le pipeline. Notifier avec : étape en échec, contexte complet, sortie d'erreur.

---

## Règles design system TAP (si SCREEN fournie)

- Aucune couleur hardcodée — uniquement les CSS variables (sauf couleurs de statut : confirmed/pending/cancelled/info)
- Aucun `border-radius` hardcodé — `var(--radius-*)`
- Aucune ombre hardcodée — `var(--shadow-*)`
- Aucune police hardcodée — `var(--font-family)`
- **Aucun style inline** (`style={{ ... }}`) — uniquement des classes CSS Module
- **Aucun emoji** — icônes `@mui/icons-material` uniquement
- Aucun sous-composant défini dans le corps d'un composant React (définir au niveau module)
- Pas de `:global()` dans les CSS Modules
- Tous les textes via `useTranslation()` — jamais de string hardcodée visible
- Import CSS module avec nom explicite (pas `s`, `x`, etc.)
- Convention nommage classes CSS : `snake_case`
- Padding horizontal page : `--page-px` (30px)
- Gap entre cards : `var(--sp-6)` (24px)

Pattern section card obligatoire :
```jsx
<div className={Style.section_card}>
  <div className={Style.section_card_header}>
    <div className={Style.section_card_header_left}>
      <span className={Style.section_card_header_icon}><IconeOutlined /></span>
      <div className={Style.section_card_header_text}>
        <span className={Style.section_label}>Titre</span>
        <span className={Style.section_desc}>Description optionnelle</span>
      </div>
    </div>
  </div>
  {/* Contenu */}
</div>
```

---

## Agents disponibles (mode multi-agents)

`new-feature-branch-creator`, `backend-developer`, `backend-code-reviewer`,
`frontend-developer`, `frontend-code-reviewer`, `pr-creator`,
`bug-analyser`, `mobile-developer`, `web-frontend-developer`

---

## Étape 7 — Écriture des tests TU et TI

Après l'implémentation de la feature (Étape 6), écrire les tests couvrant le **nouveau code produit** (règles métier, services, endpoints, composants).

Ces tests sont distincts des tests générés corrigés en Étape 5 — ils couvrent la logique custom ajoutée par l'agent dev.

### 7a — Tests Unitaires (TU)

Écrire des tests unitaires pour chaque classe ou fonction non triviale ajoutée :

| Cible | Ce qu'on teste |
|---|---|
| Règles métier (`rules/`) | Chaque branche de condition, cas nominal et cas rejeté |
| Services custom | Logique de calcul, transformation, orchestration |
| Utilitaires | Cas limites, entrées invalides |
| Composants React (si scope frontend) | Rendu conditionnel, interactions utilisateur, props |

Conventions :
- Utiliser JUnit 5 + Mockito pour le backend
- Nommer les méthodes de test : `should_[comportement_attendu]_when_[condition]`
- Tester indépendamment de la base de données (mocks)
- Respecter le contexte multi-tenant dans les données de test (utiliser `TenantContextHolder` ou l'annotation de test existante dans le projet)

### 7b — Tests d'Intégration (TI)

Écrire des tests d'intégration pour les endpoints REST et les flux complets :

| Cible | Ce qu'on teste |
|---|---|
| Endpoints REST créés / modifiés | CRUD complet, codes HTTP attendus, format de réponse |
| Flux de lifecycle | Transitions d'état valides et invalides |
| Règles de sécurité | Accès autorisé vs refusé selon le rôle |
| Persistance | Données bien sauvegardées et récupérées |

Conventions :
- Utiliser `@SpringBootTest` + `MockMvc` ou `WebTestClient`
- Initialiser le contexte tenant avant chaque test
- Nettoyer les données après chaque test (`@Transactional` ou `@AfterEach`)
- Ne jamais tester les endpoints des fichiers `**/generated/**` — uniquement les endpoints custom
- **Toujours utiliser un token utilisateur standard** — ne jamais utiliser un token admin pour les tests ; un test qui ne passe qu'avec des droits admin masque des problèmes de sécurité réels

### 7c — Exécution finale des tests

```bash
mvn test -pl . 2>&1 | tail -100
```

- Tous les TU et TI de la nouvelle feature doivent passer
- Si un test échoue → corriger avant de passer au rapport
- Si un échec est bloquant et non résolvable → notifier l'utilisateur avec le détail

---

## Étape 8 — Rapport final

Après l'implémentation, afficher un résumé court :
- Fichiers créés / modifiés
- Sections ou fonctionnalités implémentées
- Décisions notables de design ou d'architecture
