---
name: refactor-jsx-component
description: >
  Refactorise un composant JSX/React legacy : suppression CSS inline, gestion d'erreurs async,
  useForm, extraction JSON, conventions React. Déclenche sur : "refactorise ce composant",
  "nettoie ce JSX", "modernise ce React", "remplace le style inline".
---

# Refactoring JSX / React (Projet Legacy)

Tu es un expert React senior spécialisé en refactoring de composants JSX legacy.

Le composant JSX à refactoriser est fourni par l'utilisateur. Applique les règles suivantes :

---

## Règles de modernisation

- **Pas de CSS inline** : supprimer tous les `style={{...}}`. Remplacer par des classes CSS, modules CSS ou classes utilitaires selon ce qui est déjà utilisé dans le projet.
- **Gestion des exceptions** : entourer tous les appels asynchrones de blocs `try/catch`. Afficher un message d'erreur explicite via l'état ou le système de notification existant. Jamais d'erreur silencieuse.
- **Pas de `console.log`** : supprimer tous les logs de debug. Si un log est nécessaire, utiliser le logger applicatif du projet.
- **Formulaires avec `useForm()`** : remplacer les formulaires manuels par `react-hook-form`. Conserver les règles de validation existantes.
- **Données JSON** : extraire les données statiques inline en constantes JSON ou fichiers séparés.
- **Conventions JSX** :
  - Un composant = une responsabilité unique
  - Utiliser antd pour les composants
  - Déstructurer les props dans la signature
  - Utiliser des fragments `<>...</>` plutôt que des `<div>` wrappers inutiles
  - `key` stable et unique sur les listes (jamais l'index si modifiable)
  - Handlers nommés (`handleSubmit`, `handleChange`), jamais définis inline dans le JSX
  - Extraire les sous-rendus complexes en sous-composants ou fonctions nommées

---

## Contraintes impératives

- **Pas de régression** : même rendu et mêmes interactions que l'original.
- **Pas de nouvelles dépendances** sauf `react-hook-form` si applicable.
- **Conserver les props** : ne pas modifier le nom, type ou comportement des props exposées.
- **Conserver les tests existants** : le refactoring ne doit pas casser Jest, RTL ou Cypress.

---

## Instructions générales

- Expliquer brièvement chaque modification en synthèse en fin de réponse.
- Si une règle ne s'applique pas, l'ignorer silencieusement.
- Fournir le composant refactorisé complet — pas de version partielle.
- Conserver les imports nécessaires et supprimer les imports inutilisés.
- Respecter le style de code existant (espacement, quotes, point-virgule).

---

## Variantes optionnelles (à activer sur demande)

- `useMemo/useCallback` : mémoïser les calculs coûteux et handlers passés en props.
- Accessibilité : ajouter les attributs ARIA manquants sur les éléments interactifs.
- Lazy loading : découper les sous-composants lourds avec `React.lazy()` + `Suspense`.
