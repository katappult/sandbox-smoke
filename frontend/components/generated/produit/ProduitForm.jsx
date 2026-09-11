import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox, Form, Input, Select, Spin } from "antd";
import {
    SaveOutlined,
    UserOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { ProduitService } from "@/services/generated/Produit.services";
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
import {thumbService} from "@/services/Thumb.service";
import InputImage from "@/components/common/InputImage";
import {PhotoOutlined} from "@mui/icons-material";
{/*Import*/}

const BUSINESS_TYPE = "com.katappult.online.types.ProduitType";
const LIST_URL      = "/generated/produit";


// ── Main component ────────────────────────────────────────

export default function ProduitForm({ uid }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!uid);
    const [fullId, setFullId] = useState();
    const [form] = Form.useForm();

    useEffect(() => {
        if (!uid) return;
        setIsFetching(true);
        ProduitService.detailsEntity(uid)
            .then((response) => {
                if (responseSuccess(response)) {
                    const details = response.data;
                    setFullId(details.fullId);
                    form.setFieldValue("uid", details.uid);
                    			form.setFieldValue("libelle", details.libelle);
			form.setFieldValue("description", details.description);
			form.setFieldValue("prixUnitaire", details.prixUnitaire);
			form.setFieldValue("quantiteStock", details.quantiteStock);
form.setFieldValue("allIllustrations", details.allIllustrations);// FORM DATAS
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
                ? await ProduitService.updateEntity(uid, formData)
                : await ProduitService.createEntity(formData);

            if (responseSuccess(response)) {
                        const entityId = response.data.fullId;

        for (const oid of deletedThumbOids) {
             try {
                 await thumbService.deleteThumb(entityId, oid);
             } catch (e) {}
        }

        for (let i = 0; i < fileInputs.length; i++) {
             if (!fileInputs[i]) continue;
             if (existingThumbs[i]) {
                 try {
                     await thumbService.replaceThumb(entityId, existingThumbs[i].id, fileInputs[i]);
                 } catch (e) {}
             } else {
                 await thumbService.addThumb(entityId, fileInputs[i]);
             }
        }
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

        const [existingThumbs, setExistingThumbs] = useState([]);
    const [fileInputs, setFileInputs] = useState(Array(9).fill(null));
    const [deletedThumbOids, setDeletedThumbOids] = useState([]);
    const [imageLength, setImageLength] = useState(1);

    useEffect(() => {
        if(fullId){
            thumbService.getThumbs(fullId).then((thumbsRes) => {
                const thumbs = thumbsRes.data || [];
                setExistingThumbs(thumbs);
                if (thumbs) setImageLength(thumbs.length);
            });
        }
    }, [fullId])

    const handleAddMoreIllustration = () => {
        if (imageLength === 0 || fileInputs[imageLength - 1] || existingThumbs[imageLength - 1]) {
            setImageLength(imageLength + 1);
        }
    };

    const removeFile = (index) => {
        if (existingThumbs[index]) {
            setDeletedThumbOids(prev => [...prev, existingThumbs[index].oid]);
            setExistingThumbs(prev => {
                const updated = [...prev];
                updated.splice(index, 1);
                return updated;
            });
        }

        setFileInputs(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            while (updated.length < 9) updated.push(null);
            return updated;
        });

        setImageLength(prev => prev - 1);
    };

    const handleFileChange = (index) => (file) => {
        if (file) {
            setFileInputs((prev) => {
                const updated = [...prev];
                updated[index] = file;
                return updated;
            });
        }
    };{/*Content*/}

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

                                    {renderFormItem("libelle", "Libelle", true, "text", "Libelle")}
            {renderFormItem("description", "Description", false, "text", "Description")}
            {renderFormItem("prixUnitaire", "Prix Unitaire", true, "number", "Prix Unitaire")}
            {renderFormItem("quantiteStock", "Quantite Stock", true, "number", "Quantite Stock")}
{/*Form*/}
                    </div>
                </FormSection>

                            <FormSection icon={<PhotoOutlined/>} title="Illustrations">
                <div className="flex gap-5" style={{alignItems: "center", flexWrap: "wrap"}}>
                        {Array.from({length: imageLength}, (_, i) => i).map((index) => (
                            <InputImage
                                key={index}
                                removeFile={removeFile}
                                removable={true}
                                imageKey={index}
                                type="file"
                                name={`file${index}`}
                                onChange={handleFileChange(index)}
                                thumbPath={existingThumbs[index]?.url ?? null}
                                label={`${index === 0 ? "Main" : `Illustration ${index}`}`}
                                className={FormStyle.input_image}
                            />
                        ))}
                        {imageLength < 10 && (
                            <button
                                type="button"
                                className={`${FormStyle.btn_add_image} ${(imageLength === 0 || fileInputs[imageLength - 1] || existingThumbs[imageLength - 1]) ? "" : FormStyle.btn_add_image_disabled}`}
                                onClick={handleAddMoreIllustration}
                                title="Ajouter une illustration"
                            >
                                <PlusOutlined style={{fontSize: 20}}/>
                            </button>
                        )}
                </div>
            </FormSection>{/* Behaviours */}

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
