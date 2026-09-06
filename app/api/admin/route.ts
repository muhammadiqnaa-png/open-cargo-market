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
    // GET REQUEST BODY
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
    // CHECK PASSWORD
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
    // SEND TO GOOGLE APPS SCRIPT
    // =================================================

    const response =
      await fetch(
        APPS_SCRIPT_URL,
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

          cache: "no-store",

          redirect: "follow"

        }
      );


    // =================================================
    // READ RESPONSE AS TEXT
    //
    // JANGAN LANGSUNG response.json()
    // =================================================

    const responseText =
      await response.text();


    console.log(
      "ADMIN APPS SCRIPT STATUS:",
      response.status
    );


    console.log(
      "ADMIN APPS SCRIPT URL:",
      response.url
    );


    console.log(
      "ADMIN APPS SCRIPT RESPONSE:",
      responseText.substring(
        0,
        1000
      )
    );


    // =================================================
    // PARSE JSON
    // =================================================

    let result: any;

    try {

      result =
        JSON.parse(
          responseText
        );

    } catch {

      console.error(
        "APPS SCRIPT RETURNED NON JSON:",
        responseText.substring(
          0,
          2000
        )
      );


      return NextResponse.json(
        {
          success: false,

          message:
            "Google Apps Script mengembalikan HTML, bukan JSON",

          status:
            response.status,

          response:
            responseText.substring(
              0,
              500
            )
        },
        {
          status: 500
        }
      );

    }


    // =================================================
    // CHECK APPS SCRIPT RESULT
    // =================================================

    if (
      !response.ok ||
      !result?.success
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            result?.message ||
            "Gagal menjalankan Admin API",

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
      result
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