---
name: responsive-design
description: Implements or modifies styles, responsive layout, and multi-client theming. Triggered when the user wants to apply brand CSS variables, Tailwind, CSS Modules, handle dark mode, or add a client theme.
---

# Skill: responsive-design

Used when the user asks to implement or modify styling, responsive layout, or component theming.

## Theming System (CSS Variables)

**Never hardcode brand colors.** Always use CSS variables:

```css
/* Primary colors */
var(--color-1)
var(--opacity-30-color-1)
var(--topbar-bg)

/* See frontend/docs/theming.md for the full variable reference */
```

CSS variables are injected into `<head>` by `frontend/pages/_document.js` from the catalog in `frontend/styles/themes/index.js`.

To add a client theme:
1. Add an entry to `THEMES` in `frontend/styles/themes/index.js`
2. Set `NEXT_PUBLIC_THEME` in their `.env.production`

## CSS Rules

### Usage Priority

| Use case | Method |
|---|---|
| Layout and spacing | **Tailwind CSS** |
| Component-specific styles | **CSS Modules** |
| Third-party component overrides | `frontend/styles/brand_1.css` |
| Inline styles | **Forbidden** |

### CSS Modules — Critical Rule

**Never use `:global()` inside a CSS Module** — Next.js rejects it ("Selector is not pure").

Third-party component overrides (e.g. `react-phone-number-input`) must go in `frontend/styles/brand_1.css`.

### Existing Shared CSS Files

- `frontend/styles/pages/Profile.module.css` — shared styles for profile-style pages; reused by admin user detail views
- `frontend/styles/components/UserDrawer.module.css` — avatar, status badges, search bar, table rows, action buttons for user management

## Dark Mode

Every component must support both light and dark mode. Use theming CSS variables (they adapt automatically to the active mode).

## Responsive Layout

Use Tailwind utilities for responsive behavior:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>
```

## Checklist

- [ ] No hardcoded colors — use `var(--color-1)` etc.
- [ ] Layout via Tailwind CSS
- [ ] Component styles via CSS Modules
- [ ] No `:global()` in CSS Modules
- [ ] Third-party overrides in `brand_1.css`
- [ ] Component tested in both light and dark mode
- [ ] No inline styles
