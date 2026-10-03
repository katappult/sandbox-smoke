import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Spin, Table, Typography } from "antd";
import { serviceConfig } from "@/services/utils/service.config";
import { AnnonceService } from "@/services/generated/Annonce.services";
import { thumbService } from "@/services/Thumb.service";
import { LifecycleService } from "@/services/Lifecycle.service";
import StatusChip from "@/components/common/lifecycle/StatusChip";
import {
    responseListSuccess,
    responseSuccess,
    getThumbnailPath,
    notificationError,
} from "@/utils";
import s from "./MesAnnonces.module.css";

const PAGE_SIZE = 10;
const REFUSED_STATE = "REFUSEE";

export default function MesAnnonces() {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [allMine, setAllMine] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [thumbsMap, setThumbsMap] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const thumbCache = useRef({});
    const commentCache = useRef({});

    const getStatus = useCallback((item) => {
        const status = item.lifecycleManaged?.currentState
            || item.lifecycleManaged?.status
            || item.lifecycleState
            || item.status;

        if (typeof status === "string") return status;
        if (status?.name) return status.name;
        if (status?.uid) return status.uid;
        if (status?.label) return status.label;
        return "";
    }, []);

    const isMine = useCallback((item) => {
        const currentAccountId = serviceConfig.getAccountId() || serviceConfig.getAccountUid();
        if (!currentAccountId) return false;

        const creator = item.creator;
        if (!creator) return false;

        const creatorId = creator?.fullId || creator?.uid || creator;
        return creatorId === currentAccountId;
    }, []);

    const loadAnnonces = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await AnnonceService.listEntity(1, 1000, "", "", "");
            if (!responseListSuccess(res)) {
                setError(true);
                return;
            }
            const all = res.data.dataList || [];
            setAllMine(all.filter((item) => isMine(item)));
            setCurrentPage(1);
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [isMine]);

    useEffect(() => {
        if (!serviceConfig.isLoggedIn()) {
            router.push("/auth/login");
            return;
        }
        loadAnnonces();
    }, [loadAnnonces, router]);

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return allMine.slice(start, start + PAGE_SIZE);
    }, [allMine, currentPage]);

    useEffect(() => {
        if (pageItems.length === 0) return;

        const loadThumbnails = async () => {
            const newThumbs = {};
            await Promise.all(
                pageItems.map(async (item) => {
                    const id = item.fullId || item.uid;
                    if (!id) return;

                    if (thumbCache.current[id]) {
                        newThumbs[id] = thumbCache.current[id];
                        return;
                    }

                    try {
                        const res = await thumbService.getThumbs(id);
                        if (responseSuccess(res)) {
                            const path = getThumbnailPath(res.data, 0);
                            if (path) {
                                newThumbs[id] = path;
                                thumbCache.current[id] = path;
                            }
                        }
                    } catch {
                        // Ignore thumbnail loading errors; the column will display a placeholder.
                    }
                })
            );
            setThumbsMap((prev) => ({ ...prev, ...newThumbs }));
        };

        loadThumbnails();
    }, [pageItems]);

    useEffect(() => {
        if (pageItems.length === 0) return;

        const loadComments = async () => {
            const newComments = {};
            await Promise.all(
                pageItems.map(async (item) => {
                    const status = getStatus(item);
                    if (status !== REFUSED_STATE) return;

                    const id = item.fullId || item.uid;
                    if (!id) return;

                    if (commentCache.current[id]) {
                        newComments[id] = commentCache.current[id];
                        return;
                    }

                    try {
                        const res = await LifecycleService.historyOf(id);
                        const history = res?.data?.dataList
                            || res?.data?.history
                            || res?.data?.attributes?.history
                            || [];

                        const refusedEntry = history.find((entry) =>
                            entry.toStatus === REFUSED_STATE
                            || entry.toStatus?.uid === REFUSED_STATE
                            || entry.toStatus?.status === REFUSED_STATE
                        );

                        if (refusedEntry?.comment) {
                            newComments[id] = refusedEntry.comment;
                            commentCache.current[id] = refusedEntry.comment;
                        }
                    } catch {
                        // Ignore history loading errors.
                    }
                })
            );
            setCommentsMap((prev) => ({ ...prev, ...newComments }));
        };

        loadComments();
    }, [getStatus, pageItems]);

    const getProductLabel = useCallback((item) => {
        const product = item.produit;
        if (!product) return "—";
        const productTitle = product.titre || product.title || product.name;
        const categoryTitle = product.categorie?.titre
            || product.categorie?.title
            || product.categorie?.name
            || product.categorie;
        if (productTitle && categoryTitle) return `${productTitle} — ${categoryTitle}`;
        if (productTitle) return productTitle;
        if (typeof product === "string") return product;
        return "—";
    }, []);

    const columns = [
        {
            title: t("annonce.col_photo"),
            key: "photo",
            width: 80,
            render: (_, record) => {
                const id = record.fullId || record.uid;
                const url = thumbsMap[id];
                if (url) {
                    return <img className={s.thumbnail} src={url} alt="" />;
                }
                return <span className={s.placeholder_icon}>—</span>;
            },
        },
        {
            title: t("annonce.col_titre"),
            dataIndex: "titre",
            key: "titre",
            render: (titre) => titre || "—",
        },
        {
            title: t("annonce.col_produit"),
            key: "produit",
            render: (_, record) => getProductLabel(record),
        },
        {
            title: t("annonce.col_prix"),
            dataIndex: "prix",
            key: "prix",
            render: (prix) => (prix != null ? prix.toString() : "—"),
        },
        {
            title: t("annonce.col_statut"),
            key: "statut",
            render: (_, record) => {
                const statusCode = getStatus(record);
                const statusKey = statusCode === "VALIDEE"
                    ? "annonce.status.validated"
                    : statusCode === "REFUSEE"
                        ? "annonce.status.refused"
                        : "annonce.status.pending";
                return <StatusChip label={t(statusKey)} />;
            },
        },
        {
            title: t("annonce.col_refusal_reason"),
            key: "refusal_reason",
            render: (_, record) => {
                if (getStatus(record) !== REFUSED_STATE) return "—";
                const id = record.fullId || record.uid;
                return commentsMap[id] || t("annonce.no_refusal_reason");
            },
        },
    ];

    if (!serviceConfig.isLoggedIn()) {
        return null;
    }

    if (loading) {
        return (
            <div className={s.center}>
                <Spin />
            </div>
        );
    }

    if (error) {
        return (
            <div className={s.center}>
                <Typography.Text type="danger">{t("annonce.list_error")}</Typography.Text>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <Typography.Title level={3}>{t("annonce.list_title")}</Typography.Title>
            {allMine.length === 0 ? (
                <div className={s.center}>{t("annonce.list_empty")}</div>
            ) : (
                <Table
                    rowKey={(record) => record.fullId || record.uid}
                    columns={columns}
                    dataSource={pageItems}
                    pagination={{
                        current: currentPage,
                        pageSize: PAGE_SIZE,
                        total: allMine.length,
                        showSizeChanger: false,
                        onChange: setCurrentPage,
                    }}
                />
            )}
        </div>
    );
}
