import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Popconfirm} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    DownOutlined,
    HistoryOutlined,
    InboxOutlined,
    MessageOutlined,
    PlusCircleOutlined,
    SwapRightOutlined,
    UpOutlined,
} from "@ant-design/icons";
import {LifecycleService} from "@/services/Lifecycle.service";
import {convertDate, convertDateTimeToDateWidthHours_and_Minute, responseSuccess} from "@/utils";
import s from "@/styles/components/LifecyclePanel.module.css";
import SectionCard from "@/components/common/info/SectionCard";
import StatusChip from "@/components/common/lifecycle/StatusChip";


function PromoterAvatar({name}) {
    return (
        <span className={s.promoter_avatar}>
            {name ? name.charAt(0).toUpperCase() : "?"}
        </span>
    );
}

function SkeletonRow() {
    return (
        <div className={s.skeleton_row}>
            <div className={s.skeleton_dot}/>
            <div className={s.skeleton_card}/>
        </div>
    );
}

function TimelineItem({dot, statusRow, metaRow, comment, isLast}) {
    return (
        <div className={s.timeline_item} style={isLast ? {marginBottom: 0} : {}}>
            <div className={s.dot_col}>
                <div className={`${s.dot} ${dot.cls}`}>{dot.icon}</div>
            </div>
            <div className={s.timeline_card}>
                <div className={s.transition_row}>{statusRow}</div>
                {metaRow && <div className={s.meta_row}>{metaRow}</div>}
                {comment && (
                    <div className={s.comment}>
                        <MessageOutlined className={s.comment_icon}/>
                        <span>{comment}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────

export default function LifecyclePanel({lifecycleManaged, postUpdateStateSuccess, drawer = false}) {
    const {t} = useTranslation();
    const status = lifecycleManaged?.lifecycleState;
    const [transitions, setTransitions] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyFetched, setHistoryFetched] = useState(false);

    useEffect(() => {
        if (!status || !lifecycleManaged?.fullId) return;
        LifecycleService.statesByAction(lifecycleManaged.fullId, status, "SET_STATE").then((response) => {
            if (responseSuccess(response)) {
                const actions = response.data?.attributes?.statesByAction;
                setTransitions(actions ? actions.split(";") : []);
            }
        });
    }, [status]);

    useEffect(() => {
        if (!historyOpen || historyFetched) return;
        setHistoryLoading(true);
        LifecycleService.historyOf(lifecycleManaged.fullId)
            .then((response) => {
                setHistory(response.data?.dataList ?? []);
                setHistoryFetched(true);
            })
            .finally(() => setHistoryLoading(false));
    }, [historyOpen]);

    const applyTransition = (newStatus) => {
        LifecycleService.setState(lifecycleManaged.fullId, newStatus).then(() => {
            postUpdateStateSuccess();
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

    const content = () => {
        return <>
            <div className={s.panel}>
                {/* Current status */}
                <div className={s.current_section}>
                    <span className={s.section_label}>{t("lifecycle.current_status")}</span>
                    <StatusChip label={status} large/>
                </div>

                {/* Available transitions */}
                {transitions.length > 0 && (
                    <div className={s.transitions_section}>
                        <span className={s.section_label}>{t("lifecycle.available_actions")}</span>
                        <div className={s.transitions_list}>
                            {transitions.map((target) => (
                                <Popconfirm
                                    key={target}
                                    title={t("lifecycle.confirm_status_change_title")}
                                    description={t("lifecycle.confirm_status_change_desc", {target})}
                                    onConfirm={() => applyTransition(target)}
                                    okText={t("lifecycle.confirm_btn")}
                                    cancelText={t("lifecycle.cancel_btn")}
                                    placement="top"
                                >
                                    <button className={s.transition_btn}>
                                        <SwapRightOutlined className={s.transition_icon}/>
                                        <div className={s.transition_content}>
                                            <span className={s.transition_from}>{status}</span>
                                            <span className={s.transition_arrow}>→</span>
                                            <StatusChip label={target}/>
                                        </div>
                                    </button>
                                </Popconfirm>
                            ))}
                        </div>
                    </div>
                )}

                {/* History toggle */}
                <button className={s.history_toggle} onClick={() => setHistoryOpen((o) => !o)}>
                    <HistoryOutlined/>
                    <span>{t("lifecycle.history_title")}</span>
                    {historyOpen ? <UpOutlined className={s.chevron}/> : <DownOutlined className={s.chevron}/>}
                </button>

                {/* History timeline */}
                {historyOpen && (
                    <div className={s.history_section}>
                        {historyLoading && (
                            <>
                                <SkeletonRow/>
                                <SkeletonRow/>
                                <SkeletonRow/>
                            </>
                        )}

                        {!historyLoading && history.length === 0 && (
                            <div className={s.empty}>
                                <InboxOutlined className={s.empty_icon}/>
                                <span>{t("lifecycle.no_history")}</span>
                            </div>
                        )}

                        {!historyLoading && history.length > 0 && (
                            <div className={s.timeline}>
                                <TimelineItem
                                    dot={{cls: s.dot_create, icon: <PlusCircleOutlined/>}}
                                    statusRow={<span className={s.label_create}>{t("lifecycle.creation_record")}</span>}
                                    metaRow={
                                        lifecycleManaged.createDate && (
                                            <>
                                                <CalendarOutlined/>
                                                <span>{convertDateTimeToDateWidthHours_and_Minute(lifecycleManaged.createDate)}</span>
                                            </>
                                        )
                                    }
                                />

                                {history.map((item, index) => (
                                    <TimelineItem
                                        key={index}
                                        isLast={index === history.length - 1}
                                        dot={{cls: s.dot_transition, icon: <ClockCircleOutlined/>}}
                                        statusRow={
                                            <>
                                                <StatusChip label={item.fromStatus}/>
                                                <span className={s.arrow}>→</span>
                                                <StatusChip label={item.toStatus}/>
                                            </>
                                        }
                                        metaRow={
                                            <>
                                                {item.promoter && (
                                                    <>
                                                        <PromoterAvatar name={item.promoter}/>
                                                        <strong>{item.promoter}</strong>
                                                    </>
                                                )}
                                                {item.createDate && (
                                                    <>
                                                        <CalendarOutlined style={{marginLeft: item.promoter ? 8 : 0}}/>
                                                        <span>{formatDate(item.createDate)}</span>
                                                    </>
                                                )}
                                            </>
                                        }
                                        comment={item.comment}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    }

    if (!lifecycleManaged || !status) return null;

    if (drawer) {
        return <>
            {content()}
        </>
    }

    return <SectionCard
        id="statut"
        title={t("lifecycle.section_title")}
        desc={t("lifecycle.section_desc")}
    >
        {content()}
    </SectionCard>
}
