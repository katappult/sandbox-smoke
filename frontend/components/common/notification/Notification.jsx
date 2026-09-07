import { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "@/lib/firebase";
import { useTranslation } from "react-i18next";


const VAPI_PRIVATE_KEY_FROM_FIREBASE = "5l49Nf6mvObbbKrPb5cNanldnKLDOAs4SF2DYdUoH0Y";
export default function Notification() {
    const { t } = useTranslation();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (messaging) {
            // Request permission to show notifications
            Notification.requestPermission()
                .then((permission) => {
                    if (permission === "granted") {
                        console.log("🔔 Notification permission granted.");
                        return getToken(messaging, { vapidKey: VAPI_PRIVATE_KEY_FROM_FIREBASE });
                    } else {
                        console.log("🚫 Permission denied.");
                    }
                })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log("📲 FCM Token:", currentToken);
                        setToken(currentToken);
                    } else {
                        console.log("❌ No FCM token received.");
                    }
                })
                .catch((err) => {
                    console.error("❌ Error getting FCM token:", err);
                });

            // Listen for incoming messages
            onMessage(messaging, (payload) => {
                console.log("📩 Message received:", payload);
                alert(`New Notification: ${payload.notification.title}`);
            });
        }
    }, []);

    return (
        <div>
            <h3>{t("notif.fcm_token")} :</h3>
            <textarea readOnly value={token} style={{ width: "100%", height: "100px" }} />
        </div>
    );
}
