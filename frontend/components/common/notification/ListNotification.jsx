import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import { NotificationsNoneOutlined, DeleteOutlineOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import {
    convertOldDate,
    formatDate,
    responseSuccess,
    toThumbFullURL,
} from "@/utils";
import style from "@/styles/components/NotificationCard.module.css";
import { NotificationService } from "@/services/Notification.service";
import { decrement_header_notifications_count } from "@/redux/action.service";

export default function ListNotification({ refreshNotifications }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState(null);
    const route = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, [refreshNotifications]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await NotificationService.listNotifications("", 0, 20);
            if (responseSuccess(response)) {
                setNotifications(response.data.dataList);
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteNotif = async (e, notification) => {
        e.stopPropagation();
        const response = await NotificationService.deleteNotification(notification.uid);
        if (responseSuccess(response)) {
            fetchNotifications();
            decrement_header_notifications_count();
        }
    };

    const getIcon = (notification) => {
        const content = JSON.parse(notification.content2) || {};
        const { thumb, image, dealer, icon } = content;

        if (thumb) {
            return (
                <div className={style.icon_circle_img}>
                    <img src={toThumbFullURL(thumb, 150)} alt="" />
                </div>
            );
        }
        if (image) {
            return (
                <div className={style.icon_circle_img}>
                    <img src={image} alt="" />
                </div>
            );
        }
        if (dealer) {
            return <div className={style.icon_circle_dealer}>{dealer}</div>;
        }

        const iconSrc =
            icon === "WELCOME_USER" ? "/images/adresse.svg"
            : icon === "CREDIT_CARD" ? "/images/paiement.svg"
            : "/images/info_circle.svg";

        return (
            <div className={style.icon_circle}>
                <img src={iconSrc} alt="" />
            </div>
        );
    };

    const getForwardTo = (notification) => {
        try {
            const content = JSON.parse(notification.content2) || {};
            return content.forwardTo || null;
        } catch {
            return null;
        }
    };

    const handleClick = (notification) => {
        const forwardTo = getForwardTo(notification);
        if (!forwardTo) return;
        if (forwardTo === "LIVE_ADD")    return route.push("/back_office/lives/add");
        if (forwardTo === "ADD_CARD")    return route.push("/");
        if (forwardTo === "MES_VENTES") return route.push("/back_office/ventes");
    };

    const getDate = (notification) => {
        const date = convertOldDate(notification.createDate);
        return formatDate(date, "DD MMM · HH:mm");
    };

    if (loading) {
        return (
            <div className={style.empty}>
                <Spin />
            </div>
        );
    }

    if (!notifications || notifications.length === 0) {
        return (
            <div className={style.empty}>
                <div className={style.empty_icon}>
                    <NotificationsNoneOutlined fontSize="inherit" />
                </div>
                <div className={style.empty_title}>{t("notif.empty_title")}</div>
                <div className={style.empty_desc}>{t("notif.empty_desc")}</div>
            </div>
        );
    }

    return (
        <div className={style.list}>
            {notifications.map((notif, i) => {
                const isNew = notif.status === "NEW";
                const forwardTo = getForwardTo(notif);

                let message = "";
                try { message = JSON.parse(notif.content2).message || ""; } catch {}

                return (
                    <div key={notif.uid}>
                        <div
                            className={[
                                style.tile,
                                isNew ? style.tile_new : "",
                                forwardTo ? style.tile_clickable : "",
                            ].join(" ")}
                            onClick={() => handleClick(notif)}
                        >
                            {getIcon(notif)}

                            <div className={style.tile_body}>
                                <div className={style.tile_title}>{notif.subject}</div>
                                {message ? (
                                    <div className={style.tile_message}>{message}</div>
                                ) : null}
                                <div className={style.tile_footer}>
                                    <span className={style.tile_date}>{getDate(notif)}</span>
                                    <button
                                        className={style.tile_delete}
                                        onClick={(e) => deleteNotif(e, notif)}
                                        title={t("notif.delete_title")}
                                    >
                                        <DeleteOutlineOutlined style={{ fontSize: 16 }} />
                                    </button>
                                </div>
                            </div>

                            {isNew && <div className={style.unread_dot} />}
                        </div>
                        {i < notifications.length - 1 && <div className={style.tile_divider} />}
                    </div>
                );
            })}
        </div>
    );
}
