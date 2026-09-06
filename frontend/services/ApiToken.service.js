import { serviceConfig } from "./utils/service.config";

const BASE = "/core/api/v1/security/auth";

export const ApiTokenService = {
    listTokens,
    generateToken,
    revokeToken,
    listActiveSessions,
    listSessionHistory,
    revokeSession,
    revokeAllSessions,
};

async function listTokens() {
    const url = `${serviceConfig.API_ROOT}${BASE}/tokens`;
    return serviceConfig._doGet(url);
}

async function generateToken({ label, duration, unit }) {
    const url = `${serviceConfig.API_ROOT}${BASE}/token/generate`;
    return serviceConfig._doPost(url, { label, duration, unit });
}

async function revokeToken(id) {
    const url = `${serviceConfig.API_ROOT}${BASE}/token/revoke?tokenId=${id}`;
    return serviceConfig._doPost(url);
}

async function listActiveSessions() {
    const url = `${serviceConfig.API_ROOT}${BASE}/sessions/active`;
    return serviceConfig._doGet(url);
}

async function listSessionHistory(page = 0, pageSize = 10) {
    const url = `${serviceConfig.API_ROOT}${BASE}/sessions/history?page=${page}&pageSize=${pageSize}`;
    return serviceConfig._doGet(url);
}

async function revokeSession(uuid) {
    const url = `${serviceConfig.API_ROOT}${BASE}/sessions/${uuid}/revoke`;
    return serviceConfig._doPost(url);
}

async function revokeAllSessions() {
    const url = `${serviceConfig.API_ROOT}${BASE}/sessions`;
    return serviceConfig._doDelete(url);
}
