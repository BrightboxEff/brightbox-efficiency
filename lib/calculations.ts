/**
 * lib/calculations.ts
 * Turns solar generation + tariff data into payback period, ROI, and CO2 savings.
 */

import { resolveTariff, TariffInput } from "./tariff";

export interface PaybackInput {
  annualGenerationKwh: number;
  systemCostGbp: number; // total installed cost (panels + inverter + battery if any)
  batteryCapacityKwh?: number;
  tariff?: TariffInput;
}

export interface PaybackResult {
  annualSavingsGbp: number;
  annualExportIncomeGbp: number;
  totalAnnualBenefitGbp: number;
  paybackYears: number;
  tenYearSavingsGbp: number;
  twentyFiveYearSavingsGbp: number;
  annualCo2SavedKg: number;
  selfConsumptionRate: number;
}

// UK grid carbon intensity, kg CO2 per kWh (National Grid ESO, 2025/26 average)
const GRID_CARBON_INTENSITY_KG_PER_KWH = 0.207;

// Simple degradation assumption: panels lose ~0.5%/year output
const ANNUAL_PANEL_DEGRADATION = 0.005;

export function calculatePayback(input: PaybackInput): PaybackResult {
  const { annualGenerationKwh, systemCostGbp, batteryCapacityKwh } = input;

  const { unitRate, segRate, selfConsumption } = resolveTariff({
    ...input.tariff,
    hasBattery: (batteryCapacityKwh ?? 0) > 0 || input.tariff?.hasBattery,
  });

  const selfConsumedKwh = annualGenerationKwh * selfConsumption;
  const exportedKwh = annualGenerationKwh * (1 - selfConsumption);

  const annualSavingsGbp = (selfConsumedKwh * unitRate) / 100;
  const annualExportIncomeGbp = (exportedKwh * segRate) / 100;
  const totalAnnualBenefitGbp = annualSavingsGbp + annualExportIncomeGbp;

  const paybackYears =
    totalAnnualBenefitGbp > 0 ? systemCostGbp / totalAnnualBenefitGbp : Infinity;

  // Apply simple degradation when projecting multi-year totals
  const projectSavings = (years: number) => {
    let total = 0;
    let benefitThisYear = totalAnnualBenefitGbp;
    for (let y = 0; y < years; y++) {
      total += benefitThisYear;
      benefitThisYear *= 1 - ANNUAL_PANEL_DEGRADATION;
    }
    return Math.round(total);
  };

  const annualCo2SavedKg = annualGenerationKwh * GRID_CARBON_INTENSITY_KG_PER_KWH;

  return {
    annualSavingsGbp: round2(annualSavingsGbp),
    annualExportIncomeGbp: round2(annualExportIncomeGbp),
    totalAnnualBenefitGbp: round2(totalAnnualBenefitGbp),
    paybackYears: round2(paybackYears),
    tenYearSavingsGbp: projectSavings(10),
    twentyFiveYearSavingsGbp: projectSavings(25),
    annualCo2SavedKg: Math.round(annualCo2SavedKg),
    selfConsumptionRate: selfConsumption,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
