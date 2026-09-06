import s from "@/styles/components/LifecyclePanel.module.css";
import React from "react";

export default function StatusChip({label, large = true}){

    const STATUS_STYLES = {
        "En attente": {bg: "#fffaeb", color: "#b54708", border: "#fec84b"},
        "En cours": {bg: "#eff8ff", color: "#1570ef", border: "#84caff"},
        "Terminé": {bg: "#ecfdf3", color: "#027a48", border: "#6ce9a6"},
        "Annulé": {bg: "#fef3f2", color: "#b42318", border: "#fda29b"},
        "Rejeté": {bg: "#fff4ed", color: "#c4320a", border: "#f9b8a0"},
        "Validé": {bg: "#ecfdf3", color: "#027a48", border: "#6ce9a6"},
        "Brouillon": {bg: "#f2f4f7", color: "#344054", border: "#d0d5dd"},
    };

    const DEFAULT_STYLE = {bg: "#f2f4f7", color: "#344054", border: "#d0d5dd"};

    const getStyle = (status) => STATUS_STYLES[status] || DEFAULT_STYLE;

    const {bg, color, border} = getStyle(label);
    return (
        <span
            className={large ? s.status_chip_large : s.status_chip}
            style={{background: bg, color, border: `1px solid ${border}`}}
        >
            {label}
        </span>
    );
}