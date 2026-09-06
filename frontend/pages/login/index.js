import { useEffect } from "react";
import Login from "@/components/auth/Login";
import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
    useEffect(() => {
        localStorage.clear();
        document.cookie = "Authorization=;maxAge=0; path=/;";
    }, []);

    return <Login />;
}

LoginPage.getLayout = function getLayout(page) {
    return <AuthLayout title="Connexion">{page}</AuthLayout>;
};
