"use client";

import dynamic from "next/dynamic";
import type { CalculateResponse, InstallerSettings } from "@/types";
import PdfDocument from "@/components/PdfDocument";

// @react-pdf/renderer's PDFDownloadLink touches browser-only APIs (Blob/URL)
// while generating the file, so it can't be rendered on the server.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <span className="inline-block rounded-md bg-moss/50 px-4 py-2.5 font-medium text-cream">
        Preparing PDF…
      </span>
    ),
  }
);

interface PdfDownloadButtonProps {
  result: CalculateResponse;
  installer: InstallerSettings;
}

export default function PdfDownloadButton({ result, installer }: PdfDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<PdfDocument result={result} installer={installer} />}
      fileName={`solar-payback-${result.location.postcode.replace(/\s+/g, "")}.pdf`}
      className="inline-block rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90"
    >
      {({ loading }: { loading: boolean }) => (loading ? "Preparing PDF…" : "Download branded PDF")}
    </PDFDownloadLink>
  );
}
