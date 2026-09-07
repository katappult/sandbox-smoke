import React, {useRef, useState} from "react";
import FileInputStyle from "@/styles/components/FileInput.module.css";
import { useTranslation } from "react-i18next";

export default function FileInput(props) {

    const { t } = useTranslation();
    const input = useRef();
    const preview = useRef();
    const [fileName, setFileName] = useState();

    const clickDrop = () => {
        input.current.click();
    }

    const dragOver = (e) => {
        e.preventDefault();
    }

    const handleFileUpload = () => {
        const files = input.current.files;

        if (files.length > 0) {
            setFileName(files[0].name);
            const fileUrl = URL.createObjectURL(files[0]);
            preview.current.src = fileUrl;
            document.getElementById("cloud").style.display = "none";
            document.getElementById("instruction").style.display = "none";
            document.getElementById("taille").style.display = "none";
            document.getElementById("preview").style.display = "block";

            if (props.type === "csv") {
                document.getElementById("preview").style.display = "none";
                document.getElementById("fileImage").style.display = "block";
                document.getElementById("infoCSV").style.display = "block";
            }
        }

        props.ondropFile(files);
    }

    const droped = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.current.files = files;
            handleFileUpload();

        }
    }

    return (
        <div className={FileInputStyle.container}>

            <div className={FileInputStyle.title_container}>
                <span className={FileInputStyle.title}>{props.label}</span><span> {props.sublabel}</span>
            </div>


            <div onDrop={droped} onDragOver={dragOver} onClick={clickDrop} className={FileInputStyle.drag_drop}>
                {
                    props.type === "image" ?
                        <img id="preview" className={FileInputStyle.preview} ref={preview} alt=""/>
                        :
                        <div ref={preview} id="preview" className={FileInputStyle.preview}>
                        </div>
                }

                <img id="cloud" className={FileInputStyle.cloud} style={{display: "none"}} src={"/images/cloudupload.svg"} alt="cloud"/>
                <img id="fileImage" className={FileInputStyle.cloud} src={"/images/csv.svg"} alt="file"/>
                <div id="instruction" className={FileInputStyle.instruction}>
                    <b>{t("file.choose_file")}</b>
                </div>
                <div className={FileInputStyle.instruction} id="infoCSV">
                    <b>{fileName}</b>
                </div>
                <span id="taille">{t("file.size_max", { size: props.size ? props.size : "10" })}</span>
            </div>

            <input onChange={handleFileUpload} ref={input} accept={props.type === "image" ? "image/*" : ".csv"}
                   style={{display: "none"}} type="file"/>

        </div>
    )
}