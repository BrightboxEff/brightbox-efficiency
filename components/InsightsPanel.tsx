import type { BatteryComparison, Co2Equivalences, RoofCheckResult } from "@/lib/insights";

interface InsightsPanelProps {
  batteryComparison: BatteryComparison | null;
  roofCheck: RoofCheckResult | null;
  co2: Co2Equivalences;
}

const gbp = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default function InsightsPanel({ batteryComparison, roofCheck, co2 }: InsightsPanelProps) {
  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold text-charcoal">Installer insights</h2>

      {batteryComparison && (
        <div className="rounded-lg border border-border-muted bg-white p-6 shadow-sm">
          <h3 className="font-medium text-charcoal">Is the battery worth it?</h3>
          <p className="mt-1 text-sm text-charcoal/70">
            Comparing self-consumption with a battery ({Math.round(batteryComparison.withBattery.payback.selfConsumptionRate * 100)}%) against
            without ({Math.round(batteryComparison.withoutBattery.payback.selfConsumptionRate * 100)}%).
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-border-muted bg-cream p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
                Extra annual benefit from battery
              </p>
              <p className="mt-1 text-2xl font-semibold text-moss">
                {gbp(batteryComparison.incrementalAnnualBenefitGbp)}
              </p>
            </div>
            <div className="rounded-md border border-border-muted bg-cream p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
                Battery-specific payback
              </p>
              <p className="mt-1 text-2xl font-semibold text-gold">
                {batteryComparison.batteryPaybackYears
                  ? `${batteryComparison.batteryPaybackYears} yrs`
                  : "Add battery cost above"}
              </p>
            </div>
          </div>
          {!batteryComparison.batteryCostGbp && (
            <p className="mt-3 text-xs text-charcoal/50">
              This compares the same total system cost with and without a battery — enter a
              battery cost on the form to see whether the battery pays for itself on its own.
            </p>
          )}
        </div>
      )}

      {roofCheck && roofCheck.isOverCapacity && (
        <div className="rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-charcoal">
          <span className="font-medium">Roof capacity check:</span> a {roofCheck.systemSizeKwp}kWp
          system is larger than the ~{roofCheck.maxViableKwp}kWp this roof size typically
          supports (rule of thumb: ~{roofCheck.usableM2PerKwp}m² of usable roof per kWp for this
          roof shape). Worth confirming the usable roof area during survey before quoting.
        </div>
      )}

      <div className="rounded-lg border border-border-muted bg-white p-6 shadow-sm">
        <h3 className="font-medium text-charcoal">What the CO₂ savings mean</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border-muted bg-cream p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
              Equivalent to planting
            </p>
            <p className="mt-1 text-2xl font-semibold text-moss">
              {co2.treesPlantedPerYear.toLocaleString()} trees/yr
            </p>
          </div>
          <div className="rounded-md border border-border-muted bg-cream p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
              Equivalent to not driving
            </p>
            <p className="mt-1 text-2xl font-semibold text-moss">
              {co2.milesNotDrivenPerYear.toLocaleString()} miles/yr
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-charcoal/50">
          Approximate, illustrative comparisons — not precise carbon accounting.
        </p>
      </div>
    </div>
  );
}
