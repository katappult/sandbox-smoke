---
name: jsx-component
description: Créer, modifier ou générer des composants JSX/React en suivant les conventions du projet. Utiliser ce skill dès que l'utilisateur mentionne : composant React, composant JSX, créer un composant, modifier un composant, page React, fichier .jsx, ou toute demande de code frontend React. Aussi déclencher si l'utilisateur parle de props, de types de props, de styles Tailwind dans un composant, ou de structure de projet React avec pages/components/styles.
---

# Skill : Composants JSX

## Conventions du projet

### Structure des dossiers

```
project/
├── pages/
│   └── nom-de-page/
│       └── index.js        ← dossier en kebab-case, fichier index.js
├── components/
│   └── MonComposant.jsx    ← fichiers en PascalCase
└── styles/
    └── MonComposant.css    ← TOUS les styles custom ici, jamais inline
```

### Règles absolues

1. **Nommage kebab-case pour les dossiers de pages** — `pages/mon-tableau-de-bord/index.js` ✅ — `pages/MonTableauDeBord/index.js` ❌
2. **Nommage PascalCase pour les composants** — `MonComposant.jsx` ✅
3. **Imports absolus via `@/`** — jamais de chemins relatifs (`../`, `../../`), toujours `@/components/...`, `@/styles/...`
4. **Props typées** — toujours déclarer `PropTypes` (ou types TypeScript si `.tsx`)
5. **Pas de CSS inline** — aucun `style={{ ... }}` dans le JSX, jamais
6. **Styles** — Tailwind ET/OU `styles/MonComposant.css` ; les deux coexistent selon le besoin

---

## Imports : règle `@/`

```jsx
// ✅ Correct
import MonComposant from '@/components/MonComposant';
import '@/styles/MonComposant.css';
import { maFonction } from '@/utils/helpers';

// ❌ Interdit
import MonComposant from '../../components/MonComposant';
import '../styles/MonComposant.css';
```

> `@/` pointe vers `src/` (ou racine du projet). Vérifier `jsconfig.json` ou `vite.config.js` si besoin.

---

## Styles : Tailwind ET/OU CSS

Les deux approches **coexistent** dans un même composant :
- **Tailwind** → layout, spacing, couleurs, typographie courante
- **`styles/MonComposant.css`** → animations keyframes, pseudo-éléments complexes, styles très spécifiques

Toujours créer et importer le fichier CSS si des styles custom sont nécessaires, même avec Tailwind.

---

## Template : Composant (Tailwind + CSS)

```jsx
// components/MonComposant.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '@/styles/MonComposant.css';

const MonComposant = ({ titre, description, onClick, actif }) => {
  return (
    <div className="mon-composant flex flex-col gap-2 p-4 rounded-lg shadow">
      <h2 className="mon-composant__titre text-xl font-semibold text-gray-800">
        {titre}
      </h2>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      <button
        className={`mon-composant__btn px-4 py-2 rounded font-medium transition-colors ${
          actif
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        onClick={onClick}
      >
        Action
      </button>
    </div>
  );
};

MonComposant.propTypes = {
  titre: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  actif: PropTypes.bool,
};

MonComposant.defaultProps = {
  description: '',
  actif: false,
};

export default MonComposant;
```

```css
/* styles/MonComposant.css */
.mon-composant {
  /* styles custom non couverts par Tailwind */
}
.mon-composant__btn {
  /* ex: animation, ::before, ::after */
}
```

---

## Template : Composant (CSS seul, sans Tailwind)

```jsx
// components/MonComposant.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '@/styles/MonComposant.css';

const MonComposant = ({ titre, description, onClick, actif }) => {
  return (
    <div className="mon-composant">
      <h2 className="mon-composant__titre">{titre}</h2>
      {description && (
        <p className="mon-composant__description">{description}</p>
      )}
      <button
        className={`mon-composant__btn${actif ? ' mon-composant__btn--actif' : ''}`}
        onClick={onClick}
      >
        Action
      </button>
    </div>
  );
};

MonComposant.propTypes = {
  titre: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  actif: PropTypes.bool,
};

MonComposant.defaultProps = {
  description: '',
  actif: false,
};

export default MonComposant;
```

```css
/* styles/MonComposant.css */
.mon-composant { ... }
.mon-composant__titre { ... }
.mon-composant__description { ... }
.mon-composant__btn { ... }
.mon-composant__btn--actif { ... }
```

---

## Template : Page

Les pages Katappult nécessitent un layout. Avant de coder, identifier le layout disponible :

```bash
ls frontend/layouts/ 2>/dev/null || ls frontend/_layouts/ 2>/dev/null
grep -A2 "getLayout" frontend/pages/index.js
```

```jsx
// pages/mon-tableau-de-bord/index.js
import React from 'react';
import MonComposant from '@/components/MonComposant';
import '@/styles/mon-tableau-de-bord.css'; // si styles custom pour la page
// Adapter selon le layout trouvé :
// Pattern A (fichier dédié) : import { getAdminLayout } from '@/layouts/AdminLayout';
// Pattern B (inline index.js) : import HomePage from '@/pages/index';

const MonTableauDeBord = () => {
  const handleClick = () => {
    // logique
  };

  return (
    <main className="flex flex-col gap-6 p-8">
      <MonComposant
        titre="Bienvenue"
        description="Description de la page"
        onClick={handleClick}
        actif={true}
      />
    </main>
  );
};

// Pattern A : MonTableauDeBord.getLayout = (page) => getAdminLayout(page);
// Pattern B : MonTableauDeBord.getLayout = HomePage.getLayout;
MonTableauDeBord.getLayout = /* layout découvert */ undefined;

export default MonTableauDeBord;
```

---

## Types PropTypes courants

| Type attendu | PropTypes |
|---|---|
| Texte | `PropTypes.string` |
| Nombre | `PropTypes.number` |
| Booléen | `PropTypes.bool` |
| Fonction | `PropTypes.func` |
| Tableau | `PropTypes.array` / `PropTypes.arrayOf(PropTypes.string)` |
| Objet | `PropTypes.object` / `PropTypes.shape({ id: PropTypes.number })` |
| Nœud React | `PropTypes.node` |
| Element React | `PropTypes.element` |
| Union de valeurs | `PropTypes.oneOf(['primaire', 'secondaire'])` |
| Requis | ajouter `.isRequired` |

---

## Checklist avant de générer un composant

- [ ] Dossier de page en **kebab-case** (`pages/mon-ecran/index.js`)
- [ ] Fichier composant en **PascalCase** (`components/MonComposant.jsx`)
- [ ] Tous les imports via **`@/`** — aucun chemin relatif
- [ ] Aucun `style={{ }}` dans le JSX
- [ ] Fichier CSS dans `styles/` créé et importé si styles custom nécessaires
- [ ] Classes Tailwind utilisées si Tailwind est présent dans le projet
- [ ] `PropTypes` déclarés pour chaque prop
- [ ] `defaultProps` pour les props optionnelles
- [ ] **Layout assigné** via `Page.getLayout` — layouts découverts avec `ls frontend/layouts/`

---

## Détection Tailwind

Chercher dans le projet :
- `tailwind.config.js` ou `tailwind.config.ts` à la racine
- `"tailwindcss"` dans `package.json`
- Classes Tailwind dans les fichiers existants

Si incertain, demander à l'utilisateur. Tailwind et CSS custom peuvent toujours coexister.