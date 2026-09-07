import {serviceConfig} from "@/services/utils/service.config";

export const BatchService = {
    batchLoad,
}

async function batchLoad(formData) {
    const uri = "/core/api/v1/batch/load";
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doPostFiles(url, formData);
}
