import ds from "@/styles/components/Drawer2.module.css";
import React from "react";

export default function DrawerFieldRow({ label, value }) {
    return (
        <div className={ds.field_row}>
            <span className={ds.field_label}>{label}</span>
            {value != null && value !== "" ? (
                <span className={ds.field_value}>{value}</span>
            ) : (
                <span className={ds.field_value_empty}>—</span>
            )}
        </div>
    );
}
