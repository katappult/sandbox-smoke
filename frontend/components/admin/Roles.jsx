import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Spin, notification } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { RoleService } from "@/services/Role.service";
import { UserService } from "@/services/User.services";
import { responseSuccess } from "@/utils";
import ProfileStyle from "@/styles/pages/Profile.module.css";
import UserDrawerStyle from "@/styles/components/UserDrawer.module.css";

// ── Helpers ───────────────────────────────────────────────────────
function userName(user) { return user.nickName || user.login || user.email || "—"; }
function userSub(user)  { return user.login || user.email || ""; }

// ── Panneau gauche : liste des rôles ─────────────────────────────
function RolesList({ roles, selectedId, onSelect, loading }) {
    const { t } = useTranslation();
    return (
        <div className="w-[220px] shrink-0 flex flex-col gap-1 h-full overflow-y-auto scroll-thin">
            <div className="px-1 pb-2">
                <div className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    {t("roles.title")}
                </div>
            </div>
            {loading
                ? <div className="flex justify-center p-6"><Spin /></div>
                : roles.length === 0
                    ? <div className="text-[var(--text-muted)] text-sm px-1 py-2">{t("roles.empty")}</div>
                    : roles.map(role => (
                        <div
                            key={role.uid}
                            onClick={() => onSelect(role)}
                            className={`flex flex-col gap-0.5 p-[10px_12px] rounded-[var(--radius-sm)] border cursor-pointer duration-[120ms] ${
                                selectedId === role.uid
                                    ? "border-[var(--color-1)] bg-[var(--opacity-10-color-1)]"
                                    : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--color-1)/40]"
                            }`}
                        >
                            <span className={`text-sm font-semibold truncate ${selectedId === role.uid ? "text-[var(--color-1)]" : "text-[var(--text-primary)]"}`}>
                                {role.name}
                            </span>
                            {role.key && (
                                <span className="text-xs text-[var(--text-muted)] font-mono truncate">
                                    {role.key}
                                </span>
                            )}
                        </div>
                    ))
            }
        </div>
    );
}

// ── Panneau droit : utilisateurs du rôle sélectionné ─────────────
function UsersPanel({ role }) {
    const { t } = useTranslation();
    const [users, setUsers]         = useState([]);
    const [loading, setLoading]     = useState(false);
    const [removing, setRemoving]   = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const load = useCallback(() => {
        if (!role) return;
        setLoading(true);
        RoleService.getMembers(role.uid)
            .then(res => {
                if (responseSuccess(res)) setUsers(res.data?.dataList || []);
            })
            .finally(() => setLoading(false));
    }, [role]);

    useEffect(() => { load(); }, [load]);

    const handleRemove = async (user) => {
        setRemoving(user.uid);
        try {
            const res = await RoleService.removeMember(role.uid, user.uid);
            if (responseSuccess(res)) {
                setUsers(prev => prev.filter(u => u.uid !== user.uid));
                notification.success({ message: t("roles.remove_success") });
            } else {
                notification.error({ message: t("roles.remove_error") });
            }
        } finally { setRemoving(null); }
    };

    const handleAdded = (newUsers) => {
        setUsers(prev => [...prev, ...newUsers]);
    };

    if (!role) return (
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">
            {t("roles.select_prompt")}
        </div>
    );

    return (
        <div className="flex-1 min-w-0 overflow-y-auto scroll-thin">
            <div className={ProfileStyle.section}>
                <div className={`${ProfileStyle.borderBottom} p-4  flex flex-row items-center justify-between`}>
                    <div className={ProfileStyle.section_title}>{role.name}</div>
                    <button className={`${ProfileStyle.btn_primary} shrink-0`} onClick={() => setModalOpen(true)}>
                        {t("roles.add_users")}
                    </button>
                </div>

                <div className={ProfileStyle.section_body}>
                    {loading
                        ? <div className="flex justify-center p-6"><Spin /></div>
                        : users.length === 0
                            ? <div className="text-[var(--text-muted)] text-sm italic">
                                {t("roles.no_users")}
                            </div>
                            : (
                                <div className="flex flex-col gap-2">
                                    {users.map(user => (
                                        <div
                                            key={user.uid}
                                            className="flex items-center justify-between p-[10px_14px] rounded-[var(--radius-sm)] border border-[var(--card-border)] bg-[var(--surface-subtle)] gap-3"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`${UserDrawerStyle.avatar} w-8 h-8 text-xs shrink-0`}>
                                                    {userName(user).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col gap-px min-w-0">
                                                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                                                        {userName(user)}
                                                    </span>
                                                    {userSub(user) !== userName(user) && (
                                                        <span className="text-xs text-[var(--text-muted)]">
                                                            {userSub(user)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className={`${UserDrawerStyle.btn_danger} !w-auto px-[14px] h-8 shrink-0`}
                                                onClick={() => handleRemove(user)}
                                                disabled={removing === user.uid}
                                            >
                                                {removing === user.uid ? <Spin size="small" /> : t("common.remove")}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                    }
                </div>
            </div>

            <AddUsersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                role={role}
                assignedUsers={users}
                onAdded={handleAdded}
            />
        </div>
    );
}

// ── Modal d'ajout d'utilisateurs ─────────────────────────────────
function AddUsersModal({ open, onClose, role, assignedUsers, onAdded }) {
    const { t } = useTranslation();
    const [allUsers, setAllUsers]         = useState([]);
    const [search, setSearch]             = useState("");
    const [selected, setSelected]         = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [saving, setSaving]             = useState(false);

    useEffect(() => {
        if (!open) return;
        setSearch("");
        setSelected([]);
        setLoadingUsers(true);
        UserService.listCustomUsers(0, "", 200)
            .then(res => {
                if (responseSuccess(res)) setAllUsers(res.data?.dataList || []);
            })
            .finally(() => setLoadingUsers(false));
    }, [open]);


    useEffect(() => {
        if(search){
            setLoadingUsers(true);
            UserService.listCustomUsers(0, "", 200)
                .then(res => {
                    if (responseSuccess(res)) setAllUsers(res.data?.dataList || []);
                })
                .finally(() => setLoadingUsers(false));
        }
    }, [search]);

    const assignedIds = new Set(assignedUsers.map(u => String(u.uid)));

    const available = allUsers.filter(u => {
        if (assignedIds.has(String(u.uid))) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return userName(u).toLowerCase().includes(q) || userSub(u).toLowerCase().includes(q);
    });

    const toggle = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        if (selected.length === 0) return;
        setSaving(true);
        try {
            const results = await Promise.all(
                selected.map(accountId => RoleService.addMember(role.uid, accountId))
            );
            const ok = results.every(res => responseSuccess(res));
            if (ok) {
                const added = allUsers.filter(u => selected.includes(u.uid));
                notification.success({ message: t("roles.added_count", { count: added.length }) });
                onAdded(added);
                onClose();
            } else {
                notification.error({ message: t("common.assign_error") });
            }
        } finally { setSaving(false); }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={t("roles.add_modal_title", { name: role?.name })}
            destroyOnClose
            footer={null}
            width={560}
        >
            <div className="flex flex-col gap-4">
                <div className={`${UserDrawerStyle.search_bar} max-w-full`}>
                    <SearchOutlined className="text-[var(--text-muted)] text-base" />
                    <input
                        className={UserDrawerStyle.search_input}
                        placeholder={t("users.search_placeholder")}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-[360px] overflow-y-auto flex flex-col gap-1.5">
                    {loadingUsers
                        ? <div className="flex justify-center p-6"><Spin /></div>
                        : available.length === 0
                            ? <div className="text-[var(--text-muted)] text-sm italic py-2">
                                {t("common.no_users_available")}
                            </div>
                            : available.map(user => {
                                const checked = selected.includes(user.uid);
                                return (
                                    <label
                                        key={user.uid}
                                        className={`flex items-center gap-2.5 p-[9px_12px] rounded-[var(--radius-sm)] border cursor-pointer transition-[border-color,background] duration-[120ms] ${
                                            checked
                                                ? "border-[var(--color-1)] bg-[var(--opacity-10-color-1)]"
                                                : "border-[var(--card-border)] bg-[var(--surface-subtle)]"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggle(user.uid)}
                                            className="shrink-0 accent-[var(--color-1)]"
                                        />
                                        <div className={`${UserDrawerStyle.avatar} w-7 h-7 text-xs shrink-0`}>
                                            {userName(user).charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col gap-px">
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                                                {userName(user)}
                                            </span>
                                            {userSub(user) !== userName(user) && (
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    {userSub(user)}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                );
                            })
                    }
                </div>

                <div className="flex justify-end gap-2.5 pt-1 border-t border-[var(--card-border)]">
                    <button className={ProfileStyle.btn_ghost} onClick={onClose} disabled={saving}>
                        {t("common.cancel")}
                    </button>
                    <button className={ProfileStyle.btn_primary} onClick={handleSave} disabled={selected.length === 0 || saving}>
                        {saving ? <Spin size="small" /> : t("common.add_count", { count: selected.length })}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Composant principal ──────────────────────────────────────────
export default function Roles() {
    const [roles, setRoles]               = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        RoleService.listRoles()
            .then(res => {
                if (responseSuccess(res)) {
                    const list = res.data?.dataList || [];
                    setRoles(list);
                    if (list.length > 0) setSelectedRole(list[0]);
                }
            })
            .finally(() => setLoadingRoles(false));
    }, []);

    return (
        <div className="flex gap-6 h-full">
            <RolesList
                roles={roles}
                selectedId={selectedRole?.uid}
                onSelect={setSelectedRole}
                loading={loadingRoles}
            />
            <UsersPanel role={selectedRole} />
        </div>
    );
}
