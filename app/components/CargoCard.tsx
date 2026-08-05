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
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Header Biru */}
      <div className="h-2 rounded-t-2xl bg-[#0F4C81]"></div>

      <div className="p-6">

        {/* Size */}
        <div className="text-center">
          <span className="rounded-full bg-[#0F4C81] px-5 py-2 text-sm font-bold tracking-wider text-white">
            {item.SIZE}
          </span>
        </div>

        {/* Cargo */}
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-wide text-gray-800">
          {item.CARGO.toUpperCase()}
        </h2>

        {/* Route */}
        <div className="mt-8 flex flex-col items-center">

          <p className="text-lg font-semibold text-gray-700">
            {item.POL}
          </p>

          <div className="my-2 flex flex-col items-center text-blue-600 leading-none">
            <span>│</span>
            <span className="text-xl">▼</span>
            <span>│</span>
          </div>

          <p className="text-lg font-semibold text-gray-700">
            {item.POD}
          </p>

        </div>

        <hr className="my-6" />

        <Link
          href={`/cargo/${item.ID}`}
          className="block w-full rounded-xl bg-[#0F4C81] py-3 text-center font-semibold text-white transition duration-300 hover:bg-[#0B3D68]"
        >
          View Detail
        </Link>

      </div>

    </div>
  );
}