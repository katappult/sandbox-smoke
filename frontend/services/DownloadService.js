import {serviceConfig} from "./utils/service.config";

export const DownloadService = {
    apk,
    productCSV
};

const application = "nexitia";
async function apk() {
    const uri = `/${application}/api/v1/download/apk`;
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doGetBlob(url);
}

async function productCSV() {
    const application = serviceConfig.getApplication();
    const uri = `/${application}/api/v1/download/productModelCSV`;
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doGetBlob(url);
}

