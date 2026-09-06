import React, {useEffect, useState} from "react";
import SetPassword from "@/styles/components/SetPassword.module.css";
import {serviceAccount} from "@/services/Account.service";
import {Input, notification} from "antd";
import {LockOpen, LockOutlined} from "@mui/icons-material";
import {responseSuccess} from "@/utils";
import { useTranslation } from "react-i18next";

export default function UpdatePassword() {
    const { t } = useTranslation();

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLengthValid, setIsLengthValid] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [ValidCharaters, setValidCharaters] = useState(false);
    const [ValidConfirm, setValidConfirm] = useState(false);
    const [totalValid, setTotalValid] = useState(false);
    const [locked, setLocked] = useState(true);

    useEffect(() => {
    }, []);

    async function updatePassword() {
        const formData = {
            newPassword: confirmPassword,
            currentPassword:currentPassword
        };

        const response = await serviceAccount.updatePassword(
            formData
        );

        if(responseSuccess(response)) {
            setConfirmPassword("");
            setPassword("");
            setCurrentPassword("");
            notification.success({
                message: t("reset_password.success"),
                description: t("reset_password.success_desc"),
            });
        }
        else {
            notification.error({
                message: t("reset_password.error"),
                description: t("update_password.invalid"),
            });
        }
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    };

    useEffect(() => {
        setIsLengthValid(password.length >= 8);
        setHasUppercase(/[A-Z]/.test(password));
        setHasLowercase(/[a-z]/.test(password));
        setHasNumber(/\d/.test(password));
        setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));

        if (
            isLengthValid &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSpecialChar
        ) {
            setValidCharaters(true);
        } else {
            setValidCharaters(false);
        }
    }, [
        password,
        isLengthValid,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecialChar,
    ]);

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
    };

    useEffect(() => {
        setIsPasswordMatch(password === confirmPassword);

        if (isPasswordMatch) {
            setValidConfirm(true);
        } else {
            setValidConfirm(false);
        }

    }, [password, confirmPassword, isPasswordMatch]);

    useEffect(() => {
        if (ValidCharaters && ValidConfirm) {
            setTotalValid(true);
        } else {
            setTotalValid(false);
        }
    }, [ValidCharaters, ValidConfirm]);


    const getLockIcon = () => {
        if(locked)  return <LockOutlined onClick={() => setLocked(false)}/>
        return <LockOpen onClick={() => setLocked(true)}/>
    }

    return (
        <div>
            <div className={SetPassword.container}>
                <div className={SetPassword.wrapper}>
                    <div className={SetPassword.content}>
                        <p>{t("reset_password.desc")}</p>

                        <form className={SetPassword.form}>

                            <div className={SetPassword.form_group}>
                                <span className={SetPassword.form_label}>{t("my_account.password_current")}</span>
                                <Input
                                    suffix={getLockIcon()}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="form_input"
                                    autoFocus
                                    value={currentPassword}
                                    placeholder={t("update_password.current_placeholder")}
                                    type={locked ? "password" : "text"}
                                />
                            </div>

                            <div className={SetPassword.form_group}>
                                    <span className={SetPassword.form_label}>{t("my_account.password_new")}</span>
                                    <Input
                                        suffix={getLockIcon()}
                                        onChange={handlePasswordChange}
                                        className="form_input"
                                        autoFocus
                                        value={password}
                                        placeholder={t("update_password.new_placeholder")}
                                        type={locked ? "password" : "text"}
                                    />
                            </div>

                            <div className={SetPassword.check_wrapper}>
                                {password && !isLengthValid &&
                                    <div className={SetPassword.check}>
                                            <span className={SetPassword.check_label}>
                                              {t("my_account.pwd_rule_length")}
                                            </span>
                                    </div>
                                }

                                {password && !hasUppercase &&
                                    <div className={SetPassword.check}>
                                            <span className={SetPassword.check_label}>
                                              {t("my_account.pwd_rule_upper")}
                                            </span>
                                    </div>
                                    }

                                    {password && !hasLowercase &&
                                    <div className={SetPassword.check}>
                                            <span className={SetPassword.check_label}>
                                              {t("my_account.pwd_rule_lower")}
                                            </span>
                                    </div>
                                    }

                                    {password && !hasNumber &&
                                    <div className={SetPassword.check}>
                                            <span className={SetPassword.check_label}>
                                              {t("my_account.pwd_rule_digit")}
                                            </span>
                                    </div>
                                    }

                                    {password && !hasSpecialChar &&
                                    <div className={SetPassword.check}>
                                            <span className={SetPassword.check_label}>
                                              {t("my_account.pwd_rule_special")}
                                            </span>
                                    </div>
                                }
                            </div>

                            <div className={SetPassword.form_group}>
                                <div className={SetPassword.form_group}>
                                  <span className={SetPassword.form_label}>
                                    {t("my_account.password_confirm")}
                                  </span>
                                    <Input
                                        value={confirmPassword}
                                        suffix={getLockIcon()}
                                        onChange={handleConfirmPasswordChange}
                                        className="form_input"
                                        placeholder={t("update_password.confirm_placeholder")}
                                        type={locked ? "password" : "text"}
                                    />
                                </div>
                                {!isPasswordMatch && confirmPassword ? (
                                    <div className={SetPassword.check}>
                                        {t("my_account.password_mismatch")}
                                    </div>
                                ) : null}
                            </div>


                            <div className={SetPassword.button_form}>
                                <button
                                    disabled={!totalValid}
                                    style={{width: 330}}
                                    onClick={() => updatePassword()}
                                    className="button-primary"
                                    type="button"
                                >
                                    {t("update_password.update_btn")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
