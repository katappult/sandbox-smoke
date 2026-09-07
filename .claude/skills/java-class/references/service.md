# Archétype : Service métier

## Quand l'utiliser
- Logique métier, orchestration, transactions
- Mots clés : service, usecase, business logic, @Service, manager

## Template complet

```java
package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service gérant [description métier].
 *
 * @author  [auteur]
 * @since   1.0
 */
@Service
@Transactional(readOnly = true)   // lecture seule par défaut
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final EmailService   emailService;

    // Injection par constructeur (pas @Autowired)
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService   = emailService;
    }

    /**
     * Récupère un utilisateur par son identifiant.
     *
     * @param  id  identifiant de l'utilisateur
     * @return     l'utilisateur trouvé
     * @throws UserNotFoundException si aucun utilisateur trouvé
     */
    public User getById(Long id) {
        log.debug("Fetching user with id: {}", id);
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    /**
     * Liste tous les utilisateurs actifs.
     *
     * @return liste non nulle des utilisateurs actifs
     */
    public List<User> findAllActive() {
        return userRepository.findAllByStatus(UserStatus.ACTIVE);
    }

    /**
     * Crée un nouvel utilisateur.
     *
     * @param  command  données de création
     * @return          l'utilisateur persisté
     * @throws UserAlreadyExistsException si l'email est déjà utilisé
     */
    @Transactional   // surcharge : écriture
    public User create(CreateUserCommand command) {
        log.info("Creating user with email: {}", command.email());

        if (userRepository.existsByEmail(command.email())) {
            throw new UserAlreadyExistsException("Email already in use: " + command.email());
        }

        User user = new User(command.email(), command.firstName(), command.lastName());
        User saved = userRepository.save(user);

        emailService.sendWelcome(saved.getEmail());
        log.info("User {} created successfully", saved.getId());
        return saved;
    }

    /**
     * Met à jour les informations d'un utilisateur.
     *
     * @param  id      identifiant de l'utilisateur
     * @param  command données de mise à jour
     * @return         l'utilisateur mis à jour
     */
    @Transactional
    public User update(Long id, UpdateUserCommand command) {
        User user = getById(id);
        user.updateProfile(command.firstName(), command.lastName());
        return user;  // pas besoin de save() avec Hibernate dans une transaction
    }

    /**
     * Désactive un utilisateur.
     *
     * @param id identifiant de l'utilisateur
     */
    @Transactional
    public void deactivate(Long id) {
        User user = getById(id);
        user.deactivate();
        log.info("User {} deactivated", id);
    }
}
```

## Règles importantes
- `@Transactional(readOnly = true)` par défaut sur la classe.
- `@Transactional` (sans readOnly) sur chaque méthode d'écriture.
- **Injection par constructeur** — jamais `@Autowired` sur un champ.
- Utiliser des **Command objects** (records) pour les paramètres complexes.
- Ne jamais exposer les entités JPA directement depuis un controller → mapper en DTO.
- Encapsuler la logique de recherche dans des **méthodes nommées métier** plutôt que dans le service.