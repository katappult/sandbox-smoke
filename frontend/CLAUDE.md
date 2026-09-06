# Frontend — Next.js / React

## Stack

Next.js 15 (Pages Router) · React 18 · Redux · Ant Design · Material-UI · Axios · i18next (en/fr/mg, default: `fr`) · Firebase · Tailwind CSS

Pas de test runner configuré.

## Commandes

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

- Dev : `NEXT_PUBLIC_BACKEND_URL=http://localhost:8080` dans `frontend/.env.local`
- Prod : mettre à jour `frontend/.env.production`
- Thème : `NEXT_PUBLIC_THEME` au build (ex. `default`, `clientA`, `clientB`)

## Composants et services générés

Chaque entité générée possède :
- `pages/generated/{entity}/` — pages liste et détail/formulaire
- `components/generated/{entity}/{Entity}List.jsx`
- `components/generated/{entity}/{Entity}Form.jsx`
- `components/generated/{entity}/{Entity}Drawer.jsx`
- `services/generated/{Entity}.services.js`

Utiliser les composants et services générés pour le CRUD standard. Ne créer des custom que si nécessaire.

## Appels API (Axios)

Toutes les requêtes passent par `services/utils/service.config.js`. Factory :

```js
// services/utils/service.factory.js
createEntityService('/api/v1/myentity')
// → { listEntity, detailsEntity, createEntity, updateEntity, deleteEntity, searchEntity }
```

- JWT dans le cookie `Authorization`, attaché à chaque requête
- Réponse 511 → redirect automatique vers login
- GET auto-append `?lang={current_lang}`
- Upload fichiers : `multipart/form-data` via `_doPostFiles`
- **`validateStatus: () => true`** — axios ne throw jamais sur 4xx/5xx ; toujours vérifier `responseSuccess(res)`

## Routing et layouts

Pages Router Next.js. Pattern `getLayout` :

```js
Page.getLayout = (page) => <MainLayout>{page}</MainLayout>;
```

Layouts dans `layouts/` : `AppTopBar.jsx`, `MenuFront.jsx`, `MenuUser.jsx`, etc.

## Redux

- `notificationCount` — badge header
- `containerId` — app instance ID (depuis JWT)

Persisté dans `localStorage` via `redux-persist` (clé `"root"`). Auth info décodée côté client depuis le cookie JWT via `jwt-decode`.

## Traductions

Fichiers : `locales/{lang}/base_language.json` (importés via `@/locales/...` dans `i18n.js`). Hook `useTranslation` partout. Constantes dans `utils/TranslationConstants.js`. Tout texte visible doit être traduit.

> Ne jamais placer sous `public/` un fichier importé depuis le code : en build standalone, le file tracing le recopie dans `.next/standalone/public`, ce qui fait sauter la copie du reste de `public/` (images, favicon) par l'adapter Firebase App Hosting.

## Theming (CSS variables)

Variables injectées dans `<head>` par `pages/_document.js` depuis `styles/themes/index.js`.

- **Ne jamais hardcoder les couleurs** — toujours `var(--color-1)`, `var(--opacity-30-color-1)`, `var(--topbar-bg)`, etc.
- Ajouter un thème client : entrée dans `THEMES` dans `styles/themes/index.js` + `NEXT_PUBLIC_THEME` dans leur `.env.production`
- Référence complète : `docs/theming.md`

## CSS

- **Jamais `:global()` dans les CSS Modules** — Next.js rejette ("Selector is not pure"). Les overrides tiers vont dans `styles/brand_1.css`
- Tailwind CSS pour layout et spacing ; CSS Modules pour styles composant-spécifiques ; pas de styles inline bruts
- `styles/pages/Profile.module.css` — styles partagés pour pages de type profil
- `styles/components/UserDrawer.module.css` — avatar, badges, search bar, rows, actions pour user management
- Chaque composant doit supporter light et dark mode

## Conventions composants

- **Ne pas définir de sous-composants dans le corps d'une fonction parent** — chaque render crée une nouvelle référence → React remonte → les inputs perdent le focus. Définir tous les composants au niveau module.
- Navigation master-detail dans les tables admin : état local (`selectedId`), pas de routing. Quand `selectedId` est défini, la vue détail remplace la table ; un bouton retour remet à zéro.
- Composants réutilisables et stateless autant que possible.
