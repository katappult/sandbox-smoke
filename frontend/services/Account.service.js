import {serviceConfig} from "./utils/service.config";

// uid    — the unique identifier of an entity (UUID string).
// fullId — the encoded identifier of an entity, combining its OID and its class.
//          Always use fullId instead of raw numeric OIDs.
export const serviceAccount = {
    // personal info
    personalInfo,
    updatePersonalInfo,
    updatePassword,
    uploadAvatar,
    deleteAvatar,
    // email / nickname
    isEmailUsed,
    isNickNameUsed,
    preUpdateEmail,
    // 2FA
    enableTwoFactorsAuthentication,
    disableTwoFactorsAuthentication,
    isTwoFactorsAuthenticationEnable,
    resend2FAValidationCode,
    // password reset (anonymous)
    resetPasswordAnon,
    requestResetPasswordAnon,
    isCodeValidAnon,
    // current user
    me,
    // session management
    logout,
    listActiveSessions,
    listSessionsHistory,
    revokeSession,
    revokeMyActiveSessions,
    revokeAllSessions,
    // token management
    listTokens,
    generateToken,
    revokeToken,
    // RGPD — self-service
    deactivateMyAccount,
    anonymizeMyAccount,
    requestAccountDeletion,
    // admin — account management
    listAccounts,
    searchAccounts,
    lockUserAccount,
    unlockUserAccount,
    setSystemLocked,
    getAccountPermissions,
    getAccountRoles,
    getAccountGroups,
    // RGPD — admin
    reactivateUserAccount,
    approveDeletion,
};

// ---------------------------------------------------------------------------
// Personal info  —  CoreUserSelfServiceFacade  /core/api/v1/user-principals
// ---------------------------------------------------------------------------

async function personalInfo() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/personalInfos`;
    return await serviceConfig._doGet(url);
}

async function updatePersonalInfo(formData) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/personalInfos`;
    return await serviceConfig._doPostFiles(url, formData);
}

async function updatePassword(formData) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/updatePassword`;
    return await serviceConfig._doPut(url, formData);
}

async function uploadAvatar(formData) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/thumbed/setAtIndex?thumbedId=${serviceConfig.getUserId()}&index=0`;
    return await serviceConfig._doPostFiles(url, formData);
}

async function deleteAvatar() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/thumbed/setAtIndex?thumbedId=${serviceConfig.getUserId()}&index=0`;
    return await serviceConfig._doPost(url);
}

// ---------------------------------------------------------------------------
// Email / nickname
// ---------------------------------------------------------------------------

async function isEmailUsed(email) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/isEmailInUse?email=${email}`;
    return await serviceConfig._doGet(url);
}

async function isNickNameUsed(nickName) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/isNickNameUsed?nickName=${nickName}`;
    return await serviceConfig._doGet(url);
}

async function preUpdateEmail(newEmail, oldEmail) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/preUpdateEmail?newEmail=${newEmail}&oldEmail=${oldEmail}`;
    return await serviceConfig._doPost(url);
}

// ---------------------------------------------------------------------------
// 2FA
// ---------------------------------------------------------------------------

async function enableTwoFactorsAuthentication(accountUid, code) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/enableTwoFactorsAuthentication?code=${code}&accountUid=${accountUid}`;
    return await serviceConfig._doPatch(url);
}

async function disableTwoFactorsAuthentication(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/disableTwoFactorsAuthentication?accountUid=${accountUid}`;
    return await serviceConfig._doPatch(url);
}

async function isTwoFactorsAuthenticationEnable(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/isTwoFactorsAuthenticationEnable?accountUid=${accountUid}`;
    return await serviceConfig._doGet(url);
}

async function resend2FAValidationCode(form) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/resend2FAValidationCode`;
    return await serviceConfig._doPost(url, form);
}

// ---------------------------------------------------------------------------
// RGPD — self-service  —  CoreCustomUsersRestServiceFacade
// ---------------------------------------------------------------------------

async function deactivateMyAccount() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/deactivate`;
    return await serviceConfig._doPatch(url);
}

async function anonymizeMyAccount() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/anonymize`;
    return await serviceConfig._doPatch(url);
}

async function requestAccountDeletion() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/user-principals/account`;
    return await serviceConfig._doDelete(url);
}

// ---------------------------------------------------------------------------
// Password reset (anonymous)  —  CoreAuthenticationServiceFacade pub
// ---------------------------------------------------------------------------

async function requestResetPasswordAnon(token, email) {
    const url = `${serviceConfig.API_ROOT}/core/api/pub/v1/security/auth/requestResetPassword?token=${token}&email=${email}`;
    return await serviceConfig._doPost(url);
}

async function isCodeValidAnon(token, email, code) {
    const url = `${serviceConfig.API_ROOT}/core/api/pub/v1/security/auth/isCodeValid?token=${token}&email=${email}&code=${code}`;
    return await serviceConfig._doPost(url);
}

async function resetPasswordAnon(token, code, formData) {
    const url = `${serviceConfig.API_ROOT}/core/api/pub/v1/security/auth/resetPassword?token=${token}&code=${code}`;
    return await serviceConfig._doPut(url, formData);
}

// ---------------------------------------------------------------------------
// Current user  —  CoreAuthenticationServiceFacade
// ---------------------------------------------------------------------------

async function me() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/me`;
    return await serviceConfig._doGet(url);
}

// ---------------------------------------------------------------------------
// Session management  —  CoreAuthenticationServiceFacade
// ---------------------------------------------------------------------------

async function logout() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/logout`;
    return await serviceConfig._doPost(url);
}

async function listActiveSessions() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/sessions/active`;
    return await serviceConfig._doGet(url);
}

async function listSessionsHistory(page = 0) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/sessions/history?page=${page}`;
    return await serviceConfig._doGet(url);
}

async function revokeSession(uuid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/sessions/revoke?uuid=${uuid}`;
    return await serviceConfig._doPost(url);
}

async function revokeMyActiveSessions() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/sessions`;
    return await serviceConfig._doDelete(url);
}

async function revokeAllSessions() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/sessions/all`;
    return await serviceConfig._doDelete(url);
}

// ---------------------------------------------------------------------------
// Token management  —  CoreAuthenticationServiceFacade
// ---------------------------------------------------------------------------

async function listTokens() {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/tokens`;
    return await serviceConfig._doGet(url);
}

async function generateToken(duration, unit, label) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/token/generate`;
    return await serviceConfig._doPost(url, {duration, unit, label});
}

async function revokeToken(tokenId) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/security/auth/token/revoke?tokenId=${tokenId}`;
    return await serviceConfig._doPost(url);
}

// ---------------------------------------------------------------------------
// Admin — account management  —  CoreUserPrincipalsServiceFacade
//  base: /core/api/v1/principals/account
// ---------------------------------------------------------------------------

async function listAccounts(searchTerm, roles, page = 0, pageSize = 10) {
    const params = new URLSearchParams({page, pageSize});
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (roles && roles.length) roles.forEach(r => params.append("roles", r));
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/list?${params}`;
    return await serviceConfig._doGet(url);
}

async function searchAccounts(searchTerm, roles, page = 0, pageSize = 10) {
    const params = new URLSearchParams({page, pageSize});
    if (searchTerm) params.append("searchTerm", searchTerm);
    if (roles && roles.length) roles.forEach(r => params.append("roles", r));
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/search?${params}`;
    return await serviceConfig._doGet(url);
}

async function lockUserAccount(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/lock`;
    return await serviceConfig._doPatch(url);
}

async function unlockUserAccount(accountUid, lockToken) {
    const params = lockToken ? `?lockToken=${lockToken}` : "";
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/unlock${params}`;
    return await serviceConfig._doPatch(url);
}

async function setSystemLocked(login, status) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/setSystemLocked?status=${status}&login=${login}`;
    return await serviceConfig._doPut(url);
}

async function getAccountPermissions(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/permissions`;
    return await serviceConfig._doGet(url);
}

async function getAccountRoles(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/roles`;
    return await serviceConfig._doGet(url);
}

async function getAccountGroups(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/groups`;
    return await serviceConfig._doGet(url);
}

// ---------------------------------------------------------------------------
// RGPD — admin  —  CoreUserPrincipalsServiceFacade
// ---------------------------------------------------------------------------

async function reactivateUserAccount(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/reactivate`;
    return await serviceConfig._doPatch(url);
}

async function approveDeletion(accountUid) {
    const url = `${serviceConfig.API_ROOT}/core/api/v1/principals/account/${accountUid}/approve-deletion`;
    return await serviceConfig._doPatch(url);
}
