"use client";

import { useState } from "react";
import CalculatorForm from "@/components/CalculatorForm";
import ResultsPanel from "@/components/ResultsPanel";
import GenerationChart from "@/components/GenerationChart";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import type { CalculateRequest, CalculateResponse, InstallerSettings } from "@/types";

interface CalculatorClientProps {
  installer: InstallerSettings;
}

export default function CalculatorClient({ installer }: CalculatorClientProps) {
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: CalculateRequest) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong running the calculation.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong running the calculation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <CalculatorForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <>
          <ResultsPanel result={result} />
          <GenerationChart monthlyGenerationKwh={result.solar.monthlyGenerationKwh} />
          <div className="mt-6">
            <PdfDownloadButton result={result} installer={installer} />
          </div>
        </>
      )}
    </div>
  );
}
