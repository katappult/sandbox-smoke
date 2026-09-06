import React, {useState} from "react";
import AuthStyle from "@/styles/pages/Auth.module.css";
import {Alert, Input, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {serviceAccount} from "@/services/Account.service";
import {responseSuccess} from "@/utils";
import {serviceConfig} from "@/services/utils/service.config";
import {RoutesService} from "@/services/Routes.service";
import {useRouter} from "next/navigation";
import {AuthenticationService} from "@/services/Authentication.service";

export default function CheckMailForUpdate(props) {
    const { t } = useTranslation();

    const [codeFromClient, setCodeFromClient] = useState("");
    const [error, setError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const router = useRouter();

    const updateEmail = async () => {
        setProcessing(true);

        try {
            const form = {
                newEmail: props.newEmail,
                code: codeFromClient
            }

            const accountId = serviceConfig.getAccountId();
            const response = await AuthenticationService.updateMailAndNickName(form);

            if(responseSuccess(response)){
                props.setOpened(false);
                try {
                    await AuthenticationService.logout();
                } finally {
                    RoutesService.toLogin(router);
                }
            }
            else {
                setError(true);
            }

        } finally {
            setProcessing(false);
            setError(false);
        }
    }

    const isCode4Digits = () => {
        return codeFromClient !== null && codeFromClient !== undefined && codeFromClient.length === 4;
    }

    const sendCodeToClient = async () => {
        if(sendingCode) return;

        setSendingCode(true);
        await preUpdateEmail();
        setTimeout(() => {
            setSendingCode(false);
        }, 15000);
    }

    const preUpdateEmail = async () => {
        await serviceAccount.preUpdateEmail(props.newEmail, props.oldEmail);
    }

    return (
        <form style={{
            display:"flex",
            gap:30,
            flexDirection:"column"
        }}>

                    <div className={AuthStyle.header}>
                   <div className={AuthStyle.header_label}>
                        <span className={AuthStyle.title}>{t("check_mail.title")}</span>
                        <span className={AuthStyle.subtitle}>
                            {t("check_mail.subtitle")} <br/><br/>
                            <b className={AuthStyle.subtitle}>{props.newEmail}</b>
                        </span>
                    </div>

                    {error && <Alert type="error" message={t("check_mail.invalid_code")} style={{width:'90%'}} />}
                    <Input placeholder={t("check_mail.code_placeholder")} onChange={(e) => setCodeFromClient(e.target.value)} required="true" className="form_input w-100" value={codeFromClient}/>

                </div>

                <button onClick={() => updateEmail()} className="button-primary w-100" disabled={!isCode4Digits() || processing} type="button">
                    {!processing ? t("check_mail.validate") : <Spin />}
                </button>

                <div className={AuthStyle.content}>
                    <span className={AuthStyle.checked_body_label}>
                        {t("check_mail.no_email")}
                        <a className={AuthStyle.footer_link} onClick={() => sendCodeToClient()}>
                            {sendingCode ? t("check_mail.sending") : t("check_mail.resend")}
                        </a>
                    </span>
                </div>


        </form>
    );

}
