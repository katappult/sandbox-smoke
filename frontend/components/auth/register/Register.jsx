import s from "@/styles/pages/Auth.module.css";
import React, { useEffect, useState } from "react";
import { Form, Input, notification } from "antd";
import { AuthenticationService } from "@/services/Authentication.service";
import { responseSuccess } from "@/utils";
import CheckMail from "@/components/auth/CheckMail";
import SetPassword from "@/components/auth/SetPassword";
import { RoutesService } from "@/services/Routes.service";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Register() {
    const { t } = useTranslation();
    const token = process.env.NEXT_PUBLIC_API_TOKEN;
    const route = useRouter();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [step, setStep] = useState(1);
    const [code, setCode] = useState(null);
    const [emailUsed, setEmailUsed] = useState(false);
    const [userNameUsed, setUserNameUsed] = useState(false);
    const [canGoToNextStep, setCanGoToNextStep] = useState(false);

    useEffect(() => {
        if (step === 2) {
            AuthenticationService.preCreateAccount(email, username);
        }
    }, [step]);


    const resendValidationCode = async () => {
        await AuthenticationService.preCreateAccount(email, username);
        notification.success({ message: t("register.resend_success"), description: t("register.resend_desc") });
    };

    const _toStep = (index) => {
        if (step === 1 && !formIValid()) return;
        setStep(index);
    };

    const emailIsValid = () => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    const userNameIsValid = () => /^[a-zA-Z0-9_-]+$/.test(username) && username.length > 1;
    const formIValid = () => emailIsValid() && userNameIsValid() && agreementChecked;

    useEffect(() => {
        const checkUnicity = async () => {
            if (formIValid()) {
                const [isEmailUsedRes, isUserNameUsedRes] = await Promise.all([
                    AuthenticationService.isEmailUsed(email),
                    AuthenticationService.isNickNameUsed(username),
                ]);
                if (responseSuccess(isEmailUsedRes)) setEmailUsed(isEmailUsedRes.data.attributes.used === true);
                if (responseSuccess(isUserNameUsedRes)) setUserNameUsed(isUserNameUsedRes.data.attributes.used === true);
            } else {
                setEmailUsed(false);
                setUserNameUsed(false);
            }
        };
        checkUnicity();
    }, [email, username, agreementChecked]);

    useEffect(() => {
        setCanGoToNextStep( formIValid());
    }, [emailUsed, userNameUsed, agreementChecked]);

    if (step === 2) {
        return (
            <CheckMail
                email={email}
                code={code}
                newAccount={true}
                setCodeDeValidationFromClient={setCode}
                resendCode={resendValidationCode}
                goBack={() => setStep(1)}
                nextStep={() => _toStep(3)}
            />
        );
    }

    if (step === 3) {
        return (
            <SetPassword
                email={email}
                lastName={username}
                validationCodeFromClient={code}
                firstName={username}
                nickName={username}
                goBack={() => _toStep(1)}
                token={token}
                newAccount={true}
            />
        );
    }

    return (
        <div className={s.card}>
            <div className={s.header}>
                <span className={s.login_title}>{t("register.title")}</span>
                <span className={s.subtitle}>{t("register.subtitle")}</span>
            </div>

            <div className={s.body}>
                <Form layout="vertical">
                    <div className={s.input_group_row}>
                        <div className={s.form_group}>
                            <label className={s.form_label}>{t("lost_pass.email_label")}</label>
                            <Input
                                placeholder={t("lost_pass.email_placeholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="form_input"
                                size="large"
                            />
                            {emailUsed && <span className={s.field_error}>{t("register.email_used")}</span>}
                        </div>

                        <div className={s.form_group}>
                            <label className={s.form_label}>{t("register.username_label")} <span style={{ color: "#98a2b3", fontWeight: 400 }}>{t("register.username_hint")}</span></label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                className="form_input"
                                placeholder={t("register.username_placeholder")}
                                size="large"
                            />
                            {userNameUsed && <span className={s.field_error}>{t("register.username_used")}</span>}
                        </div>
                    </div>

                    <div className={s.accept_conditions_wrapper} style={{ marginTop: 8 }}>
                        <input
                            type="checkbox"
                            checked={agreementChecked}
                            onChange={(e) => setAgreementChecked(e.target.checked)}
                            style={{ marginTop: 3, flexShrink: 0 }}
                        />
                        <div>
                            {t("register.accept_prefix")}{" "}
                            <a className={s.form_label_register_conditions_href} target="_blank" href="https://www.katappult.ai/" rel="noreferrer">
                                {t("register.terms_link")}
                            </a>{" "}
                            {t("register.accept_mid")}{" "}
                            <a className={s.form_label_register_conditions_href} target="_blank" href="https://www.katappult.ai/" rel="noreferrer">
                                {t("register.privacy_link")}
                            </a>
                        </div>
                    </div>

                    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                        <button
                            disabled={!canGoToNextStep}
                            className={s.login_button}
                            onClick={() => _toStep(2)}
                            type="button"
                        >
                            {t("register.continue_btn")}
                        </button>

                        <a className={s.retour_button} onClick={() => RoutesService.toLogin2(route)}>
                            <img src="/images/arrowleft.svg" alt="" width={16} height={16} />
                            {t("lost_pass.back_btn")}
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    );
}
