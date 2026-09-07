# Frontend — Web App

Next.js 15 (Pages Router) · React 18 · Ant Design · Material-UI · Redux · i18next · Axios · Firebase

---

## Installation

```bash
npm install
```

## Développement

```bash
# Copier et configurer les variables d'environnement
cp .env.example .env.local
# Définir l'URL du backend dans .env.local :
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
# NEXT_PUBLIC_THEME=default

npm run dev
```

## Build & production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | URL de l'API backend | `http://localhost:8080` |
| `NEXT_PUBLIC_THEME` | Thème client à appliquer au build | `default`, `clientA`, `clientB` |

---

## Architecture

### Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 — Pages Router |
| UI | Ant Design (principal) + Material-UI (icônes) |
| État global | Redux + redux-persist (`localStorage`, clé `"root"`) |
| HTTP | Axios — `services/utils/service.config.js` |
| Auth | JWT dans cookie `Authorization`, décodé côté client via `jwt-decode` |
| i18n | react-i18next — langues : `fr` (défaut), `en`, `mg` |
| Push / Auth Firebase | Firebase SDK |

### Structure principale

```
pages/          # Routing Next.js (file-based)
  generated/    # Pages CRUD auto-générées — ne pas éditer manuellement
components/     # Composants React
  generated/    # Composants CRUD auto-générés
layouts/        # AppTopBar, MenuFront, MenuUser, etc.
services/       # Couche HTTP
  generated/    # Services CRUD auto-générés
  utils/
    service.config.js   # Instances Axios partagées
    service.factory.js  # Fabrique de services CRUD
styles/         # CSS Modules + CSS globaux
  themes/
    index.js    # Catalogue des thèmes multi-client
  brand_1.css   # Variables globales stables + overrides tiers
public/
  locales/      # Fichiers de traduction {lang}.json
```

### Theming multi-client

Le thème est sélectionné à la compilation via `NEXT_PUBLIC_THEME` et injecté comme variables CSS dans `<head>` par `pages/_document.js`. Toujours utiliser les variables CSS (`var(--color-1)`, `var(--topbar-bg)`…) — ne jamais coder de couleurs en dur.

→ Voir **`docs/theming.md`** pour le guide complet (ajout de thème, liste des variables).

### Couche service

Tous les appels HTTP passent par les instances Axios de `service.config.js` :
- `validateStatus: () => true` — axios ne lève jamais d'exception sur les 4xx/5xx ; les appelants vérifient `responseSuccess(res)`
- Un statut 511 déclenche une redirection automatique vers la page de connexion
- Les GET ajoutent automatiquement `?lang={lang_courant}`
- Les uploads de fichiers utilisent `_doPostFiles` (multipart/form-data)

### Code généré

Les dossiers `pages/generated/`, `components/generated/` et `services/generated/` contiennent du scaffolding CRUD uniforme. Ne les modifier manuellement que pour surcharger un comportement spécifique.
