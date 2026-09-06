// Import Firebase SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import getAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase Configuration (Replace with your own values)
const firebaseConfig = {
    apiKey: "AIzaSyA-C3PBajtaQIar6HIoxalQyD5OPuuU3l4",
    authDomain: "nexitia-apps.firebaseapp.com",
    projectId: "nexitia-apps",
    storageBucket: "nexitia-apps.firebasestorage.app",
    messagingSenderId: "79096611494",
    appId: "1:79096611494:web:d1c7570dde9bb795356a67",
    measurementId: "G-GPRYH571Y4"
};

// Initialize Firebase (Avoid re-initialization in Next.js SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export { app, auth, db, messaging, getToken, onMessage };
