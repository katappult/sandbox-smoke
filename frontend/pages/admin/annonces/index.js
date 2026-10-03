import React from "react";
import {Divider, Typography} from "antd";
import {useTranslation} from "react-i18next";
import AdminPage from "@/pages/admin";
import AnnonceModeration from "@/components/admin/AnnonceModeration";

export default function AnnoncesModerationPage() {
    const {t} = useTranslation();

    return (
        <div className="tab-header">
            <div className="section-header">
                <Typography.Title level={4}>
                    {t("admin.annonces_title")}
                </Typography.Title>
                <p className="description">
                    {t("admin.annonces_desc")}
                </p>
            </div>

            <Divider />
            <AnnonceModeration />
        </div>
    );
}

AnnoncesModerationPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
