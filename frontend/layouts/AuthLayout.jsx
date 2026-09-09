import Image from "next/image";
import Head from "next/head";
import style from "@/styles/layouts/AuthLayout.module.css";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import DarkModeToggle from "@/components/common/DarkModeToggle";
import { RoutesService } from "@/services/Routes.service";
import { useTranslation } from "react-i18next";

export default function AuthLayout({ children, title }) {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={style.root}>
                {/* ── Left branding panel ── */}
                <div className={style.panel}>
                    <div className={style.panel_inner}>
                        <a href={RoutesService.FRONT_OFFICE_HOME_PAGE_URL}>
                            <Image src="/images/klog.svg" width={130} height={36} alt="Nexitia" />
                        </a>
                        <h1 className={style.panel_title}>
                            {t("auth_layout.tagline")}
                        </h1>
                        <div className={style.panel_badges}>
                            <div className={style.panel_badge}>
                                <span className={style.panel_badge_dot} />
                                {t("auth_layout.feature_web")}
                            </div>
                            <div className={style.panel_badge}>
                                <span className={style.panel_badge_dot} />
                                {t("auth_layout.feature_mobile")}
                            </div>
                            <div className={style.panel_badge}>
                                <span className={style.panel_badge_dot} />
                                {t("auth_layout.feature_backend")}
                            </div>
                            <div className={style.panel_badge}>
                                <span className={style.panel_badge_dot} />
                                {t("auth_layout.feature_ai")}
                            </div>
                            <div className={style.panel_badge}>
                                <span className={style.panel_badge_dot} />
                                {t("auth_layout.feature_deploy")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right form side ── */}
                <div className={style.form_side}>
                    <div className={style.form_top}>
                        <DarkModeToggle />
                        <LanguageSwitcher />
                    </div>
                    <div className={style.form_content}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
