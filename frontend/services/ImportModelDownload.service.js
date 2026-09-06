import {serviceConfig} from "@/services/utils/service.config";

export const ImportModelDownloadService = {
    modelOf
};

async function modelOf(entityName) {
    const uri = `/core/api/v1/import-data-model?entityName=${entityName}`;
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doGetBlob(url);
}

