import React, {useCallback, useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Popconfirm, Spin, Tooltip, Typography, Upload,} from "antd";
import {
    DeleteOutlined,
    DownloadOutlined,
    EyeOutlined,
    FileOutlined,
    FolderOpenOutlined,
    InboxOutlined,
    LinkOutlined,
    PaperClipOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {ContentHolderService} from "@/services/ContentHolder.services";
import style from "@/styles/components/ContentHolderManager.module.css";
import SectionCard from "@/components/common/info/SectionCard";
import DrawerCollapsibleSection from "@/components/common/drawer/DrawerCollapsibleSection";

const {Text, Link} = Typography;
const {Dragger} = Upload;

/**
 * Composant de gestion des contenus d'un IContentHolder.
 *
 * Gère :
 *  - Le contenu primaire (fichier ou URL externe) : affichage, upload, set URL, download, suppression
 *  - Les pièces jointes : liste, ajout (fichier ou URL), download individuel, suppression
 *
 * @param {object}  props
 * @param {string}  props.contentHolderId - ID encodé du content holder (ex: ObjectIdentifierUtils.encode(fullId))
 * @param {boolean} [props.readOnly=false] - Si true, désactive toutes les actions d'écriture
 */
export default function ContentHolderManager({contentHolderId, readOnly = false, drawer = false}) {
    const [loading, setLoading] = useState(false);
    const [primary, setPrimary] = useState(null);
    const [attachments, setAttachments] = useState([]);

    // --- états des modals ---
    const [uploadModal, setUploadModal] = useState({open: false, role: "primary"});
    const [urlModal, setUrlModal] = useState({open: false, role: "primary"});
    const [urlInput, setUrlInput] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const loadContent = useCallback(async () => {
        if (!contentHolderId) return;
        setLoading(true);
        try {
            const data = await ContentHolderService.getContentInfo(contentHolderId);
            setPrimary(data.primary);
            setAttachments(data.attachments);
        } catch {
            message.error("Impossible de charger les contenus.");
        } finally {
            setLoading(false);
        }
    }, [contentHolderId]);

    useEffect(() => {
        loadContent();
    }, [loadContent]);

    // =========================================================================
    // Upload fichier
    // =========================================================================

    const openUploadModal = (role) => {
        setUploadFile(null);
        setUploadModal({open: true, role});
    };

    const handleUploadConfirm = async () => {
        if (!uploadFile) {
            message.warning("Veuillez sélectionner un fichier.");
            return;
        }

        try {
            setUploading(true);
            await ContentHolderService.uploadFile(contentHolderId, uploadModal.role, uploadFile);
            message.success("Fichier uploadé avec succès.");
            setUploadModal({open: false, role: "primary"});
            await loadContent();
        } catch(error) {
            message.error("Échec de l'upload.");
        } finally {
            setUploading(false);
        }
    };

    // =========================================================================
    // Set URL
    // =========================================================================

    const openUrlModal = (role) => {
        setUrlInput("");
        setUrlModal({open: true, role});
    };

    const handleUrlConfirm = async () => {
        if (!urlInput.trim()) {
            message.warning("Veuillez saisir une URL.");
            return;
        }
        setUploading(true);
        try {
            await ContentHolderService.setUrl(contentHolderId, urlModal.role, urlInput.trim());
            message.success("URL enregistrée.");
            setUrlModal({open: false, role: "primary"});
            await loadContent();
        } catch {
            message.error("Impossible d'enregistrer l'URL.");
        } finally {
            setUploading(false);
        }
    };

    // =========================================================================
    // Download
    // =========================================================================

    const handleDownload = async (role, contentItemId, fileName) => {
        try {
            await ContentHolderService.downloadContent(contentHolderId, role, contentItemId, fileName);
        } catch {
            message.error("Échec du téléchargement.");
        }
    };

    // =========================================================================
    // Suppression
    // =========================================================================

    const handleDelete = async (role, contentItemId) => {
        try {
            await ContentHolderService.deleteContent(contentHolderId, role, contentItemId);
            message.success("Contenu supprimé.");
            await loadContent();
        } catch {
            message.error("Impossible de supprimer le contenu.");
        }
    };

    // =========================================================================
    // Render helpers
    // =========================================================================

    const renderPrimaryContent = () => {
        if (!primary) {
            return <div className={style.empty_state}>Aucun contenu primaire</div>;
        }

        return (
            <div className={style.primary_content}>
                {primary.url
                    ? <LinkOutlined style={{color: "#1677ff", fontSize: 18, flexShrink: 0}}/>
                    : <FileOutlined style={{color: "#1677ff", fontSize: 18, flexShrink: 0}}/>
                }
                {primary.url ? (
                    <Link href={primary.url} target="_blank" className={style.primary_url}>
                        {primary.url}
                    </Link>
                ) : (
                    <span className={style.primary_filename}>{primary.fileName}</span>
                )}
                <div className={style.actions}>
                    {primary.url && (
                        <Tooltip title="Ouvrir dans un nouvel onglet">
                            <Button
                                size="small"
                                icon={<EyeOutlined/>}
                                onClick={() => window.open(primary.url, "_blank")}
                            />
                        </Tooltip>
                    )}
                    {!primary.url && (
                        <Tooltip title="Télécharger">
                            <Button
                                size="small"
                                icon={<DownloadOutlined/>}
                                onClick={() => handleDownload("primary", null, primary.fileName)}
                            />
                        </Tooltip>
                    )}
                    {!readOnly && (
                        <Popconfirm
                            title="Supprimer le contenu primaire ?"
                            onConfirm={() => handleDelete("primary")}
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{danger: true}}
                        >
                            <Tooltip title="Supprimer">
                                <Button size="small" danger icon={<DeleteOutlined/>}/>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </div>
            </div>
        );
    };

    const renderAttachmentItem = (item) => (
        <div className={style.attachment_row} key={item.id}>
            {item.url
                ? <LinkOutlined style={{color: "#8c8c8c", flexShrink: 0}}/>
                : <PaperClipOutlined style={{color: "#8c8c8c", flexShrink: 0}}/>
            }
            {item.url ? (
                <Link href={item.url} target="_blank" className={style.attachment_name}>
                    {item.url}
                </Link>
            ) : (
                <span className={style.attachment_name}>{item.fileName}</span>
            )}
            <div className={style.actions}>
                {item.url && (
                    <Tooltip title="Ouvrir dans un nouvel onglet">
                        <Button
                            size="small"
                            icon={<EyeOutlined/>}
                            onClick={() => window.open(item.url, "_blank")}
                        />
                    </Tooltip>
                )}
                {!item.url && (
                    <Tooltip title="Télécharger">
                        <Button
                            size="small"
                            icon={<DownloadOutlined/>}
                            onClick={() => handleDownload("attachments", item.id, item.fileName)}
                        />
                    </Tooltip>
                )}
                {!readOnly && (
                    <Popconfirm
                        title="Supprimer cette pièce jointe ?"
                        onConfirm={() => handleDelete("attachments", item.id)}
                        okText="Supprimer"
                        cancelText="Annuler"
                        okButtonProps={{danger: true}}
                    >
                        <Tooltip title="Supprimer">
                            <Button size="small" danger icon={<DeleteOutlined/>}/>
                        </Tooltip>
                    </Popconfirm>
                )}
            </div>
        </div>
    );

    // =========================================================================
    // Render
    // =========================================================================

    const content = () => {
        return <Spin spinning={loading}>
            <div className={style.container}>

                {/* ---- Contenu primaire ---- */}
                <div className={style.section}>
                    <div className={style.section_header}>
                        <span className={style.section_title}>
                            <FileOutlined/> Contenu primaire
                        </span>
                        {!readOnly && (
                            <div className={style.actions}>
                                <Tooltip title="Uploader un fichier">
                                    <Button
                                        size="small"
                                        icon={<InboxOutlined/>}
                                        onClick={() => openUploadModal("primary")}
                                    >
                                        Fichier
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Définir une URL externe">
                                    <Button
                                        size="small"
                                        icon={<LinkOutlined/>}
                                        onClick={() => openUrlModal("primary")}
                                    >
                                        URL
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                    {renderPrimaryContent()}
                </div>

                {/* ---- Pièces jointes ---- */}
                <div className={style.section}>
                    <div className={style.section_header}>
                        <span className={style.section_title}>
                            <PaperClipOutlined/> Pièces jointes ({attachments.length})
                        </span>
                        {!readOnly && (
                            <div className={style.actions}>
                                <Tooltip title="Ajouter un fichier">
                                    <Button
                                        size="small"
                                        icon={<PlusOutlined/>}
                                        onClick={() => openUploadModal("attachments")}
                                    >
                                        Fichier
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Ajouter une URL externe">
                                    <Button
                                        size="small"
                                        icon={<LinkOutlined/>}
                                        onClick={() => openUrlModal("attachments")}
                                    >
                                        URL
                                    </Button>
                                </Tooltip>
                            </div>
                        )}
                    </div>

                    {attachments.length === 0 ? (
                        <div className={style.empty_state}>Aucune pièce jointe</div>
                    ) : (
                        <List
                            size="small"
                            dataSource={attachments}
                            renderItem={renderAttachmentItem}
                        />
                    )}
                </div>
            </div>

            {/* ---- Modal upload fichier ---- */}
            <Modal
                title={
                    uploadModal.role === "primary"
                        ? "Uploader le contenu primaire"
                        : "Ajouter une pièce jointe"
                }
                open={uploadModal.open}
                onOk={handleUploadConfirm}
                onCancel={() => setUploadModal({open: false, role: "primary"})}
                okText="Uploader"
                cancelText="Annuler"
                confirmLoading={uploading}
                destroyOnClose
            >
                <Dragger
                    multiple={false}
                    beforeUpload={(file) => {
                        setUploadFile(file);
                        return false; // empêche l'upload automatique d'antd
                    }}
                    onRemove={() => setUploadFile(null)}
                    maxCount={1}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">
                        Glissez un fichier ici ou cliquez pour sélectionner
                    </p>
                    <p className="ant-upload-hint">Un seul fichier accepté</p>
                </Dragger>
            </Modal>

            {/* ---- Modal URL externe ---- */}
            <Modal
                title={
                    urlModal.role === "primary"
                        ? "Définir l'URL du contenu primaire"
                        : "Ajouter une URL en pièce jointe"
                }
                open={urlModal.open}
                onOk={handleUrlConfirm}
                onCancel={() => setUrlModal({open: false, role: "primary"})}
                okText="Enregistrer"
                cancelText="Annuler"
                confirmLoading={uploading}
                destroyOnClose
            >
                <Input
                    prefix={<LinkOutlined style={{color: "#bbb"}}/>}
                    placeholder="https://example.com/document.pdf"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onPressEnter={handleUrlConfirm}
                    autoFocus
                />
                <div className={style.url_input_hint}>
                    URL publique vers le fichier distant (CDN, stockage cloud, etc.)
                </div>
            </Modal>
        </Spin>
    }

    if (drawer) {
        return <DrawerCollapsibleSection
            icon={<FolderOpenOutlined/>}
            label="Documents"
        >
            <div style={{marginTop: 20}}>
                {content()}
            </div>
        </DrawerCollapsibleSection>
    }

    return <SectionCard
        id="documents"
        title="Documents"
        desc="Fichiers et pièces jointes associés au dossier"
    >
        {content()}
    </SectionCard>
}
