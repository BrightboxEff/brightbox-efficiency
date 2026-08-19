/**
 * lib/roofPresets.ts
 * Rough, clearly-labelled-as-approximate helpers for filling in roof size
 * without a survey: typical building-type sizes, roof-shape factors used
 * both by the footprint calculator and the roof capacity check in
 * lib/insights.ts.
 */

export interface BuildingPreset {
  id: string;
  label: string;
  roofSizeM2: number;
}

export const BUILDING_PRESETS: BuildingPreset[] = [
  { id: "terraced-2bed", label: "2-bed terraced / flat", roofSizeM2: 18 },
  { id: "semi-3bed", label: "3-bed semi-detached", roofSizeM2: 28 },
  { id: "detached-4bed", label: "4-bed detached", roofSizeM2: 45 },
  { id: "small-office", label: "Small office", roofSizeM2: 80 },
  { id: "warehouse", label: "Warehouse / large commercial", roofSizeM2: 250 },
];

export interface RoofType {
  id: string;
  label: string;
  // Rough usable roof area needed per kWp installed — varies by shape
  // because hips and flat-roof mounting frames waste more space than a
  // simple gable gets away with.
  usableM2PerKwp: number;
  // Multiplier applied to a building footprint (length x width) to estimate
  // total roof surface area for that shape.
  footprintSlopeFactor: number;
}

export const ROOF_TYPES: RoofType[] = [
  { id: "pitched", label: "Pitched (gable)", usableM2PerKwp: 7.7, footprintSlopeFactor: 1.15 },
  { id: "hip", label: "Hip / chinaman hat", usableM2PerKwp: 9.5, footprintSlopeFactor: 1.25 },
  { id: "flat", label: "Flat", usableM2PerKwp: 12, footprintSlopeFactor: 1.0 },
];

export const DEFAULT_ROOF_TYPE_ID = "pitched";

export function getRoofType(id: string): RoofType {
  return ROOF_TYPES.find((r) => r.id === id) ?? ROOF_TYPES[0];
}

export function estimateRoofAreaM2(lengthM: number, widthM: number, roofTypeId: string): number {
  const roofType = getRoofType(roofTypeId);
  return Math.round(lengthM * widthM * roofType.footprintSlopeFactor * 10) / 10;
}
