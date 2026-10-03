import { responseListSuccess } from "@/utils";
import { ANNONCE_VALIDEE } from "@/services/Catalogue.service";

/**
 * Helpers de lecture du catalogue. Gardés hors des composants
 * (pas de logique métier dans le corps d'un composant parent).
 *
 * Les entités Katappult arrivent tantôt à plat (`{ titre }`), tantôt
 * encapsulées (`{ attributes: { titre } }`) — cf. `getThumbnailPath` qui lit
 * `response.attributes`. `readField` couvre les deux formes.
 */
export function readField(item, name) {
    return item?.[name] ?? item?.attributes?.[name];
}

export function resolveUid(item) {
    return item?.uid ?? item?.id ?? null;
}

export function isFeatured(item) {
    return Boolean(readField(item, "featured"));
}

function resolveRelationUid(item, attributeName) {
    const relation = readField(item, attributeName);
    if (!relation) return null;

    return typeof relation === "string" ? relation : relation.uid ?? null;
}

export function matchesRelation(item, attributeName, expectedUid) {
    if (!expectedUid) return true;

    return resolveRelationUid(item, attributeName) === expectedUid;
}

export function extractItems(response) {
    if (!responseListSuccess(response)) return [];

    const dataList = response.data.dataList;
    if (Array.isArray(dataList)) return dataList;

    return dataList.items ?? dataList.content ?? dataList.results ?? [];
}

/**
 * Seules les annonces à l'état public sont visibles. Le paramètre `status`
 * du endpoint list fait le filtrage principal ; ce contrôle client est un
 * filet de sécurité : si l'état n'est pas exposé, on garde l'élément
 * (on fait confiance au filtre serveur) plutôt que de vider la liste.
 */
export function isVisibleAnnonce(annonce, validState = ANNONCE_VALIDEE) {
    const state = readField(annonce, "status")
        ?? readField(annonce, "lifecycleStatus")
        ?? readField(annonce, "state")
        ?? readField(annonce, "lifecycleInfo")?.status;

    if (!state) return true;

    return state === validState;
}

export function sortFeaturedFirst(items) {
    return [...items].sort((first, second) => {
        const featuredDelta = Number(isFeatured(second)) - Number(isFeatured(first));
        if (featuredDelta !== 0) return featuredDelta;

        return String(readField(first, "titre") ?? "")
            .localeCompare(String(readField(second, "titre") ?? ""));
    });
}

export function paginate(items, page, pageSize) {
    const start = (page - 1) * pageSize;

    return items.slice(start, start + pageSize);
}
