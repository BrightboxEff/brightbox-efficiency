/**
 * lib/trial.ts
 * Single source of truth for the free trial length, referenced by
 * middleware.ts (access gating) and app/billing/page.tsx (days-left copy).
 */

export const TRIAL_LENGTH_DAYS = 7;
