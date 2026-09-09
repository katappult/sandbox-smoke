const AUTH_LOGIN_PAGE_URL = "/auth/login";
const AUTH_REGISTER_PAGE_URL = "/auth/register";
const AUTH_LOST_PASS_PAGE_URL = "/auth/lostpass";

function toLogin(router) {
    window.location.href = AUTH_LOGIN_PAGE_URL;
}

function toLogin2(router) {
    router.replace(AUTH_LOGIN_PAGE_URL);
}

function toRegister(router) {
    return router.push(AUTH_REGISTER_PAGE_URL);
}
function toLostPass(router) {
    return router.push(AUTH_LOST_PASS_PAGE_URL);
}

const ADMIN_PAGE_URL = "/admin";
const ADMIN_USERS_PAGE_URL = "/admin/users";

function toAdminPage(router) {
    return router.push(ADMIN_PAGE_URL);
}
function toAdminUsersPage(router) {
    return router.push(ADMIN_USERS_PAGE_URL);
}

const FRONT_OFFICE_HOME_PAGE_URL = "/";

function toFrontOfficeHomePage(router) {
    return router.push(FRONT_OFFICE_HOME_PAGE_URL);
}


export const RoutesService = {
    toLogin2,
    toLogin,
    toRegister,
    toLostPass,
    toAdminPage,
    toAdminUsersPage,
    toFrontOfficeHomePage,
    AUTH_LOGIN_PAGE_URL,
    AUTH_REGISTER_PAGE_URL,
    AUTH_LOST_PASS_PAGE_URL,
    ADMIN_PAGE_URL,
    ADMIN_USERS_PAGE_URL,
    FRONT_OFFICE_HOME_PAGE_URL,
};