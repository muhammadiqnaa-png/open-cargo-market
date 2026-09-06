import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  process.env.GOOGLE_APPS_SCRIPT_URL;

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD;

const ADMIN_TOKEN =
  process.env.ADMIN_TOKEN;


// =====================================================
// POST /api/admin
// =====================================================

export async function POST(
  request: Request
) {

  try {

    // =================================================
    // CHECK ENV
    // =================================================

    if (
      !APPS_SCRIPT_URL ||
      !ADMIN_PASSWORD ||
      !ADMIN_TOKEN
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Admin API belum dikonfigurasi"
        },
        {
          status: 500
        }
      );

    }


    // =================================================
    // REQUEST BODY
    // =================================================

    const body =
      await request.json();


    const password =
      body.password;

    const action =
      body.action;

    const data =
      body.data || {};


    // =================================================
    // PASSWORD
    // =================================================

    if (
      !password ||
      password !== ADMIN_PASSWORD
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Password admin salah"
        },
        {
          status: 401
        }
      );

    }


    // =================================================
    // ALLOWED ACTION
    // =================================================

    const allowedActions = [

      "add_vessel",
      "update_vessel",
      "delete_vessel",

      "add_cargo",
      "update_cargo",
      "delete_cargo"

    ];


    if (
      !allowedActions.includes(action)
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Action tidak valid"
        },
        {
          status: 400
        }
      );

    }


    // =================================================
    // APPS SCRIPT URL
    // =================================================

    const appsScriptUrl =
      APPS_SCRIPT_URL.trim();


    // =================================================
    // REQUEST KE GOOGLE APPS SCRIPT
    // =================================================

    const appsScriptResponse =
      await fetch(
        appsScriptUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            token:
              ADMIN_TOKEN,

            action:
              action,

            data:
              data

          }),

          cache: "no-store"

        }
      );


    // =================================================
    // BACA RESPONSE SEBAGAI TEXT
    // =================================================

    const responseText =
      await appsScriptResponse.text();


    console.log(
      "===================================="
    );

    console.log(
      "APPS SCRIPT ADMIN"
    );

    console.log(
      "ACTION:",
      action
    );

    console.log(
      "STATUS:",
      appsScriptResponse.status
    );

    console.log(
      "URL:",
      appsScriptResponse.url
    );

    console.log(
      "RESPONSE:",
      responseText.substring(
        0,
        2000
      )
    );

    console.log(
      "===================================="
    );


    // =================================================
    // PARSE JSON
    // =================================================

    let result: any = null;


    try {

      result =
        JSON.parse(
          responseText
        );

    } catch {

      // ===============================================
      // GOOGLE APPS SCRIPT MENGEMBALIKAN HTML
      // ===============================================

      return NextResponse.json(
        {
          success: false,

          message:
            "Google Apps Script mengembalikan HTML, bukan JSON",

          action:
            action,

          status:
            appsScriptResponse.status,

          url:
            appsScriptResponse.url,

          response:
            responseText.substring(
              0,
              1000
            )

        },
        {
          status: 500
        }
      );

    }


    // =================================================
    // APPS SCRIPT ERROR
    // =================================================

    if (
      !result ||
      result.success !== true
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            result?.message ||
            "Google Apps Script gagal menjalankan request",

          result:
            result

        },
        {
          status: 500
        }
      );

    }


    // =================================================
    // SUCCESS
    // =================================================

    return NextResponse.json(
      result,
      {
        status: 200
      }
    );


  } catch (error) {

    console.error(
      "ADMIN API ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          "Terjadi kesalahan pada Admin API",

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