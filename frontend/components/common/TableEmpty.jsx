import {FolderOpenOutlined} from "@ant-design/icons";
import s from "@/styles/components/TableEmpty.module.css";
import React from "react";
import {useTranslation} from "react-i18next";

export default function TableEmpty({icon, title, description, action}) {
    const {t} = useTranslation();
    return <div className={s.wrap}>
        <div className={s.icon_circle}>
            {icon ?? <FolderOpenOutlined/>}
        </div>
        <p className={s.title}>{title ?? t("table.empty_title")}</p>
        <p className={s.desc}>{description ?? t("table.empty_desc")}</p>
        {action}
    </div>
}
