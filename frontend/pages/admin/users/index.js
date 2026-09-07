import React from "react";
import UsersList from "@/components/account/UsersList";
import {Divider, Typography} from "antd";
import {useTranslation} from "react-i18next";
import AdminPage from "@/pages/admin";

export default function UsersListPage() {
    const {t} = useTranslation();
    return <div className="tab-header">
        <div className="section-header">
            <Typography.Title level={4}>
                {t("admin.users_title")}
            </Typography.Title>
            <p className="description">
                {t("admin.users_desc")}
            </p>
        </div>

        <Divider/>
        <UsersList/>
    </div>
}

UsersListPage.getLayout = function getLayoutParent(page) {
    return AdminPage.getLayout(page);
};

