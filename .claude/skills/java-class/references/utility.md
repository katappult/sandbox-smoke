# Archétype : Classe utilitaire

## Quand l'utiliser
- Fonctions statiques sans état, réutilisables dans toute l'application
- Mots clés : util, helper, utils, tools, formatter, validator, converter, parser

---

## Règles de base

- Classe `final` pour empêcher l'héritage.
- Constructeur `private` qui lève `UnsupportedOperationException`.
- Toutes les méthodes sont `static`.
- Aucun état (pas de champs d'instance).
- Nommer le fichier : `XxxUtils.java` ou `XxxHelper.java`.

---

## Template de base

```java
package com.example.util;

/**
 * Utilitaires pour [domaine fonctionnel].
 * <p>Classe non instanciable — tous les membres sont statiques.</p>
 *
 * @author  [auteur]
 * @since   1.0
 */
public final class StringUtils {

    // Empêche l'instanciation
    private StringUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Capitalise la première lettre d'une chaîne.
     *
     * @param  value  chaîne à capitaliser, peut être {@code null}
     * @return        chaîne capitalisée, ou {@code null} si l'entrée est {@code null}
     */
    public static String capitalize(String value) {
        if (value == null || value.isBlank()) return value;
        return Character.toUpperCase(value.charAt(0)) + value.substring(1).toLowerCase();
    }

    /**
     * Tronque une chaîne à {@code maxLength} caractères en ajoutant "..." si nécessaire.
     *
     * @param  value      chaîne source
     * @param  maxLength  longueur maximale (doit être > 3)
     * @return            chaîne tronquée
     */
    public static String truncate(String value, int maxLength) {
        if (value == null) return null;
        if (value.length() <= maxLength) return value;
        return value.substring(0, maxLength - 3) + "...";
    }

    /**
     * Convertit une chaîne camelCase en snake_case.
     *
     * @param  camel  chaîne en camelCase
     * @return        équivalent en snake_case
     */
    public static String toSnakeCase(String camel) {
        if (camel == null) return null;
        return camel
            .replaceAll("([a-z])([A-Z])", "$1_$2")
            .toLowerCase();
    }
}
```

---

## Template : utilitaire de validation

```java
package com.example.util;

import java.util.regex.Pattern;

/**
 * Utilitaires de validation de formats courants.
 */
public final class ValidationUtils {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$");

    private static final Pattern PHONE_PATTERN =
        Pattern.compile("^\\+?[1-9]\\d{7,14}$");

    private static final Pattern IBAN_PATTERN =
        Pattern.compile("^[A-Z]{2}\\d{2}[A-Z0-9]{4,}$");

    private ValidationUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * @param email  adresse email à valider
     * @return       {@code true} si le format est valide
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * @param phone  numéro de téléphone international
     * @return       {@code true} si le format E.164 est respecté
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    /**
     * @param iban  numéro IBAN à valider
     * @return      {@code true} si le format IBAN est valide
     */
    public static boolean isValidIban(String iban) {
        return iban != null && IBAN_PATTERN.matcher(iban.replaceAll("\\s", "")).matches();
    }
}
```

---

## Template : utilitaire de conversion / mapping

```java
package com.example.util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

/**
 * Utilitaires pour la conversion de types et le mapping de collections.
 */
public final class ConversionUtils {

    private static final DateTimeFormatter DATE_FORMATTER =
        DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private ConversionUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Formate un {@link Instant} en date lisible "dd/MM/yyyy".
     *
     * @param  instant  instant à formater, peut être {@code null}
     * @return          date formatée ou chaîne vide si {@code null}
     */
    public static String formatDate(Instant instant) {
        if (instant == null) return "";
        return LocalDate.ofInstant(instant, ZoneId.systemDefault()).format(DATE_FORMATTER);
    }

    /**
     * Transforme une collection en liste en appliquant un mapper,
     * et retourne une liste vide si la collection source est {@code null}.
     *
     * @param  source  collection source
     * @param  mapper  fonction de transformation
     * @param  <S>     type source
     * @param  <T>     type cible
     * @return         liste transformée, jamais {@code null}
     */
    public static <S, T> List<T> mapList(Collection<S> source, Function<S, T> mapper) {
        if (source == null || source.isEmpty()) return Collections.emptyList();
        return source.stream().map(mapper).toList();
    }

    /**
     * Convertit un {@link Optional} en valeur ou retourne {@code defaultValue}.
     *
     * @param  optional      optional source
     * @param  defaultValue  valeur par défaut si absent
     * @param  <T>           type de la valeur
     * @return               valeur présente ou {@code defaultValue}
     */
    public static <T> T orDefault(Optional<T> optional, T defaultValue) {
        return optional.orElse(defaultValue);
    }
}
```

---

## Template : utilitaire de pagination

```java
package com.example.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Utilitaires pour la construction de requêtes paginées.
 */
public final class PageUtils {

    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE     = 100;

    private PageUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Construit un {@link Pageable} avec validation de la taille.
     *
     * @param  page  numéro de page (0-based)
     * @param  size  taille de page demandée
     * @param  sort  tri à appliquer
     * @return       Pageable validé
     */
    public static Pageable of(int page, int size, Sort sort) {
        int safeSize = Math.min(Math.max(1, size), MAX_PAGE_SIZE);
        return PageRequest.of(Math.max(0, page), safeSize, sort);
    }

    /**
     * @param  page   numéro de page (0-based)
     * @param  field  champ de tri ascendant
     * @return        Pageable avec tri ascendant
     */
    public static Pageable ofAsc(int page, String field) {
        return of(page, DEFAULT_PAGE_SIZE, Sort.by(Sort.Direction.ASC, field));
    }

    /**
     * @param  page   numéro de page (0-based)
     * @param  field  champ de tri descendant
     * @return        Pageable avec tri descendant
     */
    public static Pageable ofDesc(int page, String field) {
        return of(page, DEFAULT_PAGE_SIZE, Sort.by(Sort.Direction.DESC, field));
    }
}
```

---

## Règles importantes

- **`final`** sur la classe — une classe utilitaire ne s'hérite pas.
- **Constructeur privé** avec `throw new UnsupportedOperationException("Utility class")`.
- **Jamais d'état** — aucun champ non-`static`, aucune instance.
- **Gérer `null`** explicitement : soit accepter et retourner `null`, soit rejeter avec `Objects.requireNonNull`.
- **Constantes `static final`** en haut de classe (patterns compilés, formats...).
- **Ne pas abuser** : si une logique est spécifique à un seul service, la mettre en méthode privée dans ce service. Les utilitaires sont pour le code vraiment transversal.
- **Tests unitaires faciles** : les méthodes statiques sans état se testent en une ligne.