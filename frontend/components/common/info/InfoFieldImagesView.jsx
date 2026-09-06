import s from "@/styles/pages/Info.module.css";
import { Carousel } from "antd";
import {
    AppstoreOutlined,
    EditOutlined,
    LoadingOutlined,
    PictureOutlined,
    ReloadOutlined,
    SlidersOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { toThumbFullURL } from "@/utils";
import React, { useState } from "react";
import MediaLibrary from "@/components/common/mediaLibrary/MediaLibrary";
import { useTranslation } from "react-i18next";

const VIEW_MODES = [
    { key: "carousel", icon: <SlidersOutlined />,       titleKey: "images.view_carousel" },
    { key: "grid",     icon: <AppstoreOutlined />,      titleKey: "images.view_grid" },
    { key: "strip",    icon: <UnorderedListOutlined />, titleKey: "images.view_strip" },
];

export default function InfoFieldImagesView({ allIllustrations = [], thumbedId, onAddToThumbed, onRefresh }) {
    const { t } = useTranslation();
    const [mediaOpen, setMediaOpen]   = useState(false);
    const [viewMode, setViewMode]     = useState("carousel");
    const [refreshing, setRefreshing] = useState(false);
    const canEdit = !!thumbedId;

    const handleRefresh = async () => {
        if (!onRefresh) return;
        setRefreshing(true);
        try { await onRefresh(); } finally { setRefreshing(false); }
    };

    const handleAddToThumbed = () => {
        setMediaOpen(false);
        onAddToThumbed?.();
    };

    const hasImages = allIllustrations?.length > 0;

    return (
        <>
            {hasImages ? (
                <div className={s.images_section}>
                    {/* Floating controls */}
                    <div className={s.images_controls}>
                        <div className={s.images_view_switcher}>
                            {VIEW_MODES.map(({ key, icon, titleKey }) => (
                                <button
                                    key={key}
                                    title={t(titleKey)}
                                    className={`${s.ctrl_btn} ${viewMode === key ? s.ctrl_btn_active : ""}`}
                                    onClick={() => setViewMode(key)}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <div className={s.images_ctrl_actions}>
                            {onRefresh && (
                                <button className={s.ctrl_btn} title={t("images.refresh")} onClick={handleRefresh} disabled={refreshing}>
                                    {refreshing ? <LoadingOutlined /> : <ReloadOutlined />}
                                </button>
                            )}
                            {canEdit && (
                                <button className={s.ctrl_btn_primary} title={t("images.manage")} onClick={() => setMediaOpen(true)}>
                                    <EditOutlined />
                                </button>
                            )}
                        </div>
                    </div>

                    {viewMode === "carousel" && (
                        <Carousel arrows infinite={false}>
                            {allIllustrations.map((image, i) => (
                                <div key={i} className={s.carousel_slide}>
                                    <img src={toThumbFullURL(image)} alt={t("images.illustration_alt", { n: i + 1 })} className={s.carousel_img} />
                                </div>
                            ))}
                        </Carousel>
                    )}

                    {viewMode === "grid" && (
                        <div className={s.images_grid}>
                            {allIllustrations.slice(0, 4).map((image, i) => (
                                <div key={i} className={s.grid_item}>
                                    <img src={toThumbFullURL(image, 300)} alt={t("images.illustration_alt", { n: i + 1 })} className={s.grid_img} />
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === "strip" && (
                        <div className={s.images_strip}>
                            {allIllustrations.map((image, i) => (
                                <div key={i} className={s.strip_item}>
                                    <img src={toThumbFullURL(image, 300)} alt={t("images.illustration_alt", { n: i + 1 })} className={s.strip_img} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : canEdit ? (
                <button className={s.images_empty_btn} onClick={() => setMediaOpen(true)}>
                    <PictureOutlined style={{ fontSize: 28, opacity: 0.4 }} />
                    <span>{t("images.add_illustrations")}</span>
                </button>
            ) : null}

            {mediaOpen && (
                <MediaLibrary
                    open
                    onClose={() => setMediaOpen(false)}
                    thumbedId={thumbedId}
                    onAddToThumbed={handleAddToThumbed}
                />
            )}
        </>
    );
}
