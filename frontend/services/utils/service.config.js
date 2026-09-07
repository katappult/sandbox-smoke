import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import store from "../../redux/store.service";

const API_DEFAULT_TIMEOUT = 45000;

const getAPIRoot = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
};

const createNewAxiosInstance = () => {
    _axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
        timeout: API_DEFAULT_TIMEOUT,
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthorizationCookie(),
        }
    })
}

const API_ROOT = getAPIRoot();

const getApplication = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
}

const getAppContainerId = () => {
    return store.getState().userProfile?.applicationContainerId || "";
};

const getAccountEmail = () => {
    return getDecodedToken()?.login || "";
};
const getAccountId = () => {
    return store.getState().userProfile?.accountId || "";
};


const getAccountUid = () => {
    return store.getState().userProfile?.accountId || "";
};

let _axiosInstance;
const axiosInstance = () => {
    if (!_axiosInstance) createNewAxiosInstance();
    return _axiosInstance;
}

const setName = (name) => {
    return localStorage.setItem("name", name);
};
const getName = () => {
    return localStorage.getItem("name");
};

const getOwnerSummary = ()=>{
    return store.getState().userProfile?.ownerSummary || "";
}

const getSub =()=>{
    return getDecodedToken()?.sub || "";
}

const getNickName = ()=>{
    return getDecodedToken()?.nickName || "";
}

const getLogin = ()=>{
    return getDecodedToken()?.login || "";
}

const getUserId = ()=>{
    return store.getState().userProfile?.userId || "";
}

const getUserRoles = ()=>{
    return store.getState().userProfile?.roles || [];
}

const hasRoleAdmin = () => {
    const ADMIN_ROLES = ["ROLE_ADMIN", "ROLE_SUPERADMIN"];
    const roles = serviceConfig.getUserRoles();
    return roles.some(r => ADMIN_ROLES.includes(r));
}

export const serviceConfig = {
    getUserRoles,
    hasRoleAdmin,
    getUserId,
    getLogin,
    getNickName,
    getSub,
    getOwnerSummary,
    _doGetBlob,
    API_ROOT,
    _doGet,
    _doPost,
    _doPostWithBody,
    _doPut,
    _doPatch,
    _doDelete,
    _doPostFiles,
    _doPutFiles,
    _doDeleteWithData,
    axiosInstance,
    forwardToLoginPage,
    getAccountId,
    getAccountUid,
    getDecodedToken,
    getApplication,
    _doPutWithoutData,
    getContainerSetting,
    getAccountEmail,
    getAppContainerId,
    setName,
    getName,
    isLoggedIn,
    logout,
    setAuthorizationCookie,
    attemptRefresh,
}

function getAuthorizationCookie() {
    return Cookies.get('Authorization');
}

function setAuthorizationCookie(token){
    Cookies.set('Authorization', token, {
        secure: true,       // HTTPS
        sameSite: 'strict', // protection
        // NE PAS mettre httpOnly ici — js-cookie est côté
        // Pour httpOnly, le cookie doit être émis par le serveur
    })
}

function getContainerSetting(containerSettingsRX, key) {
    let value = "";
    containerSettingsRX.map((setting) => {
        if (setting.attributes.key === key) {
            value = setting.attributes.value;
        }
    });

    return value;
}

function isLoggedIn() {
    if (typeof window !== "undefined") {
        const token = getDecodedToken();
        return token !== null;
    }

    return false;
}

function getDecodedToken () {
    const token = Cookies.get("Authorization");
    if(!token) return  null;

    try {
        return jwtDecode(token, {});
    } catch (error){
        return null;
    }
}

function forwardToLoginPage() {
    logout();
    return (window.location.href = "/login");
}

async function _doPost(uri, data) {
    return _executeWithRefreshRetry(() => _doPostWithBody(uri, data));
}

// withCredentials: false ici : ces appels s'authentifient uniquement via le header
// Authorization explicite, ils n'ont pas besoin des cookies. Seuls login/refresh
// (plus bas) ont besoin de withCredentials: true pour poser/envoyer le cookie
// RefreshToken — désormais sûr depuis le correctif côté katappult-core sur
// KatappultJWTRequestAuthFilter/TokenUtils.getAuthToken (le cookie Authorization
// périmé ne prime plus sur le header et ne bloque plus les routes publiques).
async function _doPostWithBody(uri, data) {
    return axios.create({withCredentials: false}).post(uri, data, {
        baseURL: API_ROOT,
        timeout: API_DEFAULT_TIMEOUT,
        validateStatus: () => true,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthorizationCookie(),
        },
    });
}

async function _doPostFiles(uri, data) {
    return _executeWithRefreshRetry(() =>
        axios.create({withCredentials: false}).post(uri, data, {
            baseURL: API_ROOT,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            headers: {
                // Ne pas forcer Content-Type ici : axios le génère automatiquement
                // avec le boundary quand data est un FormData.
                Accept: "application/json",
                Authorization: getAuthorizationCookie(),
            },
        })
    );
}

async function _doPutFiles(uri, data) {
    return _executeWithRefreshRetry(() =>
        axios.create({withCredentials: false}).put(uri, data, {
            baseURL: API_ROOT,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            headers: {
                Accept: "application/json",
                Authorization: getAuthorizationCookie(),
            },
        })
    );
}

async function _doPut(uri, data) {
    return _executeWithRefreshRetry(() =>
        axios.create({withCredentials: false}).put(uri, data, {
            baseURL: API_ROOT,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: getAuthorizationCookie(),
            },
        })
    );
}

async function _doPatch(uri, data) {
    return _executeWithRefreshRetry(() =>
        axios.create({withCredentials: false}).patch(uri, data, {
            baseURL: API_ROOT,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: getAuthorizationCookie(),
            },
        })
    );
}

async function _doPutWithoutData(uri, data) {
    return _doPut(uri, data);
}

async function _doDelete(uri) {
    return _executeWithRefreshRetry(() =>
        axios.create({withCredentials: false}).delete(uri, {
            baseURL: API_ROOT,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            data: {},
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: getAuthorizationCookie(),
            },
        })
    );
}

async function _doDeleteWithData(uri, data) {
    return _executeWithRefreshRetry(() =>
        axios.create({withCredentials: false}).delete(uri, {
            baseURL: API_ROOT,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: getAuthorizationCookie(),
            },
            data: data,
        })
    );
}

async function _doGet(uri) {
    const lang = Cookies.get('lang') || "fr";
    const finalURI = uri.includes("?") ? uri + "&lang=" + lang : uri + "?lang=" + lang;
    return _executeWithRefreshRetry(() =>
        axios.get(finalURI, {
            baseURL: API_ROOT,
            withCredentials: false,
            timeout: API_DEFAULT_TIMEOUT,
            validateStatus: () => true,
            data: {},
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: uri.includes("/anon/") ? null : getAuthorizationCookie(),
            },
        })
    );
}

async function _doGetBlob(uri) {
    return _executeWithRefreshRetry(() =>
        axios.get(uri, {
            baseURL: API_ROOT,
            withCredentials: false,
            responseType: 'blob',
            timeout: 120000,
            validateStatus: () => true,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/*",
                Authorization: uri.includes("/anon/") ? null : getAuthorizationCookie(),
            },
        })
    );
}

function logout () {
    Cookies.remove("Authorization");
}

// ---------------------------------------------------------------------------
// Refresh token — mutex + retry automatique sur JWT expiré/invalide (401/511)
// ---------------------------------------------------------------------------

let _isRefreshing = false;
let _refreshWaiters = [];

// withCredentials: true — nécessaire pour envoyer le cookie RefreshToken httpOnly
// et recevoir sa rotation via Set-Cookie. Sûr depuis le correctif katappult-core
// (voir commentaire au-dessus de _doPostWithBody) : un cookie Authorization périmé
// ne fait plus rejeter cet appel.
async function _callRefreshEndpoint() {
    return axios.post(
        `${API_ROOT}/core/api/pub/v1/security/auth/refresh`,
        null,
        { withCredentials: true, validateStatus: () => true, timeout: API_DEFAULT_TIMEOUT }
    );
}

async function attemptRefresh() {
    if (_isRefreshing) {
        return new Promise((resolve, reject) =>
            _refreshWaiters.push({ resolve, reject })
        );
    }
    _isRefreshing = true;
    try {
        const res = await _callRefreshEndpoint();
        if (res.status === 200) {
            const newToken = res.data?.attributes?.token;
            if (newToken) setAuthorizationCookie(newToken);
            _refreshWaiters.forEach(w => w.resolve());
        } else {
            const err = new Error("Refresh failed");
            _refreshWaiters.forEach(w => w.reject(err));
            forwardToLoginPage();
            throw err;
        }
    } catch (e) {
        _refreshWaiters.forEach(w => w.reject(e));
        _isRefreshing = false;
        _refreshWaiters = [];
        throw e;
    } finally {
        _isRefreshing = false;
        _refreshWaiters = [];
    }
}

async function _executeWithRefreshRetry(requestFn) {
    const response = await requestFn();
    if (response.status !== 401 && response.status !== 511) return response;
    // Pas de cookie Authorization au départ : l'utilisateur n'était pas connecté
    // (ex. route publique) — un 401 ici n'est pas un JWT expiré, ne pas tenter de refresh.
    if (!getAuthorizationCookie()) return response;
    try {
        await attemptRefresh();
    } catch {
        return response;
    }
    return requestFn();
}

