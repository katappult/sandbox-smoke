import { useTranslation } from "react-i18next";
import ClientLayout from "@/layouts/client/ClientLayout";
import MesAnnonces from "@/components/client/MesAnnonces";

export default function MesAnnoncesPage() {
    const { t } = useTranslation();
    return (
        <ClientLayout title={t("annonce.list_title")}>
            <MesAnnonces />
        </ClientLayout>
    );
}
