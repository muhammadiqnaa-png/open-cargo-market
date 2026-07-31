import Papa from "papaparse";
import { Cargo } from "../types/cargo";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrQxYp8BQ6SeZJ6VXgJEIXZ2SlJpfIf5icyRXCDd9DRi28nDPYLVoZy1spUNpIxtp3_x5iEdarssCK/pub?gid=532006925&single=true&output=csv";

export async function getCargoData(): Promise<Cargo[]> {
  const response = await fetch(GOOGLE_SHEET_CSV_URL, {
    cache: "no-store",
  });

  const csvText = await response.text();

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data as Cargo[];
}