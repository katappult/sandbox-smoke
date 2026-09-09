import axios from "axios";
import {serviceConfig} from "./utils/service.config";
import cookie from "js-cookie";

export const AuthenticationService = {
    login,
    preCreateAccount,
    createAccountAnon,
    logout,
    resetPassword,
    isEmailUsed,
    isNickNameUsed,
    oauth2,
    post2FASuccessLogin,
    updateMailAndNickName,
    refresh,
    getMe,
};

async function getMe() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/me`;
    return await serviceConfig._doGet(url);
}

async function updateMailAndNickName(form) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/updateMailAndNickName`;
    return await serviceConfig._doPost(url, form);
}


async function oauth2(email) {
    const uri = "/your_app_name/cloud/app/v1/secured/api/custom-login/oauth2";
    const url = `${serviceConfig.API_ROOT}${uri}?userEmail=${email}`;

    return await serviceConfig._doPost(url);
}

async function isEmailUsed(email) {
    const uri = "/core/api/pub/v1/auth/isEmailInUse";
    const url = `${serviceConfig.API_ROOT}${uri}?email=${email}`;

    return await serviceConfig._doGet(url);
}

async function isNickNameUsed(nickName) {
    const uri = "/core/api/pub/v1/auth/isNickNameUsed";
    const url = `${serviceConfig.API_ROOT}${uri}?nickName=${nickName}`;

    return await serviceConfig._doGet(url);
}

// withCredentials: true — nécessaire pour que le navigateur stocke le cookie
// RefreshToken (httpOnly) posé par le serveur à la réponse de login, condition du
// refresh silencieux. Sûr depuis le correctif katappult-core sur
// KatappultJWTRequestAuthFilter/TokenUtils.getAuthToken : un cookie Authorization
// périmé ne prime plus sur le header et ne bloque plus les routes publiques.
async function login(formData) {
    const uri = "/core/api/pub/v1/security/auth/login";
    const url = `${serviceConfig.API_ROOT}${uri}?source=js`;
    return await axios.post(url, formData, {
        withCredentials: true,
        timeout: 45000,
        validateStatus: () => true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
}

async function post2FASuccessLogin(form) {
    const uri = "/core/api/pub/v1/security/auth/post2FALogin";
    const url = `${serviceConfig.API_ROOT}${uri}`;

    return await axios.post(url, form, {
        withCredentials: true,
        timeout: 45000,
        validateStatus: () => true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
}

async function createAccountAnon(formData) {
    const uri = "/core/api/pub/v1/person/register";
    const url = `${serviceConfig.API_ROOT}${uri}`;
    return await serviceConfig._doPost(url, formData);
}

async function clearLocalStorage() {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("accountId");
    cookie.remove("JSESSIONID");
    cookie.remove("Authorization");
}

async function preCreateAccount(email, pseudo) {
    const uri = "/core/api/pub/v1/security/auth/preCreateAccount";
    const url =
        `${serviceConfig.API_ROOT}${uri}?email=` + email + `&pseudo=` + pseudo;
    return await serviceConfig._doPost(url);
}

async function logout() {
    const uri = "/core/api/v1/security/auth/logout?clientId=web";
    const url = `${serviceConfig.API_ROOT}${uri}`;

    try {
        return await serviceConfig._doPost(url);
    } finally {
        serviceConfig.logout();
    }
}

async function resetPassword(token, formData) {
    const uri = "/core/api/pub/v1/security/auth/resetPassword";
    const url = `${serviceConfig.API_ROOT}${uri}?token=${token}`;
    return await serviceConfig._doPut(url, formData);
}

async function refresh() {
    return serviceConfig.attemptRefresh();
}
