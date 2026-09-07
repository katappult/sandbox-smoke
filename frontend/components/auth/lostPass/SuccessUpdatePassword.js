import React from "react";
import AuthStyle from "/styles/pages/Auth.module.css";
import check from "./img/check_logo.svg";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function PasswordUpdateSuccess(props) {
  const { t } = useTranslation();
  const router = useRouter();

  const ToLogin = () => {
    localStorage.removeItem("forgotState");
    return router.push("/auth/login");
  };

  return (
    <div
      style={{
        marginTop: "8rem",
      }}
    >
      <div className={AuthStyle.password_header}>
        <div className={AuthStyle.password_logo}>
          <img
            className={AuthStyle.password_logo_image}
            src={check}
            alt="mail"
          />
        </div>
        <div className={AuthStyle.password_header_label}>
          <span className={AuthStyle.password_title}>{t("lost_pass.success_title")}</span>
          <span className={AuthStyle.password_subtitle}>{t("lost_pass.success_desc")}</span>
        </div>
      </div>

      <div className={AuthStyle.password_content}>
        <div className={AuthStyle.form}>
          <div className={AuthStyle.button_form}>
            <a
              href={"/auth/login"}
              as={"/auth/login"}
              className={AuthStyle.retour_button}
            >
              <span className={AuthStyle.retour_label}>{t("lost_pass.to_login")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
