import React from "react";
import ThemeSettings from "@/components/admin/ThemeSettings";
import ClientLayout from "@/layouts/client/ClientLayout";
import { useTranslation } from "react-i18next";
import {Divider, Typography} from "antd";

export default function PreferencesPage() {
    const { t } = useTranslation();

    return <div className="tab-header client-w80-section-root">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("header_menu.appearance_language")}
            </Typography.Title>
            <p className="description">
                {t("admin.theme_desc")}
            </p>
        </div>

        <Divider/>
        <ThemeSettings />
    </div>
}

PreferencesPage.getLayout = function getLayout(page, title) {
    return <ClientLayout title={title}>{page}</ClientLayout>;
};
