import { initializeApp, getApps } from "firebase/app";
import { getToken, getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA_h2XGlbTcER8d_AUglbex5PV4c9hAx08",
  authDomain: "meorfp-notif.firebaseapp.com",
  projectId: "meorfp-notif",
  storageBucket: "meorfp-notif.firebasestorage.app",
  messagingSenderId: "99631836150",
  appId: "1:99631836150:web:03ad42f5b2ee2fd94475d7",
  measurementId: "G-Z7Q14H6PQ5"
};

const vapidKey = "Aq-KogCZ5euf1kZbAZeDS70BLnC2q531MTV_3HRfrVA";

let messaging: Messaging | null = null;

function getFirebaseMessaging(): Messaging | null {
  if (typeof window === "undefined") return null;
  
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  
  if (!messaging) {
    messaging = getMessaging();
  }
  
  return messaging;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

export async function getPushToken(): Promise<string | null> {
  const messaging = getFirebaseMessaging();
  if (!messaging) return null;
  
  try {
    const token = await getToken(messaging, {
      vapidKey: vapidKey
    });
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

export async function enablePushNotifications(): Promise<string | null> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    return "Permission denied";
  }
  
  const token = await getPushToken();
  return token;
}