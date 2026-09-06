import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function POST(request: Request) {
  try {
    // ==============================
    // CHECK ENVIRONMENT VARIABLES
    // ==============================
    if (!APPS_SCRIPT_URL || !ADMIN_PASSWORD || !ADMIN_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin API belum dikonfigurasi",
        },
        { status: 500 }
      );
    }

    // ==============================
    // READ REQUEST
    // ==============================
    const body = await request.json();

    const {
      password,
      action,
      data,
    } = body;

    // ==============================
    // CHECK ADMIN PASSWORD
    // ==============================
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: "Password admin salah",
        },
        { status: 401 }
      );
    }

    // ==============================
    // ALLOWED ACTION
    // ==============================
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
          message: "Action tidak valid",
        },
        { status: 400 }
      );
    }

    // ==============================
    // SEND TO GOOGLE APPS SCRIPT
    // ==============================
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

    // ==============================
    // READ RESPONSE
    // ==============================
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            result?.message ||
            "Gagal menghubungi Google Apps Script",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("ADMIN API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada Admin API",
      },
      { status: 500 }
    );
  }
}