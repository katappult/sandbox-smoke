import ModalStyle from '@/styles/components/ModalStyle.module.css';
import BackOfficeStyle from '@/styles/pages/BackOfficeStyle.module.css';
import FileInput from '@/components/common/FileInput';
import React, {useEffect, useState} from 'react';
import {Button, Modal, notification, Spin} from "antd";
import { useTranslation } from 'react-i18next';
import {BatchService} from "@/services/Batch.service";
import {batchImportForm, responseSuccess} from "@/utils";
import {ImportModelDownloadService} from "@/services/ImportModelDownload.service";

export default function ImportCSV(props) {

    const { t } = useTranslation();
    const [display, setDisplay] = useState("none");
    const [masterFile, setMasterFile] = useState();
    const [step, setStep] = useState(1);
    const [fileContent, setFileContent] =  useState();
    const [importSuccess, setImportSuccess] =  useState(false);
    const [processing, setProcessing] =  useState(false);

    useEffect(() => {
        function getDisplay() {
            setDisplay(props.visible === true ? 'flex' : 'none');
        }

        getDisplay();
    }, [props.visible]);

    useEffect(() => {
        if(step === 1){
            setFileContent(null);
        }
    }, [step])

    useEffect(() => {

        if(masterFile){
            const reader = new FileReader()
            reader.onload = async (e) => {
                const text = (e.target.result);
                setFileContent(text);
            };
            reader.readAsText(masterFile)
        }

    }, [masterFile])

    const goToStep = (index) => {
        setProcessing(false);
        setImportSuccess(false);
        setStep(index);
    }

    const clearDatas = () => {
        setProcessing(false);
        setImportSuccess(false);
        setStep(1);
        setFileContent(null);
        setMasterFile(null);
    }

    const ondropFile = (files) => {
        setMasterFile(files[0]);
    }

    const doBatchImport = () => {
        const lines = fileContent.split('\n');
        const newLines = [];
        lines.map((line) => {
            if(line && line.trim() != "" && !line.startsWith("#")){
                let newLine = `${line}\n`;
                newLines.push(newLine);
            }
        })

        const blob = new Blob(newLines, { type: 'text/plain' });
        const file = new File([blob], 'filename.csv');

        let batchImportFormData = new FormData()
        batchImportFormData.append('file', file)

        const form = batchImportForm("manage" + props.entity);
        batchImportFormData.append('form', JSON.stringify(form));

        setProcessing(true);
        BatchService.batchLoad(batchImportFormData).then(response => {
            setProcessing(false);
            props.reload();
            if(!responseSuccess(response)){
                notification.error({
                    message: 'Error',
                    description: `Error importing datas`,
                })
            }
            else {
                setImportSuccess(true);
                clearDatas();
                props.reload();
                props.onHide();
            }
        })
    }

    const fileLineByLine = () => {
        return fileContent ? fileContent.split('\n') : "";
    }

    const modalTitle = () => {
        return t('common.import_csv_title', { entity: props.entity });
    }

    const downloadImportModelCSV = (e) => {
        e.preventDefault();
        ImportModelDownloadService.modelOf( props.entity).then(response => {

            if(response && response.status === 200){
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);

                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download',  props.entity + '-import-csv-model.csv');
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            }
        })
    }

    const getModalContent = () => {
        return <div className={ModalStyle.container}>
            <div className={ModalStyle.header_wrapper}>
                <div className={ModalStyle.header}>
                    <span className={ModalStyle.title}>{modalTitle()}</span>
                    <div className={ModalStyle.subtitle}>
                        {t('common.import_csv_desc', { file: `${props.entity}-import-model.csv` })}
                    </div>
                </div>
            </div>
            <div className={ModalStyle.body}>
                <FileInput type="csv" ondropFile={ondropFile}/>
            </div>
            <div className={ModalStyle.footer}>
                <Button className={`${BackOfficeStyle.button_cancel} ${ModalStyle.mi_hundred_cent}`}
                        onClick={props.onHide}>
                    {t('common.cancel')}
                </Button>
                <Button className={`${BackOfficeStyle.button_approve} ${ModalStyle.mi_hundred_cent}`}
                        disabled={processing}
                        onClick={doBatchImport}>
                    {!processing ? <span>{modalTitle()}</span> : <Spin/>}
                </Button>
            </div>
        </div>
    }

    return (
        <Modal centered={true} open={props.visible}
               destroyOnClose={true}
               footer={null}
               onClose={props.onHide} onCancel={props.onHide}>
            {getModalContent()}
        </Modal>
    );
}