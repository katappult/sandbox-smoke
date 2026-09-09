import React, {useEffect, useState} from "react";
import {Modal, Button, Table, Upload, Popconfirm} from "antd";
import {
    DeleteOutlined,
    InboxOutlined,
    StarFilled,
    CloudDownloadOutlined
} from "@ant-design/icons";
import FormStyle from "@/styles/components/FormStyle.module.css";
import {ContentHolderService} from "@/services/ContentHolder.services";
import {responseSuccess} from "@/utils";
import { useTranslation } from "react-i18next";

const FileUploadManager = ({entityId}) => {
    const { t } = useTranslation();

    const [visible, setVisible] = useState(false);
    const [hasPrimaryContent, setHasPrimaryContent] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [primaryFileName, setPrimaryFileName] = useState(null);

    useEffect(() => {
        loadPrimaryContent();
    }, [entityId]);

    useEffect(() => {
        loadAttachmentContent();
    }, [entityId]);

    const loadPrimaryContent = () => {
        setPrimaryFileName(null);
        ContentHolderService.contentInfos(entityId, "primary").then(response => {
           if(response.status === 200) {
               const fileName = response.data?.attributes.fileName;
               setHasPrimaryContent(fileName && fileName !== "");
               setPrimaryFileName(fileName);
           }
        })
    }

    const loadAttachmentContent = () => {
        ContentHolderService.contentInfos(entityId, "attachments").then(response => {
            if(responseSuccess(response) && response.data?.attributes.fileName){
                setAttachments([{
                    fileName: response.data.attributes.fileName,
                    id: response.data.attributes.fullId
                }]);
            }
        })
    }

    const downloadPrimaryContent = () => {
        ContentHolderService.downloadPrimaryContentBlob(entityId).then(response => {
            downloadFile(response);
        })
    }

    const downloadAttachmentContent = (contentId) => {
        ContentHolderService.downloadAttachmentBlob(entityId, contentId).then(response => {
            downloadFile(response);
        })
    }

    const handlePreview = (file) => {

    }

    const downloadFile = (response) => {
        // Extract MIME type
        const mimeType = response.headers["content-type"];

        // Get filename from headers or dynamically append extension
        const filename = getFilenameFromHeaders(response.headers, mimeType);

        const blob = new Blob([response.data], { type: mimeType });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const getFilenameFromHeaders = (headers, mimeType) => {
        const contentDisposition = headers["content-disposition"];
        if (contentDisposition) {
            // Expression pour capturer `filename="xxx.ext"` ou `filename=xxx.ext`
            const match = contentDisposition.match(/filename\*?=([^;]+)/);

            if (match) {
                return match[1].replace(/["']/g, "").trim();
            }
        }

        // Default filename if Content-Disposition is missing
        let defaultName = "downloaded-file";

        // Extract extension dynamically from MIME type (e.g., "image/png" -> ".png")
        const extension = mimeType ? `.${mimeType.split("/")[1]}` : "";

        return defaultName + extension;
    };


    const handleUpload = ({file, onSuccess}) => {
        if(!file) return;
        setTimeout(() => {
            let fileBlob = new Blob([file], {type: file.type});
            let formData = new FormData();
            formData.append('file', fileBlob);
            formData.append('id', entityId);

            if (!hasPrimaryContent) {
                ContentHolderService.setPrimaryContentFile(entityId, formData, file.name).then( response => {
                    loadPrimaryContent();
                })
            } else {
                ContentHolderService.addAttachment(entityId, formData, file.name).then( response => {
                    loadAttachmentContent();
                })
            }

            onSuccess("ok");
        }, 1000);
    };

    const handleDelete = (key) => {
        ContentHolderService.deletePrimaryContent(entityId).then(response => {
            setHasPrimaryContent(false);
            setPrimaryFileName(null);
            loadPrimaryContent();
        })
    };

    const handleDeleteAttachment = (attachmentId) => {
        ContentHolderService.deleteAttachmentContent(entityId, attachmentId).then(response => {
            loadAttachmentContent();
        })
    }

    const columns = [
        {
            title: t("file.filename_col"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("file.action_col"),
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="text" icon={<CloudDownloadOutlined/>} onClick={downloadPrimaryContent}/>
                    <Popconfirm
                        title={t("file.delete_file_confirm")}
                        onConfirm={() => handleDelete(record.key)}
                        okText={t("common.yes")}
                        cancelText={t("common.no")}
                    >
                        <Button type="text" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>

                </>
            ),
        },
    ];

    const columnsAttachments = [
        {
            title: t("file.filename_col"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("file.action_col"),
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="text" icon={<CloudDownloadOutlined/>} onClick={() => downloadAttachmentContent(record.id)}/>
                    <Popconfirm
                        title={t("file.delete_file_confirm")}
                        onConfirm={() => handleDeleteAttachment(record.id)}
                        okText={t("common.yes")}
                        cancelText={t("common.no")}
                    >
                        <Button type="text" danger icon={<DeleteOutlined/>}/>
                    </Popconfirm>

                </>
            ),
        },
    ];

    const primaryContentDisplay = () => {
        return <>
            {hasPrimaryContent && (
                <>
                    <h3 style={{marginTop: 20}}>{t("file.primary_file")}</h3>
                    <Table
                        columns={[
                            ...columns.filter((col) => col.key !== "action"),
                            {
                                title: t("file.status_col"),
                                key: "status",
                                render: () => <StarFilled style={{color: "gold"}}/>,
                            },
                            columns.find((col) => col.key === "action"),
                        ]}
                        dataSource={[{
                            name: primaryFileName
                        }]}
                        pagination={false}
                        rowKey="key"
                    />
                </>
            )}
        </>
    }

    const attachmentsDatas = () => {
        const datas = [];
        attachments.map(data => {
            datas.push({
                id: data.id,
                name: data.fileName
            })
        })
        return datas;
    }

    const attachmentsContentDisplay = () => {
        return <>
            {attachments && attachments.length > 0 && (
                <>
                    <h3 style={{marginTop: 20}}>{t("file.attachments_title")}</h3>
                    <Table
                        size={"small"}
                        columns={columnsAttachments}
                        dataSource={attachmentsDatas()}
                        pagination={{pageSize: 5}}
                        rowKey="key"
                    />
                </>
            )}
        </>
    }

    return (
        <>
            <strong>{t("file.contents_section")}</strong>
            <Button type="primary"
                    className={FormStyle.button_cancel} style={{width: "100%"}}
                    onClick={() => setVisible(true)}>
                {t("file.manage_btn")}
            </Button>

            <Modal
                destroyOnClose={true}
                title={t("file.management_title")}
                open={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                width={650}
            >
                <Upload.Dragger
                    customRequest={handleUpload}
                    showUploadList={false}
                    multiple
                    accept="application/pdf,application/doc,application/docx,application/txt,application/csv,application/xls"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">{t("file.upload_drag_text")}</p>
                </Upload.Dragger>

                {primaryContentDisplay()}
                {attachmentsContentDisplay()}
            </Modal>
        </>
    );
};

export default FileUploadManager;
