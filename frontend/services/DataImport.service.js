import {serviceConfig} from "@/services/utils/service.config";

export const ExcelDataImportService = {
    importUsers,
    importPermissions,
    importGroups
};

async function importUsers(form) {
    const uri = `/core/api/v1/core-data-import`;
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doPost(url, form, 45000 * 5);
}

async function importPermissions(form) {
    const uri = `/core/api/v1/core-data-import`;
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doPost(url, form, 45000 * 5);
}

async function importGroups(form) {
    const uri = `/core/api/v1/core-data-import`;
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doPost(url, form, 45000 * 5);
}