import {serviceConfig} from "@/services/utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE_URI = "/core/api/v1/medias";

export const mediaLibraryService = {
    upload,
    browse,
    deleteAsset,
    deleteMultipleAssets,
    renameAsset,
};

async function upload(file) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/asset`;
    const formData = new FormData();
    formData.append("file", file);
    return serviceConfig._doPostFiles(url, formData);
}

/**
 * Parcourt/filtre les assets de la médiathèque.
 * @param {object} [params]
 * @param {string} [params.tag]          - Filtrer par tag
 * @param {string} [params.contentType]  - Filtrer par type MIME (ex: "image/")
 * @param {string} [params.search]       - Recherche sur le nom original
 * @param {number} [params.page=0]
 * @param {number} [params.pageSize=20]
 * @param {boolean} [params.bustCache]   - Si true, ajoute un timestamp pour contourner le cache
 */
async function browse({tag = "", contentType = "", search = "", page = 0, pageSize = 20, bustCache = false} = {}) {
    const params = {tag, contentType, search, page, pageSize};
    if (bustCache) params._t = Date.now();
    const qs = new URLSearchParams(params).toString();
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/assets?${qs}`;
    return serviceConfig._doGet(url);
}

/**
 * Supprime un asset de la médiathèque (ADMIN uniquement).
 * @param {string} uid - uid: unique identifier (UUID string) of the asset.
 */
async function deleteAsset(uid) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/asset/${uid}`;
    return serviceConfig._doDelete(url);
}

/**
 * Supprime plusieurs assets en une seule requête (ADMIN uniquement).
 * @param {string[]} uids - Liste des uid à supprimer
 */
async function deleteMultipleAssets(uids) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/assets`;
    return serviceConfig._doDeleteWithData(url, uids);
}

/**
 * Renomme le nom d'affichage d'un asset (ADMIN uniquement).
 * @param {string} uid - uid: unique identifier (UUID string) of the asset.
 * @param {string} name - Nouveau nom
 */
async function renameAsset(uid, name) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/asset/${uid}/rename?name=${encodeURIComponent(name)}`;
    return serviceConfig._doPatch(url);
}
