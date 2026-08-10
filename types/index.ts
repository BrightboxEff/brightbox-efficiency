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
