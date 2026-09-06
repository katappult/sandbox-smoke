import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {Modal, Spin, Tabs, message} from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { GroupAdminService } from "@/services/GroupAdmin.service";
import { PermissionAdminService } from "@/services/PermissionAdmin.service";
import { UserService } from "@/services/User.services";
import { responseSuccess } from "@/utils";
import ProfileStyle from "@/styles/pages/Profile.module.css";
import UserDrawerStyle from "@/styles/components/UserDrawer.module.css";

// ── Helpers ───────────────────────────────────────────────────────
function userName(user) { return user.nickName || user.login || user.email || "—"; }
function userSub(user)  { return user.login || user.email || ""; }

// ── Panneau gauche : liste des groupes ───────────────────────────
function GroupsList({ groups, selectedId, onSelect, onDelete, loading }) {
    const { t } = useTranslation();

    const handleDelete = (e, group) => {
        e.stopPropagation();
        Modal.confirm({
            title: t("groups.delete_title"),
            content: t("groups.delete_confirm", { name: group.name }),
            okText: t("groups.delete_btn"),
            okButtonProps: { danger: true },
            cancelText: t("common.cancel"),
            onOk: () => onDelete(group),
        });
    };

    return (
        <div className="w-[220px] shrink-0 flex flex-col gap-1 h-full overflow-y-auto scroll-thin">
            <div className="px-1 pb-2">
                <div className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    {t("groups.title")}
                </div>
            </div>

            {loading
                ? <div className="flex justify-center p-6"><Spin /></div>
                : groups.length === 0
                    ? <div className="text-[var(--text-muted)] text-sm px-1 py-2">{t("groups.empty")}</div>
                    : groups.map(group => (
                        <div
                            key={group.uid}
                            onClick={() => onSelect(group)}
                            className={`group/item flex items-center justify-between p-[10px_12px] rounded-[var(--radius-sm)] border cursor-pointer duration-[120ms] ${
                                selectedId === group.uid
                                    ? "border-[var(--color-1)] bg-[var(--opacity-10-color-1)]"
                                    : "border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--color-1)/40]"
                            }`}
                        >
                            <span className={`text-sm font-semibold truncate flex-1 min-w-0 ${selectedId === group.uid ? "text-[var(--color-1)]" : "text-[var(--text-primary)]"}`}>
                                {group.name}
                            </span>
                            <button
                                onClick={(e) => handleDelete(e, group)}
                                title={t("groups.delete_btn")}
                                className="flex items-center justify-center w-6 h-6 rounded-md ml-1 shrink-0 border-0 outline-none cursor-pointer transition-all duration-[120ms] bg-transparent text-[var(--text-muted)] opacity-0 group-hover/item:opacity-100 hover:bg-red-500/10 hover:text-red-500"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                            </button>
                        </div>
                    ))
            }
        </div>
    );
}

// ── Onglet Membres ────────────────────────────────────────────────
function MembersTab({ group }) {
    const { t } = useTranslation();
    const [users, setUsers]         = useState([]);
    const [loading, setLoading]     = useState(false);
    const [removing, setRemoving]   = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const load = useCallback(() => {
        if (!group) return;
        setLoading(true);
        GroupAdminService.getMembers(group.uid)
            .then(res => {
                if (responseSuccess(res)) setUsers(res.data?.dataList || []);
            })
            .finally(() => setLoading(false));
    }, [group]);

    useEffect(() => { load(); }, [load]);

    const handleRemove = async (user) => {
        setRemoving(user.uid);
        try {
            const res = await GroupAdminService.removeMember(group.uid, user.uid);
            if (responseSuccess(res)) {
                setUsers(prev => prev.filter(u => u.uid !== user.uid));
            } else {
                message.error({ message: t("groups.remove_error") });
            }
        } finally { setRemoving(null); }
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={`${ProfileStyle.borderBottom} p-4 flex flex-row items-center justify-between`}>
                <div className={ProfileStyle.section_title}>{t("groups.members_title")}</div>
                <button className={`${ProfileStyle.btn_ghost} shrink-0`} onClick={() => setModalOpen(true)}>
                    {t("groups.members_add")}
                </button>
            </div>
            <div className={ProfileStyle.section_body}>
                {loading
                    ? <div className="flex justify-center p-6"><Spin /></div>
                    : users.length === 0
                        ? <div className="text-[var(--text-muted)] text-sm italic">{t("groups.members_empty")}</div>
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
                                                <span className="text-sm font-semibold text-[var(--text-primary)]">{userName(user)}</span>
                                                {userSub(user) !== userName(user) && (
                                                    <span className="text-xs text-[var(--text-muted)]">{userSub(user)}</span>
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

            <AddUsersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                group={group}
                assignedUsers={users}
                onAdded={(added) => setUsers(prev => [...prev, ...added])}
            />
        </div>
    );
}

// ── Onglet Permissions ────────────────────────────────────────────
function PermissionsTab({ group }) {
    const { t } = useTranslation();
    const [permissions, setPermissions]   = useState([]);
    const [loading, setLoading]           = useState(false);
    const [removing, setRemoving]         = useState(null);
    const [modalOpen, setModalOpen]       = useState(false);

    const load = useCallback(() => {
        if (!group) return;
        setLoading(true);
        GroupAdminService.getPermissions(group.uid)
            .then(res => {
                if (responseSuccess(res)) setPermissions(res.data?.dataList || []);
            })
            .finally(() => setLoading(false));
    }, [group]);

    useEffect(() => { load(); }, [load]);

    const handleRemove = async (perm) => {
        setRemoving(perm.uid);
        try {
            const res = await GroupAdminService.removePermission(group.uid, perm.uid);
            if (responseSuccess(res)) {
                setPermissions(prev => prev.filter(p => p.uid !== perm.uid));
            } else {
                message.error({ message: t("groups.remove_error") });
            }
        } finally { setRemoving(null); }
    };

    return (
        <div className={ProfileStyle.section}>
            <div className={`${ProfileStyle.borderBottom} p-4 flex flex-row items-center justify-between`}>
                <div className={ProfileStyle.section_title}>{t("groups.permissions_title")}</div>
                <button className={`${ProfileStyle.btn_ghost} shrink-0`} onClick={() => setModalOpen(true)}>
                    {t("groups.permissions_add")}
                </button>
            </div>
            <div className={ProfileStyle.section_body}>
                {loading
                    ? <div className="flex justify-center p-6"><Spin /></div>
                    : permissions.length === 0
                        ? <div className="text-[var(--text-muted)] text-sm italic">{t("groups.permissions_empty")}</div>
                        : (
                            <div className="flex flex-col gap-2">
                                {permissions.map(perm => (
                                    <div
                                        key={perm.uid}
                                        className="flex items-center justify-between p-[10px_14px] rounded-[var(--radius-sm)] border border-[var(--card-border)] bg-[var(--surface-subtle)] gap-3"
                                    >
                                        <div className="flex flex-col gap-px min-w-0">
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{perm.name || perm.key}</span>
                                            {perm.key && perm.name && (
                                                <span className="text-xs text-[var(--text-muted)] font-mono">{perm.key}</span>
                                            )}
                                        </div>
                                        <button
                                            className={`${UserDrawerStyle.btn_danger} !w-auto px-[14px] h-8 shrink-0`}
                                            onClick={() => handleRemove(perm)}
                                            disabled={removing === perm.uid}
                                        >
                                            {removing === perm.uid ? <Spin size="small" /> : t("common.remove")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                }
            </div>

            <AddPermissionsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                group={group}
                assignedPermissions={permissions}
                onAdded={(added) => setPermissions(prev => [...prev, ...added])}
            />
        </div>
    );
}

// ── Panneau droit ─────────────────────────────────────────────────
function GroupDetail({ group, onRenamed, allGroups }) {
    const { t } = useTranslation();
    const [editing, setEditing]   = useState(false);
    const [name, setName]         = useState("");
    const [saving, setSaving]     = useState(false);
    const inputRef                = useRef(null);

    useEffect(() => {
        setEditing(false);
        setName(group?.name || "");
    }, [group?.uid]);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    if (!group) return (
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">
            {t("groups.select_prompt")}
        </div>
    );

    const trimmed     = name.trim();
    const newKey      = trimmed.toLowerCase().replace(/\s+/g, "-");
    const others      = allGroups.filter(g => g.uid !== group.uid);
    const dupName     = trimmed && trimmed !== group.name && others.some(g => g.name.trim().toLowerCase() === trimmed.toLowerCase());
    const dupKey      = trimmed && trimmed !== group.name && others.some(g => (g.internalKey || g.groupId || "").toLowerCase() === newKey);
    const renameError = dupName ? t("groups.rename_dup_name")
        : dupKey  ? t("groups.rename_dup_key")
            : null;

    const handleRename = async () => {
        if (!trimmed || trimmed === group.name) { setEditing(false); return; }
        if (renameError) return;
        setSaving(true);
        try {
            const res = await GroupAdminService.updateGroup(group.uid, {
                name: trimmed,
                internalKey: newKey,
                groupId: newKey,
            });
            if (responseSuccess(res)) {
                onRenamed(group.uid, trimmed, newKey);
                setEditing(false);
            }
        } finally { setSaving(false); }
    };

    return (
        <div className="flex-1 min-w-0 overflow-y-auto scroll-thin">
            <div className="mb-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    {editing ? (
                        <>
                            <input
                                ref={inputRef}
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleRename();
                                    if (e.key === "Escape") { setEditing(false); setName(group.name); }
                                }}
                                className={`text-lg font-bold text-[var(--text-primary)] border rounded-[var(--radius-sm)] px-2 py-1 outline-none bg-[var(--input-bg)] flex-1 min-w-0 ${
                                    renameError ? "border-red-400" : "border-[var(--color-1)]"
                                }`}
                            />
                            <button
                                onClick={handleRename}
                                disabled={saving || !!renameError}
                                className="flex items-center justify-center w-7 h-7 rounded-md border-0 outline-none cursor-pointer bg-[var(--color-1)] text-white transition-all duration-[120ms] hover:opacity-80 disabled:opacity-50"
                            >
                                {saving
                                    ? <Spin size="small" />
                                    : <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check</span>
                                }
                            </button>
                            <button
                                onClick={() => { setEditing(false); setName(group.name); }}
                                disabled={saving}
                                className="flex items-center justify-center w-7 h-7 rounded-md border border-[var(--card-border)] outline-none cursor-pointer bg-transparent text-[var(--text-muted)] transition-all duration-[120ms] hover:bg-[var(--surface-hover)]"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-lg font-bold text-[var(--text-primary)]">{group.name}</span>
                            <button
                                onClick={() => { setName(group.name); setEditing(true); }}
                                title={t("groups.rename_btn")}
                                className="flex items-center justify-center w-6 h-6 rounded-md border-0 outline-none cursor-pointer bg-transparent text-[var(--text-muted)] transition-all duration-[120ms] hover:bg-[var(--surface-hover)] hover:text-[var(--color-1)]"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                            </button>
                        </>
                    )}
                </div>
                {editing && renameError && (
                    <span className="text-xs text-red-500 font-medium">{renameError}</span>
                )}
            </div>
            <Tabs
                items={[
                    { key: "members",     label: t("groups.members_title"),     children: <MembersTab group={group} /> },
                    { key: "permissions", label: t("groups.permissions_title"), children: <PermissionsTab group={group} /> },
                ]}
            />
        </div>
    );
}

// ── Modal ajout de membres ────────────────────────────────────────
function AddUsersModal({ open, onClose, group, assignedUsers, onAdded }) {
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
        loadUsers();
    }, [open]);

    useEffect(() => {
        if(search){
            setLoadingUsers(true);
            loadUsers();
        }
    }, [search]);

    const loadUsers = () => {
        UserService.listCustomUsers(0, "", 20)
            .then(res => {
                if (responseSuccess(res)) setAllUsers(res.data?.dataList || []);
            })
            .finally(() => setLoadingUsers(false));
    }

    const assignedIds = new Set(assignedUsers.map(u => String(u.uid)));
    const available = allUsers.filter(u => {
        if (assignedIds.has(String(u.uid))) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return userName(u).toLowerCase().includes(q) || userSub(u).toLowerCase().includes(q);
    });

    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleSave = async () => {
        if (selected.length === 0) return;
        setSaving(true);
        try {
            const results = await Promise.all(selected.map(id => GroupAdminService.addMember(group.uid, id)));
            const ok = results.every(res => responseSuccess(res));
            if (ok) {
                const added = allUsers.filter(u => selected.includes(u.uid));
                onAdded(added);
                onClose();
            } else {
                message.error({ message: t("common.assign_error") });
            }
        } finally { setSaving(false); }
    };

    return (
        <Modal open={open} onCancel={onClose} title={t("groups.add_members_title", { name: group?.name })} destroyOnClose footer={null} width={560}>
            <div className="flex flex-col gap-4">
                <div className={`${UserDrawerStyle.search_bar} max-w-full`}>
                    <SearchOutlined className="text-[var(--text-muted)] text-base" />
                    <input className={UserDrawerStyle.search_input} placeholder={t("groups.search_placeholder")} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="max-h-[360px] overflow-y-auto flex flex-col gap-1.5">
                    {loadingUsers
                        ? <div className="flex justify-center p-6"><Spin /></div>
                        : available.length === 0
                            ? <div className="text-[var(--text-muted)] text-sm italic py-2">{t("common.no_users_available")}</div>
                            : available.map(user => {
                                const checked = selected.includes(user.uid);
                                return (
                                    <label key={user.uid} className={`flex items-center gap-2.5 p-[9px_12px] rounded-[var(--radius-sm)] border cursor-pointer transition-[border-color,background] duration-[120ms] ${checked ? "border-[var(--color-1)] bg-[var(--opacity-10-color-1)]" : "border-[var(--card-border)] bg-[var(--surface-subtle)]"}`}>
                                        <input type="checkbox" checked={checked} onChange={() => toggle(user.uid)} className="shrink-0 accent-[var(--color-1)]" />
                                        <div className={`${UserDrawerStyle.avatar} w-7 h-7 text-xs shrink-0`}>{userName(user).charAt(0).toUpperCase()}</div>
                                        <div className="flex flex-col gap-px">
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{userName(user)}</span>
                                            {userSub(user) !== userName(user) && <span className="text-xs text-[var(--text-muted)]">{userSub(user)}</span>}
                                        </div>
                                    </label>
                                );
                            })
                    }
                </div>
                <div className="flex justify-end gap-2.5 pt-1 border-t border-[var(--card-border)]">
                    <button className={ProfileStyle.btn_ghost} onClick={onClose} disabled={saving}>{t("common.cancel")}</button>
                    <button className={ProfileStyle.btn_primary} onClick={handleSave} disabled={selected.length === 0 || saving}>
                        {saving ? <Spin size="small" /> : t("common.add_count", { count: selected.length })}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Modal ajout de permissions ────────────────────────────────────
function AddPermissionsModal({ open, onClose, group, assignedPermissions, onAdded }) {
    const { t } = useTranslation();
    const [allPerms, setAllPerms]         = useState([]);
    const [search, setSearch]             = useState("");
    const [selected, setSelected]         = useState([]);
    const [loadingPerms, setLoadingPerms] = useState(false);
    const [saving, setSaving]             = useState(false);

    useEffect(() => {
        if (!open) return;
        setSearch("");
        setSelected([]);
        setLoadingPerms(true);
        PermissionAdminService.listPermissions()
            .then(res => {
                if (responseSuccess(res)) setAllPerms(res.data?.dataList || []);
            })
            .finally(() => setLoadingPerms(false));
    }, [open]);

    const assignedIds = new Set(assignedPermissions.map(p => String(p.uid)));
    const available = allPerms.filter(p => {
        if (assignedIds.has(String(p.uid))) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (p.name || "").toLowerCase().includes(q) || (p.key || "").toLowerCase().includes(q);
    });

    const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleSave = async () => {
        if (selected.length === 0) return;
        setSaving(true);
        try {
            const results = await Promise.all(selected.map(id => GroupAdminService.addPermission(group.uid, id)));
            const ok = results.every(res => responseSuccess(res));
            if (ok) {
                const added = allPerms.filter(p => selected.includes(p.uid));
                onAdded(added);
                onClose();
            } else {
                message.error({ message: t("common.assign_error") });
            }
        } finally { setSaving(false); }
    };

    return (
        <Modal open={open} onCancel={onClose} title={t("groups.add_permissions_title", { name: group?.name })} destroyOnClose footer={null} width={560}>
            <div className="flex flex-col gap-4">
                <div className={`${UserDrawerStyle.search_bar} max-w-full`}>
                    <SearchOutlined className="text-[var(--text-muted)] text-base" />
                    <input className={UserDrawerStyle.search_input} placeholder={t("groups.search_permission")} value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="max-h-[360px] overflow-y-auto flex flex-col gap-1.5">
                    {loadingPerms
                        ? <div className="flex justify-center p-6"><Spin /></div>
                        : available.length === 0
                            ? <div className="text-[var(--text-muted)] text-sm italic py-2">{t("groups.no_permissions")}</div>
                            : available.map(perm => {
                                const checked = selected.includes(perm.uid);
                                return (
                                    <label key={perm.uid} className={`flex items-center gap-2.5 p-[9px_12px] rounded-[var(--radius-sm)] border cursor-pointer transition-[border-color,background] duration-[120ms] ${checked ? "border-[var(--color-1)] bg-[var(--opacity-10-color-1)]" : "border-[var(--card-border)] bg-[var(--surface-subtle)]"}`}>
                                        <input type="checkbox" checked={checked} onChange={() => toggle(perm.uid)} className="shrink-0 accent-[var(--color-1)]" />
                                        <div className="flex flex-col gap-px">
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{perm.name || perm.key}</span>
                                        </div>
                                    </label>
                                );
                            })
                    }
                </div>
                <div className="flex justify-end gap-2.5 pt-1 border-t border-[var(--card-border)]">
                    <button className={ProfileStyle.btn_ghost} onClick={onClose} disabled={saving}>{t("common.cancel")}</button>
                    <button className={ProfileStyle.btn_primary} onClick={handleSave} disabled={selected.length === 0 || saving}>
                        {saving ? <Spin size="small" /> : t("common.add_count", { count: selected.length })}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Modal création de groupe ──────────────────────────────────────
function CreateGroupModal({ open, onClose, onCreated, existingGroups }) {
    const { t } = useTranslation();
    const [name, setName]     = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (open) setName(""); }, [open]);

    const trimmed     = name.trim();
    const internalKey = trimmed.toLowerCase().replace(/\s+/g, "-");
    const dupName     = trimmed && existingGroups.some(g => g.name.trim().toLowerCase() === trimmed.toLowerCase());
    const dupKey      = trimmed && existingGroups.some(g => (g.internalKey || g.groupId || "").toLowerCase() === internalKey);
    const error       = dupName ? t("groups.rename_dup_name")
        : dupKey  ? t("groups.rename_dup_key")
            : null;

    const handleSave = async () => {
        if (!trimmed || error) return;
        setSaving(true);
        try {
            const response = await GroupAdminService.createGroup({
                name: trimmed,
                internalKey,
                groupId: internalKey,
            });

            if (responseSuccess(response)) {
                onCreated(response.data);
                onClose();
            } else {
                message.error({ message: t("groups.create_error") });
            }
        } finally { setSaving(false); }
    };

    return (
        <Modal open={open} onCancel={onClose} title={t("groups.create_modal_title")} destroyOnClose footer={null} width={420}>
            <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-[var(--text-primary)]">{t("groups.create_name_label")}</label>
                    <input
                        autoFocus
                        className={`form_input ${error ? "!border-red-400 focus:!border-red-500" : ""}`}
                        placeholder={t("groups.create_placeholder")}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
                    />
                    {error && (
                        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
                    )}
                </div>
                <div className="flex justify-end gap-2.5 pt-1 border-t border-[var(--card-border)]">
                    <button className={ProfileStyle.btn_ghost} onClick={onClose} disabled={saving}>{t("common.cancel")}</button>
                    <button className={ProfileStyle.btn_primary} onClick={handleSave} disabled={!trimmed || !!error || saving}>
                        {saving ? <Spin size="small" /> : t("common.create")}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Composant principal ──────────────────────────────────────────
export default function Groups({ externalCreateOpen, onExternalCreateClose }) {
    const { t } = useTranslation();
    const [groups, setGroups]               = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [createOpen, setCreateOpen]       = useState(false);

    // Sync with external open trigger (button in page header)
    useEffect(() => {
        if (externalCreateOpen) setCreateOpen(true);
    }, [externalCreateOpen]);

    const handleCreateClose = () => {
        setCreateOpen(false);
        onExternalCreateClose?.();
    };

    useEffect(() => {
        loadAllGroups();
    }, []);

    const loadAllGroups = async() => {
        GroupAdminService.listGroups()
            .then(res => {
                if (responseSuccess(res)) {
                    const list = res.data?.dataList || [];
                    setGroups(list);
                    if (list.length > 0) setSelectedGroup(list[0]);
                }
            })
            .finally(() => setLoadingGroups(false));
    };

    const handleCreated = (group) => {
        loadAllGroups().then(() => {
            setSelectedGroup(group);
        });
    };

    const handleDelete = async (group) => {
        const response = await GroupAdminService.deleteGroup(group.uid);
        if (responseSuccess(response)) {
            message.success(t("groups.deleted"));
            setGroups(prev => {
                const next = prev.filter(g => g.uid !== group.uid);
                if (selectedGroup?.uid === group.uid) setSelectedGroup(next[0] || null);
                return next;
            });
        } else {
            message.error(t("groups.delete_error"));
        }
    };

    const handleRenamed = (groupId, newName, newKey) => {
        setGroups(prev => prev.map(g => g.uid === groupId ? { ...g, name: newName, internalKey: newKey, groupId: newKey } : g));
        setSelectedGroup(prev => prev?.uid === groupId ? { ...prev, name: newName, internalKey: newKey, groupId: newKey } : prev);
    };

    return (
        <div className="flex gap-6 h-full">
            <GroupsList
                groups={groups}
                selectedId={selectedGroup?.uid}
                onSelect={setSelectedGroup}
                onDelete={handleDelete}
                loading={loadingGroups}
            />
            <GroupDetail group={selectedGroup} onRenamed={handleRenamed} allGroups={groups} />
            <CreateGroupModal open={createOpen} onClose={handleCreateClose} onCreated={handleCreated} existingGroups={groups} />
        </div>
    );
}
