/**
 * lib/pvgis.ts
 * Fetches estimated annual solar PV generation from the European
 * Commission's PVGIS API (free, no API key required).
 * Docs: https://re.jrc.ec.europa.eu/pvg_tools/en/
 */

export interface PvgisInput {
  latitude: number;
  longitude: number;
  systemSizeKwp: number; // installed capacity in kWp
  tiltDegrees?: number; // roof pitch, default 35 (typical UK pitched roof)
  azimuthDegrees?: number; // 0 = south, -90 = east, 90 = west (PVGIS convention)
  systemLossPercent?: number; // inverter/wiring/soiling losses, default 14%
}

export interface PvgisResult {
  annualGenerationKwh: number;
  monthlyGenerationKwh: number[]; // Jan -> Dec
  raw: unknown;
}

export async function fetchSolarGeneration(
  input: PvgisInput
): Promise<PvgisResult> {
  const {
    latitude,
    longitude,
    systemSizeKwp,
    tiltDegrees = 35,
    azimuthDegrees = 0,
    systemLossPercent = 14,
  } = input;

  const params = new URLSearchParams({
    lat: latitude.toFixed(4),
    lon: longitude.toFixed(4),
    peakpower: systemSizeKwp.toString(),
    loss: systemLossPercent.toString(),
    angle: tiltDegrees.toString(),
    aspect: azimuthDegrees.toString(),
    outputformat: "json",
    pvtechchoice: "crystSi",
    mountingplace: "building",
  });

  const url = `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      "PVGIS solar data lookup failed. The location may be outside PVGIS coverage (e.g. some UK offshore islands), or the service may be temporarily unavailable."
    );
  }

  const data = await res.json();

  const monthly = data?.outputs?.monthly?.fixed;
  const totals = data?.outputs?.totals?.fixed;

  if (!monthly || !totals) {
    throw new Error("Unexpected PVGIS response format.");
  }

  const monthlyGenerationKwh: number[] = monthly
    .sort((a: any, b: any) => a.month - b.month)
    .map((m: any) => m.E_m); // E_m = monthly energy output (kWh)

  return {
    annualGenerationKwh: totals.E_y, // E_y = yearly energy output (kWh)
    monthlyGenerationKwh,
    raw: data,
  };
}
