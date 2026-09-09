import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import "@/styles/brand_1.css";
import "@/styles/global.css";
import "@/styles/tailwind.css";
import "@/styles/client.css";
import { useEffect } from "react";
import store from "@/redux/store.service";
import {I18nextProvider} from "react-i18next";
import i18n from "@/i18n";
import { applyFontSize } from "@/components/admin/ThemeSettings";

function MyApp({ Component, pageProps }) {

    const isClientSide = typeof window !== "undefined";

    useEffect(() => {
        applyFontSize(localStorage.getItem("appFontSize") || "normal");
    }, []);

    useEffect(() => {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("✅ Firebase Service Worker registered:", registration);
                })
                .catch((err) => console.log("❌ Firebase Service Worker registration failed:", err));
        }

    }, [])

    useEffect(() => {
        if (isClientSide) {
            const reloadPage = (event) => {
                if (event.key === "Authorization" && event.newValue === null && event.oldValue !== null) {
                    window.location.reload();
                }
            };

            window.addEventListener('storage', reloadPage);

            return () => {
                window.removeEventListener('storage', reloadPage);
            };
        }
    }, []);

    // Simplified rendering logic
    const content = (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <ConfigProvider>
                    {Component.getLayout ? Component.getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
                </ConfigProvider>
            </Provider>
        </I18nextProvider>
    );

    return content;
}

export default MyApp;
