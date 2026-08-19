/**
 * lib/insights.ts
 * Presentation-layer analysis built on top of /api/calculate's output.
 * Pure client-side helpers — none of this touches the backend calculation
 * files, it just derives extra installer-facing insight from what the API
 * already returns (plus, for the roof/CO2 estimates, well-known rule-of-thumb
 * conversion factors that are clearly labelled as approximate).
 */

import type { CalculateResponse } from "@/types";

// Mirrors the 0.5%/year panel degradation assumption documented in
// lib/calculations.ts, so the breakeven chart matches the API's own
// 10/25-year totals.
const ANNUAL_PANEL_DEGRADATION = 0.005;

export interface BatteryComparison {
  withBattery: CalculateResponse;
  withoutBattery: CalculateResponse;
  incrementalAnnualBenefitGbp: number;
  batteryCostGbp?: number;
  batteryPaybackYears?: number;
}

export function compareBatteryScenarios(
  withBattery: CalculateResponse,
  withoutBattery: CalculateResponse,
  batteryCostGbp?: number
): BatteryComparison {
  const incrementalAnnualBenefitGbp =
    withBattery.payback.totalAnnualBenefitGbp - withoutBattery.payback.totalAnnualBenefitGbp;

  return {
    withBattery,
    withoutBattery,
    incrementalAnnualBenefitGbp,
    batteryCostGbp,
    batteryPaybackYears:
      batteryCostGbp && incrementalAnnualBenefitGbp > 0
        ? Math.round((batteryCostGbp / incrementalAnnualBenefitGbp) * 100) / 100
        : undefined,
  };
}

export interface BreakevenPoint {
  year: number;
  cumulativeNetGbp: number;
}

export interface BreakevenSeries {
  points: BreakevenPoint[];
  breakevenYear: number | null; // interpolated fractional year, null if never breaks even
}

export function computeBreakevenSeries(
  systemCostGbp: number,
  totalAnnualBenefitGbp: number,
  years = 25
): BreakevenSeries {
  const points: BreakevenPoint[] = [{ year: 0, cumulativeNetGbp: -systemCostGbp }];

  let cumulative = -systemCostGbp;
  let benefitThisYear = totalAnnualBenefitGbp;
  let breakevenYear: number | null = null;

  for (let year = 1; year <= years; year++) {
    const previous = cumulative;
    cumulative += benefitThisYear;
    points.push({ year, cumulativeNetGbp: Math.round(cumulative) });

    if (breakevenYear === null && previous < 0 && cumulative >= 0) {
      // Linear interpolation within the crossing year for a smoother estimate.
      breakevenYear = Math.round((year - 1 + Math.abs(previous) / benefitThisYear) * 100) / 100;
    }

    benefitThisYear *= 1 - ANNUAL_PANEL_DEGRADATION;
  }

  return { points, breakevenYear };
}

export interface RoofCapacityCheck {
  maxViableKwp: number;
  isOverCapacity: boolean;
}

// The full shape passed around components: the check result plus the inputs
// that produced it, needed to render a meaningful message.
export interface RoofCheckResult extends RoofCapacityCheck {
  roofSizeM2: number;
  systemSizeKwp: number;
  usableM2PerKwp: number;
}

// Rough rule of thumb, defaulting to a pitched/gable roof: ~7.7 m^2 of
// usable, well-oriented roof per kWp installed (accounts for panel spacing,
// eaves, chimneys, obstructions). Hips and flat roofs waste more space —
// see lib/roofPresets.ts's ROOF_TYPES for the per-shape figures. This is a
// sanity-check estimate, not a substitute for a site survey.
const DEFAULT_USABLE_M2_PER_KWP = 7.7;

export function checkRoofCapacity(
  roofSizeM2: number,
  systemSizeKwp: number,
  usableM2PerKwp: number = DEFAULT_USABLE_M2_PER_KWP
): RoofCapacityCheck {
  const maxViableKwp = Math.round((roofSizeM2 / usableM2PerKwp) * 10) / 10;
  return { maxViableKwp, isOverCapacity: systemSizeKwp > maxViableKwp };
}

export interface Co2Equivalences {
  treesPlantedPerYear: number;
  milesNotDrivenPerYear: number;
}

// Illustrative conversion factors for customer-facing framing, not scientific
// precision: ~20kg CO2 absorbed per year by a young/growing tree, ~0.27kg
// CO2 emitted per mile by an average petrol car.
const KG_CO2_PER_TREE_PER_YEAR = 20;
const KG_CO2_PER_MILE_DRIVEN = 0.27;

export function computeCo2Equivalences(annualCo2SavedKg: number): Co2Equivalences {
  return {
    treesPlantedPerYear: Math.round(annualCo2SavedKg / KG_CO2_PER_TREE_PER_YEAR),
    milesNotDrivenPerYear: Math.round(annualCo2SavedKg / KG_CO2_PER_MILE_DRIVEN),
  };
}
