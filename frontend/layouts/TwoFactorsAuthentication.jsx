import React, {useEffect, useState} from "react";
import {Alert, Button, Input, Modal, notification, Spin, Switch} from "antd";
import SetPasswordStyle from "@/styles/components/SetPassword.module.css";
import {serviceAccount} from "@/services/Account.service";
import {serviceConfig} from "@/services/utils/service.config";
import {responseSuccess} from "@/utils";
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useTranslation } from "react-i18next";

export default function TwoFactorsAuthentication(){
    const { t } = useTranslation();

    const [faEnabled, set2FAEnabled] = useState(false);
    const [confirmEnable2FA, setConfirmEnable2FA] = useState(false);
    const [confirmDisable2FA, setConfirmDisable2FA] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const [codeError, setCodeError] = useState(false);
    const [code, setCode] = useState();
    const [step, setStep] = useState(1);

    useEffect(() => {
        isTwoFactorsAuthenticationEnable();
    }, [])

    const manage2FAToggleChange = (e) => {
        if(!faEnabled) {
            setConfirmEnable2FA(true);
            setConfirmDisable2FA(false);
        }
        else {
            setConfirmEnable2FA(false);
            setConfirmDisable2FA(true);
        }
    }

    const isTwoFactorsAuthenticationEnable = () => {
        const accountId = serviceConfig.getAccountUid();
        serviceAccount.isTwoFactorsAuthenticationEnable(accountId).then(response => {
            if(responseSuccess(response)){
                set2FAEnabled(response.data.meta.enabled === true || response.data.meta.enabled === "true");
            }
        });
    }

    const confirm2FAFooter = () => {
        if(step === 1) {
            const isValidPhoneValid = phoneNumber && isValidPhoneNumber(phoneNumber);
            return <>
                <Button onClick={cancelEnable2Factors}>{t("common.cancel")}</Button>
                <Button disabled={!isValidPhoneValid} onClick={preEnable2FA}>{t("twofa.confirm")}</Button>
            </>
        }

        return <>
            <Button onClick={() => setStep(1)}>{t("twofa.update_phone")}</Button>
            <Button disabled={!isCode4Digits()} onClick={enable2FA}>{t("twofa.validate")}</Button>
        </>
    }

    const confirmDisable2FAFooter = () => {
        return <>
            <Button onClick={()=> setConfirmDisable2FA(false)}>{t("common.cancel")}</Button>
            <Button onClick={disable2FA}>{t("twofa.disable_confirm_btn")}</Button>
        </>
    }

    const preEnable2FA = () => {
        const normalizedPhone = phoneNumber.replaceAll('+', "00");
        const accountId = serviceConfig.getAccountId();
        serviceAccount.preEnableTwoFactorsAuthentication(accountId, normalizedPhone).then(response => {
            if(responseSuccess(response)){
                setStep(2);
            }
        });
    }

    const enable2FA = () => {
        const accountId = serviceConfig.getAccountUid();
        if(!code || code.length !== 4) {
            return;
        }
        serviceAccount.enableTwoFactorsAuthentication(accountId, code).then(response => {
            if(responseSuccess(response)){
                setConfirmEnable2FA(false);
                set2FAEnabled(true);
                setPhoneNumber(null);

                notification.success({
                    message: t("reset_password.success"),
                    description: t("twofa.enable_success"),
                });
            }
            else {
                setCodeError(true);
            }
        });
    }

    const disable2FA = () => {
        const accountId = serviceConfig.getAccountUid();
        serviceAccount.disableTwoFactorsAuthentication(accountId).then(response => {
            if(responseSuccess(response)){
                setConfirmDisable2FA(false);
                set2FAEnabled(false);

                notification.success({
                    message: t("reset_password.success"),
                    description: t("twofa.disable_success"),
                });
            }
        });
    }

    const isCode4Digits = () => {
        return code !== null && code !== undefined && code.length === 4;
    }

    const checkCodeDisplay = () => {
        return <>
            <div className={SetPasswordStyle.container}>
                <div className={SetPasswordStyle.fa_container}>

                    <span className={SetPasswordStyle.subtitle}>{t("twofa.code_sent")}</span>

                    <b>{phoneNumber}</b>

                    <span className={SetPasswordStyle.subtitle}>
                          {t("twofa.code_not_received")}
                    </span>

                    {codeError &&
                        <Alert onClose={() => setCodeError(false)} severity="error"
                               message={t("twofa.code_invalid")} style={{width:'100%'}}/>
                    }

                    <Input
                        placeholder={t("twofa.code_placeholder")}
                        value={code}
                        onChange={(e) => setCode(e.target.value)} name={'code'}
                    />

                </div>
            </div>
        </>
    }

    const cancelEnable2Factors = () => {
        setConfirmEnable2FA(false);
        setStep(1);
        setPhoneNumber(null);
    }

    return <>
        <div className={SetPasswordStyle.fa_container}>
            <div className={SetPasswordStyle.fa_sub_container}>
                <b>{t("twofa.title")}</b>
                <span>{t("twofa.subtitle")}</span>
            </div>
            <div className={SetPasswordStyle.fa_switch}>
                <Switch
                    checked={faEnabled}
                    onChange={manage2FAToggleChange}
                />
                <span>{faEnabled ? t("twofa.activated") : t("twofa.not_activated")}</span>
            </div>

        </div>

        <Modal title={t("twofa.enable_modal_title")} open={confirmEnable2FA}
               centered
               destroyOnClose={true}
               onCancel={cancelEnable2Factors}
               footer={confirm2FAFooter}>

            {step === 1 && <div className={SetPasswordStyle.fa_modal_container}>
                    <PhoneInput
                        international={false}
                        defaultCountry={"FR"}
                        placeholder={t("twofa.phone_placeholder")}
                        value={phoneNumber}
                        className={SetPasswordStyle.fa_modal_phone}
                        onChange={setPhoneNumber}/>
                </div>
            }

            {step === 2 && <div className={SetPasswordStyle.fa_modal_container}>
                    {checkCodeDisplay()}
                </div>
            }

        </Modal>

        <Modal title={t("twofa.disable_modal_title")} open={confirmDisable2FA}
               centered
               destroyOnClose={true}
               onCancel={() => setConfirmDisable2FA(false)}
               footer={confirmDisable2FAFooter}>

            <Alert message={t("twofa.disable_warning")} type="info" />

        </Modal>
    </>
}
