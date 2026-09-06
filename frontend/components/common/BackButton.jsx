import {ArrowBackOutlined} from "@mui/icons-material";
import React from "react";
import InfoStyle from "@/styles/pages/Info.module.css";
import {useRouter} from "next/router";

export default function BackButton({onBack}){
    const router = useRouter();

    if(!onBack) {
        return  <button className={InfoStyle.back_btn} onClick={() => router.back()}>
            <ArrowBackOutlined style={{ fontSize: 16 }} />
            Retour
        </button>
    }

    return <button
        onClick={onBack}
        style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: "#667085", padding: "4px 0",
        }}
    >
        <ArrowBackOutlined style={{ fontSize: 16 }} />
        Retour
    </button>
}