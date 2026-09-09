import s from "@/styles/pages/Form.module.css";
import React from "react";

export default function FormSection({ icon, title, children }) {
    return (
        <div className={s.section}>
            <div className={s.section_header}>
                <span className={s.section_icon}>{icon}</span>
                <span className={s.section_title}>{title}</span>
            </div>
            <div className={s.section_body}>{children}</div>
        </div>
    );
}