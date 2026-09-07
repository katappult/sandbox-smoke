import MyAccount from "@/components/account/MyAccount";
import HomePage from "@/pages";
import {Divider, Typography} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export default function MonProfilePage() {
    const { t } = useTranslation();
    return <div className="tab-header client-w80-section-root">
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
    return HomePage.getLayout(page);
};
