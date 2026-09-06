import { serviceConfig } from "@/services/utils/service.config";

/**
 * Factory qui crée un service CRUD générique pour une entité.
 * @param {string} apiPath - Le chemin de l'entité dans l'API
 * @returns {object} - Service avec les méthodes CRUD standard
 */
export function createEntityService(apiPath) {
    const base = () => `${serviceConfig.API_ROOT}/api/v1/${apiPath}`;

    return {
        createEntity: (formData) =>
            serviceConfig._doPost(`${base()}`, formData),

        listEntity: (page, pageSize, sort, searchTerm = "", status = "") =>
            serviceConfig._doGet(
                `${base()}/list?page=${page}&pageSize=${pageSize}&sort=${sort}&searchTerm=${searchTerm}&status=${status}`
            ),

        updateEntity: (entityId, formData) =>
            serviceConfig._doPut(`${base()}/${entityId}`, formData),

        detailsEntity: (entityId) =>
            serviceConfig._doGet(`${base()}/${entityId}`),

        deleteEntity: (entityId) =>
            serviceConfig._doDelete(`${base()}/${entityId}`),

        searchEntity: (page, pageSize, searchTerm, sort, status = "") =>
            serviceConfig._doGet(
                `${base()}/search?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}&sort=${sort}&status=${status}`
            ),

        listFromUids: (urlParams) =>
            serviceConfig._doGet(`${base()}/listFromUids?${urlParams}`),

        patchEntity: (entityId, formData) =>
            serviceConfig._doPatch(`${base()}/${entityId}`, formData),
    };

}
