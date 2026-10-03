import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Drawer, Popconfirm, Segmented, Table} from "antd";
import {useTranslation} from "react-i18next";
import {AnnonceService} from "@/services/generated/Annonce.services";
import {LifecycleService} from "@/services/Lifecycle.service";
import {responseSuccess, notificationError, toThumbFullURL} from "@/utils/Utils";
import {serviceConfig} from "@/services/utils/service.config";
import StatusChip from "@/components/common/lifecycle/StatusChip";
import LifecyclePanel from "@/components/common/lifecycle/LifecyclePanel";
import s from "./AnnonceModeration.module.css";

const ADMIN_ROLES = ["ROLE_ADMIN", "ROLE_SUPERADMIN"];

function hasAdminRole() {
    return serviceConfig.getUserRoles()?.some((role) => ADMIN_ROLES.includes(role));
}

function getAnnonceThumbUrl(item) {
    const attrs = item?.thumbInfo?.attributes;
    if (attrs?.illustration_path_1) {
        return toThumbFullURL(`/${attrs.folder}/${attrs.illustration_path_1}`, 160);
    }
    if (attrs?.illustrationPath1) {
        return toThumbFullURL(`/${attrs.folder}/${attrs.illustrationPath1}`, 160);
    }
    return "/";
}

function ModerationActions({record, onSuccess}) {
    const {t} = useTranslation();
    const [targets, setTargets] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);

    const fullId = record?.lifecycleManaged?.fullId;
    const currentStatus = record?.lifecycleManaged?.lifecycleState;

    useEffect(() => {
        if (!fullId || !currentStatus) return;
        let active = true;

        LifecycleService.statesByAction(fullId, currentStatus, "SET_STATE").then((res) => {
            if (!active) return;
            if (res?.status === 403) {
                notificationError(t("moderation.forbidden"));
                return;
            }
            if (responseSuccess(res)) {
                const stateList = res.data?.attributes?.statesByAction;
                setTargets(stateList ? stateList.split(";") : []);
            }
        });

        return () => {
            active = false;
        };
    }, [fullId, currentStatus, t]);

    const handleTransition = useCallback(async (target) => {
        setActionLoading(true);
        const res = await LifecycleService.setState(fullId, target);
        if (res?.status === 403) {
            notificationError(t("moderation.forbidden"));
        } else if (responseSuccess(res)) {
            onSuccess();
        } else {
            notificationError(t("common.error"));
        }
        setActionLoading(false);
    }, [fullId, onSuccess, t]);

    if (!fullId || !currentStatus || targets.length === 0) {
        return <span>—</span>;
    }

    return (
        <div className={s.action_buttons}>
            {targets.map((target) => {
                const isValidate = target === "VALIDEE";
                const isRefuse = target === "REFUSEE";

                return (
                    <Popconfirm
                        key={target}
                        title={isValidate ? t("moderation.confirm_valider_title") : t("moderation.confirm_refuser_title")}
                        description={t("moderation.confirm_desc", {target})}
                        onConfirm={() => handleTransition(target)}
                        okText={t("common.yes")}
                        cancelText={t("common.no")}
                        placement="top"
                    >
                        <Button
                            size="small"
                            loading={actionLoading}
                            type={isValidate ? "primary" : "default"}
                        >
                            {isValidate ? t("moderation.valider") : isRefuse ? t("moderation.refuser") : target}
                        </Button>
                    </Popconfirm>
                );
            })}
        </div>
    );
}

export default function AnnonceModeration() {
    const {t} = useTranslation();
    const isAdmin = hasAdminRole();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [forbidden, setForbidden] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filterStatus, setFilterStatus] = useState("EN_ATTENTE");

    const [selectedItem, setSelectedItem] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const loadData = useCallback(async () => {
        if (!isAdmin) {
            setForbidden(true);
            return;
        }

        setLoading(true);
        setForbidden(false);

        const response = await AnnonceService.listEntity(pageIndex, pageSize, "", "", filterStatus);

        if (response?.status === 403) {
            setForbidden(true);
            notificationError(t("moderation.forbidden"));
            setLoading(false);
            return;
        }

        const dataList = response?.data?.status === "SUCCESS" ? response.data.dataList ?? [] : [];
        const totalCount = response?.data?.totalCount ?? response?.data?.total ?? response?.data?.paginationInfo?.total ?? dataList.length;

        setItems(dataList);
        setTotal(totalCount);
        setLoading(false);
    }, [isAdmin, pageIndex, pageSize, filterStatus, t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const refresh = useCallback(() => loadData(), [loadData]);

    const handleFilterChange = useCallback((value) => {
        setPageIndex(0);
        setFilterStatus(value);
    }, []);

    const openDrawer = useCallback((item) => {
        setSelectedItem(item);
        setDrawerOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setDrawerOpen(false);
        setSelectedItem(null);
    }, []);

    const columns = useMemo(() => [
        {
            title: t("moderation.col_photo"),
            width: 90,
            render: (_, item) => (
                <img src={getAnnonceThumbUrl(item)} className={s.photo} alt="" />
            ),
        },
        {
            title: t("moderation.col_titre"),
            dataIndex: "titre",
            key: "titre",
            render: (_, item) => item?.titre ?? "—",
        },
        {
            title: t("moderation.col_prix"),
            dataIndex: "prix",
            key: "prix",
            render: (_, item) => item?.prix?.toString() ?? "—",
        },
        {
            title: t("moderation.col_produit"),
            key: "produit",
            render: (_, item) => item?.produit?.titre ?? "—",
        },
        {
            title: t("moderation.col_categorie"),
            key: "categorie",
            render: (_, item) => item?.produit?.categorie?.titre ?? "—",
        },
        {
            title: t("moderation.col_statut"),
            key: "statut",
            render: (_, item) => (
                <StatusChip label={item?.lifecycleManaged?.lifecycleState} large={false} />
            ),
        },
        ...(isAdmin
            ? [{
                title: t("moderation.col_actions"),
                key: "actions",
                render: (_, item) => (
                    <ModerationActions record={item} onSuccess={refresh} />
                ),
            }]
            : []),
    ], [t, isAdmin, refresh]);

    const statusOptions = useMemo(() => [
        {label: t("moderation.filter_all"), value: ""},
        {label: t("moderation.filter_pending"), value: "EN_ATTENTE"},
        {label: t("moderation.filter_validated"), value: "VALIDEE"},
        {label: t("moderation.filter_refused"), value: "REFUSEE"},
    ], [t]);

    const rowKey = useCallback((item) => item?.lifecycleManaged?.fullId || item?.uid || item?.oid, []);

    return (
        <div className={s.wrapper}>
            <div className={s.filter_bar}>
                <Segmented
                    options={statusOptions}
                    value={filterStatus}
                    onChange={handleFilterChange}
                />
            </div>

            {forbidden ? (
                <div className={s.forbidden}>{t("moderation.forbidden")}</div>
            ) : (
                <Table
                    rowKey={rowKey}
                    loading={loading}
                    dataSource={items}
                    columns={columns}
                    scroll={{x: 1200}}
                    pagination={{
                        current: pageIndex + 1,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        showTotal: (count) => t("common.elements_count", {count}),
                        onChange: (page, size) => {
                            setPageIndex(page - 1);
                            setPageSize(size);
                        },
                    }}
                />
            )}

            <Drawer
                open={drawerOpen}
                onClose={closeDrawer}
                title={t("moderation.detail_title")}
                width={520}
            >
                {selectedItem && (
                    <div className={s.drawer_body}>
                        <div className={s.field}>
                            <span className={s.field_label}>{t("moderation.col_titre")}</span>
                            <span className={s.field_value}>{selectedItem.titre ?? "—"}</span>
                        </div>

                        <div className={s.field}>
                            <span className={s.field_label}>{t("moderation.detail_description")}</span>
                            <span className={s.field_value}>{selectedItem.description ?? "—"}</span>
                        </div>

                        <div className={s.field}>
                            <span className={s.field_label}>{t("moderation.detail_prix")}</span>
                            <span className={s.field_value}>{selectedItem.prix?.toString() ?? "—"}</span>
                        </div>

                        <div className={s.field}>
                            <span className={s.field_label}>{t("moderation.detail_produit")}</span>
                            <span className={s.field_value}>{selectedItem.produit?.titre ?? "—"}</span>
                        </div>

                        <div className={s.field}>
                            <span className={s.field_label}>{t("moderation.detail_categorie")}</span>
                            <span className={s.field_value}>{selectedItem.produit?.categorie?.titre ?? "—"}</span>
                        </div>

                        {selectedItem.lifecycleManaged && (
                            <LifecyclePanel
                                drawer
                                lifecycleManaged={selectedItem.lifecycleManaged}
                                postUpdateStateSuccess={refresh}
                            />
                        )}
                    </div>
                )}
            </Drawer>
        </div>
    );
}
