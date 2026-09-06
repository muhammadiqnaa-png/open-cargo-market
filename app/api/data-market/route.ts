import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function GET() {
  try {
    if (!APPS_SCRIPT_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message: "Konfigurasi Apps Script belum lengkap",
        },
        { status: 500 }
      );
    }

    const url =
      `${APPS_SCRIPT_URL}` +
      `?token=${encodeURIComponent(ADMIN_TOKEN)}` +
      `&action=get_data_market`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result?.success) {
      console.error("DATA MARKET APPS SCRIPT ERROR:", result);

      return NextResponse.json(
        {
          success: false,
          message:
            result?.message ||
            "Gagal membaca DATA MARKET dari Apps Script",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data || []);
  } catch (error) {
    console.error("DATA MARKET API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membaca DATA MARKET",
      },
      { status: 500 }
    );
  }
}