import ModalStyle from "@/styles/components/ModalStyle.module.css";
import {Button, Result, Typography} from "antd";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import ImportMassif from "@/components/common/massImport/ImportMassif";
import {FileCopyOutlined, FileUploadOutlined} from "@mui/icons-material";
import ImportCopyPaste from "@/components/common/massImport/ImportCopyPaste";

export default function DataImport() {

    const [success, setSuccess] = useState(false);
    const { t } = useTranslation();
    const [selectedMode, setSelectedMode] = useState(null);

    const handleSelect = (mode) => {
        setSelectedMode(mode);
    };

    if(success) {
        return <div className={ModalStyle.container}>
            <div style={{width:"100%", margin:"auto", marginTop:80, display:"flex",
                        alignItems: "center",
                        justifyContent:"center", flexDirection:"column"}}>
                <Result
                    status="success"
                    title={t('common.import_success')}
                    subTitle={t('common.import_success_desc')}
                />
                <Button style={{width:100}} onClick={() => setSuccess(false)}>
                    {t('common.close')}
                </Button>
            </div>
        </div>
    }

    const onBack = () => {
        setSelectedMode(null);
    }

    if(selectedMode === "excel") {
        return <ImportMassif onBack={onBack}/>
    }

    if(selectedMode === "paste") {
        return <ImportCopyPaste onBack={onBack}/>
    }

    return <div className={ModalStyle.container}>

        <section className={"import_card_section"}>
            <div className={"import_card"} onClick={() => handleSelect("paste")}>
                <div className={"import_card_header"}>
                    <FileCopyOutlined style={{fontSize:40}}/>
                </div>
                <div className={"import_card_content"}>
                    <Typography.Title level={4}>
                        {t('common.copy_paste')}
                    </Typography.Title>
                    <p>
                        {t('common.copy_paste_desc')}
                    </p>
                </div>
            </div>
            <div className={"import_card"}>
                <div className={"import_card_header"}>
                    <FileUploadOutlined style={{fontSize:40}}/>
                </div>
                <div className={"import_card_content"}>
                    <Typography.Title level={4}>
                        {t('common.import_from_file')}
                    </Typography.Title>
                    <p>
                        {t('common.import_from_file_desc')}
                    </p>
                </div>
            </div>
        </section>
    </div>
}