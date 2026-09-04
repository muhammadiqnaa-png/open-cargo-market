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

export default function Home() {
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [areaFilter, setAreaFilter] = useState("ALL");
  const [cargoFilter, setCargoFilter] = useState("ALL");
  const [sizeFilter, setSizeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  useEffect(() => {
    fetch("/api/cargo")
      .then((res) => res.json())
      .then((data) => {
        setCargo(data);
        setLoading(false);
      });
  }, []);

  const filteredCargo = cargo.filter((item) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      item.CARGO?.toLowerCase().includes(keyword) ||
      item.POL?.toLowerCase().includes(keyword) ||
      item.POD?.toLowerCase().includes(keyword) ||
      item.AREA?.toLowerCase().includes(keyword);

    const matchArea =
      areaFilter === "ALL" || item.AREA === areaFilter;

    const matchCargo =
      cargoFilter === "ALL" || item.CARGO === cargoFilter;

    const matchSize =
      sizeFilter === "ALL" || item.SIZE === sizeFilter;

    const matchStatus =
      statusFilter === "ALL" || item.STATUS === statusFilter;

    return (
      matchSearch &&
      matchArea &&
      matchCargo &&
      matchSize &&
      matchStatus
    );
  });

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#0B3D68] via-[#0F4C81] to-[#0B3D68] text-white shadow-lg">

        <div className="mx-auto max-w-7xl px-6 py-14">

          <h1 className="text-center text-4xl font-extrabold tracking-wide md:text-6xl">
            🚢 AVAILABLE MARKET
          </h1>

          <p className="mt-4 text-center text-xl font-semibold text-slate-300">
            Indonesia's Digital Shipping Marketplace
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-300 leading-8">
            Find available cargo quickly and connect directly with cargo owners
            across Indonesia.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">

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

            {/* OPERATING AREA */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">

              <div className="mt-3 text-4xl font-extrabold">
                {[...new Set(cargo.map((item) => item.AREA))].length}
              </div>

              <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
                Operating Area
              </div>

              <div className="mt-4 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200">
                Indonesia
              </div>

            </div>

            {/* PORTS */}
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">

              <div className="mt-3 text-4xl font-extrabold">
                {[
                  ...new Set(
                    cargo.flatMap((item) => [item.POL, item.POD])
                  )
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


      {/* OFFER VESSEL & CARGO */}
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


      {/* VESSEL FORM MODAL */}
      {showVesselForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-extrabold text-[#0B3D68]">
                  🚢 OFFER VESSEL
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Submit your vessel information
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowVesselForm(false)}
                className="text-3xl font-bold text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>


            <div className="space-y-4">

              {/* COMPANY */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Company
                </label>

                <input
                  type="text"
                  value={vesselCompany}
                  onChange={(e) => setVesselCompany(e.target.value)}
                  placeholder="PT. ....."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* TYPE */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Type
                </label>

                <select
                  value={vesselType}
                  onChange={(e) => setVesselType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                >

                  <option value="">
                    Select Type
                  </option>

                  <option value="Barge">
                    Barge
                  </option>

                  <option value="MV">
                    MV
                  </option>

                </select>

              </div>


              {/* SIZE */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Size
                </label>

                <input
                  type="text"
                  value={vesselSize}
                  onChange={(e) => setVesselSize(e.target.value)}
                  placeholder="300 FT"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* POSITION */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Position
                </label>

                <input
                  type="text"
                  value={vesselPosition}
                  onChange={(e) => setVesselPosition(e.target.value)}
                  placeholder="Muara Jawa"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* AVAILABLE */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Available
                </label>

                <input
                  type="text"
                  value={vesselAvailable}
                  onChange={(e) => setVesselAvailable(e.target.value)}
                  placeholder="ASAP / 10 Sep 2026"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* NEXT PORT */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Next Port
                </label>

                <input
                  type="text"
                  value={vesselNextPort}
                  onChange={(e) => setVesselNextPort(e.target.value)}
                  placeholder="Samarinda"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* WHATSAPP */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  WhatsApp
                </label>

                <input
                  type="tel"
                  value={vesselWhatsapp}
                  onChange={(e) => setVesselWhatsapp(e.target.value)}
                  placeholder="628xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-[#0F4C81] focus:bg-white"
                />

              </div>

            </div>


            {/* SUBMIT */}
            <button
              type="button"
              onClick={() => {
                const message = `🚢 OFFER VESSEL

Company      : ${vesselCompany}
Type         : ${vesselType}
Size         : ${vesselSize}
Position     : ${vesselPosition}
Available    : ${vesselAvailable}
Next Port    : ${vesselNextPort}
WhatsApp     : ${vesselWhatsapp}`;

                const whatsappUrl = `https://wa.me/6285222124545?text=${encodeURIComponent(
                  message
                )}`;

                window.open(whatsappUrl, "_blank");
              }}
              className="mt-6 w-full rounded-xl bg-[#0B3D68] py-3 font-bold text-white shadow-md transition hover:bg-[#0F4C81]"
            >
              SEND OFFER VESSEL
            </button>

          </div>

        </div>

      )}


      {/* CARGO FORM MODAL */}
      {showCargoForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-extrabold text-[#0B3D68]">
                  📦 OFFER CARGO
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Submit your cargo information
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowCargoForm(false)}
                className="text-3xl font-bold text-gray-400 hover:text-gray-700"
              >
                ×
              </button>

            </div>


            <div className="space-y-4">

              {/* COMPANY */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Company
                </label>

                <input
                  type="text"
                  value={cargoCompany}
                  onChange={(e) => setCargoCompany(e.target.value)}
                  placeholder="PT. ....."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* TYPE VESSEL */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Type Vessel
                </label>

                <select
                  value={cargoVesselType}
                  onChange={(e) => setCargoVesselType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                >

                  <option value="">
                    Select Type Vessel
                  </option>

                  <option value="Barge">
                    Barge
                  </option>

                  <option value="MV">
                    MV
                  </option>

                </select>

              </div>


              {/* TYPE CARGO */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Type Cargo
                </label>

                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                >

                  <option value="">
                    Select Cargo
                  </option>

                  <option value="Coal">
                    Coal
                  </option>

                  <option value="Bauxite">
                    Bauxite
                  </option>

                  <option value="Nickel">
                    Nickel
                  </option>

                  <option value="Sand">
                    Sand
                  </option>

                  <option value="Split">
                    Split
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* SIZE */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Size
                </label>

                <input
                  type="text"
                  value={cargoSize}
                  onChange={(e) => setCargoSize(e.target.value)}
                  placeholder="300 FT"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* POL */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  POL
                </label>

                <input
                  type="text"
                  value={cargoPOL}
                  onChange={(e) => setCargoPOL(e.target.value)}
                  placeholder="Samarinda"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* POD */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  POD
                </label>

                <input
                  type="text"
                  value={cargoPOD}
                  onChange={(e) => setCargoPOD(e.target.value)}
                  placeholder="Cirebon"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* LAYCAN */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Laycan
                </label>

                <input
                  type="text"
                  value={cargoLaycan}
                  onChange={(e) => setCargoLaycan(e.target.value)}
                  placeholder="ASAP / 10 Sep 2026"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* FREIGHT */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Freight
                </label>

                <input
                  type="text"
                  value={cargoFreight}
                  onChange={(e) => setCargoFreight(e.target.value)}
                  placeholder="IDR 185,000/MT"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>


              {/* WHATSAPP */}
              <div>

                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  WhatsApp
                </label>

                <input
                  type="tel"
                  value={cargoWhatsapp}
                  onChange={(e) => setCargoWhatsapp(e.target.value)}
                  placeholder="628xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-[#0F4C81] focus:bg-white"
                />

              </div>

            </div>


            {/* SUBMIT */}
            <button
              type="button"
              onClick={() => {
                const message = `📦 OFFER CARGO

Company      : ${cargoCompany}
Type Vessel  : ${cargoVesselType}
Type Cargo   : ${cargoType}
Size         : ${cargoSize}
POL          : ${cargoPOL}
POD          : ${cargoPOD}
Laycan       : ${cargoLaycan}
Freight      : ${cargoFreight}
WhatsApp     : ${cargoWhatsapp}`;

                const whatsappUrl = `https://wa.me/6285222124545?text=${encodeURIComponent(
                  message
                )}`;

                window.open(whatsappUrl, "_blank");
              }}
              className="mt-6 w-full rounded-xl bg-[#0B3D68] py-3 font-bold text-white shadow-md transition hover:bg-[#0F4C81]"
            >
              SEND OFFER CARGO
            </button>

          </div>

        </div>

      )}


      {/* MARKET CONTENT */}
      <div className="mx-auto max-w-7xl p-6">

        {/* SEARCH */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-3 shadow-md">

          <div className="flex items-center">

            <span className="px-4 text-xl text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search Cargo, POL, POD, Area or Route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent p-3 text-lg outline-none"
            />

          </div>

        </div>


        {/* FILTER */}
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-md">

          <div className="grid grid-cols-4 gap-3">

            {/* AREA */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
            >

              <option value="ALL">
                Area
              </option>

              {[...new Set(cargo.map((item) => item.AREA))].map((area) => (

                <option
                  key={area}
                  value={area}
                >
                  {area}
                </option>

              ))}

            </select>


            {/* CARGO */}
            <select
              value={cargoFilter}
              onChange={(e) => setCargoFilter(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
            >

              <option value="ALL">
                Cargo
              </option>

              {[...new Set(cargo.map((item) => item.CARGO))].map((cargoType) => (

                <option
                  key={cargoType}
                  value={cargoType}
                >
                  {cargoType}
                </option>

              ))}

            </select>


            {/* SIZE */}
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
            >

              <option value="ALL">
                Size
              </option>

              {[...new Set(cargo.map((item) => item.SIZE))].map((size) => (

                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>

              ))}

            </select>


            {/* STATUS */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
            >

              <option value="ALL">
                Status
              </option>

              {[...new Set(cargo.map((item) => item.STATUS))].map((status) => (

                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* LOADING */}
        {loading ? (

          <div className="text-center text-xl font-semibold">
            Loading Cargo...
          </div>

        ) : (

          <>

            <p className="mb-5 text-gray-600">
              Total Cargo : <strong>{filteredCargo.length}</strong>
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredCargo.map((item) => (

                <CargoCard
                  key={item.ID}
                  item={item}
                />

              ))}

            </div>

          </>

        )}

      </div>

    </main>
  );
}