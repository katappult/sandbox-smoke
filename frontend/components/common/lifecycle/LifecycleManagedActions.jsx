import {Button, Popconfirm} from "antd";
import FormStyle from "@/styles/components/FormStyle.module.css";
import React, {useEffect, useState} from "react";
import {LifecycleService} from "@/services/Lifecycle.service";
import {responseSuccess} from "@/utils";
import LifecycleHistoryTimeline from "@/components/common/lifecycle/LifecycleHistoryTimeline";
import { useTranslation } from "react-i18next";

export default function LifecycleManagedActions(props){
    const { t } = useTranslation();

    const {lifecycleManaged, postUpdateStateSuccess} = props;
    const status = lifecycleManaged?.status;
    const [states, setStates] = useState([]);

    useEffect(() => {

        if(status){
            LifecycleService.statesByAction(lifecycleManaged.fullId, status, "SET_STATE").then(response => {
                if(responseSuccess(response)){
                    let actions = response.data?.attributes?.statesByAction;
                    if(actions) {
                        setStates(actions.split(';'))
                    }
                }
            })
        }

    }, [status]);

    const setState = (status) => {
        LifecycleService.setState(lifecycleManaged.fullId, status).then(response => {
            postUpdateStateSuccess();
        })
    }

    if(!lifecycleManaged || !status) return <></>

    return <>
        <strong>{t("lifecycle.status_label")}</strong>
        {
            states.map((status) => (
                <Popconfirm
                    key={status}
                    title={t("lifecycle.confirm_title")}
                    description={t("lifecycle.confirm_desc")}
                    onConfirm={() => setState(status)}
                >
                    <Button type="primary" className={FormStyle.button_cancel}>
                        <span>{t("lifecycle.transition_btn", { status })}</span>
                    </Button>
                </Popconfirm>
            ))
        }
        <LifecycleHistoryTimeline entityId={lifecycleManaged.fullId} creationDate={lifecycleManaged.createDate}/>
    </>
}