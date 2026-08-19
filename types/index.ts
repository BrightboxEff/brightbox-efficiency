/**
 * types/index.ts
 * Shared types used across API responses, components, and the PDF document.
 */

export interface CalculateRequest {
  postcode: string;
  roofSizeM2?: number;
  systemSizeKwp: number;
  tiltDegrees?: number;
  azimuthDegrees?: number;
  systemCostGbp: number;
  batteryCapacityKwh?: number;
  unitRatePencePerKwh?: number;
  segRatePencePerKwh?: number;
}

// What the form collects, a superset of CalculateRequest — batteryCostGbp
// and roofType aren't API fields, they're used client-side (see
// lib/insights.ts and lib/roofPresets.ts) to isolate the battery's own
// payback and to pick the right roof-capacity assumption.
export interface CalculatorFormValues extends CalculateRequest {
  batteryCostGbp?: number;
  roofType: string;
  projectName?: string;
  addressLine?: string;
}

export interface CalculateResponse {
  location: {
    postcode: string;
    latitude: number;
    longitude: number;
    region: string;
    adminDistrict: string;
  };
  solar: {
    annualGenerationKwh: number;
    monthlyGenerationKwh: number[];
  };
  payback: {
    annualSavingsGbp: number;
    annualExportIncomeGbp: number;
    totalAnnualBenefitGbp: number;
    paybackYears: number;
    tenYearSavingsGbp: number;
    twentyFiveYearSavingsGbp: number;
    annualCo2SavedKg: number;
    selfConsumptionRate: number;
  };
}

export interface InstallerSettings {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
}

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
