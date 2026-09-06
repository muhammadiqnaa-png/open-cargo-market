"use client";

import { useEffect, useState } from "react";

// =====================================================
// TYPE VESSEL
// =====================================================

type Vessel = {
  DATE: string;
  TYPE: string;
  SIZE: string;
  POSITION: string;
  "AVAILABLE DATE": string;
  "NEXT PORT": string;
  INQUIRY: string;
  _row?: number;
};

// =====================================================
// TYPE DATA MARKET
// =====================================================

type Cargo = {
  ID: string;
  DATE: string;
  SALES_MAESTRO: string;
  NAMA_PT: string;
  KEC: string;
  KAB: string;
  PIC: string;
  FROM: string;
  SIZE_BARGE: string;
  AREA_POL: string;
  POL: string;
  POD: string;
  DISTANCE: string;
  CARGO: string;
  FREIGHT_SHIPPER: string;
  LAYCAN: string;
  PRORATE: string;
  DEMURRAGE: string;
  PAYMENT: string;
  OUT_FEE: string;
  STATUS: string;
  REMARKS: string;
  _row?: number;
};

// =====================================================
// TAB
// =====================================================

type Tab = "VESSEL" | "CARGO";

// =====================================================
// EMPTY VESSEL
// =====================================================

const emptyVessel: Vessel = {
  DATE: "",
  TYPE: "",
  SIZE: "",
  POSITION: "",
  "AVAILABLE DATE": "",
  "NEXT PORT": "",
  INQUIRY: "",
};

// =====================================================
// EMPTY CARGO
// =====================================================

const emptyCargo: Cargo = {
  ID: "",
  DATE: "",
  SALES_MAESTRO: "",
  NAMA_PT: "",
  KEC: "",
  KAB: "",
  PIC: "",
  FROM: "",
  SIZE_BARGE: "",
  AREA_POL: "",
  POL: "",
  POD: "",
  DISTANCE: "",
  CARGO: "",
  FREIGHT_SHIPPER: "",
  LAYCAN: "",
  PRORATE: "",
  DEMURRAGE: "",
  PAYMENT: "",
  OUT_FEE: "",
  STATUS: "OPEN",
  REMARKS: "",
};

// =====================================================
// ADMIN PAGE
// =====================================================

export default function AdminPage() {
  // ===================================================
  // LOGIN
  // ===================================================

  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // ===================================================
  // TAB
  // ===================================================

  const [tab, setTab] =
    useState<Tab>("VESSEL");

  // ===================================================
  // DATA
  // ===================================================

  const [vessels, setVessels] =
    useState<Vessel[]>([]);

  const [cargo, setCargo] =
    useState<Cargo[]>([]);

  // ===================================================
  // STATE
  // ===================================================

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ===================================================
  // EDIT STATE
  // ===================================================

  const [editingVessel, setEditingVessel] =
    useState<Vessel | null>(null);

  const [editingCargo, setEditingCargo] =
    useState<Cargo | null>(null);

  // ===================================================
  // MODAL
  // ===================================================

  const [showVesselForm, setShowVesselForm] =
    useState(false);

  const [showCargoForm, setShowCargoForm] =
    useState(false);

  // ===================================================
  // FORM
  // ===================================================

  const [vesselForm, setVesselForm] =
    useState<Vessel>(emptyVessel);

  const [cargoForm, setCargoForm] =
    useState<Cargo>(emptyCargo);

  // ===================================================
  // LOAD DATA
  // ===================================================

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const vesselRequest =
        fetch("/api/vessel", {
          cache: "no-store",
        });

      const cargoRequest =
        fetch("/api/data-market", {
          cache: "no-store",
        });

      const [
        vesselRes,
        cargoRes,
      ] = await Promise.all([
        vesselRequest,
        cargoRequest,
      ]);

      // ===============================================
      // VESSEL RESPONSE
      // ===============================================

      const vesselData =
        await vesselRes.json();

      // ===============================================
      // DATA MARKET RESPONSE
      // ===============================================

      const cargoData =
        await cargoRes.json();

      // ===============================================
      // SET VESSEL
      // ===============================================

      if (
        Array.isArray(vesselData)
      ) {
        setVessels(vesselData);
      } else {
        setVessels([]);
      }

      // ===============================================
      // SET CARGO
      // ===============================================

      if (
        Array.isArray(cargoData)
      ) {
        setCargo(cargoData);
      } else {
        setCargo([]);
      }

    } catch (error) {

      console.error(
        "LOAD ADMIN DATA ERROR:",
        error
      );

      setMessage(
        "Gagal mengambil data"
      );

    } finally {

      setLoading(false);

    }
  }

  // ===================================================
  // LOAD WHEN LOGIN
  // ===================================================

  useEffect(() => {
    if (loggedIn) {
      loadData();
    }
  }, [loggedIn]);

  // ===================================================
  // ADMIN REQUEST
  // ===================================================

  async function adminRequest(
    action: string,
    data: any
  ) {
    setSaving(true);
    setMessage("");

    try {

      const response =
        await fetch(
          "/api/admin",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              password,
              action,
              data,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          "Request gagal"
        );
      }

      setMessage(
        result.message ||
        "Berhasil"
      );

      await loadData();

      return true;

    } catch (error: any) {

      console.error(
        "ADMIN REQUEST ERROR:",
        error
      );

      setMessage(
        error?.message ||
        "Terjadi kesalahan"
      );

      return false;

    } finally {

      setSaving(false);

    }
  }

  // ===================================================
  // LOGIN
  // ===================================================

  function handleLogin() {

    if (
      !password.trim()
    ) {

      setMessage(
        "Masukkan password admin"
      );

      return;
    }

    setLoggedIn(true);
    setMessage("");
  }

  // ===================================================
  // VESSEL
  // ===================================================

  function openAddVessel() {

    setEditingVessel(null);

    setVesselForm({
      ...emptyVessel,

      DATE:
        new Date()
          .toLocaleDateString(
            "en-GB"
          ),
    });

    setShowVesselForm(true);
  }

  // ===================================================
  // EDIT VESSEL
  // ===================================================

  function openEditVessel(
    item: Vessel
  ) {

    setEditingVessel(item);

    setVesselForm({
      ...item,
    });

    setShowVesselForm(true);
  }

  // ===================================================
  // SAVE VESSEL
  // ===================================================

  async function saveVessel() {

    if (
      !vesselForm.TYPE ||
      !vesselForm.SIZE
    ) {

      setMessage(
        "TYPE dan SIZE wajib diisi"
      );

      return;
    }

    const action =
      editingVessel
        ? "update_vessel"
        : "add_vessel";

    const data =
      editingVessel
        ? {
            ...vesselForm,
            row:
              editingVessel._row,
          }
        : vesselForm;

    const success =
      await adminRequest(
        action,
        data
      );

    if (success) {

      setShowVesselForm(false);

      setEditingVessel(null);

      setVesselForm(
        emptyVessel
      );
    }
  }

  // ===================================================
  // DELETE VESSEL
  // ===================================================

  async function deleteVessel(
    item: Vessel
  ) {

    if (!item._row) {
      return;
    }

    const confirmDelete =
      window.confirm(
        `Hapus vessel ${item.TYPE} ${item.SIZE}?`
      );

    if (!confirmDelete) {
      return;
    }

    await adminRequest(
      "delete_vessel",
      {
        row: item._row,
      }
    );
  }

  // ===================================================
  // CARGO
  // ===================================================

  function openAddCargo() {

    setEditingCargo(null);

    setCargoForm({
      ...emptyCargo,

      ID: "",

      DATE:
        new Date()
          .toLocaleDateString(
            "en-GB"
          ),

      STATUS: "OPEN",
    });

    setShowCargoForm(true);
  }

  // ===================================================
  // EDIT CARGO
  // ===================================================

  function openEditCargo(
    item: Cargo
  ) {

    setEditingCargo(item);

    setCargoForm({
      ...emptyCargo,
      ...item,
    });

    setShowCargoForm(true);
  }

  // ===================================================
  // SAVE CARGO
  // ===================================================

  async function saveCargo() {

    if (
      !cargoForm.CARGO
    ) {

      setMessage(
        "CARGO wajib diisi"
      );

      return;
    }

    if (
      !cargoForm.SIZE_BARGE
    ) {

      setMessage(
        "SIZE BARGE wajib diisi"
      );

      return;
    }

    if (
      !cargoForm.POL
    ) {

      setMessage(
        "POL wajib diisi"
      );

      return;
    }

    if (
      !cargoForm.POD
    ) {

      setMessage(
        "POD wajib diisi"
      );

      return;
    }

    const action =
      editingCargo
        ? "update_cargo"
        : "add_cargo";

    // ===============================================
    // EDIT
    // ID WAJIB DIPERTAHANKAN
    // ===============================================

    const data =
      editingCargo
        ? {
            ...cargoForm,

            ID:
              editingCargo.ID,
          }
        : {
            ...cargoForm,

            // ID dibuat otomatis
            // oleh Apps Script
            ID: "",
          };

    const success =
      await adminRequest(
        action,
        data
      );

    if (success) {

      setShowCargoForm(false);

      setEditingCargo(null);

      setCargoForm(
        emptyCargo
      );
    }
  }

  // ===================================================
  // DELETE CARGO
  // ===================================================

  async function deleteCargo(
    item: Cargo
  ) {

    if (!item.ID) {

      setMessage(
        "ID Cargo tidak ditemukan"
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        `Hapus cargo ID ${item.ID} - ${item.CARGO} ${item.SIZE_BARGE}?`
      );

    if (!confirmDelete) {
      return;
    }

    await adminRequest(
      "delete_cargo",
      {
        ID: item.ID,
      }
    );
  }

  // ===================================================
  // LOGIN SCREEN
  // ===================================================

  if (!loggedIn) {

    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-5">

        <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl">

          {/* LOGO */}

          <div className="text-center mb-7">

            <div className="text-4xl mb-3">
              🚢
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              FAWAID ADMIN
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Shipping Marketplace Management
            </p>

          </div>

          {/* PASSWORD */}

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Admin Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {
                handleLogin();
              }

            }}
            placeholder="Masukkan password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* MESSAGE */}

          {message && (

            <p className="text-sm text-red-600 mt-3">
              {message}
            </p>

          )}

          {/* LOGIN BUTTON */}

          <button
            onClick={handleLogin}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            LOGIN ADMIN
          </button>

          {/* BACK */}

          <a
            href="/"
            className="block text-center text-sm text-slate-500 mt-5 hover:text-blue-600"
          >
            ← Kembali ke Marketplace
          </a>

        </div>

      </main>
    );
  }

  // ===================================================
  // DASHBOARD
  // ===================================================

  return (
    <main className="min-h-screen bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div>

            <h1 className="font-bold text-lg">
              FAWAID ADMIN
            </h1>

            <p className="text-xs text-slate-400">
              Shipping Marketplace
            </p>

          </div>

          <div className="flex gap-2">

            {/* REFRESH */}

            <button
              onClick={loadData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm"
              title="Refresh"
            >
              🔄
            </button>

            {/* LOGOUT */}

            <button
              onClick={() => {

                setLoggedIn(false);
                setPassword("");
                setMessage("");

              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* TITLE */}

        <div className="mb-5">

          <h2 className="text-2xl font-bold text-slate-900">
            Market Management
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Kelola OPEN VESSEL dan DATA MARKET.
          </p>

        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="bg-white rounded-2xl p-2 shadow-sm flex gap-2 mb-6">

          {/* VESSEL */}

          <button
            onClick={() =>
              setTab("VESSEL")
            }
            className={`flex-1 py-3 rounded-xl font-bold text-sm ${
              tab === "VESSEL"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🚢 VESSEL
          </button>

          {/* CARGO */}

          <button
            onClick={() =>
              setTab("CARGO")
            }
            className={`flex-1 py-3 rounded-xl font-bold text-sm ${
              tab === "CARGO"
                ? "bg-orange-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📦 DATA MARKET
          </button>

        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5 text-sm font-medium text-slate-700">
            {message}
          </div>

        )}

        {/* =================================================
            VESSEL SECTION
        ================================================= */}

        {tab === "VESSEL" && (

          <section>

            {/* HEADER */}

            <div className="flex items-center justify-between mb-4">

              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  OPEN VESSEL
                </h3>

                <p className="text-sm text-slate-500">
                  {vessels.length} vessel
                </p>

              </div>

              <button
                onClick={
                  openAddVessel
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl text-sm"
              >
                + ADD VESSEL
              </button>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                Loading vessel...
              </div>

            ) : vessels.length === 0 ? (

              <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                Belum ada vessel.
              </div>

            ) : (

              <div className="grid gap-4">

                {vessels.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={
                        item._row ||
                        index
                      }
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* INFO */}

                        <div className="flex-1">

                          <div className="flex flex-wrap items-center gap-2 mb-2">

                            <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {item.TYPE ||
                                "-"}
                            </span>

                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {item.SIZE ||
                                "-"}
                            </span>

                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">

                            {/* POSITION */}

                            <div>

                              <span className="text-slate-400">
                                Position
                              </span>

                              <p className="font-semibold text-slate-900">
                                {item.POSITION ||
                                  "-"}
                              </p>

                            </div>

                            {/* AVAILABLE */}

                            <div>

                              <span className="text-slate-400">
                                Available
                              </span>

                              <p className="font-semibold text-slate-900">
                                {item[
                                  "AVAILABLE DATE"
                                ] ||
                                  "-"}
                              </p>

                            </div>

                            {/* NEXT PORT */}

                            <div>

                              <span className="text-slate-400">
                                Next Port
                              </span>

                              <p className="font-semibold text-slate-900">
                                {item[
                                  "NEXT PORT"
                                ] ||
                                  "-"}
                              </p>

                            </div>

                            {/* DATE */}

                            <div>

                              <span className="text-slate-400">
                                Date
                              </span>

                              <p className="font-semibold text-slate-900">
                                {item.DATE ||
                                  "-"}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* ACTION */}

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditVessel(
                                item
                              )
                            }
                            className="flex-1 md:flex-none bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold"
                          >
                            ✏️ EDIT
                          </button>

                          <button
                            onClick={() =>
                              deleteVessel(
                                item
                              )
                            }
                            disabled={
                              saving
                            }
                            className="flex-1 md:flex-none bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold"
                          >
                            🗑️ DELETE
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}

        {/* =================================================
            DATA MARKET SECTION
        ================================================= */}

        {tab === "CARGO" && (

          <section>

            {/* HEADER */}

            <div className="flex items-center justify-between mb-4">

              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  DATA MARKET
                </h3>

                <p className="text-sm text-slate-500">
                  {cargo.length} cargo
                </p>

              </div>

              <button
                onClick={
                  openAddCargo
                }
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-3 rounded-xl text-sm"
              >
                + ADD CARGO
              </button>

            </div>

            {/* LOADING */}

            {loading ? (

              <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                Loading DATA MARKET...
              </div>

            ) : cargo.length === 0 ? (

              <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                Belum ada data cargo.
              </div>

            ) : (

              <div className="grid gap-4">

                {cargo.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      key={
                        item.ID ||
                        index
                      }
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"
                    >

                      <div className="flex flex-col gap-4">

                        {/* TOP */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                          <div className="flex flex-wrap items-center gap-2">

                            {/* ID */}

                            <span className="bg-slate-900 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                              ID #
                              {item.ID ||
                                "-"}
                            </span>

                            {/* CARGO */}

                            <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {item.CARGO ||
                                "-"}
                            </span>

                            {/* SIZE */}

                            <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                              {item.SIZE_BARGE ||
                                "-"}
                            </span>

                            {/* STATUS */}

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                item.STATUS ===
                                "OPEN"
                                  ? "bg-green-100 text-green-700"
                                  : item.STATUS ===
                                    "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.STATUS ||
                                "-"}
                            </span>

                          </div>

                          {/* ACTION */}

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                openEditCargo(
                                  item
                                )
                              }
                              className="flex-1 md:flex-none bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold"
                            >
                              ✏️ EDIT
                            </button>

                            <button
                              onClick={() =>
                                deleteCargo(
                                  item
                                )
                              }
                              disabled={
                                saving
                              }
                              className="flex-1 md:flex-none bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold"
                            >
                              🗑️ DELETE
                            </button>

                          </div>

                        </div>

                        {/* ROUTE */}

                        <div>

                          <p className="text-xl font-bold text-slate-900">

                            {item.POL ||
                              "-"}

                            <span className="mx-2 text-slate-400">
                              →
                            </span>

                            {item.POD ||
                              "-"}

                          </p>

                        </div>

                        {/* DATA GRID */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">

                          {/* DATE */}

                          <Info
                            label="DATE"
                            value={
                              item.DATE
                            }
                          />

                          {/* SALES */}

                          <Info
                            label="SALES MAESTRO"
                            value={
                              item.SALES_MAESTRO
                            }
                          />

                          {/* NAMA PT */}

                          <Info
                            label="NAMA PT"
                            value={
                              item.NAMA_PT
                            }
                          />

                          {/* PIC */}

                          <Info
                            label="PIC"
                            value={
                              item.PIC
                            }
                          />

                          {/* KEC */}

                          <Info
                            label="KEC"
                            value={
                              item.KEC
                            }
                          />

                          {/* KAB */}

                          <Info
                            label="KAB"
                            value={
                              item.KAB
                            }
                          />

                          {/* FROM */}

                          <Info
                            label="FROM"
                            value={
                              item.FROM
                            }
                          />

                          {/* AREA */}

                          <Info
                            label="AREA POL"
                            value={
                              item.AREA_POL
                            }
                          />

                          {/* DISTANCE */}

                          <Info
                            label="DISTANCE"
                            value={
                              item.DISTANCE
                            }
                          />

                          {/* FREIGHT */}

                          <Info
                            label="FREIGHT SHIPPER"
                            value={
                              item.FREIGHT_SHIPPER
                            }
                          />

                          {/* LAYCAN */}

                          <Info
                            label="LAYCAN"
                            value={
                              item.LAYCAN
                            }
                          />

                          {/* PRORATE */}

                          <Info
                            label="PRORATE"
                            value={
                              item.PRORATE
                            }
                          />

                          {/* DEMURRAGE */}

                          <Info
                            label="DEMURRAGE"
                            value={
                              item.DEMURRAGE
                            }
                          />

                          {/* PAYMENT */}

                          <Info
                            label="PAYMENT"
                            value={
                              item.PAYMENT
                            }
                          />

                          {/* OUT FEE */}

                          <Info
                            label="OUT FEE"
                            value={
                              item.OUT_FEE
                            }
                          />

                        </div>

                        {/* REMARKS */}

                        <div className="bg-slate-50 rounded-xl p-3">

                          <span className="text-xs text-slate-400 font-semibold">
                            REMARKS / NOTE
                          </span>

                          <p className="text-sm font-semibold text-slate-900 mt-1 whitespace-pre-wrap">
                            {item.REMARKS ||
                              "-"}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}

      </div>

      {/* =================================================
          VESSEL MODAL
      ================================================= */}

      {showVesselForm && (

        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-5">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  {editingVessel
                    ? "Edit Vessel"
                    : "Add Vessel"}
                </h3>

                <p className="text-sm text-slate-500">
                  Isi informasi vessel
                </p>

              </div>

              <button
                onClick={() =>
                  setShowVesselForm(
                    false
                  )
                }
                className="text-slate-500 text-xl"
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <div className="grid gap-4">

              {/* DATE */}

              <Input
                label="DATE"
                value={
                  vesselForm.DATE
                }
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    DATE: value,
                  })
                }
              />

              {/* TYPE */}

              <Select
                label="TYPE"
                value={
                  vesselForm.TYPE
                }
                options={[
                  "BARGE",
                  "MV",
                ]}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    TYPE: value,
                  })
                }
              />

              {/* SIZE */}

              <Input
                label="SIZE"
                value={
                  vesselForm.SIZE
                }
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    SIZE: value,
                  })
                }
                placeholder="Contoh: 300 FT"
              />

              {/* POSITION */}

              <Input
                label="POSITION"
                value={
                  vesselForm.POSITION
                }
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    POSITION: value,
                  })
                }
              />

              {/* AVAILABLE DATE */}

              <Input
                label="AVAILABLE DATE"
                value={
                  vesselForm[
                    "AVAILABLE DATE"
                  ]
                }
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    "AVAILABLE DATE":
                      value,
                  })
                }
              />

              {/* NEXT PORT */}

              <Input
                label="NEXT PORT"
                value={
                  vesselForm[
                    "NEXT PORT"
                  ]
                }
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    "NEXT PORT":
                      value,
                  })
                }
              />

              {/* INQUIRY */}

              <Input
                label="INQUIRY"
                value={
                  vesselForm.INQUIRY
                }
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    INQUIRY: value,
                  })
                }
                placeholder="Nomor / link WhatsApp"
              />

              {/* SAVE */}

              <button
                onClick={
                  saveVessel
                }
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl mt-2"
              >
                {saving
                  ? "MENYIMPAN..."
                  : editingVessel
                  ? "UPDATE VESSEL"
                  : "ADD VESSEL"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          CARGO MODAL
      ================================================= */}

      {showCargoForm && (

        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-5">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="text-xl font-bold text-slate-900">
                  {editingCargo
                    ? "Edit Cargo"
                    : "Add Cargo"}
                </h3>

                <p className="text-sm text-slate-500">
                  DATA MARKET — Master Cargo
                </p>

              </div>

              <button
                onClick={() =>
                  setShowCargoForm(
                    false
                  )
                }
                className="text-slate-500 text-xl"
              >
                ✕
              </button>

            </div>

            {/* =================================================
                FORM GRID
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* =================================================
                  A - ID
              ================================================= */}

              <Input
                label="ID"
                value={
                  cargoForm.ID
                }
                onChange={() => {}}
                placeholder={
                  editingCargo
                    ? "ID Cargo"
                    : "Otomatis oleh sistem"
                }
                disabled
              />

              {/* =================================================
                  B - DATE
              ================================================= */}

              <Input
                label="DATE"
                value={
                  cargoForm.DATE
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    DATE: value,
                  })
                }
              />

              {/* =================================================
                  C - SALES MAESTRO
              ================================================= */}

              <Input
                label="SALES MAESTRO"
                value={
                  cargoForm.SALES_MAESTRO
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    SALES_MAESTRO:
                      value,
                  })
                }
                placeholder="Nama sales"
              />

              {/* =================================================
                  D - NAMA PT
              ================================================= */}

              <Input
                label="NAMA PT"
                value={
                  cargoForm.NAMA_PT
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    NAMA_PT:
                      value,
                  })
                }
                placeholder="Nama perusahaan"
              />

              {/* =================================================
                  E - KEC
              ================================================= */}

              <Input
                label="KEC"
                value={
                  cargoForm.KEC
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    KEC: value,
                  })
                }
                placeholder="Kecamatan"
              />

              {/* =================================================
                  F - KAB
              ================================================= */}

              <Input
                label="KAB"
                value={
                  cargoForm.KAB
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    KAB: value,
                  })
                }
                placeholder="Kabupaten"
              />

              {/* =================================================
                  G - PIC
              ================================================= */}

              <Input
                label="PIC"
                value={
                  cargoForm.PIC
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    PIC: value,
                  })
                }
                placeholder="PIC / contact"
              />

              {/* =================================================
                  H - FROM
              ================================================= */}

              <Select
                label="FROM"
                value={
                  cargoForm.FROM
                }
                options={[
                  "Shipper",
                  "Broker",
                  "Trader",
                  "Mining",
                  "Shipping",
                  "Owner",
                  "Other",
                ]}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    FROM: value,
                  })
                }
              />

              {/* =================================================
                  I - SIZE BARGE
              ================================================= */}

              <Input
                label="SIZE BARGE"
                value={
                  cargoForm.SIZE_BARGE
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    SIZE_BARGE:
                      value,
                  })
                }
                placeholder="Contoh: 270 / 300 / 330"
              />

              {/* =================================================
                  J - AREA POL
              ================================================= */}

              <Input
                label="AREA POL"
                value={
                  cargoForm.AREA_POL
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    AREA_POL:
                      value,
                  })
                }
                placeholder="Contoh: Kalimantan Timur"
              />

              {/* =================================================
                  K - POL
              ================================================= */}

              <Input
                label="POL"
                value={
                  cargoForm.POL
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    POL: value,
                  })
                }
                placeholder="Port of Loading"
              />

              {/* =================================================
                  L - POD
              ================================================= */}

              <Input
                label="POD"
                value={
                  cargoForm.POD
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    POD: value,
                  })
                }
                placeholder="Port of Discharge"
              />

              {/* =================================================
                  M - DISTANCE
              ================================================= */}

              <Input
                label="DISTANCE"
                value={
                  cargoForm.DISTANCE
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    DISTANCE:
                      value,
                  })
                }
                placeholder="Contoh: 525"
              />

              {/* =================================================
                  N - CARGO
              ================================================= */}

              <Select
                label="CARGO"
                value={
                  cargoForm.CARGO
                }
                options={[
                  "COAL",
                  "BAUXITE",
                  "NICKEL",
                  "SAND",
                  "SPLIT",
                  "IRON ORE",
                  "LIMESTONE",
                  "CEMENT",
                  "AGGREGATE",
                  "PALM KERNEL SHELL",
                  "OTHER",
                ]}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    CARGO: value,
                  })
                }
              />

              {/* =================================================
                  O - FREIGHT SHIPPER
              ================================================= */}

              <Input
                label="FREIGHT SHIPPER"
                value={
                  cargoForm.FREIGHT_SHIPPER
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    FREIGHT_SHIPPER:
                      value,
                  })
                }
                placeholder="Contoh: OPEN / 185.000"
              />

              {/* =================================================
                  P - LAYCAN
              ================================================= */}

              <Input
                label="LAYCAN"
                value={
                  cargoForm.LAYCAN
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    LAYCAN:
                      value,
                  })
                }
                placeholder="Contoh: ASAP / 6/9/2026"
              />

              {/* =================================================
                  Q - PRORATE
              ================================================= */}

              <Input
                label="PRORATE"
                value={
                  cargoForm.PRORATE
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    PRORATE:
                      value,
                  })
                }
                placeholder="Contoh: OPEN / COD / 10"
              />

              {/* =================================================
                  R - DEMURRAGE
              ================================================= */}

              <Input
                label="DEMURRAGE"
                value={
                  cargoForm.DEMURRAGE
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    DEMURRAGE:
                      value,
                  })
                }
                placeholder="Contoh: 20"
              />

              {/* =================================================
                  S - PAYMENT
              ================================================= */}

              <Input
                label="PAYMENT"
                value={
                  cargoForm.PAYMENT
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    PAYMENT:
                      value,
                  })
                }
                placeholder="Contoh: 50/50"
              />

              {/* =================================================
                  T - OUT FEE
              ================================================= */}

              <Input
                label="OUT FEE"
                value={
                  cargoForm.OUT_FEE
                }
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    OUT_FEE:
                      value,
                  })
                }
                placeholder="Contoh: 100% AL"
              />

              {/* =================================================
                  U - STATUS
              ================================================= */}

              <Select
                label="STATUS"
                value={
                  cargoForm.STATUS
                }
                options={[
                  "OPEN",
                  "PENDING",
                  "CLOSED",
                ]}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    STATUS:
                      value,
                  })
                }
              />

              {/* =================================================
                  V - REMARKS
              ================================================= */}

              <div className="md:col-span-2">

                <Textarea
                  label="REMARKS / NOTE"
                  value={
                    cargoForm.REMARKS
                  }
                  onChange={(value) =>
                    setCargoForm({
                      ...cargoForm,
                      REMARKS:
                        value,
                    })
                  }
                  placeholder="Catatan cargo..."
                />

              </div>

            </div>

            {/* =================================================
                SAVE BUTTON
            ================================================= */}

            <button
              onClick={
                saveCargo
              }
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl mt-5"
            >
              {saving
                ? "MENYIMPAN..."
                : editingCargo
                ? "UPDATE CARGO"
                : "ADD CARGO"}
            </button>

          </div>

        </div>

      )}

    </main>
  );
}


// =====================================================
// INFO COMPONENT
// =====================================================

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {

  return (
    <div>

      <span className="text-slate-400">
        {label}
      </span>

      <p className="font-semibold text-slate-900 break-words">
        {value || "-"}
      </p>

    </div>
  );
}


// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  disabled?: boolean;
}) {

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        value={value || ""}
        disabled={disabled}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? "bg-slate-100 cursor-not-allowed text-slate-500"
            : "border-slate-300 bg-white"
        }`}
      />

    </div>
  );
}


// =====================================================
// SELECT COMPONENT
// =====================================================

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (
    value: string
  ) => void;
}) {

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <select
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
      >

        <option value="">
          Select {label}
        </option>

        {options.map(
          (option) => (

            <option
              key={option}
              value={option}
            >
              {option}
            </option>

          )
        )}

      </select>

    </div>
  );
}


// =====================================================
// TEXTAREA COMPONENT
// =====================================================

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        rows={4}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

    </div>
  );
}