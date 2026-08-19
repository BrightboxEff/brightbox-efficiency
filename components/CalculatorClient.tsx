"use client";

import { useEffect, useState } from "react";
import CalculatorForm from "@/components/CalculatorForm";
import ResultsPanel from "@/components/ResultsPanel";
import GenerationChart from "@/components/GenerationChart";
import BreakevenChart from "@/components/BreakevenChart";
import InsightsPanel from "@/components/InsightsPanel";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import ConsultationRequest from "@/components/ConsultationRequest";
import {
  compareBatteryScenarios,
  computeBreakevenSeries,
  computeCo2Equivalences,
  checkRoofCapacity,
  type BatteryComparison,
  type BreakevenSeries,
  type RoofCheckResult,
} from "@/lib/insights";
import { getRoofType } from "@/lib/roofPresets";
import type { CalculateRequest, CalculateResponse, CalculatorFormValues, InstallerSettings } from "@/types";

interface CalculatorClientProps {
  installer: InstallerSettings;
}

// Default capacity used when modelling "what if we added a battery" for a
// quote that didn't include one — a common residential size.
const DEFAULT_BATTERY_KWH = 5;

async function callCalculate(input: CalculateRequest): Promise<CalculateResponse> {
  const res = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong running the calculation.");
  }

  return data;
}

export default function CalculatorClient({ installer }: CalculatorClientProps) {
  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [projectName, setProjectName] = useState<string | undefined>(undefined);
  const [addressLine, setAddressLine] = useState<string | undefined>(undefined);
  const [systemSizeKwp, setSystemSizeKwp] = useState(0);
  const [systemCostGbp, setSystemCostGbp] = useState(0);
  const [batteryComparison, setBatteryComparison] = useState<BatteryComparison | null>(null);
  const [roofCheck, setRoofCheck] = useState<RoofCheckResult | null>(null);
  const [breakeven, setBreakeven] = useState<BreakevenSeries | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultationStatus, setConsultationStatus] = useState<"success" | "cancelled" | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("consultation");
    if (status === "success" || status === "cancelled") {
      setConsultationStatus(status);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  async function handleSubmit(input: CalculatorFormValues) {
    setLoading(true);
    setError(null);
    setResult(null);
    setProjectName(undefined);
    setAddressLine(undefined);
    setBatteryComparison(null);
    setRoofCheck(null);
    setBreakeven(null);

    const {
      batteryCostGbp,
      roofType,
      projectName: submittedProjectName,
      addressLine: submittedAddressLine,
      ...apiInput
    } = input;

    try {
      const primary = await callCalculate(apiInput);
      setResult(primary);
      setProjectName(submittedProjectName);
      setAddressLine(submittedAddressLine);
      setSystemSizeKwp(apiInput.systemSizeKwp);
      setSystemCostGbp(apiInput.systemCostGbp);
      setBreakeven(computeBreakevenSeries(apiInput.systemCostGbp, primary.payback.totalAnnualBenefitGbp));

      if (apiInput.roofSizeM2) {
        const usableM2PerKwp = getRoofType(roofType).usableM2PerKwp;
        setRoofCheck({
          ...checkRoofCapacity(apiInput.roofSizeM2, apiInput.systemSizeKwp, usableM2PerKwp),
          roofSizeM2: apiInput.roofSizeM2,
          systemSizeKwp: apiInput.systemSizeKwp,
          usableM2PerKwp,
        });
      }

      const hasBattery = (apiInput.batteryCapacityKwh ?? 0) > 0;

      if (hasBattery) {
        // Isolate the battery's contribution: same system, no battery.
        const withoutBatteryCost = batteryCostGbp
          ? apiInput.systemCostGbp - batteryCostGbp
          : apiInput.systemCostGbp;
        const withoutBattery = await callCalculate({
          ...apiInput,
          systemCostGbp: withoutBatteryCost,
          batteryCapacityKwh: undefined,
        });
        setBatteryComparison(compareBatteryScenarios(primary, withoutBattery, batteryCostGbp));
      } else if (batteryCostGbp) {
        // No battery quoted, but a hypothetical cost was given — model adding one.
        const withBattery = await callCalculate({
          ...apiInput,
          systemCostGbp: apiInput.systemCostGbp + batteryCostGbp,
          batteryCapacityKwh: DEFAULT_BATTERY_KWH,
        });
        setBatteryComparison(compareBatteryScenarios(withBattery, primary, batteryCostGbp));
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong running the calculation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {consultationStatus === "success" && (
        <p className="mb-4 rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
          Thanks — your consultation request is booked. A member of the Brightbox team will be in
          touch to schedule your call.
        </p>
      )}
      {consultationStatus === "cancelled" && (
        <p className="mb-4 rounded-md border border-border-muted bg-cream px-4 py-3 text-sm text-charcoal/70">
          Consultation payment was cancelled — no charge was made.
        </p>
      )}

      <CalculatorForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <>
          <ResultsPanel result={result} projectName={projectName} addressLine={addressLine} />
          <GenerationChart monthlyGenerationKwh={result.solar.monthlyGenerationKwh} />
          {breakeven && <BreakevenChart series={breakeven} />}
          <InsightsPanel
            batteryComparison={batteryComparison}
            roofCheck={roofCheck}
            co2={computeCo2Equivalences(result.payback.annualCo2SavedKg)}
          />
          <div className="mt-6">
            <PdfDownloadButton
              result={result}
              installer={installer}
              batteryComparison={batteryComparison}
              roofCheck={roofCheck}
              projectName={projectName}
              addressLine={addressLine}
            />
          </div>

          <ConsultationRequest
            postcode={result.location.postcode}
            projectName={projectName}
            addressLine={addressLine}
            systemSizeKwp={systemSizeKwp}
            systemCostGbp={systemCostGbp}
            result={result}
          />
        </>
      )}
    </div>
  );
}
