import { useEffect } from "react";
import Login from "@/components/auth/Login";
import AuthLayout from "@/layouts/AuthLayout";
import i18n from "@/i18n";

export default function LoginPage() {
    useEffect(() => {
        localStorage.clear();
        document.cookie = "Authorization=;maxAge=0; path=/;";
    }, []);

    return <Login />;
}

LoginPage.getLayout = function getLayout(page) {
    return <AuthLayout title={i18n.t("auth.login_page_title")}>{page}</AuthLayout>;
};
