

importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA-C3PBajtaQIar6HIoxalQyD5OPuuU3l4",
    authDomain: "nexitia-apps.firebaseapp.com",
    projectId: "nexitia-apps",
    storageBucket: "nexitia-apps.firebasestorage.app",
    messagingSenderId: "79096611494",
    appId: "1:79096611494:web:d1c7570dde9bb795356a67",
    measurementId: "G-GPRYH571Y4"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/firebase-logo.png"
    });
});
