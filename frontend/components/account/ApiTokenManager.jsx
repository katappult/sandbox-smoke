import React, { useCallback, useEffect, useState } from "react";
import { Modal, notification, Spin } from "antd";
import {
    CheckOutlined,
    ContentCopyOutlined,
    DeleteOutlined,
    DeleteSweepOutlined,
    KeyOutlined,
    WarningAmberOutlined,
} from "@mui/icons-material";
import { useTranslation, Trans } from "react-i18next";
import { ApiTokenService } from "@/services/ApiToken.service";
import { responseSuccess } from "@/utils";
import ProfileStyle from "@/styles/pages/Profile.module.css";
import UserDrawerStyle from "@/styles/components/UserDrawer.module.css";

// ── Presets ───────────────────────────────────────────────────────────────────
const EXPIRY_PRESETS = [
    { key: "1d",    labelKey: "api_token.expiry_today",  duration: 1,     unit: "DAYS" },
    { key: "7d",    labelKey: "api_token.expiry_7d",     duration: 7,     unit: "DAYS" },
    { key: "30d",   labelKey: "api_token.expiry_30d",    duration: 30,    unit: "DAYS" },
    { key: "180d",  labelKey: "api_token.expiry_6m",     duration: 180,   unit: "DAYS" },
    { key: "365d",  labelKey: "api_token.expiry_1y",     duration: 365,   unit: "DAYS" },
    { key: "never", labelKey: "api_token.expiry_never",  duration: 36500, unit: "DAYS" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(val) {
    if (!val) return "—";
    const d = new Date(val);
    return isNaN(d) ? val : d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function parseDateFR(dateString) {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Attention : le mois en JavaScript commence à 0 (janvier = 0)
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

function isExpired(token) {
    return parseDateFR(token.expiresAt) < new Date();
}

// ── CopyButton ────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const handle = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handle}
            className={UserDrawerStyle.btn_ghost}>
            {copied
                ? <CheckOutlined style={{ fontSize: 13 }} />
                : <ContentCopyOutlined style={{ fontSize: 13 }} />
            }
            {copied ? t("common.copied") : t("common.copy")}
        </button>
    );
}

// ── MetaItem ──────────────────────────────────────────────────────────────────
function MetaItem({ icon, label, value, mono = true, truncate = false }) {
    return (
        <span className="flex items-center gap-1 text-[length:var(--fs-xs)] text-[var(--text-muted)]">
            {icon}
            <span className="text-[var(--text-secondary)]">{label} :</span>
            <span className={`${mono ? "font-mono" : ""} ${truncate ? "truncate max-w-[260px]" : ""}`}>
                {value}
            </span>
        </span>
    );
}

// ── TokenRow ──────────────────────────────────────────────────────────────────
function TokenRow({ token, onRevoke, revoking }) {
    const { t } = useTranslation("common");
    const expired = isExpired(token);
    return (
        <div className={`flex items-start justify-between gap-3 p-3 rounded border border-[var(--card-border)] transition-opacity ${expired ? "bg-[var(--surface-subtle)] opacity-60" : "bg-[var(--card-bg)]"}`}>
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <KeyOutlined style={{ fontSize: 14 }} className="text-[var(--color-1)] shrink-0" />
                    <span className="text-[length:var(--fs-sm)] font-semibold text-[var(--text-primary)]">
                        {token.label || t("api_token.no_name")}
                    </span>
                    {expired && (
                        <span className="text-[length:var(--fs-xs)] px-2 py-0.5 rounded-full font-semibold bg-red-500/10 text-red-600 dark:text-red-400">
                            {t("api_token.expired_badge")}
                        </span>
                    )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {(token.createdAt || token.createdDate) && (
                        <MetaItem label={t("api_token.created_at")} value={fmtDate(token.createdAt || token.createdDate)} mono={false} />
                    )}
                    {(token.expiresAt || token.expiredAt) && (
                        <MetaItem label={t("api_token.expires_at")} value={fmtDate(token.expiresAt || token.expiredAt)} mono={false} />
                    )}
                </div>
            </div>

            <button className={UserDrawerStyle.btn_danger}
                style={{ width: "auto", padding: "0 14px", height: 32, flexShrink: 0 }}
                onClick={() => onRevoke(token)}
            >
                {revoking === token.id
                    ? <Spin size="small" />
                    : <><DeleteOutlined style={{ fontSize: 13 }} /> {t("api_token.revoke")}</>
                }
            </button>
        </div>
    );
}

// ── GenerateModal ─────────────────────────────────────────────────────────────
function GenerateModal({ open, onClose, onGenerated }) {
    const { t } = useTranslation("common");
    const [label,    setLabel]    = useState("");
    const [preset,   setPreset]   = useState("30d");
    const [saving,   setSaving]   = useState(false);
    const [newToken, setNewToken] = useState(null);

    useEffect(() => {
        if (!open) {
            setLabel("");
            setPreset("30d");
            setNewToken(null);
        }
    }, [open]);

    const handleGenerate = async () => {

        try {

            if(!label.trim()) return;

            const selected = EXPIRY_PRESETS.find(p => p.key === preset) ?? EXPIRY_PRESETS[2];
            setSaving(true);

            const response = await ApiTokenService.generateToken({
                label: label.trim(),
                duration: selected.duration,
                unit: selected.unit,
            });

            if (responseSuccess(response)) {
                setNewToken(response.data?.attributes?.token);
                onGenerated();
            } else {
                notification.error({ message: t("api_token.generate_error") });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={newToken ? null : onClose}
            closable={!newToken}
            maskClosable={!newToken}
            title={newToken ? t("api_token.generated_copy_title") : t("api_token.generate_title")}
            destroyOnClose
            footer={null}
            width={520}
        >
            {newToken ? (
                <div className="flex flex-col gap-4">
                    {/* Warning */}
                    <div className="flex items-start gap-2.5 p-3 rounded border border-yellow-500/40 bg-yellow-500/10 text-[length:var(--fs-sm)] leading-relaxed">
                        <WarningAmberOutlined style={{ fontSize: 17 }} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                        <span className="text-yellow-800 dark:text-yellow-200">
                            <Trans i18nKey="api_token.one_time_warning" ns="common" components={{ bold: <strong /> }} />
                        </span>
                    </div>

                    {/* Token */}
                    <div className="flex items-center gap-2 p-2.5 rounded border border-[var(--color-1)] bg-[var(--opacity-10-color-1)]">
                        <code className="flex-1 text-[length:var(--fs-xs)] font-mono break-all text-[var(--text-primary)] select-all">
                            {newToken}
                        </code>
                        <CopyButton text={newToken} />
                    </div>

                    <div className="flex justify-end pt-1 border-t border-[var(--card-border)]">
                        <button className={ProfileStyle.btn_primary} onClick={onClose}>
                            {t("common.close")}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {/* Label */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[length:var(--fs-sm)] font-semibold text-[var(--text-primary)]">
                            {t("api_token.label")}{" "}
                            <span className="font-normal text-[var(--text-muted)]">({t("common.optional")})</span>
                        </label>
                        <input
                            required={true}
                            className={"form_input"}
                            placeholder={t("api_token.label_placeholder")}
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                        />
                    </div>

                    {/* Expiry */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[length:var(--fs-sm)] font-semibold text-[var(--text-primary)]">
                            {t("api_token.expiration")}
                        </label>
                        <select
                            className={"form_input"}
                            value={preset}
                            onChange={e => setPreset(e.target.value)}
                        >
                            {EXPIRY_PRESETS.map(p => (
                                <option key={p.key} value={p.key}>{t(p.labelKey)}</option>
                            ))}
                        </select>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2.5 pt-1 border-t border-[var(--card-border)]">
                        <button className={ProfileStyle.btn_ghost} onClick={onClose} disabled={saving}>
                            {t("common.cancel")}
                        </button>
                        <button className={ProfileStyle.btn_primary} onClick={handleGenerate} disabled={saving}>
                            {saving ? <Spin size="small" /> : t("api_token.generate_button")}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ApiTokenManager() {
    const { t } = useTranslation("common");
    const [tokens,    setTokens]    = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [revoking,  setRevoking]  = useState(null);
    const [revokeAll, setRevokeAll] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        ApiTokenService.listTokens()
            .then(res => {
                if (responseSuccess(res)) setTokens(res.data?.dataList || []);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleRevoke = async (token) => {
        setRevoking(token.id);
        try {
            const res = await ApiTokenService.revokeToken(token.id);
            if (responseSuccess(res)) {
                setTokens(prev => prev.filter(tk => tk.id !== token.id));
            } else {
                notification.error({ message: t("api_token.revoke_error") });
            }
        } finally { setRevoking(null); }
    };

    const handleRevokeAll = async () => {
        try {
            setRevokeAll(true);
            for (const token of tokens) {
                await ApiTokenService.revokeToken(token.id);
            }
            setTokens([]);
        } finally { setRevokeAll(false); }
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={`${ProfileStyle.borderBottom} flex p-8 border-2 items-center justify-between`}>
                <div>
                    <div className={ProfileStyle.section_title}>{t("api_token.section_title")}</div>
                    <div className={ProfileStyle.section_desc}>
                        {t("api_token.section_desc")}
                    </div>
                </div>
                <div className="flex gap-2 shrink-0">
                    {tokens.length > 0 && (
                        <button
                            className={`${ProfileStyle.btn_ghost} flex items-center gap-1.5`}
                            onClick={() => Modal.confirm({
                                title: t("api_token.revoke_all_confirm_title"),
                                content: t("api_token.revoke_all_confirm_content"),
                                okText: t("api_token.revoke_all"),
                                okButtonProps: { danger: true },
                                cancelText: t("common.cancel"),
                                onOk: handleRevokeAll,
                            })}
                            disabled={revokeAll}
                        >
                            {revokeAll
                                ? <Spin size="small" />
                                : <><DeleteSweepOutlined style={{ fontSize: 15 }} /> {t("api_token.revoke_all")}</>
                            }
                        </button>
                    )}
                    <button className={`${ProfileStyle.btn_primary} flex items-center gap-1.5`} onClick={() => setModalOpen(true)}>
                        {t("api_token.new_token")}
                    </button>
                </div>
            </div>

            <div className={ProfileStyle.section_body}>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Spin />
                    </div>
                ) : tokens.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-2.5 text-[var(--text-muted)]">
                        <KeyOutlined style={{ fontSize: 32, opacity: 0.3 }} />
                        <span className="text-[length:var(--fs-sm)] italic">{t("api_token.empty")}</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {tokens.map(token => (
                            <TokenRow
                                key={token.id}
                                token={token}
                                onRevoke={handleRevoke}
                                revoking={revoking}
                            />
                        ))}
                    </div>
                )}
            </div>

            <GenerateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onGenerated={load}
            />
        </div>
    );
}
