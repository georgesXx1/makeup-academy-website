"use client";

import { FormEvent, useEffect, useState } from "react";
import { BadgeCheck, Download, Search, ShieldCheck, XCircle } from "lucide-react";
import { downloadCertificatePng } from "@/lib/certificateDownload";

type Certificate = {
  studentName: string;
  courseName: string;
  issueDate: string;
  code: string;
};

export function VerifyClient({ initialCode }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode ?? "");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyCertificate(nextCode = code) {
    if (!nextCode.trim()) {
      setMessage("Please enter a certificate code.");
      setCertificate(null);
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch(`/api/certificates?code=${encodeURIComponent(nextCode.trim())}`);
    const data = await response.json();

    if (response.ok && data.verified) {
      setCertificate(data.certificate);
      setMessage("");
    } else {
      setCertificate(null);
      setMessage(data.message || "Certificate could not be verified.");
    }

    setLoading(false);
  }

  useEffect(() => {
    if (initialCode) {
      void verifyCertificate(initialCode);
    }
    // Run once for QR/pre-filled verification links.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void verifyCertificate();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={onSubmit} className="luxury-card rounded-[2rem] p-6 md:p-8">
        <label htmlFor="certificate-code" className="text-sm font-semibold text-[#51433f]">Certificate code</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="certificate-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="MAKEUP-2026-001"
            className="min-h-12 flex-1 rounded-full border border-[#b97866]/20 bg-white px-5 text-sm font-semibold uppercase tracking-[0.08em] outline-none transition focus:border-[#b97866] focus:ring-4 focus:ring-[#f7d9dc]"
          />
          <button type="submit" disabled={loading} className="shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#151313] px-6 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            <Search size={18} />
            {loading ? "Checking..." : "Verify"}
          </button>
        </div>
      </form>

      {certificate && (
        <section className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-white p-7 shadow-2xl shadow-emerald-900/5">
          <div className="flex items-center gap-3 text-emerald-700">
            <BadgeCheck />
            <span className="font-semibold">Status: Verified</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <VerifiedField label="Student name" value={certificate.studentName} />
            <VerifiedField label="Course name" value={certificate.courseName} />
            <VerifiedField label="Certificate code" value={certificate.code} />
            <VerifiedField label="Issue date" value={certificate.issueDate} />
          </div>
          <button
            type="button"
            onClick={() => void downloadCertificatePng(certificate)}
            className="shine mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#151313] px-6 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5"
          >
            <Download size={18} />
            Download certificate PNG
          </button>
        </section>
      )}

      {message && (
        <section className="mt-8 flex items-start gap-3 rounded-[1.5rem] border border-red-500/15 bg-white p-6 text-red-700 shadow-xl shadow-red-900/5">
          <XCircle className="mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </section>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-[1.5rem] bg-[#151313] p-5 text-[#f6ead7]">
        <ShieldCheck className="shrink-0 text-[#d9aa9a]" />
        <p className="text-sm leading-6">Official verification checks the academy certificate registry. QR codes on printed certificates should open this page with the certificate code in the URL.</p>
      </div>
    </div>
  );
}

function VerifiedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fbf7f1] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b97866]">{label}</p>
      <p className="mt-2 font-semibold text-[#151313]">{value}</p>
    </div>
  );
}
