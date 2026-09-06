import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {Menu} from "antd";
import { useTranslation } from "react-i18next";

export default function MenuUser({ onNavigate }) {
    const { t } = useTranslation();
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState('1');
    const router = useRouter();

    const menuItems = [
        {
            key: "Demandes",
            label: t("menu.requests"),
        },
        {
            key: "Users",
            label: t("menu.users"),
            link: "/settings/users"
        },
        {
            key: "Mailing",
            label: t("menu.mailing"),
            link: "/settings/mailing"
        },
    ];

    const handleMenuClick = (menu) => {
        menuItems.map(item => {
            if (item.key === menu.key) {
                if (item?.key) {
                    setCurrentSelectedIndex(item.key);
                    router.push(item.link);
                    onNavigate?.();
                }
            }
        })
    };

    return <Menu
        mode="inline"
        selectable
        theme={'light'}
        selectedKeys={[currentSelectedIndex]}
        defaultSelectedKeys={[currentSelectedIndex]}
        onClick={handleMenuClick}
        style={{
            height: '100%',
            borderRight: 1,
        }}
        items={menuItems}
    />
}