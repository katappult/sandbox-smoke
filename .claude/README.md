# Claude Code — Guide des commandes, agents et skills

Ce document explique comment utiliser les outils Claude Code disponibles sur ce projet.

---

## Vue d'ensemble

```
.claude/
├── commands/     ← /slash-commands — actions directes (git, build, deploy…)
├── agents/       ← agents orchestrateurs — pipelines autonomes multi-étapes
├── skills/       ← skills spécialisés — invoqués automatiquement ou avec /skill-name
└── references/   ← documentation de référence lue par les agents
```

---

## Commandes `/command`

Tapez `/nom-de-la-commande` dans le prompt Claude Code. Certaines acceptent des arguments.

| Commande                          | Argument                                | Ce que ça fait                                                   |
|-----------------------------------|-----------------------------------------|------------------------------------------------------------------|
| `/implement-feature`              | `<nom-feature>.md`                      | Lance le développement de la feature                             |
| `/secrets-scanner`                | `[--api-keys\|--passwords\|--fix]`      | Scanne le code pour des secrets exposés                          |

### Exemples

```
/implement-feature add-product-search.md
/secrets-scanner --api-keys
```

---

## Agents orchestrateurs

Les agents sont des pipelines multi-étapes. Invoquez-les en demandant à Claude de les utiliser,
ou en les nommant directement dans votre prompt.

### `/implement-feature` — feature.md

Pipeline complet pour une feature, feature.md contient toutes les infos nécessaires pour les agents.

## Skills `/skill-name`

Les skills sont des modes d'expertise activés sur demande. Claude les utilise automatiquement
selon le contexte, ou vous pouvez les invoquer explicitement avec `/nom-du-skill`.

### Développement backend

| Skill | Déclenché quand |
|---|---|
| `/senior-backend-dev` | Créer un service, ajouter un endpoint, implémenter de la logique métier |
| `/java-class` | Créer une classe Java (service, DTO, enum, exception, repository…) |
| `/refactor-java-class` | Moderniser du code Java legacy |
| `/add-business-rule` | Ajouter une business rule Katappult (vetoable ou non) |
| `/add-mailer` | Créer un mailer async (email par statut lifecycle) + template HTML en Liquibase |
| `/add-push-notification` | Créer une notification push Firebase + in-app (BaseNotificationRule) |
| `/backend-integration-test` | Écrire un test d'intégration MockMVC + H2 |
| `/liquibase` | Écrire un changeset Liquibase |
| `/modify-database` | Modifier le schéma via Liquibase |

### Développement frontend

| Skill | Déclenché quand |
|---|---|
| `/senior-frontend-dev` | Développement React/Next.js avancé |
| `/jsx-component` | Créer ou modifier un composant JSX/React |
| `/refactor-jsx-component` | Refactorer un composant React |
| `/css-class` | Créer ou modifier des classes CSS |
| `/tailwind-patterns` | Patterns Tailwind CSS v4 |
| `/responsive-design` | Styles responsives, CSS variables, thèmes clients |
| `/frontend-design` | Interfaces production-grade, haute qualité visuelle |
| `/brand-guideline` | Appliquer les couleurs et typographie officielles du projet |

### Architecture et analyse

| Skill | Déclenché quand |
|---|---|
| `/explain-architecture-projet` | Expliquer l'architecture globale du projet |
| `/explain-architecture-back` | Expliquer l'architecture backend |
| `/explain-architecture-front` | Expliquer l'architecture frontend |
| `/explain-architecture-bdd` | Expliquer le schéma de base de données |
| `/explain-code` | Expliquer un bloc de code précis |
| `/mermaid-diagrams` | Générer des diagrammes (séquence, C4, ERD, flowchart…) |

### Setup et infrastructure

| Skill | Déclenché quand |
|---|---|
| `/katappult-project-setup` | Bootstrapper un nouveau projet Katappult (post-archetype) |
| `/docker-expert` | Dockerfile, Docker Compose, optimisation d'images |
| `/seo-audit` | Auditer ou diagnostiquer des problèmes SEO |

### Qualité

| Skill | Déclenché quand |
|---|---|
| `/clean-code` | Appliquer les standards de code propre |
| `/analyse-anomaly-rapide` | Analyser une anomalie rapidement |
| `/analyse-anomaly-complet` | Analyse complète d'anomalie (profonde) |
| `/mobile-developer` | Développement Flutter/mobile cross-platform |

---

## Workflow typiques

### Nouvelle feature complète

```
1. Décrire la feature à Claude avec le contexte métier
2. Claude invoque /new-katappult-feature automatiquement
3. Approuver ou rejeter la PR créée sur GitHub
```

### Revue de code avant PR

```
# Demander à Claude : "revois le backend de cette feature"
# → active backend-code-reviewer
# → liste les problèmes bloquants / majeurs / mineurs
```

### Initialiser un nouveau projet

```
# Après génération de l'archetype par le MCP Katappult :
/katappult-project-setup
# → build, init DB, démarrage backend + frontend, commit initial
```

---

## Références disponibles pour les agents

Les agents lisent automatiquement ces fichiers de référence :

| Fichier | Contenu |
|---|---|
| `references/katappult-custom-layer.md` | Patterns custom (service, facade, repo, rules, cron, loaders, API externes) |
| `references/katappult-core-api-catalog.md` | APIs déjà disponibles via katappult-core (auth, notifs, médias, email…) |
| `references/katappult-business-rules-pattern.md` | Patterns détaillés pour les business rules |

> Avant de coder un nouveau service, les agents vérifient `katappult-core-api-catalog.md`
> pour éviter de réimplémenter ce qui est déjà fourni par la plateforme.

---

## Règles fondamentales (rappel)

- **Jamais modifier `**/generated/**`** — code géré par Katappult MCP
- Les entités sont définies en amont (MCP) avant tout développement
- Tout changement DB = nouveau changeset Liquibase backward-compatible
- Path params REST : toujours `uid`, jamais `oid` ni `fullId`
- Endpoints `/api/v1/` → `@PreAuthorize` obligatoire
- Endpoints `/api/pub/v1/` → pas de `@PreAuthorize`, pas de `@SecurityRequirement`
- Toutes les facades étendent `BaseKatappultRestService`
