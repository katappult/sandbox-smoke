import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE_URI = "/core/api/v1/contactable";

export const ContactService = {
    // Postal
    addPostalAddress,
    updatePostalAddress,
    deletePostalAddress,
    setContacts,

    // Telecom
    addTelecomContact,
    updateTelecomContact,
    updateTelecomContactByUuid,
    deleteTelecomContactByUuid,

    // Web
    addWebContact,
    updateWebContact,
    updateWebContactByUuid,
    deleteWebContactByUuid,

    // Generic contact
    getContact,
    getContactById,
    getContactByRole,
    getContactByRoles,
    deleteContactWeb,
    deleteContactTelecom,

    // Contact management
    setRole,
    setMasterForRole,
    setEffectivity,
};

async function addPostalAddress(contactableFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/postal`;
    return await serviceConfig._doPost(url, data);
}

async function updatePostalAddress(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/postal`;
    return await serviceConfig._doPut(url, data);
}

async function deletePostalAddress(contactableFullId, contactMechanismFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/postal`;
    return await serviceConfig._doDelete(url);
}

async function setContacts(contactableFullId, form) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/setContacts`;
    return await serviceConfig._doPost(url, form);
}

async function addTelecomContact(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/telecom`;
    return await serviceConfig._doPost(url, data);
}

async function updateTelecomContact(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/telecom`;
    return await serviceConfig._doPut(url, data);
}

async function updateTelecomContactByUuid(contactableFullId, contactMechanismFullId, uuid, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/telecom/${uuid}`;
    return await serviceConfig._doPut(url, data);
}

async function deleteTelecomContactByUuid(contactableFullId, contactMechanismFullId, uuid) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/telecom/${uuid}`;
    return await serviceConfig._doDelete(url);
}

async function addWebContact(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/web`;
    return await serviceConfig._doPost(url, data);
}

async function updateWebContact(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/web`;
    return await serviceConfig._doPut(url, data);
}

async function updateWebContactByUuid(contactableFullId, contactMechanismFullId, uuid, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/web/${uuid}`;
    return await serviceConfig._doPut(url, data);
}

async function deleteWebContactByUuid(contactableFullId, contactMechanismFullId, uuid) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/web/${uuid}`;
    return await serviceConfig._doDelete(url);
}

async function getContact(contactableFullId, role, masterForRole = true) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts?role=${role}&masterForRole=${masterForRole}`;
    return await serviceConfig._doGet(url);
}

async function getContactById(contactableFullId, contactMechanismFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}`;
    return await serviceConfig._doGet(url);
}

async function getContactByRole(contactableFullId, role) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/byRole?role=${role}`;
    return await serviceConfig._doGet(url);
}

async function getContactByRoles(contactableFullId, role) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/byRoles?role=${role}`;
    return await serviceConfig._doGet(url);
}

async function deleteContactWeb(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/web`;
    return await serviceConfig._doDelete(url);
}

async function deleteContactTelecom(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/telecom`;
    return await serviceConfig._doDeleteWithData(url, data);
}

async function setRole(contactableFullId, contactMechanismFullId, role) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/setRole?role=${role}`;
    return await serviceConfig._doPut(url);
}

async function setMasterForRole(contactableFullId, contactMechanismFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/setMasterForRole`;
    return await serviceConfig._doPut(url);
}

async function setEffectivity(contactableFullId, contactMechanismFullId, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${contactableFullId}/contacts/${contactMechanismFullId}/setEffectivity`;
    return await serviceConfig._doPut(url, data);
}
