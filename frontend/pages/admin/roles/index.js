import React from "react";
import Roles from "@/components/admin/Roles";
import {Divider, Typography} from "antd";
import { useTranslation } from "react-i18next";
import AdminPage from "@/pages/admin";

export default function RolesPage() {
    const { t } = useTranslation();
    return <div className="tab-header h-full">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("admin.roles_title")}
            </Typography.Title>
            <p className="description">
                {t("admin.roles_desc")}
            </p>
        </div>

        <Divider/>
        <div className="flex-1 min-h-0 overflow-hidden">
            <Roles />
        </div>
    </div>
}


RolesPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
