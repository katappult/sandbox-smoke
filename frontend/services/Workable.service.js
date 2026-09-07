import {serviceConfig} from "@/services/utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

export const WorkableService = {
    checkin,
    checkout,
    undoCheckout,
}

async function checkin(workableFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/workable/${workableFullId}/checkin`;
    return serviceConfig._doPatch(url, {comment: 'no comment'});
}

async function checkout(workableFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/workable/${workableFullId}/checkout`;
    return serviceConfig._doPatch(url);
}

async function undoCheckout(workableFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/workable/${workableFullId}/undoCheckout`;
    return serviceConfig._doPatch(url);
}
