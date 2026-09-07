import { useEffect } from "react";
import { serviceConfig } from "@/services/utils/service.config";
import ClientLayout from "@/layouts/client/ClientLayout";
import KatappultAiHome from "@/components/common/KatappultAiHome";


export default function HomePage() {
    useEffect(() => {
        if (!serviceConfig.isLoggedIn()) {
            window.location.href = "/auth/login";
        }
    }, []);

    return <KatappultAiHome/>
}

HomePage.getLayout = function getLayout(page, title) {
    return <ClientLayout title={title}>{page}</ClientLayout>;
};
