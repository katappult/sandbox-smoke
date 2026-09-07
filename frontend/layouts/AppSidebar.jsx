import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import s from "@/styles/layouts/AppSidebar.module.css";
import MenuFront, { groups } from "@/layouts/MenuFront";
import MenuUser from "@/layouts/MenuUser";
import { ViewSidebarOutlined } from "@mui/icons-material";
import {MenuDev} from "@/layouts/MenuDev";
import {RoutesService} from "@/services/Routes.service";
import {AuthenticationService} from "@/services/Authentication.service";

// mode: 'minimized' | 'fixed' | 'maximized' | 'hidden'
const allMenuItems = groups.flatMap(g => g.children.filter(item => item && item.key));

const isDev = process.env.NODE_ENV !== "production";

function DevNavFloating() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return (
        <div className={s.dev_float_wrap}>
            {open && (
                <div className={s.dev_float_panel}>
                    <div className={s.dev_float_title}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>bug_report</span>
                        Navigation — dev
                    </div>
                    <div className={s.dev_float_list}>
                        {MenuDev.map(item => (
                            <button
                                key={item.key}
                                className={s.dev_float_item}
                                onClick={() => { router.push(item.link); setOpen(false); }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <button
                className={`${s.dev_float_btn} ${open ? s.dev_float_btn_active : ""}`}
                onClick={() => setOpen(o => !o)}
                title="Navigation — dev only"
            >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {open ? "close" : "grid_view"}
                </span>
            </button>
        </div>
    );
}

export default function AppSidebar({ mode, onModeChange, ctaLabel = "New", onCtaClick }) {
    const router = useRouter();
    const { t } = useTranslation();
    const [section, setSection] = useState("main");

    const minimized = mode === "minimized";
    const expanded  = mode === "fixed" || mode === "maximized";
    const isOverlay = mode === "maximized";

    const handleNavigate = () => {
        if (mode === "maximized") onModeChange("hidden");
    };

    const modeClass = {
        minimized:  s.sidebar_minimized,
        fixed:      s.sidebar_fixed,
        maximized:  s.sidebar_maximized,
        hidden:     s.sidebar_hidden,
    }[mode] ?? s.sidebar_fixed;

    const logout = async () => {
        localStorage.clear();
        RoutesService.toLogin(router);
        await AuthenticationService.logout();
    };

    return (
        <>
            {/* Backdrop mobile (overlay uniquement) */}
            {isOverlay && (
                <div className={s.backdrop_mobile} onClick={() => onModeChange("hidden")} />
            )}

            <aside className={`${s.sidebar} ${modeClass} flex flex-col bg-slate-50 dark:bg-slate-900`}>

                {/* Brand */}
                <div className={`px-6 pt-3 pb-4 flex-shrink-0 ${minimized ? "flex justify-center" : ""}`}>
                    {!minimized ? (
                        <>
                            <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400" style={{ fontFamily: "Manrope, sans-serif" }}>
                                Company Logo
                            </h1>
                            <p className="text-xs text-white-alpha-70 font-medium mt-0.5">Application Tagline</p>
                        </>
                    ) : (
                        <button
                            className={`${s.mode_pill} ${s.mode_pill_active}`}
                            onClick={() => onModeChange("fixed")}
                            title={t("sidebar.expand_title")}
                        >
                            <ViewSidebarOutlined />
                        </button>
                    )}
                </div>

                {/* Menu principal */}
                {expanded && (
                    <div className={s.panel}>
                        {section === "main"     && <MenuFront onNavigate={handleNavigate} />}
                        {section === "settings" && <MenuUser  onNavigate={handleNavigate} />}
                    </div>
                )}

                {/* Footer */}
                {expanded && (
                    <div className="mt-auto px-4 pt-5 pb-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                        {/* CTA action principale */}
                        {ctaLabel && (
                            <button
                                onClick={onCtaClick}
                                className="w-full mb-3 text-white py-3 border-transparent rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                style={{ background: "#002045", fontFamily: "Manrope, sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#1a365d"}
                                onMouseLeave={e => e.currentTarget.style.background = "#002045"}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                                {ctaLabel}
                            </button>
                        )}

                        <a className="flex items-center px-4 py-2 text-slate-500 hover:text-blue-900 dark:hover:text-blue-300 transition-colors rounded-full cursor-pointer text-sm">
                            <span className="material-symbols-outlined mr-3" style={{ fontSize: 20 }}>help</span>
                            {t("sidebar.help_link")}
                        </a>
                        <a onClick={logout} className="flex items-center px-4 py-2 text-slate-500 hover:text-red-600 transition-colors rounded-full cursor-pointer text-sm">
                            <span className="material-symbols-outlined mr-3" style={{ fontSize: 20 }}>logout</span>
                            {t("sidebar.logout_link")}
                        </a>

                        {/* Bouton réduire */}
                        <div className="flex justify-end pt-2">
                            <button
                                className={s.mode_pill}
                                onClick={() => onModeChange("minimized")}
                                title={t("sidebar.minimize_title")}
                            >
                                <ViewSidebarOutlined style={{ fontSize: 15 }} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>
            {isDev && <DevNavFloating />}
        </>
    );
}
