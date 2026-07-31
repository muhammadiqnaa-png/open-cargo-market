import Link from "next/link";
import { getCargoData } from "../../lib/googleSheet";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CargoDetail({ params }: Props) {
  const { id } = await params;

  const cargo = await getCargoData();

  const item = cargo.find((c) => c.ID === id);

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Cargo Tidak Ditemukan
        </h1>
      </main>
    );
  }

  const whatsappMessage = encodeURIComponent(`Hello,

I'm interested in the following cargo.

Cargo : ${item.CARGO}
Size : ${item.SIZE}
POL : ${item.POL}
POD : ${item.POD}

Can you provide more information?

Thank you.`);

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            🚢 OPEN CARGO
          </h1>

          <span className="bg-green-600 text-white px-4 py-2 rounded-full">
            {item.STATUS}
          </span>

        </div>

        <hr className="mb-6"/>

        <div className="space-y-4 text-lg">

          <p><strong>🚢 Cargo :</strong> {item.CARGO}</p>

          <p><strong>📏 Size :</strong> {item.SIZE}</p>

          <p><strong>🌍 Area :</strong> {item.AREA}</p>

          <p><strong>📍 POL :</strong> {item.POL}</p>

          <p><strong>📍 POD :</strong> {item.POD}</p>

          <p><strong>📐 Distance :</strong> {item.DISTANCE}</p>

          <p><strong>🛣 Route :</strong> {item.ROUTE}</p>

          <div>
            <strong>📄 Detail :</strong>

            <div className="mt-2 rounded-xl bg-gray-100 p-4 whitespace-pre-line">
              {item.DETAIL}
            </div>
          </div>

          <Link
            href={`https://wa.me/${item.INQUIRY}?text=${whatsappMessage}`}
            target="_blank"
            className="block w-full rounded-xl bg-green-600 py-4 text-center text-lg font-semibold text-white hover:bg-green-700"
          >
            📩 Inquiry via WhatsApp
          </Link>

          <Link
            href="/"
            className="block w-full rounded-xl bg-blue-600 py-4 text-center text-lg font-semibold text-white hover:bg-blue-700"
          >
            ← Kembali ke Home
          </Link>

        </div>

      </div>

    </main>
  );
}