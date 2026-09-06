import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL;

const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN;

export async function GET() {
  try {
    if (!APPS_SCRIPT_URL || !ADMIN_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data Market API belum dikonfigurasi",
        },
        {
          status: 500,
        }
      );
    }

    const url =
      `${APPS_SCRIPT_URL}` +
      `?action=get_data_market` +
      `&token=${encodeURIComponent(
        ADMIN_TOKEN
      )}`;

    const response =
      await fetch(url, {
        cache: "no-store",
      });

    if (!response.ok) {
      throw new Error(
        "Gagal mengambil DATA MARKET"
      );
    }

    const result =
      await response.json();

    if (!result.success) {
      return NextResponse.json(
        result,
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      result.data || []
    );

  } catch (error) {

    console.error(
      "DATA MARKET API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal membaca DATA MARKET",
      },
      {
        status: 500,
      }
    );
  }
}