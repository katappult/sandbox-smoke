import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import SetPasswordStyle from "@/styles/components/SetPassword.module.css";
import {Input, notification} from "antd";
import {LockOpen, LockOutlined} from "@mui/icons-material";
import {responseSuccess} from "@/utils";
import {serviceAccount} from "@/services/Account.service";

export default function ResetPassword() {
    const {t} = useTranslation();

    const [oldPassword, setOldPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLengthValid, setIsLengthValid] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = useState(false);
    const [ValidCharaters, setValidCharaters] = useState(false);
    const [validConfirm, setValidConfirm] = useState(false);
    const [totalValid, setTotalValid] = useState(false);
    const [locked, setLocked] = useState(true);

    async function resetPassword() {
        const formData = {
            email: email,
            newPassword: confirmPassword,
            currentPassword: oldPassword,
        };

        const response = await serviceAccount.updatePassword(
            formData
        );

        if(responseSuccess(response)) {
            setConfirmPassword("");
            setPassword("");
            setOldPassword("")
            notification.success({
                message: t("reset_password.success"),
                description: t("reset_password.success_desc"),
            });
        }
        else {
            notification.error({
                message: t("reset_password.error"),
                description: t("reset_password.error_desc"),
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
        if (ValidCharaters && validConfirm && oldPassword !== "") {
            setTotalValid(true);
        } else {
            setTotalValid(false);
        }
    }, [ValidCharaters, validConfirm]);


    const getLockIcon = () => {
        if(locked)  return <LockOutlined onClick={() => setLocked(false)}/>
        return <LockOpen onClick={() => setLocked(true)}/>
    }

    return (
        <div>
            <div className={SetPasswordStyle.container}>
                <div className={SetPasswordStyle.wrapper}>
                    <div className={SetPasswordStyle.content}>
                       <p>
                           {t("reset_password.desc")}
                       </p>

                        <form className={SetPasswordStyle.form}>

                            <div className={SetPasswordStyle.form_group}>
                                <div className={SetPasswordStyle.form_group}>
                                    <span className={SetPasswordStyle.form_label}>
                                        {t("reset_password.current_label")}
                                    </span>
                                    <Input
                                        suffix={getLockIcon()}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="form_input"
                                        autoFocus
                                        value={oldPassword}
                                        placeholder={t("my_account.password_current")}
                                        type={locked ? "password" : "text"}
                                    />
                                </div>
                            </div>

                            <div className={SetPasswordStyle.form_group}>
                                <div className={SetPasswordStyle.form_group}>
                                    <span className={SetPasswordStyle.form_label}>
                                        {t("my_account.password_new")}
                                    </span>
                                    <Input
                                        suffix={getLockIcon()}
                                        onChange={handlePasswordChange}
                                        className="form_input"
                                        autoFocus
                                        value={password}
                                        placeholder={t("my_account.password_new")}
                                        type={locked ? "password" : "text"}
                                    />
                                </div>
                            </div>


                            <div className={SetPasswordStyle.check_wrapper}>
                                {!isLengthValid &&
                                    <div className={SetPasswordStyle.check}>
                                        <span className={SetPasswordStyle.check_label}>
                                            {t("my_account.pwd_rule_length")}
                                        </span>
                                    </div>
                                }

                                {!hasUppercase &&
                                    <div className={SetPasswordStyle.check}>
                                        <span className={SetPasswordStyle.check_label}>
                                            {t("my_account.pwd_rule_upper")}
                                        </span>
                                    </div>
                                }

                                {!hasLowercase &&
                                    <div className={SetPasswordStyle.check}>
                                        <span className={SetPasswordStyle.check_label}>
                                            {t("my_account.pwd_rule_lower")}
                                        </span>
                                    </div>
                                }

                                {!hasNumber &&
                                    <div className={SetPasswordStyle.check}>
                                        <span className={SetPasswordStyle.check_label}>
                                            {t("my_account.pwd_rule_digit")}
                                        </span>
                                    </div>
                                }

                                {!hasSpecialChar &&
                                    <div className={SetPasswordStyle.check}>
                                        <span className={SetPasswordStyle.check_label}>
                                            {t("my_account.pwd_rule_special")}
                                        </span>
                                    </div>
                                }
                            </div>


                            <div className={SetPasswordStyle.form_group}>
                                <div className={SetPasswordStyle.form_group}>
                                    <span className={SetPasswordStyle.form_label}>
                                        {t("my_account.password_confirm")}
                                    </span>
                                    <Input
                                        value={confirmPassword}
                                        suffix={getLockIcon()}
                                        onChange={handleConfirmPasswordChange}
                                        className="form_input"
                                        placeholder={t("my_account.password_confirm")}
                                        type={locked ? "password" : "text"}
                                    />
                                </div>
                                {!isPasswordMatch && confirmPassword ? (
                                    <div className={SetPasswordStyle.check}>
                                        {t("my_account.password_mismatch")}
                                    </div>
                                ) : null}
                            </div>

                            <div className={SetPasswordStyle.button_form}>
                                <button
                                    disabled={!totalValid}
                                    style={{ width: 330 }}
                                    onClick={() => resetPassword()}
                                    className="button-primary"
                                    type="button"
                                >
                                   {t("my_account.email_update")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
