# Skill : Modification des MCP Tools Katappult

Guide pour ajouter, modifier ou supprimer des outils MCP exposés par la plateforme Katappult.

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `src/main/java/com/katappult/cloud/platform/mcp/tools/McpProjectTools.java` | Outils de gestion du cycle de vie projet : `createProject`, `checkoutProject`, `commitProject`, `renameProject`, `archiveProject`, `deleteProject` |
| `src/main/java/com/katappult/cloud/platform/mcp/tools/McpModelTools.java` | Outils de modèle de données : `addAttribute`, `addRelation`, `addFeature`, `applyChanges`, etc. |
| `src/main/java/com/katappult/cloud/platform/mcp/tools/McpWorkflowTools.java` | Outils de workflow : `updateEntityWorkflow`, `resetEntityWorkflow`, `getEntityWorkflow` |
| `src/test/java/com/katappult/cloud/platform/tests/unitarytests/McpProjectTools_unit_Tests.java` | Tests unitaires des outils projet |
| `mcp-integration.md` | Documentation des MCP tools (à maintenir à jour) |

## Workflow projet : checkout → modify → commit

**Règle fondamentale :** le projet **reste en mode checked-out** après chaque modification. C'est l'utilisateur qui valide via `commitProject`.

```
checkoutProject(id)         ← optionnel, auto-checkout si non ouvert
addAttribute / addRelation / applyChanges / updateEntityWorkflow / renameProject...
  → projet reste en working copy (locked=true)
commitProject(id)           ← validation explicite : seul appel à workableService.checkin()
```

## Patterns à respecter

### Outil de LECTURE (pas de modification d'état)
```java
@Tool(description = "...")
@Transactional(propagation = Propagation.NOT_SUPPORTED)
public String monOutil(String projectInternalId) {
    Project project = getReadableProject(projectInternalId);
    // ...lecture seule, pas de checkout, pas de checkin
}
```

### Outil de MODIFICATION du modèle de données
```java
@Tool(description = "... Le projet reste en mode édition après cette opération. Appelez commit_project pour valider.")
@Transactional(propagation = Propagation.REQUIRES_NEW)
public String monOutil(String projectInternalId, ...) {
    try {
        Project wc = acquireWorkingCopy(projectInternalId);  // ← auto-checkout si nécessaire
        byte[] data = contentHolderService.downloadPrimaryContent(wc);
        ProjectConfig config = ProjectConfigMapper.deserialize(data);
        // ... modifications sur config ...
        saveWorkingCopy(wc, config);  // ← PAS de checkin, projet reste ouvert
        return mapper.writeValueAsString(new McpSuccessDTO(true));
    } catch (Exception e) {
        return error("mon_outil failed: " + e.getClass().getSimpleName() + " – " + e.getMessage());
    }
}
```

### Outil de MODIFICATION de workflow
```java
@Tool(description = "... Le projet reste en mode édition après cette opération.")
@Transactional(propagation = Propagation.REQUIRES_NEW)
public String monOutil(String projectInternalId, ...) {
    try {
        Project project = getOrCheckoutWorkingCopy(projectInternalId);  // ← auto-checkout
        // ... modifications workflow ...
        project = customProjectService.updateWorkflow(project, gson.toJson(workFlow));
        // PAS de checkin ici — commitProject s'en charge
        return mapper.writeValueAsString(new McpSuccessDTO(true));
    } catch (Exception e) {
        return error("...");
    }
}
```

### INTERDITS dans les outils de modification
- `workableService.checkin(...)` → uniquement dans `commitProject`
- `releaseWorkingCopy(...)` → renommé `saveWorkingCopy` (sans checkin)

## DTOs de réponse disponibles

| DTO | Utilisation |
|---|---|
| `McpSuccessDTO(true)` | Succès simple |
| `McpErrorDTO(message)` | Erreur (via `error(message)`) |
| `McpMessageDTO(true, message)` | Succès avec message texte |
| `ProjectSummaryDTO(internalId, name, theme, workingCopy, locked)` | Résumé d'un projet |

Pour les réponses complexes, utiliser un **record Java** :
```java
record MonResultatDTO(boolean success, String champA, int champB) {}
return mapper.writeValueAsString(new MonResultatDTO(true, "...", 42));
```

## Conventions Java obligatoires

- **Lombok** sur toutes les classes Java (hors records) : `@Component`, `@RequiredArgsConstructor`
- **Records** pour les DTOs simples en lecture seule
- Pas de constructeur manuel, pas de getters/setters manuels si Lombok suffit
- `@Transactional(propagation = Propagation.REQUIRES_NEW)` sur tous les outils d'écriture
- `@Transactional(propagation = Propagation.NOT_SUPPORTED)` sur les outils de lecture

## Tests unitaires

Chaque outil doit avoir au minimum :
1. Un test de succès (projet correctement stubbé)
2. Un test d'erreur (projet non trouvé / pas de working copy)

Pattern de stub pour les outils qui utilisent `requireWorkingCopy` ou `acquireWorkingCopy` :
```java
// Stub OBLIGATOIRE pour les 3 niveaux
Project project = projectWithWorkInfo(true);
ProjectMaster master = masterWith("id-x", "X");
Project wc = projectWithWorkInfo(true);
when(customProjectService.getLatestIterationByInternalId("id-x")).thenReturn(project);
when(versionedService.getIteratedMaster(project)).thenReturn(master);
when(workableService.getWorkingCopy(master)).thenReturn(wc);
```

Vérifier que `workableService.checkin()` N'EST PAS appelé sur les outils de modification :
```java
verify(workableService, never()).checkin(any(Project.class), any());
```

## Commande de vérification rapide

```bash
# Compilation
mvn compile -q

# Tests unitaires MCP
mvn test -pl . -Dtest=McpProjectTools_unit_Tests -q

# Vérifier qu'aucun outil de modification n'appelle checkin (sauf commitProject)
grep -n "workableService.checkin" \
  src/main/java/com/katappult/cloud/platform/mcp/tools/McpModelTools.java \
  src/main/java/com/katappult/cloud/platform/mcp/tools/McpWorkflowTools.java
# → doit retourner 0 résultat
```

## Documentation à maintenir

Après chaque ajout/modification d'outil, mettre à jour `mcp-integration.md` :
- Tableau des outils de la catégorie concernée
- Ajouter l'outil dans les workflows pertinents (section 11)
- Si le nouvel outil fait partie du flow checkout→commit, l'ajouter à la séquence
