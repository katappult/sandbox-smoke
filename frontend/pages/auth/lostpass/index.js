import { useEffect } from "react";
import LostPass from "@/components/auth/lostPass/LostPass";
import AuthLayout from "@/layouts/AuthLayout";
import i18n from "@/i18n";

export default function LostPassPage() {
    useEffect(() => {
        localStorage.clear();
    }, []);

    return <LostPass />;
}

LostPassPage.getLayout = function getLayout(page) {
    return <AuthLayout title={i18n.t("auth.lostpass_page_title")}>{page}</AuthLayout>;
};
