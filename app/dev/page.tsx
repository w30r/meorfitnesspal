"use client";

import { useState } from "react";
import { enablePushNotifications } from "../lib/firebase-client";

export default function DevPage() {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const handleEnablePush = async () => {
    setLoading(true);
    setMessage("");

    const result = await enablePushNotifications();

    if (result === "Permission denied") {
      setMessage("❌ Permission denied. Please allow notifications in browser settings.");
    } else if (result) {
      setToken(result);
      setMessage("✅ Push notifications enabled! Copy your token below.");
    } else {
      setMessage("❌ Failed to get push token. Make sure you're using HTTPS or localhost.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestNotification = async () => {
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      
      if (response.ok) {
        setMessage("✅ Test notification sent!");
      } else {
        const data = await response.json();
        setMessage(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setMessage("❌ Failed to send notification");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">🛠 Dev Tools</h1>

      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg border">
          <h2 className="text-lg font-semibold text-foreground mb-3">Push Notifications</h2>
          
          <button
            onClick={handleEnablePush}
            disabled={loading}
            className="w-full p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Getting token..." : "Enable Push Notifications"}
          </button>

          {message && (
            <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          )}

          {token && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Your Push Token:</p>
                <textarea
                  readOnly
                  value={token}
                  className="w-full h-24 p-2 bg-muted text-muted-foreground text-xs rounded border font-mono"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 p-2 bg-secondary text-secondary-foreground rounded text-sm font-medium"
                >
                  {copied ? "Copied! 📋" : "Copy Token"}
                </button>
                
                <button
                  onClick={handleTestNotification}
                  className="flex-1 p-2 bg-green-600 text-white rounded text-sm font-medium"
                >
                  Test Notification 🔔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        Secret dev page • Not linked anywhere
      </p>
    </div>
  );
}