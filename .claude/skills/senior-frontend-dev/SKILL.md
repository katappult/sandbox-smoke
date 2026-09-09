---
name: senior-frontend-dev
description: >
  Comprehensive frontend development skill for building modern web applications using React 18,
  Next.js 15, Tailwind CSS, Ant Design, Material-UI in a katappult-generated project.
  Use when developing frontend features, creating pages/components, implementing services JS,
  managing state, or reviewing frontend code.
  Déclenche sur : "crée une page", "ajoute un composant", "crée le service JS", "ajoute un
  formulaire", "affiche la liste de", "intègre l'API", "crée la vue de".
---

# Senior Frontend Dev — React 18 / Next.js 15 / Katappult

Skill pour le développement frontend dans un projet katappult-core.

---

## ⚠️ Règle fondamentale

**Ne jamais modifier `**/generated/**`** — ce code est géré par le MCP Katappult.

Le code custom à produire :
- `frontend/services/` → `Custom*.service.js`
- `frontend/pages/` → pages custom (kebab-case)
- `frontend/components/` → composants custom (PascalCase)
- `frontend/locales/{lang}/base_language.json` → traductions (jamais sous `public/` : un fichier de `public/` importé depuis le code casse la copie de `public/` en build standalone)

---

## Délégation vers les skills spécialisés

| Besoin | Skill à utiliser |
|---|---|
| Créer un composant React/JSX | `/jsx-component` |
| Moderniser un composant existant | `/refactor-jsx-component` |
| Écrire/modifier des styles CSS | `/css-class` |
| Design responsive / thème multi-client | `/responsive-design` |
| Design production-grade | `/frontend-design` |

---

## APIs katappult disponibles — vérifier avant de coder

**→ Consulter `.claude/references/katappult-core-api-catalog.md`**

Auth, notifications, médias, préférences — tout est disponible via le backend katappult-core.

---

## Pattern service JS custom — OBLIGATOIRE

```js
import {serviceConfig} from "./utils/service.config";

async function getProduit(uid) {
    const url = `${serviceConfig.API_ROOT}/api/v1/produits/${uid}`;
    return await serviceConfig._doGet(url);
}

async function createProduit(data) {
    const url = `${serviceConfig.API_ROOT}/api/v1/produits`;
    return await serviceConfig._doPost(url, data);
}

async function updateProduit(uid, data) {
    const url = `${serviceConfig.API_ROOT}/api/v1/produits/${uid}`;
    return await serviceConfig._doPut(url, data);
}

async function deleteProduit(uid) {
    const url = `${serviceConfig.API_ROOT}/api/v1/produits/${uid}`;
    return await serviceConfig._doDelete(url);
}

async function uploadImage(uid, formData) {
    const url = `${serviceConfig.API_ROOT}/api/v1/produits/${uid}/image`;
    return await serviceConfig._doPostFiles(url, formData);
}

// CRUD standard → utiliser la factory
// import { createEntityService } from "./utils/service.factory";
// const ProduitGeneratedService = createEntityService('/api/v1/produits');

export const ProduitService = {
    getProduit,
    createProduit,
    updateProduit,
    deleteProduit,
    uploadImage,
};
```

**Règles absolues :**
- `serviceConfig._doXxx` — jamais fetch/axios directement
- `responseSuccess(res)` checké dans **l'appelant** (composant), pas dans le service
- `uid` pour les entités du projet, `fullId` pour les entités core (thumbnails, contentHolder)
- Export : `export const XxxService = { fn1, fn2, ... }`

---

## Identifier les layouts avant de créer une page

Les noms et l'emplacement des layouts varient selon le projet. Toujours découvrir avant de coder :

```bash
ls frontend/layouts/ 2>/dev/null || ls frontend/_layouts/ 2>/dev/null
grep -A2 "getLayout" frontend/pages/index.js
```

Deux patterns courants dans les projets Katappult :

**Pattern A — Layouts dédiés (fichiers séparés)**
```jsx
// Page admin
import { getAdminLayout } from '@/layouts/AdminLayout';
ProduitsPage.getLayout = (page) => getAdminLayout(page);

// Page client/front-office
import { getFrontOfficeLayout } from '@/layouts/FrontOfficeLayout';
ProduitsPage.getLayout = (page) => getFrontOfficeLayout(page);
```

**Pattern B — Admin layout inline dans `pages/index.js`**
```jsx
// Page admin
import HomePage from '@/pages/index';
ProduitsPage.getLayout = HomePage.getLayout;

// Page client
import ClientLayout from '@/layouts/ClientLayout';
ProduitsPage.getLayout = (page) => ClientLayout.getLayout(page);

// Page auth
import AuthLayout from '@/layouts/AuthLayout';
ProduitsPage.getLayout = (page) => AuthLayout.getLayout(page);
```

---

## Pattern page Next.js

```jsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Layout découvert avec `ls frontend/layouts/` — adapter le nom et le pattern
import HomePage from '@/pages/index'; // ou: import { getAdminLayout } from '@/layouts/AdminLayout'
import { ProduitService } from '@/services/Produit.service';
import { responseSuccess } from '@/services/utils/service.config';

export default function ProduitsPage() {
    const { t } = useTranslation('produits');
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await ProduitService.listProduits({ page: 0, pageSize: 20 });
            if (responseSuccess(res)) {
                setProduits(res.data.items || []);
            }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <div>
            <h1>{t('title')}</h1>
            {/* contenu */}
        </div>
    );
}

// Pattern B (layout inline) :
ProduitsPage.getLayout = HomePage.getLayout;
// Pattern A (layout dédié) :
// ProduitsPage.getLayout = (page) => getAdminLayout(page);
```

---

## Conventions katappult frontend

| Règle | Détail |
|---|---|
| Routing | `pages/mon-entite/index.js` (kebab-case, Pages Router) |
| Composants | `PascalCase.jsx` dans `components/` |
| Import | Toujours via `@/` (jamais `../`, `../../`) |
| Couleurs | CSS variables uniquement (`var(--color-1)`) — jamais hardcodées |
| i18n | `useTranslation`, clés dans `locales/{lang}/base_language.json` |
| Layout | Découvrir avec `ls frontend/layouts/`, assigner avec `Page.getLayout` |
| CSS | Tailwind pour layout/spacing, CSS Modules pour styles composant |
| Dark mode | Chaque composant supporte `var(--color-bg)` etc. |
| State | Redux uniquement pour `notificationCount` et `containerId` |
| Sub-composants | Définis à **niveau module**, jamais dans le body d'un composant parent |
