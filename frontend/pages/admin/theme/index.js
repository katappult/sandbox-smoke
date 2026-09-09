import React from "react";
import ThemeSettings from "@/components/admin/ThemeSettings";
import {Divider, Typography} from "antd";
import { useTranslation } from "react-i18next";
import AdminPage from "@/pages/admin";

export default function AdminThemePage() {
    const { t } = useTranslation();
    return (
        <div className="tab-header">
            <div className="section-header">
                <Typography.Title level={4}>
                    {t("admin.theme_title")}
                </Typography.Title>
                <p className="description">
                    {t("admin.theme_desc")}
                </p>
            </div>
            <Divider/>
            <ThemeSettings />
        </div>
    );
}

AdminThemePage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
