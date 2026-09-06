import { useEffect, useState } from "react";
import Register from "@/components/auth/register/Register";
import AuthLayout from "@/layouts/AuthLayout";
import i18n from "@/i18n";
import { PreferenceService } from "@/services/Preference.service";
import { responseSuccess } from "@/utils";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function RegisterPage() {
    const router = useRouter();
    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        localStorage.clear();
        PreferenceService.getSystemPreferenceValuePublic("system.account.creation.active").then((res) => {
            if (responseSuccess(res)) {
                const value = res.data?.attributes?.value;
                if (value === "false" || value === false) {
                    router.replace("/login");
                } else {
                    setAllowed(true);
                }
            } else {
                setAllowed(true);
            }
        });
    }, []);

    if (!allowed) return <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spin /></div>;

    return <Register />;
}

RegisterPage.getLayout = function getLayout(page) {
    return <AuthLayout title={i18n.t("auth.register_page_title")}>{page}</AuthLayout>;
};
