import React from "react";
import {Divider, Typography} from "antd";
import {useTranslation} from "react-i18next";
import AdminPage from "@/pages/admin";
import ProduitAdminList from "@/components/admin/catalogue/ProduitAdminList";

export default function ProduitsAdminPage() {
    const {t} = useTranslation();
    return <div className="tab-header">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("catalogue.produits_title")}
            </Typography.Title>
            <p className="description">
                {t("catalogue.produits_desc")}
            </p>
        </div>

        <Divider/>
        <ProduitAdminList/>
    </div>
}

ProduitsAdminPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
