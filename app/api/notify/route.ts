import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "meorfp-notif",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, title = "Meal Time!", body = "Time to log your meal!" } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}