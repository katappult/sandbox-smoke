import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Modal, Popconfirm} from "antd";
import {
    HistoryOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    CalendarOutlined,
    PlusCircleOutlined,
    InboxOutlined, RightOutlined, SwapRightOutlined,
} from "@ant-design/icons";
import {convertDate, responseSuccess} from "@/utils";
import { LifecycleService } from "@/services/Lifecycle.service";
import s from "@/styles/components/LifecycleHistoryTimeline.module.css";
import ds from "@/styles/components/Drawer2.module.css";
import Badge from "@/components/common/Badge";
import StatusChip from "@/components/common/lifecycle/StatusChip";
import DrawerCollapsibleSection from "@/components/common/drawer/DrawerCollapsibleSection";

function PromoterAvatar({ name }) {
    const initial = name ? name.charAt(0).toUpperCase() : "?";
    return <span className={s.promoter_avatar}>{initial}</span>;
}

function SkeletonLoader() {
    return (
        <div className={s.skeleton_list}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={s.skeleton_item}>
                    <div className={s.skeleton_dot} />
                    <div className={s.skeleton_card} />
                </div>
            ))}
        </div>
    );
}

function TimelineItem({ dot, statusRow, meta, comment, isLast }) {
    return (
        <div className={s.item} style={isLast ? { marginBottom: 4 } : {}}>
            <div className={s.dot_col}>
                <div className={dot.className}>{dot.icon}</div>
            </div>
            <div className={s.card}>
                <div className={s.status_row}>{statusRow}</div>
                <div className={s.meta}>{meta}</div>
                {comment && (
                    <div className={s.comment}>
                        <MessageOutlined className={s.comment_icon} />
                        <span>{comment}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main component ──────────────────────────────────────

const LifecycleHistoryTimeline = ({ entityId, creationDate, status, reloadEntity, drawer }) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transitions, setTransitions] = useState([]);

    useEffect(() => {
        if (!entityId) return;
        LifecycleService.statesByAction(entityId, status, "SET_STATE").then((res) => {
            if (responseSuccess(res)) {
                const raw = res.data?.attributes?.statesByAction;
                setTransitions(raw ? raw.split(";").filter(Boolean) : []);
            }
        });
    }, [entityId]);

    useEffect(() => {
        if (!visible) return;
        setLoading(true);
        LifecycleService.historyOf(entityId)
            .then((response) => setHistories(response.data.dataList ?? []))
            .finally(() => setLoading(false));
    }, [visible]);

    const applyTransition = (target) => {
        LifecycleService.setState(entityId, target).then(() => {
            if(reloadEntity) reloadEntity();
        });
    };

    const formatDate = (date) => {
        try {
            return convertDate(date).toLocaleString("fr-FR", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
            });
        } catch {
            return date;
        }
    };

    const isEmpty = !loading && histories.length === 0;

    const content = () =>{
        return <>
            <>
                {/* Statut actuel */}
                <div className={ds.status_current}>
                    <span className={ds.status_current_label}>{t("lifecycle.current")}</span>
                    <Badge text={status} accent/>
                </div>

                {/* Transitions */}
                {transitions.length > 0 && (
                    <>
                        <span className={ds.transitions_label}>{t("lifecycle.go_to")}</span>
                        <div className={ds.transitions_list}>
                            {transitions.map((target) => (
                                <Popconfirm
                                    key={target}
                                    title={t("lifecycle.confirm_transition_title")}
                                    description={t("lifecycle.confirm_transition_desc", { target })}
                                    onConfirm={() => applyTransition(target)}
                                    okText={t("lifecycle.confirm_btn")}
                                    cancelText={t("lifecycle.cancel_btn")}
                                    placement="left"
                                >
                                    <button className={ds.transition_btn}>
                                        <RightOutlined className={ds.transition_btn_icon} />
                                        <span className={ds.transition_btn_text}>
                                        <span className={ds.transition_btn_from}>{status}</span>
                                        <span className={ds.transition_btn_arrow}>→</span>
                                        <StatusChip label={target} />
                                    </span>
                                    </button>
                                </Popconfirm>
                            ))}
                        </div>
                    </>
                )}

                {transitions.length === 0 && (
                    <div className={ds.status_no_transition}>
                        {t("lifecycle.no_transition")}
                    </div>
                )}

                <button className={s.trigger} onClick={() => setVisible(true)}>
                    <HistoryOutlined />
                    {t("lifecycle.history_btn")}
                </button>

                <Modal
                    title={
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700 }}>
                        <HistoryOutlined style={{ color: "var(--color-1)" }} />
                        {t("lifecycle.history_title")}
                    </span>
                    }
                    open={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                    width={520}
                    styles={{ body: { padding: "12px 20px 20px" } }}
                >
                    <div className={s.modal_body}>
                        {loading && <SkeletonLoader />}

                        {isEmpty && (
                            <div className={s.empty}>
                                <InboxOutlined className={s.empty_icon} />
                                <span>{t("lifecycle.no_history")}</span>
                            </div>
                        )}

                        {!loading && !isEmpty && (
                            <div className={s.timeline}>
                                {/* Creation event */}
                                <TimelineItem
                                    dot={{
                                        className: `${s.dot} ${s.dot_create}`,
                                        icon: <PlusCircleOutlined />,
                                    }}
                                    statusRow={<span className={s.label_create}>{t("lifecycle.creation")}</span>}
                                    meta={
                                        creationDate && (
                                            <span className={s.meta_item}>
                                            <CalendarOutlined />
                                                {creationDate}
                                        </span>
                                        )
                                    }
                                />

                                {/* Transition events */}
                                {histories.map((item, index) => (
                                    <TimelineItem
                                        key={index}
                                        isLast={index === histories.length - 1}
                                        dot={{
                                            className: `${s.dot} ${s.dot_transition}`,
                                            icon: <ClockCircleOutlined />,
                                        }}
                                        statusRow={
                                            <>
                                                <StatusChip label={item.fromStatus} />
                                                <span className={s.arrow}>→</span>
                                                <StatusChip label={item.toStatus} />
                                            </>
                                        }
                                        meta={
                                            <>
                                                {item.promoter && (
                                                    <span className={s.meta_item}>
                                                    <PromoterAvatar name={item.promoter} />
                                                    <strong>{item.promoter}</strong>
                                                </span>
                                                )}
                                                {item.createDate && (
                                                    <span className={s.meta_item}>
                                                    <CalendarOutlined />
                                                        {formatDate(item.createDate)}
                                                </span>
                                                )}
                                            </>
                                        }
                                        comment={item.comment}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Modal>
            </>
        </>
    }

    if(drawer){
        return <>
            <DrawerCollapsibleSection
                icon={<SwapRightOutlined/>}
                label={t("lifecycle.status_section")}
            >
                {content()}
            </DrawerCollapsibleSection>
        </>
    }

    return content();
};

export default LifecycleHistoryTimeline;
