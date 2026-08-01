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
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-700 py-10 text-white shadow-lg">

        <h1 className="text-center text-4xl font-bold">
          🚢 MARKET MAESTRO
        </h1>

        <p className="mt-3 text-center text-blue-100">
          Find Available Cargo All Over Indonesia
        </p>

      </div>

      <div className="mx-auto max-w-7xl p-6">

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search Cargo, POL, POD, Area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded-xl border border-gray-300 bg-white p-4 text-lg outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* FILTER */}
        <div className="mb-8 grid grid-cols-4 gap-2">

          {/* AREA */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm font-medium"
          >
            <option value="ALL">🌍 Area</option>

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
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm font-medium"
          >
            <option value="ALL">🚢 Cargo</option>

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
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm font-medium"
          >
            <option value="ALL">📏 Size</option>

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
            className="rounded-xl border border-gray-300 bg-white p-3 text-sm font-medium"
          >
            <option value="ALL">📋 Status</option>

            {[...new Set(cargo.map((item) => item.STATUS))].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

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

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">

              {/* Header */}
              <div className="grid grid-cols-12 items-center bg-blue-700 px-5 py-4 text-sm font-bold text-white">

                <div className="col-span-3 text-center">
                  Cargo
                </div>

                <div className="col-span-5 text-center">
                  Route
                </div>

                <div className="col-span-2 text-center">
                  Size
                </div>

                <div className="col-span-2 text-center">
                  Detail
                </div>

              </div>

              {/* List Cargo */}
              <div className="divide-y divide-gray-200">

                {filteredCargo.map((item) => (
                  <CargoCard
                    key={item.ID}
                    item={item}
                  />
                ))}

              </div>

            </div>
          </>
        )}

      </div>

    </main>
  );
}