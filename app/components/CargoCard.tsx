import Link from "next/link";
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

type Props = {
  item: Cargo;
};

export default function CargoCard({ item }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">

      <div className="bg-blue-700 text-white px-5 py-3 flex justify-between items-center">
        <span className="font-semibold">{item.STATUS}</span>
        <span className="font-bold">{item.SIZE}</span>
      </div>

      <div className="p-5">

        <h2 className="text-2xl font-bold text-gray-800">
          {item.CARGO}
        </h2>

        <div className="mt-5 space-y-2 text-gray-600">

          <p>📍 <strong>POL</strong> : {item.POL}</p>

          <div className="text-center text-2xl">
            ↓
          </div>

          <p>📍 <strong>POD</strong> : {item.POD}</p>

          <hr />

          <p>📐 {item.DISTANCE}</p>

          <p>🌍 {item.AREA}</p>

        </div>

        <Link
            href={`/cargo/${item.ID}`}
            className="mt-6 block w-full rounded-xl bg-blue-700 py-3 text-center text-white font-semibold hover:bg-blue-800 transition"
        >
            🔍 View Detail
        </Link>

      </div>

    </div>
  );
}