import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-phone-number-input/style.css";
import { serviceAccount } from "@/services/Account.service";
import { serviceConfig } from "@/services/utils/service.config";
import { responseSuccess } from "@/utils";
import s from "@/styles/pages/Profile.module.css";
import {notification} from "antd";

export default function TwoFactorsAuthentication() {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState(false);
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const accountId = serviceConfig.getAccountUid();
        serviceAccount.isTwoFactorsAuthenticationEnable(accountId).then((response) => {
            if (responseSuccess(response)) {
                setEnabled(response.data.attributes.enabled === true || response.data.attributes.enabled === "true");
            }
        });
    }, []);

    const openToggle = () => {
        if(enabled){
            serviceAccount.disableTwoFactorsAuthentication(serviceConfig.getAccountUid()).then((response) => {
                if (responseSuccess(response)) {
                    setEnabled(false);
                    notification.success({ message: t("my_account.twofa_disable_success") });
                }
            });
        } else {
            serviceAccount.enableTwoFactorsAuthentication(serviceConfig.getAccountUid()  ).then((response) => {
                if (responseSuccess(response)) {
                    setEnabled(true);
                    notification.success({ message: t("my_account.twofa_enable_success") });
                }
            });
        }
    };

    return (
        <>
            <div className={s.twofa_row}>
                <div className={s.twofa_info}>
                    <span className={s.twofa_label}>{t("my_account.twofa_title")}</span>
                    <span className={s.twofa_sub}>
                        {t("my_account.twofa_sub")}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className={`${s.twofa_status} ${enabled ? s.twofa_status_on : s.twofa_status_off}`}>
                        <span className={`${s.twofa_dot} ${enabled ? s.twofa_dot_on : s.twofa_dot_off}`} />
                        {enabled ? t("my_account.twofa_enabled") : t("my_account.twofa_disabled")}
                    </span>
                    <button className={enabled ? s.btn_ghost : s.btn_primary} onClick={openToggle}>
                        {enabled ? t("my_account.twofa_disable") : t("my_account.twofa_enable")}
                    </button>
                </div>
            </div>
        </>
    );
}
