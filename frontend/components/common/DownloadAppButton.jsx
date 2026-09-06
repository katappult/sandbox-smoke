import React, { useState, useEffect } from 'react';
import {Android, Apple} from "@mui/icons-material";
import {DownloadService} from "@/services/DownloadService";
import {notificationError, notificationSuccessAdd} from "@/utils";
import {Spin} from "antd";
import { useTranslation } from "react-i18next";

const DownloadAppButton = () => {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [processDownload, setProcessDownload] = useState(false);

    useEffect(() => {
        // Vérifie la taille de l'écran au démarrage et lors du redimensionnement
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768); // Ajuste cette valeur pour définir le seuil de "mobile"
        };

        // Écoute les changements de taille d'écran
        window.addEventListener('resize', checkDevice);

        // Vérifie la taille de l'écran au montage du composant
        checkDevice();

        // Nettoyer l'écouteur d'événements lors de la suppression du composant
        return () => {
            window.removeEventListener('resize', checkDevice);
        };
    }, []);

    const downloadApk = async (e) => {

        setProcessDownload(true);

        DownloadService.apk().then(response => {

            if(response && response.status === 200){
                try{
                    // create file link in browser's memory
                    const href = URL.createObjectURL(response.data);

                    // create "a" HTML element with href to file & click
                    const link = document.createElement('a');
                    link.href = href;
                    link.setAttribute('download', 'Katappult-ai-mobile.apk');
                    document.body.appendChild(link);
                    link.click();

                    // clean up "a" element & remove ObjectURL
                    document.body.removeChild(link);
                    URL.revokeObjectURL(href);
                } finally {
                    setProcessDownload(false);
                }
            }
            else {
                setProcessDownload(false);
                notificationError(t("app.download_error"));
            }
        }).catch((error) => {
           setProcessDownload(false);
        });

        return false;
    }

    const downloadApp = (platform) => {
        if (platform === 'android') {
            downloadApk();
        } else if (platform === 'ios') {
            notificationError(t("app.ios_unavailable"));
        }
    };

    if (!isMobile) return null; // Si l'écran n'est pas mobile, on ne montre rien

    return (
        <div style={{
            display: 'flex', justifyContent: "center", alignItems: "center",
            width: "100%", height: "100%", marginTop: "-20px",
            flexDirection: 'column', gap: '10px'
        }}>

            <div style={{
                backgroundColor: '#ffffff',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                width: "300px",
                marginBottom: '10px'
            }}>
                <h3>{t("app.mobile_title")}</h3>
                <p style={{fontSize: '14px', color: '#555'}}>
                    {t("app.mobile_desc")}
                </p>
            </div>

            <button
                style={ButtonStyle}
                onClick={() => downloadApp('android')}>
                {processDownload && <Spin />}
                {!processDownload && <Android/>}
                {t("app.download_android")}
            </button>


            <button
                style={ButtonStyle}
                onClick={() => downloadApp('ios')}>
                <Apple/>
                {t("app.download_ios")}
            </button>
        </div>
    );
};

export default DownloadAppButton;


const ButtonStyle = {
    backgroundColor: '#000000',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '30px',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    border: 'none',
    width: 250,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
}