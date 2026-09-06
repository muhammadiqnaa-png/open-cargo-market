import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function POST(request: Request) {
  try {
    console.log("=== ADMIN API START ===");

    if (!APPS_SCRIPT_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "GOOGLE_APPS_SCRIPT_URL belum terbaca di Vercel",
        },
        { status: 500 }
      );
    }

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_PASSWORD belum terbaca di Vercel",
        },
        { status: 500 }
      );
    }

    if (!ADMIN_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_TOKEN belum terbaca di Vercel",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      password,
      action,
      data,
    } = body;

    console.log("Action:", action);

    // =========================
    // CEK PASSWORD ADMIN
    // =========================

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: "Password admin salah",
        },
        { status: 401 }
      );
    }

    // =========================
    // CEK ACTION
    // =========================

    const allowedActions = [
      "add_vessel",
      "update_vessel",
      "delete_vessel",
      "add_cargo",
      "update_cargo",
      "delete_cargo",
    ];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: `Action tidak valid: ${action}`,
        },
        { status: 400 }
      );
    }

    // =========================
    // KIRIM KE GOOGLE APPS SCRIPT
    // =========================

    console.log("Menghubungi Google Apps Script...");

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: ADMIN_TOKEN,
        action,
        data,
      }),
      cache: "no-store",
    });

    console.log("Apps Script status:", response.status);

    // Ambil sebagai TEXT dulu
    // supaya kalau Apps Script mengembalikan HTML/error,
    // kita bisa melihat isinya.
    const responseText = await response.text();

    console.log("Apps Script response:", responseText);

    // =========================
    // CEK RESPONSE
    // =========================

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Google Apps Script error (${response.status})`,
          detail: responseText.slice(0, 1000),
        },
        { status: 500 }
      );
    }

    // =========================
    // PARSE JSON
    // =========================

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Google Apps Script tidak mengembalikan JSON",
          detail: responseText.slice(0, 1000),
        },
        { status: 500 }
      );
    }

    // =========================
    // RETURN
    // =========================

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("ADMIN API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Terjadi kesalahan pada Admin API",
      },
      { status: 500 }
    );
  }
}