"use client";

import { useState } from "react";
import Link from "next/link";

interface QuickEstimateResult {
  region: string;
  annualGenerationKwh: number;
  totalAnnualBenefitGbp: number;
  paybackYears: number | null;
}

export default function QuickEstimateWidget() {
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuickEstimateResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/quick-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-cream/30 bg-charcoal/70 p-5">
      <p className="text-sm font-medium text-cream">
        See a rough solar payback estimate for your postcode — no signup.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="e.g. SW1A 1AA"
          required
          className="min-w-0 flex-1 rounded-md border border-cream/40 bg-cream/95 px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-gold px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60"
        >
          {loading ? "Checking…" : "Estimate"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-200">{error}</p>}

      {result && (
        <div className="mt-4 rounded-lg bg-cream/95 p-4 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal/50">
            Rough estimate for {result.region} · typical 4kWp system
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-semibold text-moss">
                {result.annualGenerationKwh.toLocaleString()}
              </p>
              <p className="text-[11px] text-charcoal/60">kWh/year</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-moss">
                £{result.totalAnnualBenefitGbp.toLocaleString()}
              </p>
              <p className="text-[11px] text-charcoal/60">est. annual benefit</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-moss">
                {result.paybackYears ? `${result.paybackYears}y` : "—"}
              </p>
              <p className="text-[11px] text-charcoal/60">rough payback</p>
            </div>
          </div>
          <Link
            href="/signup"
            className="mt-3 block rounded-md bg-moss px-3 py-2 text-center text-sm font-medium text-cream transition hover:bg-moss/90"
          >
            Get your exact figures — free trial →
          </Link>
        </div>
      )}
    </div>
  );
}
