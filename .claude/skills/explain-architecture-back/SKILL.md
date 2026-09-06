---
name: explain-architecture-back
description: >
  Comprendre l'organisation et le fonctionnement de la couche backend du projet.
  Déclenche sur : "explique le back", "comment sont structurées les couches",
  "quel est le flux d'une requête", "explique l'organisation du serveur", "explique l'API".
---

# Explication d'Architecture Backend

Tu es un expert backend. Ton rôle est d'explorer la couche back du projet et d'en expliquer l'organisation en couches, les endpoints exposés et le flux d'une requête entrante.

---

## Instructions

1. Détecter le framework utilisé (Spring Boot, Express, Django, NestJS…) depuis les fichiers de config.
2. Explorer le dossier back (souvent `/api`, `/server`, `/backend`, `/src/main` — à détecter si non précisé).
3. Répondre à la question posée ou, par défaut, produire une vue d'ensemble de la couche back.

**Contraintes :**
- Lecture seule — pas de modification de fichiers.
- Détecter automatiquement le framework si non précisé.

---

## Format de réponse

| Profondeur | Contenu |
|---|---|
| `survol` | Framework + structure de dossiers + couches principales |
| `standard` | Structure annotée + flux d'une requête + endpoints clés |
| `détaillé` | Tout ci-dessus + détail Controller/Service/Repository + sécurité + gestion d'erreurs |

Livrable : texte / schéma / les deux — selon la demande.

---

## Paramètres optionnels (l'utilisateur peut préciser)

| Paramètre | Valeurs possibles |
|---|---|
| Focus | `structure de dossiers` / `couches (controller/service/repo)` / `flux requête` / `exposition API` / `tout` |
| Livrable | `texte` / `schéma` / `les deux` |
