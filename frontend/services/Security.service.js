import {serviceConfig} from "./utils/service.config";

export const SecurityService = {
    isAuthorizedToAccessUri
};

const application = serviceConfig.getApplication();

async function isAuthorizedToAccessUri(uri_to_acces) {
    const uri = `/${application}/cloud/app/v1/secured/api/authorization/isAuthorizedToAccessUri`;
    const url = `${serviceConfig.API_ROOT}${uri}?uri=${uri_to_acces}`;

    return await serviceConfig._doGet(url);
}
