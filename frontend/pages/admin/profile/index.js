import MyAccount from "@/components/account/MyAccount";
import {Divider, Typography} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import AdminPage from "@/pages/admin";

export default function MonProfilePage() {
    const { t } = useTranslation();
    return <div className="tab-header">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("profile.account_title")}
            </Typography.Title>
            <p className="description">
                {t("profile.account_desc")}
            </p>
        </div>

        <Divider/>
        <MyAccount />
    </div>
}

MonProfilePage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};
