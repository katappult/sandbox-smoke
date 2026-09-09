import {Button, message, Result, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ReactCodeMirror from "@uiw/react-codemirror";
import { linter } from "@codemirror/lint";
import { placeholder } from "@codemirror/view";
import FormStyle from "@/styles/components/FormStyle.module.css";
import {notificationError, responseSuccess} from "@/utils";
import {ExcelDataImportService} from "@/services/DataImport.service";
import BackButton from "@/components/common/BackButton";
import Spacer from "@/components/common/Spacer";

const PermissionExampleFormat = `# Format attendu et exemple de données (3 colonnes):
ADD_PERMISSION;Name;KEY
ADD_PERMISSION;Update Region|UPDATE_REGION
ADD_PERMISSION;Delete Region|DELETE_REGION
`;

const GroupExampleFormat = `# Format attendu et exemple de données (4 colonnes):
ADD_GROUP;Name;KEY;Description
ADD_GROUP;Projects Admin;Administrateurs|Project 
ADD_GROUP;Developers;DEV;Group of developers
`;

const UserExampleFormat = `# Format attendu et exemple de données (5 colonnes):
ADD_USER;mail@example.com;nickname;Nom;Prenom
ADD_USER;mail@example.com;nickname;Nom;Prenom
`;

export default function ImportCopyPaste({onBack}){

    const { t } = useTranslation();
    const DATA_TYPES = [
        { value: "groupes", label: t('common.data_type_groupes'), example: GroupExampleFormat, key: "ADD_GROUP", columns: 4 },
        { value: "permissions", label: t('common.data_type_permissions'), example: PermissionExampleFormat, key: "ADD_PERMISSION", columns: 3 },
        { value: "users", label: t('common.data_type_users'), example: UserExampleFormat, key: "ADD_USER", columns: 5 },
    ];

    const [exampleFormat, setExampleFormat] = useState(DATA_TYPES[0]?.example || "");
    const [separator, setSeparator] = useState(";");
    const [dataType, setDataType] = useState(DATA_TYPES[0].value);
    const [rawText, setRawText] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [importSummary, setImportSummary] = useState(null);
    const [isDark, setIsDark] = useState(() =>
        typeof window !== "undefined" && localStorage.getItem("appThemeMode") === "dark"
    );

    useEffect(() => {
        const handler = (e) => setIsDark(e.detail.mode === "dark");
        window.addEventListener("appThemeModeChange", handler);
        return () => window.removeEventListener("appThemeModeChange", handler);
    }, []);

    useEffect(() => {
        setRawText("");
        setExampleFormat(DATA_TYPES.find((dt) => dt.value === dataType)?.example || "");
    }, [dataType])

    const _doImport = async () => {
        if (!rawText.trim()) {
            message.warning(t('common.no_data'));
            return;
        }

        const selectedType = DATA_TYPES.find((dt) => dt.value === dataType);
        const expectedKey = selectedType?.key;

        const lines = rawText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0 && !l.startsWith("#"));

        if (lines.length === 0) {
            message.warning(t('common.no_data_detected'));
            return null;
        }

        const wrongLines = lines.filter((l) => !l.startsWith(expectedKey));
        if (wrongLines.length > 0) {
            message.error(t('common.lines_bad_key', { key: expectedKey }));
            return null;
        }

        const expectedColumns = selectedType?.columns;
        if (expectedColumns) {
            const badColLines = lines.filter((l) => l.split(separator).length !== expectedColumns);
            if (badColLines.length > 0) {
                message.error(t('common.lines_bad_columns', { count: expectedColumns, sep: separator }));
                return null;
            }
        }

        try {

            setLoading(true);
            const form = { data: lines.join("\n"), separator };

            let result;
            if(dataType === "permissions"){
                result = await ExcelDataImportService.importPermissions(form);
            }

            if(dataType === "groupes"){
                result = await ExcelDataImportService.importGroups(form);
            }

            if(dataType === "users"){
                result = await ExcelDataImportService.importUsers(form);
            }

            if(responseSuccess(result)){
                setLoading(false);
                setImportSummary(result.data);
                setSuccess(true);
            } else {
                setLoading(false);
                notificationError();
            }
        }catch (e) {
            console.log(">>> 0000 Import error", e);
            setLoading(false);
            notificationError();
        }
    }

    const handleBack = () => {
        setLoading(false);
        setSuccess(false);
        setImportSummary(null);
    };

    const successContent = () => {
        if (!success) return null;

        const stats = importSummary?.dataList?.find(d => d.imported !== undefined);
        const skipped = importSummary?.dataList?.filter(d => d.line !== undefined) || [];

        return (
            <Result
                status="success"
                title={t('common.import_success')}
                style={{width: "100%"}}
                subTitle={
                    stats && (
                        <div className={"flex p-8 center gap-5"}>
                            <span>✅ {t('common.imported_count')} : <strong>{stats.imported}</strong></span>
                            <span>⏭ {t('common.skipped_count')} : <strong>{stats.skipped}</strong></span>
                            <span>♻️ {t('common.duplicates_count')} : <strong>{stats.duplicates}</strong></span>
                        </div>
                    )
                }
                extra={[
                    skipped.length > 0 && (
                        <div key="skipped-list" style={{ textAlign: "left", maxWidth: 600, margin: "0 auto 16px" }}>
                            <strong>{t('common.skipped_lines')} :</strong>
                            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                                {skipped.map((s, i) => (
                                    <li key={i} style={{ color: "#faad14", fontFamily: "monospace", fontSize: 12 }}>
                                        {s.line} — <em>{s.reason}</em>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ),
                    <Button type="primary" key="back"
                            className={FormStyle.defaultButtonStyle}
                            onClick={handleBack}>
                        {t('common.d_accord')}
                    </Button>,
                ]}
            />
        );
    }

    const dataContent = () => {
        if(!success) return <>
            <Spacer medium/>
            <BackButton onBack={onBack}/>

            <div className={"flex_row space_between w-100"} style={{marginTop:20}}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>Type :</span>
                        <Select
                            className={FormStyle.select}
                            value={dataType}
                            onChange={setDataType}
                            style={{ width: 200 }}
                            options={DATA_TYPES}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{t('common.separator')} :</span>
                        <Select
                            className={FormStyle.select}
                            value={separator}
                            onChange={setSeparator}
                            style={{ width: 200 }}
                            options={[
                                { value: ";", label: t('common.separator_semicolon')},
                                { value: ",", label: t('common.separator_comma') },
                                { value: "\t", label: t('common.separator_tab') },
                                { value: " ", label: t('common.separator_space') },
                                { value: "|", label: t('common.separator_pipe') },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className={"w-100"} style={{marginTop:20}}>
                <div className={"flex_row space_between"}>
                    <div>
                        {t('common.import_hint')}
                    </div>
                </div>
            </div>
            {/* Zone de texte CodeMirror */}
            <div style={{ border: "1px solid #ddd", borderRadius: 6, width: "100%"}}>
                <ReactCodeMirror
                    onChange={(value) => setRawText(value)}
                    value={rawText}
                    height="250px"
                    theme={isDark ? "dark" : "light"}
                    extensions={[placeholder(exampleFormat), linter((view) => dataValidator(view, separator, DATA_TYPES.find(dt => dt.value === dataType), t))]}
                    onBeforeChange={(_, __, value) => setRawText(value)}
                />
            </div>

            <div className={"w-100"} style={{marginTop:20}} onClick={_doImport}>
                <Button disabled={!dataType} className={FormStyle.defaultButtonStyle}>{t('common.import_data')}</Button>
            </div>
        </>
    }

    return <Spin spinning={loading} size="large" tip={t('common.import_in_progress') || "Import en cours..."}>
        <div className={"flex_col"}>
            {dataContent()}
            {successContent()}
        </div>
    </Spin>
}

/**
 * Fonction de validation personnalisée :
 * - Vérifie que chaque ligne a au moins 5 colonnes séparées par ";"
 * - Retourne des diagnostics pour chaque erreur
 */
function dataValidator(view, separateur, selectedType, t) {
    const diagnostics = [];
    const lines = view.state.doc.toString().split("\n");
    const expectedKey = selectedType?.key;
    const expectedColumns = selectedType?.columns;

    lines.forEach((line, index) => {
        if (line.trim() === "" || line.startsWith("#")) return;

        const lineObj = view.state.doc.line(index + 1);

        if (expectedKey && !line.startsWith(expectedKey)) {
            diagnostics.push({
                from: lineObj.from,
                to: lineObj.to,
                severity: "error",
                message: t('common.must_start_with', { key: expectedKey }),
            });
            return;
        }

        if (expectedColumns) {
            const cols = line.split(separateur);
            if (cols.length !== expectedColumns) {
                diagnostics.push({
                    from: lineObj.from,
                    to: lineObj.to,
                    severity: "error",
                    message: t('common.columns_found_expected', { found: cols.length, expected: expectedColumns }),
                });
            }
        }
    });

    return diagnostics;
}

