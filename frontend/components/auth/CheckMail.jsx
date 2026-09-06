import React, { useRef, useState } from "react";
import s from "@/styles/pages/Auth.module.css";
import otp from "@/styles/components/OtpInput.module.css";
import { Spin } from "antd";
import { serviceAccount } from "@/services/Account.service";
import { responseSuccess } from "@/utils";
import { useTranslation } from "react-i18next";

const CODE_LENGTH = 4;

export default function CheckMail(props) {
    const { t } = useTranslation();
    const { code, goBack, nextStep, email, resendCode, token, setCodeDeValidationFromClient } = props;

    const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
    const [error, setError] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);

    const refs = useRef([]);
    const codeFromClient = digits.join("");
    const isComplete = codeFromClient.length === CODE_LENGTH && digits.every((d) => d !== "");

    const updateDigit = (index, value) => {
        const d = [...digits];
        d[index] = value;
        setDigits(d);
        setError(false);
    };

    const handleChange = (index, e) => {
        const val = e.target.value.replace(/\D/g, "").slice(-1);
        updateDigit(index, val);
        if (val && index < CODE_LENGTH - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (digits[index]) {
                updateDigit(index, "");
            } else if (index > 0) {
                refs.current[index - 1]?.focus();
                updateDigit(index - 1, "");
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            refs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
            refs.current[index + 1]?.focus();
        } else if (e.key === "Enter" && isComplete) {
            checkCode();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
        if (!pasted) return;
        const d = [...digits];
        pasted.split("").forEach((char, i) => { d[i] = char; });
        setDigits(d);
        setError(false);
        const nextFocus = Math.min(pasted.length, CODE_LENGTH - 1);
        refs.current[nextFocus]?.focus();
    };

    async function checkCode() {
        if (!isComplete) return;
        setError(false);

        if (props.newAccount) {
            if (codeFromClient === code + "") {
                setCodeDeValidationFromClient(codeFromClient);
                nextStep();
            } else {
                setError(true);
            }
            return;
        }

        setProcessing(true);
        const response = await serviceAccount.isCodeValidAnon(token, email, codeFromClient);
        if (responseSuccess(response)) {
            setCodeDeValidationFromClient(codeFromClient);
            nextStep();
        } else {
            setError(true);
        }
        setProcessing(false);
    }

    const sendCodeToClient = () => {
        if (sendingCode) return;
        setSendingCode(true);
        resendCode();
        setTimeout(() => setSendingCode(false), 15000);
    };

    return (
        <div className={s.card}>
            <div className={s.header}>
                <img src="/images/mail.svg" width={56} height={56} alt="" style={{ display: "block" }} />
                <span className={s.login_title}>{t("auth.check_mail_title")}</span>
                <span className={s.subtitle}>
                    {t("auth.check_mail_subtitle_prefix")}{" "}
                    <strong style={{ color: "var(--text-light-pri)" }}>{email}</strong>
                </span>
            </div>

            <div className={s.body}>
                {/* OTP boxes */}
                <div className={otp.otp_row} onPaste={handlePaste}>
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => (refs.current[i] = el)}
                            className={`${otp.otp_box} ${error ? otp.otp_box_error : ""} ${digit ? otp.otp_box_filled : ""}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            autoFocus={i === 0}
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                {process.env.NODE_ENV !== "production" && code && (
                    <div style={{
                        margin: "10px 0",
                        padding: "8px 14px",
                        background: "#1e1b2e",
                        border: "1px solid rgba(124,58,237,0.4)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: "#a78bfa",
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>bug_report</span>
                        <span style={{ color: "#6b7280" }}>Code dev :</span>
                        <strong style={{ color: "#e9d5ff", letterSpacing: "0.15em", fontSize: 16 }}>{code}</strong>
                    </div>
                )}

                {error && (
                    <p className={otp.otp_error_msg}>{t("auth.check_mail_error")}</p>
                )}

                <button
                    className={s.login_button}
                    onClick={checkCode}
                    disabled={!isComplete || processing}
                    type="button"
                >
                    {processing ? <Spin size="small" /> : t("auth.check_mail_validate")}
                </button>

                <div className={s.resend_row}>
                    {sendingCode ? (
                        <span>{t("auth.sending_code")}</span>
                    ) : (
                        <>
                            <span style={{ color: "#667085" }}>{t("auth.not_received")}&nbsp;</span>
                            <a className={s.footer_link} onClick={sendCodeToClient}>
                                {t("auth.resend_code")}
                            </a>
                        </>
                    )}
                </div>

                <a className={s.retour_button} onClick={goBack}>
                    <img src="/images/arrowleft.svg" alt="" width={16} height={16} />
                    {t("auth.back")}
                </a>
            </div>
        </div>
    );
}
