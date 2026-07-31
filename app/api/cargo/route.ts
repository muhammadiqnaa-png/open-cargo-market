import { NextResponse } from "next/server";
import Papa from "papaparse";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrQxYp8BQ6SeZJ6VXgJEIXZ2SlJpfIf5icyRXCDd9DRi28nDPYLVoZy1spUNpIxtp3_x5iEdarssCK/pub?gid=532006925&single=true&output=csv";

export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: "no-store",
    });

    const csv = await response.text();

    const result = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membaca Google Sheet",
        error,
      },
      { status: 500 }
    );
  }
}