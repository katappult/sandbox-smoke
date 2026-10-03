import React from "react";
import {Switch} from "antd";
import Badge from "@/components/common/Badge";
import s from "@/styles/components/CatalogueAdmin.module.css";

/**
 * Cellule « badge + interrupteur » pour un booléen du catalogue (`featured` / `active`).
 * Présentation pure : la mise à jour est portée par le composant parent, via
 * `updateEntity` du service généré.
 */
export default function ToggleCell({value = false, loading = false, labelOn, labelOff, onChange}) {
    return (
        <div className={s.toggle_cell}>
            <Badge text={value ? labelOn : labelOff} active={value} grey={!value}/>
            <Switch
                size="small"
                checked={Boolean(value)}
                loading={loading}
                onChange={onChange}
            />
        </div>
    );
}
