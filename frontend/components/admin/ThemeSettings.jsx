import React, { useEffect, useState } from "react";
import { CheckOutlined, TranslateOutlined, PaletteOutlined, FormatSizeOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import s from "@/styles/pages/Profile.module.css";

// Contenu uniquement — la sidebar est gérée séparément via __THEME_SIDEBAR__ (light) ou DARK_SIDEBAR_VARS (dark)
const MODES = {
    light: {
        labelKey:      "theme.mode_light",
        layoutBg:      "#f4f6f9",
        contentBg:     "#ffffff",
        contentBorder: "2px solid #EAECF0",
    },
    dark: {
        labelKey:      "theme.mode_dark",
        layoutBg:      "#111111", /*#343540*/
        contentBg:     "#343540",
        contentBorder: "1px solid #2d3f55",
    },
};

const DARK_SHELL_VARS = {
    "--topbar-bg":                  "transparent",
    "--topbar-text":                "#f9fafb",
    "--sidebar-bg":                 "#080e1a",
    "--sidebar-text":               "#d1d5db",
    "--sidebar-item-text":          "rgba(255, 255, 255, 0.75)",
    "--sidebar-item-hover-bg":      "rgba(255, 255, 255, 0.08)",
    "--sidebar-item-selected-bg":   "rgba(255, 255, 255, 0.15)",
    "--sidebar-item-selected-text": "#ffffff",
    "--sidebar-divider":            "rgba(255, 255, 255, 0.08)",
    /* semantic tokens */
    "--card-bg":          "#1e2a3a",
    "--input-bg":         "#1a2435",
    "--card-border":      "#2d3f55",
    "--input-border":     "#374151",
    "--surface-hover":    "#253348",
    "--surface-subtle":   "#1a2435",
    "--text-primary":     "#f9fafb",
    "--text-secondary":   "#9ca3af",
    "--text-tertiary":    "#d1d5db",
    "--text-muted":       "#6b7280",
    /* compatibilité avec les anciens composants qui utilisent encore --text-light-pri */
    "--text-light-pri":   "#f9fafb",
    "--text-light-sec":   "#9ca3af",
    "--scrollbar-thumb":  "#1a2435",
    /* client layout dark overrides */
    "--client-navbar-bg":     "#0d1117",
    "--client-navbar-text":   "#f0f6fc",
    "--client-navbar-border": "1px solid #21262d",
    "--client-footer-bg":     "#040d21",
    "--client-footer-text":   "rgba(255,255,255,0.60)",
    "--client-layout-bg":     "#0d1117",
};

const LIGHT_SEMANTIC_VARS = {
    "--card-bg":          "#ffffff",
    "--input-bg":         "#ffffff",
    "--card-border":      "#EAECF0",
    "--input-border":     "#d0d5dd",
    "--surface-hover":    "#f2f4f7",
    "--surface-subtle":   "#f9fafc",
    "--text-primary":     "#101828",
    "--text-secondary":   "#667085",
    "--text-tertiary":    "#344054",
    "--text-muted":       "#98a2b3",
    "--text-light-pri":   "#070707",
    "--text-light-sec":   "#070707B2",
    "--scrollbar-thumb":  "#EAECF0",
};

export const LANGUAGES = [
    { key: "fr", label: "Français",     emoji: "🇫🇷" },
    { key: "en", label: "English",      emoji: "🇬🇧" },
    { key: "us", label: "English (US)", emoji: "🇺🇸" },
    { key: "es", label: "Español",      emoji: "🇪🇸" },
    { key: "de", label: "Deutsch",      emoji: "🇩🇪" },
    { key: "pt", label: "Português",    emoji: "🇵🇹" },
    { key: "mg", label: "Malagasy",     emoji: "🇲🇬" },
    { key: "ru", label: "Русский",      emoji: "🇷🇺" },
    { key: "it", label: "Italiano",     emoji: "🇮🇹" },
];

const FONT_SIZES = [
    { key: "small",  labelKey: "theme.font_small",  size: "12px", preview: 14 },
    { key: "normal", labelKey: "theme.font_normal",  size: "14px", preview: 18 },
    { key: "large",  labelKey: "theme.font_large",  size: "16px", preview: 22 },
    { key: "xlarge", labelKey: "theme.font_xlarge", size: "18px", preview: 27 },
];

export function applyFontSize(key) {
    const conf = FONT_SIZES.find(f => f.key === key) || FONT_SIZES[1];
    const base = parseFloat(conf.size);
    const r = base / 14;
    const px = (n) => Math.round(n * r) + "px";
    document.documentElement.style.setProperty("--app-font-size", conf.size);
    document.documentElement.style.setProperty("--fs-xs",   px(11));
    document.documentElement.style.setProperty("--fs-sm",   px(13));
    document.documentElement.style.setProperty("--fs-base", px(14));
    document.documentElement.style.setProperty("--fs-md",   px(16));
    localStorage.setItem("appFontSize", key);
}

const NAV_ITEMS = [
    { key: "langue", labelKey: "theme.nav_lang",   icon: <TranslateOutlined style={{ fontSize: 16 }} /> },
    { key: "theme",  labelKey: "theme.nav_theme",  icon: <PaletteOutlined   style={{ fontSize: 16 }} /> },
    { key: "police", labelKey: "theme.nav_font",   icon: <FormatSizeOutlined style={{ fontSize: 16 }} /> },
];

// ── Helpers ───────────────────────────────────────────────────

export function applyThemeVars(vars) {
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

export function switchThemeMode(m) {
    const sidebarVars = m === "dark" ? DARK_SHELL_VARS : (window.__THEME_SIDEBAR__ || {});
    const vars = { ...buildShellVars(m), ...sidebarVars };
    applyThemeVars(vars);
    localStorage.setItem("appThemeMode", m);
    const saved = JSON.parse(localStorage.getItem("appThemeVars") || "{}");
    localStorage.setItem("appThemeVars", JSON.stringify({ ...saved, ...vars }));
    window.dispatchEvent(new CustomEvent("appThemeModeChange", { detail: { mode: m } }));
}

function buildShellVars(mode) {
    const c = MODES[mode] || MODES.light;
    const base = {
        "--layout-bg":      c.layoutBg,
        "--content-bg":     c.contentBg,
        "--content-border": c.contentBorder,
    };
    return mode === "dark" ? base : { ...base, ...LIGHT_SEMANTIC_VARS };
}

// ── Language section ──────────────────────────────────────────

function LanguageSection() {
    const { t, i18n } = useTranslation();
    const [current, setCurrent] = useState(() => Cookies.get("lang") || "fr");

    const selectLang = (lang) => {
        setCurrent(lang);
        i18n.changeLanguage(lang);
        Cookies.set("lang", lang);
    };

    return (
        <div className={s.section}>
            <div className={s.section_header}>
                <span className={s.section_title}>{t("theme.lang_title")}</span>
                <span className={s.section_desc}>{t("theme.lang_desc")}</span>
            </div>
            <div className={s.section_body}>
                <div className={s.lang_options}>
                    {LANGUAGES.map(lang => {
                        const active = current === lang.key;
                        return (
                            <button
                                key={lang.key}
                                onClick={() => selectLang(lang.key)}
                                className={`${s.lang_card} ${active ? s.lang_card_active : ""}`}
                            >
                                <span className={s.lang_flag}>{lang.emoji}</span>
                                <span className={s.lang_label}>{lang.label}</span>
                                {active && <span className={s.lang_check}><CheckOutlined style={{ fontSize: 16 }} /></span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Theme section ─────────────────────────────────────────────

function ThemeSection() {
    const { t } = useTranslation();
    const [mode, setMode] = useState("light");

    useEffect(() => {
        setMode(localStorage.getItem("appThemeMode") || "light");
    }, []);

    const handleMode = (m) => {
        setMode(m);
        const sidebarVars = m === "dark"
            ? DARK_SHELL_VARS
            : (window.__THEME_SIDEBAR__ || {});
        const vars = { ...buildShellVars(m), ...sidebarVars };
        applyThemeVars(vars);
        localStorage.setItem("appThemeMode", m);
        const saved = JSON.parse(localStorage.getItem("appThemeVars") || "{}");
        localStorage.setItem("appThemeVars", JSON.stringify({ ...saved, ...vars }));
        window.dispatchEvent(new CustomEvent("appThemeModeChange", { detail: { mode: m } }));
    };

    return (
        <div className={s.section}>
            <div className={s.section_header}>
                <span className={s.section_title}>{t("theme.theme_title")}</span>
                <span className={s.section_desc}>{t("theme.theme_desc")}</span>
            </div>
            <div className={s.section_body}>
                <div className={s.theme_cards}>
                    {Object.entries(MODES).map(([key, conf]) => {
                        const active = mode === key;
                        return (
                            <button
                                key={key}
                                onClick={() => handleMode(key)}
                                className={`${s.theme_card} ${active ? s.theme_card_active : ""}`}
                            >
                                <div className={s.theme_preview} style={{ background: conf.layoutBg }}>
                                    <div className={s.theme_preview_sidebar} />
                                    <div className={s.theme_preview_topbar} />
                                    <div className={s.theme_preview_content} style={{ background: conf.contentBg }} />
                                </div>
                                <span className={s.theme_label}>{t(conf.labelKey)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Font size section ─────────────────────────────────────────

function FontSizeSection() {
    const { t } = useTranslation();
    const [current, setCurrent] = useState("normal");

    useEffect(() => {
        setCurrent(localStorage.getItem("appFontSize") || "normal");
    }, []);

    const handleSelect = (key) => {
        setCurrent(key);
        applyFontSize(key);
    };

    return (
        <div className={s.section}>
            <div className={s.section_header}>
                <span className={s.section_title}>{t("theme.font_title")}</span>
                <span className={s.section_desc}>{t("theme.font_desc")}</span>
            </div>
            <div className={s.section_body}>
                <div className={s.font_cards}>
                    {FONT_SIZES.map(f => {
                        const active = current === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => handleSelect(f.key)}
                                className={`${s.font_card} ${active ? s.font_card_active : ""}`}
                            >
                                <span className={s.font_preview} style={{ fontSize: f.preview }}>{`Aa`}</span>
                                <span className={s.font_label}>{t(f.labelKey)}</span>
                                <span className={s.font_size_hint}>{f.size}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────

const SECTION_MAP = {
    langue: <LanguageSection />,
    theme:  <ThemeSection />,
    police: <FontSizeSection />,
};

export default function ThemeSettings() {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState("langue");

    return (
        <div className={s.root}>
            <nav className={s.sidenav}>
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.key}
                        className={`${s.sidenav_item} ${activeSection === item.key ? s.sidenav_item_active : ""}`}
                        onClick={() => setActiveSection(item.key)}
                    >
                        <span className={s.sidenav_icon}>{item.icon}</span>
                        {t(item.labelKey)}
                    </button>
                ))}
            </nav>

            <div className={s.page}>
                {SECTION_MAP[activeSection]}
            </div>
        </div>
    );
}
