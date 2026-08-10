/**
 * app/api/calculate/route.ts
 * Single endpoint the frontend calls with a customer's details.
 * Returns solar generation + full payback breakdown in one response.
 *
 * POST body example:
 * {
 *   "postcode": "SW1A 1AA",
 *   "roofSizeM2": 25,
 *   "systemSizeKwp": 4.2,
 *   "tiltDegrees": 35,
 *   "azimuthDegrees": 0,
 *   "systemCostGbp": 6500,
 *   "batteryCapacityKwh": 5,
 *   "unitRatePencePerKwh": 24.5,
 *   "segRatePencePerKwh": 15
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { lookupPostcode } from "@/lib/postcode";
import { fetchSolarGeneration } from "@/lib/pvgis";
import { calculatePayback } from "@/lib/calculations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      postcode,
      systemSizeKwp,
      tiltDegrees,
      azimuthDegrees,
      systemCostGbp,
      batteryCapacityKwh,
      unitRatePencePerKwh,
      segRatePencePerKwh,
    } = body;

    if (!postcode || !systemSizeKwp || !systemCostGbp) {
      return NextResponse.json(
        { error: "postcode, systemSizeKwp and systemCostGbp are required." },
        { status: 400 }
      );
    }

    // 1. Postcode -> lat/lon
    const location = await lookupPostcode(postcode);

    // 2. lat/lon -> estimated annual generation (PVGIS)
    const solar = await fetchSolarGeneration({
      latitude: location.latitude,
      longitude: location.longitude,
      systemSizeKwp,
      tiltDegrees,
      azimuthDegrees,
    });

    // 3. Generation + tariff -> payback, ROI, CO2
    const payback = calculatePayback({
      annualGenerationKwh: solar.annualGenerationKwh,
      systemCostGbp,
      batteryCapacityKwh,
      tariff: {
        unitRatePencePerKwh,
        segRatePencePerKwh,
        hasBattery: (batteryCapacityKwh ?? 0) > 0,
      },
    });

    return NextResponse.json({
      location,
      solar: {
        annualGenerationKwh: Math.round(solar.annualGenerationKwh),
        monthlyGenerationKwh: solar.monthlyGenerationKwh.map((v) =>
          Math.round(v)
        ),
      },
      payback,
    });
  } catch (err: any) {
    console.error("Calculation error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong running the calculation." },
      { status: 500 }
    );
  }
}
