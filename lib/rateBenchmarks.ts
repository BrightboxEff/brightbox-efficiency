/**
 * lib/rateBenchmarks.ts
 * Reference UK business electricity/gas unit rates, used so the energy
 * survey report can tell a customer whether the rate on their own bills
 * looks competitive.
 *
 * There's no reliable public API for commercial energy rates — pricing is
 * quote-based and varies by contract length, credit rating, and consumption
 * volume — so this is a small, manually-curated range rather than a live
 * feed. Review and update every 6-12 months from a broker/comparison source
 * (e.g. https://www.gov.uk/guidance/gas-and-electricity-bills-decoding-your-bill
 * or a current business energy comparison site); pricing moves far more
 * slowly than the domestic Ofgem cap in lib/tariff.ts, so it doesn't need
 * quarterly attention.
 */

export const RATE_BENCHMARKS = {
  businessElectricityPencePerKwh: { low: 22, typical: 28, high: 38 },
  businessGasPencePerKwh: { low: 6, typical: 8, high: 12 },
};

export function formatRateBenchmarks(): string {
  const { businessElectricityPencePerKwh: elec, businessGasPencePerKwh: gas } = RATE_BENCHMARKS;
  return `Typical UK small/medium business unit rates (fixed-term contracts, non-half-hourly meters): electricity ${elec.low}-${elec.high}p/kWh (typical ${elec.typical}p/kWh), gas ${gas.low}-${gas.high}p/kWh (typical ${gas.typical}p/kWh). These are broad reference ranges, not quotes — actual competitive rates depend on contract length, credit rating, and consumption volume.`;
}
