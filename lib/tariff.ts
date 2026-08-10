/**
 * lib/tariff.ts
 * Default UK electricity tariff assumptions.
 *
 * IMPORTANT: Ofgem's price cap changes quarterly (Jan, Apr, Jul, Oct).
 * Update DEFAULT_UNIT_RATE_PENCE_PER_KWH and DEFAULT_STANDING_CHARGE_PENCE_PER_DAY
 * each quarter from https://www.ofgem.gov.uk/energy-price-cap
 * This is the only recurring manual maintenance this app needs (~5 min/quarter).
 */

export const TARIFF_DEFAULTS = {
  // Ofgem price cap average, pence per kWh (electricity) — UPDATE QUARTERLY
  unitRatePencePerKwh: 24.5,

  // Ofgem price cap standing charge, pence per day — UPDATE QUARTERLY
  standingChargePencePerDay: 60.1,

  // Smart Export Guarantee — varies by supplier, this is a conservative default
  // Installer should override with the customer's actual SEG rate/tariff
  segRatePencePerKwh: 15.0,

  // Assumed % of solar generation self-consumed vs exported (typical UK home
  // without a battery is ~35-50% self-consumption; with a battery, 60-80%)
  selfConsumptionRateNoBattery: 0.4,
  selfConsumptionRateWithBattery: 0.7,
};

export interface TariffInput {
  unitRatePencePerKwh?: number;
  segRatePencePerKwh?: number;
  hasBattery?: boolean;
  selfConsumptionOverride?: number; // 0-1, overrides default assumption
}

export function resolveTariff(input: TariffInput = {}) {
  const unitRate =
    input.unitRatePencePerKwh ?? TARIFF_DEFAULTS.unitRatePencePerKwh;
  const segRate = input.segRatePencePerKwh ?? TARIFF_DEFAULTS.segRatePencePerKwh;
  const selfConsumption =
    input.selfConsumptionOverride ??
    (input.hasBattery
      ? TARIFF_DEFAULTS.selfConsumptionRateWithBattery
      : TARIFF_DEFAULTS.selfConsumptionRateNoBattery);

  return { unitRate, segRate, selfConsumption };
}
