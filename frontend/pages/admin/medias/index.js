import React from "react";
import {Divider, Typography} from "antd";
import MediaLibrary from "@/components/common/mediaLibrary/MediaLibrary";
import { useTranslation } from "react-i18next";
import AdminPage from "@/pages/admin";

export default function AdminThemePage() {
    const { t } = useTranslation();
    return <div className="tab-header">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("admin.medias_title")}
            </Typography.Title>
            <p className="description">
                {t("admin.medias_desc")}
            </p>
        </div>

        <Divider/>
        <MediaLibrary inline />
    </div>
}

AdminThemePage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
