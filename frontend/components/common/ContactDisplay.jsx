import React, {useEffect, useState} from 'react';
import {ContactService} from "@/services/Contact.service";
import {responseListSuccess, responseSuccess} from "@/utils";
import {Button, Divider, Form, Modal} from "antd";
import ContactForm from "@/components/common/ContactForm";
import FormStyle from "@/styles/components/FormStyle.module.css";
import { useTranslation } from "react-i18next";

const CONTACT_ROLE = "home";

export function ContactDisplay ({contactableId}) {
    const { t } = useTranslation();

    const [contactMechanism, setContactMechanism]= useState(null);
    const [editModal, setEditModal] = useState(false);
    const [contactFormInstance] = Form.useForm();

    useEffect(() => {
        loadContacts();
    }, [contactableId])


    useEffect(() => {
        if(contactMechanism) {
            const postalAddress = contactMechanism?.postalAddress;
            const telecomAddress = contactMechanism?.telecomAddresses;
            const webAddress = contactMechanism?.webAddresses;

            contactFormInstance.setFieldValue("address1", postalAddress.address1);
            contactFormInstance.setFieldValue("address2", postalAddress.address2);
            contactFormInstance.setFieldValue("contactPhoneNumber", getPhoneValue(telecomAddress));
            contactFormInstance.setFieldValue("contactEmail", getEmailValue(webAddress));
            contactFormInstance.setFieldValue("country", postalAddress.country);
            contactFormInstance.setFieldValue("city", postalAddress.city);
            contactFormInstance.setFieldValue("postalCode", postalAddress.postalCode);
        }
    }, [contactMechanism])

    const loadContacts = () => {
        if(contactableId){
            ContactService.getContactByRole(contactableId, CONTACT_ROLE).then(response => {
                if(responseListSuccess(response) && response.data.dataList.length > 0){
                    setContactMechanism(response.data.dataList[0]);
                }
            });
        }
    }

    const postalAddress = contactMechanism?.postalAddress;
    const telecomAddress = contactMechanism?.telecomAddresses;
    const webAddress = contactMechanism?.webAddresses;

    const getPhoneValue = (telecomAddress) => {
        if(telecomAddress  && telecomAddress.length > 0){
            return telecomAddress[0].telecomNumber;
        }
    }

    const getEmailValue = (webAddress) => {
        if(webAddress  && webAddress.length > 0){
            return webAddress[0].webAddress;
        }
    }

    const getPhone = (telecomAddress) => {
        if(telecomAddress  && telecomAddress.length > 0){
            return t("contact.phone_display", { value: telecomAddress[0].telecomNumber });
        }
    }

    const getEmail = (webAddress) => {
        if(webAddress  && webAddress.length > 0){
            return t("contact.email_display", { value: webAddress[0].webAddress });
        }
    }

    const afterUpdateSuccess = () => {
        loadContacts();
    }

    const handleOk = () => {
        contactFormInstance.submit();
    }

    const handleSubmit = (form) => {

        let telecomAddresses, webAddresses = [];
        telecomAddresses = [{
            title: "Phone",
            countryCode:"N/A",
            telecomNumber: contactFormInstance.getFieldValue("contactPhoneNumber")
        }];
        webAddresses = [{
            title: "Email",
            webAddress: contactFormInstance.getFieldValue("contactEmail")
        }];

        form["masterForRole"] = true;
        form["role"] = CONTACT_ROLE;
        form["telecomAddresses"] = telecomAddresses;
        form["webAddresses"] = webAddresses;

        const content = {
            content: [form]
        }

        ContactService.setContacts(contactableId, content).then(response => {
            if(responseSuccess(response)) {
                afterUpdateSuccess();
                setEditModal(false);
            }
        })
    }

    if(!contactMechanism) return <>
        <Divider className={"divider-bold"}/>
        <h4>{t("contact.address_empty")}</h4>
        <Button className={FormStyle.button_cancel} style={{width:"100%"}}
            onClick={() => setEditModal(true)}>
            {t("contact.add_address_btn")}
        </Button>

        <Modal  destroyOnClose={true}
                title={t("contact.modal_add_address")}
                centered
                width={700}
                open={editModal}
                onOk={handleOk}
                onCancel={() => setEditModal(false)}>

            <Form form={contactFormInstance}  onFinish={handleSubmit}>
                <ContactForm formIntance={contactFormInstance} editingContact={true} />
            </Form>
        </Modal>
    </>

    return <>
        <strong>{t("contact.contact_section")}</strong>
        <div className={'postalA-addres-choice'}>
            <div className={'left'}>
                <div>{postalAddress.address1}</div>
                <div>{postalAddress.address2}, {postalAddress.address3}</div>
                <div>{postalAddress.postalCode}, {postalAddress.city}. {postalAddress.country}</div>
                <div>{getPhone(telecomAddress)}</div>
                <div>{getEmail(webAddress)}</div>
            </div>
        </div>

        <Button className={FormStyle.button_cancel} style={{width:"100%"}}
                onClick={() => setEditModal(true)}>
            {t("contact.edit_address_btn")}
        </Button>

        <Modal  destroyOnClose={true}
                title={t("contact.modal_edit_address")}
                centered
                width={700}
                open={editModal}
                onOk={handleOk}
                onCancel={() => setEditModal(false)}>

            <Form form={contactFormInstance}  onFinish={handleSubmit}>
                <ContactForm formIntance={contactFormInstance} editingContact={true} />
            </Form>

        </Modal>
    </>

}