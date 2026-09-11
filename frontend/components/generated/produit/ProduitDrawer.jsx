import React from 'react';
import Link from "next/link";
import {Drawer} from "antd";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";
import DrawerStyle from "@/styles/components/Drawer.module.css";
import ds from "@/styles/components/Drawer2.module.css";
import Badge from "@/components/common/Badge";
import DrawerFieldRow from "@/components/common/drawer/DrawerFieldRow";
import DrawerFieldBoolRow from "@/components/common/drawer/DrawerFieldBoolRow";
import DrawerImagesView from "@/components/common/drawer/DrawerImagesView";
//IMPORT

const EDIT_URL = "/generated/produit/edit/";

export default function ProduitDetailsDrawer({
                                                 isVisible,
                                                 hideDetails,
                                                 drawerTitle,
                                                 selectedElement,
                                                 refreshListView,
                                             }) {
    const el = selectedElement;

    return (
        <Drawer
            closable={false}
            placement="right"
            width={420}
            maskClosable={false}
            className={DrawerStyle.drawer}
            open={isVisible}
        >
            {/* ── Header ── */}
            <div className={DrawerStyle.drawer_header}>
                <button className={DrawerStyle.close_button} onClick={hideDetails}>
                    <CloseOutlined style={{fontSize: 17, color: "var(--text-tertiary)"}}/>
                </button>
                <span className={DrawerStyle.title}>{drawerTitle}</span>
            </div>

            {/* ── Contenu scrollable ── */}
            <div className={ds.content}>

                {/* Hero */}
                <div className={ds.hero}>
                    <div className={ds.avatar}>YV</div>
                    <div className={ds.hero_name}>Info summary</div>
                    <div className={ds.hero_sub}>Sub info</div>
                    <div className={ds.hero_badges}>
                        {el.status && <Badge text={el.status} accent/>}
                        <span className={ds.ref_badge}>{el.referenceNumber}</span>
                    </div>
                </div>

                {/* Edit button below hero */}
                <div className={ds.hero_edit_row}>
                    <Link href={EDIT_URL + el?.uid}>
                        <button className={ds.hero_edit_btn}>
                            <EditOutlined style={{fontSize: 13}}/>
                            Modifier l'élément
                        </button>
                    </Link>
                </div>

                {/* Carousel */}
                <DrawerImagesView allIllustrations={el.allIllustrations}/>

                <div className={ds.body}>
                    <div className={ds.section}>
                        <span className={ds.section_label}>Informations</span>
                                   <DrawerFieldRow label="Libelle" value={el.libelle}/>
           <DrawerFieldRow label="Description" value={el.description}/>
           <DrawerFieldRow label="Prix Unitaire" value={el.prixUnitaire}/>
           <DrawerFieldRow label="Quantite Stock" value={el.quantiteStock}/>
{/*drawer_form*/}
                    </div>

                    {/* Behaviours */}
                </div>
            </div>
        </Drawer>
    );
}
