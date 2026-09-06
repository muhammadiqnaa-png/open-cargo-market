import { NextResponse } from "next/server";
import Papa from "papaparse";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1eIm_-adbZ4FjVW_hQy8TytoLSywnSPuK-J8ycoGat8w/export?format=csv&gid=1072363540";

export async function GET() {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Google Sheet response: ${response.status}`
      );
    }

    const csv = await response.text();

    if (!csv.trim()) {
      throw new Error("DATA MARKET kosong");
    }

    const result = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      console.error(
        "CSV PARSE ERROR:",
        result.errors
      );
    }

    const data = (result.data as Record<string, any>[])
      .map((item, index) => ({
        ...item,
        _row: index + 2,
      }))
      .filter((item) =>
        Object.entries(item).some(
          ([key, value]) =>
            key !== "_row" &&
            String(value ?? "").trim() !== ""
        )
      );

    return NextResponse.json(data);

  } catch (error) {

    console.error(
      "DATA MARKET API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membaca DATA MARKET",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}