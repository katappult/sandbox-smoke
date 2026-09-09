import {serviceConfig} from "@/services/utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

export const RevControlledService = {
    allVersionsOf,
    latestVersionOf,
    latestIterationOfExactVersion,
    allIterationsOfVersion,
    allIterationsOf,
    exactIteration,
    workingCopy,
    originalCopy,
    revise,
    deleteIteration,
}

async function allVersionsOf(revControlledFullId, includeWorkingCopy = false) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/allVersionsOf?includeWorkingCopy=${includeWorkingCopy}`;
    return serviceConfig._doGet(url);
}

async function latestVersionOf(revControlledFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/latestVersionOf`;
    return serviceConfig._doGet(url);
}

async function latestIterationOfExactVersion(revControlledFullId, versionNumber) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/latestIterationOfExactVersion?versionNumber=${versionNumber}`;
    return serviceConfig._doGet(url);
}

async function allIterationsOfVersion(revControlledFullId, versionNumber, includeWorkingCopy = false) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/allIterationsOfVersion?versionNumber=${versionNumber}&includeWorkingCopy=${includeWorkingCopy}`;
    return serviceConfig._doGet(url);
}

async function allIterationsOf(revControlledFullId, page = 0, pageSize = 10, includeWorkingCopy = true) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/allIterationsOf?page=${page}&pageSize=${pageSize}&includeWorkingCopy=${includeWorkingCopy}`;
    return serviceConfig._doGet(url);
}

async function exactIteration(revControlledFullId, versionNumber, iterationNumber) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/exactIteration?versionNumber=${versionNumber}&iterationNumber=${iterationNumber}`;
    return serviceConfig._doGet(url);
}

async function workingCopy(revControlledFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/workingCopy`;
    return serviceConfig._doGet(url);
}

async function originalCopy(revControlledFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/originalCopy`;
    return serviceConfig._doGet(url);
}

async function revise(revControlledFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/revise`;
    return serviceConfig._doPost(url);
}

async function deleteIteration(revControlledFullId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/rc/${revControlledFullId}/deleteIteration`;
    return serviceConfig._doDelete(url);
}
