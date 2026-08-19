/**
 * types/survey.ts
 * Shared types for the energy efficiency survey feature — mirrors the
 * fields on Brightbox's existing "Remote Intake Survey" form.
 */

export type IntensityLevel = "low" | "medium" | "high";

export interface ConsumptionIntensity {
  hvac: IntensityLevel;
  lighting: IntensityLevel;
  machinery: IntensityLevel;
  it: IntensityLevel;
}

export const SPEND_BRACKETS = [
  { value: "under_20k", label: "Under £20k / year" },
  { value: "50k_150k", label: "£50k – £150k+ / year" },
  { value: "heavy_industrial", label: "Heavy Industrial User / High-Volume Assets" },
] as const;

export const MOTIVATIONS = [
  { value: "reducing_costs", label: "Reducing operational costs" },
  { value: "lowering_emissions", label: "Lowering carbon emissions" },
  { value: "meeting_regulations", label: "Meeting sustainability regulations" },
  { value: "replacing_assets", label: "Replacing aging assets" },
  { value: "improving_reliability", label: "Improving energy reliability" },
] as const;

export interface EnergySurveyFormValues {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  annualSpendBracket: string;
  operationsDescription: string;
  consumptionIntensity: ConsumptionIntensity;
  motivations: string[];
  hasUtilityBills: boolean;
  largestConsumers: string;
  urgency: number;
  termsAccepted: boolean;
  consultationHours: number;
}
