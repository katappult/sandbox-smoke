import {useEffect, useRef} from "react";
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { toThumbFullURL } from "@/utils";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import style from "@/styles/components/inputImage.module.css";

export default function InputImage(props) {

    const {removeFile, thumbPath, imageKey, imagePos, isRequired, readOnly, removable} = props;
    const inputRef = useRef(null);
    const imagePreview = useRef(null);

    useEffect(() => {
        if(thumbPath){
            imagePreview.current.src = toThumbFullURL(thumbPath, 150);
            imagePreview.current.style.display = "block";
        }
    }, [thumbPath])

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files.length > 0 && files[0].type.startsWith("image/")) {
            const fileUrl = URL.createObjectURL(files[0]);
            imagePreview.current.src = fileUrl;
            imagePreview.current.style.display = "block";
            if (props.onChange) {
                props.onChange(files[0]);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        handleFileUpload({target: {files}});
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={style.container}>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={style.image_container}
            >
                <img
                    style={{display: "none"}}
                    className={style.imagePreview}
                    ref={imagePreview}
                />

                <InsertPhotoIcon 
                    className={style.image}
                />

                <span id="label" className={style.label}>
                    {props.label}
                </span>
                <input
                    ref={inputRef}
                    disabled={readOnly}
                    onChange={handleFileUpload}
                    type="file"
                    accept="image/*"
                    style={{display: "none"}}
                    required={isRequired}
                />
            </div>
            {
                !readOnly && (removable || (imageKey !== 0 && imageKey === imagePos)) && (
                    <button type="button" className={style.btn_reset} onClick={() => removeFile(imageKey)}>
                        <ClearOutlinedIcon className={style.btn_reset_icon}/>
                    </button>
                )
            }
        </div>
    );
}
