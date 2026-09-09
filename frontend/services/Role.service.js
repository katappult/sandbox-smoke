import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE = "/core/api/v1/admin/roles";

export const RoleService = {
    getRolesOfAccount,
    listRoles,
    searchRoles,
    getMembers,
    getMembersCount,
    addMember,
    removeMember,
};

async function getRolesOfAccount(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/roles`;
    return await serviceConfig._doGet(url);
}


async function listRoles(page = 0, pageSize = 100, searchTerm = "") {
    const url = `${serviceConfig.API_ROOT}${BASE}?page=${page}&pageSize=${pageSize}&searchTerm=${encodeURIComponent(searchTerm)}`;
    return serviceConfig._doGet(url);
}

async function searchRoles(searchTerm, accountUid) {
    let url = `${serviceConfig.API_ROOT}${BASE}/search?searchTerm=${encodeURIComponent(searchTerm)}`;
    if (accountUid != null) url += `&accountUid=${accountUid}`;
    return serviceConfig._doGet(url);
}

async function getMembers(roleUid, page = 0, pageSize = 100, searchTerm = "") {
    const url = `${serviceConfig.API_ROOT}${BASE}/${roleUid}/members?page=${page}&pageSize=${pageSize}&searchTerm=${encodeURIComponent(searchTerm)}`;
    return serviceConfig._doGet(url);
}

async function getMembersCount(roleUid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${roleUid}/members/count`;
    return serviceConfig._doGet(url);
}

async function addMember(roleUid, accountUid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${roleUid}/members/${accountUid}`;
    return serviceConfig._doPost(url);
}

async function removeMember(roleUid, accountUid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/${roleUid}/members/${accountUid}`;
    return serviceConfig._doDelete(url);
}
