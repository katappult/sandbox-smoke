import {serviceConfig} from "./utils/service.config";

export const UserService = {
    listUsers,
    listCustomUsers,
    lockUser,
    unlockUser,
    groups,
    roles,
    getSelectableRoles,
    addRole,
    removeRole,
};

async function listCustomUsers(page = 0, searchTerm = "", pageSize = 12) {
    const uri = `/core/api/v1/user-principals/users`;
    const url = `${serviceConfig.API_ROOT}${uri}?page=${page}&searchTerm=${encodeURIComponent(searchTerm)}&pageSize=${pageSize}`;
    return await serviceConfig._doGet(url);
}

async function listUsers(page, searchTerm = "", pageSize) {
    const uri = `/core/api/v1/principals/account/list`;
    const url = `${serviceConfig.API_ROOT}${uri}?page=${page}&searchTerm=${searchTerm}&pageSize=${pageSize}`;
    return await serviceConfig._doGet(url);
}

async function roles(accountId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountId}/roles`;
    return await serviceConfig._doGet(url);
}

async function groups(accountId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountId}/groups`;
    return await serviceConfig._doGet(url);
}

async function lockUser(accountId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountId}/lock`;
    return await serviceConfig._doPatch(url);
}

async function unlockUser(accountId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountId}/unlock`;
    return await serviceConfig._doPatch(url);
}

// GET /core/api/v1/admin/roles — CoreRoleServiceFacade
async function getSelectableRoles() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/admin/roles`;
    return await serviceConfig._doGet(url);
}

async function addRole(accountId, roleId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/admin/roles/${roleId}/members/${accountId}`;
    return await serviceConfig._doPost(url);
}

async function removeRole(accountId, roleId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/admin/roles/${roleId}/members/${accountId}`;
    return await serviceConfig._doDelete(url);
}
