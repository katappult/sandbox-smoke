import {Divider} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import DrawerStyle from "@/styles/components/Drawer.module.css";

export default function LocalisationInfo({localisationInfo}) {
    const { t } = useTranslation();

    const latitude = localisationInfo?.latitude;
    const longitude = localisationInfo?.longitude;

    return <>
        <Divider/>
        <b>{t("localisation.title")}</b>
        <div className={DrawerStyle.drawer_details_body}>
            <div className={DrawerStyle.drawer_details_body_content}>
               <span className={DrawerStyle.drawer_details_body_content_title}>
                   {t("localisation.latitude")}
               </span>
                <div className={DrawerStyle.drawer_details_body_contents}>
                    <span className={DrawerStyle.drawer_details_body_content_text}>
                        {latitude}
                    </span>
                </div>
            </div>
        </div>

        <div className={DrawerStyle.drawer_details_body}>
            <div className={DrawerStyle.drawer_details_body_content}>
               <span className={DrawerStyle.drawer_details_body_content_title}>
                   {t("localisation.longitude")}
               </span>
                <div className={DrawerStyle.drawer_details_body_contents}>
                    <span className={DrawerStyle.drawer_details_body_content_text}>
                        {longitude}
                    </span>
                </div>
            </div>
        </div>
    </>
}