import React from "react";
import SystemPreferencesSettings from "@/components/admin/SystemPreferencesSettings";
import {Divider, Typography} from "antd";
import { useTranslation } from "react-i18next";
import AdminPage from "@/pages/admin";

export default function AdminPreferencesPage() {
    const { t } = useTranslation();
    return (
        <div className="tab-header">
            <div className="section-header">
                <Typography.Title level={4}>
                    {t("admin.preferences_title")}
                </Typography.Title>
                <p className="description">
                    {t("admin.preferences_desc")}
                </p>
            </div>
            <Divider/>
            <SystemPreferencesSettings />
        </div>
    );
}

AdminPreferencesPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
