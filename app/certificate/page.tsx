import Link from "next/link";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { CertificateTemplate } from "@/components/CertificateTemplate";
import { CertificateActions } from "./CertificateActions";
import { findCertificate } from "@/lib/certificates";

type CertificatePageProps = {
  searchParams: Promise<{ code?: string }>;
};

export default async function CertificatePage({ searchParams }: CertificatePageProps) {
  const { code = "" } = await searchParams;
  const certificate = code ? await findCertificate(code) : null;
  const baseUrl = await getBaseUrl();

  if (!certificate) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#b97866]">Certificate preview</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-[#151313]">Certificate not found</h1>
        <p className="mt-4 leading-7 text-[#6c5851]">Open this page with a valid certificate code to preview and print the EB Academy certificate.</p>
        <Link href="/verify" className="shine mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#151313] px-6 text-sm font-semibold text-[#f6ead7]">
          Go to verification
        </Link>
      </main>
    );
  }

  const verifyUrl = buildVerifyUrl(baseUrl, certificate.code);
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    color: {
      dark: "#151313",
      light: "#ffffff",
    },
    errorCorrectionLevel: "H",
    margin: 1,
    scale: 8,
  });

  return (
    <main className="certificate-preview min-h-screen px-4 py-6">
      <div className="certificate-actions mx-auto mb-5 flex max-w-6xl items-center justify-between gap-3">
        <Link href="/admin" className="text-sm font-semibold text-[#6c5851] transition hover:text-[#151313]">Back to admin</Link>
        <CertificateActions code={certificate.code} studentName={certificate.studentName} />
      </div>
      <CertificateTemplate certificate={certificate} baseUrl={baseUrl} qrCodeDataUrl={qrCodeDataUrl} />
    </main>
  );
}

async function getBaseUrl() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return host ? `${protocol}://${host}` : "";
}

function buildVerifyUrl(baseUrl: string, code: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  return `${normalizedBaseUrl}/verify?code=${encodeURIComponent(code)}`;
}
