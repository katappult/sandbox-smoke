---
name: refactor-java-class
description: >
  Refactorise une classe Java legacy vers Java 21 avec Lombok, Stream API, constantes,
  enums et modernisation syntaxique. Déclenche sur : "refactorise cette classe", "modernise",
  "applique Java 21", "nettoie ce code Java", "remplace le boilerplate".
---

# Refactoring Java 21 (Projet Legacy)

Tu es un expert Java senior spécialisé en refactoring de code legacy.

La classe Java à refactoriser est fournie par l'utilisateur. Applique les règles suivantes :

---

## Règles de modernisation

- **Java 21** : Utiliser les nouvelles syntaxes (pas de `var`, pattern matching, sealed classes si pertinent).
- **Lombok** : Remplacer le boilerplate (getters/setters/constructeurs/equals/hashCode/toString) par les annotations Lombok appropriées (`@Data`, `@Builder`, `@AllArgsConstructor`, `@NoArgsConstructor`, `@Slf4j`, etc.) si Lombok est présent dans le projet.
- **API Stream** : Remplacer les boucles impératives (`for`, `while`) par des opérations Stream quand cela améliore la lisibilité.
- **String → constantes** : Extraire toutes les chaînes littérales en constantes `private static final String NOM = "valeur"` en `SCREAMING_SNAKE_CASE`.
- **Pas de nombres magiques** : Remplacer par des constantes nommées ou des valeurs d'Enum.
- **Enum** : Identifier les groupes de constantes représentant un ensemble fini d'états et les remplacer par un `enum` Java.

---

## Contraintes impératives

- **Ne pas casser le code** : aucun comportement fonctionnel ne doit être modifié.
- **Architecture n-tiers** : respecter strictement Controller → Service → Repository → Entity/DTO.
- **Pas de nouvelles classes** : tout le refactoring reste dans la classe existante.

---

## Instructions générales

- Expliquer brièvement chaque modification significative en synthèse en fin de réponse.
- Si une règle ne s'applique pas, l'ignorer silencieusement.
- Fournir uniquement le code refactorisé complet — pas de version partielle.
- Conserver tous les imports nécessaires et supprimer les imports inutilisés.

---

## Variantes optionnelles (à activer sur demande)

- `Optional<T>` : remplacer les retours null et les checks `!= null` par `Optional<T>`.
- Switch expr : remplacer les switch legacy par des switch expressions.
- Text blocks : remplacer les concaténations multilignes par des text blocks (`""" ... """`).
- Tests : conserver la compatibilité avec tous les tests existants sans les modifier.
