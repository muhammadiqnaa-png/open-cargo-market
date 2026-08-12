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

      {/* Header */}
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

          <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">
            <div className="text-4xl"></div>
            <div className="mt-3 text-4xl font-extrabold">
              {filteredCargo.length}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
              Available Shipment
            </div>
            <div className="mt-4 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200"></div>
              ● Live
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">
            <div className="text-4xl"></div>
            <div className="mt-3 text-4xl font-extrabold">
              {[...new Set(cargo.map(item => item.AREA))].length}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
              Operating Area
            </div>
            <div className="mt-4 inline-flex rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200"></div>
              Indonesia
            </div>

          <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/20">
            <div className="text-4xl"></div>
            <div className="mt-3 text-4xl font-extrabold">
              {[
                ...new Set(
                  cargo.flatMap(item => [item.POL, item.POD])
                )
              ].length}
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
              Ports
            </div>
            <div className="mt-4 inline-flex rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-200"></div>
              Updated Daily
            </div>

          </div>

        </div>

      </div>

      <div className="mx-auto max-w-7xl p-6">

        {/* Search */}
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
            <option value="ALL">Area</option>

            {[...new Set(cargo.map((item) => item.AREA))].map((area) => (
              <option key={area} value={area}>
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
            <option value="ALL">Cargo</option>

            {[...new Set(cargo.map((item) => item.CARGO))].map((cargoType) => (
              <option key={cargoType} value={cargoType}>
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
            <option value="ALL">Size</option>

            {[...new Set(cargo.map((item) => item.SIZE))].map((size) => (
              <option key={size} value={size}>
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
            <option value="ALL">Status</option>

            {[...new Set(cargo.map((item) => item.STATUS))].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

        </div>
      </div> 

        {/* Loading */}
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
