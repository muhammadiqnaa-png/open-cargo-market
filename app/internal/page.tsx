"use client";

import { useEffect, useState } from "react";
import InternalCargoCard from "../components/InternalCargoCard";

type Cargo = {
  ID: string;
  STATUS: string;
  CARGO: string;
  SIZE: string;
  AREA: string;
  POL: string;
  POD: string;
  DISTANCE: string;
  LAYCAN?: string;
  FREIGHT?: string;
};

export default function InternalPage() {
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch("/api/cargo")
      .then((res) => res.json())
      .then((data) => {
        setCargo(data);
        setLoading(false);
      });
  }, []);

  const handleCheck = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const filteredCargo = cargo.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.CARGO?.toLowerCase().includes(keyword) ||
      item.POL?.toLowerCase().includes(keyword) ||
      item.POD?.toLowerCase().includes(keyword) ||
      item.SIZE?.toLowerCase().includes(keyword)
    );
  });

  const selectedCargo = cargo.filter((item) =>
    selected.includes(item.ID)
  );

return (
<main className="min-h-screen bg-[#F8FAFC]">

  <div className="mx-auto max-w-7xl p-6">

    <h1 className="text-4xl font-bold text-[#0A2F35]">
      Internal Shipment
    </h1>

    <p className="mt-2 text-slate-500">
      Select shipment to generate WhatsApp list.
    </p>

    {/* Search */}
    <div className="mt-8 rounded-2xl bg-white p-4 shadow">
      <input
        type="text"
        placeholder="Search Cargo, POL, POD..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#0A2F35] focus:ring-2 focus:ring-[#D9EEF1]"
      />
    </div>

    {loading ? (
      <div className="mt-10 text-center text-lg font-semibold">
        Loading Shipment...
      </div>
    ) : (
      <>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredCargo.map((item) => (
            <InternalCargoCard
              key={item.ID}
              item={item}
              checked={selected.includes(item.ID)}
              onCheck={handleCheck}
            />
          ))}

        </div>

        <div className="sticky bottom-6 mt-8 rounded-2xl border border-[#184750] bg-[#0A2F35] p-5 text-white shadow-xl">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                {selected.length} Shipment Selected
              </h2>

              <p className="text-sm text-slate-300">
                Generate WhatsApp list from selected shipment.
              </p>
            </div>

            <button
              onClick={() => {
                if (selectedCargo.length === 0) {
                  alert("Please select at least one shipment.");
                  return;
                }

                setShowPreview(true);
              }}
              className="rounded-xl bg-[#0A2F35] px-6 py-3 font-semibold text-white transition hover:bg-[#114A53]"
            >
              Generate WhatsApp List
            </button>

          </div>

        </div>
      </>
    )}

  </div>

              {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-[#0A2F35]">
                FMLS
              </h2>  

              <p className="mt-1 text-gray-500">
                Available Shipment
              </p>
              <div className="mt-3 h-1 w-20 rounded-full bg-[#0A2F35]"></div>

              <button
                onClick={() => setShowPreview(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {selectedCargo.map((item, index) => (
                <div
                  key={item.ID}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between">

                    <div className="text-xl font-bold text-[#0A2F35]">
                        Shipment #{index + 1}
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        AVAILABLE
                    </span>

                </div>

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-gray-500">Cargo</span>
                      <span className="font-semibold">{item.CARGO}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Size</span>
                      <span className="font-semibold">{item.SIZE}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Route</span>
                      <span className="font-semibold">
                        {item.POL} → {item.POD}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Freight</span>
                      <span className="text-lg font-bold text-[#0A2F35]">
                        {item.FREIGHT ?? "-"}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-3">

              <button
                onClick={() => {
                  const text = selectedCargo
                    .map(
                      (item, index) => `${index + 1}.

Cargo : ${item.CARGO}
Size : ${item.SIZE}
Route : ${item.POL} → ${item.POD}
Freight : ${item.FREIGHT ?? "-"}`
                    )
                    .join("\n\n-------------------------\n\n");

                  navigator.clipboard.writeText(text);

                  alert("Copied successfully!");
                }}
                className="rounded-xl bg-[#0A2F35] px-6 py-3 font-semibold text-white transition hover:bg-[#114A53]"
              >
                Copy to Clipboard
              </button>

              <button
                onClick={() => setShowPreview(false)}
                className="rounded-xl bg-gray-300 px-6 py-3 font-semibold hover:bg-gray-400"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </main>
  );
}