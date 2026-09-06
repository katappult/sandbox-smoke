import {serviceConfig} from "./utils/service.config";

const BASE = "/core/api/v1/admin/permissions";

export const PermissionAdminService = {
    listPermissions,
    searchPermissions,
};

async function listPermissions(page = 0, pageSize = 200) {
    const url = `${serviceConfig.API_ROOT}${BASE}?page=${page}&pageSize=${pageSize}`;
    return serviceConfig._doGet(url);
}

async function searchPermissions(searchTerm) {
    const url = `${serviceConfig.API_ROOT}${BASE}/search?searchTerm=${encodeURIComponent(searchTerm)}`;
    return serviceConfig._doGet(url);
}
