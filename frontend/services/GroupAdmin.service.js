import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE = "/core/api/v1/groups";

export const GroupAdminService = {
    listGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getMembers,
    addMember,
    removeMember,
    getPermissions,
    addPermission,
    removePermission,
};

async function listGroups(page = 0, pageSize = 30, searchTerm = "") {
    const url = `${serviceConfig.API_ROOT}${BASE}?page=${page}&pageSize=${pageSize}&searchTerm=${encodeURIComponent(searchTerm)}`;
    return serviceConfig._doGet(url);
}

async function createGroup(data) {
    const url = `${serviceConfig.API_ROOT}${BASE}`;
    return serviceConfig._doPostWithBody(url, data);
}

async function updateGroup(uid, data) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}`;
    return serviceConfig._doPut(url, data);
}

async function deleteGroup(uid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}`;
    return serviceConfig._doDelete(url);
}

async function getMembers(uid, page = 0, pageSize = 100) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}/members?page=${page}&pageSize=${pageSize}`;
    return serviceConfig._doGet(url);
}

async function addMember(uid, accountUid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}/members/${accountUid}`;
    return serviceConfig._doPost(url);
}

async function removeMember(uid, accountUid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}/members/${accountUid}`;
    return serviceConfig._doDelete(url);
}

async function getPermissions(uid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}/permissions`;
    return serviceConfig._doGet(url);
}

async function addPermission(uid, permissionId) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}/permissions/${permissionId}`;
    return serviceConfig._doPost(url);
}

async function removePermission(uid, permissionId) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${uid}/permissions/${permissionId}`;
    return serviceConfig._doDelete(url);
}
