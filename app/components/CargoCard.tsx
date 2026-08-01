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
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md">

      <div className="grid grid-cols-12 items-center gap-4">

        {/* Cargo */}
        <div className="col-span-3 text-center">
          <p className="text-lg font-bold text-gray-800">
            {item.CARGO}
          </p>
        </div>

        {/* Route */}
        <div className="col-span-5">
          <p className="text-gray-700 font-medium">
            {item.POL} <span className="mx-2">→</span> {item.POD}
          </p>
        </div>

        {/* Size */}
        <div className="col-span-2 text-center">
          <span className="rounded-lg bg-blue-100 px-3 py-2 font-semibold text-blue-700">
            {item.SIZE}
          </span>
        </div>

        {/* Detail */}
        <div className="col-span-2 text-center">
          <Link
            href={`/cargo/${item.ID}`}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Detail
          </Link>
        </div>

      </div>

    </div>
  );
}