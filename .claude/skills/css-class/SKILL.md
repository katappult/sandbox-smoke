---
name: css-class
description: Créer, modifier ou générer des classes CSS en suivant les conventions du projet. Utiliser ce skill dès que l'utilisateur mentionne : créer un style, écrire du CSS, ajouter une classe CSS, styler un composant, fichier .css, variables CSS, thème, mode sombre, dark mode, light mode. Aussi déclencher pour toute demande de style visuel d'un composant ou d'une page React du projet.
---

# Skill : Classes CSS

## Conventions du projet

### Règles absolues

1. **Variables CSS obligatoires** pour : `border-radius`, `gap`, `background`, `font-family`, `font-size`, `color`, `border-color`, `box-shadow`
2. **Jamais de valeurs brutes** pour ces propriétés — toujours `var(--nom-variable)`
3. **Mode light ET dark** — toujours déclarer les deux via `[data-theme="dark"]` ou `prefers-color-scheme`
4. **Fichier** → `styles/MonComposant.css`, importé via `@/styles/MonComposant.css`
5. **Nommage BEM** pour les classes (`.bloc__element--modificateur`)

---

## Structure des variables CSS

Les variables globales sont déclarées dans `styles/variables.css` (ou `styles/global.css`).  
Chaque composant utilise ces variables — il ne redéclare jamais ses propres valeurs brutes.

### Template `styles/variables.css`

```css
/* ============================================
   VARIABLES GLOBALES — MODE LIGHT (défaut)
   ============================================ */
:root {
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Gap / spacing */
  --gap-xs: 4px;
  --gap-sm: 8px;
  --gap-md: 16px;
  --gap-lg: 24px;
  --gap-xl: 32px;

  /* Backgrounds */
  --bg-base: #ffffff;
  --bg-surface: #f5f5f5;
  --bg-elevated: #eeeeee;
  --bg-overlay: rgba(0, 0, 0, 0.04);

  /* Couleurs de texte */
  --color-text-primary: #111111;
  --color-text-secondary: #555555;
  --color-text-disabled: #aaaaaa;
  --color-text-inverse: #ffffff;

  /* Couleurs d'accent */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-danger: #dc2626;
  --color-success: #16a34a;

  /* Border colors */
  --border-color-default: #e2e8f0;
  --border-color-focus: #2563eb;
  --border-color-error: #dc2626;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Typography */
  --font-family-base: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-md: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
}

/* ============================================
   MODE DARK
   ============================================ */
[data-theme="dark"] {
  /* Backgrounds */
  --bg-base: #0f0f0f;
  --bg-surface: #1a1a1a;
  --bg-elevated: #242424;
  --bg-overlay: rgba(255, 255, 255, 0.05);

  /* Couleurs de texte */
  --color-text-primary: #f0f0f0;
  --color-text-secondary: #aaaaaa;
  --color-text-disabled: #555555;
  --color-text-inverse: #111111;

  /* Couleurs d'accent */
  --color-primary: #3b82f6;
  --color-primary-hover: #60a5fa;
  --color-danger: #f87171;
  --color-success: #4ade80;

  /* Border colors */
  --border-color-default: #2e2e2e;
  --border-color-focus: #3b82f6;
  --border-color-error: #f87171;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);

  /* Typography — inchangées en dark */
  /* --font-family-base, --font-size-* : pas besoin de redéclarer */
}

/* Fallback : respecter la préférence système si pas de data-theme */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-base: #0f0f0f;
    --bg-surface: #1a1a1a;
    --bg-elevated: #242424;
    --bg-overlay: rgba(255, 255, 255, 0.05);
    --color-text-primary: #f0f0f0;
    --color-text-secondary: #aaaaaa;
    --color-text-disabled: #555555;
    --color-text-inverse: #111111;
    --color-primary: #3b82f6;
    --color-primary-hover: #60a5fa;
    --color-danger: #f87171;
    --color-success: #4ade80;
    --border-color-default: #2e2e2e;
    --border-color-focus: #3b82f6;
    --border-color-error: #f87171;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Template : Classe CSS d'un composant

```css
/* styles/MonComposant.css */

.mon-composant {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
  padding: var(--gap-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-color-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-family-base);
}

.mon-composant__titre {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
}

.mon-composant__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.mon-composant__btn {
  padding: var(--gap-sm) var(--gap-md);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-family: var(--font-family-base);
  font-size: var(--font-size-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.mon-composant__btn:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}

.mon-composant__btn--actif {
  border-color: var(--border-color-focus);
}
```

> Pas de valeur brute pour les propriétés listées. Exemple interdit : `border-radius: 8px` → utiliser `border-radius: var(--radius-md)`.

---

## Propriétés → variables à utiliser

| Propriété CSS | Variables disponibles |
|---|---|
| `border-radius` | `--radius-sm` `--radius-md` `--radius-lg` `--radius-full` |
| `gap` / `padding` / `margin` | `--gap-xs` `--gap-sm` `--gap-md` `--gap-lg` `--gap-xl` |
| `background` / `background-color` | `--bg-base` `--bg-surface` `--bg-elevated` `--bg-overlay` |
| `color` (texte) | `--color-text-primary` `--color-text-secondary` `--color-text-disabled` `--color-text-inverse` |
| `color` (accent) | `--color-primary` `--color-primary-hover` `--color-danger` `--color-success` |
| `border-color` | `--border-color-default` `--border-color-focus` `--border-color-error` |
| `box-shadow` | `--shadow-sm` `--shadow-md` `--shadow-lg` |
| `font-family` | `--font-family-base` `--font-family-mono` |
| `font-size` | `--font-size-xs` `--font-size-sm` `--font-size-md` `--font-size-lg` `--font-size-xl` `--font-size-2xl` |

---

## Mode dark : ce qui change et ce qui ne change pas

| Catégorie | Change en dark ? |
|---|---|
| Backgrounds | ✅ oui |
| Couleurs de texte | ✅ oui |
| Couleurs d'accent | ✅ oui (versions plus claires) |
| Border colors | ✅ oui |
| Shadows | ✅ oui (plus opaques) |
| Font family | ❌ non |
| Font size | ❌ non |
| Border radius | ❌ non |
| Gap / spacing | ❌ non |

---

## Checklist avant de générer du CSS

- [ ] Toutes les valeurs de `border-radius`, `gap`, `background`, `font-family`, `font-size`, `color`, `border-color`, `box-shadow` utilisent `var(--...)`
- [ ] Aucune valeur brute pour ces propriétés (pas de `#fff`, `8px`, `rgba(...)` en direct)
- [ ] Les variables sont définies dans `styles/variables.css` (light) et `[data-theme="dark"]` (dark)
- [ ] Le fallback `prefers-color-scheme: dark` est présent dans `variables.css`
- [ ] Le fichier CSS est dans `styles/` et importé via `@/styles/MonComposant.css`