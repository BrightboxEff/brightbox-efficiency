"use client";

import { useState } from "react";
import type { CalculateResponse } from "@/types";

interface ConsultationRequestProps {
  postcode: string;
  projectName?: string;
  addressLine?: string;
  systemSizeKwp: number;
  systemCostGbp: number;
  result: CalculateResponse;
}

export default function ConsultationRequest({
  postcode,
  projectName,
  addressLine,
  systemSizeKwp,
  systemCostGbp,
  result,
}: ConsultationRequestProps) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postcode,
          projectName,
          addressLine,
          summary: {
            paybackYears: result.payback.paybackYears,
            annualGenerationKwh: result.solar.annualGenerationKwh,
            totalAnnualBenefitGbp: result.payback.totalAnnualBenefitGbp,
            systemSizeKwp,
            systemCostGbp,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-charcoal">Want a second opinion?</h2>
      <p className="mt-1 text-sm text-charcoal/70">
        Book a 1-hour consultation call with a member of the Brightbox team to talk through these
        results — £40.
      </p>

      <label className="mt-4 flex items-start gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-moss"
        />
        I&apos;d like to request a paid consultation call about this quote.
      </label>

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <button
        type="button"
        onClick={handleRequest}
        disabled={!checked || loading}
        className="mt-4 rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Redirecting to payment…" : "Continue to payment — £40"}
      </button>
    </div>
  );
}
