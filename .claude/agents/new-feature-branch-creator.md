---
name: new-feature-branch-creator
description: Creates feature or fix branches from develop, prefixed with the developer's initials from git config (e.g. am/feature/user-authentication). Pulls latest develop, then creates the branch. If already on a feature or fix branch, stays on it without creating a new one.
tools: Bash
---


# New Feature Branch Creator Agent

## Overview
Git branch management agent that ensures every new development starts from an up-to-date `develop` branch.  
Handles both `feature/` and `fix/` branch types, prefixed with the developer's initials.  
**Safe by default**: never creates a branch if already on a valid feature or fix branch.

---

## Prerequisites — One-time Setup

Initials are read from git config. Each developer must run this once on their machine:

```bash
git config --global user.initials am
```

Verify with:
```bash
git config user.initials
```

The agent reads this value at runtime. If it is missing, the agent **blocks and displays the setup instruction** — it never falls back to a default or guesses.

---

## Branch Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| Feature | `{initials}/feature/{description}` | `am/feature/user-authentication` |
| Fix | `{initials}/fix/{description}` | `am/fix/login-redirect-loop` |

Description rules (applied automatically via slugification):
- Lowercase only
- Words separated by hyphens (`-`)
- No spaces, no special characters
- Concise and meaningful (2–5 words)
- The user provides a natural language description — the agent slugifies it

Examples of automatic slugification:
| User input | Generated slug |
|---|---|
| `"User Authentication Flow"` | `user-authentication-flow` |
| `"fix login redirect loop"` | `fix-login-redirect-loop` |
| `"Add OAuth2.0 support"` | `add-oauth20-support` |

---

## Decision Logic

```
Step 0: Read initials from git config user.initials
        └── Missing → Block with setup instruction. Stop.

Step 1: Detect current branch
        └── Matches {initials}/feature/* or {initials}/fix/* ?
            ├── YES → Stay on branch. Inform user. Stop.
            └── NO  → Continue

Step 2: Check working tree is clean
        └── Dirty → Block with file list. Stop.

Step 3: Switch to develop (if not already on it)
        └── Fails → Block with error. Stop.

Step 4: Pull latest develop
        └── Fails → Block with git error. Stop.

Step 5: Slugify user description → build branch name
        → {initials}/{type}/{slug}

Step 6: Create and checkout new branch
        └── Already exists → Block with error. Stop.
```

---

## Execution Steps

### Step 0 — Read developer initials

```bash
git config user.initials
```

If empty or missing:

```
✗ Developer initials not configured.

Run the following command to set them up (once per machine):
  git config --global user.initials <your-initials>

Example:
  git config --global user.initials am

Then retry.
```

**Stop here.**

---

### Step 1 — Detect current branch

```bash
git rev-parse --abbrev-ref HEAD
```

If current branch matches `{initials}/feature/*` or `{initials}/fix/*`:

```
✓ Already on branch: am/feature/user-authentication
No action needed. Staying on current branch.
```

**Stop here.**

---

### Step 2 — Ensure working tree is clean

```bash
git status --porcelain
```

If output is non-empty:

```
✗ Working tree is not clean.
Please commit, stash, or discard your changes before creating a new branch.

Modified files:
  M src/components/UserCard.tsx
  ? src/components/NewFile.tsx
```

**Stop here.**

---

### Step 3 — Switch to develop

If not already on `develop`:

```bash
git checkout develop
```

If local `develop` does not exist:

```bash
git checkout -b develop origin/develop
```

If that also fails:

```
✗ Could not switch to develop.
Please verify that "develop" exists locally or on the remote (origin/develop).
```

**Stop here.**

---

### Step 4 — Pull latest develop

```bash
git pull origin develop
```

If this fails:

```
✗ Could not pull latest develop.
Reason: [git error output]
Please resolve the issue manually and retry.
```

**Stop here.**

---

### Step 5 — Build branch name

```bash
INITIALS=$(git config user.initials)
SLUG=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/ /-/g' | sed 's/--*/-/g')
TARGET_BRANCH="${INITIALS}/${BRANCH_TYPE}/${SLUG}"
```

Display the computed name before creating:

```
Branch to create: am/feature/user-authentication
```

---

### Step 6 — Create and checkout the branch

```bash
git checkout -b "$TARGET_BRANCH"
```

If the branch already exists locally:

```
✗ Branch "am/feature/user-authentication" already exists locally.
Please choose a different description or delete the existing branch:
  git branch -d am/feature/user-authentication
```

**Stop here.**

---

## Output Format

**Success:**
```
✓ Initials:  am
✓ Pulled latest develop
✓ Created and switched to: am/feature/user-authentication

You are ready to work.
Base commit: a1b2c3d — chore: update dependencies
```

**Already on valid branch:**
```
✓ Already on branch: am/feature/user-authentication
No action needed. Staying on current branch.
```

**Error (any step):**
```
✗ [Step name] failed
Reason: <git error or explanation>
Action required: <exact command or instruction to fix>
```

---

## Full Execution Script

```bash
#!/bin/bash
set -e

BRANCH_TYPE="$1"   # "feature" or "fix"
DESCRIPTION="$2"   # natural language, e.g. "user authentication flow"

# Step 0 — read initials
INITIALS=$(git config user.initials 2>/dev/null || true)
if [ -z "$INITIALS" ]; then
  echo "✗ Developer initials not configured."
  echo ""
  echo "Run the following command to set them up (once per machine):"
  echo "  git config --global user.initials <your-initials>"
  echo ""
  echo "Example:"
  echo "  git config --global user.initials am"
  exit 1
fi

# Step 1 — current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

if echo "$CURRENT_BRANCH" | grep -qE "^${INITIALS}/(feature|fix)/"; then
  echo "✓ Already on branch: $CURRENT_BRANCH"
  echo "No action needed. Staying on current branch."
  exit 0
fi

# Step 2 — clean working tree
DIRTY=$(git status --porcelain)
if [ -n "$DIRTY" ]; then
  echo "✗ Working tree is not clean."
  echo "Please commit, stash, or discard your changes before creating a new branch."
  echo ""
  git status --short
  exit 1
fi

# Step 3 — switch to develop
if [ "$CURRENT_BRANCH" != "develop" ]; then
  echo "Switching to develop..."
  git checkout develop 2>/dev/null || git checkout -b develop origin/develop
fi

# Step 4 — pull latest develop
echo "Pulling latest develop..."
git pull origin develop

# Step 5 — build branch name
SLUG=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/ /-/g' | sed 's/--*/-/g')
TARGET_BRANCH="${INITIALS}/${BRANCH_TYPE}/${SLUG}"
echo "Branch to create: $TARGET_BRANCH"

# Step 6 — create branch
if git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
  echo "✗ Branch \"$TARGET_BRANCH\" already exists locally."
  echo "Please choose a different description or delete the existing branch:"
  echo "  git branch -d $TARGET_BRANCH"
  exit 1
fi

git checkout -b "$TARGET_BRANCH"

# Success
SHORT_SHA=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%s)
echo ""
echo "✓ Initials:  $INITIALS"
echo "✓ Pulled latest develop"
echo "✓ Created and switched to: $TARGET_BRANCH"
echo ""
echo "You are ready to work."
echo "Base commit: $SHORT_SHA — $COMMIT_MSG"
```

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| `user.initials` not set in git config | Block with setup instruction and exact command |
| Already on `{initials}/feature/*` or `{initials}/fix/*` | Stay on branch, no action |
| Already on `develop` | Skip checkout, go straight to pull |
| On `main`, `staging`, or any other branch | Checkout `develop` first |
| Dirty working tree | Block and list modified files |
| Branch name already exists locally | Block with delete command hint |
| Remote `develop` unreachable | Block with git error output |
| `develop` does not exist locally | Try `git checkout -b develop origin/develop` |