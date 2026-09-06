import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Menu} from "antd";
import { useTranslation } from "react-i18next";
import {serviceConfig} from "@/services/utils/service.config";

const ADMIN_ROLES = ["ROLE_ADMIN", "ROLE_SUPERADMIN"];

export const groups = [
    {
        labelKey: "menu.group_administration",
        requiredRoles: ADMIN_ROLES,
        children: [
            {key: "users", labelKey: "menu.users", link: "/admin/users", icon: "group"},
            {key: "roles", labelKey: "menu.roles", link: "/admin/roles", icon: "security"},
            {key: "groups", labelKey: "menu.groups", link: "/admin/groups", icon: "group_work"},
            {key: "medias", labelKey: "menu.medias", link: "/admin/medias", icon: "photo"},
            {key: "dataImport", labelKey: "menu.data_import", link: "/admin/import", icon: "upload_file"},
            {key: "systemPreferences", labelKey: "menu.system_preferences", link: "/admin/preferences", icon: "tune"},
        ],
    },
    {
        labelKey: "menu.group_navigation",
        children: [

        ],
    }
];

export default function MenuFront({onNavigate}) {
    const { t } = useTranslation();
    const router = useRouter();
    const [selectedKey, setSelectedKey] = useState("profile");


    useEffect(() => {
        if(serviceConfig.hasRoleAdmin()){
            setSelectedKey("users");
        }
    }, []);

    const userRoles = serviceConfig.getUserRoles();
    const hasAccess = (requiredRoles) =>
        !requiredRoles || requiredRoles.some(r => userRoles.includes(r));

    const visibleGroups = groups.filter(g => hasAccess(g.requiredRoles));

    const items = visibleGroups.map((group) => ({
        type: "group",
        label: t(group.labelKey),
        children: group.children.map((item) => ({
            key: item.key,
            label: t(item.labelKey),
            icon: <span className="material-symbols-outlined" style={{fontSize: 16, lineHeight: 1}}>{item.icon}</span>,
        })),
    }));

    const handleMenuClick = ({key}) => {
        setSelectedKey(key);
        for (const group of visibleGroups) {
            const found = group.children.find((item) => item.key === key);
            if (found) {
                router.push(found.link);
                onNavigate?.();
                break;
            }
        }
    };

    return (
        <Menu
            mode="inline"
            selectable
            theme="light"
            selectedKeys={selectedKey ? [selectedKey] : []}
            onClick={handleMenuClick}
            style={{border: "none", paddingBottom: 24}}
            items={items}
        />
    );
}
