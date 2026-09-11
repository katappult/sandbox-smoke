import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {Spin} from "antd";
import {
    EditOutlined,
    FolderOpenOutlined,
    InfoOutlined,
    LocationOnOutlined,
    PhoneOutlined,
    TimelineOutlined,
} from "@mui/icons-material";
import {PanierService} from "@/services/generated/Panier.services";
import {responseSuccess} from "@/utils";
import s from "@/styles/pages/Info.module.css";
import p from "@/styles/pages/Profile.module.css";
import BackButton from "@/components/common/BackButton";
import TableEmpty from "@/components/common/TableEmpty";
import SectionCard from "@/components/common/info/SectionCard";
import InfoFieldItemView from "@/components/common/info/InfoFieldItemView";
import InfoFieldBoolView from "@/components/common/info/InfoFieldBoolView";
import InfoFieldSummaryView from "@/components/common/info/InfoFieldSummaryView";
import InfoFieldImagesView from "@/components/common/info/InfoFieldImagesView";
//IMPORT

const EDIT_URL = "/generated/region/edit/";

const NAV_ITEMS = [
    {id: "informations", label: "Informations", Icon: InfoOutlined},
    // ── Navs ─
];


// ── Main component ────────────────────────────────────────

export default function PanierInfo({uid}) {
    const router = useRouter();
    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("informations");
    const el = entity;

    const loadEntity = () => {
        if (!uid) return;
        setLoading(true);
        PanierService.detailsEntity(uid).then((response) => {
            if (responseSuccess(response)) {
                setEntity(response.data);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        loadEntity();
    }, [uid]);

    const makePatcher = (fieldKey) => async (value) => {
        const res = await PanierService.patchEntity(uid, {[fieldKey]: value});
        if (responseSuccess(res)) {
            setEntity((prev) => ({...prev, [fieldKey]: value}));
        } else {
            message.error("Update failed!");
            throw new Error("patch failed");
        }
    };

    const scrollTo = (sectionId) => {
        setActiveSection(sectionId);
        document.getElementById(sectionId)?.scrollIntoView({behavior: "smooth", block: "start"});
    };

    if (loading) {
        return (
            <div className={s.loading_container}>
                <Spin size="large"/>
            </div>
        );
    }

    if (!entity) return <TableEmpty title={'Element introuvable'}/>;

    const editAction = (
        <Link href={EDIT_URL + uid}>
            <button className={s.section_edit_btn}>
                <EditOutlined style={{fontSize: 12}}/>
                Modifier
            </button>
        </Link>
    );

    return (
        <div>
            {/* ── Top bar ── */}
            <div className={s.top_bar}>
                <BackButton/>
                {entity.number && (
                    <span className={s.ref_badge}>Ref: #{entity.number}</span>
                )}
            </div>

            {/* ── Layout ── */}
            <div className={p.root}>
                {/* Sidenav */}
                <nav className={p.sidenav}>
                    {NAV_ITEMS.map(({id: sectionId, label, Icon}) => (
                        <button
                            key={sectionId}
                            className={`${p.sidenav_item} ${activeSection === sectionId ? p.sidenav_item_active : ""}`}
                            onClick={() => scrollTo(sectionId)}
                        >
                            <span className={p.sidenav_icon}>
                                <Icon style={{fontSize: 15}}/>
                            </span>
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className={p.page}>

                    {/* ── Hero card ── */}
                    <InfoFieldSummaryView data={{
                        title: "Summary of element",
                        avatar: {
                            initials: "IR"
                        }
                    }}/>

                    {/* ── Images ── */}
                    <InfoFieldImagesView allIllustrations={entity.allIllustrations}  onAddToThumbed={loadEntity}
                            thumbedId={entity.fullId} thumbedUid={entity.uid}/>

                    <SectionCard
                        id="informations"
                        title="Informations sur l'élément"
                        desc="Données & informations sur l'élément"
                        action={editAction}
                    >
                        <div className={s.fields_grid}>
                            {/* ── INFOS DATAS ── */}
                        </div>
                    </SectionCard>

                     {/* Behaviours */}

                </div>
            </div>
        </div>
    )
}
