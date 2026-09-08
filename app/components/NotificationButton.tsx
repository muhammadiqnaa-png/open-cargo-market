"use client";

import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (
    base64String + padding
  )
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

export default function NotificationButton() {
  const [supported, setSupported] =
    useState(false);

  const [enabled, setEnabled] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    ) {
      setSupported(true);

      if (
        Notification.permission ===
        "granted"
      ) {
        setEnabled(true);
      }
    }
  }, []);

  const enableNotifications = async () => {
    try {
      setLoading(true);

      if (!VAPID_PUBLIC_KEY) {
        alert(
          "VAPID Public Key belum ditemukan."
        );
        return;
      }

      const permission =
        await Notification.requestPermission();

      if (permission !== "granted") {
        alert(
          "Permission notification ditolak."
        );
        return;
      }

      const registration =
        await navigator.serviceWorker.register(
          "/sw.js"
        );

      const subscription =
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            urlBase64ToUint8Array(
              VAPID_PUBLIC_KEY
            ),
        });

      console.log(
        "PUSH SUBSCRIPTION:",
        JSON.stringify(subscription)
      );

      const response = await fetch(
  "/api/subscribe",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  }
);

const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(
    result.message ||
      "Gagal menyimpan subscription"
  );
}

      setEnabled(true);

      alert(
        "🔔 Notification Fawaid berhasil diaktifkan!"
      );

    } catch (error) {
      console.error(
        "NOTIFICATION ERROR:",
        error
      );

      alert(
        "Gagal mengaktifkan notification."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={enableNotifications}
      disabled={loading || enabled}
      className={`rounded-xl px-5 py-3 font-bold shadow-md transition ${
        enabled
          ? "bg-green-100 text-green-700"
          : "bg-[#0B3D68] text-white hover:bg-[#0F4C81]"
      }`}
    >
      {loading
        ? "⏳ Activating..."
        : enabled
        ? "🔔 Notifications ON"
        : "🔔 Enable Notifications"}
    </button>
  );
}