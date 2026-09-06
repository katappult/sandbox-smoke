import React, {useState} from "react";
import ds from "@/styles/components/Drawer2.module.css";
import {DownOutlined} from "@ant-design/icons";

export default function DrawerCollapsibleSection({ icon, label, children }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={ds.footer_section}>
            <button className={ds.footer_section_toggle} onClick={() => setOpen((o) => !o)}>
                <span className={ds.footer_section_icon}>{icon}{label}</span>
                <DownOutlined
                    className={`${ds.footer_section_chevron} ${open ? ds.footer_section_chevron_open : ""}`}
                />
            </button>
            {open && <div className={ds.footer_section_body}>{children}</div>}
        </div>
    );
}