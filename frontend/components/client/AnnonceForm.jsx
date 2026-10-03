import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { serviceConfig } from "@/services/utils/service.config";
import { AnnonceService } from "@/services/generated/Annonce.services";
import { ProduitService } from "@/services/generated/Produit.services";
import { thumbService } from "@/services/Thumb.service";
import InputImage from "@/components/common/InputImage";
import { responseListSuccess, responseSuccess, notificationError, notificationSuccessAdded } from "@/utils";
import s from "./AnnonceForm.module.css";

export default function AnnonceForm() {
    const { t } = useTranslation();
    const router = useRouter();
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        if (!serviceConfig.isLoggedIn()) {
            router.push("/auth/login");
            return;
        }

        ProduitService.listEntity(1, 200, "", "", "")
            .then((res) => {
                if (responseListSuccess(res)) {
                    setProducts(res.data.dataList || []);
                }
            })
            .finally(() => setLoadingProducts(false));
    }, [router]);

    useEffect(() => {
        if (selectedFile === null) {
            return;
        }
        return () => {
            URL.revokeObjectURL(selectedFile.preview);
        };
    }, [selectedFile]);

    const handleFileChange = (file) => {
        setSelectedFile((prev) => {
            if (prev?.preview) {
                URL.revokeObjectURL(prev.preview);
            }
            return { file, preview: URL.createObjectURL(file) };
        });
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                titre: values.titre,
                description: values.description || null,
                prix: values.prix ?? null,
                produit: selectedProduct?.fullId || selectedProduct?.uid,
            };

            const createRes = await AnnonceService.createEntity(payload);
            if (!responseSuccess(createRes)) {
                notificationError(t("annonce.create_error"));
                return;
            }

            const created = createRes.data || {};
            const annonceFullId = created.fullId || created.uid;

            if (selectedFile?.file && annonceFullId) {
                const thumbRes = await thumbService.addThumb(annonceFullId, selectedFile.file);
                if (!responseSuccess(thumbRes)) {
                    notificationError(t("annonce.thumb_upload_error"));
                }
            }

            notificationSuccessAdded(t("annonce.create_success"));
            router.push("/client/annonces");
        } finally {
            setSubmitting(false);
        }
    };

    const productOptions = products.map((product) => {
        const categoryLabel = product.categorie?.titre
            || product.categorie?.title
            || product.categorie?.name
            || product.categorie
            || "";

        return {
            value: product.fullId || product.uid,
            label: categoryLabel
                ? `${product.titre || product.title || product.name} — ${categoryLabel}`
                : (product.titre || product.title || product.name || product.fullId || product.uid),
        };
    });

    if (!serviceConfig.isLoggedIn()) {
        return null;
    }

    return (
        <div className={s.form_container}>
            <h1 className={s.form_title}>{t("annonce.form_title")}</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ prix: null }}
            >
                <Form.Item
                    name="titre"
                    label={t("annonce.form_titre")}
                    rules={[{ required: true, message: t("common.field_required") }]}
                >
                    <Input placeholder={t("annonce.form_titre_placeholder")} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={t("annonce.form_description")}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder={t("annonce.form_description_placeholder")}
                    />
                </Form.Item>

                <Form.Item
                    name="prix"
                    label={t("annonce.form_prix")}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder={t("annonce.form_prix_placeholder")}
                    />
                </Form.Item>

                <Form.Item
                    name="produit"
                    label={t("annonce.form_produit")}
                    rules={[{ required: true, message: t("common.field_required") }]}
                >
                    <Select
                        showSearch
                        placeholder={t("annonce.form_produit_placeholder")}
                        loading={loadingProducts}
                        optionFilterProp="label"
                        options={productOptions}
                        value={selectedProduct?.fullId || selectedProduct?.uid}
                        onChange={(value) => {
                            const found = products.find(
                                (product) => (product.fullId || product.uid) === value
                            );
                            setSelectedProduct(found || null);
                        }}
                    />
                </Form.Item>

                <Form.Item label={t("annonce.form_photo")}>
                    <InputImage
                        label={t("annonce.form_photo_placeholder")}
                        isRequired={false}
                        readOnly={false}
                        removable={false}
                        onChange={handleFileChange}
                    />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    className={s.submit_button}
                >
                    {submitting ? t("annonce.form_loading") : t("annonce.form_submit")}
                </Button>
            </Form>
        </div>
    );
}
