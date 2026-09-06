import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {AuthenticationService} from "@/services/Authentication.service";
import {RoutesService} from "@/services/Routes.service";
import {Card} from "antd";
import AppTopBarStyle from "@/styles/components/App-topbar.module.css";
import {serviceConfig} from "@/services/utils/service.config";
import {switchThemeMode} from "@/components/admin/ThemeSettings";
import { useTranslation } from "react-i18next";

export default function HeaderUserMenu(props) {
    const { t } = useTranslation();

    const [userInfos, setUserInfos] = useState();
    const [hasRoleAdmin, setHasRoleAdmin] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setUserInfos({ nickname: serviceConfig.getNickName() });
        setHasRoleAdmin(
            serviceConfig.getUserRoles().includes('ROLE_SUPERADMIN') ||
            serviceConfig.getUserRoles().includes('ROLE_ADMIN')
        );
        setIsDark(localStorage.getItem("appThemeMode") === "dark");

        const onModeChange = (e) => setIsDark(e.detail.mode === "dark");
        window.addEventListener("appThemeModeChange", onModeChange);

        function handleClick() { props.hideMenu(); }
        document.body.addEventListener('click', handleClick);

        return () => {
            document.body.removeEventListener('click', handleClick);
            window.removeEventListener("appThemeModeChange", onModeChange);
        };
    }, []);

    const logout = async () => {
        localStorage.clear();
        RoutesService.toLogin(router);
        await AuthenticationService.logout();
    };

    const handleModeToggle = (e) => {
        e.stopPropagation();
        switchThemeMode(isDark ? "light" : "dark");
    };

    const forwardToProfile = () => {
        props.hideMenu();
        router.push("/profile?tab=profil");
    };

    const forwardToAdminPage = () => {
        props.hideMenu();
        router.push("/admin/users");
    };

    const forwardToSessions = () => {
        props.hideMenu();
        router.push("/profile?tab=sessions");
    };

    const getProfilePicture = () => {
        if (!props.photoUrl) return userInfos?.nickname?.charAt(0).toUpperCase();
        return <img src={props.photoUrl} style={{ width: "100%" }} />;
    };

    const menuTop = props.menuRef?.current
        ? props.menuRef.current.getBoundingClientRect().bottom + 8
        : 68;

    return createPortal(
        <Card className={AppTopBarStyle.header_user_menu} style={{ top: menuTop, right: 50 }}>
            <div className={AppTopBarStyle.compte_wrapper}>

                {/* ── Header: avatar + nom ── */}
                <a onClick={forwardToProfile} className={AppTopBarStyle.compte_header}>
                    <div className={AppTopBarStyle.compte_avatar}>
                        {getProfilePicture()}
                    </div>
                    <div className={AppTopBarStyle.compte_pseudo_wrapper}>
                        <span className={AppTopBarStyle.compte_pseudo}>
                            {userInfos?.nickname}
                        </span>
                        <span className={AppTopBarStyle.compte_pseudo_link}>
                            {t("header_menu.my_profile")}
                        </span>
                    </div>
                </a>

                {/* ── Items ── */}
                <div className={AppTopBarStyle.alignItems}>

                    {/* Dark mode toggle */}
                    <div className={AppTopBarStyle.menu_compte} onClick={handleModeToggle} style={{ cursor: "pointer" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-tertiary)" }}>
                            {isDark ? "light_mode" : "dark_mode"}
                        </span>
                        <span className={AppTopBarStyle.menu_title}>
                            {isDark ? t("header_menu.light_mode") : t("header_menu.dark_mode")}
                        </span>
                        <div className={AppTopBarStyle.toggle_track} data-active={isDark}>
                            <div className={AppTopBarStyle.toggle_thumb} />
                        </div>
                    </div>

                    <div className="separateur" />

                    <a onClick={forwardToSessions} className={AppTopBarStyle.menu_compte}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-tertiary)" }}>devices</span>
                        <span className={AppTopBarStyle.menu_title}>{t("header_menu.connected_devices")}</span>
                    </a>

                    <div className="separateur" />

                    <a onClick={() => { props.hideMenu(); router.push("/preferences"); }} className={AppTopBarStyle.menu_compte}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-tertiary)" }}>palette</span>
                        <span className={AppTopBarStyle.menu_title}>{t("header_menu.appearance_language")}</span>
                    </a>

                    {hasRoleAdmin && (
                        <>
                            <div className="separateur" />
                            <a onClick={forwardToAdminPage} className={AppTopBarStyle.menu_compte}>
                                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--text-tertiary)" }}>admin_panel_settings</span>
                                <span className={AppTopBarStyle.menu_title}>{t("menu.group_administration")}</span>
                            </a>
                        </>
                    )}

                    <div className="separateur" />

                    <a onClick={logout} className={AppTopBarStyle.menu_compte}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#d92d20" }}>logout</span>
                        <span className={AppTopBarStyle.menu_title} style={{ color: "#d92d20" }}>{t("header_menu.logout")}</span>
                    </a>
                </div>
            </div>
        </Card>,
        document.body
    );
}
