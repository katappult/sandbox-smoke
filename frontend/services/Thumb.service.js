import {serviceConfig} from "@/services/utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE_URI = "/core/api/v1/thumbed";

export const thumbService = {
    getThumbs,
    addThumb,
    addThumbs,
    addThumbAtPosition,
    addThumbFromLibrary,
    replaceThumb,
    deleteThumb,
    deleteAllThumbs,
    reorder,
};

async function getThumbs(thumbedFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}`;
    return serviceConfig._doGet(url);
}

async function addThumb(thumbedFullId, file) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/item`;
    const formData = new FormData();
    formData.append("file", file);
    return serviceConfig._doPostFiles(url, formData);
}

async function addThumbs(thumbedFullId, files, replace = false) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/items?replace=${replace}`;
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    return serviceConfig._doPostFiles(url, formData);
}

async function addThumbAtPosition(thumbedFullId, position, file) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/item/at?position=${position}`;
    const formData = new FormData();
    formData.append("file", file);
    return serviceConfig._doPostFiles(url, formData);
}

async function addThumbFromLibrary(thumbedFullId, assetOid, position) {
    let url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/item/from-library?assetOid=${assetOid}`;
    if (position !== undefined && position !== null) {
        url += `&position=${position}`;
    }
    return serviceConfig._doPost(url);
}

async function replaceThumb(thumbedFullId, itemOid, file) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/item/${itemOid}`;
    const formData = new FormData();
    formData.append("file", file);
    return serviceConfig._doPutFiles(url, formData);
}

async function deleteThumb(thumbedFullId, itemOid) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/item/${itemOid}`;
    return serviceConfig._doDelete(url);
}

async function deleteAllThumbs(thumbedFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/all`;
    return serviceConfig._doDelete(url);
}

async function reorder(thumbedFullId, orderedItemOids) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${thumbedFullId}/reorder`;
    return serviceConfig._doPut(url, orderedItemOids);
}
