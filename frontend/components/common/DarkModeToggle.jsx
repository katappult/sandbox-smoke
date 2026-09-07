import { useEffect, useState } from "react";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { switchThemeMode } from "@/components/admin/ThemeSettings";
import { useTranslation } from "react-i18next";

export default function DarkModeToggle() {
    const { t } = useTranslation();
    const [mode, setMode] = useState("light");

    useEffect(() => {
        setMode(localStorage.getItem("appThemeMode") || "light");

        const handler = (e) => setMode(e.detail.mode);
        window.addEventListener("appThemeModeChange", handler);
        return () => window.removeEventListener("appThemeModeChange", handler);
    }, []);

    const toggle = () => {
        const next = mode === "dark" ? "light" : "dark";
        switchThemeMode(next);
        setMode(next);
    };

    return (
        <button
            onClick={toggle}
            title={mode === "dark" ? t("theme.switch_to_light") : t("theme.switch_to_dark")}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid var(--card-border, #EAECF0)",
                background: "var(--card-bg, #ffffff)",
                color: "var(--text-secondary, #667085)",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
            }}
        >
            {mode === "dark"
                ? <LightModeOutlined style={{ fontSize: 18 }} />
                : <DarkModeOutlined  style={{ fontSize: 18 }} />
            }
        </button>
    );
}
