import ProfileStyle from "@/styles/pages/Profile.module.css";
import InfoStyle from "@/styles/pages/Info.module.css";
import React from "react";

export default function SectionCard({ id, title, desc, action, children }) {
    return (
        <div className={ProfileStyle.section} id={id}>
            <div className={`${ProfileStyle.borderBottom} ${action ? InfoStyle.section_header_with_action : ""} flex items-center justify-between p-8`}>
                <div className={InfoStyle.section_header_text}>
                    <span className={ProfileStyle.section_title}>{title}</span>
                    {desc && <span className={ProfileStyle.section_desc}>{desc}</span>}
                </div>
                {action}
            </div>
            <div className={ProfileStyle.section_body}>{children}</div>
        </div>
    );
}