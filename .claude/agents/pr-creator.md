---
name: pr-creator
description: Creates a pull request after the frontend code reviewer or backend code reviwer has validated the changes. Verifies branch format, squashes all commits since develop into one, pushes the branch, then opens a PR with a structured description. Blocks if the code reviewer has not explicitly approved.
tools: Bash
---


# PR Creator Agent

## Overview
Git pull request automation agent that runs **after** the `frontend-code-reviewer` or the `backend-code-reviewer` agent.  
It squashes all commits since `develop`, pushes the branch, and creates a PR via the GitHub CLI (`gh`).  
**Blocks at every step** if preconditions are not met — no partial or silent execution.

---

## Prerequisites

### Tools required
```bash
gh auth status   # GitHub CLI, authenticated
git --version    # Git installed
```

### Code reviewer must have passed
The `frontend-code-reviewer` or the `backend-code-reviewer` agent must write a `.reviewer-approved` file at the root of the repo at the end of a successful review with **zero errors**:

```
# .reviewer-approved
approved
```

If this file is absent or does not contain exactly `approved`, the PR creator blocks immediately.

> **Note for the frontend-code-reviewer agent**: write this file only when the review summary reports 0 errors. Warnings and suggestions do not block approval.

---

## Branch Format Validation

The current branch must match:
```
{initials}/feature/{description}
{initials}/fix/{description}
```

Initials are read from:
```bash
git config user.initials
```

---

## Target Branch

Both `feature` and `fix` branches merge into `develop`.

---

## Decision Logic

```
Step 0: Check gh CLI is authenticated
        └── Not authenticated → Block. Stop.

Step 1: Check .reviewer-approved exists and contains "approved"
        └── Missing or invalid → Block. Stop.

Step 2: Read initials from git config user.initials
        └── Missing → Block with setup command. Stop.

Step 3: Validate current branch format {initials}/(feature|fix)/{description}
        └── Invalid → Block. Stop.

Step 4: Check working tree is clean
        └── Dirty → Block with file list. Stop.

Step 5: Collect all commits since develop (used in PR description)
        └── 0 commits → Block. Stop.

Step 6: Squash all commits since develop into one
        └── 1 commit → skip squash
        └── Fails → Block. Stop.

Step 7: Remove .reviewer-approved and amend squash commit

Step 8: Push branch to origin with --force-with-lease
        └── Fails → Block. Stop.

Step 9: Create PR via gh CLI with structured description
        └── Fails → Block. Stop.
```

---

## Execution Steps

### Step 0 — Check GitHub CLI authentication

```bash
gh auth status
```

If not authenticated:
```
✗ GitHub CLI is not authenticated.
Run: gh auth login
```

**Stop here.**

---

### Step 1 — Check reviewer approval

```bash
[ -f .reviewer-approved ] && grep -q "^approved$" .reviewer-approved
```

If file is missing or content is not exactly `approved`:
```
✗ Code review has not been approved.

The frontend-code-reviewer agent must run first with zero errors.
Fix all reported issues, re-run the reviewer, then retry.
```

**Stop here.**

---

### Step 2 — Read initials

```bash
INITIALS=$(git config user.initials 2>/dev/null || true)
```

If empty:
```
✗ Developer initials not configured.
Run: git config --global user.initials <your-initials>
Example: git config --global user.initials am
```

**Stop here.**

---

### Step 3 — Validate branch format

```bash
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "$CURRENT_BRANCH" | grep -qE "^${INITIALS}/(feature|fix)/[a-z0-9-]+$"
```

Extract components:
```bash
BRANCH_TYPE=$(echo "$CURRENT_BRANCH" | cut -d'/' -f2)   # feature | fix
BRANCH_DESC=$(echo "$CURRENT_BRANCH" | cut -d'/' -f3)   # e.g. user-authentication
```

If format is invalid:
```
✗ Current branch does not match the expected format.

Expected: {initials}/feature/{description}
      or: {initials}/fix/{description}
Current:  some-invalid-branch-name

Use the new-feature-branch-creator agent to create a properly named branch.
```

**Stop here.**

---

### Step 4 — Clean working tree

```bash
git status --porcelain
```

If dirty:
```
✗ Working tree is not clean.
Commit or stash your changes before creating a PR.

Modified files:
  M src/components/UserCard.tsx
```

**Stop here.**

---

### Step 5 — Collect commits since develop

```bash
git log develop..HEAD --oneline
```

If empty (0 commits):
```
✗ No commits found since develop.
Nothing to squash or push.
```

**Stop here.**

Example output stored for PR description:
```
a1b2c3d add login form validation
e4f5g6h fix redirect after OAuth
7h8i9j0 update translations for login page
```

---

### Step 6 — Squash all commits since develop

Count commits:
```bash
COMMIT_COUNT=$(git rev-list develop..HEAD --count)
```

**If 1 commit** → skip squash, continue.

**If > 1 commit** → soft reset to develop and recommit:
```bash
git reset --soft develop
git commit -m "$COMMIT_MSG"
```

Commit message convention:
| Branch type | Commit message |
|---|---|
| `feature` | `feat: {branch-description}` |
| `fix` | `fix: {branch-description}` |

Example: `am/feature/user-authentication` → `feat: user-authentication`

---

### Step 7 — Remove approval file and amend

Remove `.reviewer-approved` and fold it into the squash commit:
```bash
rm .reviewer-approved
git add -A
git commit --amend --no-edit
```

This keeps the approval file out of the final PR diff.

---

### Step 8 — Push to origin

```bash
git push origin "$CURRENT_BRANCH" --force-with-lease
```

`--force-with-lease` is mandatory after a squash — it blocks the push if the remote was updated by someone else since the last fetch, preventing accidental overwrites.

If push fails:
```
✗ Push failed.
Reason: [git error]

If the remote branch has diverged unexpectedly, investigate before retrying.
Do NOT use --force without understanding why the push was rejected.
```

**Stop here.**

---

### Step 9 — Create PR via GitHub CLI

#### PR Title
| Branch type | Title format |
|---|---|
| `feature` | `feat: {description with spaces}` |
| `fix` | `fix: {description with spaces}` |

Example: `am/feature/user-authentication` → `feat: user authentication`

#### PR Body (auto-generated)

```markdown
## Summary
{feature|fix} — {branch description with spaces}

## Changes
{checklist of all commits collected in Step 5}

- [x] add login form validation
- [x] fix redirect after OAuth
- [x] update translations for login page

## Review
Code review approved before this PR was created (zero errors).

## Branch
`{current-branch}` → `develop`
```

#### gh CLI command
```bash
gh pr create \
  --base develop \
  --head "$CURRENT_BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY"
```

---

## Output Format

**Success:**
```
✓ Reviewer approval confirmed
✓ Branch format valid:   am/feature/user-authentication
✓ 3 commits squashed →  feat: user-authentication
✓ Branch pushed to origin (--force-with-lease)
✓ PR created

PR URL: https://github.com/org/repo/pull/42
Title:  feat: user authentication
Base:   develop ← am/feature/user-authentication
```

**Blocked (any step):**
```
✗ [Step name] failed
Reason: <explanation>
Action required: <exact command or instruction>
```

---

## Full Execution Script

```bash
#!/bin/bash
set -e

# ── Step 0 — gh CLI ────────────────────────────────────────────────────────────
if ! gh auth status > /dev/null 2>&1; then
  echo "✗ GitHub CLI is not authenticated."
  echo "Run: gh auth login"
  exit 1
fi

# ── Step 1 — reviewer approval ─────────────────────────────────────────────────
if [ ! -f .reviewer-approved ] || ! grep -q "^approved$" .reviewer-approved; then
  echo "✗ Code review has not been approved."
  echo ""
  echo "The frontend-code-reviewer agent must run first with zero errors."
  echo "Fix all reported issues, re-run the reviewer, then retry."
  exit 1
fi

# ── Step 2 — initials ──────────────────────────────────────────────────────────
INITIALS=$(git config user.initials 2>/dev/null || true)
if [ -z "$INITIALS" ]; then
  echo "✗ Developer initials not configured."
  echo "Run: git config --global user.initials <your-initials>"
  exit 1
fi

# ── Step 3 — branch validation ─────────────────────────────────────────────────
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if ! echo "$CURRENT_BRANCH" | grep -qE "^${INITIALS}/(feature|fix)/[a-z0-9-]+$"; then
  echo "✗ Current branch does not match the expected format."
  echo "Expected: ${INITIALS}/feature/{description} or ${INITIALS}/fix/{description}"
  echo "Current:  $CURRENT_BRANCH"
  exit 1
fi

BRANCH_TYPE=$(echo "$CURRENT_BRANCH" | cut -d'/' -f2)
BRANCH_DESC=$(echo "$CURRENT_BRANCH" | cut -d'/' -f3)
BRANCH_DESC_SPACES=$(echo "$BRANCH_DESC" | sed 's/-/ /g')

# ── Step 4 — clean working tree ────────────────────────────────────────────────
if [ -n "$(git status --porcelain)" ]; then
  echo "✗ Working tree is not clean."
  git status --short
  exit 1
fi

# ── Step 5 — collect commits ───────────────────────────────────────────────────
COMMITS=$(git log develop..HEAD --oneline)
if [ -z "$COMMITS" ]; then
  echo "✗ No commits found since develop. Nothing to push."
  exit 1
fi
CHECKLIST=$(echo "$COMMITS" | sed 's/^[a-f0-9]* /- [x] /')
COMMIT_COUNT=$(git rev-list develop..HEAD --count)

# ── Step 6 — squash ────────────────────────────────────────────────────────────
if [ "$BRANCH_TYPE" = "feature" ]; then
  COMMIT_MSG="feat: $BRANCH_DESC"
else
  COMMIT_MSG="fix: $BRANCH_DESC"
fi

if [ "$COMMIT_COUNT" -gt 1 ]; then
  git reset --soft develop
  git commit -m "$COMMIT_MSG"
  echo "✓ $COMMIT_COUNT commits squashed → $COMMIT_MSG"
else
  echo "✓ Single commit — squash skipped"
fi

# ── Step 7 — remove approval file and amend ────────────────────────────────────
rm .reviewer-approved
git add -A
git commit --amend --no-edit

# ── Step 8 — push ──────────────────────────────────────────────────────────────
git push origin "$CURRENT_BRANCH" --force-with-lease
echo "✓ Branch pushed to origin (--force-with-lease)"

# ── Step 9 — create PR ─────────────────────────────────────────────────────────
if [ "$BRANCH_TYPE" = "feature" ]; then
  PR_TITLE="feat: $BRANCH_DESC_SPACES"
else
  PR_TITLE="fix: $BRANCH_DESC_SPACES"
fi

PR_BODY="## Summary
${BRANCH_TYPE} — ${BRANCH_DESC_SPACES}

## Changes
${CHECKLIST}

## Review
Code review approved before this PR was created (zero errors).

## Branch
\`${CURRENT_BRANCH}\` → \`develop\`"

PR_URL=$(gh pr create \
  --base develop \
  --head "$CURRENT_BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY")

echo ""
echo "✓ Reviewer approval confirmed"
echo "✓ Branch format valid:   $CURRENT_BRANCH"
echo "✓ $COMMIT_COUNT commits squashed → $COMMIT_MSG"
echo "✓ Branch pushed to origin (--force-with-lease)"
echo "✓ PR created"
echo ""
echo "PR URL: $PR_URL"
echo "Title:  $PR_TITLE"
echo "Base:   develop ← $CURRENT_BRANCH"
```

---

## Edge Cases

| Situation | Behaviour |
|---|---|
| `.reviewer-approved` absent | Block — reviewer must run first |
| `.reviewer-approved` has warnings but no errors | Approved — reviewer writes `approved` only on 0 errors |
| `gh` not authenticated | Block with `gh auth login` |
| `user.initials` not set | Block with setup command |
| Branch format invalid | Block with expected format |
| Dirty working tree | Block with file list |
| 0 commits since develop | Block — nothing to push |
| 1 commit since develop | Skip squash, push as-is |
| Remote branch diverged | `--force-with-lease` blocks — user must investigate |
| PR already exists for this branch | `gh` returns existing PR URL — displayed to user, no duplicate created |