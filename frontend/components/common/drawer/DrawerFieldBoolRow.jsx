import ds from "@/styles/components/Drawer2.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    CheckOutlined,
    MinusOutlined,
} from "@ant-design/icons";

export default function DrawerFieldBoolRow({ label, checked }) {
    const { t } = useTranslation();
    return (
        <div className={ds.field_row}>
            <span className={ds.field_label}>{label}</span>
            {checked ? (
                <span className={ds.bool_on}><CheckOutlined style={{ fontSize: 10 }} /> {t("common.yes")}</span>
            ) : (
                <span className={ds.bool_off}><MinusOutlined style={{ fontSize: 10 }} /> {t("common.no")}</span>
            )}
        </div>
    );
}
