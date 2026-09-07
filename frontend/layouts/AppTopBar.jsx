import AppTopbarStyle from "@/styles/components/App-topbar.module.css";
import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import {Avatar} from "antd";
import {serviceConfig} from "@/services/utils/service.config";
import {NotificationService} from "@/services/Notification.service";
import {isTrue, responseSuccess, toThumbFullURL} from "@/utils";
import {useSelector} from "react-redux";
import NotificationView from "@/components/common/notification/NotificationView";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import {serviceAccount} from "@/services/Account.service";
import {PreferenceService} from "@/services/Preference.service";

export default function AppTopBar({onSidebarToggle}) {
    const { t } = useTranslation();
    const loggedIn = serviceConfig.isLoggedIn();

    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [openNotif, setOpenNotif] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);

    const menuRef = useRef();
    const newNotifCount = useSelector((state) => state.nonPersisted.newNotificationsCount);

    useEffect(() => {
        if (newNotifCount >= 0) setNotificationsCount(newNotifCount);
    }, [newNotifCount]);

    useEffect(() => {
        NotificationService.countByStatus("NEW").then((response) => {
            if (responseSuccess(response)) {
                setNotificationsCount(response.data.attributes.count);
            }
        });
    }, []);

    useEffect(() => {
        serviceAccount.personalInfo().then((res) => {
            if (responseSuccess(res)) {
                const profilePicture = res.data?.profilePicture;
                if (profilePicture) setPhotoUrl(toThumbFullURL(profilePicture, 150));
            }
        });
    }, []);

    useEffect(() => {
        PreferenceService.getSystemPreferenceValue("system.notifications.push.enabled").then(response => {
            if (responseSuccess(response)) {
                const enabled = isTrue(response.data?.attributes?.value);
                setNotificationsEnabled(enabled);
            }
        })
    }, []);

    const toggleProfileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowProfileMenu((v) => !v);
        setOpenNotif(false);
    };

    const nickname = loggedIn ? serviceConfig.getNickName() : "";
    const initial = nickname.charAt(0).toUpperCase();

    return (
        /* AppTopbarStyle.container gère left: var(--sidebar-w) et la transition — on garde impérativement */
        <div className={AppTopbarStyle.container} style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "var(--topbar-bg)",
            color: "var(--topbar-text)",
            borderBottom: "var(--topbar-border-bottom)"
        }}>
            <div className="flex w-full h-full items-center justify-between px-6 gap-4">

                {/* ── Gauche : hamburger mobile + recherche ── */}
                <div className="flex items-center gap-4 flex-1 max-w-md">
                    {onSidebarToggle && (
                        <button
                            className="flex-shrink-0 p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all border-0 bg-transparent outline-none cursor-pointer"
                            onClick={onSidebarToggle}
                            aria-label="Menu"
                        >
                            <span className="material-symbols-outlined" style={{fontSize: 22}}>menu</span>
                        </button>
                    )}
                    <div className="relative w-full">
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            style={{fontSize: 18}}>search</span>
                        <input
                            type="text"
                            placeholder={t("topbar.search_placeholder")}
                            autoComplete="off" name={"search"}
                            className="w-full bg-white rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none transition-all"
                            style={{fontFamily: "Manrope, sans-serif", border: "1px solid var(--card-border)", color: "var(--text-primary)"}}
                        />
                    </div>
                </div>

                {/* ── Droite : actions + profil ── */}
                <div className="flex items-center gap-2">
                    {loggedIn && (
                        <>
                            {/* Notifications */}
                            {
                                notificationsEnabled && <>
                                    <button
                                        className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all border-0 bg-transparent outline-none cursor-pointer"
                                        onClick={() => {
                                            setOpenNotif(true);
                                            setShowProfileMenu(false);
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{fontSize: 22}}>notifications</span>
                                        {notificationsCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
                                        )}
                                    </button>
                                </>
                            }

                            {/* Aide */}
                            <button
                                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all border-0 bg-transparent outline-none cursor-pointer">
                                <span className="material-symbols-outlined" style={{fontSize: 22}}>help</span>
                            </button>

                            {/* Séparateur */}
                            <div className="h-5 w-px bg-slate-200 mx-1"/>

                            {/* Profil */}
                            <a ref={menuRef} className="flex items-center gap-3 cursor-pointer pl-2"
                               onClick={toggleProfileMenu}>
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold leading-none"
                                       style={{fontFamily: "Manrope, sans-serif", color: "var(--text-primary)"}}>{nickname}</p>
                                    <p className="text-[10px] leading-none mt-0.5" style={{color: "var(--text-muted)"}}>{t("topbar.role_admin")}</p>
                                </div>
                                <Avatar
                                    src={photoUrl || undefined}
                                    size={32}
                                    className="border border-slate-200 flex-shrink-0"
                                    style={{
                                        background: photoUrl ? "transparent" : "var(--color-1)",
                                        fontSize: 13,
                                        fontWeight: 700,
                                    }}
                                >
                                    {!photoUrl && initial}
                                </Avatar>
                            </a>

                            {/* Dropdowns */}
                            {showProfileMenu && (
                                <HeaderUserMenu
                                    menuRef={menuRef}
                                    photoUrl={photoUrl}
                                    hideMenu={() => setShowProfileMenu(false)}
                                />
                            )}
                            <NotificationView
                                menuRef={menuRef}
                                hideMenu={() => setOpenNotif(false)}
                                openNotif={openNotif}
                                setHasNewNotifications={() => {
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
