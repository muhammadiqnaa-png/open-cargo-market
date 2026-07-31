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
  const [cargoFilter, setCargoFilter] = useState("ALL");

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

    const matchCargo =
      cargoFilter === "ALL" || item.CARGO === cargoFilter;

    return matchSearch && matchCargo;
  });

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-700 text-white py-10 shadow-lg">

        <h1 className="text-center text-4xl font-bold">
          🚢 OPEN CARGO MARKET
        </h1>

        <p className="mt-3 text-center text-blue-100">
          Find Available Cargo All Over Indonesia
        </p>

      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search Cargo, POL, POD, Area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 w-full rounded-xl border border-gray-300 bg-white p-4 text-lg outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="mb-8">
          <select
            value={cargoFilter}
            onChange={(e) => setCargoFilter(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-4"
          >
            <option value="ALL">Semua Cargo</option>

            {[...new Set(cargo.map((item) => item.CARGO))].map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
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

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCargo.map((item, index) => (
                <CargoCard key={index} item={item} />
              ))}
            </div>
          </>
        )}

      </div>

    </main>
  );
}