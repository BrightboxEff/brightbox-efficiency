/**
 * lib/performance.ts
 * Compares actual solar generation readings against a system's stored
 * PVGIS-derived baseline (monitored_systems.monthly_baseline_kwh), flags
 * meaningful underperformance, and suggests a likely cause based on the
 * pattern of deviation.
 *
 * This is intentionally NOT a trained ML model — it's a transparent,
 * maintainable statistical check. Cheap to run, nothing to retrain,
 * and easy to explain to a customer on the phone.
 */

export type FlagStatus = "healthy" | "watch" | "alert";

export interface MonthlyReading {
  month: number; // 1-12
  actualKwh: number;
  expectedKwh: number; // looked up from the system's stored baseline
}

export interface PerformanceCheckInput {
  readings: MonthlyReading[]; // most recent readings, chronological order
  alertThresholdPercent?: number; // default 15
  consecutiveMonthsForAlert?: number; // default 2
}

export interface MonthlyResult extends MonthlyReading {
  deviationPercent: number; // negative = underperforming
}

export interface PerformanceCheckResult {
  monthlyResults: MonthlyResult[];
  currentStatus: FlagStatus;
  likelyCause: string | null;
  summary: string;
}

export function checkPerformance(input: PerformanceCheckInput): PerformanceCheckResult {
  const { readings, alertThresholdPercent = 15, consecutiveMonthsForAlert = 2 } = input;

  if (readings.length === 0) {
    return {
      monthlyResults: [],
      currentStatus: "healthy",
      likelyCause: null,
      summary: "No readings logged yet.",
    };
  }

  const monthlyResults: MonthlyResult[] = readings.map((r) => {
    const deviationPercent =
      r.expectedKwh > 0 ? ((r.actualKwh - r.expectedKwh) / r.expectedKwh) * 100 : 0;
    return { ...r, deviationPercent: round1(deviationPercent) };
  });

  // Check how many of the most recent consecutive months are below threshold
  const recentUnderperforming = monthlyResults
    .slice(-consecutiveMonthsForAlert)
    .every((r) => r.deviationPercent <= -alertThresholdPercent);

  const singleMonthWatch =
    monthlyResults[monthlyResults.length - 1].deviationPercent <= -(alertThresholdPercent * 0.6);

  let currentStatus: FlagStatus = "healthy";
  if (recentUnderperforming) {
    currentStatus = "alert";
  } else if (singleMonthWatch) {
    currentStatus = "watch";
  }

  const likelyCause = currentStatus === "healthy" ? null : inferLikelyCause(monthlyResults);

  const latest = monthlyResults[monthlyResults.length - 1];
  const summary =
    currentStatus === "healthy"
      ? `System performing within expected range (${latest.deviationPercent >= 0 ? "+" : ""}${latest.deviationPercent}% vs. baseline this month).`
      : `System is ${Math.abs(latest.deviationPercent)}% below expected generation this month. ${
          currentStatus === "alert"
            ? "This has now persisted across multiple months — worth a site check."
            : "Worth keeping an eye on next month's reading."
        }`;

  return { monthlyResults, currentStatus, likelyCause, summary };
}

function inferLikelyCause(results: MonthlyResult[]): string {
  const recent = results.slice(-3);

  const isGradualDecline =
    recent.length >= 3 &&
    recent[0].deviationPercent > recent[1].deviationPercent &&
    recent[1].deviationPercent > recent[2].deviationPercent;

  const isSuddenDrop =
    recent.length >= 2 &&
    recent[recent.length - 2].deviationPercent > -5 &&
    recent[recent.length - 1].deviationPercent <= -15;

  if (isSuddenDrop) {
    return "Sudden drop suggests a possible inverter fault, tripped isolator, or new shading (e.g. tree growth, a new nearby structure). Recommend a site visit or asking the customer to check their inverter app for fault codes.";
  }

  if (isGradualDecline) {
    return "Gradual decline over several months is often panel soiling (dust, pollen, bird mess) or early-stage degradation. Recommend a panel clean before assuming a hardware fault.";
  }

  return "Underperformance detected without a clear pattern yet — recommend one more month of data before diagnosing a cause.";
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
