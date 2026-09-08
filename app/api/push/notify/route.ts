import { NextResponse } from "next/server";
import webpush from "web-push";

export const runtime = "nodejs";

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL || "";

const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN || "";

const PUSH_WEBHOOK_SECRET =
  process.env.PUSH_WEBHOOK_SECRET || "";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || "";

const VAPID_EMAIL =
  process.env.VAPID_EMAIL ||
  "mailto:muhamamdiqnaa@gmail.com";

type Subscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function cargoNotification(row: string[]) {
  // OPEN CARGO:
  // ID, STATUS, CARGO, SIZE, AREA, POL, POD, DISTANCE, ROUTE, DETAIL, INQUIRY

  const cargo = clean(row[2]);
  const size = clean(row[3]);
  const pol = clean(row[5]);
  const pod = clean(row[6]);
  const distance = clean(row[7]);

  return {
    title: "🆕 New Shipment Available",
    body:
      `${cargo || "Cargo"} • ${size || "-"}\n` +
      `${pol || "-"} → ${pod || "-"}\n` +
      `Distance: ${distance || "-"} NM`,
    url: "/",
  };
}

function vesselNotification(row: string[]) {
  // OPEN VESSEL:
  // DATE, TYPE, SIZE, POSITION, AVAILABLE DATE, NEXT PORT, INQUIRY

  const type = clean(row[1]);
  const size = clean(row[2]);
  const position = clean(row[3]);
  const availableDate = clean(row[4]);
  const nextPort = clean(row[5]);

  return {
    title: "🆕 New Vessel Available",
    body:
      `${type || "Vessel"} • ${size || "-"}\n` +
      `Position: ${position || "-"}\n` +
      `Available: ${availableDate || "-"}\n` +
      `Next Port: ${nextPort || "-"}`,
    url: "/",
  };
}

async function getSubscriptions(): Promise<Subscription[]> {
  const url =
    `${APPS_SCRIPT_URL}` +
    `?token=${encodeURIComponent(ADMIN_TOKEN)}` +
    `&action=get_push_subscriptions`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Gagal mengambil push subscriptions"
    );
  }

  return Array.isArray(result.data)
    ? result.data
    : [];
}

async function deleteSubscription(subscription: Subscription) {
  await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: ADMIN_TOKEN,
      action: "delete_push_subscription",
      data: {
        endpoint: subscription.endpoint,
      },
    }),
    cache: "no-store",
  });
}

async function sendNotification(
  subscription: Subscription,
  payload: object
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );

    return "sent";
  } catch (error: any) {
    const statusCode =
      Number(error?.statusCode || 0);

    if (statusCode === 404 || statusCode === 410) {
      await deleteSubscription(subscription);
      return "removed";
    }

    console.error(
      "WEB PUSH SEND ERROR:",
      statusCode,
      error?.message || error
    );

    return "failed";
  }
}

export async function POST(request: Request) {
  try {
    if (
      !PUSH_WEBHOOK_SECRET ||
      !APPS_SCRIPT_URL ||
      !ADMIN_TOKEN ||
      !VAPID_PUBLIC_KEY ||
      !VAPID_PRIVATE_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Environment push belum lengkap",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (body.secret !== PUSH_WEBHOOK_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (body.event !== "NEW_MARKET_ITEM") {
      return NextResponse.json(
        {
          success: false,
          message: "Event push tidak valid",
        },
        { status: 400 }
      );
    }

    webpush.setVapidDetails(
      VAPID_EMAIL,
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );

    const subscriptions =
      await getSubscriptions();

    const cargoRows = Array.isArray(body.cargo)
      ? body.cargo
      : [];

    const vesselRows = Array.isArray(body.vessel)
      ? body.vessel
      : [];

    const notifications: object[] = [];

    cargoRows.forEach((row: string[]) => {
      notifications.push(
        cargoNotification(row)
      );
    });

    vesselRows.forEach((row: string[]) => {
      notifications.push(
        vesselNotification(row)
      );
    });

    if (notifications.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "Tidak ada item baru",
      });
    }

    let sent = 0;
    let removed = 0;
    let failed = 0;

    for (const payload of notifications) {
      for (const subscription of subscriptions) {
        const result =
          await sendNotification(
            subscription,
            payload
          );

        if (result === "sent") sent++;
        if (result === "removed") removed++;
        if (result === "failed") failed++;
      }
    }

    return NextResponse.json({
      success: true,
      notifications: notifications.length,
      subscriptions: subscriptions.length,
      sent,
      removed,
      failed,
    });
  } catch (error) {
    console.error("PUSH NOTIFY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengirim notification",
      },
      { status: 500 }
    );
  }
}
