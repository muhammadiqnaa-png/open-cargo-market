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
    // APPS SCRIPT URL
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
      await fetch(url, {

        method: "GET",

        cache: "no-store"

      });


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
    // MAPPING DATA
    // GOOGLE SHEET → ADMIN
    // =================================================

    const data =
      Array.isArray(result.data)

        ? result.data.map(
            (item: any) => ({

              // ---------------------------------------
              // ID
              // Google Sheet: NO
              // ---------------------------------------

              ID:
                item.NO || "",


              // ---------------------------------------
              // DATE
              // ---------------------------------------

              DATE:
                item.DATE || "",


              // ---------------------------------------
              // SALES
              // ---------------------------------------

              SALES_MAESTRO:
                item["SALES MAESTRO"] ||
                "",


              // ---------------------------------------
              // COMPANY
              // ---------------------------------------

              NAMA_PT:
                item["NAMA PT"] ||
                "",


              // ---------------------------------------
              // LOCATION
              // ---------------------------------------

              KEC:
                item.KEC || "",

              KAB:
                item.KAB || "",


              // ---------------------------------------
              // PIC
              // ---------------------------------------

              PIC:
                item.PIC || "",


              // ---------------------------------------
              // FROM
              // ---------------------------------------

              FROM:
                item.FROM || "",


              // ---------------------------------------
              // SIZE BARGE
              // ---------------------------------------

              SIZE_BARGE:
                item["SIZE BARGE"] ||
                "",


              // ---------------------------------------
              // AREA POL
              // ---------------------------------------

              AREA_POL:
                item["AREA POL"] ||
                "",


              // ---------------------------------------
              // ROUTE
              // ---------------------------------------

              POL:
                item.POL || "",

              POD:
                item.POD || "",


              // ---------------------------------------
              // DISTANCE
              // ---------------------------------------

              DISTANCE:
                item.DISTANCE || "",


              // ---------------------------------------
              // CARGO
              // ---------------------------------------

              CARGO:
                item.CARGO || "",


              // ---------------------------------------
              // COMMERCIAL
              // ---------------------------------------

              FREIGHT_SHIPPER:
                item["FREIGHT SHIPPER"] ||
                "",


              // ---------------------------------------
              // LAYCAN
              // ---------------------------------------

              LAYCAN:
                item.LAYCAN || "",


              // ---------------------------------------
              // PRORATE
              // ---------------------------------------

              PRORATE:
                item.PRORATE || "",


              // ---------------------------------------
              // DEMURRAGE
              // ---------------------------------------

              DEMURRAGE:
                item.DEMURRAGE || "",


              // ---------------------------------------
              // PAYMENT
              // ---------------------------------------

              PAYMENT:
                item.PAYMENT || "",


              // ---------------------------------------
              // OUT FEE
              // ---------------------------------------

              OUT_FEE:
                item["OUT FEE"] ||
                "",


              // ---------------------------------------
              // STATUS
              // Google Sheet:
              // STATUS (OPEN/CLOSE)
              // ---------------------------------------

              STATUS:
                item[
                  "STATUS (OPEN/CLOSE)"
                ] ||
                item.STATUS ||
                "",


              // ---------------------------------------
              // REMARKS
              // Google Sheet:
              // REMARKS / NOTE
              // ---------------------------------------

              REMARKS:
                item[
                  "REMARKS / NOTE"
                ] ||
                item.REMARKS ||
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
    // RETURN ARRAY
    // =================================================

    return NextResponse.json(data);


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