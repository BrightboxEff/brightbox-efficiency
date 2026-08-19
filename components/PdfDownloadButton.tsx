"use client";

import { useState } from "react";
import type { CalculateResponse, InstallerSettings } from "@/types";
import type { BatteryComparison, RoofCheckResult } from "@/lib/insights";

interface PdfDownloadButtonProps {
  result: CalculateResponse;
  installer: InstallerSettings;
  batteryComparison: BatteryComparison | null;
  roofCheck: RoofCheckResult | null;
  projectName?: string;
  addressLine?: string;
}

export default function PdfDownloadButton({
  result,
  installer,
  batteryComparison,
  roofCheck,
  projectName,
  addressLine,
}: PdfDownloadButtonProps) {
  const [generating, setGenerating] = useState(false);

  // Neither @react-pdf/renderer nor PdfDocument (which imports it) can be a
  // *static* import anywhere in a "use client" file reachable from a Server
  // Component — Next's client-reference compilation resolves the package to
  // a broken variant in that case, crashing the whole route with "Element
  // type is invalid". Both imports must be fully dynamic, resolved only at
  // click time in the browser, never part of any static module graph.
  async function handleDownload() {
    setGenerating(true);
    try {
      const [{ pdf }, { default: PdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/PdfDocument"),
      ]);

      const blob = await pdf(
        <PdfDocument
          result={result}
          installer={installer}
          batteryComparison={batteryComparison}
          roofCheck={roofCheck}
          projectName={projectName}
          addressLine={addressLine}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `solar-payback-${(projectName || result.location.postcode).replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={generating}
      className="inline-block rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:opacity-60"
    >
      {generating ? "Preparing PDF…" : "Download branded PDF"}
    </button>
  );
}
