import {EnvironmentOutlined} from "@ant-design/icons";
import Drawer2Style from "@/styles/components/Drawer2.module.css";
import React from "react";
import DrawerCollapsibleSection from "@/components/common/drawer/DrawerCollapsibleSection";
import SectionCard from "@/components/common/info/SectionCard";
import { useTranslation } from "react-i18next";

export default function ContactableDrawer({contactInfo, drawer = false}) {
    const { t } = useTranslation();

    function FieldRow({label, value}) {
        return (
            <div className={Drawer2Style.field_row}>
                <span className={Drawer2Style.field_label}>{label}</span>
                {value != null && value !== "" ? (
                    <span className={Drawer2Style.field_value}>{value}</span>
                ) : (
                    <span className={Drawer2Style.field_value_empty}>—</span>
                )}
            </div>
        );
    }

    const content = () => {
        return <>
            <FieldRow label={t("contact.address_label")} value={contactInfo.address || "—"}/>
            <FieldRow label={t("contact.postal_code_label")} value={contactInfo.codePostal || "—"}/>
            <FieldRow label={t("contact.city_label")} value={contactInfo.ville || "—"}/>
            <FieldRow label={t("contact.country_label")} value={contactInfo.pays || "—"}/>

            {(contactInfo.mobile || contactInfo.email) && (
                <div className={Drawer2Style.section}>
                    <span className={Drawer2Style.section_label}>{t("contact.contact_section")}</span>
                    <FieldRow label={t("contact.mobile_label")} value={contactInfo.mobile || "—"}/>
                    <FieldRow label={t("contact.email_label")} value={contactInfo.email || "—"}/>
                </div>
            )}
        </>
    }

    if (drawer) {
        return <DrawerCollapsibleSection
            icon={<EnvironmentOutlined/>}
            label={t("contact.address_section")}>
            {content()}
        </DrawerCollapsibleSection>
    }

    return <>
        <SectionCard icon={<EnvironmentOutlined/>} title={t("contact.address_section")}>
            {content()}
        </SectionCard>
    </>
}