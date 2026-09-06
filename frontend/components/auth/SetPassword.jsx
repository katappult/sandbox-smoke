import React, { useEffect, useState } from "react";
import s from "@/styles/pages/Auth.module.css";
import sp from "@/styles/components/SetPassword.module.css";
import { AuthenticationService } from "@/services/Authentication.service";
import { useRouter } from "next/navigation";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Alert, Input, Spin } from "antd";
import { serviceConfig } from "@/services/utils/service.config";
import { responseSuccess } from "@/utils";
import { serviceAccount } from "@/services/Account.service";
import { RoutesService } from "@/services/Routes.service";

import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const rules = [
    { key: "length",    labelKey: "set_password.rule_length",    test: (p) => p.length >= 8 },
    { key: "uppercase", labelKey: "set_password.rule_uppercase", test: (p) => /[A-Z]/.test(p) },
    { key: "lowercase", labelKey: "set_password.rule_lowercase", test: (p) => /[a-z]/.test(p) },
    { key: "number",    labelKey: "set_password.rule_number",    test: (p) => /\d/.test(p) },
    { key: "special",   labelKey: "set_password.rule_special",   test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function SetPassword(props) {
    const { t } = useTranslation();
    const { goBack, token, updatingLostPassword, validationCodeFromClient } = props;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [accountCreationError, setAccountCreationError] = useState(false);

    const route = useRouter();

    // Compute rule states directly from password (no stale state bug)
    const ruleStates = rules.map((r) => ({ ...r, valid: r.test(password) }));
    const allRulesValid = ruleStates.every((r) => r.valid);
    const passwordsMatch = password !== "" && password === confirmPassword;
    const totalValid = allRulesValid && passwordsMatch;

    // Show checklist only once the user has started typing
    const showChecklist = password.length > 0;

    const handleResponse = async (response, formData) => {
        if (response.status !== 200) {
            setAccountCreationError(true);
            setProcessing(false);
            return;
        }
        const loginResponse = await AuthenticationService.login({
            username: formData.accountEmail,
            password: formData.accountPassword,
        });
        Cookies.set("Authorization", loginResponse.data.attributes.token, {
            secure: true,
            sameSite: "strict",
        });
        route.replace(RoutesService.getPostLoginRoute(serviceConfig));
    };

    const updatePassword = async () => {
        if (!validationCodeFromClient) return;
        setProcessing(true);
        const response = await serviceAccount.resetPasswordAnon(token, validationCodeFromClient, {
            email: props.email,
            newPassword: confirmPassword,
        });
        if (responseSuccess(response)) {
            RoutesService.toLogin(route);
        } else {
            setAccountCreationError(true);
        }
        setProcessing(false);
    };

    const createAccount = async () => {
        setProcessing(true);
        const formData = {
            gender: "0",
            peopleSimpleType: "0",
            nickName: props.nickName,
            lastName: props.lastName,
            firstName: props.firstName,
            simpleUserForm: true,
            accountEmail: props.email,
            accountPassword: confirmPassword,
            withAccount: "true",
            peopleType: "com.katappult.people.Party/Person",
        };
        try {
            const response = await AuthenticationService.createAccountAnon(formData);
            await handleResponse(response, formData);
        } catch {
            setProcessing(false);
        }
    };

    const eyeIcon = (show, toggle) =>
        show
            ? <EyeOutlined onClick={toggle} style={{ cursor: "pointer", color: "#667085" }} />
            : <EyeInvisibleOutlined onClick={toggle} style={{ cursor: "pointer", color: "#667085" }} />;

    return (
        <div className={s.card}>
            <div className={s.header}>
                <img src="/images/key.svg" alt="" width={52} height={52} style={{ display: "block" }} />
                <span className={s.login_title}>
                    {updatingLostPassword ? t("set_password.title_update") : t("set_password.title_create")}
                </span>
                <span className={s.subtitle}>
                    {updatingLostPassword
                        ? t("set_password.subtitle_update")
                        : t("set_password.subtitle_create")}
                </span>
            </div>

            <div className={s.body}>
                {accountCreationError && (
                    <Alert
                        closable
                        onClose={() => setAccountCreationError(false)}
                        type="error"
                        message={t("auth.generic_error")}
                    />
                )}

                {/* Password field */}
                <div className={s.form_group}>
                    <label className={s.form_label}>{t("auth.password_label")}</label>
                    <Input
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        suffix={eyeIcon(showPassword, () => setShowPassword((v) => !v))}
                        placeholder="••••••••"
                        className="form_input"
                        size="large"
                        autoComplete="new-password"
                    />
                </div>

                {/* Strength checklist */}
                {showChecklist && (
                    <div className={sp.checklist}>
                        {ruleStates.map((r) => (
                            <div key={r.key} className={`${sp.rule} ${r.valid ? sp.rule_ok : sp.rule_fail}`}>
                                <span className={sp.rule_icon}>{r.valid ? "✓" : "✗"}</span>
                                <span>{t(r.labelKey)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirm password field */}
                <div className={s.form_group} style={{ marginTop: 4 }}>
                    <label className={s.form_label}>{t("set_password.confirm_label")}</label>
                    <Input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showConfirm ? "text" : "password"}
                        suffix={eyeIcon(showConfirm, () => setShowConfirm((v) => !v))}
                        placeholder="••••••••"
                        className={`form_input ${confirmPassword && !passwordsMatch ? sp.input_error : ""}`}
                        size="large"
                        autoComplete="new-password"
                    />
                    {confirmPassword && !passwordsMatch && (
                        <span className={s.field_error}>{t("set_password.mismatch")}</span>
                    )}
                    {confirmPassword && passwordsMatch && (
                        <span className={sp.match_ok}>{t("set_password.match")}</span>
                    )}
                </div>

                {/* Submit */}
                <button
                    className={s.login_button}
                    disabled={!totalValid || processing}
                    onClick={updatingLostPassword ? updatePassword : createAccount}
                    type="button"
                    style={{ marginTop: 8 }}
                >
                    {processing
                        ? <Spin size="small" />
                        : updatingLostPassword
                            ? t("set_password.submit_update")
                            : t("set_password.submit_create")}
                </button>

                <a className={s.retour_button} onClick={goBack}>
                    <img src="/images/arrowleft.svg" alt="" width={16} height={16} />
                    {t("auth.back")}
                </a>
            </div>
        </div>
    );
}
