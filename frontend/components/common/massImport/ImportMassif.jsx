import React, { useState } from "react";
import {Table, Button, Upload, message, Tag, Typography, Alert, Divider} from "antd";
import {UploadOutlined, CloudUploadOutlined, ArrowLeftOutlined} from "@ant-design/icons";
import Link from "next/link";
import {responseSuccess} from "@/utils";
import {useTranslation} from "react-i18next";
import {ExcelDataImportService} from "@/services/DataImport.service";

const { Text } = Typography;

const ImportMassif = ({onBack}) => {

    const {t} = useTranslation('common');
    const [imports, setImports] = useState([
        { key: "restaurant", type: t('common.restaurant'), status: null },
        { key: "hotel", type: t('common.hotel'), status: null },
        { key: "guide", type: t('common.guide'), status: null },
        { key: "car_rental", type: t('common.car_rental'), status: null },
        { key: "excursion", type: t('common.excursion'), status: null },
    ]);

    const [files, setFiles] = useState({});
    const isImportError = (key) => {
        return imports.find(d => d.key === key)?.status === "error";
    }

    const handleDownloadTemplate = (type) => {
        // Exemple : lien vers un fichier template (tu adapteras selon ton backend)
        const link = document.createElement("a");
        link.href = `/templates/${type}.xlsx`;
        link.download = `${type}_template.xlsx`;
        link.click();
    };

    const handleUpload = (type, info) => {
        if (info.file.status === "done") {
            setFiles((prev) => ({ ...prev, [type]: info.file.originFileObj }));
        } else if (info.file.status === "error") {
            message.error(`${t('common.upload_failed')} ${info.file.name}`);
        }
    };

    const handleImport = async (type) => {
        const file = files[type];
        if (!file) {
            message.warning(t('common.upload_first'));
            return;
        }

        // Simule un appel API
        message.loading({ content: t('common.importing'), key: type });

        const formData = new FormData();
        formData.append("file", file);

        setImports((prev) =>
            prev.map((imp) =>
                imp.key === type
                    ? { ...imp, status: null }
                    : imp
            )
        );

        try {
            const response = await ExcelDataImportService.loadFile(formData, type);
            const success = responseSuccess(response);
            setImports((prev) =>
                prev.map((imp) =>
                    imp.key === type
                        ? { ...imp, status: success ? "success" : "error" }
                        : imp
                )
            );

            if(success){
                message.success({
                    content: t('common.import_type_success', { type }),
                });
            } else {
                message.error({
                    content: `${t('common.import_error')} ${type}.`,
                    key: type,
                });
            }

        } catch (err) {
            console.error(err);
            alert(t('common.import_error'));
        }

    };

    const download = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        ExcelDataImportService.download(type).then(response => {
            if(response && response.status === 200){
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);

                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download',   type + '-travelplanner-template-data-v1.xlsx');
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);

                // clean up
                setTimeout(() => {
                    URL.revokeObjectURL(href);
                }, 100); // petit délai pour s'assurer que le téléchargement a commencé

            }
        })
    }

    const isValidFile = (key) => {
        const file = files[key];
        return file.name.includes(key);
    }

    const importCell = (record) => {
        const file = files[record.key];
        if(!file) return <Button disabled>
            {t('common.importer')}
        </Button>

        const isValid = file && isValidFile(record.key);
        if (!isValid) {
            return (
                <Alert
                    message={
                        file
                            ? `${t('common.invalid_file')}`
                            : t('common.no_file_selected')
                    }
                    type="error"
                    showIcon
                />
            );
        }

        return (
            <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={() => handleImport(record.key)}
            >
                {t('common.importer')}
            </Button>
        );
    };


    const columns = [
        {
            title: t('common.import_type'),
            dataIndex: "type",
            key: "type",
        },
        {
            title: t('common.download_template'),
            key: "download",
            render: (_, record) => (
                <Link
                    style={{textDecoration: "underline", color: "blueviolet"}}
                    href={`/templates/${record.key}-gtp-data-v1.xlsx`}
                    download
                >
                    template-[{record.key}].xlsx
                </Link>
            ),
        },
        {
            title: t('common.upload_file'),
            key: "upload",
            render: (_, record) => (
                <div>
                    {/* Affiche le nom du fichier en dessous du bouton */}
                    {files[record.key] && (
                        <Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                            📄 {files[record.key].name}
                        </Text>
                    )}

                    {(isImportError(record.key) || !files[record.key] || !isValidFile(record.key)) && <Upload
                        accept=".xlsx"
                        showUploadList={false}
                        onChange={(info) => handleUpload(record.key, info)}
                    >
                        <Button icon={<UploadOutlined />}>{t('common.uploader')}</Button>
                    </Upload>
                    }
                </div>
            ),
        },
        {
            title: t('common.import'),
            key: "import",
            render: (_, record) => importCell(record)
        },
        {
            title: t('common.result'),
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status ? (
                    status === "success" ? (
                        <Tag color="green">{t('common.success')}</Tag>
                    ) : (
                        <Tag color="red">{t('common.error')}</Tag>
                    )
                ) : (
                    <Text type="secondary">{t('common.pending')}</Text>
                ),
        },
    ];

    return <>
            <Instructions onBack={onBack}/>
            <div style={{ width: "100%", overflowX: "auto" }}>
                <Table
                    size={"small"}
                    style={{ width: "100%", minWidth: 560 }}
                    columns={columns}
                    dataSource={imports}
                    pagination={false}
                    bordered
                />
            </div>
    </>
};

export default ImportMassif;


export function Instructions({onBack}) {

    const {t} = useTranslation('common');
    const [open, setOpen] = useState(true);
    const toggleOpen = () => setOpen(!open);

    return (
        <div className={"flex_col"} style={{ marginBottom: 10, width: "100%", marginTop:-20, gap:20 }}>
            <div className={"flex_row"}>
                <Button onClick={onBack} icon={<ArrowLeftOutlined/>}>{t('common.back')}</Button>
                <Typography.Title level={4}>
                    {t('common.download_instructions_title')}
                </Typography.Title>
            </div>

            <Divider/>

            {open && (
                <Alert
                    type="info"
                    description={
                        <div>
                            <ul style={{ marginLeft: 0, paddingLeft: 18 }}>
                                <li>
                                    {t('common.download_instructions')}
                                </li>
                                <li>
                                    {t('common.fill_instructions')}
                                </li>
                                <li>
                                    {t('common.upload_instructions')}
                                </li>
                                <li>
                                    {t('common.import_instructions')}
                                </li>
                                <li>
                                    <Text type="warning" strong>
                                        {t('common.important')}
                                    </Text>{" "}
                                    {t('common.update_instructions')}
                                </li>
                            </ul>
                        </div>
                    }
                />
            )}
        </div>
    );
}