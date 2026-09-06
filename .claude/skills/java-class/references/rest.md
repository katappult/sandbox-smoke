# Archétype : Controller REST

## Quand l'utiliser
- Exposition d'endpoints HTTP, API REST
- Mots clés : controller, rest, api, endpoint, http, GET, POST, PUT, PATCH, DELETE, request, response, route

---

## Règles de base

- **`@RestController`** = `@Controller` + `@ResponseBody` sur chaque méthode.
- **`@RequestMapping`** en tête de classe pour le préfixe commun.
- Le controller **ne contient aucune logique métier** — il délègue au service.
- Retourner **toujours `ResponseEntity<T>`** pour contrôler le statut HTTP.
- **Valider les entrées** avec `@Valid` sur le body et `@Validated` sur la classe.
- Un controller = une ressource (ex : `UserController` gère `/users`).

---

## Template complet

```java
package com.example.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/**
 * Endpoints REST pour la gestion des utilisateurs.
 *
 * <p>Base URL : {@code /api/v1/users}</p>
 *
 * @author  [auteur]
 * @since   1.0
 */
@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService    userService;
    private final UserMapper     userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper  = userMapper;
    }

    // -------------------------------------------------------------------------
    // GET /api/v1/users
    // -------------------------------------------------------------------------

    /**
     * Liste les utilisateurs actifs avec pagination.
     *
     * @param  page  numéro de page (0-based, défaut 0)
     * @param  size  taille de page (défaut 20, max 100)
     * @return       page de réponses utilisateur
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> findAll(
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Page<UserResponse> result = userService.findAllActive(page, size)
            .map(userMapper::toResponse);
        return ResponseEntity.ok(result);
    }

    // -------------------------------------------------------------------------
    // GET /api/v1/users/{id}
    // -------------------------------------------------------------------------

    /**
     * Récupère un utilisateur par son identifiant.
     *
     * @param  id  identifiant de l'utilisateur
     * @return     200 avec l'utilisateur, ou 404 si introuvable
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(
        @PathVariable @Positive Long id
    ) {
        UserResponse response = userMapper.toResponse(userService.getById(id));
        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------------------------
    // POST /api/v1/users
    // -------------------------------------------------------------------------

    /**
     * Crée un nouvel utilisateur.
     *
     * @param  request  données de création validées
     * @return          201 Created avec l'URI de la ressource créée
     */
    @PostMapping
    public ResponseEntity<UserResponse> create(
        @RequestBody @Valid CreateUserRequest request
    ) {
        log.info("Creating user with email: {}", request.email());
        User created = userService.create(userMapper.toCreateCommand(request));
        UserResponse response = userMapper.toResponse(created);

        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.getId())
            .toUri();

        return ResponseEntity.created(location).body(response);
    }

    // -------------------------------------------------------------------------
    // PUT /api/v1/users/{id}
    // -------------------------------------------------------------------------

    /**
     * Remplace intégralement un utilisateur existant.
     *
     * @param  id       identifiant de l'utilisateur
     * @param  request  nouvelles données validées
     * @return          200 avec l'utilisateur mis à jour
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(
        @PathVariable @Positive Long id,
        @RequestBody @Valid UpdateUserRequest request
    ) {
        User updated = userService.update(id, userMapper.toUpdateCommand(request));
        return ResponseEntity.ok(userMapper.toResponse(updated));
    }

    // -------------------------------------------------------------------------
    // PATCH /api/v1/users/{id}/status
    // -------------------------------------------------------------------------

    /**
     * Met à jour partiellement le statut d'un utilisateur.
     *
     * @param  id       identifiant de l'utilisateur
     * @param  request  nouveau statut
     * @return          200 avec l'utilisateur mis à jour
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateStatus(
        @PathVariable @Positive Long id,
        @RequestBody @Valid UpdateStatusRequest request
    ) {
        User updated = userService.updateStatus(id, request.status());
        return ResponseEntity.ok(userMapper.toResponse(updated));
    }

    // -------------------------------------------------------------------------
    // DELETE /api/v1/users/{id}
    // -------------------------------------------------------------------------

    /**
     * Supprime un utilisateur.
     *
     * @param  id  identifiant de l'utilisateur
     * @return     204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Template : Mapper (entité ↔ DTO)

```java
package com.example.controller;

import org.springframework.stereotype.Component;

/**
 * Convertit les entités {@link User} en DTOs et inversement.
 * Utiliser MapStruct si le projet est déjà configuré.
 */
@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getStatus().name()
        );
    }

    public CreateUserCommand toCreateCommand(CreateUserRequest request) {
        return new CreateUserCommand(
            request.email(),
            request.firstName(),
            request.lastName()
        );
    }

    public UpdateUserCommand toUpdateCommand(UpdateUserRequest request) {
        return new UpdateUserCommand(
            request.firstName(),
            request.lastName()
        );
    }
}
```

---

## Template : Gestion globale des erreurs

```java
package com.example.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Gestionnaire global des exceptions — convertit les exceptions en réponses HTTP structurées.
 * Utilise le format RFC 9457 (Problem Details).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 404 — Ressource introuvable
    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail handleNotFound(NotFoundException ex) {
        log.debug("Resource not found: {}", ex.getMessage());
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setProperty("errorCode", ex.getErrorCode());
        return problem;
    }

    // 409 — Conflit
    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setProperty("errorCode", ex.getErrorCode());
        return problem;
    }

    // 422 — Validation métier
    @ExceptionHandler(ValidationException.class)
    public ProblemDetail handleValidation(ValidationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        problem.setProperty("errorCode", ex.getErrorCode());
        problem.setProperty("violations", ex.getViolations());
        return problem;
    }

    // 400 — Validation Bean (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleBeanValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "invalid value",
                (a, b) -> a  // garder le premier message en cas de doublons
            ));
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        problem.setProperty("errorCode", "INVALID_REQUEST");
        problem.setProperty("fieldErrors", fieldErrors);
        return problem;
    }

    // 500 — Erreur inattendue
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
}
```

---

## Codes HTTP de référence

| Situation | Méthode | Statut |
|---|---|---|
| Lecture réussie | GET | 200 OK |
| Création réussie | POST | 201 Created + `Location` header |
| Mise à jour réussie | PUT / PATCH | 200 OK |
| Suppression réussie | DELETE | 204 No Content |
| Données invalides (@Valid) | toute | 400 Bad Request |
| Non authentifié | toute | 401 Unauthorized |
| Accès interdit | toute | 403 Forbidden |
| Ressource introuvable | toute | 404 Not Found |
| Conflit / doublon | POST / PUT | 409 Conflict |
| Erreur de validation métier | toute | 422 Unprocessable Entity |
| Erreur serveur | toute | 500 Internal Server Error |

---

## Règles importantes

- **Jamais de logique métier** dans le controller — tout délègue au service.
- **Toujours `ResponseEntity<T>`** pour expliciter le statut HTTP retourné.
- **`@Valid`** sur chaque `@RequestBody` pour déclencher Bean Validation.
- **`@Positive`** sur les `@PathVariable` numériques pour rejeter les ID invalides (0, négatifs).
- **`POST` → 201 Created** avec header `Location` pointant vers la ressource créée.
- **`DELETE` → 204 No Content** — pas de body.
- **`PATCH`** pour mise à jour partielle, **`PUT`** pour remplacement complet.
- **Versionner l'API** dès le départ : `/api/v1/...` pour pouvoir évoluer sans casser les clients.
- **Mapper entité → DTO** dans le controller ou via un `@Component` dédié — jamais exposer l'entité JPA directement.
- **`@RestControllerAdvice`** centralisé pour tous les codes d'erreur — pas de try/catch dans les controllers.