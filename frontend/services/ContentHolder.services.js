import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE_URI = "/core/api/v1/contentHolder";

export const ContentHolderService = {
    // raw response
    contentInfos,
    // parsed response ({ primary, attachments })
    getContentInfo,
    // upload
    setPrimaryContentFile,
    addAttachment,
    uploadFile,
    // url externe
    setUrl,
    // download (blob)
    downloadPrimaryContentBlob,
    downloadAttachmentBlob,
    downloadAllAsZip,
    // download (trigger navigateur)
    downloadContent,
    // delete
    deletePrimaryContent,
    deleteAttachmentContent,
    deleteContent,
}

// ---------------------------------------------------------------------------
// Info contenu
// ---------------------------------------------------------------------------

function contentInfos(contentHolderFullId, role) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/getContentInfo?role=${role}`;
    return serviceConfig._doGet(url);
}

async function getContentInfo(contentHolderFullId, role = "all") {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/getContentInfo?role=${role}`;
    const response = await serviceConfig._doGet(url);
    const data = response.data;
    return {
        primary: data.attributes?.fileName
            ? {fileName: data.attributes.fileName, url: data.attributes.url || null}
            : null,
        attachments: (data.dataList || []).map(item => ({
            id: item.id,
            fileName: item.fileName,
            url: item.url || null,
        })),
    };
}

// ---------------------------------------------------------------------------
// Upload fichier
// ---------------------------------------------------------------------------

function setPrimaryContentFile(contentHolderFullId, formData, fileName) {
    let url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/setContentFile?role=primary`;
    if (fileName) url += `&fileName=${fileName}`;
    return serviceConfig._doPostFiles(url, formData);
}

async function addAttachment(contentHolderFullId, formData, fileName) {
    let url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/setContentFile?role=attachments`;
    if (fileName) url += `&fileName=${fileName}`;
    return serviceConfig._doPostFiles(url, formData);
}

async function uploadFile(contentHolderFullId, role, file, fileName) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/setContentFile`;
    const formData = new FormData();
    formData.append("role", role);
    formData.append("file", file);
    if (fileName) formData.append("fileName", fileName);
    return serviceConfig._doPostFiles(url, formData);
}

// ---------------------------------------------------------------------------
// URL externe
// ---------------------------------------------------------------------------

async function setUrl(contentHolderFullId, role, externalUrl) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/setContentUrl?role=${role}&url=${encodeURIComponent(externalUrl)}`;
    return serviceConfig._doPost(url);
}

// ---------------------------------------------------------------------------
// Download (blob brut)
// ---------------------------------------------------------------------------

function downloadPrimaryContentBlob(contentHolderFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/downloadContent?role=primary`;
    return serviceConfig._doGetBlob(url);
}

function downloadAttachmentBlob(contentHolderFullId, contentItemId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/downloadContent?role=attachments&contentItemId=${contentItemId}`;
    return serviceConfig._doGetBlob(url);
}

async function downloadAllAsZip(contentHolderFullId, includeUrl = false) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/downloadAllAsZip?includeUrl=${includeUrl}`;
    return serviceConfig._doGetBlob(url);
}

// ---------------------------------------------------------------------------
// Download (trigger navigateur)
// ---------------------------------------------------------------------------

async function downloadContent(contentHolderFullId, role, contentItemId, fileName) {
    let url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/downloadContent?role=${role}`;
    if (contentItemId) url += `&contentItemId=${contentItemId}`;
    const response = await serviceConfig._doGetBlob(url);
    const blob = new Blob([response.data], {type: response.headers["content-type"]});
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName || "download";
    anchor.click();
    window.URL.revokeObjectURL(objectUrl);
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

function deletePrimaryContent(contentHolderFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/deleteContent?role=primary`;
    return serviceConfig._doDelete(url);
}

function deleteAttachmentContent(contentHolderFullId, contentItemId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/deleteContent?role=attachments&contentItemId=${contentItemId}`;
    return serviceConfig._doDelete(url);
}

async function deleteContent(contentHolderFullId, role, contentItemId) {
    let url = `${serviceConfig.API_ROOT}${BASE_URI}/${contentHolderFullId}/deleteContent?role=${role}`;
    if (contentItemId) url += `&contentItemId=${contentItemId}`;
    return serviceConfig._doDelete(url);
}
