"use client";

import { useEffect, useState } from "react";
import CargoCard from "./components/CargoCard";

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
};

type Vessel = {
  DATE: string;
  TYPE: string;
  SIZE: string;
  POSITION: string;
  "AVAILABLE DATE": string;
  "NEXT PORT": string;
  INQUIRY: string;
};

export default function Home() {
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);

  const [vessel, setVessel] = useState<Vessel[]>([]);
  const [vesselLoading, setVesselLoading] = useState(true);

  const [search, setSearch] = useState("");

  // MARKET FILTER
  const [marketFilter, setMarketFilter] = useState("ALL");

  // OFFER VESSEL
  const [showVesselForm, setShowVesselForm] = useState(false);

  const [vesselCompany, setVesselCompany] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [vesselSize, setVesselSize] = useState("");
  const [vesselPosition, setVesselPosition] = useState("");
  const [vesselAvailable, setVesselAvailable] = useState("");
  const [vesselNextPort, setVesselNextPort] = useState("");
  const [vesselWhatsapp, setVesselWhatsapp] = useState("");

  // OFFER CARGO
  const [showCargoForm, setShowCargoForm] = useState(false);

  const [cargoCompany, setCargoCompany] = useState("");
  const [cargoVesselType, setCargoVesselType] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [cargoSize, setCargoSize] = useState("");
  const [cargoPOL, setCargoPOL] = useState("");
  const [cargoPOD, setCargoPOD] = useState("");
  const [cargoLaycan, setCargoLaycan] = useState("");
  const [cargoFreight, setCargoFreight] = useState("");
  const [cargoWhatsapp, setCargoWhatsapp] = useState("");

  // GET CARGO
  useEffect(() => {
    fetch("/api/cargo")
      .then((res) => res.json())
      .then((data) => {
        setCargo(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // GET VESSEL
  useEffect(() => {
    fetch("/api/vessel")
      .then((res) => res.json())
      .then((data) => {
        setVessel(data);
        setVesselLoading(false);
      })
      .catch(() => {
        setVesselLoading(false);
      });
  }, []);

  // FILTER VESSEL
  const filteredVessel = vessel.filter((item) => {
    if (marketFilter === "CARGO") return false;

    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      item.TYPE?.toLowerCase().includes(keyword) ||
      item.SIZE?.toLowerCase().includes(keyword) ||
      item.POSITION?.toLowerCase().includes(keyword) ||
      item["AVAILABLE DATE"]?.toLowerCase().includes(keyword) ||
      item["NEXT PORT"]?.toLowerCase().includes(keyword)
    );
  });

  // FILTER CARGO
  const filteredCargo = cargo.filter((item) => {
    if (marketFilter === "VESSEL") return false;

    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      item.CARGO?.toLowerCase().includes(keyword) ||
      item.SIZE?.toLowerCase().includes(keyword) ||
      item.AREA?.toLowerCase().includes(keyword) ||
      item.POL?.toLowerCase().includes(keyword) ||
      item.POD?.toLowerCase().includes(keyword) ||
      item.ROUTE?.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="bg-gradient-to-r from-[#0B3D68] via-[#0F4C81] to-[#0B3D68] text-white shadow-lg">

        <div className="mx-auto max-w-7xl px-6 py-14">

          <h1 className="text-center text-4xl font-extrabold tracking-wide md:text-6xl">
            🚢 AVAILABLE MARKET
          </h1>

          <p className="mt-4 text-center text-xl font-semibold text-slate-300">
            Indonesia's Digital Shipping Marketplace
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-center leading-8 text-slate-300">
            Find available vessel and cargo quickly and connect directly
            with shipping market across Indonesia.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">

            {/* AVAILABLE VESSEL */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">

              <div className="mt-3 text-4xl font-extrabold">
                {vessel.length}
              </div>

              <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
                Available Vessel
              </div>

              <div className="mt-4 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                ● Live
              </div>

            </div>

            {/* AVAILABLE SHIPMENT */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">

              <div className="mt-3 text-4xl font-extrabold">
                {filteredCargo.length}
              </div>

              <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
                Available Shipment
              </div>

              <div className="mt-4 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                ● Live
              </div>

            </div>

            {/* PORTS */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">

              <div className="mt-3 text-4xl font-extrabold">
                {[
                  ...new Set(
                    cargo.flatMap((item) => [item.POL, item.POD])
                  ),
                ].length}
              </div>

              <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
                Ports
              </div>

              <div className="mt-4 inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-200">
                Updated Daily
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================== */}
      {/* OFFER VESSEL & CARGO */}
      {/* ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 pt-6">

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* OFFER VESSEL */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0B3D68] to-[#0F4C81] p-6 text-center shadow-lg">

            <h2 className="text-2xl font-extrabold text-white">
              🚢 HAVE A VESSEL?
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Offer your vessel to the FMLS market
            </p>

            <button
              type="button"
              onClick={() => setShowVesselForm(true)}
              className="mt-5 rounded-xl bg-white px-8 py-3 font-bold text-[#0B3D68] shadow-md transition hover:scale-105 hover:bg-slate-100"
            >
              🚢 OFFER VESSEL
            </button>

          </div>


          {/* OFFER CARGO */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0F4C81] to-[#0B3D68] p-6 text-center shadow-lg">

            <h2 className="text-2xl font-extrabold text-white">
              📦 HAVE A CARGO?
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Offer your cargo to the FMLS market
            </p>

            <button
              type="button"
              onClick={() => setShowCargoForm(true)}
              className="mt-5 rounded-xl bg-white px-8 py-3 font-bold text-[#0B3D68] shadow-md transition hover:scale-105 hover:bg-slate-100"
            >
              📦 OFFER CARGO
            </button>

          </div>

        </div>

      </div>
      {/* ===================================================== */}
      {/* ===================================================== */}
      {/* MARKET SEARCH & FILTER */}
      {/* ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-8">

        <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-md">

          <div className="flex flex-col gap-3 md:flex-row">

            <div className="flex flex-1 items-center rounded-2xl bg-gray-50">

              <span className="px-4 text-xl text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search vessel, cargo, port, position or route..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent p-3 text-lg text-gray-900 placeholder:text-gray-400 outline-none"
              />

            </div>

            <div className="grid grid-cols-3 gap-2 md:w-[360px]">

              <button
                type="button"
                onClick={() => setMarketFilter("ALL")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  marketFilter === "ALL"
                    ? "bg-[#0B3D68] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ALL
              </button>

              <button
                type="button"
                onClick={() => setMarketFilter("VESSEL")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  marketFilter === "VESSEL"
                    ? "bg-[#0B3D68] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🚢 VESSEL
              </button>

              <button
                type="button"
                onClick={() => setMarketFilter("CARGO")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  marketFilter === "CARGO"
                    ? "bg-[#0B3D68] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📦 CARGO
              </button>

            </div>

          </div>

        </div>

      </section>

{/* ===================================================== */}
{/* OPEN VESSEL */}
{/* ===================================================== */}

{marketFilter !== "CARGO" && (
  <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">

    {/* MAIN VESSEL CONTAINER */}
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-lg md:p-7">

      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-extrabold text-[#0B3D68] md:text-3xl">
            🚢 OPEN VESSEL
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Available vessel in the market
          </p>
        </div>

        <div className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
          {filteredVessel.length} Available
        </div>

      </div>

      {/* CONTENT */}
      {vesselLoading ? (

        <div className="py-14 text-center text-lg font-semibold text-gray-600">
          Loading Vessel...
        </div>

      ) : filteredVessel.length === 0 ? (

        <div className="rounded-2xl border border-gray-200 bg-gray-50 py-14 text-center">

          <div className="text-5xl">
            🚢
          </div>

          <p className="mt-4 text-lg font-bold text-gray-700">
            No vessel available
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try another search or check again later.
          </p>

        </div>

      ) : (

        /* VESSEL CARDS */
        <div className="flex flex-wrap justify-center gap-6">

          {filteredVessel.map((item, index) => (

            <div
              key={`${item.DATE}-${item.TYPE}-${item.SIZE}-${index}`}
              className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* CARD HEADER */}
              <div className="flex items-start justify-between">

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    OPEN VESSEL
                  </div>

                  <h3 className="mt-2 text-2xl font-extrabold text-[#0B3D68]">
                    {item.TYPE || "-"}
                  </h3>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  ● OPEN
                </span>

              </div>

              {/* SIZE */}
              <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4">

                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Size
                </div>

                <div className="mt-1 text-lg font-bold text-gray-900">
                  {item.SIZE || "-"}
                </div>

              </div>

              {/* DETAILS */}
              <div className="mt-5 space-y-4">

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Position
                  </div>

                  <div className="mt-1 font-bold text-gray-900">
                    📍 {item.POSITION || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Available Date
                  </div>

                  <div className="mt-1 font-bold text-gray-900">
                    📅 {item["AVAILABLE DATE"] || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Next Port
                  </div>

                  <div className="mt-1 font-bold text-gray-900">
                    ⚓ {item["NEXT PORT"] || "-"}
                  </div>
                </div>

              </div>

              {/* INQUIRE */}
              <button
                type="button"
                onClick={() => {
                  const message = `🚢 Vessel Inquiry

Hi, is this vessel still available/open?

Vessel Type : ${item.TYPE || "-"}
Size        : ${item.SIZE || "-"}
Position    : ${item.POSITION || "-"}
Available   : ${item["AVAILABLE DATE"] || "-"}
Next Port   : ${item["NEXT PORT"] || "-"}

Thank you.`;

                  const whatsappUrl =
                    `https://wa.me/6285222124545?text=${encodeURIComponent(
                      message
                    )}`;

                  window.open(whatsappUrl, "_blank");
                }}
                className="mt-6 w-full rounded-xl bg-[#0B3D68] py-3 font-bold text-white shadow-md transition hover:bg-[#0F4C81]"
              >
                💬 INQUIRE VESSEL
              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  </section>
)}


{/* ===================================================== */}
{/* OPEN CARGO / SHIPMENT */}
{/* ===================================================== */}

{marketFilter !== "VESSEL" && (
  <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">

    {/* MAIN CARGO CONTAINER */}
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-lg md:p-7">

      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-extrabold text-[#0B3D68] md:text-3xl">
            📦 OPEN CARGO / SHIPMENT
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Available cargo and shipment in the market
          </p>
        </div>

        <div className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
          {filteredCargo.length} Available
        </div>

      </div>

      {/* CONTENT */}
      {loading ? (

        <div className="py-14 text-center text-lg font-semibold text-gray-600">
          Loading Cargo...
        </div>

      ) : filteredCargo.length === 0 ? (

        <div className="rounded-2xl border border-gray-200 bg-gray-50 py-14 text-center">

          <div className="text-5xl">
            📦
          </div>

          <p className="mt-4 text-lg font-bold text-gray-700">
            No cargo available
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try another search or check again later.
          </p>

        </div>

      ) : (

        /* CARGO CARDS */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredCargo.map((item) => (
            <CargoCard
              key={item.ID}
              item={item}
            />
          ))}

        </div>

      )}

    </div>

  </section>
)}
</main>
  );
}