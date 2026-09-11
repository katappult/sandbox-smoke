import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Form, Input, Select, Spin } from "antd";
import {
    SaveOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { PanierService } from "@/services/generated/Panier.services";
import {
    getDateFrom,
    renderFormItem,
    renderCheckBoxFormItem,
    getDateStringFrom,
    notificationError,
    notificationSuccessAdded,
    responseSuccess,
    getDateForInputDate
} from "@/utils";
import FormStyle from "@/styles/pages/Form.module.css";
import FormSection from "@/components/common/FormSection";
{/*Import*/}

const BUSINESS_TYPE = "com.katappult.online.types.PanierType";
const LIST_URL      = "/generated/panier";


// ── Main component ────────────────────────────────────────

export default function PanierForm({ uid }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!uid);
    const [fullId, setFullId] = useState();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!uid) return;
        setIsFetching(true);
        PanierService.detailsEntity(uid)
            .then((response) => {
                if (responseSuccess(response)) {
                    const details = response.data;
                    setFullId(details.fullId);
                    form.setFieldValue("uid", details.uid);
                    // FORM DATAS
                } else {
                    notificationError();
                }
            })
            .catch(() => notificationError())
            .finally(() => setIsFetching(false));
    }, [uid]);

    const handleSubmit = async (values) => {
        const {allIllustrations: _, ...restValues} = values;
        const formData = {...restValues, businessType: BUSINESS_TYPE};

        // SUBMIT DATAS

        try {
            setIsLoading(true);
            const response = uid
                ? await PanierService.updateEntity(uid, formData)
                : await PanierService.createEntity(formData);

            if (responseSuccess(response)) {
                // POST SUCCESS
                notificationSuccessAdded();
                router.replace(LIST_URL);
            } else {
                notificationError();
            }
        } catch {
            notificationError();
        } finally {
            setIsLoading(false);
        }
    };

    {/*Content*/}

    if (isFetching) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className={FormStyle.page}>
            {/* Page header */}
            <div className={FormStyle.page_header}>
                <div className={FormStyle.page_title}>
                    {uid ? "Modifier l'élément" : "Nouvel élément"}
                </div>
                <div className={FormStyle.page_subtitle}>
                    {uid
                        ? "Modifiez les informations ci-dessous."
                        : "Remplissez les informations pour créer l'élément."}
                </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* ── Identité ── */}
                <FormSection icon={<UserOutlined />} title="Informations">
                    <div className={FormStyle.grid_1}>
                        {/*FormRoot*/}

                        {/*Form*/}
                    </div>
                </FormSection>

                {/* Behaviours */}

                {/* ── Actions ── */}
                <div className={FormStyle.actions}>
                    <button
                        type="button"
                        className={FormStyle.btn_cancel}
                        onClick={() => router.replace(LIST_URL)}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className={FormStyle.btn_submit}
                        disabled={isLoading}
                    >
                        <SaveOutlined />
                        {uid ? "Enregistrer les modifications" : "Enregister"}
                    </button>
                </div>
            </Form>
        </div>
    );
}
