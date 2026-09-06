# Système de thèmes (multi-client)

Ce document explique comment fonctionne le système de thèmes et comment déployer l'application pour un nouveau client.

---

## Principe

Les couleurs et la police de caractères sont définies **par client** dans un catalogue centralisé (`styles/themes/index.js`). Au moment du build Next.js, le thème sélectionné est injecté comme un bloc `<style>` dans le `<head>` du HTML via `pages/_document.js`.

Cela signifie :
- Aucun import conditionnel fragile.
- Aucun changement dans les composants — tout le code utilise les variables CSS (`--color-1`, `--font-family`, etc.).
- Un seul paramètre à changer par déploiement : la variable d'environnement `NEXT_PUBLIC_THEME`.

---

## Fichiers concernés

| Fichier | Rôle |
|---|---|
| `styles/themes/index.js` | Catalogue des thèmes (couleurs + police) |
| `pages/_document.js` | Lit `NEXT_PUBLIC_THEME` et injecte les variables CSS dans `<head>` |
| `styles/brand_1.css` | Variables stables non liées au thème (espacements, échelles de texte, bordures) |

---

## Propriétés d'un thème

### Couleurs de la palette

Pour chaque couleur (`color1`, `color2`, `color3`), les variantes d'opacité sont auto-générées.

### Couleurs du shell (topbar / sidebar / fond)

| Propriété | Variable CSS générée | Rôle | Défaut |
|---|---|---|---|
| `layoutBg` | `--layout-bg` | Fond de page (visible entre les éléments) | `#eef0f3` |
| `topbarBg` | `--topbar-bg` | Fond de la barre du haut | `#ffffff` |
| `topbarText` | `--topbar-text` | Texte et icônes de la topbar | `#101828` |
| `sidebarBg` | `--sidebar-bg` | Fond du menu de gauche | `#ffffff` |
| `sidebarText` | `--sidebar-text` | Texte des items du sidebar | `#344054` |
| `contentBg` | `--content-bg` | Fond de la zone de contenu principale | `#ffffff` |
| `contentBorder` | `--content-border` | Bordure de la zone de contenu (`"none"` ou `"1px solid #…"`) | `"none"` |

> **`.ant-menu-light`** — Ant Design force `background: white` sur ses menus. Le système surcharge cela avec `var(--sidebar-bg)` via des sélecteurs CSS globaux (`ant-menu`, `ant-menu-light`, `ant-menu-root`).

### Exemple — sidebar sombre

```js
sidebarBg:  "#1e1b4b",   // fond violet foncé
sidebarText:"#c7d2fe",   // texte indigo clair
```

### Exemple — topbar coloré

```js
topbarBg:   "#0D9488",   // fond teal
topbarText: "#ffffff",   // texte blanc
```

---

## Variables CSS générées par thème

Pour chaque couleur définie dans un thème (`color1`, `color2`, `color3`), le système génère automatiquement les variantes d'opacité suivantes :

```css
--color-1:              #007aff;        /* couleur pleine */
--opacity-100-color-1:  rgb(0 122 255 / 1);
--opacity-70-color-1:   rgb(0 122 255 / 0.7);
--opacity-50-color-1:   rgb(0 122 255 / 0.5);
--opacity-30-color-1:   rgb(0 122 255 / 0.3);   /* fonds clairs, badges */
--opacity-10-color-1:   rgb(0 122 255 / 0.1);
```

Ainsi que :
```css
--font-family: 'Nunito';
--accent-color: var(--color-3);
--admin-menu-background-color: var(--opacity-30-color-1);
```

---

## Thèmes disponibles

### `default` — Katappult.ai

```js
fontFamily: "Nunito",
color1: "#007aff",   // bleu primaire
color2: "#39BCC5",   // cyan secondaire
color3: "#EF6601",   // orange accent
```

### `clientA`

```js
fontFamily: "Inter",
color1: "#6941C6",   // violet primaire
color2: "#7F56D9",   // violet secondaire
color3: "#F79009",   // orange accent
```

### `clientB`

```js
fontFamily: "Poppins",
color1: "#0D9488",   // vert-bleu primaire
color2: "#14B8A6",   // teal secondaire
color3: "#F43F5E",   // rose accent
```

---

## Changer de thème pour un déploiement

### En développement (`.env.local`)

```env
NEXT_PUBLIC_THEME=default
```

### En production (`.env.production` du client)

```env
NEXT_PUBLIC_THEME=clientA
```

Puis builder normalement :

```bash
npm run build
npm run start
```

---

## Ajouter un thème pour un nouveau client

### Étape 1 — Ouvrir `styles/themes/index.js`

Ajouter une entrée dans l'objet `THEMES` :

```js
monClient: {
    fontFamily: "DM Sans",
    fontUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap",
    color1: "#16A34A",   // couleur principale (boutons, liens, sidebar active)
    color2: "#22C55E",   // couleur secondaire
    color3: "#F59E0B",   // couleur d'accent (badges, highlights)
},
```

La clé de l'objet (`monClient`) devient la valeur de `NEXT_PUBLIC_THEME`.

> **Police** : n'importe quelle famille disponible sur [Google Fonts](https://fonts.google.com). Copier l'URL `@import` fournie par Google Fonts dans le champ `fontUrl`.

### Étape 2 — Configurer l'environnement du client

Dans le fichier `.env.production` du déploiement client :

```env
NEXT_PUBLIC_THEME=monClient
```

### Étape 3 — Builder et déployer

```bash
npm run build
```

C'est tout. Aucune autre modification n'est nécessaire.

---

## Comment utiliser les variables dans le CSS

Dans n'importe quel fichier CSS Module ou global :

```css
/* Couleur principale */
background: var(--color-1);
color: var(--color-1);

/* Fond clair de la couleur principale (badges, sélections) */
background: var(--opacity-30-color-1);

/* Police */
font-family: var(--font-family), sans-serif;

/* Accent */
color: var(--accent-color);
```

Ne jamais coder des couleurs en dur (`#007aff`) dans les composants — toujours utiliser les variables CSS pour que le thème s'applique correctement.

---

## Diagnostic

Si le thème ne s'applique pas :

1. Vérifier que `NEXT_PUBLIC_THEME` correspond bien à une clé existante dans `styles/themes/index.js` (sensible à la casse).
2. En cas de clé inconnue, le système bascule automatiquement sur `default`.
3. Le bloc `<style>` injecté est visible dans l'inspecteur du navigateur → `<head>` → premier `<style>`.
4. Après avoir modifié `styles/themes/index.js` ou `.env`, relancer `npm run build` (les variables d'environnement `NEXT_PUBLIC_*` sont résolues au build, pas au runtime).
