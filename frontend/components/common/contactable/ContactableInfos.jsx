import React from "react";
import SectionCard from "@/components/common/info/SectionCard";
import InfoFieldItemView from "@/components/common/info/InfoFieldItemView";
import ContactManager from "@/components/common/contactable/ContactManager";
import InfoStyle from "@/styles/pages/Info.module.css";
import {EditOutlined} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function ContactableInfos({contactableId, contactInfo = {}}) {
    const { t } = useTranslation();

    const editAction = (
        <button className={InfoStyle.section_edit_btn}>
            <EditOutlined style={{fontSize: 12}}/>
            {t("contact.edit_infos_btn")}
        </button>
    );

    return <>
        <SectionCard
            id="adresse"
            title={t("contact.address_section")}
            desc={t("contact.address_section_desc")}
            action={editAction}
        >
            <div className={InfoStyle.fields_grid}>
                <div className={InfoStyle.fields_grid_full}>
                    <InfoFieldItemView label={t("contact.address_label")} value={contactInfo.adresse || "—"}/>
                </div>
                <InfoFieldItemView label={t("contact.postal_code_label")} value={contactInfo.codePostal || "—"}/>
                <InfoFieldItemView label={t("contact.state_label")} value={contactInfo.state || "—"}/>
                <InfoFieldItemView label={t("contact.city_label")} value={contactInfo.ville || "—"}/>
                <InfoFieldItemView label={t("contact.country_label")} value={contactInfo.pays || "—"}/>
            </div>
        </SectionCard>

        <SectionCard
            id="contact"
            title={t("contact.contacts_section")}
            desc={t("contact.contacts_section_desc")}
        >
            <ContactManager contactableId={contactableId}/>
        </SectionCard>
    </>
}