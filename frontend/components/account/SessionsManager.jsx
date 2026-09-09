import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, notification, Pagination, Spin } from "antd";
import {
    ComputerOutlined,
    DeleteOutlined,
    DeleteSweepOutlined,
    PhoneIphoneOutlined,
    ScheduleOutlined,
    LogoutOutlined,
    WifiOutlined,
} from "@mui/icons-material";
import { ApiTokenService } from "@/services/ApiToken.service";
import { responseSuccess } from "@/utils";
import ProfileStyle from "@/styles/pages/Profile.module.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(val) {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d) ? val : d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function clientIcon(clientType) {
    const t = (clientType || "").toLowerCase();
    if (t.includes("mobile") || t.includes("ios") || t.includes("android")) {
        return <PhoneIphoneOutlined style={{ fontSize: 18 }} />;
    }
    return <ComputerOutlined style={{ fontSize: 18 }} />;
}

function parseUserAgent(userAgent, fallback) {
    if (!userAgent) return fallback;
    const browsers = [
        { name: "Edge",    rx: /Edg\/[\d.]+/ },
        { name: "Chrome",  rx: /Chrome\/[\d.]+/ },
        { name: "Firefox", rx: /Firefox\/[\d.]+/ },
        { name: "Safari",  rx: /Version\/[\d.]+ Safari/ },
    ];
    for (const b of browsers) {
        if (b.rx.test(userAgent)) return b.name;
    }
    return userAgent.length > 60 ? userAgent.slice(0, 60) + "…" : userAgent;
}

// ── MetaItem ──────────────────────────────────────────────────────────────────
function MetaItem({ icon, label, value }) {
    return (
        <span className="flex items-center gap-1 text-[length:var(--fs-xs)] text-[var(--text-muted)]">
            {icon}
            <span className="text-[var(--text-secondary)]">{label} :</span>
            <span>{value}</span>
        </span>
    );
}

// ── SectionLabel ──────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <div className="text-[length:var(--fs-xs)] font-bold uppercase tracking-widest text-[var(--text-muted)] px-0.5 py-1">
            {children}
        </div>
    );
}

// ── ActiveSessionCard ─────────────────────────────────────────────────────────
function ActiveSessionCard({ session, onRevoke, revoking }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-start gap-3.5 p-3 rounded border border-[var(--color-1)] bg-[var(--opacity-10-color-1)] transition-colors">
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-[var(--color-1)] text-white">
                {clientIcon(session.clientType)}
            </div>

            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <span className="text-[length:var(--fs-sm)] font-semibold text-[var(--text-primary)]">
                    {parseUserAgent(session.userAgent, t("sessions.unknown_browser"))}
                </span>

                <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {session.remoteAddress && (
                        <MetaItem icon={<WifiOutlined style={{ fontSize: 12 }} />} label="IP" value={session.remoteAddress} />
                    )}
                    {session.loginDate && (
                        <MetaItem icon={<ScheduleOutlined style={{ fontSize: 12 }} />} label={t("sessions.label_login")} value={fmtDate(session.loginDate)} />
                    )}
                </div>

                {session.userAgent && (
                    <span className="text-[length:var(--fs-xs)] font-mono text-[var(--text-muted)] truncate">
                        {session.userAgent}
                    </span>
                )}
            </div>

            <button
                className="flex items-center gap-1.5 shrink-0 px-3 h-8 rounded border border-red-500/40 text-red-600 dark:text-red-400 text-[length:var(--fs-xs)] font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-40"
                onClick={() => onRevoke(session)}
                disabled={revoking === session.uuid}
            >
                {revoking === session.uuid
                    ? <Spin size="small" />
                    : <><DeleteOutlined style={{ fontSize: 13 }} /> {t("sessions.revoke")}</>
                }
            </button>
        </div>
    );
}

// ── HistorySessionCard ────────────────────────────────────────────────────────
function HistorySessionCard({ session }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-start gap-3.5 p-3 rounded border border-[var(--card-border)] bg-[var(--surface-subtle)] transition-colors">
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-[var(--card-border)] text-[var(--text-muted)]">
                {clientIcon(session.clientType)}
            </div>

            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <span className="text-[length:var(--fs-sm)] font-semibold text-[var(--text-primary)]">
                    {parseUserAgent(session.userAgent, t("sessions.unknown_browser"))}
                </span>

                <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {session.remoteAddress && (
                        <MetaItem icon={<WifiOutlined style={{ fontSize: 12 }} />} label="IP" value={session.remoteAddress} />
                    )}
                    {session.loginDate && (
                        <MetaItem icon={<ScheduleOutlined style={{ fontSize: 12 }} />} label={t("sessions.label_login")} value={fmtDate(session.loginDate)} />
                    )}
                    {session.logoutDate && (
                        <MetaItem icon={<LogoutOutlined style={{ fontSize: 12 }} />} label={t("sessions.label_logout")} value={fmtDate(session.logoutDate)} />
                    )}
                </div>

                {session.userAgent && (
                    <span className="text-[length:var(--fs-xs)] font-mono text-[var(--text-muted)] truncate">
                        {session.userAgent}
                    </span>
                )}
            </div>
        </div>
    );
}

// ── ActiveSessions ────────────────────────────────────────────────────────────
function ActiveSessions() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [revoking, setRevoking] = useState(null);
    const [revokingAll, setRevokingAll] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        ApiTokenService.listActiveSessions()
            .then(res => {
                if (responseSuccess(res)) setSessions(res.data?.dataList || []);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleRevoke = async (session) => {
        setRevoking(session.sessionUuid);
        try {
            const res = await ApiTokenService.revokeSession(session.sessionUuid);
            if (responseSuccess(res)) {
                notification.success({ message: t("sessions.revoke_success") });
                setSessions(prev => prev.filter(s => s.sessionUuid !== session.sessionUuid));
            } else {
                notification.error({ message: t("sessions.revoke_error") });
            }
        } finally { setRevoking(null); }
    };

    const handleRevokeAll = () => {
        Modal.confirm({
            title: t("sessions.revoke_all_confirm_title"),
            content: t("sessions.revoke_all_confirm_content"),
            okText: t("sessions.revoke_all"),
            okButtonProps: { danger: true },
            cancelText: t("common.cancel"),
            onOk: async () => {
                setRevokingAll(true);
                try {
                    const res = await ApiTokenService.revokeAllSessions();
                    if (responseSuccess(res)) {
                        notification.success({ message: t("sessions.revoke_all_success") });
                        load();
                    } else {
                        notification.error({ message: t("sessions.revoke_all_error") });
                    }
                } finally { setRevokingAll(false); }
            },
        });
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={`${ProfileStyle.borderBottom} p-8 flex items-center justify-between`}>
                <div>
                    <div className={ProfileStyle.section_title}>{t("sessions.active_title")}</div>
                    <div className={ProfileStyle.section_desc}>
                        {t("sessions.active_desc")}
                    </div>
                </div>
                {sessions.length > 0 && (
                    <button
                        className={`${ProfileStyle.btn_ghost} flex items-center gap-1.5 shrink-0`}
                        onClick={handleRevokeAll}
                        disabled={revokingAll}
                    >
                        {revokingAll
                            ? <Spin size="small" />
                            : <><DeleteSweepOutlined style={{ fontSize: 15 }} /> {t("sessions.revoke_all")}</>
                        }
                    </button>
                )}
            </div>

            <div className={ProfileStyle.section_body}>
                {loading ? (
                    <div className="flex justify-center py-8"><Spin /></div>
                ) : sessions.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-2.5 text-[var(--text-muted)]">
                        <ComputerOutlined style={{ fontSize: 32, opacity: 0.3 }} />
                        <span className="text-[length:var(--fs-sm)] italic">{t("sessions.empty")}</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <SectionLabel>{t("sessions.in_progress", { count: sessions.length })}</SectionLabel>
                        {sessions.map(session => (
                            <ActiveSessionCard
                                key={session.sessionUuid}
                                session={session}
                                onRevoke={handleRevoke}
                                revoking={revoking}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── SessionHistory ────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

function SessionHistory() {
    const { t } = useTranslation();
    const [sessions,  setSessions]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [page,      setPage]      = useState(1);
    const [total,     setTotal]     = useState(0);

    const load = useCallback((p = 1) => {
        setLoading(true);
        ApiTokenService.listSessionHistory(p - 1, PAGE_SIZE)
            .then(res => {
                if (responseSuccess(res)) {
                    setSessions(res.data?.dataList || []);
                    setTotal(res.data?.totalItems ?? res.data?.total ?? 0);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { load(page); }, [load, page]);

    const handlePageChange = (p) => {
        setPage(p);
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={`${ProfileStyle.borderBottom} p-8`}>
                <div className={ProfileStyle.section_title}>{t("sessions.history_title")}</div>
                <div className={ProfileStyle.section_desc}>
                    {t("sessions.history_desc")}
                </div>
            </div>

            <div className={ProfileStyle.section_body}>
                {loading ? (
                    <div className="flex justify-center py-8"><Spin /></div>
                ) : sessions.length === 0 ? (
                    <div className="flex flex-col items-center py-10 gap-2.5 text-[var(--text-muted)]">
                        <ComputerOutlined style={{ fontSize: 32, opacity: 0.3 }} />
                        <span className="text-[length:var(--fs-sm)] italic">{t("sessions.history_empty")}</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            {sessions.map(session => (
                                <HistorySessionCard key={session.sessionUuid} session={session} />
                            ))}
                        </div>

                        {total > PAGE_SIZE && (
                            <div className="flex justify-center pt-2">
                                <Pagination
                                    current={page}
                                    total={total}
                                    pageSize={PAGE_SIZE}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    size="small"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SessionsManager() {
    return (
        <>
            <ActiveSessions />
            <SessionHistory />
        </>
    );
}
