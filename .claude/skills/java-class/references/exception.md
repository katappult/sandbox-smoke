# Archétype : Exception personnalisée

## Quand l'utiliser
- Erreur métier explicite à remonter au consommateur
- Mots clés : exception, erreur, not found, already exists, invalid, unauthorized, forbidden

---

## Hiérarchie recommandée

```
RuntimeException
└── BusinessException          (base abstraite — toutes les exceptions métier)
    ├── NotFoundException       (ressource introuvable → HTTP 404)
    ├── ConflictException       (doublon, état incompatible → HTTP 409)
    ├── ValidationException     (données invalides → HTTP 422)
    └── ForbiddenException      (accès refusé → HTTP 403)
```

---

## Template : classe de base

```java
package com.example.exception;

/**
 * Exception de base pour toutes les erreurs métier de l'application.
 * Étendre cette classe pour créer des exceptions spécifiques au domaine.
 */
public abstract class BusinessException extends RuntimeException {

    private final String errorCode;

    protected BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    protected BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * Code d'erreur machine-readable (ex: "USER_NOT_FOUND", "EMAIL_ALREADY_EXISTS").
     *
     * @return code d'erreur
     */
    public String getErrorCode() { return errorCode; }
}
```

---

## Template : NotFoundException

```java
package com.example.exception;

/**
 * Lancée quand une ressource demandée n'existe pas en base.
 * Correspond généralement à un HTTP 404.
 */
public class UserNotFoundException extends BusinessException {

    private static final String ERROR_CODE = "USER_NOT_FOUND";

    private final Long userId;

    public UserNotFoundException(Long userId) {
        super(ERROR_CODE, "User not found with id: " + userId);
        this.userId = userId;
    }

    public UserNotFoundException(String email) {
        super(ERROR_CODE, "User not found with email: " + email);
        this.userId = null;
    }

    /**
     * @return identifiant de l'utilisateur recherché, ou {@code null} si recherche par email
     */
    public Long getUserId() { return userId; }
}
```

---

## Template : ConflictException

```java
package com.example.exception;

/**
 * Lancée quand une opération entre en conflit avec l'état existant.
 * Ex : email déjà utilisé, doublon, transition d'état invalide.
 * Correspond généralement à un HTTP 409.
 */
public class UserAlreadyExistsException extends BusinessException {

    public UserAlreadyExistsException(String email) {
        super("USER_ALREADY_EXISTS", "A user already exists with email: " + email);
    }
}
```

---

## Template : ValidationException

```java
package com.example.exception;

import java.util.Collections;
import java.util.List;

/**
 * Lancée quand les données fournies sont invalides selon les règles métier.
 * Correspond généralement à un HTTP 422.
 */
public class ValidationException extends BusinessException {

    private final List<String> violations;

    public ValidationException(String message) {
        super("VALIDATION_ERROR", message);
        this.violations = Collections.emptyList();
    }

    public ValidationException(String message, List<String> violations) {
        super("VALIDATION_ERROR", message);
        this.violations = List.copyOf(violations);
    }

    /**
     * @return liste immuable des violations de contraintes
     */
    public List<String> getViolations() { return violations; }
}
```

---

## Template : wrapping d'exception checked

```java
// ✅ Wrapper une IOException en exception non-checked
try {
    Files.readString(path);
} catch (IOException e) {
    throw new DataAccessException("Failed to read file: " + path, e);
}

public class DataAccessException extends BusinessException {
    public DataAccessException(String message, Throwable cause) {
        super("DATA_ACCESS_ERROR", message, cause);
    }
}
```

---

## Règles importantes

- **Toujours étendre `RuntimeException`** — pas `Exception` checked.
- **Jamais avaler une exception** (`catch(Exception e) {}` vide est interdit).
- **Message clair et exploitable** : inclure l'identifiant/valeur qui pose problème.
- **`errorCode` machine-readable** (UPPER_SNAKE_CASE) pour les réponses API structurées.
- **Conserver la cause** (`Throwable cause`) lors du wrapping pour ne pas perdre la stack trace.
- Ne pas créer d'exception générique `AppException` fourre-tout — une exception = un cas d'erreur.

---

## Handler Spring (référence)

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(UserNotFoundException ex) {
        return new ErrorResponse(ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConflict(UserAlreadyExistsException ex) {
        return new ErrorResponse(ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public ErrorResponse handleValidation(ValidationException ex) {
        return new ErrorResponse(ex.getErrorCode(), ex.getMessage(), ex.getViolations());
    }
}
```