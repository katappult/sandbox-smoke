import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Checkbox,
    Divider,
    Input,
    Modal,
    Popconfirm,
    Spin,
    Tooltip,
    Upload,
    message,
} from "antd";
import {
    CloudDownloadOutlined,
    DeleteOutlined,
    EditOutlined,
    PlayCircleFilled,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import TableEmpty from "@/components/common/TableEmpty";
import { mediaLibraryService } from "@/services/MediaLibrary.service";
import { thumbService } from "@/services/Thumb.service";
import {responseSuccess, toThumbFullURL} from "@/utils";
import s from "./MediaLibrary.module.css";

function useContentTypeOptions() {
    const { t } = useTranslation();
    return [
        { label: t("media.filter_all"), value: "" },
        { label: t("media.filter_images"), value: "image" },
        { label: t("media.filter_videos"), value: "video" },
        { label: t("media.filter_documents"), value: "application/pdf" },
    ];
}

const PAGE_SIZE = 49;
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 200;

function MediaLibraryContent({ thumbedId, onAddToThumbed, showAssetActions = false }) {
    const { t } = useTranslation();
    const CONTENT_TYPE_OPTIONS = useContentTypeOptions();
    const [assets, setAssets] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [contentType, setContentType] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState(new Set());
    const [deletingMultiple, setDeletingMultiple] = useState(false);
    const [addingToThumbed, setAddingToThumbed] = useState(false);
    const searchTimeout = useRef(null);

    const load = useCallback(
        async (p = page, s = search, ct = contentType, bustCache = false) => {
            setLoading(true);
            try {
                const res = await mediaLibraryService.browse({
                    page: p,
                    pageSize: PAGE_SIZE,
                    search: s,
                    contentType: ct,
                    bustCache,
                });
                const items = res.data?.dataList ?? [];
                setAssets(prev => p === 0 ? items : [...prev, ...items]);
                setTotalCount(res.data?.totalCount ?? 0);
            } finally {
                setLoading(false);
            }
        },
        [page, search, contentType]
    );

    useEffect(() => {
        load(page, search, contentType);
    }, [page, contentType]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            setPage(0);
            load(0, val, contentType);
        }, 400);
    };

    const handleContentTypeChange = (val) => {
        setContentType(val);
        setPage(0);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isVideo && file.size > MAX_VIDEO_MB * 1024 * 1024) {
            message.error(t("media.upload_size_error_video", { max: MAX_VIDEO_MB, name: file.name }));
            return Upload.LIST_IGNORE;
        }

        if (isImage && file.size > MAX_IMAGE_MB * 1024 * 1024) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const MAX_DIM = 1920;
                        let { width, height } = img;
                        if (width > MAX_DIM || height > MAX_DIM) {
                            if (width >= height) {
                                height = Math.round(height * MAX_DIM / width);
                                width = MAX_DIM;
                            } else {
                                width = Math.round(width * MAX_DIM / height);
                                height = MAX_DIM;
                            }
                        }
                        const canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                        canvas.toBlob((blob) => {
                            const resized = new File([blob], file.name, { type: "image/jpeg" });
                            message.info(t("media.upload_resized", { name: file.name }));
                            resolve(resized);
                        }, "image/jpeg", 0.85);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        return true;
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        try {
            const res = await mediaLibraryService.upload(file);
            if (res.status === 200 || res.status === 201) {
                message.success(t("media.upload_success", { name: file.name }));
                onSuccess("ok");
                setPage(0);
                await load(0, search, contentType, true);
            } else {
                message.error(t("media.upload_error", { name: file.name }));
                onError(new Error("Upload failed"));
            }
        } catch {
            message.error(t("media.upload_error_generic"));
            onError(new Error("Upload error"));
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (asset) => {
        const link = document.createElement("a");
        link.href = asset.url;
        link.setAttribute("download", asset.originalName);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === assets.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(assets.map((a) => a.id)));
        }
    };

    const handleDeleteSelected = async () => {
        setDeletingMultiple(true);
        try {
            await mediaLibraryService.deleteMultipleAssets([...selected]);
            message.success(t("media.delete_success", { count: selected.size }));
            setSelected(new Set());
            setPage(0);
            return load(0, search, contentType);
        } catch {
            message.error(t("media.delete_error"));
        } finally {
            setDeletingMultiple(false);
        }
    };

    const handleRename = async (asset, name) => {
        const id = asset.uid;
        const res = await mediaLibraryService.renameAsset(id, name);
        if (responseSuccess(res)) {
            setAssets(prev => prev.map(a => a.uid === id ? { ...a, originalName: name } : a));
        } else {
            message.error(t("media.rename_error"));
        }
    };

    const handleAddToThumbed = async () => {
        if (!thumbedId) return;
        setAddingToThumbed(true);
        try {
            await Promise.all(
                [...selected].map((id) => thumbService.addThumbFromLibrary(thumbedId, id))
            );
            message.success(t("media.add_to_entity_success", { count: selected.size }));
            setSelected(new Set());
            onAddToThumbed?.();
        } catch {
            message.error(t("media.add_to_entity_error"));
        } finally {
            setAddingToThumbed(false);
        }
    };

    const allSelected = assets.length > 0 && selected.size === assets.length;
    const someSelected = selected.size > 0;

    const uploadButton = (
        <Upload customRequest={handleUpload} beforeUpload={beforeUpload} showUploadList={false} multiple>
            <Button type="primary" icon={<PlusOutlined />} loading={uploading}>
                {t("media.add_btn")}
            </Button>
        </Upload>
    );

    return (
        <div className={s.root}>
            {/* Toolbar */}
            <div className={`${s.toolbar} mb-8`}>
                <div className={s.toolbar_left}>
                    <Checkbox
                        indeterminate={someSelected && !allSelected}
                        checked={allSelected}
                        onChange={toggleSelectAll}
                    />
                    <Divider type="vertical" />
                    <Input.Search
                        placeholder={t("media.search_placeholder")}
                        value={search}
                        onChange={handleSearchChange}
                        allowClear
                        className={s.search_input}
                    />
                    {!someSelected && (
                        <>
                            <div className="flex items-center bg-surface-container-low rounded-full p-0.5 gap-0.5">
                                {CONTENT_TYPE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleContentTypeChange(opt.value)}
                                        className={
                                            contentType === opt.value
                                                ? "px-3 py-1 text-xs font-semibold rounded-full bg-white text-primary shadow-sm transition-all cursor-pointer border-0"
                                                : "px-3 py-1 text-xs font-medium rounded-full bg-transparent text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer border-0"
                                        }
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => load(page, search, contentType)}
                                size="small"
                            />
                        </>
                    )}
                </div>
                <div className={s.toolbar_right}>
                    {someSelected ? (
                        <>
                            <span style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>
                                {t("media.selected_count", { count: selected.size })}
                            </span>
                            <Divider type="vertical" />
                            {thumbedId && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    loading={addingToThumbed}
                                    onClick={handleAddToThumbed}
                                    size="small"
                                >
                                    {t("media.add_to_entity_btn")}
                                </Button>
                            )}
                            <Popconfirm
                                title={t("media.delete_confirm", { count: selected.size })}
                                onConfirm={handleDeleteSelected}
                                okText={t("common.yes")}
                                cancelText={t("common.no")}
                                okButtonProps={{ danger: true }}
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={deletingMultiple}
                                    size="small"
                                >
                                    {t("media.delete_btn")}
                                </Button>
                            </Popconfirm>
                        </>
                    ) : (
                        uploadButton
                    )}
                </div>
            </div>

            {/* Grid */}
            <Spin spinning={loading}>
                {assets.length === 0 && !loading ? (
                    <TableEmpty
                        title={t("media.empty_title")}
                        description={t("media.empty_desc")}
                        action={uploadButton}
                    />
                ) : (
                    <div className={s.grid}>
                        {assets.map((asset) => (
                            <AssetCard
                                key={asset.uid}
                                asset={asset}
                                selected={selected.has(asset.oid)}
                                onToggle={() => toggleSelect(asset.oid)}
                                onDownload={() => handleDownload(asset)}
                                onRename={(name) => handleRename(asset, name)}
                                showActions={showAssetActions}
                            />
                        ))}
                    </div>
                )}
            </Spin>

            {/* Load More */}
            {assets.length < totalCount && (
                <div className={s.pagination}>
                    <Button
                        onClick={() => setPage(p => p + 1)}
                        loading={loading}
                        className="rounded-full"
                    >
                        {t("media.load_more", { current: assets.length, total: totalCount })}
                    </Button>
                </div>
            )}
        </div>
    );
}

function useMediaTypeConfig() {
    const { t } = useTranslation();
    return {
        image:   { label: t("media.type_image"),    bgClass: "bg-blue-50",   iconColor: "#3b82f6" },
        video:   { label: t("media.type_video"),    bgClass: "bg-purple-50", iconColor: "#a855f7" },
        pdf:     { label: t("media.type_pdf"),      bgClass: "bg-red-50",    iconColor: "#ef4444" },
        document:{ label: t("media.type_document"), bgClass: "bg-amber-50",  iconColor: "#f59e0b" },
    };
}

function getMediaType(contentType) {
    if (!contentType) return "document";
    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";
    if (contentType === "application/pdf") return "pdf";
    return "document";
}

function VideoThumbnail({ src, className }) {
    const canvasRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true;
        video.src = src;
        video.onloadedmetadata = () => {
            video.currentTime = Math.min(1, video.duration * 0.1);
        };
        video.onseeked = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            setReady(true);
            video.src = "";
        };
        video.onerror = () => { video.src = ""; };
    }, [src]);

    return (
        <>
            <canvas ref={canvasRef} className={className} style={{ display: ready ? "block" : "none" }} />
        </>
    );
}

function VideoPreviewModal({ asset, onClose }) {
    return (
        <Modal
            open
            onCancel={onClose}
            footer={null}
            width={800}
            title={asset.originalName}
            destroyOnClose
            centered
        >
            <video
                src={toThumbFullURL(asset.url)}
                controls
                autoPlay
                style={{ width: "100%", borderRadius: 8, maxHeight: "70vh" }}
            />
        </Modal>
    );
}

function RenameModal({ currentName, onConfirm, onClose }) {
    const { t } = useTranslation();
    const [value, setValue] = useState(currentName);
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        if (!value.trim() || value === currentName) { onClose(); return; }
        setLoading(true);
        await onConfirm(value.trim());
        setLoading(false);
        onClose();
    };

    return (
        <Modal
            open
            title={t("media.rename_modal_title")}
            onCancel={onClose}
            onOk={handleOk}
            okText={t("media.rename_ok")}
            cancelText={t("common.cancel")}
            confirmLoading={loading}
            destroyOnClose
            centered
            width={400}
        >
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onPressEnter={handleOk}
                autoFocus
            />
        </Modal>
    );
}

function AssetCard({ asset, selected, onToggle, onDownload, onRename, showActions }) {
    const { t } = useTranslation();
    const MEDIA_TYPE_CONFIG = useMediaTypeConfig();
    const [videoOpen, setVideoOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const type = getMediaType(asset.contentType);
    const { bgClass, label } = MEDIA_TYPE_CONFIG[type];
    const isImage = type === "image";
    const isVideo = type === "video";

    return (
        <>
            <div className={`${s.card} ${selected ? s.card_selected : ""}`} onClick={onToggle}>
                <div className={s.card_check}>
                    <Checkbox checked={selected} onChange={onToggle} onClick={(e) => e.stopPropagation()} />
                </div>
                <div className={`${s.card_preview} ${bgClass}`}>
                    {isImage ? (
                        <img src={toThumbFullURL(asset.url, 300)} alt={asset.originalName} className={s.card_img} />
                    ) : isVideo ? (
                        <>
                            <VideoThumbnail src={toThumbFullURL(asset.url)} className={s.card_img} />
                            <button
                                className={s.card_play}
                                onClick={(e) => { e.stopPropagation(); setVideoOpen(true); }}
                            >
                                <PlayCircleFilled style={{ fontSize: 36, color: "#fff" }} />
                            </button>
                        </>
                    ) : (
                        <div className={s.card_placeholder}>
                            <span className={s.card_type_label}>{label}</span>
                        </div>
                    )}
                    {showActions && (
                        <div className={s.card_overlay}>
                            <Tooltip title={t("media.rename_tooltip")}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    className={s.card_overlay_btn}
                                    onClick={(e) => { e.stopPropagation(); setRenameOpen(true); }}
                                />
                            </Tooltip>
                            <Tooltip title={t("media.download_tooltip")}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<CloudDownloadOutlined />}
                                    className={s.card_overlay_btn}
                                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                                />
                            </Tooltip>
                        </div>
                    )}
                </div>
                <div className={s.card_footer}>
                    <Tooltip title={asset.originalName}>
                        <span className={s.card_name}>{asset.originalName}</span>
                    </Tooltip>
                </div>
            </div>
            {videoOpen && <VideoPreviewModal asset={asset} onClose={() => setVideoOpen(false)} />}
            {renameOpen && (
                <RenameModal
                    currentName={asset.originalName}
                    onConfirm={onRename}
                    onClose={() => setRenameOpen(false)}
                />
            )}
        </>
    );
}

/**
 * MediaLibrary — gestion des médias (upload, download, suppression, ajout à thumbed).
 *
 * @param {object}   props
 * @param {boolean}  [props.inline=false]        - Affichage inline (true) ou dans un Modal (false)
 * @param {boolean}  [props.open]                - Contrôle l'ouverture du Modal (ignoré si inline)
 * @param {function} [props.onClose]             - Callback fermeture Modal
 * @param {string}   [props.thumbedId]           - Si fourni, active le bouton "Ajouter à thumbed"
 * @param {function} [props.onAddToThumbed]      - Callback après ajout à thumbed
 */
export default function MediaLibrary({ inline = false, open, onClose, thumbedId, onAddToThumbed }) {
    const { t } = useTranslation();

    if (inline) {
        return <MediaLibraryContent thumbedId={thumbedId} onAddToThumbed={onAddToThumbed} showAssetActions />;
    }

    return (
        <Modal
            title={t("media.modal_title")}
            open={open}
            onCancel={onClose}
            footer={null}
            width={900}
            destroyOnClose
        >
            <MediaLibraryContent thumbedId={thumbedId} onAddToThumbed={onAddToThumbed} />
        </Modal>
    );
}
