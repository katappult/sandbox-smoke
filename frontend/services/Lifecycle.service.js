import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

const BASE_URI = "/core/api/v1/lifecycleManaged";

export const LifecycleService = {
    promote,
    denote,
    setState,
    setStateWithComment,
    setStateOfElements,
    statesByAction,
    allStates,
    historyOf,
};

async function promote(entityFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/promote`;
    return await serviceConfig._doPatch(url);
}

async function denote(entityFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/denote`;
    return await serviceConfig._doPatch(url);
}

async function setState(entityFullId, state, cascade = false) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/setState?state=${state}&cascade=${cascade}`;
    return await serviceConfig._doPatch(url);
}

async function setStateWithComment(entityFullId, state, comment, cascade = false) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/setStateWithComment?state=${state}&cascade=${cascade}`;
    return await serviceConfig._doPatch(url, {comment});
}

async function setStateOfElements(entityFullId, state, data) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/setStateOfElements?state=${state}`;
    return await serviceConfig._doPatch(url, data);
}

async function statesByAction(entityFullId, fromState, actionName) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/statesByAction?fromState=${fromState}&actionName=${actionName}`;
    return await serviceConfig._doGet(url);
}

async function allStates(entityFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/allStates`;
    return await serviceConfig._doGet(url);
}

async function historyOf(entityFullId) {
    const url = `${serviceConfig.API_ROOT}${BASE_URI}/${entityFullId}/lifecycleHistory`;
    return await serviceConfig._doGet(url);
}
