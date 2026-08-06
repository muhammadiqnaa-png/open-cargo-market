"use client";

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
  FROM?: string;
};

type Props = {
  item: Cargo;
  checked: boolean;
  onCheck: (id: string) => void;
};

export default function InternalCargoCard({
  item,
  checked,
  onCheck,
}: Props) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        checked
          ? "border-[#0A2F35] ring-2 ring-[#D9EEF1]"
          : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

            <input
            type="checkbox"
            checked={checked}
            onChange={() => onCheck(item.ID)}
            className="h-5 w-5 accent-[#0A2F35]"
            />

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {item.FROM || "-"}
            </span>

        </div>

        <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
                item.STATUS === "OPEN"
                ? "bg-[#D9EEF1] text-[#0A2F35]"
                : "bg-gray-200 text-gray-700"
            }`}
        >
            {item.STATUS}
        </span>

    </div>
      {/* Size */}
      <div className="text-center">

        <span className="rounded-full bg-[#0A2F35] px-4 py-2 text-sm font-bold text-white">
          {item.SIZE}
        </span>

        <h2 className="mt-5 text-3xl font-bold text-[#0A2F35]">
          {item.CARGO}
        </h2>

      </div>

      {/* Route */}
      <div className="mt-8 text-center">

        <p className="font-semibold text-slate-800">
          {item.POL}
        </p>

        <div className="my-3 text-2xl text-[#0A2F35]">
          ↓
        </div>

        <p className="font-semibold text-slate-800">
          {item.POD}
        </p>

      </div>

      {/* Detail */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">

        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-sm text-gray-500">
            Laycan
          </span>

          <span className="text-sm font-semibold text-slate-800">
            {item.LAYCAN || "-"}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">

          <span className="text-sm text-gray-500">
            Freight
          </span>

          <span className="text-lg font-bold text-[#0A2F35]">
            {item.FREIGHT || "-"}
          </span>

        </div>

      </div>
    </div>
  );
}