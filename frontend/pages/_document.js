import { Html, Head, Main, NextScript } from "next/document";
import { buildThemeCSS, THEMES } from "@/styles/themes/index";

export default function Document() {
    const themeKey = process.env.NEXT_PUBLIC_THEME || "default";
    const themeCSS = buildThemeCSS(themeKey);
    const t = { ...THEMES.default, ...(THEMES[themeKey] || {}) };

    // Vars shell du thème client — injectées pour que le mode clair puisse les restaurer
    const clientSidebarVars = JSON.stringify({
        "--topbar-bg":                  t.topbarBg,
        "--topbar-text":                t.topbarText,
        "--topbar-border-bottom":       t.topbarBorderBottom,
        "--sidebar-bg":                 t.sidebarBg,
        "--sidebar-text":               t.sidebarText,
        "--sidebar-item-text":          t.sidebarItemText,
        "--sidebar-item-hover-bg":      t.sidebarItemHoverBg,
        "--sidebar-item-selected-bg":   t.sidebarItemSelectedBg,
        "--sidebar-item-selected-text": t.sidebarItemSelectedText,
        "--sidebar-divider":            t.sidebarDivider,
        // Client layout — restaurées lors du retour en mode clair
        "--client-navbar-bg":     t.clientNavbarBg     ?? "#ffffff",
        "--client-navbar-text":   t.clientNavbarText   ?? "#1a1a2e",
        "--client-navbar-border": t.clientNavbarBorder ?? "1px solid #e5e7eb",
        "--client-footer-bg":     t.clientFooterBg     ?? "#111827",
        "--client-footer-text":   t.clientFooterText   ?? "rgba(255,255,255,0.75)",
        "--client-layout-bg":     t.clientLayoutBg     ?? "#ffffff",
    });

    return (
        <Html lang="fr">
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
                <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
                <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; vertical-align: middle; }`}</style>
            </Head>
            <body>
            <script dangerouslySetInnerHTML={{ __html: `
window.__THEME_SIDEBAR__ = ${clientSidebarVars};
try {
    var _m = localStorage.getItem('sidebarMode') || 'fixed';
    var _w = _m === 'fixed' ? 230 : 60;
    document.documentElement.style.setProperty('--sidebar-w', _w + 'px');
    var _tv = JSON.parse(localStorage.getItem('appThemeVars') || 'null');
    if (_tv) Object.keys(_tv).forEach(function(k) { document.documentElement.style.setProperty(k, _tv[k]); });
} catch(e) {}
                `.trim() }} />
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}
