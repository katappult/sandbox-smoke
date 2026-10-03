/**
 * Helpers partagés par les écrans d'administration du catalogue.
 * Aucun accès réseau ici : les seuls appels passent par les services générés
 * (frontend/services/generated/*.services.js).
 */

export const EMPTY_VALUE = "—";

/**
 * Champs réellement éditables d'une entité du catalogue.
 * `Categorie.updateFrom()` et `Produit.updateFrom()` ne lisent que ceux-là :
 * envoyer la ligne brute d'une liste pousserait des champs gérés par le serveur.
 */
export const EDITABLE_FIELDS = ["titre", "description", "featured", "active"];

/** uid de la catégorie rattachée à un produit, quelle que soit la forme du DTO. */
export function resolveCategorieUid(item) {
    if (!item) return null;
    if (item.categorieUid) return item.categorieUid;
    if (item.categorieId) return item.categorieId;
    if (typeof item.categorie === "string") return item.categorie;

    return item.categorie?.uid ?? null;
}

/** Le produit est-il rattaché à la catégorie donnée ? */
export function isProductOfCategorie(item, categorieUid) {
    return resolveCategorieUid(item) === categorieUid;
}

/** Corps de mise à jour : les champs éditables de la ligne, plus le booléen modifié. */
export function togglePayload(record, field, value) {
    const payload = {};

    EDITABLE_FIELDS.forEach((name) => {
        if (record[name] !== undefined) {
            payload[name] = record[name];
        }
    });

    payload[field] = value;

    return payload;
}

/** Applique le nouveau booléen en local pour éviter un rechargement complet de la liste. */
export function applyBoolean(rows, uid, field, value) {
    return rows.map((item) => (item.uid === uid ? {...item, [field]: value} : item));
}
