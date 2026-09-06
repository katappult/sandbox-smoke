import ProfileStyle from "@/styles/pages/Profile.module.css";
import InfoStyle from "@/styles/pages/Info.module.css";
import React, {useState} from "react";
import {convertDateFromServerToStringDate} from "@/utils";
import {CheckOutlined, CloseOutlined, EditOutlined} from "@mui/icons-material";
import {Input, InputNumber} from "antd";

export default function InfoFieldItemView({label, value, date = false, type = "text", onPatch}) {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [saving, setSaving] = useState(false);

    const startEdit = () => {
        setEditValue(value ?? "");
        setEditing(true);
    };

    const handleSave = async () => {
        if (!onPatch) return;

        try {
            setSaving(true);
            await onPatch(editValue);
            setEditing(false);
        } catch {
            // stay in edit mode on error
        } finally {
            setSaving(false);
        }

    };

    const isEmpty = value == null || value === "";
    const displayValue = date ? convertDateFromServerToStringDate(value) : value;

    if (editing) {
        return (
            <div className={ProfileStyle.field}>
                <span className={ProfileStyle.field_label}>{label}</span>
                <div className={InfoStyle.inline_field_row}>
                    {type === "number" ? (
                        <InputNumber
                            className={"form_input"}
                            value={editValue}
                            onChange={(val) => setEditValue(val)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") setEditing(false);
                            }}
                            autoFocus
                            size="small"
                            style={{flex: 1}}
                        />
                    ) : (
                        <Input
                            className={"form_input"}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") setEditing(false);
                            }}
                            autoFocus
                            size="small"
                        />
                    )}
                    <div className={InfoStyle.inline_edit_actions}>
                        <button className={InfoStyle.inline_save_btn} disabled={saving} onClick={handleSave}>
                            <CheckOutlined style={{fontSize: 11}}/>
                        </button>
                        <button className={InfoStyle.inline_cancel_btn} onClick={() => setEditing(false)}>
                            <CloseOutlined style={{fontSize: 11}}/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={ProfileStyle.field}>
            <span className={ProfileStyle.field_label}>{label}</span>
            <div className={InfoStyle.inline_field_row}>
                {!isEmpty ? (
                    <span className={InfoStyle.field_value}>{displayValue}</span>
                ) : (
                    <span className={InfoStyle.field_value_empty}>—</span>
                )}
                {onPatch && (
                    <button className={InfoStyle.inline_edit_pencil} onClick={startEdit} title="Modifier">
                        <EditOutlined style={{fontSize: 11}}/>
                    </button>
                )}
            </div>
        </div>
    );
}
