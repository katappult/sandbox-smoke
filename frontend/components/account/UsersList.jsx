import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Alert, Badge, Spin, Table, Select} from "antd";
import {
    LockOutlined as LockMui,
    LockOpenOutlined,
    EmailOutlined,
    CheckCircleOutlined,
    BlockOutlined,
    SearchOutlined,
} from "@mui/icons-material";
import { UserService } from "@/services/User.services";
import { dateFromTimeStamp, paginationItemRender, responseSuccess, toThumbFullURL } from "@/utils";
import BackOfficeStyle from "@/styles/pages/BackOfficeStyle.module.css";
import s from "@/styles/pages/Profile.module.css";
import u from "@/styles/components/UserDrawer.module.css";
import BackButton from "@/components/common/BackButton";

const DEFAULT_PAGE_SIZE = 10;

// ── Avatar ──────────────────────────────────────────────────────
function UserAvatar({ nickName, profilePicture, size = 32 }) {
    const initial = nickName ? nickName.charAt(0).toUpperCase() : "?";
    return (
        <div className={u.avatar} style={{ width: size, height: size, fontSize: size * 0.4 }}>
            {profilePicture
                ? <img src={toThumbFullURL(profilePicture, 150)} alt={initial} />
                : initial
            }
        </div>
    );
}

// ── Status badge ─────────────────────────────────────────────────
function StatusBadge({ locked }) {
    const { t } = useTranslation();
    return locked
        ? <span className={`${u.status_badge} ${u.status_locked}`}><LockMui style={{ fontSize: 11 }} /> {t("users.status_locked")}</span>
        : <span className={`${u.status_badge} ${u.status_active}`}><CheckCircleOutlined style={{ fontSize: 11 }} /> {t("users.status_active")}</span>;
}

// ── Detail view (profil admin) ────────────────────────────────────
function UserDetail({ data, userId, onBack, onLockChange }) {
    const { t } = useTranslation();
    const [locked,     setLocked]     = useState(data?.locked || false);
    const [roles,      setRoles]      = useState([]);
    const [allRoles,   setAllRoles]   = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [acting,     setActing]     = useState(false);
    const [roleActing, setRoleActing] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        setLoading(true);

        Promise.all([
            UserService.roles(userId),
            UserService.getSelectableRoles(),
        ]).then(([rolesRes, allRolesRes]) => {
            if (responseSuccess(rolesRes)) {
                setRoles(rolesRes.data?.dataList || []);
            }
            if (responseSuccess(allRolesRes)) {
                setAllRoles(allRolesRes.data?.dataList || []);
            }
        }).finally(() => setLoading(false));
    }, [userId]);

    const handleAddRole = async () => {
        if (!selectedRole) return;
        setRoleActing(true);
        try {
            const response = await UserService.addRole(userId, selectedRole);
            if (responseSuccess(response)) {
                const added = allRoles.find(role => String(role.uid) === String(selectedRole));
                if (added) setRoles(prev => [...prev, added]);
                setSelectedRole("");
            }
        } finally { setRoleActing(false); }
    };

    const handleRemoveRole = async (roleId) => {
        setRoleActing(true);
        try {
            const res = await UserService.removeRole(userId, roleId);
            if (responseSuccess(res)) {
                setRoles(prev => prev.filter(r => r.uid !== roleId));
            }
        } finally { setRoleActing(false); }
    };

    const handleLock = async () => {
        setActing(true);
        try {
            const res = await UserService.lockUser(userId);
            if (responseSuccess(res)) {
                setLocked(true);
                onLockChange?.(userId, true);
            }
        } finally { setActing(false); }
    };

    const handleUnlock = async () => {
        setActing(true);
        try {
            const res = await UserService.unlockUser(userId);
            if (responseSuccess(res)) {
                setLocked(false);
                onLockChange?.(userId, false);
            }
        } finally { setActing(false); }
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <Spin />
        </div>
    );

    if (!data) return (
        <div style={{ padding: 32, color: "var(--text-secondary)" }}>{t("users.detail_not_found")}</div>
    );

    const nickName = data.nickName;
    const email = data.login;
    const initial = nickName.charAt(0).toUpperCase();

    return (
        <div className={s.page}>

            {/* Bannière compte bloqué */}
            {locked && (
                <div className={u.locked_banner}>
                    <LockMui style={{ fontSize: 16, flexShrink: 0 }} />
                    {t("users.locked_banner")}
                </div>
            )}

            <BackButton onBack={onBack}/>

            {/* Header card */}
            <div className={s.header_card}>
                <div className={s.avatar_wrapper}>
                    <div className={s.avatar}>
                        {data.profilePicture
                            ? <img src={toThumbFullURL(data.profilePicture, 150)} alt={initial} />
                            : initial
                        }
                    </div>
                </div>
                <div className={s.header_info}>
                    <div className={s.header_name}>{nickName}</div>
                    <div className={s.header_email}>{email}</div>
                    <div className={u.meta_row}>
                        {data.joined && (
                            <span className={u.meta_item}>
                                <span className={u.meta_label}>{t("users.col_joined")} : </span>
                                {dateFromTimeStamp(data.joined).toLocaleDateString("fr-FR")}
                            </span>
                        )}
                        {data.lastLogin && (
                            <span className={u.meta_item}>
                                <span className={u.meta_label}>{t("users.col_last_login")} : </span>
                                {dateFromTimeStamp(data.lastLogin).toLocaleDateString("fr-FR")}
                            </span>
                        )}
                    </div>
                    <div className={s.header_badges}>
                        <StatusBadge locked={locked} />
                        {data.twoFactors && <span className={s.badge}>2FA</span>}
                    </div>
                </div>
            </div>

            {/* Rôles */}
            <div className={s.section}>
                <div className={s.section_header}>
                    <div className={s.section_title}>{t("users.roles_title")}</div>
                    <div className={s.section_desc}>{t("users.roles_desc")}</div>
                </div>
                <div className={s.section_body}>
                    {/* Current roles */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 28 }}>
                        {roles.length > 0 ? roles.map((role) => (
                            <span
                                key={role.uid ?? role.name}
                                className={s.badge}
                                style={{ fontSize: 13, padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
                            >
                                {role.name}
                                <button
                                    onClick={() => handleRemoveRole(role.uid)}
                                    disabled={roleActing}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        padding: 0, lineHeight: 1, color: "inherit",
                                        fontSize: 14, fontWeight: 700, opacity: 0.7,
                                    }}
                                    title={t("users.role_remove_title")}
                                >×</button>
                            </span>
                        )) : (
                            <span style={{ fontSize: 13, color: "#98a2b3", fontStyle: "italic" }}>
                                {t("users.roles_none")}
                            </span>
                        )}
                    </div>

                    {/* Add role */}
                    {(() => {
                        const assignedIds = new Set(roles.map(r => String(r.uid)));
                        const available = allRoles.filter(r => !assignedIds.has(String(r.uid)));
                        if (available.length === 0) return null;
                        return (
                            <div className={u.add_role_row}>
                                <Select
                                    style={{width:200}}
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e)}
                                    disabled={roleActing}
                                >
                                    <option value="">{t("users.role_select_placeholder")}</option>
                                    {available.map(r => (
                                        <option key={r.uid} value={r.uid}>{r.name}</option>
                                    ))}
                                </Select>
                                <button
                                    onClick={handleAddRole}
                                    disabled={!selectedRole || roleActing}
                                    className={u.btn_success}
                                    style={{ width: "auto", height: 36, flexShrink: 0 }}
                                >
                                    {roleActing ? "…" : t("users.role_add")}
                                </button>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Actions */}
            <div className={s.section}>
                <div className={s.section_header}>
                    <div className={s.section_title}>{t("users.admin_actions_title")}</div>
                    <div className={s.section_desc}>{t("users.admin_actions_desc")}</div>
                </div>
                <div className={s.section_body}>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                        {locked ? (
                            <button className={u.btn_success} style={{ width: "auto" }} onClick={handleUnlock} disabled={acting}>
                                <LockOpenOutlined style={{ fontSize: 16 }} />
                                {acting ? t("users.in_progress") : t("users.unlock")}
                            </button>
                        ) : (
                            <button className={u.btn_danger} style={{ width: "auto" }} onClick={handleLock} disabled={acting}>
                                <BlockOutlined style={{ fontSize: 16 }} />
                                {acting ? t("users.in_progress") : t("users.lock")}
                            </button>
                        )}
                        <a
                            href={`mailto:${email}`}
                            className={u.btn_ghost}
                            target="_blank"
                            rel="noreferrer"
                            style={{ width: "auto" }}
                        >
                            <EmailOutlined style={{ fontSize: 16 }} />
                            {t("users.send_email")}
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
}

// ── Users table ───────────────────────────────────────────────────
export default function UsersList() {
    const { t } = useTranslation();
    const [users,        setUsers]        = useState([]);
    const [searchTerm,   setSearchTerm]   = useState("");
    const [totalElement, setTotalElement] = useState(0);
    const [isCopied,     setIsCopied]     = useState(false);
    const [selectedId,   setSelectedId]   = useState(null);
    const [currentPage,  setCurrentPage]  = useState(1);

    useEffect(() => {
        fetchUsers(1);
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchUsers = async (page) => {
        const res = await UserService.listUsers(page - 1, searchTerm, DEFAULT_PAGE_SIZE);
        if (!responseSuccess(res)) return;
        const list = res.data.dataList || [];
        setTotalElement(res.data.meta?.totalElements || 0);
        setUsers(list.map((item) => ({
            key:            item.uid,
            uid:             item.uid,
            nickName:       item.nickname,
            login:          item.login,
            twoFactor:      item.twoFactors,
            locked:         item.locked || false,
            profilePicture: item.profilePicture || null,
            joined:         item.joined,
            lastLogin:      item.lastLogin,
        })));
    };

    const handleCopy = (email) => {
        navigator.clipboard.writeText(email);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
    };

    const columns = [
        {
            key: "user",
            title: t("users.col_user"),
            render: (_, r) => (
                <div className={u.user_cell}>
                    <UserAvatar nickName={r.nickName} profilePicture={r.profilePicture} size={34} />
                    <div>
                        <div className={u.user_name}>{r.nickName}</div>
                        <div className={u.user_email}>{r.login}</div>
                    </div>
                </div>
            ),
        },
        {
            key: "locked",
            title: t("users.col_status"),
            width: 110,
            render: (_, r) => r.locked
                ? <span className={`${u.status_cell} ${u.status_cell_locked}`}><LockMui style={{ fontSize: 14 }} /> {t("users.status_locked")}</span>
                : <span className={`${u.status_cell} ${u.status_cell_active}`}><CheckCircleOutlined style={{ fontSize: 14 }} /> {t("users.status_active")}</span>,
        },
        {
            key: "2fa",
            title: "2FA",
            width: 70,
            responsive: ["md"],
            render: (_, r) => (
                <Badge count="2FA" color={r.twoFactor ? "#12b76a" : "#d0d5dd"} style={{ fontSize: 10, fontWeight: 700 }} />
            ),
        },
        {
            key: "joined",
            title: t("users.col_joined"),
            width: 110,
            responsive: ["lg"],
            render: (_, r) => <span className={u.date_cell}>{r.joined ? dateFromTimeStamp(r.joined).toLocaleDateString("fr-FR") : "—"}</span>,
        },
        {
            key: "lastLogin",
            title: t("users.col_last_login"),
            width: 150,
            responsive: ["lg"],
            render: (_, r) => <span className={u.date_cell}>{r.lastLogin ? dateFromTimeStamp(r.lastLogin).toLocaleDateString("fr-FR") : "—"}</span>,
        },
        {
            key: "actions",
            width: 70,
            render: (_, r) => (
                <div className={u.action_cell} onClick={(e) => e.stopPropagation()}>
                    <button className={u.action_btn} onClick={() => handleCopy(r.login)} title={t("users.copy_email_title")}>
                        <img src="/images/copy.svg" alt="copy" width={15} height={15} />
                    </button>
                    <a className={u.action_btn} href={`mailto:${r.login}`} target="_blank" rel="noreferrer" title={t("users.send_email_title")}>
                        <img src="/images/enveloppe.svg" alt="email" width={15} height={15} />
                    </a>
                </div>
            ),
        },
    ];

    const handleLockChange = (id, newLocked) => {
        setUsers(prev => prev.map(u => u.uid === id ? { ...u, locked: newLocked } : u));
        setSelectedId(prev => prev?.uid === id ? { ...prev, locked: newLocked } : prev);
    };

    // Vue détail
    if (selectedId) {
        return <UserDetail userId={selectedId.uid}
                           data={selectedId}
                           onBack={() => setSelectedId(null)}
                           onLockChange={handleLockChange} />;
    }

    // Vue liste
    return (
        <>
            {isCopied && (
                <Alert type="success" message={t("users.email_copied")} banner closable style={{ marginBottom: 12 }} />
            )}

            <div className={u.search_bar}>
                <SearchOutlined style={{ fontSize: 16, color: "#98a2b3" }} />
                <input
                    className={u.search_input}
                    placeholder={t("users.search_placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div style={{ width: "100%", overflowX: "auto" }}>
                <Table
                    dataSource={users}
                    columns={columns}
                    size="middle"
                    scroll={{ y: "calc(100vh - 380px)" }}
                    onRow={(record) => ({
                        onClick: () => setSelectedId(record),
                        style: { cursor: "pointer" },
                    })}
                    rowClassName={() => u.table_row}
                    pagination={{
                        className: BackOfficeStyle.table_pagination,
                        pageSize: DEFAULT_PAGE_SIZE,
                        current: currentPage,
                        total: totalElement,
                        showTotal: (count) => t("users.total", { count }),
                        hideOnSinglePage: false,
                        showSizeChanger: false,
                        position: ["bottomRight"],
                        itemRender: paginationItemRender,
                        onChange: (page) => { setCurrentPage(page); fetchUsers(page); },
                    }}
                />
            </div>
        </>
    );
}
