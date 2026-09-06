"use client";

import { useEffect, useState } from "react";

/* =====================================================
   TYPE
===================================================== */

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

type Tab = "VESSEL" | "CARGO";

/* =====================================================
   EMPTY DATA
===================================================== */

const emptyVessel: Vessel = {
  DATE: "",
  TYPE: "",
  SIZE: "",
  POSITION: "",
  "AVAILABLE DATE": "",
  "NEXT PORT": "",
  INQUIRY: "",
};

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

/* =====================================================
   HELPER
===================================================== */

function today() {
  return new Date().toLocaleDateString("en-GB");
}

/* =====================================================
   INPUT COMPONENT
===================================================== */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

/* =====================================================
   TEXTAREA
===================================================== */

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

/* =====================================================
   MAIN
===================================================== */

export default function AdminPage() {
  /* ---------------------------------------------------
     LOGIN
  --------------------------------------------------- */

  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  /* ---------------------------------------------------
     TAB
  --------------------------------------------------- */

  const [tab, setTab] = useState<Tab>("VESSEL");

  /* ---------------------------------------------------
     DATA
  --------------------------------------------------- */

  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [cargo, setCargo] = useState<Cargo[]>([]);

  /* ---------------------------------------------------
     STATE
  --------------------------------------------------- */

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------------------------------------------------
     FORM STATE
  --------------------------------------------------- */

  const [vesselForm, setVesselForm] =
    useState<Vessel>(emptyVessel);

  const [cargoForm, setCargoForm] =
    useState<Cargo>(emptyCargo);

  const [editingVessel, setEditingVessel] =
    useState<Vessel | null>(null);

  const [editingCargo, setEditingCargo] =
    useState<Cargo | null>(null);

  const [showVesselForm, setShowVesselForm] =
    useState(false);

  const [showCargoForm, setShowCargoForm] =
    useState(false);

  /* ===================================================
     LOAD DATA
  =================================================== */

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const [vesselRes, cargoRes] =
        await Promise.all([
          fetch("/api/vessel", {
            cache: "no-store",
          }),

          fetch("/api/data-market", {
            cache: "no-store",
          }),
        ]);

      const vesselData =
        await vesselRes.json();

      const cargoData =
        await cargoRes.json();

      setVessels(
        Array.isArray(vesselData)
          ? vesselData
          : []
      );

      setCargo(
        Array.isArray(cargoData)
          ? cargoData
          : []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Gagal mengambil data"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================
     LOAD AFTER LOGIN
  =================================================== */

  useEffect(() => {
    if (loggedIn) {
      loadData();
    }
  }, [loggedIn]);

  /* ===================================================
     LOGIN
  =================================================== */

  function handleLogin() {
    if (!password.trim()) {
      setMessage(
        "Masukkan password admin"
      );

      return;
    }

    setLoggedIn(true);
    setMessage("");
  }

  /* ===================================================
     ADMIN REQUEST
  =================================================== */

  async function adminRequest(
    action: string,
    data: any
  ) {
    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch("/api/admin", {
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
        });

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
      console.error(error);

      setMessage(
        error?.message ||
          "Terjadi kesalahan"
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  /* ===================================================
     VESSEL - ADD
  =================================================== */

  function openAddVessel() {
    setEditingVessel(null);

    setVesselForm({
      ...emptyVessel,
      DATE: today(),
    });

    setShowVesselForm(true);
  }

  /* ===================================================
     VESSEL - EDIT
  =================================================== */

  function openEditVessel(
    item: Vessel
  ) {
    setEditingVessel(item);

    setVesselForm({
      ...item,
    });

    setShowVesselForm(true);
  }

  /* ===================================================
     VESSEL - SAVE
  =================================================== */

  async function saveVessel() {
    if (!vesselForm.TYPE) {
      setMessage(
        "TYPE wajib diisi"
      );

      return;
    }

    if (!vesselForm.SIZE) {
      setMessage(
        "SIZE wajib diisi"
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

  /* ===================================================
     VESSEL - DELETE
  =================================================== */

  async function deleteVessel(
    item: Vessel
  ) {
    if (!item._row) {
      setMessage(
        "Row vessel tidak ditemukan"
      );

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

  /* ===================================================
     CARGO - ADD
  =================================================== */

  function openAddCargo() {
    setEditingCargo(null);

    setCargoForm({
      ...emptyCargo,
      DATE: today(),
      STATUS: "OPEN",
    });

    setShowCargoForm(true);
  }

  /* ===================================================
     CARGO - EDIT
  =================================================== */

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

  /* ===================================================
     CARGO - SAVE
  =================================================== */

  async function saveCargo() {
    if (!cargoForm.CARGO) {
      setMessage(
        "CARGO wajib diisi"
      );

      return;
    }

    if (!cargoForm.SIZE_BARGE) {
      setMessage(
        "SIZE BARGE wajib diisi"
      );

      return;
    }

    if (!cargoForm.POL) {
      setMessage(
        "POL wajib diisi"
      );

      return;
    }

    if (!cargoForm.POD) {
      setMessage(
        "POD wajib diisi"
      );

      return;
    }

    const action =
      editingCargo
        ? "update_cargo"
        : "add_cargo";

    const data =
      editingCargo
        ? {
            ...cargoForm,
            ID:
              editingCargo.ID,
          }
        : {
            ...cargoForm,
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

  /* ===================================================
     CARGO - DELETE
  =================================================== */

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
        `Hapus cargo ID ${item.ID} - ${item.CARGO}?`
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

  /* ===================================================
     LOGIN PAGE
  =================================================== */

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">

          <div className="text-center mb-8">

            <div className="text-5xl mb-4">
              🚢
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              FAWAID ADMIN
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Shipping Marketplace
            </p>

          </div>

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
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            placeholder="Masukkan password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {message && (
            <div className="mt-3 text-sm text-red-600">
              {message}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
          >
            LOGIN ADMIN
          </button>

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

  /* ===================================================
     DASHBOARD
  =================================================== */

  return (
    <main className="min-h-screen bg-slate-100">

      {/* HEADER */}

      <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div>
            <h1 className="font-black text-lg">
              FAWAID ADMIN
            </h1>

            <p className="text-xs text-slate-400">
              Shipping Marketplace
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={loadData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg"
              title="Refresh"
            >
              🔄
            </button>

            <button
              onClick={() => {
                setLoggedIn(false);
                setPassword("");
                setMessage("");
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="mb-6">

          <h2 className="text-2xl font-black text-slate-900">
            Market Management
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Kelola OPEN VESSEL dan DATA MARKET.
          </p>

        </div>

        {/* TABS */}

        <div className="bg-white rounded-2xl p-2 shadow-sm flex gap-2 mb-6">

          <button
            onClick={() =>
              setTab("VESSEL")
            }
            className={`flex-1 py-3 rounded-xl font-bold ${
              tab === "VESSEL"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🚢 OPEN VESSEL
          </button>

          <button
            onClick={() =>
              setTab("CARGO")
            }
            className={`flex-1 py-3 rounded-xl font-bold ${
              tab === "CARGO"
                ? "bg-orange-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📦 DATA MARKET
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5 text-sm font-semibold text-slate-700">
            {message}
          </div>
        )}

        {/* =================================================
            VESSEL
        ================================================= */}

        {tab === "VESSEL" && (
          <section>

            <div className="flex items-center justify-between mb-4">

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  OPEN VESSEL
                </h3>

                <p className="text-sm text-slate-500">
                  {vessels.length} vessel
                </p>
              </div>

              <button
                onClick={openAddVessel}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-sm"
              >
                + ADD VESSEL
              </button>

            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
                Loading vessel...
              </div>
            ) : vessels.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
                Belum ada vessel.
              </div>
            ) : (
              <div className="grid gap-4">

                {vessels.map(
                  (item, index) => (
                    <div
                      key={
                        item._row ||
                        index
                      }
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                        <div className="flex-1">

                          <div className="flex flex-wrap gap-2 mb-3">

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.TYPE || "-"}
                            </span>

                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.SIZE || "-"}
                            </span>

                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                            <div>
                              <span className="text-slate-400">
                                Position
                              </span>

                              <p className="font-bold text-slate-900">
                                {item.POSITION || "-"}
                              </p>
                            </div>

                            <div>
                              <span className="text-slate-400">
                                Available
                              </span>

                              <p className="font-bold text-slate-900">
                                {item["AVAILABLE DATE"] || "-"}
                              </p>
                            </div>

                            <div>
                              <span className="text-slate-400">
                                Next Port
                              </span>

                              <p className="font-bold text-slate-900">
                                {item["NEXT PORT"] || "-"}
                              </p>
                            </div>

                          </div>

                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditVessel(
                                item
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteVessel(
                                item
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-sm"
                          >
                            Delete
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
            CARGO
        ================================================= */}

        {tab === "CARGO" && (
          <section>

            <div className="flex items-center justify-between mb-4">

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  DATA MARKET
                </h3>

                <p className="text-sm text-slate-500">
                  {cargo.length} cargo
                </p>
              </div>

              <button
                onClick={openAddCargo}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-bold text-sm"
              >
                + ADD CARGO
              </button>

            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
                Loading cargo...
              </div>
            ) : cargo.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
                Belum ada cargo.
              </div>
            ) : (
              <div className="grid gap-4">

                {cargo.map(
                  (item, index) => (
                    <div
                      key={
                        item.ID ||
                        index
                      }
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
                    >

                      <div className="flex flex-col lg:flex-row justify-between gap-5">

                        <div className="flex-1">

                          <div className="flex flex-wrap gap-2 mb-3">

                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                              ID {item.ID || "-"}
                            </span>

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.STATUS || "OPEN"}
                            </span>

                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.SIZE_BARGE || "-"}
                            </span>

                          </div>

                          <h4 className="text-lg font-black text-slate-900">
                            {item.CARGO || "-"}
                          </h4>

                          <p className="text-sm text-slate-500 mt-1">
                            {item.POL || "-"} →{" "}
                            {item.POD || "-"}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">

                            <div>
                              <span className="text-slate-400">
                                PT
                              </span>

                              <p className="font-bold text-slate-900">
                                {item.NAMA_PT || "-"}
                              </p>
                            </div>

                            <div>
                              <span className="text-slate-400">
                                PIC
                              </span>

                              <p className="font-bold text-slate-900">
                                {item.PIC || "-"}
                              </p>
                            </div>

                            <div>
                              <span className="text-slate-400">
                                Sales
                              </span>

                              <p className="font-bold text-slate-900">
                                {item.SALES_MAESTRO || "-"}
                              </p>
                            </div>

                            <div>
                              <span className="text-slate-400">
                                Distance
                              </span>

                              <p className="font-bold text-slate-900">
                                {item.DISTANCE || "-"}
                              </p>
                            </div>

                          </div>

                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditCargo(
                                item
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm h-fit"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteCargo(
                                item
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-sm h-fit"
                          >
                            Delete
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

      </div>

      {/* =================================================
          VESSEL MODAL
      ================================================= */}

      {showVesselForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

            <div className="p-5 border-b flex items-center justify-between">

              <div>
                <h3 className="text-xl font-black">
                  {editingVessel
                    ? "EDIT VESSEL"
                    : "ADD VESSEL"}
                </h3>

                <p className="text-sm text-slate-500">
                  OPEN VESSEL
                </p>
              </div>

              <button
                onClick={() =>
                  setShowVesselForm(false)
                }
                className="text-2xl text-slate-400 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                label="DATE"
                value={vesselForm.DATE}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    DATE: value,
                  })
                }
              />

              <Input
                label="TYPE"
                value={vesselForm.TYPE}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    TYPE: value,
                  })
                }
                placeholder="MV / TB"
              />

              <Input
                label="SIZE"
                value={vesselForm.SIZE}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    SIZE: value,
                  })
                }
                placeholder="270 FT / 300 FT"
              />

              <Input
                label="POSITION"
                value={vesselForm.POSITION}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    POSITION: value,
                  })
                }
                placeholder="Samarinda"
              />

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

              <div className="md:col-span-2">

                <TextArea
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
                  placeholder="Pesan inquiry"
                />

              </div>

            </div>

            <div className="p-5 border-t flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowVesselForm(false)
                }
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={saveVessel}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                {saving
                  ? "Saving..."
                  : "Save Vessel"}
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

          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">

              <div>
                <h3 className="text-xl font-black">
                  {editingCargo
                    ? "EDIT CARGO"
                    : "ADD CARGO"}
                </h3>

                <p className="text-sm text-slate-500">
                  DATA MARKET A:V
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCargoForm(false)
                }
                className="text-2xl text-slate-400 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* A */}

                <Input
                  label="NO / ID"
                  value={
                    cargoForm.ID
                  }
                  onChange={() => {}}
                  placeholder="Auto"
                />

                {/* B */}

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

                {/* C */}

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

                {/* D */}

                <Input
                  label="NAMA PT"
                  value={
                    cargoForm.NAMA_PT
                  }
                  onChange={(value) =>
                    setCargoForm({
                      ...cargoForm,
                      NAMA_PT: value,
                    })
                  }
                  placeholder="Nama perusahaan"
                />

                {/* E */}

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

                {/* F */}

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

                {/* G */}

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

                {/* H */}

                <Input
                  label="FROM"
                  value={
                    cargoForm.FROM
                  }
                  onChange={(value) =>
                    setCargoForm({
                      ...cargoForm,
                      FROM: value,
                    })
                  }
                  placeholder="Source cargo"
                />

                {/* I */}

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
                  placeholder="270 FT / 300 FT"
                />

                {/* J */}

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
                  placeholder="Area POL"
                />

                {/* K */}

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

                {/* L */}

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

                {/* M */}

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
                  placeholder="NM"
                />

                {/* N */}

                <Input
                  label="CARGO"
                  value={
                    cargoForm.CARGO
                  }
                  onChange={(value) =>
                    setCargoForm({
                      ...cargoForm,
                      CARGO: value,
                    })
                  }
                  placeholder="Coal / Bauxite / etc"
                />

                {/* O */}

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
                  placeholder="Freight"
                />

                {/* P */}

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
                  placeholder="Laycan"
                />

                {/* Q */}

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
                  placeholder="Prorate"
                />

                {/* R */}

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
                  placeholder="Demurrage"
                />

                {/* S */}

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
                  placeholder="Payment term"
                />

                {/* T */}

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
                  placeholder="Out fee"
                />

                {/* U */}

                <Input
                  label="STATUS"
                  value={
                    cargoForm.STATUS
                  }
                  onChange={(value) =>
                    setCargoForm({
                      ...cargoForm,
                      STATUS:
                        value,
                    })
                  }
                  placeholder="OPEN"
                />

              </div>

              {/* V */}

              <div className="mt-4">

                <TextArea
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
                  placeholder="Catatan"
                />

              </div>

            </div>

            <div className="p-5 border-t flex justify-end gap-2 sticky bottom-0 bg-white">

              <button
                onClick={() =>
                  setShowCargoForm(false)
                }
                className="px-5 py-3 rounded-xl bg-slate-100 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={saveCargo}
                disabled={saving}
                className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                {saving
                  ? "Saving..."
                  : "Save Cargo"}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}