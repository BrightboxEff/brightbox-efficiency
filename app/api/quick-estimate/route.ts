/**
 * app/api/quick-estimate/route.ts
 * Public, no-signup-required rough estimate for the landing page teaser widget.
 * Runs the same postcode -> PVGIS -> payback pipeline as /api/calculate, but
 * with fixed assumptions for a typical residential system (4kWp, south-facing,
 * 35 degree pitched roof, no battery) instead of the full calculator's inputs.
 * The full calculator (gated) is where a real, site-specific quote happens.
 */

import { NextRequest, NextResponse } from "next/server";
import { lookupPostcode } from "@/lib/postcode";
import { fetchSolarGeneration } from "@/lib/pvgis";
import { calculatePayback } from "@/lib/calculations";

const TYPICAL_SYSTEM_SIZE_KWP = 4;
const TYPICAL_TILT_DEGREES = 35;
const TYPICAL_AZIMUTH_DEGREES = 0;
const TYPICAL_SYSTEM_COST_GBP = 6500;

export async function POST(req: NextRequest) {
  try {
    const { postcode } = await req.json();

    if (!postcode) {
      return NextResponse.json({ error: "Enter a postcode." }, { status: 400 });
    }

    const location = await lookupPostcode(postcode);

    const solar = await fetchSolarGeneration({
      latitude: location.latitude,
      longitude: location.longitude,
      systemSizeKwp: TYPICAL_SYSTEM_SIZE_KWP,
      tiltDegrees: TYPICAL_TILT_DEGREES,
      azimuthDegrees: TYPICAL_AZIMUTH_DEGREES,
    });

    const payback = calculatePayback({
      annualGenerationKwh: solar.annualGenerationKwh,
      systemCostGbp: TYPICAL_SYSTEM_COST_GBP,
    });

    return NextResponse.json({
      region: location.region,
      annualGenerationKwh: Math.round(solar.annualGenerationKwh),
      totalAnnualBenefitGbp: Math.round(payback.totalAnnualBenefitGbp),
      paybackYears: Number.isFinite(payback.paybackYears)
        ? Math.round(payback.paybackYears * 10) / 10
        : null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Couldn't run that estimate — check the postcode and try again." },
      { status: 500 }
    );
  }
}
