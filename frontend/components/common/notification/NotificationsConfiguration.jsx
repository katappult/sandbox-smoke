import {useEffect, useState} from "react";
import {Col, List, Row, Spin, Switch} from "antd";
import style from "@/styles/components/NotificationCard.module.css";
import {NotificationService} from "@/services/Notification.service";
import {responseSuccess} from "@/utils";
import {serviceConfig} from "@/services/utils/service.config";

export default function NotificationsConfiguration() {

    const [preference, setPreference] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(serviceConfig.isLoggedIn()){
            allUsersPreference();
        }

    }, []);

    const data = [
        {
            key: "PUSH_NOTIFICATION",
        },
        {
            key: "NEW_FOLLOWER_NOTIFICATION",
        },
        {
            key: "NEW_MESSAGE_NOTIFICATION",
        },
        {
            key: "NEW_EVALUATION_NOTIFICATION"
        },
    ];

    const [switchStates, setSwitchStates] = useState(
        new Array(data.length).fill(false)
    );

    const allUsersPreference = async () => {
        try {
            const response = await NotificationService.getNotifPreferences();
            const arrayData = response?.data?.dataList || [];

            const newPreferences = arrayData.reduce((iterator, item) => {
                data.forEach((preference) => {
                    if (item.attributes.key.includes(preference.key)) {
                        iterator.push({
                            title: item.attributes.displayName,
                            columnTitle: item.attributes.displayName,
                            key: item.attributes.key,
                            value: item.attributes.value === "true"
                        });
                    }
                });

                return iterator;
            }, []);

            setSwitchStates(newPreferences.map((item) => item.value));
            setPreference(newPreferences);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user preferences:", error);
        }
    };

    const handleSwitchChange = async (key, checked) => {
        const index = preference.findIndex((item) => item.key === key);
        const newSwitchStates = [...switchStates];
        newSwitchStates[index] = checked;
        setSwitchStates(newSwitchStates);

        try {
            let value;
            if (checked) {
                value = "true";
            } else {
                value = "false";
            }

            const response = await NotificationService.updateNotifPreference(key, value);
            if(responseSuccess(response)){
                await allUsersPreference();
            }

        } catch (error) {
            console.error("Error updating preference:", error);
        }
    };

    if(loading) return <Spin/>

    return (
        <div className={style.notification_config_root}>
            <List
                itemLayout="horizontal"
                dataSource={preference}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                <Row justify="space-between" align="middle">
                                    <Col>{item.title}</Col>
                                    <Col>
                                        <Switch
                                            checked={switchStates[index]}
                                            onChange={(checked) =>
                                                handleSwitchChange(item.key, checked)
                                            }
                                        />
                                    </Col>
                                </Row>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );

}
