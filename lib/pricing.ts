/**
 * lib/pricing.ts
 * Single source of truth for the app's fixed one-off/hourly prices, shared
 * across the tutoring and energy survey checkout flows.
 */

export const CONSULTATION_HOURLY_RATE_GBP = 60;

/**
 * Energy survey pricing is tiered by the customer's self-reported annual
 * spend bracket (types/survey.ts SPEND_BRACKETS), mirroring Brightbox's
 * existing Kickstarter / Enterprise Blueprint / Global Deep Dive service
 * tiers. Only the Kickstarter tier is self-serve/purchasable online — the
 * larger tiers are scoped individually, so instead of a Stripe Checkout
 * button they get a "request availability" flow that emails the team.
 */
export type SurveyTierKey = "under_20k" | "50k_150k" | "heavy_industrial";

export interface SurveyTier {
  key: SurveyTierKey;
  name: string;
  purchasable: boolean;
  /** Flat fee in GBP — only set when purchasable is true. */
  feeGbp?: number;
  /** Indicative starting price in GBP — only set when purchasable is false. */
  fromGbp?: number;
  description: string;
}

export const SURVEY_TIERS: Record<SurveyTierKey, SurveyTier> = {
  under_20k: {
    key: "under_20k",
    name: "Kickstarter",
    purchasable: true,
    feeGbp: 350,
    description: "1-page efficiency scorecard covering 3 zero-cost wins, plus a 30-minute review call.",
  },
  "50k_150k": {
    key: "50k_150k",
    name: "Enterprise Blueprint",
    purchasable: false,
    fromGbp: 1500,
    description:
      "A custom 3-page efficiency strategy report, HH meter data review, and a 30-minute strategic review call. Scoped individually per site.",
  },
  heavy_industrial: {
    key: "heavy_industrial",
    name: "Global Deep Dive",
    purchasable: false,
    fromGbp: 4500,
    description:
      "An in-person half-day site visit with a full structural payback strategy for heavy industrial or high-volume sites. Scoped individually per site.",
  },
};
