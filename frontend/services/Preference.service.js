import axios from "axios";
import {serviceConfig} from "./utils/service.config";

export const PreferenceService = {
    getUserPreferences,
    getUserPreferenceValue,
    updateUserPreference,
    getSystemPreferences,
    getSystemPreferenceValue,
    getSystemPreferenceValuePublic,
    updateSystemPreference
};

async function getUserPreferences() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/preferences/user`;
    return await serviceConfig._doGet(url);
}

async function getUserPreferenceValue(key) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/preferences/user/${key}`;
    return await serviceConfig._doGet(url);
}

async function updateUserPreference(key, value) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/preferences/user/${key}?value=${encodeURIComponent(value)}`;
    return await serviceConfig._doPut(url);
}

async function getSystemPreferences() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/preferences/system`;
    return await serviceConfig._doGet(url);
}

async function getSystemPreferenceValue(key) {
    // Appel sans handleJWTError pour éviter une boucle infinie si appelé depuis la page login (non authentifié)
    const url = `${serviceConfig.API_ROOT}/core/api/v1/preferences/system/${key}`;
    return await serviceConfig._doGet(url);
}

async function getSystemPreferenceValuePublic(key) {
    // Appel sans handleJWTError pour éviter une boucle infinie si appelé depuis la page login (non authentifié)
    const url = `${serviceConfig.API_ROOT}/core/api/pub/v1/preferences/system/${key}`;
    return await axios.get(url, {
        validateStatus: () => true,
        headers: {"Content-Type": "application/json", Accept: "application/json"},
    });
}

async function updateSystemPreference(key, value) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/preferences/system/${key}?value=${encodeURIComponent(value)}`;
    return await serviceConfig._doPut(url);
}
