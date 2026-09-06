import React, {useEffect, useState} from "react";
import {Form, Input, message, Modal, Popconfirm, Select, Spin, Switch, Tag} from "antd";
import PhoneInput, {parsePhoneNumber} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    UpOutlined,
} from "@ant-design/icons";
import {ContactService} from "@/services/Contact.service";
import {responseListSuccess, responseSuccess} from "@/utils";
import ContactManagerStyle from "@/styles/components/ContactManager.module.css";
import {useTranslation} from "react-i18next";
import SectionCard from "@/components/common/info/SectionCard";

const ADDRESS_ROLES = ["home", "billing", "delivery", "office"];
const ALL_ROLES = ADDRESS_ROLES.join(",");
const EMAIL_LIMIT = 1; // bridled: max 1 email per address

const ROLE_COLORS = {home: "blue", billing: "gold", delivery: "green", office: "purple"};

// ── Sub-components (module level — no re-mount on render) ─

function RoleBadge({role, t}) {
    if (!role) return null;
    return (
        <Tag color={ROLE_COLORS[role] || "default"} style={{fontSize: 11, fontWeight: 700}}>
            {t(`contact.role_${role}`, role)}
        </Tag>
    );
}

function AddressFields() {
    const {t} = useTranslation();
    return (
        <>
            <Form.Item name="address1" label={t("contact.address_line1_label")}
                       rules={[{required: true, message: t("contact.required")}]}>
                <Input className={"form_input"} placeholder={t("contact.address_line1_placeholder")}/>
            </Form.Item>
            <Form.Item name="address2" label={t("contact.address_line2_label")}>
                <Input className={"form_input"} placeholder={t("contact.address_line2_placeholder")}/>
            </Form.Item>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12}}>
                <Form.Item name="postalCode" label={t("contact.postal_code_label")}
                           rules={[{required: true, message: t("contact.required")}]}>
                    <Input className={"form_input"} placeholder={t("contact.postal_code_placeholder")}/>
                </Form.Item>
                <Form.Item name="city" label={t("contact.city_label")}
                           rules={[{required: true, message: t("contact.required")}]}>
                    <Input className={"form_input"} placeholder={t("contact.city_placeholder")}/>
                </Form.Item>
                <Form.Item name="country" label={t("contact.country_label")}
                           rules={[{required: true, message: t("contact.required")}]}>
                    <Input className={"form_input"} placeholder={t("contact.country_placeholder")}/>
                </Form.Item>
            </div>
        </>
    );
}

// Form.Item-compatible wrapper for react-phone-number-input
function PhoneInputWrapper({value, onChange}) {
    return (
        <PhoneInput
            international
            defaultCountry="MG"
            value={value || ""}
            onChange={onChange}
        />
    );
}

function PhoneFields() {
    const {t} = useTranslation();
    return (
        <>
            <Form.Item name="title" label={t("contact.phone_type_label")} initialValue="Mobile">
                <Input className={"form_input"} placeholder={t("contact.phone_type_placeholder")}/>
            </Form.Item>
            <Form.Item
                name="phoneValue"
                label={t("contact.phone_number_label")}
                rules={[{required: true, message: t("contact.required")}]}
            >
                <PhoneInputWrapper/>
            </Form.Item>
        </>
    );
}

function EmailFields() {
    const {t} = useTranslation();
    return (
        <>
            <Form.Item name="title" label={t("contact.phone_type_label")} initialValue="Email">
                <Input className={"form_input"} placeholder={t("contact.email_type_placeholder")}/>
            </Form.Item>
            <Form.Item name="webAddress" label={t("contact.email_address_label")} rules={[
                {required: true, message: t("contact.required")},
                {type: "email", message: t("contact.email_invalid")},
            ]}>
                <Input className={"form_input"} placeholder={t("contact.email_address_placeholder")}/>
            </Form.Item>
        </>
    );
}

function ContactItemRow({icon, label, value, onEdit, onDelete}) {
    const {t} = useTranslation();
    return (
        <div className={ContactManagerStyle.contact_item}>
            <span className={ContactManagerStyle.contact_item_icon}>{icon}</span>
            <div className={ContactManagerStyle.contact_item_content}>
                <span className={ContactManagerStyle.contact_item_label}>{label}</span>
                <span className={ContactManagerStyle.contact_item_value}>{value}</span>
            </div>
            <div className={ContactManagerStyle.contact_item_actions}>
                <Popconfirm
                    title={t("contact.delete_confirm")}
                    onConfirm={onDelete}
                    okText={t("contact.delete_btn")}
                    cancelText={t("contact.cancel_btn")}
                    okButtonProps={{danger: true}}
                    placement="left"
                >
                    <button className={`${ContactManagerStyle.action_btn} ${ContactManagerStyle.action_btn_danger}`}
                            title={t("contact.delete_title")}>
                        <DeleteOutlined/>
                    </button>
                </Popconfirm>
            </div>
        </div>
    );
}

function SectionSubHeader({label, onAdd, addTitle, disabled}) {
    const {t} = useTranslation();
    return (
        <div className={ContactManagerStyle.subsection_header}>
            <span className={ContactManagerStyle.subsection_label}>{label}</span>
            {!disabled && (
                <button className={ContactManagerStyle.section_add_btn} onClick={onAdd} title={addTitle}>
                    <PlusOutlined/> {t("contact.add_btn")}
                </button>
            )}
        </div>
    );
}

function EmptyContactState({onAdd}) {
    const {t} = useTranslation();
    return (
        <div className={ContactManagerStyle.empty}>
            <EnvironmentOutlined style={{fontSize: 40, color: "var(--text-muted)"}}/>
            <div className={ContactManagerStyle.empty_title}>{t("contact.no_contacts")}</div>
            <div className={ContactManagerStyle.empty_desc}>{t("contact.no_contacts_hint")}</div>
            <button className={ContactManagerStyle.add_full_btn} onClick={onAdd}>
                <PlusOutlined/> {t("contact.add_contacts_btn")}
            </button>
        </div>
    );
}

function AddressCard({
                         addr,
                         onEditAddress,
                         onDeleteAddress,
                         onAddPhone,
                         onEditPhone,
                         onDeletePhone,
                         onAddEmail,
                         onEditEmail,
                         onDeleteEmail,
                         onToggleMaster
                     }) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const postal = addr.postalAddress || {};
    const phones = addr.telecomAddresses || [];
    const emails = addr.webAddresses || [];
    const emailLimitReached = emails.length >= EMAIL_LIMIT;

    const lines = [
        postal.address1,
        postal.address2,
        [postal.postalCode, postal.city].filter(Boolean).join(" "),
        postal.country,
    ].filter(Boolean);

    // Summary address: address1 + "CP ville" + country (skip address2 for brevity)
    const summaryAddressParts = [
        postal.address1,
        [postal.postalCode, postal.city].filter(Boolean).join(" "),
        postal.country,
    ].filter(Boolean);

    return (
        <div className={ContactManagerStyle.address_card}>
            {/* ── Summary row (always visible, clickable) ── */}
            <div className={ContactManagerStyle.address_card_summary} onClick={() => setOpen((o) => !o)}>
                <div className={ContactManagerStyle.summary_left}>
                    <RoleBadge role={addr.role} t={t}/>
                    <span
                        className={addr.masterForRole ? ContactManagerStyle.master_badge : ContactManagerStyle.master_badge_off}>
                        {addr.masterForRole ? t("contact.master_badge", "Principal") : t("contact.not_master_badge", "Non principal")}
                    </span>
                    <div className={ContactManagerStyle.summary_info}>
                        {summaryAddressParts.length > 0 ? (
                            <span className={ContactManagerStyle.summary_chip}>
                                <EnvironmentOutlined className={ContactManagerStyle.summary_chip_icon}/>
                                {summaryAddressParts.join(", ")}
                            </span>
                        ) : null}
                        {phones.length > 0 && (
                            <span className={ContactManagerStyle.summary_chip}>
                                <PhoneOutlined className={ContactManagerStyle.summary_chip_icon}/>
                                {[phones[0].countryCode, phones[0].telecomNumber].filter(Boolean).join(" ")}
                            </span>
                        )}
                        {emails.length > 0 && (
                            <span className={ContactManagerStyle.summary_chip}>
                                <MailOutlined className={ContactManagerStyle.summary_chip_icon}/>
                                {emails[0].webAddress}
                            </span>
                        )}
                        {phones.length === 0 && emails.length === 0 && summaryAddressParts.length === 0 && (
                            <span
                                className={ContactManagerStyle.summary_none}>{t("contact.no_data", "Aucune donnée")}</span>
                        )}
                    </div>
                </div>
                <span className={ContactManagerStyle.summary_toggle}>
                    {open ? <UpOutlined/> : <DownOutlined/>}
                </span>
            </div>

            {/* ── Expanded detail + actions ── */}
            {open && (
                <div className={ContactManagerStyle.address_card_body}>
                    <div className={ContactManagerStyle.address_card_header}>
                        <div className={ContactManagerStyle.master_toggle_row}>
                            <Switch size="small" checked={!!addr.masterForRole} onChange={onToggleMaster}/>
                            <span
                                className={ContactManagerStyle.master_toggle_label}>{t("contact.master_for_role_label", "Principal")}</span>
                        </div>
                        <div style={{flex: 1}}/>
                        <button className={ContactManagerStyle.action_btn} onClick={onEditAddress}
                                title={t("contact.edit_address_title")}>
                            <EditOutlined/>
                        </button>
                        <Popconfirm
                            title={t("contact.delete_address_confirm", "Supprimer cette adresse ?")}
                            onConfirm={onDeleteAddress}
                            okText={t("contact.delete_btn")}
                            cancelText={t("contact.cancel_btn")}
                            okButtonProps={{danger: true}}
                            placement="left"
                        >
                            <button
                                className={`${ContactManagerStyle.action_btn} ${ContactManagerStyle.action_btn_danger}`}
                                title={t("contact.delete_title")}>
                                <DeleteOutlined/>
                            </button>
                        </Popconfirm>
                    </div>

                    <div className={ContactManagerStyle.address_block}>
                        <EnvironmentOutlined className={ContactManagerStyle.address_icon}/>
                        <div className={ContactManagerStyle.address_content}>
                            {lines.length === 0 ? (
                                <span className={ContactManagerStyle.address_sub} style={{fontStyle: "italic"}}>
                                    {t("contact.address_empty")}
                                </span>
                            ) : (
                                lines.map((line, i) => (
                                    <span key={i}
                                          className={i === 0 ? ContactManagerStyle.address_line : ContactManagerStyle.address_sub}>{line}</span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={ContactManagerStyle.section}>
                        <SectionSubHeader
                            label={t("contact.phones_section")}
                            onAdd={onAddPhone}
                            addTitle={t("contact.modal_add_phone")}
                        />
                        {phones.length === 0 && (
                            <div className={ContactManagerStyle.empty_section_hint}>{t("contact.no_phones")}</div>
                        )}
                        {phones.map((phone) => (
                            <ContactItemRow
                                key={phone.id}
                                icon={<PhoneOutlined/>}
                                label={phone.title || t("contact.mobile_default")}
                                value={[phone.countryCode, phone.telecomNumber].filter(Boolean).join(" ")}
                                onEdit={() => onEditPhone(phone)}
                                onDelete={() => onDeletePhone(
                                    {
                                        telecomAddresses: [{
                                            title: phone.title,
                                            countryCode: phone.countryCode,
                                            telecomNumber: phone.telecomNumber,
                                        }],
                                    }
                                )}
                            />
                        ))}
                    </div>

                    <div className={ContactManagerStyle.section}>
                        <SectionSubHeader
                            label={t("contact.emails_section")}
                            onAdd={onAddEmail}
                            addTitle={t("contact.modal_add_email")}
                            disabled={emailLimitReached}
                        />
                        {emails.length === 0 && (
                            <div className={ContactManagerStyle.empty_section_hint}>{t("contact.no_emails")}</div>
                        )}
                        {emails.map((email) => (
                            <ContactItemRow
                                key={email.id}
                                icon={<MailOutlined/>}
                                label={email.title || t("contact.email_default")}
                                value={email.webAddress}
                                onEdit={() => onEditEmail(email)}
                                onDelete={() => onDeleteEmail(email.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────

export default function ContactManager({contactableId}) {
    const {t} = useTranslation();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(null);
    // modal: null | { type, addressId?, itemId?, item? }
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    const load = () => {
        if (!contactableId) return;
        setLoading(true);
        ContactService.getContactByRoles(contactableId, ALL_ROLES)
            .then((res) => {
                if (responseListSuccess(res)) {
                    setAddresses(res.data.dataList);
                } else {
                    setAddresses([]);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, [contactableId]);

    const closeModal = () => {
        setModal(null);
        form.resetFields();
    };

    const openModal = (type, extra = {}) => {
        form.resetFields();
        setModal({type, ...extra});
        if (!extra.item) return;

        if (type === "address_edit") {
            const a = extra.item.postalAddress || {};
            form.setFieldsValue({
                role: extra.item.role,
                masterForRole: !!extra.item.masterForRole,
                address1: a.address1, address2: a.address2,
                postalCode: a.postalCode, city: a.city, country: a.country,
            });
        }
        if (type === "phone_edit") {
            const {countryCode, telecomNumber} = extra.item;
            const e164 = countryCode && telecomNumber ? `${countryCode}${telecomNumber}` : telecomNumber || "";
            form.setFieldsValue({title: extra.item.title || "Mobile", phoneValue: e164 || undefined});
        }
        if (type === "email_edit") {
            form.setFieldsValue({title: extra.item.title || "Email", webAddress: extra.item.webAddress});
        }
    };

    const handleSubmit = async (values) => {
        setSaving(true);
        try {
            const {type, addressId, itemId} = modal;
            let res;

            if (type === "address_add") {
                res = await ContactService.addPostalAddress(contactableId, {
                    role: values.role,
                    masterForRole: false,
                    address1: values.address1 || "",
                    address2: values.address2 || "",
                    postalCode: values.postalCode || "",
                    city: values.city || "",
                    country: values.country || "",
                    telecomAddresses: [],
                    webAddresses: [],
                });
            } else if (type === "address_edit") {
                res = await ContactService.updatePostalAddress(contactableId, addressId, {
                    role: values.role,
                    masterForRole: !!values.masterForRole,
                    address1: values.address1 || "",
                    address2: values.address2 || "",
                    postalCode: values.postalCode || "",
                    city: values.city || "",
                    country: values.country || "",
                });
            } else if (type === "phone_add" || type === "phone_edit") {
                let countryCode = "";
                let telecomNumber = values.phoneValue || "";
                try {
                    const parsed = parsePhoneNumber(values.phoneValue || "");
                    if (parsed) {
                        countryCode = `+${parsed.countryCallingCode}`;
                        telecomNumber = parsed.nationalNumber;
                    }
                } catch { /* keep raw value */
                }

                const telecomPayload = {
                    telecomAddresses: [{
                        title: values.title || "Mobile",
                        countryCode,
                        telecomNumber,
                    }],
                };
                if (type === "phone_add") {
                    res = await ContactService.addTelecomContact(contactableId, addressId, telecomPayload);
                } else {
                    res = await ContactService.updateTelecomContact(contactableId, itemId, telecomPayload);
                }
            } else if (type === "email_add" || type === "email_edit") {
                const webPayload = {
                    webAddresses: [{
                        title: values.title || "Email",
                        webAddress: values.webAddress,
                    }],
                };
                if (type === "email_add") {
                    res = await ContactService.addWebContact(contactableId, addressId, webPayload);
                } else {
                    res = await ContactService.updateWebContact(contactableId, itemId, webPayload);
                }
            }

            if (responseSuccess(res)) {
                load();
                closeModal();
            } else {
                message.error(t("contact.save_error"));
            }
        } catch {
            message.error(t("contact.save_error_generic"));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (fn) => {
        try {
            const res = await fn();
            if (responseSuccess(res)) {
                load();
            } else {
                message.error(t("contact.save_error"));
            }
        } catch {
            message.error(t("contact.save_error_generic"));
        }
    };

    const modalTitle = () => {
        if (!modal) return "";
        const map = {
            address_add: t("contact.modal_add_address"),
            address_edit: t("contact.modal_edit_address"),
            phone_add: t("contact.modal_add_phone"),
            phone_edit: t("contact.modal_edit_phone"),
            email_add: t("contact.modal_add_email"),
            email_edit: t("contact.modal_edit_email"),
        };
        return map[modal.type] || "";
    };

    const isAddressModal = modal?.type === "address_add" || modal?.type === "address_edit";

    if (loading) return <Spin/>;

    return (
        <SectionCard
            id="Addresses"
            title="Informations de contact"
            desc="Données & informations de contact de l'entité"
        >
            <div className={ContactManagerStyle.manager}>
                {addresses.length === 0 ? (
                    <EmptyContactState onAdd={() => openModal("address_add")}/>
                ) : (
                    <>
                        {addresses.map((addr) => (
                            <AddressCard
                                key={addr.id}
                                addr={addr}
                                onEditAddress={() => openModal("address_edit", {addressId: addr.id, item: addr})}
                                onDeleteAddress={() => handleDelete(() => ContactService.deletePostalAddress(contactableId, addr.id))}
                                onToggleMaster={() => {
                                    handleDelete(() => ContactService.setMasterForRole(contactableId, addr.id));
                                }}

                                onAddPhone={() => openModal("phone_add", {addressId: addr.id})}
                                onEditPhone={(phone) => openModal("phone_edit", {
                                    addressId: addr.id,
                                    itemId: phone.id,
                                    item: phone
                                })}
                                onDeletePhone={(phone) => handleDelete(() => ContactService.deleteContactTelecom(contactableId, addr.id, phone))}
                                onAddEmail={() => openModal("email_add", {addressId: addr.id})}
                                onEditEmail={(email) => openModal("email_edit", {
                                    addressId: addr.id,
                                    itemId: email.id,
                                    item: email
                                })}
                                onDeleteEmail={() => handleDelete(() => ContactService.deleteContactWeb(contactableId, addr.id))}
                            />
                        ))}
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <button className={ContactManagerStyle.add_address_btn}
                                    onClick={() => openModal("address_add")}>
                                <PlusOutlined/> {t("contact.add_address_btn")}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <Modal
                title={modalTitle()}
                open={!!modal}
                onOk={() => form.submit()}
                onCancel={closeModal}
                okText={t("contact.save_btn")}
                cancelText={t("contact.cancel_btn")}
                confirmLoading={saving}
                destroyOnClose
                width={isAddressModal ? 560 : 420}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    {isAddressModal && (
                        <>
                            <div style={{display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end"}}>
                                <Form.Item name="role" label={t("contact.role_label")}
                                           rules={[{required: true, message: t("contact.required")}]}
                                           style={{marginBottom: 0}}>
                                    <Select className={"form_select"} placeholder={t("my_account.gender_select")}>
                                        {ADDRESS_ROLES.map((r) => (
                                            <Select.Option key={r} value={r}>
                                                {t(`contact.role_${r}`, r)}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="masterForRole" label={t("contact.master_for_role_label", "Principal")}
                                           valuePropName="checked" style={{marginBottom: 0}}>
                                    <Switch/>
                                </Form.Item>
                            </div>
                            <AddressFields/>
                        </>
                    )}
                    {(modal?.type === "phone_add" || modal?.type === "phone_edit") && <PhoneFields/>}
                    {(modal?.type === "email_add" || modal?.type === "email_edit") && <EmailFields/>}
                </Form>
            </Modal>
        </SectionCard>
    );
}
