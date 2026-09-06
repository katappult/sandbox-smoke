import {Button, Divider} from "antd";
import FormStyle from "@/styles/components/FormStyle.module.css";
import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {RevControlledService} from "@/services/RevControlled.service";
import {WorkableService} from "@/services/Workable.service";

const isTrue = (value) => {
    return value === true || value === "true";
}

export default function RevisionControlledActions({iterated, postUpdateStateSuccess}){
    const { t } = useTranslation();

    const hasWorkingCopy = isTrue(iterated.hasWorkingCopy);
    const isWorkingCopy = isTrue(iterated.workingCopy);
    const isLockedByMe = isTrue(iterated.lockedByMe);
    const isLatestIteration = isTrue(iterated.latestIteration);
    const isLatestVersion = isTrue(iterated.latestVersion);

    const canCheckin = isWorkingCopy && isLockedByMe;
    const canCheckout = isLatestIteration && isLatestVersion && !hasWorkingCopy;
    const canUndoCheckout = isWorkingCopy && isLockedByMe;
    const canForwardToWC = hasWorkingCopy && !isWorkingCopy;
    const canForwardToLatest = hasWorkingCopy && isWorkingCopy;
    const canRevise = !hasWorkingCopy && isLatestIteration && isLatestVersion;

    const iteratedId = iterated.id;

    const _doCheckin = () => {
        WorkableService.checkin(iteratedId).then(response => {
            postUpdateStateSuccess();
        })
    }

    const _doCheckout = () => {
        WorkableService.checkout(iteratedId).then(response => {
            postUpdateStateSuccess();
        })
    }

    const _doUndoCheckout = () => {
        WorkableService.undoCheckout(iteratedId).then(response => {
            postUpdateStateSuccess();
        })
    }

    const _doRevise = () => {
        RevControlledService.revise(iteratedId).then(response => {
            postUpdateStateSuccess();
        })
    }

    const _doForwardToLatest = () => {
        RevControlledService.latestVersionOf(iteratedId).then(response => {
        })
    }

    const _doForwardToWorkingCopy = () => {
        RevControlledService.workingCopy(iteratedId).then(response => {
            postUpdateStateSuccess();
        })
    }

    if(!iterated) return <></>

    return <>
        <Divider/>
        {canCheckout && <Button type="primary" className={FormStyle.button_cancel} onClick={_doCheckout}>
                <span>{t("rc.checkout")}</span>
            </Button>
        }
        {canCheckin && <Button type="primary" className={FormStyle.button_cancel} onClick={_doCheckin}>
                <span>{t("rc.checkin")}</span>
            </Button>
        }
        {canUndoCheckout && <Button type="primary" className={FormStyle.button_cancel}  onClick={_doUndoCheckout}>
                <span>{t("rc.undo_checkout")}</span>
            </Button>
        }
        {canRevise && <Button type="primary" className={FormStyle.button_cancel} onClick={_doRevise}>
                <span>{t("rc.revise")}</span>
            </Button>
        }
        {canForwardToWC && <Button type="primary" className={FormStyle.button_cancel} onClick={_doForwardToWorkingCopy}>
                <span>{t("rc.to_working_copy")}</span>
            </Button>
        }
        {canForwardToLatest && <Button type="primary" className={FormStyle.button_cancel}  onClick={_doForwardToLatest}>
                <span>{t("rc.to_latest_version")}</span>
            </Button>
        }
    </>
}