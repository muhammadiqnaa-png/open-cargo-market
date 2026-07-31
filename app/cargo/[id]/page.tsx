import Link from "next/link";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CargoDetail({ params }: Props) {
  const { id } = await params;

  const res = await fetch("http://localhost:3000/api/cargo", {
    cache: "no-store",
  });

  const cargo = await res.json();

  const item = cargo.find((c: any) => c.ID === id);

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Cargo Tidak Ditemukan</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            🚢 OPEN CARGO
          </h1>

          <span className="bg-green-500 text-white px-4 py-2 rounded-full">
            {item.STATUS}
          </span>

        </div>

        <hr className="my-6"/>

        <div className="space-y-4 text-lg">

          <p><strong>Cargo :</strong> {item.CARGO}</p>

          <p><strong>Size :</strong> {item.SIZE}</p>

          <p><strong>Area :</strong> {item.AREA}</p>

          <p><strong>POL :</strong> {item.POL}</p>

          <p><strong>POD :</strong> {item.POD}</p>

          <p><strong>Distance :</strong> {item.DISTANCE}</p>

          <p><strong>Route :</strong> {item.ROUTE}</p>

          <p><strong>Detail :</strong></p>

          <div className="rounded-xl bg-gray-100 p-4 whitespace-pre-line">
            {item.DETAIL}
          </div>

          <Link
            href={`https://wa.me/${item.INQUIRY}?text=${encodeURIComponent(
          `Hello,

          I'm interested in the following cargo.

          Cargo : ${item.CARGO}
          Size : ${item.SIZE}
          POL : ${item.POL}
          POD : ${item.POD}

          Can you provide more information?

          Thank you.`
            )}`}
            target="_blank"
            className="mt-8 block w-full rounded-xl bg-green-600 py-4 text-center text-lg font-semibold text-white hover:bg-green-700"
          >
            📩 Inquiry via WhatsApp
          </Link>

        </div>

      </div>

    </main>
  );
}