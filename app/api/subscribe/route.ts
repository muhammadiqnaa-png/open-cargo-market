import { NextResponse } from "next/server";

export const runtime = "nodejs";

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL || "";

const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN || "";

export async function POST(request: Request) {
  try {
    if (!APPS_SCRIPT_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "Push storage environment belum lengkap",
        },
        { status: 500 }
      );
    }

    const subscription = await request.json();

    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Subscription tidak valid",
        },
        { status: 400 }
      );
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: ADMIN_TOKEN,
        action: "save_push_subscription",
        data: subscription,
      }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Gagal menyimpan subscription"
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification subscription tersimpan",
    });
  } catch (error) {
    console.error("SUBSCRIBE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan subscription",
      },
      { status: 500 }
    );
  }
}
