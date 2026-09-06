import { NextResponse } from "next/server";
import Papa from "papaparse";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrQxYp8BQ6SeZJ6VXgJEIXZ2SlJpfIf5icyRXCDd9DRi28nDPYLVoZy1spUNpIxtp3_x5iEdarssCK/pub?gid=532006925&single=true&output=csv";

export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data Google Sheet");
    }

    const csv = await response.text();

    const result = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const data = (result.data as any[]).map((item, index) => ({
      ...item,
      _row: index + 2,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("CARGO API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membaca Google Sheet",
      },
      { status: 500 }
    );
  }
}