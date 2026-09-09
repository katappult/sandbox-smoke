import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {Button, Input, message, Select, Spin, Switch, Table, Typography} from "antd";
import {PreferenceService} from "@/services/Preference.service";
import {GroupAdminService} from "@/services/GroupAdmin.service";
import {responseSuccess} from "@/utils";

const {Text} = Typography;

const DATE_FORMAT_OPTIONS = [
    {value: "dd/MM/yyyy",          label: "dd/MM/yyyy           — 31/12/2025"},
    {value: "yyyy-MM-dd",          label: "yyyy-MM-dd           — 2025-12-31"},
    {value: "d MMMM yyyy",         label: "d MMMM yyyy          — 31 décembre 2025"},
    {value: "dd/MM/yyyy HH:mm",    label: "dd/MM/yyyy HH:mm     — 31/12/2025 14:30"},
    {value: "yyyy-MM-dd HH:mm:ss", label: "yyyy-MM-dd HH:mm:ss  — 2025-12-31 14:30:00"},
];

export default function SystemPreferencesSettings() {
    const { t } = useTranslation();
    const [preferences, setPreferences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [editValues, setEditValues] = useState({});
    const [systemGroups, setSystemGroups] = useState([]);

    useEffect(() => {
        loadPreferences();
        GroupAdminService.listGroups(0, 1000).then(res => {
            if (responseSuccess(res)) setSystemGroups(res.data?.dataList || []);
        });
    }, []);

    const loadPreferences = async () => {
        setLoading(true);
        const response = await PreferenceService.getSystemPreferences();
        if (responseSuccess(response)) {
            setPreferences(response.data.dataList);
            const initial = {};
            response.data.dataList.forEach(p => { initial[p.key] = p.value ?? ""; });
            setEditValues(initial);
        }
        setLoading(false);
    };

    const handleChange = (key, value) => {
        setEditValues(prev => ({...prev, [key]: value}));
    };

    const handleSave = async (key) => {
        setSaving(prev => ({...prev, [key]: true}));
        const res = await PreferenceService.updateSystemPreference(key, editValues[key]);
        if (responseSuccess(res)) {
            message.success(t("preferences.save_success"));
        }
        setSaving(prev => ({...prev, [key]: false}));
    };

    const columns = [
        {
            title: t("preferences.col_name"),
            dataIndex: "displayName",
            key: "displayName",
            width: 280,
            render: (key) => <Text>{key}</Text>,
        },
        {
            title: t("preferences.col_key"),
            dataIndex: "key",
            key: "key",
            width: 280,
            render: (key) => <Text code>{key}</Text>,
        },
        {
            title: t("preferences.col_value"),
            dataIndex: "value",
            key: "value",
            width: 300,
            render: (_, record) => {
                const val = editValues[record.key] ?? "";
                const isBoolean = val === true || val === false || val === "true" || val === "false";
                const hint = record.tooltip
                    ? <Text type="secondary" style={{fontSize: 11, display: "block", marginTop: 2}}>{record.tooltip}</Text>
                    : null;
                if (record.key === "system.date.format") {
                    return (
                        <div>
                            <Select
                                value={val}
                                style={{width: "100%"}}
                                onChange={newVal => handleChange(record.key, newVal)}
                                options={DATE_FORMAT_OPTIONS}
                                optionLabelProp="value"
                            />
                            {hint}
                        </div>
                    );
                }
                if (record.key === "system.default.group") {
                    const selectedIds = val ? val.split(",").filter(Boolean) : [];
                    return (
                        <div>
                            <Select
                                mode="multiple"
                                style={{width: "100%"}}
                                value={selectedIds}
                                onChange={ids => handleChange(record.key, ids.join(","))}
                                options={systemGroups.map(g => ({value: g.internalKey, label: g.name}))}
                                optionFilterProp="label"
                                allowClear
                            />
                            {hint}
                        </div>
                    );
                }
                if (isBoolean) {
                    const checked = val === true || val === "true";
                    return (
                        <div>
                            <Switch
                                checked={checked}
                                loading={saving[record.key]}
                                onChange={async (newChecked) => {
                                    const newValue = String(newChecked);
                                    handleChange(record.key, newValue);
                                    setSaving(prev => ({...prev, [record.key]: true}));
                                    const res = await PreferenceService.updateSystemPreference(record.key, newValue);
                                    if (responseSuccess(res)) {
                                        message.success(t("preferences.save_success"));
                                    } else {
                                        handleChange(record.key, String(!newChecked));
                                    }
                                    setSaving(prev => ({...prev, [record.key]: false}));
                                }}
                            />
                            {hint}
                        </div>
                    );
                }
                return (
                    <div>
                        <Input
                            className={"form_input"}
                            value={val}
                            onChange={e => handleChange(record.key, e.target.value)}
                            onPressEnter={() => handleSave(record.key)}
                        />
                        {hint}
                    </div>
                );
            },
        },
        {
            title: "",
            key: "action",
            width: 100,
            render: (_, record) => {
                const val = editValues[record.key] ?? "";
                const isBoolean = val === true || val === false || val === "true" || val === "false";
                if (isBoolean) return null;
                if (record.key === "system.default.group") return (
                    <Button
                        size="small"
                        loading={saving[record.key]}
                        onClick={() => handleSave(record.key)}
                    >
                        {t("my_account.save")}
                    </Button>
                );
                if (record.key === "system.date.format") return (
                    <Button
                        size="small"
                        loading={saving[record.key]}
                        onClick={() => handleSave(record.key)}
                    >
                        {t("my_account.save")}
                    </Button>
                );
                return (
                    <Button
                        size="small"
                        loading={saving[record.key]}
                        onClick={() => handleSave(record.key)}
                    >
                        {t("my_account.save")}
                    </Button>
                );
            },
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
