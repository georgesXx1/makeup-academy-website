import { VerifyClient } from "./VerifyClient";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;

  return (
    <main className="px-5 py-20 lg:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#b97866]">Certificate verification</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-[#151313]">Verify an EB Academy certificate</h1>
        <p className="mt-5 leading-8 text-[#6c5851]">Enter the certificate code exactly as shown, or scan the QR code printed on a certificate to check its official status.</p>
      </div>
      <VerifyClient initialCode={params.code} />
    </main>
  );
}
