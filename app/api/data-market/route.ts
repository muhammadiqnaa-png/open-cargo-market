import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL;

const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN;


export async function GET() {

  try {

    // =================================================
    // CHECK ENV
    // =================================================

    if (
      !APPS_SCRIPT_URL ||
      !ADMIN_TOKEN
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Konfigurasi Apps Script belum lengkap"
        },
        {
          status: 500
        }
      );

    }


    // =================================================
    // BUILD URL
    // =================================================

    const url =
      `${APPS_SCRIPT_URL}` +
      `?token=${encodeURIComponent(
        ADMIN_TOKEN
      )}` +
      `&action=get_data_market`;


    // =================================================
    // FETCH APPS SCRIPT
    // =================================================

    const response =
      await fetch(
        url,
        {
          method: "GET",
          cache: "no-store"
        }
      );


    // =================================================
    // PARSE RESPONSE
    // =================================================

    const result =
      await response.json();


    // =================================================
    // CHECK RESPONSE
    // =================================================

    if (
      !response.ok ||
      !result?.success
    ) {

      console.error(
        "DATA MARKET APPS SCRIPT ERROR:",
        result
      );


      return NextResponse.json(
        {
          success: false,

          message:
            result?.message ||
            "Gagal membaca DATA MARKET dari Apps Script"
        },
        {
          status: 500
        }
      );

    }


    // =================================================
    // MAPPING
    // GOOGLE SHEET → ADMIN
    // =================================================

    const data =
      Array.isArray(result.data)

        ? result.data.map(
            (item: any) => ({

              // ---------------------------------------
              // A - NO
              // ---------------------------------------

              ID:
                item.NO || "",


              // ---------------------------------------
              // B - DATE
              // ---------------------------------------

              DATE:
                item.DATE || "",


              // ---------------------------------------
              // C - SALES MAESTRO
              // ---------------------------------------

              SALES_MAESTRO:
                item["SALES MAESTRO"] ||
                "",


              // ---------------------------------------
              // D - NAMA PT
              // ---------------------------------------

              NAMA_PT:
                item["NAMA PT"] ||
                "",


              // ---------------------------------------
              // E - KEC
              // ---------------------------------------

              KEC:
                item.KEC ||
                "",


              // ---------------------------------------
              // F - KAB
              // ---------------------------------------

              KAB:
                item.KAB ||
                "",


              // ---------------------------------------
              // G - PIC
              // ---------------------------------------

              PIC:
                item.PIC ||
                "",


              // ---------------------------------------
              // H - FROM
              // ---------------------------------------

              FROM:
                item.FROM ||
                "",


              // ---------------------------------------
              // I - SIZE BARGE
              // ---------------------------------------

              SIZE_BARGE:
                item["SIZE BARGE"] ||
                "",


              // ---------------------------------------
              // J - AREA POL
              // ---------------------------------------

              AREA_POL:
                item["AREA POL"] ||
                "",


              // ---------------------------------------
              // K - POL
              // ---------------------------------------

              POL:
                item.POL ||
                "",


              // ---------------------------------------
              // L - POD
              // ---------------------------------------

              POD:
                item.POD ||
                "",


              // ---------------------------------------
              // M - DISTANCE
              // ---------------------------------------

              DISTANCE:
                item.DISTANCE ||
                "",


              // ---------------------------------------
              // N - CARGO
              // ---------------------------------------

              CARGO:
                item.CARGO ||
                "",


              // ---------------------------------------
              // O - FREIGHT
              // ---------------------------------------

              FREIGHT_SHIPPER:
                item["FREIGHT SHIPPER"] ||
                "",


              // ---------------------------------------
              // P - LAYCAN
              // ---------------------------------------

              LAYCAN:
                item.LAYCAN ||
                "",


              // ---------------------------------------
              // Q - PRORATE
              // ---------------------------------------

              PRORATE:
                item.PRORATE ||
                "",


              // ---------------------------------------
              // R - DEMURRAGE
              // ---------------------------------------

              DEMURRAGE:
                item.DEMURRAGE ||
                "",


              // ---------------------------------------
              // S - PAYMENT
              // ---------------------------------------

              PAYMENT:
                item.PAYMENT ||
                "",


              // ---------------------------------------
              // T - OUT FEE
              // ---------------------------------------

              OUT_FEE:
                item["OUT FEE"] ||
                "",


              // ---------------------------------------
              // U - STATUS
              // ---------------------------------------

              STATUS:
                item.STATUS ||
                "",


              // ---------------------------------------
              // V - REMARKS
              // ---------------------------------------

              REMARKS:
                item["REMARKS / NOTE"] ||
                "",


              // ---------------------------------------
              // GOOGLE SHEET ROW
              // ---------------------------------------

              _row:
                item._row

            })
          )

        : [];


    // =================================================
    // RETURN
    // =================================================

    return NextResponse.json(
      data
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

        error:
          error instanceof Error
            ? error.message
            : String(error)
      },
      {
        status: 500
      }
    );

  }

}