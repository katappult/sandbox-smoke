import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.

export const NotificationService = {
    listNotifications,
    countByStatus,
    setStatus,
    deleteNotification,
    deleteAll,
    markAllRead,
    getNotifPreferences,
    updateNotifPreference
};

async function getNotifPreferences() {
   return {}
}

async function updateNotifPreference() {
    return {}
}


async function listNotifications(status, page, pageSize) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/notification/byAccount?status=${status}&page=${page}&pageSize=${pageSize}`;
    return await serviceConfig._doGet(url);
}

async function countByStatus(status) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/notification/countByStatus?status=${status}`;
    return await serviceConfig._doGet(url);
}

async function setStatus(uid, status) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/notification/${uid}/status?status=${status}`;
    return await serviceConfig._doPatch(url);
}

async function deleteNotification(uid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/notification/${uid}`;
    return await serviceConfig._doDelete(url);
}

async function deleteAll() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/notification/deleteAll`;
    return await serviceConfig._doDelete(url);
}

async function markAllRead() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/notification/markAllReaden`;
    return await serviceConfig._doPatch(url);
}
