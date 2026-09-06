"use client";

import { useEffect, useState } from "react";

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
  STATUS: string;
  CARGO: string;
  SIZE: string;
  AREA: string;
  POL: string;
  POD: string;
  DISTANCE: string;
  ROUTE: string;
  DETAIL: string;
  INQUIRY: string;
  _row?: number;
};

type Tab = "VESSEL" | "CARGO";

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
  STATUS: "OPEN",
  CARGO: "",
  SIZE: "",
  AREA: "",
  POL: "",
  POD: "",
  DISTANCE: "",
  ROUTE: "",
  DETAIL: "",
  INQUIRY: "",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [tab, setTab] = useState<Tab>("VESSEL");

  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [cargo, setCargo] = useState<Cargo[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingVessel, setEditingVessel] =
    useState<Vessel | null>(null);

  const [editingCargo, setEditingCargo] =
    useState<Cargo | null>(null);

  const [showVesselForm, setShowVesselForm] = useState(false);
  const [showCargoForm, setShowCargoForm] = useState(false);

  const [vesselForm, setVesselForm] =
    useState<Vessel>(emptyVessel);

  const [cargoForm, setCargoForm] =
    useState<Cargo>(emptyCargo);

  const [message, setMessage] = useState("");

  // =========================
  // LOAD DATA
  // =========================

  async function loadData() {
    setLoading(true);

    try {
      const [vesselRes, cargoRes] = await Promise.all([
        fetch("/api/vessel", { cache: "no-store" }),
        fetch("/api/cargo", { cache: "no-store" }),
      ]);

      const vesselData = await vesselRes.json();
      const cargoData = await cargoRes.json();

      setVessels(
        Array.isArray(vesselData) ? vesselData : []
      );

      setCargo(
        Array.isArray(cargoData) ? cargoData : []
      );
    } catch (error) {
      console.error(error);
      setMessage("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadData();
    }
  }, [loggedIn]);

  // =========================
  // ADMIN REQUEST
  // =========================

  async function adminRequest(
    action: string,
    data: any
  ) {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          action,
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Request gagal"
        );
      }

      setMessage(result.message || "Berhasil");

      await loadData();

      return true;
    } catch (error: any) {
      console.error(error);

      setMessage(
        error?.message || "Terjadi kesalahan"
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // LOGIN
  // =========================

  function handleLogin() {
    if (!password.trim()) {
      setMessage("Masukkan password admin");
      return;
    }

    setLoggedIn(true);
    setMessage("");
  }

  // =========================
  // VESSEL
  // =========================

  function openAddVessel() {
    setEditingVessel(null);
    setVesselForm({
      ...emptyVessel,
      DATE: new Date().toLocaleDateString("en-GB"),
    });
    setShowVesselForm(true);
  }

  function openEditVessel(item: Vessel) {
    setEditingVessel(item);

    setVesselForm({
      ...item,
    });

    setShowVesselForm(true);
  }

  async function saveVessel() {
    if (!vesselForm.TYPE || !vesselForm.SIZE) {
      setMessage("TYPE dan SIZE wajib diisi");
      return;
    }

    const action = editingVessel
      ? "update_vessel"
      : "add_vessel";

    const data = editingVessel
      ? {
          ...vesselForm,
          row: editingVessel._row,
        }
      : vesselForm;

    const success = await adminRequest(
      action,
      data
    );

    if (success) {
      setShowVesselForm(false);
      setEditingVessel(null);
      setVesselForm(emptyVessel);
    }
  }

  async function deleteVessel(item: Vessel) {
    if (!item._row) return;

    const confirmDelete = window.confirm(
      `Hapus vessel ${item.TYPE} ${item.SIZE}?`
    );

    if (!confirmDelete) return;

    await adminRequest("delete_vessel", {
      row: item._row,
    });
  }

  // =========================
  // CARGO
  // =========================

  function openAddCargo() {
    setEditingCargo(null);

    setCargoForm({
      ...emptyCargo,
      ID: `CARGO-${Date.now()}`,
    });

    setShowCargoForm(true);
  }

  function openEditCargo(item: Cargo) {
    setEditingCargo(item);

    setCargoForm({
      ...item,
    });

    setShowCargoForm(true);
  }

  async function saveCargo() {
    if (!cargoForm.CARGO || !cargoForm.SIZE) {
      setMessage("CARGO dan SIZE wajib diisi");
      return;
    }

    const action = editingCargo
      ? "update_cargo"
      : "add_cargo";

    const data = editingCargo
      ? {
          ...cargoForm,
          row: editingCargo._row,
        }
      : cargoForm;

    const success = await adminRequest(
      action,
      data
    );

    if (success) {
      setShowCargoForm(false);
      setEditingCargo(null);
      setCargoForm(emptyCargo);
    }
  }

  async function deleteCargo(item: Cargo) {
    if (!item._row) return;

    const confirmDelete = window.confirm(
      `Hapus cargo ${item.CARGO} ${item.SIZE}?`
    );

    if (!confirmDelete) return;

    await adminRequest("delete_cargo", {
      row: item._row,
    });
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl">
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

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Admin Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            placeholder="Masukkan password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {message && (
            <p className="text-sm text-red-600 mt-3">
              {message}
            </p>
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

  // =========================
  // ADMIN DASHBOARD
  // =========================

  return (
    <main className="min-h-screen bg-slate-100">
      {/* HEADER */}

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
            <button
              onClick={loadData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm"
            >
              🔄
            </button>

            <button
              onClick={() => {
                setLoggedIn(false);
                setPassword("");
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* TITLE */}

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Market Management
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Kelola OPEN VESSEL dan OPEN CARGO langsung
            dari sini.
          </p>
        </div>

        {/* TABS */}

        <div className="bg-white rounded-2xl p-2 shadow-sm flex gap-2 mb-6">
          <button
            onClick={() => setTab("VESSEL")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm ${
              tab === "VESSEL"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🚢 VESSEL
          </button>

          <button
            onClick={() => setTab("CARGO")}
            className={`flex-1 py-3 rounded-xl font-bold text-sm ${
              tab === "CARGO"
                ? "bg-orange-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📦 CARGO
          </button>
        </div>

        {/* MESSAGE */}

        {message && (
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5 text-sm font-medium text-slate-700">
            {message}
          </div>
        )}

        {/* ===================== */}
        {/* VESSEL */}
        {/* ===================== */}

        {tab === "VESSEL" && (
          <section>

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
                onClick={openAddVessel}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl text-sm"
              >
                + ADD VESSEL
              </button>
            </div>

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
                {vessels.map((item, index) => (
                  <div
                    key={item._row || index}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            {item.TYPE || "-"}
                          </span>

                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            {item.SIZE || "-"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-400">
                              Position
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item.POSITION || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Available
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item["AVAILABLE DATE"] || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Next Port
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item["NEXT PORT"] || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Date
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item.DATE || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openEditVessel(item)
                          }
                          className="flex-1 md:flex-none bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold"
                        >
                          ✏️ EDIT
                        </button>

                        <button
                          onClick={() =>
                            deleteVessel(item)
                          }
                          disabled={saving}
                          className="flex-1 md:flex-none bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold"
                        >
                          🗑️ DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ===================== */}
        {/* CARGO */}
        {/* ===================== */}

        {tab === "CARGO" && (
          <section>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  OPEN CARGO / SHIPMENT
                </h3>

                <p className="text-sm text-slate-500">
                  {cargo.length} cargo
                </p>
              </div>

              <button
                onClick={openAddCargo}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-3 rounded-xl text-sm"
              >
                + ADD CARGO
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                Loading cargo...
              </div>
            ) : cargo.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                Belum ada cargo.
              </div>
            ) : (
              <div className="grid gap-4">
                {cargo.map((item, index) => (
                  <div
                    key={item._row || index}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            {item.CARGO || "-"}
                          </span>

                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            {item.SIZE || "-"}
                          </span>

                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            {item.STATUS || "-"}
                          </span>
                        </div>

                        <div className="text-lg font-bold text-slate-900 mb-2">
                          {item.POL || "-"}
                          <span className="mx-2 text-slate-400">
                            →
                          </span>
                          {item.POD || "-"}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-400">
                              ID
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item.ID || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Area
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item.AREA || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Distance
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item.DISTANCE || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-slate-400">
                              Route
                            </span>

                            <p className="font-semibold text-slate-900">
                              {item.ROUTE || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openEditCargo(item)
                          }
                          className="flex-1 md:flex-none bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold"
                        >
                          ✏️ EDIT
                        </button>

                        <button
                          onClick={() =>
                            deleteCargo(item)
                          }
                          disabled={saving}
                          className="flex-1 md:flex-none bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold"
                        >
                          🗑️ DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ===================== */}
      {/* VESSEL MODAL */}
      {/* ===================== */}

      {showVesselForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-5">

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
                  setShowVesselForm(false)
                }
                className="text-slate-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4">

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

              <Select
                label="TYPE"
                value={vesselForm.TYPE}
                options={["BARGE", "MV"]}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    TYPE: value,
                  })
                }
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
                placeholder="Contoh: 300 FT"
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
              />

              <Input
                label="AVAILABLE DATE"
                value={vesselForm["AVAILABLE DATE"]}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    "AVAILABLE DATE": value,
                  })
                }
              />

              <Input
                label="NEXT PORT"
                value={vesselForm["NEXT PORT"]}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    "NEXT PORT": value,
                  })
                }
              />

              <Input
                label="INQUIRY"
                value={vesselForm.INQUIRY}
                onChange={(value) =>
                  setVesselForm({
                    ...vesselForm,
                    INQUIRY: value,
                  })
                }
                placeholder="Nomor / link WhatsApp"
              />

              <button
                onClick={saveVessel}
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

      {/* ===================== */}
      {/* CARGO MODAL */}
      {/* ===================== */}

      {showCargoForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-5">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingCargo
                    ? "Edit Cargo"
                    : "Add Cargo"}
                </h3>

                <p className="text-sm text-slate-500">
                  Isi informasi cargo / shipment
                </p>
              </div>

              <button
                onClick={() =>
                  setShowCargoForm(false)
                }
                className="text-slate-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4">

              <Input
                label="ID"
                value={cargoForm.ID}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    ID: value,
                  })
                }
              />

              <Select
                label="STATUS"
                value={cargoForm.STATUS}
                options={[
                  "OPEN",
                  "PENDING",
                  "CLOSED",
                ]}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    STATUS: value,
                  })
                }
              />

              <Select
                label="CARGO"
                value={cargoForm.CARGO}
                options={[
                  "COAL",
                  "BAUXITE",
                  "NICKEL",
                  "SAND",
                  "SPLIT",                  
                  "IRON ORE",
                ]}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    CARGO: value,
                  })
                }
              />

              <Input
                label="SIZE"
                value={cargoForm.SIZE}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    SIZE: value,
                  })
                }
                placeholder="Contoh: 300 FT"
              />

              <Input
                label="AREA"
                value={cargoForm.AREA}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    AREA: value,
                  })
                }
              />

              <Input
                label="POL"
                value={cargoForm.POL}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    POL: value,
                  })
                }
              />

              <Input
                label="POD"
                value={cargoForm.POD}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    POD: value,
                  })
                }
              />

              <Input
                label="DISTANCE"
                value={cargoForm.DISTANCE}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    DISTANCE: value,
                  })
                }
                placeholder="Contoh: 525 NM"
              />

              <Input
                label="ROUTE"
                value={cargoForm.ROUTE}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    ROUTE: value,
                  })
                }
              />

              <Textarea
                label="DETAIL"
                value={cargoForm.DETAIL}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    DETAIL: value,
                  })
                }
              />

              <Input
                label="INQUIRY"
                value={cargoForm.INQUIRY}
                onChange={(value) =>
                  setCargoForm({
                    ...cargoForm,
                    INQUIRY: value,
                  })
                }
                placeholder="Nomor / link WhatsApp"
              />

              <button
                onClick={saveCargo}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl mt-2"
              >
                {saving
                  ? "MENYIMPAN..."
                  : editingCargo
                  ? "UPDATE CARGO"
                  : "ADD CARGO"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// =========================
// INPUT COMPONENT
// =========================

function Input({
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
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// =========================
// SELECT COMPONENT
// =========================

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <select
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// =========================
// TEXTAREA COMPONENT
// =========================

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        rows={4}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}