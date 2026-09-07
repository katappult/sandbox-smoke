import React, { useState } from "react";
import Groups from "@/components/admin/Groups";
import {Divider, Typography} from "antd";
import ProfileStyle from "@/styles/pages/Profile.module.css";
import { useTranslation } from "react-i18next";
import AdminPage from "@/pages/admin";

export default function GroupsPage() {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    return <div className="tab-header h-full">
        <div className="section-header w-100 flex_space_between">
            <div>
                <Typography.Title level={4}>
                    {t("admin.groups_title")}
                </Typography.Title>
                <p className="description">
                    {t("admin.groups_desc")}
                </p>
            </div>
            <button className={`${ProfileStyle.btn_primary} shrink-0`} onClick={() => setCreateOpen(true)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                {t("admin.groups_new_btn")}
            </button>
        </div>

        <Divider/>
        <div className="flex-1 min-h-0 overflow-hidden">
            <Groups externalCreateOpen={createOpen} onExternalCreateClose={() => setCreateOpen(false)} />
        </div>
    </div>
}

GroupsPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
