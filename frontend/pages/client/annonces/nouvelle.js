import { useTranslation } from "react-i18next";
import ClientLayout from "@/layouts/client/ClientLayout";
import AnnonceForm from "@/components/client/AnnonceForm";

export default function NouvelleAnnoncePage() {
    const { t } = useTranslation();
    return (
        <ClientLayout title={t("annonce.form_title")}>
            <AnnonceForm />
        </ClientLayout>
    );
}
