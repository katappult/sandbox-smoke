import p from "@/styles/pages/Profile.module.css";
import React, {useState} from "react";
import {Switch} from "antd";

export default function InfoFieldBoolView({label, checked, onPatch}) {
    const [saving, setSaving] = useState(false);

    const handleToggle = async () => {
        if (!onPatch || saving) return;

        try {
            setSaving(true);
            await onPatch(!checked);
        } catch {
            // error handled by caller
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={p.field}>
            <span className={p.field_label}>{label}</span>
            <div>
                <Switch
                    checked={checked}
                    loading={saving}
                    disabled={!onPatch}
                    onChange={onPatch ? handleToggle : undefined}
                    size="small"
                />
            </div>
        </div>
    );
}
