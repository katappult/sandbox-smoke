import { useEffect } from "react";
import { serviceConfig } from "@/services/utils/service.config";
import AdminLayout from "@/layouts/admin/AdminLayout";

export default function AdminPage() {
    useEffect(() => {
        document.querySelector("body").classList.remove("login-body");
        document.querySelector("body").classList.add("front-body");

        if (!serviceConfig.isLoggedIn()) {
            window.location.href = "/auth/login";
        }
    }, []);

    return <></>;
}

AdminPage.getLayout = function getLayout(page, title) {
    return <AdminLayout title={title}>{page}</AdminLayout>;
};
