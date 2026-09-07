import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {Button, Input, message, Spin, Table, Typography} from "antd";
import {PreferenceService} from "@/services/Preference.service";
import {responseSuccess} from "@/utils";

const {Text} = Typography;

export default function UserPreferencesSettings() {
    const { t } = useTranslation();
    const [preferences, setPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        setLoading(true);
        const res = await PreferenceService.getUserPreferences();
        if (responseSuccess(res)) {
            const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
            setPreferences(data);
            const initial = {};
            data.forEach(p => { initial[p.key] = p.value ?? ""; });
            setEditValues(initial);
        } else {
            message.error(t("preferences.load_error"));
        }
        setLoading(false);
    };

    const handleChange = (key, value) => {
        setEditValues(prev => ({...prev, [key]: value}));
    };

    const handleSave = async (key) => {
        setSaving(prev => ({...prev, [key]: true}));
        const res = await PreferenceService.updateUserPreference(key, editValues[key]);
        if (responseSuccess(res)) {
            message.success(t("preferences.save_success"));
        } else {
            message.error(t("preferences.save_error"));
        }
        setSaving(prev => ({...prev, [key]: false}));
    };

    const columns = [
        {
            title: t("preferences.col_key"),
            dataIndex: "key",
            key: "key",
            width: 280,
            render: (key) => <Text code>{key}</Text>,
        },
        {
            title: t("preferences.col_description"),
            dataIndex: "description",
            key: "description",
            render: (desc) => desc ? <Text type="secondary">{desc}</Text> : "—",
        },
        {
            title: t("preferences.col_value"),
            dataIndex: "value",
            key: "value",
            width: 300,
            render: (_, record) => (
                <Input
                    value={editValues[record.key] ?? ""}
                    onChange={e => handleChange(record.key, e.target.value)}
                    onPressEnter={() => handleSave(record.key)}
                />
            ),
        },
        {
            title: "",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    loading={saving[record.key]}
                    onClick={() => handleSave(record.key)}
                >
                    {t("my_account.save")}
                </Button>
            ),
        },
    ];

    if (loading) return <div style={{padding: 40, textAlign: "center"}}><Spin /></div>;

    return (
        <Table
            dataSource={preferences}
            columns={columns}
            rowKey="key"
            pagination={false}
            size="middle"
        />
    );
}
