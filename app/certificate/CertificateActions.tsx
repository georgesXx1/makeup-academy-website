"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { toPng } from "html-to-image";

const A4_LANDSCAPE_WIDTH = 3508;

type CertificateActionsProps = {
  code: string;
  studentName: string;
};

export function CertificateActions({ code, studentName }: CertificateActionsProps) {
  const [downloading, setDownloading] = useState(false);

  async function downloadA4Png() {
    const certificate = document.querySelector<HTMLElement>("[data-certificate-template]");

    if (!certificate || downloading) return;

    setDownloading(true);

    try {
      await document.fonts.ready;
      const rect = certificate.getBoundingClientRect();
      await waitForImages(certificate);

      const dataUrl = await toPng(certificate, {
        backgroundColor: "#fbf7ec",
        cacheBust: true,
        pixelRatio: A4_LANDSCAPE_WIDTH / rect.width,
        skipFonts: false,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${safeFilename(code || studentName || "certificate")}-a4-landscape.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-3">
      <button
        type="button"
        className="shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#151313]/10 bg-white px-6 text-sm font-semibold text-[#151313] transition hover:-translate-y-0.5"
        onClick={() => window.print()}
      >
        <Printer size={18} />
        Print
      </button>
      <button
        type="button"
        className="shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#151313] px-6 text-sm font-semibold text-[#f6ead7] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => void downloadA4Png()}
        disabled={downloading}
      >
        <Download size={18} />
        {downloading ? "Preparing..." : "Download A4 PNG"}
      </button>
    </div>
  );
}

async function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    }),
  );
}

function safeFilename(value: string) {
  return value.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, "").replace(/\s+/g, "-") || "certificate";
}
