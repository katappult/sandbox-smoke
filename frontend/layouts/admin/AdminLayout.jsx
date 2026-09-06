import Head from "next/head";
import { useEffect, useState } from "react";
import AppTopBar from "@/layouts/AppTopBar";
import AppSidebar from "@/layouts/AppSidebar";
import { serviceConfig } from "@/services/utils/service.config";

const SIDEBAR_MINIMIZED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 230;
const HEADER_HEIGHT = 50;
const GAP = 6;
const MOBILE_BREAKPOINT = 768;

export default function AdminLayout({ children, title }) {
    const [mode, setMode] = useState("fixed");
    const [isMobile, setIsMobile] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const loggedIn = serviceConfig.isLoggedIn();

    useEffect(() => {
        const saved = localStorage.getItem("sidebarMode") || "fixed";
        setMode(saved);
    }, []);

    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (!mobile) setMobileOpen(false);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const sidebarW = isMobile ? 0 : (mode === "fixed" ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_MINIMIZED_WIDTH);

    useEffect(() => {
        document.documentElement.style.setProperty("--sidebar-w", sidebarW + "px");
    }, [sidebarW]);

    if (!loggedIn) return <>{children}</>;

    const handleModeChange = (newMode) => {
        setMode(newMode);
        localStorage.setItem("sidebarMode", newMode);
    };

    const effectiveMode = isMobile ? (mobileOpen ? "maximized" : "hidden") : mode;

    return (
        <>
            <Head>
                <title>{title || "Katappult.ai"}</title>
                <link rel="icon" href={toThumbFullURL("/favicon.png")} type="image/png" sizes="32x32" />
            </Head>

            <AppTopBar onSidebarToggle={isMobile ? () => setMobileOpen((v) => !v) : undefined} />

            <AppSidebar
                mode={effectiveMode}
                onModeChange={isMobile ? () => setMobileOpen(false) : handleModeChange}
            />

            <main
                style={{
                    marginTop: HEADER_HEIGHT + GAP,
                    marginLeft: `var(--content-margin-left, ${sidebarW + GAP}px)`,
                    marginRight: GAP,
                    width: `calc(100vw - ${sidebarW + (isMobile ? 8 : 20)}px)`,
                    minHeight: `calc(100vh - ${HEADER_HEIGHT + 40}px)`,
                    height: `calc(100vh - ${HEADER_HEIGHT + 40}px)`,
                    padding: isMobile ? "0 12px 80px 12px" : "0 20px 80px 30px",
                    boxSizing: "border-box",
                    overflowY: "auto",
                    overflowX: "hidden",
                    background: "var(--content-bg, #ffffff)",
                    border: "var(--content-border, none)",
                    borderRadius: isMobile ? "0" : "14px",
                    transition: "margin-left 0.22s ease, width 0.22s ease",
                }}
            >
                {children}
            </main>
        </>
    );
}
