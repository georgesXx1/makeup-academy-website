"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { toBlob } from "html-to-image";

const A4_LANDSCAPE_WIDTH = 3508;
const A4_LANDSCAPE_HEIGHT = 2480;
const CERTIFICATE_PREVIEW_WIDTH = 1200;
const CERTIFICATE_PREVIEW_HEIGHT = 848.35;

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
      await waitForImages(certificate);

      const blob = await toBlob(certificate, {
        backgroundColor: "#fbf7ec",
        canvasHeight: A4_LANDSCAPE_HEIGHT,
        canvasWidth: A4_LANDSCAPE_WIDTH,
        cacheBust: true,
        height: CERTIFICATE_PREVIEW_HEIGHT,
        pixelRatio: 1,
        skipAutoScale: true,
        skipFonts: false,
        style: {
          boxShadow: "none",
          height: `${CERTIFICATE_PREVIEW_HEIGHT}px`,
          margin: "0",
          width: `${CERTIFICATE_PREVIEW_WIDTH}px`,
        },
        width: CERTIFICATE_PREVIEW_WIDTH,
      });

      if (!blob) {
        throw new Error("Could not prepare certificate image.");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeFilename(code || studentName || "certificate")}-a4-landscape.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
