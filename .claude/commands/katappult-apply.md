---
allowed-tools: Read, Bash, mcp__katappult__applyModel
argument-hint: [nom-attribut-ou-entite-attendu] (optionnel — pour la vérification finale)
description: Génère le code source depuis le modèle Katappult et l'applique au projet local (fichiers generated uniquement).
---

# katappult-apply — Génération et application du code source

## Rôle

Tu génères le code source complet depuis le modèle KatappultAI et tu l'appliques au projet local en mode UPDATE (uniquement les fichiers générés). **Ne pas entrer en plan mode. Exécuter immédiatement.**

---

## Étape 1 — Lire le projectId

**OBLIGATOIRE.** Lire `katappult.json` à la racine du projet courant :

```bash
cat katappult.json
```

Utiliser uniquement le `projectId` contenu dans ce fichier.

---

## Étape 2 — Générer le code source

Appeler `applyModel` avec le projectId. La réponse contient un champ `zipData` (base64) qui sera sauvegardé automatiquement dans un fichier par le système si la réponse est trop grande.

**Le contenu du ZIP dépend du `platformType` du projet** (masterAttribute sur Project, choisi à la
création, immuable) : WEB → `frontend/` uniquement, MOBILE_ANDROID → `mobile-flutter/` uniquement,
MICROSERVICE → backend uniquement (pas de `frontend/`), FULL_STACK_WEB → frontend + backend,
FULL_STACK_MOBILE_ANDROID → mobile + backend. L'absence de `src/`, `frontend/` ou `mobile-flutter/`
selon le type n'est **pas une erreur** — ne pas tenter de "compenser" en recréant ces dossiers à la
main. Un projet créé avant l'introduction de ce champ est traité comme FULL_STACK_WEB (comportement
historique inchangé).

---

## Étape 3 — Appliquer le ZIP en mode UPDATE

Le ZIP doit être appliqué **uniquement sur les chemins générés** pour ne pas écraser le code métier.

### Stratégie de copie

Deux règles selon le type de fichier :

| Type | Fichier existe localement | Fichier absent en local | Fichier local absent du ZIP |
|---|---|---|---|
| **Source générée** (`generated/`, `_generated/`) | Écraser | Copier | **Supprimer** (entité supprimée) |
| **Test** (`*IntegrationTests.java`) | **Ne pas écraser** | Copier | **Supprimer** (entité supprimée) |
| **AbstractGeneratedTests.java** | **Toujours protégé** | Copier | Conserver |

### Décoder le ZIP

```bash
# Si applyModel retourne le JSON directement :
echo "<zipData>" | base64 -d > /tmp/katappult-gen.zip

# Si la réponse a été sauvegardée dans un fichier :
cat <chemin-fichier> | python3 -c "import sys,json,base64; d=json.load(sys.stdin); open('/tmp/katappult-gen.zip','wb').write(base64.b64decode(d['zipData']))"
```

### Extraire et appliquer

```bash
# 1. Extraire dans un répertoire temporaire (hors projet)
TEMP_DIR="/tmp/katappult-extracted"
rm -rf "$TEMP_DIR"
unzip -q /tmp/katappult-gen.zip -d "$TEMP_DIR"

# 2. Synchroniser les répertoires de source générée — PILOTÉ PAR LE CONTENU DU ZIP.
#    Le ZIP est déjà filtré par le platformType côté serveur : tout dossier `generated` /
#    `_generated` présent dans le ZIP est à synchroniser ; un dossier ABSENT du ZIP a été exclu
#    par le platformType (ex. frontend/ pour un MICROSERVICE) — ne jamais le supprimer ni le recréer.
#    rsync --delete supprime localement les fichiers d'entités retirées du modèle.
#    frontend/pages/generated est exclu (une page supprimée localement est un choix de l'utilisateur).
find "$TEMP_DIR" \( -type d -name generated -o -type d -name _generated \) | while read -r ZIP_GEN; do
  REL="${ZIP_GEN#"$TEMP_DIR"/}"
  [ "$REL" = "frontend/pages/generated" ] && continue
  mkdir -p "$REL"
  rsync -a --delete "$ZIP_GEN/" "$REL/"
done

# 2bis. model.json (toujours dans le ZIP)
[ -f "$TEMP_DIR/src/main/resources/generator/model.json" ] && \
  cp "$TEMP_DIR/src/main/resources/generator/model.json" src/main/resources/generator/model.json

# 2ter. frontend/pages/generated — n'écraser que les pages déjà présentes localement
if [ -d "$TEMP_DIR/frontend/pages/generated" ]; then
  find "$TEMP_DIR/frontend/pages/generated" -type f | while read -r ZP; do
    REL="${ZP#"$TEMP_DIR"/}"
    [ -f "$REL" ] && cp "$ZP" "$REL"
  done
fi

# 3. Gérer les fichiers de test (stratégie préservation + nettoyage orphelins)
TEST_DIR="src/test/java/com/katappult/generated/integrationtests"
ZIP_TEST_DIR="$TEMP_DIR/$TEST_DIR"

if [ -d "$ZIP_TEST_DIR" ]; then
  mkdir -p "$TEST_DIR"

  # Supprimer les tests locaux dont l'entité n'existe plus dans le ZIP
  for LOCAL_TEST in "$TEST_DIR"/*IntegrationTests.java; do
    [ -f "$LOCAL_TEST" ] || continue
    FNAME=$(basename "$LOCAL_TEST")
    if [ ! -f "$ZIP_TEST_DIR/$FNAME" ]; then
      echo "Suppression test orphelin : $FNAME"
      rm "$LOCAL_TEST"
    fi
  done

  # Copier uniquement les NOUVEAUX tests (ne pas écraser les existants)
  for ZIP_TEST in "$ZIP_TEST_DIR"/*IntegrationTests.java; do
    [ -f "$ZIP_TEST" ] || continue
    FNAME=$(basename "$ZIP_TEST")
    LOCAL_FILE="$TEST_DIR/$FNAME"
    if [ ! -f "$LOCAL_FILE" ]; then
      echo "Ajout nouveau test : $FNAME"
      cp "$ZIP_TEST" "$LOCAL_FILE"
    fi
  done

  # AbstractGeneratedTests.java : copier seulement s'il n'existe pas encore
  ABSTRACT="$TEST_DIR/AbstractGeneratedTests.java"
  ZIP_ABSTRACT="$ZIP_TEST_DIR/AbstractGeneratedTests.java"
  if [ ! -f "$ABSTRACT" ] && [ -f "$ZIP_ABSTRACT" ]; then
    cp "$ZIP_ABSTRACT" "$ABSTRACT"
  fi
fi

# 4. Nettoyage
rm -rf "$TEMP_DIR" /tmp/katappult-gen.zip
```

---

## Étape 4 — Vérifier l'application

Build conditionné au type de projet (ne rien supposer) :

```bash
[ -f pom.xml ] && mvn compile -q -o
[ -f frontend/package.json ] && (cd frontend && npm run build --if-present)
```

Si un nom d'attribut ou d'entité est passé en `$ARGUMENTS`, vérifier sa présence dans les fichiers clés :

```bash
grep -rn "<ARGUMENTS>" \
  src/main/java/com/katappult/cloud/platform/generated/model/ \
  src/main/resources/changelogs/_generated/ \
  frontend/components/generated/
```

Confirmer :
- Le champ est présent **une seule fois** dans le modèle Java
- La colonne est présente dans le changelog Liquibase
- Le champ apparaît dans le formulaire frontend

---

## Règles

- **Ne jamais dézipper sur des fichiers non générés** — uniquement les chemins listés en étape 3
- **Ne jamais écraser les fichiers `*IntegrationTests.java` existants** — l'utilisateur peut les avoir adaptés à son projet ; copier uniquement les nouveaux, supprimer les orphelins (entité supprimée)
- **`AbstractGeneratedTests.java` est toujours protégé** — ne jamais l'écraser ; le copier seulement s'il n'existe pas encore
- **Ne jamais modifier manuellement** les fichiers extraits — ils seront écrasés à la prochaine génération
- En cas d'erreur MCP (session expirée, transport dropped), réessayer `applyModel` une fois — si une réponse a déjà été reçue, utiliser le fichier sauvegardé plutôt que de rappeler
- **Ne jamais déclarer un timeout avant 2 minutes 30 secondes** — `applyModel` génère jusqu'à 1200+ fichiers et prend du temps ; attendre la réponse complète avant de conclure à un échec
