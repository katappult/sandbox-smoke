import React, { useState } from "react";
import s from "@/styles/pages/Auth.module.css";
import { useRouter } from "next/navigation";
import { RoutesService } from "@/services/Routes.service";
import { Input, notification } from "antd";
import CheckMail from "../CheckMail";
import SetPassword from "../SetPassword";
import { responseSuccess } from "@/utils";
import { serviceAccount } from "@/services/Account.service";
import { useTranslation } from "react-i18next";

export default function LostPass() {
    const { t } = useTranslation();
    const route = useRouter();
    const token = process.env.NEXT_PUBLIC_API_TOKEN;

    const [step, setStep] = useState(1);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [email, setEmail] = useState("");
    const [codeDeValidationFromClient, setCodeDeValidationFromClient] = useState();

    const resendValidationCode = (withSuccessMessage) => {
        const response = serviceAccount.requestResetPasswordAnon(token, email).then(() => {});
        if (withSuccessMessage && responseSuccess(response)) {
            notification.success({
                message: t("lost_pass.resend_success"),
                description: t("lost_pass.resend_desc"),
            });
        }
    };

    const handleEmailChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        setIsEmailValid(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail));
    };

    async function _toStep(index) {
        setStep(index);
        if (index === 2) resendValidationCode(false);
    }

    if (step === 2) {
        return (
            <CheckMail
                updatingLostPassword={true}
                email={email}
                token={token}
                setCodeDeValidationFromClient={setCodeDeValidationFromClient}
                resendCode={() => resendValidationCode(true)}
                goBack={() => setStep(1)}
                nextStep={() => _toStep(3)}
            />
        );
    }

    if (step === 3) {
        return (
            <SetPassword
                validationCodeFromClient={codeDeValidationFromClient}
                goBack={() => setStep(1)}
                updatingLostPassword={true}
                email={email}
                token={token}
            />
        );
    }

    return (
        <div className={s.card}>
            <div className={s.header}>
                <span className={s.login_title}>{t("lost_pass.title")}</span>
                <span className={s.subtitle}>{t("lost_pass.subtitle")}</span>
            </div>

            <div className={s.body}>
                <div className={s.form_group}>
                    <label className={s.form_label}>{t("lost_pass.email_label")}</label>
                    <Input
                        autoFocus
                        className="form_input"
                        type="email"
                        onChange={handleEmailChange}
                        placeholder={t("lost_pass.email_placeholder")}
                        name="email"
                        size="large"
                    />
                </div>

                <button
                    className={s.login_button}
                    disabled={!isEmailValid}
                    onClick={() => _toStep(2)}
                    type="button"
                >
                    {t("lost_pass.submit_btn")}
                </button>

                <a className={s.retour_button} onClick={() => RoutesService.toLogin2(route)}>
                    <img src="/images/arrowleft.svg" alt="" width={16} height={16} />
                    {t("lost_pass.back_btn")}
                </a>
            </div>
        </div>
    );
}
