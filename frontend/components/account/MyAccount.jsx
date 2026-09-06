import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import {notification, Spin} from "antd";
import PhoneInput, {parsePhoneNumber} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
    AccountCircleOutlined,
    AlternateEmailOutlined,
    DeleteOutlineOutlined,
    DevicesOutlined,
    EditOutlined,
    KeyOutlined,
    LockOutlined,
    PersonOutlined,
    PhotoCameraOutlined,
    SecurityOutlined,
    WarningAmberOutlined,
} from "@mui/icons-material";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import TwoFactorsAuthentication from "@/components/account/TwoFactorsAuthentication";
import ApiTokenManager from "@/components/account/ApiTokenManager";
import SessionsManager from "@/components/account/SessionsManager";
import {AuthenticationService} from "@/services/Authentication.service";
import {serviceAccount} from "@/services/Account.service";
import {serviceConfig} from "@/services/utils/service.config";
import {RoutesService} from "@/services/Routes.service";
import {isTrue, responseSuccess, toThumbFullURL} from "@/utils";
import ProfileStyle from "@/styles/pages/Profile.module.css";
import otp from "@/styles/components/OtpInput.module.css";
import {thumbService} from "@/services/Thumb.service";

// ── Password rules ───────────────────────────────────────────
const RULES = [
    {key: "my_account.pwd_rule_length", test: (p) => p.length >= 8},
    {key: "my_account.pwd_rule_upper", test: (p) => /[A-Z]/.test(p)},
    {key: "my_account.pwd_rule_lower", test: (p) => /[a-z]/.test(p)},
    {key: "my_account.pwd_rule_digit", test: (p) => /\d/.test(p)},
    {key: "my_account.pwd_rule_special", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p)},
];

const GENDER_OPTIONS = [
    {value: "", key: "my_account.gender_unspecified"},
    {value: "0", key: "my_account.gender_male"},
    {value: "1", key: "my_account.gender_female"},
    {value: "2", key: "my_account.gender_other"},
];

// ── Nav items ────────────────────────────────────────────────
const NAV_ITEMS = [
    {id: "profil", key: "my_account.nav_profil", icon: <AccountCircleOutlined fontSize="inherit"/>},
    {id: "pseudo", key: "my_account.nav_pseudo", icon: <PersonOutlined fontSize="inherit"/>},
    {id: "email", key: "my_account.nav_email", icon: <AlternateEmailOutlined fontSize="inherit"/>},
    {id: "password", key: "my_account.nav_password", icon: <LockOutlined fontSize="inherit"/>},
    {id: "twofa", key: "my_account.nav_twofa", icon: <SecurityOutlined fontSize="inherit"/>},
    {id: "tokens", key: "my_account.nav_tokens", icon: <KeyOutlined fontSize="inherit"/>},
    {id: "sessions", key: "my_account.nav_sessions", icon: <DevicesOutlined fontSize="inherit"/>},
];

// ── Logout ───────────────────────────────────────────────────
const logout = async () => {
    try {
        await AuthenticationService.logout();
    } finally {
        RoutesService.toLogin();
    }
};

// ── Profile header (toujours visible) ───────────────────────
function ProfileHeader() {
    const {t} = useTranslation();
    const nick = serviceConfig.getNickName();
    const email = serviceConfig.getAccountEmail();
    const roles = serviceConfig.getUserRoles() || [];
    const initial = nick ? nick.charAt(0).toUpperCase() : "?";

    const [photoUrl, setPhotoUrl] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();
    const menuRef = useRef();

    useEffect(() => {
        serviceAccount.personalInfo().then((res) => {
            if (responseSuccess(res)) {
                const profilePicture = res.data?.profilePicture;
                if (profilePicture) setPhotoUrl(toThumbFullURL(profilePicture, 150));
            }
        });
    }, []);

    // Ferme le menu si clic extérieur
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setShowMenu(false);
        setUploading(true);
        try {
            const res = await thumbService.addThumb(serviceConfig.getUserId(), file);
            if (responseSuccess(res)) {
                const newUrl = res.data?.photoUrl || res.data?.avatarUrl || URL.createObjectURL(file);
                setPhotoUrl(newUrl);
            } else {
                notification.error({message: t("my_account.photo_upload_error")});
            }
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDelete = async () => {
        setShowMenu(false);
        const res = await serviceAccount.deleteAvatar();
        if (responseSuccess(res)) {
            setPhotoUrl(null);
            notification.success({message: t("my_account.photo_deleted")});
        } else {
            notification.error({message: t("my_account.photo_delete_error")});
        }
    };

    return (
        <div className={ProfileStyle.header_card}>
            {/* Avatar + bouton crayon */}
            <div className={ProfileStyle.avatar_wrapper} ref={menuRef}>
                <div className={ProfileStyle.avatar}>
                    {photoUrl
                        ? <img src={photoUrl} alt="avatar"/>
                        : initial
                    }
                </div>
                <button
                    type="button"
                    className={ProfileStyle.avatar_edit_btn}
                    onClick={() => setShowMenu((v) => !v)}
                    disabled={uploading}
                    title={t("my_account.photo_edit_title")}
                >
                    {uploading
                        ? <Spin size="small"/>
                        : <EditOutlined style={{fontSize: 12}}/>
                    }
                </button>

                {showMenu && (
                    <div className={ProfileStyle.avatar_menu}>
                        <button
                            type="button"
                            className={ProfileStyle.avatar_menu_item}
                            onClick={() => {
                                setShowMenu(false);
                                fileRef.current?.click();
                            }}
                        >
                            <PhotoCameraOutlined style={{fontSize: 15}}/>
                            {t("my_account.photo_change")}
                        </button>
                        {photoUrl && (
                            <button
                                type="button"
                                className={`${ProfileStyle.avatar_menu_item} ${ProfileStyle.avatar_menu_item_danger}`}
                                onClick={handleDelete}
                            >
                                <DeleteOutlineOutlined style={{fontSize: 15}}/>
                                {t("my_account.photo_delete")}
                            </button>
                        )}
                    </div>
                )}

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    onChange={handleFileChange}
                />
            </div>

            <div className={ProfileStyle.header_info}>
                <div className={ProfileStyle.header_name}>{nick || "—"}</div>
                <div className={ProfileStyle.header_email}>{email}</div>
                {roles.length > 0 && (
                    <div className={ProfileStyle.header_badges}>
                        {roles.map((r) => (
                            <span key={r} className={ProfileStyle.badge}>{r.replace("ROLE_", "")}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Profil section — infos personnelles ─────────────────────
function ProfilSection() {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        firstName: "", lastName: "", gender: "",
        areaCode: "", phoneNumber: "",
        address: "",
        city: "", postalCode: "", country: "",
    });

    useEffect(() => {
        serviceAccount.personalInfo().then((res) => {
            if (responseSuccess(res)) {
                const data = res.data || {};
                setForm({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    gender: data.genre || "",
                    areaCode: data.areaCode || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || "",
                    city: data.city || "",
                    postalCode: data.postalCode || "",
                    country: data.country || "",
                });
            }
        }).finally(() => setLoading(false));
    }, []);

    const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));

    // PhoneInput renvoie un numéro E.164 (ex: "+33612345678") → on le décompose
    const handlePhoneChange = (value) => {
        if (!value) {
            setForm((f) => ({...f, areaCode: "", phoneNumber: ""}));
            return;
        }
        try {
            const parsed = parsePhoneNumber(value);
            if (parsed) {
                setForm((f) => ({
                    ...f,
                    areaCode: "+" + parsed.countryCallingCode,
                    phoneNumber: parsed.nationalNumber,
                }));
            } else {
                setForm((f) => ({...f, areaCode: "", phoneNumber: value}));
            }
        } catch {
            setForm((f) => ({...f, areaCode: "", phoneNumber: value}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append(
                "form",
                new Blob([JSON.stringify(form)], {type: "application/json"})
            );

            const res = await serviceAccount.updatePersonalInfo(formData);
            if (responseSuccess(res)) {
                notification.success({message: t("my_account.profil_updated")});
            } else {
                notification.error({message: t("my_account.profil_update_error")});
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={ProfileStyle.section}>
        <div className={ProfileStyle.section_body}><Spin/></div>
    </div>;

    return (
        <div className={ProfileStyle.section}>
            <div className={ProfileStyle.section_header}>
                <div className={ProfileStyle.section_title}>{t("my_account.profil_title")}</div>
                <div className={ProfileStyle.section_desc}>{t("my_account.profil_desc")}</div>
            </div>
            <form className={ProfileStyle.section_body} onSubmit={handleSubmit} noValidate={false}>

                {/* Ligne 1 : Genre — Prénom — Nom */}
                <div className={ProfileStyle.grid_3}>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.gender_label")} <span className={ProfileStyle.required}>*</span></label>
                        <select className="form_input" value={form.gender} onChange={set("gender")}
                                style={{height: 40}} required>
                            <option value="">{t("my_account.gender_select")}</option>
                            {GENDER_OPTIONS.filter(o => o.value !== "").map((o) => (
                                <option key={o.value} value={o.value}>{t(o.key)}</option>
                            ))}
                        </select>
                    </div>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.firstname")} <span className={ProfileStyle.required}>*</span></label>
                        <input className="form_input" value={form.firstName} onChange={set("firstName")}
                               placeholder={t("my_account.firstname")} required/>
                    </div>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.lastname")} <span className={ProfileStyle.required}>*</span></label>
                        <input className="form_input" value={form.lastName} onChange={set("lastName")}
                               placeholder={t("my_account.lastname")} required/>
                    </div>
                </div>

                {/* Ligne 2 : Téléphone (code pays + numéro) */}
                <div className={ProfileStyle.field}>
                    <label className={ProfileStyle.field_label}>{t("my_account.phone")} <span className={ProfileStyle.required}>*</span></label>
                    <PhoneInput
                        international
                        defaultCountry="FR"
                        value={form.areaCode + form.phoneNumber}
                        onChange={handlePhoneChange}
                    />
                    {/* Champ caché pour la validation native — phoneNumber doit être rempli */}
                    <input
                        type="tel"
                        required
                        value={form.phoneNumber}
                        onChange={() => {
                        }}
                        tabIndex={-1}
                        style={{position: "absolute", opacity: 0, pointerEvents: "none", height: 0, width: 0}}
                    />
                </div>

                {/* Ligne 3 : Adresse */}
                <div className={ProfileStyle.field}>
                    <label className={ProfileStyle.field_label}>{t("my_account.address")} <span className={ProfileStyle.required}>*</span></label>
                    <input className="form_input" value={form.address} onChange={set("address")}
                           placeholder={t("my_account.address")} required/>
                </div>

                {/* Ligne 4 : Ville — Code postal — Pays */}
                <div className={ProfileStyle.grid_3}>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.city")} <span className={ProfileStyle.required}>*</span></label>
                        <input className="form_input" value={form.city} onChange={set("city")}
                               placeholder={t("my_account.city")} required/>
                    </div>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.postal_code")} <span className={ProfileStyle.required}>*</span></label>
                        <input className="form_input" value={form.postalCode} onChange={set("postalCode")}
                               placeholder="75001" required/>
                    </div>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.country")} <span className={ProfileStyle.required}>*</span></label>
                        <input className="form_input" value={form.country} onChange={set("country")}
                               placeholder={t("my_account.country")} required/>
                    </div>
                </div>

                <div>
                    <button type="submit" className={ProfileStyle.btn_primary} disabled={saving}>
                        {saving ? t("my_account.saving") : t("my_account.save")}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── Nickname section ─────────────────────────────────────────
function NickNameSection() {
    const {t} = useTranslation();
    const initial = serviceConfig.getNickName();
    const [value, setValue] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [hint, setHint] = useState("");

    useEffect(() => {
        if (!value || value.length < 3 || value === initial) {
            setCanSave(false);
            setHint("");
            return;
        }
        let active = true;
        setLoading(true);
        AuthenticationService.isNickNameUsed(value)
            .then((res) => {
                if (!active) return;
                if (responseSuccess(res)) {
                    const used = isTrue(res.data.attributes.used);
                    setCanSave(!used);
                    setHint(used ? t("my_account.pseudo_taken") : "");
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [value]);

    const updatePseudo = async () => {
        setLoading(true);
        try {
            await AuthenticationService.updateMailAndNickName(
                {newNickName: value}
            );
            notification.success({message: t("my_account.pseudo_updated")});
            setTimeout(() => logout(), 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={ProfileStyle.section_header}>
                <div className={ProfileStyle.section_title}>{t("my_account.pseudo_title")}</div>
                <div className={ProfileStyle.section_desc}>{t("my_account.pseudo_desc")}</div>
            </div>
            <div className={ProfileStyle.section_body}>
                <div className={ProfileStyle.reauth_banner}>
                    <WarningAmberOutlined className={ProfileStyle.reauth_banner_icon}/>
                    <span>{t("my_account.pseudo_warning")}</span>
                </div>
                <div className={ProfileStyle.field}>
                    <label className={ProfileStyle.field_label}>{t("my_account.pseudo_label")}</label>
                    <div className={ProfileStyle.field_row}>
                        <input
                            className="form_input" style={{flex: 1}}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setHint("");
                            }}
                        />
                        {loading && <Spin size="small"/>}
                        <button className={ProfileStyle.btn_primary} onClick={updatePseudo} disabled={!canSave || loading}>
                            {t("my_account.save")}
                        </button>
                    </div>
                    {hint && <span className={ProfileStyle.field_error}>{hint}</span>}
                </div>
            </div>
        </div>
    );
}

// ── OTP 4-box ────────────────────────────────────────────────
function OtpBoxes({digits, onChange, hasError}) {
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    const handleKey = (indexInput, keyEvent) => {
        if (keyEvent.key === "Backspace") {
            if (digits[indexInput]) {
                const n = [...digits];
                n[indexInput] = "";
                onChange(n);
            } else if (indexInput > 0) inputRefs[indexInput - 1].current?.focus();
        } else if (keyEvent.key === "ArrowLeft" && indexInput > 0) inputRefs[indexInput - 1].current?.focus();
        else if (keyEvent.key === "ArrowRight" && indexInput < 3) inputRefs[indexInput + 1].current?.focus();
    };

    const handleChange = (i, e) => {
        const char = e.target.value.replace(/\D/g, "").slice(-1);
        const n = [...digits];
        n[i] = char;
        onChange(n);
        if (char && i < 3) inputRefs[i + 1].current?.focus();
    };

    const handlePaste = (e) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        if (!text) return;
        e.preventDefault();
        const n = ["", "", "", ""];
        text.split("").forEach((c, i) => {
            n[i] = c;
        });
        onChange(n);
        inputRefs[Math.min(text.length, 3)].current?.focus();
    };

    return (
        <div className={otp.otp_row}>
            {digits.map((d, i) => (
                <input
                    key={i} ref={inputRefs[i]} inputMode="numeric" maxLength={1} value={d}
                    className={`${otp.otp_box} ${d ? otp.otp_box_filled : ""} ${hasError ? otp.otp_box_error : ""}`}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={handlePaste}
                />
            ))}
        </div>
    );
}

// ── Email section ────────────────────────────────────────────
function EmailSection() {
    const {t} = useTranslation();
    const initial = serviceConfig.getAccountEmail();
    const [value, setValue] = useState(initial);
    const [checking, setChecking] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [emailErr, setEmailErr] = useState("");
    const [step, setStep] = useState(1);
    const [digits, setDigits] = useState(["", "", "", ""]);
    const [otpError, setOtpError] = useState(false);
    const [sending, setSending] = useState(false);
    const [resending, setResending] = useState(false);
    const [validating, setValidating] = useState(false);
    const generatedCode = useRef(null);

    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !regex.test(value) || value === initial) {
            setCanSend(false);
            setEmailErr("");
            return;
        }
        let active = true;
        setChecking(true);
        AuthenticationService.isEmailUsed(value)
            .then((res) => {
                if (!active) return;
                if (responseSuccess(res)) {
                    const used = isTrue(res.data.attributes.used);
                    setCanSend(!used);
                    setEmailErr(used ? t("my_account.email_taken") : "");
                }
            })
            .finally(() => {
                if (active) setChecking(false);
            });
        return () => {
            active = false;
        };
    }, [value]);

    const doSendCode = async () => {
        await serviceAccount.preUpdateEmail(value, initial);
    };

    const sendCode = async () => {
        setSending(true);
        try {
            await doSendCode();
            setStep(2);
            setDigits(["", "", "", ""]);
            setOtpError(false);
        } finally {
            setSending(false);
        }
    };

    const resendCode = async () => {
        if (resending) return;
        setResending(true);
        try {
            await doSendCode();
            setDigits(["", "", "", ""]);
            setOtpError(false);
        } finally {
            setTimeout(() => setResending(false), 15000);
        }
    };

    const validateCode = async () => {
        const entered = digits.join("");
        if (entered.length !== 4) return;

        try {
            setValidating(true);
            const res = await AuthenticationService.updateMailAndNickName(
                {newEmail: value, code: entered}
            );
            if (responseSuccess(res)) {
                notification.success({message: t("my_account.email_updated"), description: t("my_account.email_updated_desc")});
                setTimeout(() => logout(), 1500);
            } else {
                setOtpError(true);
                setDigits(["", "", "", ""]);
            }
        } finally {
            setValidating(false);
        }
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={ProfileStyle.section_header}>
                <div className={ProfileStyle.section_title}>{t("my_account.email_title")}</div>
                <div className={ProfileStyle.section_desc}>
                    {step === 1
                        ? t("my_account.email_step1_desc")
                        : t("my_account.email_step2_desc", {email: value})}
                </div>
            </div>

            {step === 1 && (
                <div className={ProfileStyle.section_body}>
                    <div className={ProfileStyle.reauth_banner}>
                        <WarningAmberOutlined className={ProfileStyle.reauth_banner_icon}/>
                        <span>{t("my_account.email_warning")}</span>
                    </div>
                    <div className={ProfileStyle.field}>
                        <label className={ProfileStyle.field_label}>{t("my_account.email_label")}</label>
                        <div className={ProfileStyle.field_row}>
                            <input
                                className="form_input" style={{flex: 1}} type="email" value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setEmailErr("");
                                }}
                            />
                            {checking && <Spin size="small"/>}
                            <button className={ProfileStyle.btn_primary} onClick={sendCode}
                                    disabled={!canSend || checking || sending}>
                                {sending ? t("my_account.email_sending") : t("my_account.email_update")}
                            </button>
                        </div>
                        {emailErr && <span className={ProfileStyle.field_error}>{emailErr}</span>}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className={ProfileStyle.section_body}>
                    {process.env.NODE_ENV !== "production" && (
                        <div style={{
                            margin: "0 0 12px",
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
                            <span style={{color: "#6b7280"}}>{t("my_account.email_dev_hint")}</span>
                        </div>
                    )}

                    <OtpBoxes digits={digits} onChange={(d) => {
                        setDigits(d);
                        setOtpError(false);
                    }} hasError={otpError}/>

                    {otpError && <p className={otp.otp_error_msg}>{t("my_account.otp_invalid")}</p>}

                    <div style={{display: "flex", gap: 10, justifyContent: "center"}}>
                        <button className={ProfileStyle.btn_primary} onClick={validateCode}
                                disabled={!digits.every((d) => d !== "") || validating}>
                            {validating ? t("my_account.otp_validating") : t("my_account.otp_validate")}
                        </button>
                        <button className={ProfileStyle.btn_ghost} onClick={() => {
                            setStep(1);
                            setDigits(["", "", "", ""]);
                            setValue(initial);
                            setOtpError(false);
                        }}>
                            {t("common.cancel")}
                        </button>
                    </div>
                    <div style={{textAlign: "center", fontSize: 13, color: "#667085"}}>
                        {t("my_account.email_not_received")}{" "}
                        <button onClick={resendCode} disabled={resending} style={{
                            background: "none",
                            border: "none",
                            cursor: resending ? "default" : "pointer",
                            color: resending ? "#98a2b3" : "var(--color-1)",
                            fontWeight: 600,
                            fontSize: 13,
                            padding: 0
                        }}>
                            {resending ? t("my_account.resending") : t("my_account.resend")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Password section ─────────────────────────────────────────
function PasswordSection() {
    const {t} = useTranslation();
    const [oldPwd, setOldPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [loading, setLoading] = useState(false);

    const rules = RULES.map((r) => ({...r, valid: r.test(newPwd)}));
    const allValid = rules.every((r) => r.valid);
    const pwdMatch = newPwd.length > 0 && newPwd === confirm;
    const canSave = oldPwd.length > 0 && allValid && pwdMatch;

    const save = async () => {
        setLoading(true);
        try {
            const res = await serviceAccount.updatePassword(
                {newPassword: confirm, currentPassword: oldPwd}
            );
            console.log(">>>>>>>>>>000")
            if (responseSuccess(res)) {
                setOldPwd("");
                setNewPwd("");
                setConfirm("");
                notification.success({message: t("my_account.password_updated")});
            } else {
                notification.error({message: t("my_account.password_update_error"), description: t("my_account.password_update_error_desc")});
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={ProfileStyle.section_header}>
                <div className={ProfileStyle.section_title}>{t("my_account.password_title")}</div>
                <div className={ProfileStyle.section_desc}>{t("my_account.password_desc")}</div>
            </div>
            <div className={ProfileStyle.section_body}>
                <div className={ProfileStyle.field}>
                    <label className={ProfileStyle.field_label}>{t("my_account.password_current")}</label>
                    <div className={ProfileStyle.pwd_input_wrap}>
                        <input className={ProfileStyle.pwd_input} type={showOld ? "text" : "password"}
                               value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} placeholder="••••••••"/>
                        <button type="button" className={ProfileStyle.pwd_eye} onClick={() => setShowOld(v => !v)}>
                            {showOld ? <EyeInvisibleOutlined/> : <EyeOutlined/>}
                        </button>
                    </div>
                </div>
                <div className={ProfileStyle.field}>
                    <label className={ProfileStyle.field_label}>{t("my_account.password_new")}</label>
                    <div className={ProfileStyle.pwd_input_wrap}>
                        <input className={ProfileStyle.pwd_input} type={showNew ? "text" : "password"}
                               value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="••••••••"/>
                        <button type="button" className={ProfileStyle.pwd_eye} onClick={() => setShowNew(v => !v)}>
                            {showNew ? <EyeInvisibleOutlined/> : <EyeOutlined/>}
                        </button>
                    </div>
                    {newPwd.length > 0 && (
                        <div className={ProfileStyle.checklist}>
                            {rules.map((r, i) => (
                                <div key={i} className={`${ProfileStyle.rule} ${r.valid ? ProfileStyle.rule_ok : ProfileStyle.rule_fail}`}>
                                    <span className={ProfileStyle.rule_icon}>{r.valid ? "✓" : "✗"}</span>
                                    {t(r.key)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={ProfileStyle.field}>
                    <label className={ProfileStyle.field_label}>{t("my_account.password_confirm")}</label>
                    <div className={ProfileStyle.pwd_input_wrap}>
                        <input className={ProfileStyle.pwd_input} type={showConf ? "text" : "password"}
                               value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"/>
                        <button type="button" className={ProfileStyle.pwd_eye} onClick={() => setShowConf(v => !v)}>
                            {showConf ? <EyeInvisibleOutlined/> : <EyeOutlined/>}
                        </button>
                    </div>
                    {confirm.length > 0 && (
                        pwdMatch
                            ? <span className={ProfileStyle.field_ok}>{t("my_account.password_match")}</span>
                            : <span className={ProfileStyle.field_error}>{t("my_account.password_mismatch")}</span>
                    )}
                </div>
                <div>
                    <button className={ProfileStyle.btn_primary} disabled={!canSave || loading} onClick={save}>
                        {loading ? t("my_account.password_updating") : t("my_account.password_update")}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── 2FA section ──────────────────────────────────────────────
function TwoFASection() {
    const {t} = useTranslation();
    return (
        <div className={ProfileStyle.section}>
            <div className={ProfileStyle.section_header}>
                <div className={ProfileStyle.section_title}>{t("my_account.twofa_title")}</div>
                <div className={ProfileStyle.section_desc}>{t("my_account.twofa_desc")}</div>
            </div>
            <div className={ProfileStyle.section_body}>
                <TwoFactorsAuthentication/>
            </div>
        </div>
    );
}

// ── Main ─────────────────────────────────────────────────────
export default function MyAccount() {
    const {t} = useTranslation();
    const router = useRouter();
    const validIds = NAV_ITEMS.map((i) => i.id);
    const tabParam = router.query.tab;
    const initialTab = validIds.includes(tabParam) ? tabParam : "profil";
    const [activeSection, setActiveSection] = useState(initialTab);

    // Sync state when URL param changes (e.g. back/forward navigation)
    useEffect(() => {
        if (tabParam && validIds.includes(tabParam) && tabParam !== activeSection) {
            setActiveSection(tabParam);
        }
    }, [tabParam]);

    const navigateTo = (id) => {
        setActiveSection(id);
        router.replace({query: {...router.query, tab: id}}, undefined, {shallow: true});
    };

    useEffect(() => {
        document.title = t("my_account.page_title");
    }, []);

    return (
        <div className={ProfileStyle.root}>
            {/* Left nav */}
            <nav className={ProfileStyle.sidenav}>
                {NAV_ITEMS.map((item, i) => (
                    <React.Fragment key={item.id}>
                        {i === 3 && <div className={ProfileStyle.sidenav_divider}/>}
                        <button
                            className={`${ProfileStyle.sidenav_item} ${activeSection === item.id ? ProfileStyle.sidenav_item_active : ""}`}
                            onClick={() => navigateTo(item.id)}
                        >
                            <span className={ProfileStyle.sidenav_icon}>{item.icon}</span>
                            {t(item.key)}
                        </button>
                    </React.Fragment>
                ))}
            </nav>

            {/* Content */}
            <div className={ProfileStyle.page}>
                {/* Header — toujours visible */}
                <ProfileHeader/>

                {/* Section active uniquement */}
                {activeSection === "profil" && <ProfilSection/>}
                {activeSection === "pseudo" && <NickNameSection/>}
                {activeSection === "email" && <EmailSection/>}
                {activeSection === "password" && <PasswordSection/>}
                {activeSection === "twofa" && <TwoFASection/>}
                {activeSection === "tokens" && <ApiTokenManager/>}
                {activeSection === "sessions" && <SessionsManager/>}
            </div>
        </div>
    );
}
