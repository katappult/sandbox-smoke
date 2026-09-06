import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Avatar } from "antd";
import { useSelector } from "react-redux";
import { serviceConfig } from "@/services/utils/service.config";
import { serviceAccount } from "@/services/Account.service";
import { NotificationService } from "@/services/Notification.service";
import { PreferenceService } from "@/services/Preference.service";
import { isTrue, responseSuccess, toThumbFullURL } from "@/utils";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import NotificationView from "@/components/common/notification/NotificationView";

const NAV_HEIGHT = 60;
const ADMIN_ROLES = ["ROLE_ADMIN", "ROLE_SUPERADMIN"];

const NAV_LINKS = [];

function ClientNavbar({ onMobileMenuToggle, mobileMenuOpen }) {
    const { t } = useTranslation();
    const router = useRouter();
    const menuRef = useRef();

    const loggedIn = serviceConfig.isLoggedIn();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [hasRoleAdmin, setHasRoleAdmin] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [openNotif, setOpenNotif] = useState(false);

    const newNotifCount = useSelector((state) => state.nonPersisted?.newNotificationsCount ?? -1);

    const nickname = loggedIn ? serviceConfig.getNickName() : "";
    const initial = nickname.charAt(0).toUpperCase();

    useEffect(() => {
        if (newNotifCount >= 0) setNotificationsCount(newNotifCount);
    }, [newNotifCount]);

    useEffect(() => {
        if (!loggedIn) return;
        setHasRoleAdmin(ADMIN_ROLES.some((r) => serviceConfig.getUserRoles().includes(r)));
        serviceAccount.personalInfo().then((res) => {
            if (responseSuccess(res)) {
                const pic = res.data?.profilePicture;
                if (pic) setPhotoUrl(toThumbFullURL(pic));
            }
        });
        NotificationService.countByStatus("NEW").then((res) => {
            if (responseSuccess(res)) setNotificationsCount(res.data.attributes.count);
        });
        PreferenceService.getSystemPreferenceValue("system.notifications.push.enabled").then((res) => {
            if (responseSuccess(res)) setNotificationsEnabled(isTrue(res.data?.attributes?.value));
        });
    }, [loggedIn]);

    const toggleProfileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowProfileMenu((v) => !v);
        setOpenNotif(false);
    };

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: NAV_HEIGHT,
                zIndex: 100,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: "var(--client-navbar-bg, rgba(255,255,255,0.95))",
                borderBottom: "1px solid var(--card-border, #e5e7eb)",
            }}
        >
            <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 no-underline">
                    <img src="/images/klog-blue.svg" alt="Katappult" style={{ height: 28 }} />
                </a>

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center gap-6">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium no-underline transition-colors"
                            style={{
                                color: router.pathname === link.href
                                    ? "var(--color-1, #2563eb)"
                                    : "var(--text-secondary, #64748b)",
                            }}
                        >
                            {t(link.labelKey, link.labelKey)}
                        </a>
                    ))}
                </nav>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {loggedIn ? (
                        <>
                            {/* Notifications */}
                            {notificationsEnabled && (
                                <button
                                    className="relative p-2 rounded-xl border-0 bg-transparent cursor-pointer transition-all"
                                    style={{ color: "var(--text-secondary, #64748b)" }}
                                    onClick={() => { setOpenNotif(true); setShowProfileMenu(false); }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
                                    {notificationsCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </button>
                            )}

                            {/* Profile */}
                            <a
                                ref={menuRef}
                                className="flex items-center gap-2 cursor-pointer pl-1"
                                onClick={toggleProfileMenu}
                            >
                                <span
                                    className="text-xs font-semibold hidden sm:block"
                                    style={{ fontFamily: "Manrope, sans-serif", color: "var(--text-primary)" }}
                                >
                                    {nickname}
                                </span>
                                <Avatar
                                    src={photoUrl || undefined}
                                    size={32}
                                    className="border border-slate-200 flex-shrink-0"
                                    style={{
                                        background: photoUrl ? "transparent" : "var(--color-1, #2563eb)",
                                        fontSize: 13,
                                        fontWeight: 700,
                                    }}
                                >
                                    {!photoUrl && initial}
                                </Avatar>
                            </a>

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
                                setHasNewNotifications={() => {}}
                            />
                        </>
                    ) : (
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-0 cursor-pointer transition-all"
                            style={{
                                background: "var(--color-1, #2563eb)",
                                color: "#fff",
                                fontFamily: "Manrope, sans-serif",
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>login</span>
                            {t("client.nav.login", "Connexion")}
                        </button>
                    )}

                    {/* Mobile hamburger */}
                    {NAV_LINKS.length > 0 && (
                        <button
                            className="flex md:hidden p-2 rounded-xl border-0 bg-transparent cursor-pointer"
                            style={{ color: "var(--text-primary)" }}
                            onClick={onMobileMenuToggle}
                            aria-label="Menu"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                                {mobileMenuOpen ? "close" : "menu"}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileMenuOpen && NAV_LINKS.length > 0 && (
                <div
                    className="flex flex-col md:hidden px-6 pb-4"
                    style={{ background: "var(--client-navbar-bg, #ffffff)", borderBottom: "1px solid var(--card-border)" }}
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="py-3 text-sm font-medium no-underline border-b"
                            style={{
                                color: router.pathname === link.href
                                    ? "var(--color-1, #2563eb)"
                                    : "var(--text-secondary, #64748b)",
                                borderColor: "var(--card-border, #e5e7eb)",
                            }}
                        >
                            {t(link.labelKey, link.labelKey)}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}

export default function ClientLayout({ children, title }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.body.classList.add("client-body");
        return () => document.body.classList.remove("client-body");
    }, []);

    return (
        <div className="client-layout">
            <Head>
                <title>{title || "Katappult.ai"}</title>
                <link rel="icon" href={toThumbFullURL("/favicon.png")} type="image/png" sizes="32x32" />
            </Head>

            <ClientNavbar
                mobileMenuOpen={mobileMenuOpen}
                onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
            />

            <main
                style={{
                    marginTop: NAV_HEIGHT,
                    minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
                    maxWidth: "80%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {children}
            </main>
        </div>
    );
}
