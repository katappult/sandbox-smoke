/**
 * Themes — configuration par client.
 *
 * Pour changer de client :
 *   1. Modifier les valeurs dans "default" (ou ajouter une entrée et pointer via NEXT_PUBLIC_THEME)
 *   2. Vider localStorage (appThemeVars) pour que les nouvelles valeurs s'appliquent
 *
 * Le mode clair/sombre est géré par l'utilisateur via /admin/theme (localStorage).
 * Il ne modifie que layoutBg, contentBg, contentBorder — pas la sidebar ni la topbar.
 *
 * Tokens disponibles par famille :
 *   - Couleurs     : color1, color2, color3
 *   - Sidebar      : sidebarBg, sidebarText, sidebarItem*
 *   - Topbar       : topbarBg, topbarText
 *   - Layout       : layoutBg, contentBg, contentBorder
 *   - Typo         : fontFamily, fontUrl, fontWeightHeading, letterSpacingHeading, textTransformHeading
 *   - Shape        : radiusXs, radiusSm, radiusMd, radiusLg, radiusFull, radiusButton, radiusCard, radiusInput, radiusBadge
 *   - Shadows      : shadowSm, shadowMd, shadowLg, shadowCard
 *   - Borders      : borderWidth, borderStyle
 *   - Buttons      : btnPaddingX, btnPaddingY, btnFontWeight
 *   - Client       : clientPrimary, clientSecondary, clientNavbarBg, clientNavbarText, clientNavbarBorder,
 *                    clientNavbarH, clientFooterBg, clientFooterText, clientHeroBg, clientAccentHover
 */

const THEMES = {

    // ── Défaut (moderne / SaaS) ───────────────────────────────────
    // Clean local storage after modifying this to apply new values (appThemeVars)
    default: {
        // Polices
        fontFamily:           "Nunito",
        fontUrl:              "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap",
        fontWeightHeading:    "700",
        letterSpacingHeading: "0em",
        textTransformHeading: "none",

        // Couleurs principales
        color1: "#007aff",
        color2: "#39BCC5",
        color3: "#EF6601",

        // Sidebar
        sidebarBg:               "#f4f3ff",
        sidebarText:             "#101828",
        sidebarItemText:         "#101828",
        sidebarItemHoverBg:      "#007aff",
        sidebarItemSelectedBg:   "#007aff",
        sidebarItemSelectedText: "#ffffff",
        sidebarDivider:          "rgba(255, 255, 255, 0.12)",

        // Topbar
        topbarBg:   "#f4f3ff",
        topbarText: "#101828",
        topbarBorderBottom: "0px solid rgba(0,0,0,0.06)",

        // Contenu (écrasé par le switch dark/light)
        layoutBg:      "#f4f3ff",
        contentBg:     "#ffffff",
        contentBorder: "0px solid #EAECF0",
        contentMarginLeft: "230",

        // ── Shape ────────────────────────────────────────────────
        radiusXs:     "4px",
        radiusSm:     "8px",
        radiusMd:     "12px",
        radiusLg:     "16px",
        radiusFull:   "9999px",
        radiusButton: "9999px",
        radiusCard:   "12px",
        radiusInput:  "8px",
        radiusBadge:  "9999px",

        // ── Shadows ──────────────────────────────────────────────
        shadowSm:   "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        shadowMd:   "0 4px 8px -2px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.06)",
        shadowLg:   "0 12px 24px -6px rgba(0,0,0,0.14), 0 4px 8px -4px rgba(0,0,0,0.08)",
        shadowCard: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",

        // ── Borders ──────────────────────────────────────────────
        borderWidth: "1px",
        borderStyle: "solid",

        // ── Buttons ──────────────────────────────────────────────
        btnPaddingX:   "24px",
        btnPaddingY:   "10px",
        btnFontWeight: "700",

        // ── Client layout tokens ──────────────────────────────────
        clientPrimary:      "#007aff",
        clientSecondary:    "#39BCC5",
        clientAccentHover:  "#0052cc",
        clientNavbarBg:     "#ffffff",
        clientNavbarText:   "#1a1a2e",
        clientNavbarBorder: "1px solid #e5e7eb",
        clientNavbarH:      "64px",
        clientFooterBg:     "#111827",
        clientFooterText:   "rgba(255,255,255,0.75)",
        clientHeroBg:       "linear-gradient(135deg, #007aff 0%, #39BCC5 100%)",
        clientLayoutBg:     "#ffffff",
    },

    // ── Vintage (imprimerie / années 1920-50) ─────────────────────
    vintage: {
        fontFamily:           "Inter",
        fontUrl:              "https://fonts.googleapis.com/css2?family=Inter,wght@0,400;0,700;0,900;1,400&family=Lato:wght@400;700&display=swap",
        fontWeightHeading:    "900",
        letterSpacingHeading: "0.04em",
        textTransformHeading: "uppercase",

        color1: "#8B4513",
        color2: "#C8973A",
        color3: "#2F4538",

        sidebarBg:               "#2F1B0E",
        sidebarText:             "#E8D5B0",
        sidebarItemText:         "rgba(232,213,176,0.80)",
        sidebarItemHoverBg:      "rgba(255,255,255,0.08)",
        sidebarItemSelectedBg:   "rgba(200,151,58,0.25)",
        sidebarItemSelectedText: "#C8973A",
        sidebarDivider:          "rgba(200,151,58,0.20)",

        topbarBg:   "#F5ECD7",
        topbarText: "#2F1B0E",

        layoutBg:      "#F5ECD7",
        contentBg:     "#FDFAF4",
        contentBorder: "0px solid #C8973A",

        radiusXs:     "2px",
        radiusSm:     "2px",
        radiusMd:     "2px",
        radiusLg:     "4px",
        radiusFull:   "2px",
        radiusButton: "2px",
        radiusCard:   "2px",
        radiusInput:  "2px",
        radiusBadge:  "2px",

        shadowSm:   "2px 2px 0 rgba(47,27,14,0.20)",
        shadowMd:   "4px 4px 0 rgba(47,27,14,0.22)",
        shadowLg:   "8px 8px 0 rgba(47,27,14,0.18)",
        shadowCard: "4px 4px 0 rgba(47,27,14,0.22)",

        borderWidth: "2px",
        borderStyle: "solid",

        btnPaddingX:   "28px",
        btnPaddingY:   "10px",
        btnFontWeight: "900",

        // ── Client layout tokens ──────────────────────────────────
        clientPrimary:      "#8B4513",
        clientSecondary:    "#C8973A",
        clientAccentHover:  "#6b340f",
        clientNavbarBg:     "#F5ECD7",
        clientNavbarText:   "#2F1B0E",
        clientNavbarBorder: "2px solid #C8973A",
        clientFooterBg:     "#2F1B0E",
        clientFooterText:   "rgba(232,213,176,0.80)",
        clientHeroBg:       "linear-gradient(135deg, #8B4513 0%, #C8973A 100%)",
    },

    // ── Industriel (atelier / béton / métal) ─────────────────────
    industrial: {
        fontFamily:           "Bebas Neue",
        fontUrl:              "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@400;700&display=swap",
        fontWeightHeading:    "700",
        letterSpacingHeading: "0.08em",
        textTransformHeading: "uppercase",

        color1: "#E63946",
        color2: "#A8DADC",
        color3: "#F4A261",

        sidebarBg:               "#1A1A1A",
        sidebarText:             "#D0D0D0",
        sidebarItemText:         "rgba(208,208,208,0.80)",
        sidebarItemHoverBg:      "rgba(230,57,70,0.15)",
        sidebarItemSelectedBg:   "rgba(230,57,70,0.25)",
        sidebarItemSelectedText: "#E63946",
        sidebarDivider:          "rgba(255,255,255,0.08)",

        topbarBg:   "#111111",
        topbarText: "#E0E0E0",

        layoutBg:      "#1F1F1F",
        contentBg:     "#2A2A2A",
        contentBorder: "2px solid #3A3A3A",

        radiusXs:     "0px",
        radiusSm:     "0px",
        radiusMd:     "0px",
        radiusLg:     "0px",
        radiusFull:   "0px",
        radiusButton: "0px",
        radiusCard:   "0px",
        radiusInput:  "0px",
        radiusBadge:  "0px",

        shadowSm:   "none",
        shadowMd:   "inset 0 0 0 1px rgba(255,255,255,0.08)",
        shadowLg:   "none",
        shadowCard: "none",

        borderWidth: "2px",
        borderStyle: "solid",

        btnPaddingX:   "28px",
        btnPaddingY:   "10px",
        btnFontWeight: "700",

        // ── Client layout tokens ──────────────────────────────────
        clientPrimary:      "#E63946",
        clientSecondary:    "#A8DADC",
        clientAccentHover:  "#b82e38",
        clientNavbarBg:     "#111111",
        clientNavbarText:   "#E0E0E0",
        clientNavbarBorder: "2px solid #3A3A3A",
        clientFooterBg:     "#0a0a0a",
        clientFooterText:   "rgba(208,208,208,0.75)",
        clientHeroBg:       "linear-gradient(135deg, #1A1A1A 0%, #E63946 100%)",
    },

    // ── Moderne / SaaS (épuré, indigo, flat) ─────────────────────
    modern: {
        fontFamily:           "Inter",
        fontUrl:              "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
        fontWeightHeading:    "700",
        letterSpacingHeading: "-0.02em",
        textTransformHeading: "none",

        color1: "#6366F1",
        color2: "#10B981",
        color3: "#F59E0B",

        sidebarBg:               "#F8F9FA",
        sidebarText:             "#1F2937",
        sidebarItemText:         "rgba(31,41,55,0.75)",
        sidebarItemHoverBg:      "rgba(99,102,241,0.08)",
        sidebarItemSelectedBg:   "rgba(99,102,241,0.12)",
        sidebarItemSelectedText: "#6366F1",
        sidebarDivider:          "rgba(0,0,0,0.06)",

        topbarBg:   "#FFFFFF",
        topbarText: "#111827",

        layoutBg:      "#F3F4F6",
        contentBg:     "#FFFFFF",
        contentBorder: "1px solid #E5E7EB",

        radiusXs:     "4px",
        radiusSm:     "6px",
        radiusMd:     "8px",
        radiusLg:     "12px",
        radiusFull:   "9999px",
        radiusButton: "8px",
        radiusCard:   "8px",
        radiusInput:  "6px",
        radiusBadge:  "9999px",

        shadowSm:   "0 1px 2px rgba(0,0,0,0.05)",
        shadowMd:   "0 2px 6px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        shadowLg:   "0 8px 20px rgba(0,0,0,0.08)",
        shadowCard: "0 1px 3px rgba(0,0,0,0.08)",

        borderWidth: "1px",
        borderStyle: "solid",

        btnPaddingX:   "20px",
        btnPaddingY:   "9px",
        btnFontWeight: "600",

        // ── Client layout tokens ──────────────────────────────────
        clientPrimary:      "#6366F1",
        clientSecondary:    "#10B981",
        clientAccentHover:  "#4f52d4",
        clientNavbarBg:     "#FFFFFF",
        clientNavbarText:   "#111827",
        clientNavbarBorder: "1px solid #E5E7EB",
        clientFooterBg:     "#0f0f1a",
        clientFooterText:   "rgba(255,255,255,0.70)",
        clientHeroBg:       "linear-gradient(135deg, #6366F1 0%, #10B981 100%)",
    },

    // ── Old School (Windows 95 / rétro-computing) ────────────────
    oldschool: {
        fontFamily:           "Courier New",
        fontUrl:              "",
        fontWeightHeading:    "700",
        letterSpacingHeading: "0em",
        textTransformHeading: "none",

        color1: "#000080",
        color2: "#008080",
        color3: "#800000",

        sidebarBg:               "#C0C0C0",
        sidebarText:             "#000000",
        sidebarItemText:         "rgba(0,0,0,0.85)",
        sidebarItemHoverBg:      "#000080",
        sidebarItemSelectedBg:   "#000080",
        sidebarItemSelectedText: "#FFFFFF",
        sidebarDivider:          "rgba(0,0,0,0.20)",

        topbarBg:   "#000080",
        topbarText: "#FFFFFF",

        layoutBg:      "#C0C0C0",
        contentBg:     "#FFFFFF",
        contentBorder: "2px solid #808080",

        radiusXs:     "0px",
        radiusSm:     "0px",
        radiusMd:     "0px",
        radiusLg:     "0px",
        radiusFull:   "0px",
        radiusButton: "0px",
        radiusCard:   "0px",
        radiusInput:  "0px",
        radiusBadge:  "0px",

        // Raised border Win95
        shadowSm:   "inset -1px -1px 0 #808080, inset 1px 1px 0 #FFFFFF",
        shadowMd:   "inset -2px -2px 0 #000000, inset 2px 2px 0 #FFFFFF, inset -1px -1px 0 #808080, inset 1px 1px 0 #DFDFDF",
        shadowLg:   "inset -2px -2px 0 #000000, inset 2px 2px 0 #FFFFFF, inset -1px -1px 0 #808080, inset 1px 1px 0 #DFDFDF",
        shadowCard: "inset -2px -2px 0 #000000, inset 2px 2px 0 #FFFFFF, inset -1px -1px 0 #808080, inset 1px 1px 0 #DFDFDF",

        borderWidth: "2px",
        borderStyle: "solid",

        btnPaddingX:   "20px",
        btnPaddingY:   "6px",
        btnFontWeight: "700",

        // ── Client layout tokens ──────────────────────────────────
        clientPrimary:      "#000080",
        clientSecondary:    "#008080",
        clientAccentHover:  "#00005a",
        clientNavbarBg:     "#000080",
        clientNavbarText:   "#FFFFFF",
        clientNavbarBorder: "2px solid #808080",
        clientFooterBg:     "#000000",
        clientFooterText:   "rgba(255,255,255,0.80)",
        clientHeroBg:       "linear-gradient(135deg, #000080 0%, #008080 100%)",
    },

    // ── Exemples commentés ────────────────────────────────────────
    // Sidebar blanche (sidebar sombre → variantes sombres) :
    // white_sidebar: {
    //     sidebarBg:               "#FFFFFF",
    //     sidebarItemText:         "rgba(52,64,84,0.80)",
    //     sidebarItemHoverBg:      "rgba(0,0,0,0.05)",
    //     sidebarItemSelectedBg:   "rgba(0,0,0,0.07)",
    //     sidebarItemSelectedText: "#101828",
    //     sidebarDivider:          "rgba(0,0,0,0.08)",
    // },
};

// ── Helpers ───────────────────────────────────────────────────────

function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `${r} ${g} ${b}`;
}

function buildThemeCSS(key) {
    const t = { ...THEMES.default, ...(THEMES[key] || {}) };

    const palette = (hex, n) => `
        --color-${n}: ${hex};
        --opacity-100-color-${n}: rgb(${hexToRgb(hex)} / 1);
        --opacity-70-color-${n}:  rgb(${hexToRgb(hex)} / 0.7);
        --opacity-50-color-${n}:  rgb(${hexToRgb(hex)} / 0.5);
        --opacity-30-color-${n}:  rgb(${hexToRgb(hex)} / 0.3);
        --opacity-10-color-${n}:  rgb(${hexToRgb(hex)} / 0.1);
    `;

    const fontImport = t.fontUrl ? `@import url('${t.fontUrl}');` : "";

    return `
        ${fontImport}
        :root {
            /* ── Typographie ── */
            --font-family:            '${t.fontFamily}', system-ui, sans-serif;
            --font-weight-heading:    ${t.fontWeightHeading    ?? "700"};
            --letter-spacing-heading: ${t.letterSpacingHeading ?? "0em"};
            --text-transform-heading: ${t.textTransformHeading ?? "none"};

            /* ── Palette ── */
            ${palette(t.color1, 1)}
            ${palette(t.color2, 2)}
            ${palette(t.color3, 3)}
            --accent-color:                  var(--color-3);
            --admin-menu-background-color:   var(--opacity-30-color-1);

            /* ── Sidebar ── */
            --sidebar-bg:                 ${t.sidebarBg};
            --sidebar-text:               ${t.sidebarText};
            --sidebar-item-text:          ${t.sidebarItemText};
            --sidebar-item-hover-bg:      ${t.sidebarItemHoverBg};
            --sidebar-item-selected-bg:   ${t.sidebarItemSelectedBg};
            --sidebar-item-selected-text: ${t.sidebarItemSelectedText};
            --sidebar-divider:            ${t.sidebarDivider};

            /* ── Topbar ── */
            --topbar-bg:   ${t.topbarBg};
            --topbar-text: ${t.topbarText};

            /* ── Contenu (écrasé par le mode dark/light) ── */
            --layout-bg:      ${t.layoutBg};
            --content-bg:     ${t.contentBg};
            --content-border: ${t.contentBorder};

            /* ── Shape (border-radius) ── */
            --radius-xs:     ${t.radiusXs     ?? "4px"};
            --radius-sm:     ${t.radiusSm     ?? "8px"};
            --radius-md:     ${t.radiusMd     ?? "12px"};
            --radius-lg:     ${t.radiusLg     ?? "16px"};
            --radius-full:   ${t.radiusFull   ?? "9999px"};
            --radius-button: ${t.radiusButton ?? "9999px"};
            --radius-card:   ${t.radiusCard   ?? "12px"};
            --radius-input:  ${t.radiusInput  ?? "8px"};
            --radius-badge:  ${t.radiusBadge  ?? "9999px"};

            /* ── Aliases legacy (backward compat) ── */
            --border-radius-ms:     ${t.radiusXs     ?? "4px"};
            --border-radius-xs:     ${t.radiusSm     ?? "8px"};
            --border-radius-s:      ${t.radiusMd     ?? "12px"};
            --border-radius:        ${t.radiusMd     ?? "12px"};
            --border-radius-button: ${t.radiusButton ?? "9999px"};

            /* ── Shadows ── */
            --shadow-sm:   ${t.shadowSm   ?? "0 1px 3px rgba(0,0,0,0.08)"};
            --shadow-md:   ${t.shadowMd   ?? "0 4px 8px -2px rgba(0,0,0,0.10)"};
            --shadow-lg:   ${t.shadowLg   ?? "0 12px 24px -6px rgba(0,0,0,0.14)"};
            --shadow-card: ${t.shadowCard ?? "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)"};

            /* ── Borders ── */
            --border-width: ${t.borderWidth ?? "1px"};
            --border-style: ${t.borderStyle ?? "solid"};

            /* ── Boutons ── */
            --btn-padding-x:   ${t.btnPaddingX   ?? "24px"};
            --btn-padding-y:   ${t.btnPaddingY   ?? "10px"};
            --btn-font-weight: ${t.btnFontWeight ?? "700"};

            /* ── Client layout ── */
            --client-primary:       ${t.clientPrimary      ?? t.color1};
            --client-secondary:     ${t.clientSecondary    ?? t.color2};
            --client-accent-hover:  ${t.clientAccentHover  ?? t.color1};
            --client-navbar-bg:     ${t.clientNavbarBg     ?? "#ffffff"};
            --client-navbar-text:   ${t.clientNavbarText   ?? "#1a1a2e"};
            --client-navbar-border: ${t.clientNavbarBorder ?? "1px solid #e5e7eb"};
            --client-navbar-h:      ${t.clientNavbarH      ?? "64px"};
            --client-footer-bg:     ${t.clientFooterBg     ?? "#111827"};
            --client-footer-text:   ${t.clientFooterText   ?? "rgba(255,255,255,0.75)"};
            --client-hero-bg:       ${t.clientHeroBg       ?? "none"};
            --client-layout-bg:     ${t.clientLayoutBg     ?? "#ffffff"};
        }
    `;
}

module.exports = { THEMES, buildThemeCSS };
