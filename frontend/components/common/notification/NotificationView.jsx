import { useState, useEffect } from "react";
import { Drawer } from "antd";
import { useTranslation } from "react-i18next";
import {
    SettingsOutlined,
    DoneAllOutlined,
    ArrowBackOutlined,
    CloseOutlined,
} from "@mui/icons-material";
import style from "@/styles/components/NotificationCard.module.css";
import ListNotification from "@/components/common/notification/ListNotification";
import NotificationsConfiguration from "@/components/common/notification/NotificationsConfiguration";
import { responseSuccess } from "@/utils";
import { NotificationService } from "@/services/Notification.service";

export default function NotificationView(props) {
    const { t } = useTranslation();
    const [selectedView, setSelectedView] = useState(2);
    const [refreshNotifications, setRefreshNotifications] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const markAllReaden = async () => {
        const response = await NotificationService.markAllRead();
        if (responseSuccess(response)) {
            props.setHasNewNotifications(false);
            setRefreshNotifications((v) => !v);
        }
    };

    const isSettings = selectedView === 1;

    const header = (
        <div className={style.header}>
            <div className={style.header_left}>
                {isSettings && (
                    <button
                        className={style.icon_btn}
                        onClick={() => setSelectedView(2)}
                        title={t("notif.back_title")}
                    >
                        <ArrowBackOutlined style={{ fontSize: 18 }} />
                    </button>
                )}
                <span
                    className={style.header_title}
                    onClick={() => !isSettings && setSelectedView(2)}
                >
                    {isSettings ? t("notif.settings_label") : t("notif.title")}
                </span>
            </div>

            <div className={style.header_right}>
                {!isSettings && (
                    <button className={style.btn_mark_all} onClick={markAllReaden}>
                        <DoneAllOutlined style={{ fontSize: 13, marginRight: 4, verticalAlign: "middle" }} />
                        {t("notif.mark_all_read")}
                    </button>
                )}
                {!isSettings && (
                    <button
                        className={style.icon_btn}
                        onClick={() => setSelectedView(1)}
                        title={t("notif.settings_btn_title")}
                    >
                        <SettingsOutlined style={{ fontSize: 18 }} />
                    </button>
                )}
                <button
                    className={style.icon_btn}
                    onClick={props.hideMenu}
                    title={t("notif.close_title")}
                >
                    <CloseOutlined style={{ fontSize: 18 }} />
                </button>
            </div>
        </div>
    );

    return (
        <Drawer
            open={props.openNotif}
            onClose={props.hideMenu}
            placement="right"
            width={isMobile ? "100vw" : 380}
            styles={{
                header: { display: "none" },
                body: { padding: 0 },
            }}
        >
            <div className={style.notification_view}>
                {header}
                {isSettings
                    ? <NotificationsConfiguration onHide={props.hideMenu} />
                    : <ListNotification refreshNotifications={refreshNotifications} />
                }
            </div>
        </Drawer>
    );
}
