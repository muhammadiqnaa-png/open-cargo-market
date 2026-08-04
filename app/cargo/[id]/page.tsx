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

  const item = cargo.find((c: any) => c.ID === id);

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Cargo Tidak Ditemukan</h1>
      </main>
    );
  }

  const whatsappMessage = encodeURIComponent(`Hello,

  I'm interested in the following cargo:

  ━━━━━━━━━━━━━
  Size      : ${item.SIZE}
  Cargo     : ${item.CARGO}
  Route     : ${item.POL} → ${item.POD}
  Laycan    : ${item.LAYCAN}
  ━━━━━━━━━━━━━━

  Please send me:

  • Freight Offer
  • Payment Terms
  • Cargo Availability

  Thank you.`);

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">

      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-block text-blue-600 font-semibold hover:underline"
        >
          ← Back to Cargo List
        </Link>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-lg border border-gray-200 p-8">

          {/* Header */}
          <div className="space-y-3">

            <p>
              <span className="font-semibold">📋 Status :</span>{" "}
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 font-semibold">
                {item.STATUS}
              </span>
            </p>

            <p>
              <strong>🌍 Area :</strong> {item.AREA}
            </p>

            <p>
              <strong>📍 Route :</strong> {item.POL} → {item.POD}
            </p>

          </div>

          <hr className="my-6" />

          {/* Information */}
          <h2 className="mb-5 text-xl font-bold">
            📊 INFORMATION
          </h2>

          <div className="space-y-4">

            <p>
              <strong>🚢 Cargo :</strong> {item.CARGO} ({item.SIZE})
            </p>

            <p>
              <strong>📍 POL :</strong> {item.POL}
            </p>

            <p>
              <strong>📍 POD :</strong> {item.POD}
            </p>

            <p>
              <strong>📏 Distance :</strong> {item.DISTANCE}
            </p>

            <p>
              <strong>📅 Laycan :</strong> {item.LAYCAN}
            </p>

            <p>
              <strong>💰 Freight :</strong>{" "}
              <span className="text-blue-600 font-semibold">
                Contact via WhatsApp
              </span>
            </p>

          </div>

          <hr className="my-6" />

          {/* Description */}
          <h2 className="mb-4 text-xl font-bold">
            📝 DESCRIPTION
          </h2>

          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 whitespace-pre-line leading-7">
            {item.DETAIL}
          </div>

          {/* Button */}
          <Link
            href={`https://wa.me/${item.INQUIRY}?text=${whatsappMessage}`}
            target="_blank"
            className="mt-8 block w-full rounded-xl bg-green-600 py-4 text-center text-lg font-semibold text-white transition hover:bg-green-700"
          >
            📲 Inquiry via WhatsApp
          </Link>

        </div>

      </div>

    </main>
  );
}