import FormSection from "@/components/common/FormSection";
import {Form, Input} from "antd";
import s from "@/styles/pages/Form.module.css";
import React from "react";
import {
    EnvironmentOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default function ContactableForm(){
    const { t } = useTranslation();

    return <>
        <FormSection icon={<EnvironmentOutlined />} title={t("contact.address_section")}>
            <Form.Item name="adresse" label={t("contact.address_full_label")} rules={[{ required: true, message: t("contact.required") }]}>
                <Input placeholder={t("contact.address_placeholder")} />
            </Form.Item>
            <div className={s.grid_3}>
                <Form.Item name="codePostal" label={t("contact.postal_code_label")} rules={[{ required: true, message: t("contact.required") }]}>
                    <Input placeholder={t("contact.postal_code_placeholder")} />
                </Form.Item>
                <Form.Item name="ville" label={t("contact.city_label")} rules={[{ required: true, message: t("contact.required") }]}>
                    <Input placeholder={t("contact.city_placeholder")} />
                </Form.Item>
                <Form.Item name="pays" label={t("contact.country_label")} rules={[{ required: true, message: t("contact.required") }]}>
                    <Input placeholder={t("contact.country_placeholder")} />
                </Form.Item>
            </div>
        </FormSection>

        <FormSection icon={<PhoneOutlined />} title={t("contact.contact_section")}>
            <div className={s.grid_2}>
                <Form.Item name="mobile" label={t("contact.mobile_label")} rules={[{ required: true, message: t("contact.required") }]}>
                    <Input placeholder={t("contact.mobile_placeholder")} />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={t("contact.email_label")}
                    rules={[
                        { required: true, message: t("contact.required") },
                        { type: "email", message: t("contact.email_invalid") },
                    ]}
                >
                    <Input placeholder={t("contact.email_placeholder")} />
                </Form.Item>
            </div>
        </FormSection>
    </>
}