import React from "react";
import {Divider, Typography} from "antd";
import {useTranslation} from "react-i18next";
import AdminPage from "@/pages/admin";
import CategorieAdminList from "@/components/admin/catalogue/CategorieAdminList";

export default function CategoriesAdminPage() {
    const {t} = useTranslation();
    return <div className="tab-header">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("catalogue.categories_title")}
            </Typography.Title>
            <p className="description">
                {t("catalogue.categories_desc")}
            </p>
        </div>

        <Divider/>
        <CategorieAdminList/>
    </div>
}

CategoriesAdminPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
