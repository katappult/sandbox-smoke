import s from "@/styles/pages/Auth.module.css";
import React, {useEffect, useState} from "react";
import {RoutesService} from "@/services/Routes.service";
import {useRouter} from "next/navigation";
import {Alert, Input, Spin} from "antd";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import {serviceAccount} from "@/services/Account.service";
import {AuthenticationService} from "@/services/Authentication.service";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import {PreferenceService} from "@/services/Preference.service";
import {responseSuccess} from "@/utils";
import {serviceConfig} from "@/services/utils/service.config";
import {setUserProfile} from "@/redux/action.service";
import store from "@/redux/store.service";

const fetchAndStoreProfile = async () => {
    try {
        const meRes = await AuthenticationService.getMe();
        if (meRes?.data) {
            store.dispatch(setUserProfile({ ...meRes.data, ...(meRes.data.attributes || {}) }));
            Cookies.set("userRoles", JSON.stringify(meRes.data.roles || []), { sameSite: 'strict', secure: true });
        }
    } catch (_) { /* /me failure ne bloque pas la navigation */ }
};

export default function Login() {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [registrationEnabled, setRegistrationEnabled] = useState(false);

    const [code, setCode] = useState("");
    const [tempAuthorization, setTempAuthorization] = useState();
    const [codeError, setCodeError] = useState(false);
    const [step, setStep] = useState(1);

    const router = useRouter();

    useEffect(() => {
        setCode(null);
        PreferenceService.getSystemPreferenceValuePublic("system.account.creation.active").then((res) => {
            if (responseSuccess(res)) {
                setRegistrationEnabled(res.data?.attributes?.value !== "false" && res.data?.attributes?.value !== false);
            }
        });
    }, []);

    const doRequestLogin = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await AuthenticationService.login(
                JSON.stringify({username, password})
            );

            const token = response.data?.attributes?.token;
            if (response.status === 202) {
                setTempAuthorization(token);
                setStep(2);
            } else {
                if (token) {
                    serviceConfig.setAuthorizationCookie(token);
                    await fetchAndStoreProfile();
                    router.replace("/");
                } else {
                    setError(true);
                }
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };


    const postLogin2FA = async () => {
        setLoading(true);
        try {
            const response = await AuthenticationService.post2FASuccessLogin({
                authorization: tempAuthorization,
                login: username,
                code,
            });
            serviceConfig.setAuthorizationCookie(response.data.attributes.token);
            await fetchAndStoreProfile();
            router.replace(RoutesService.getPostLoginRoute(serviceConfig));
        } catch {
            setCodeError(true);
        } finally {
            setLoading(false);
        }
    };

    const resend2FAValidationCode = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setCode("");
        setCodeError(false);
        setSendingCode(true);
        serviceAccount.resend2FAValidationCode({
            authorization: tempAuthorization,
            login: username,
        });
        setTimeout(() => setSendingCode(false), 15000);
    };

    const goBack = (e) => {
        e.preventDefault();
        setStep(1);
        setTempAuthorization("");
        setCode("");
        setCodeError(false);
    };

    if (step === 2) {
        return (
            <div className={s.card}>
                <div className={s.header}>
                    <span className={s.login_title}>{t("login.twofa_title")}</span>
                    <span className={s.subtitle}>{t("login.twofa_subtitle")}</span>
                </div>

                <div className={s.body}>
                    {codeError && (
                        <Alert
                            closable
                            onClose={() => setCodeError(false)}
                            type="error"
                            message={t("login.twofa_code_error")}
                        />
                    )}

                    <div className={s.form_group}>
                        <label className={s.form_label}>{t("login.twofa_code_label")}</label>
                        <Input
                            placeholder="0000"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="form_input"
                            maxLength={4}
                            size="large"
                        />
                    </div>

                    <div className={s.resend_row}>
                        {sendingCode ? (
                            <span>{t("auth.sending_code")}</span>
                        ) : (
                            <a className={s.footer_link} onClick={resend2FAValidationCode}>
                                {t("auth.resend_code")}
                            </a>
                        )}
                    </div>

                    <button
                        className={s.login_button}
                        onClick={postLogin2FA}
                        disabled={loading || !code || code.length !== 4}
                    >
                        {loading ? <Spin size="small"/> : t("login.twofa_validate")}
                    </button>

                    <a className={s.retour_button} onClick={goBack}>
                        <img src="/images/arrowleft.svg" alt="" width={16} height={16}/>
                        {t("auth.back")}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={s.card}>
            <div className={s.header}>
                <span className={s.login_title}>{t("login.title")}</span>
                <span className={s.subtitle}>{t("login.subtitle")}</span>
            </div>

            <div className={s.body}>
                {error && (
                    <Alert
                        closable
                        onClose={() => setError(false)}
                        type="error"
                        message={t("login.error_msg")}
                    />
                )}

                <div className={s.form_group}>
                    <label className={s.form_label}>{t("login.username_label")}</label>
                    <Input
                        placeholder={t("lost_pass.email_placeholder")}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form_input"
                        size="large"
                        autoComplete="username"
                    />
                </div>

                <div className={s.form_group}>
                    <label className={s.form_label}>{t("auth.password_label")}</label>
                    <Input
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        suffix={
                            showPassword
                                ? <EyeOutlined onClick={() => setShowPassword(false)}
                                               style={{cursor: "pointer", color: "#667085"}}/>
                                : <EyeInvisibleOutlined onClick={() => setShowPassword(true)}
                                                        style={{cursor: "pointer", color: "#667085"}}/>
                        }
                        className="form_input"
                        size="large"
                        autoComplete="current-password"
                        onPressEnter={() => username && password && doRequestLogin()}
                    />
                </div>

                <div className={s.forgot_row}>
                    <a className={s.forgot_link} onClick={() => RoutesService.toLostPass(router)}>
                        {t("login.forgot_password")}
                    </a>
                </div>

                <button
                    className={s.login_button}
                    onClick={doRequestLogin}
                    disabled={loading || !username || !password}
                >
                    {loading ? <Spin size="small"/> : t("login.submit_btn")}
                </button>

                {registrationEnabled && (
                    <div className={s.footer_label_register}>
                        <span>{t("login.no_account")}</span>
                        <a className={s.footer_link} onClick={() => RoutesService.toRegister(router)}>
                            {t("login.create_account_link")}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
