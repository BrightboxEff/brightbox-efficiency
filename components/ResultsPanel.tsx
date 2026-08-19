import type { CalculateResponse } from "@/types";

interface ResultsPanelProps {
  result: CalculateResponse;
  projectName?: string;
  addressLine?: string;
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-border-muted bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${highlight ? "text-gold" : "text-moss"}`}>
        {value}
      </p>
    </div>
  );
}

const gbp = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default function ResultsPanel({ result, projectName, addressLine }: ResultsPanelProps) {
  const { payback, solar, location } = result;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-charcoal">
        {projectName ? `${projectName} — ` : ""}
        Results for {addressLine || location.postcode} ({location.region})
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Payback period"
          value={
            Number.isFinite(payback.paybackYears) ? `${payback.paybackYears} yrs` : "N/A"
          }
          highlight
        />
        <Stat label="Annual generation" value={`${solar.annualGenerationKwh.toLocaleString()} kWh`} />
        <Stat label="Annual savings" value={gbp(payback.annualSavingsGbp)} />
        <Stat label="Annual export income" value={gbp(payback.annualExportIncomeGbp)} />
        <Stat label="Total annual benefit" value={gbp(payback.totalAnnualBenefitGbp)} />
        <Stat label="10-year savings" value={gbp(payback.tenYearSavingsGbp)} />
        <Stat label="25-year savings" value={gbp(payback.twentyFiveYearSavingsGbp)} />
        <Stat label="CO₂ saved / year" value={`${payback.annualCo2SavedKg.toLocaleString()} kg`} />
      </div>

      <p className="mt-4 text-sm text-charcoal/60">
        Assumes {Math.round(payback.selfConsumptionRate * 100)}% self-consumption of generated
        electricity.
      </p>
    </div>
  );
}
