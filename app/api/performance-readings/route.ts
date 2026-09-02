/**
 * app/api/performance-readings/route.ts
 * Performance Monitor add-on: logs an actual monthly generation reading
 * for a saved system, looks up that month's expected kWh from the
 * system's stored baseline (no re-entry needed), and returns the
 * updated healthy/watch/alert status computed across recent history.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkPerformance, type MonthlyReading } from "@/lib/performance";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const { systemId, readingMonth, readingYear, actualKwh } = body;

  if (!systemId || !readingMonth || !readingYear || actualKwh === undefined) {
    return NextResponse.json(
      { error: "systemId, readingMonth, readingYear and actualKwh are all required." },
      { status: 400 }
    );
  }

  // Ownership is enforced by RLS too, but fetching by user_id here means a
  // system belonging to someone else fails cleanly with "not found" rather
  // than a confusing empty-array RLS silence further down.
  const { data: system, error: systemError } = await supabase
    .from("monitored_systems")
    .select("id, monthly_baseline_kwh")
    .eq("id", systemId)
    .eq("user_id", user.id)
    .single();

  if (systemError || !system) {
    return NextResponse.json({ error: "Monitored system not found." }, { status: 404 });
  }

  // monthly_baseline_kwh comes back as a plain JS array over the wire —
  // index 0 = January .. index 11 = December, matching lib/pvgis.ts's
  // month-sorted output that was saved when the system was added.
  const baseline: number[] = system.monthly_baseline_kwh;
  const expectedKwh = baseline[readingMonth - 1] ?? 0;

  const { error: upsertError } = await supabase.from("performance_readings").upsert(
    {
      system_id: systemId,
      reading_month: readingMonth,
      reading_year: readingYear,
      actual_kwh: actualKwh,
    },
    { onConflict: "system_id,reading_year,reading_month" }
  );

  if (upsertError) {
    console.error("Could not save reading:", upsertError);
    return NextResponse.json({ error: "Could not save this reading." }, { status: 500 });
  }

  const { data: history, error: historyError } = await supabase
    .from("performance_readings")
    .select("reading_month, reading_year, actual_kwh")
    .eq("system_id", systemId)
    .order("reading_year", { ascending: true })
    .order("reading_month", { ascending: true })
    .limit(12);

  if (historyError) {
    return NextResponse.json({ error: "Reading saved, but could not load history." }, { status: 500 });
  }

  const readings: MonthlyReading[] = (history ?? []).map((h) => ({
    month: h.reading_month,
    actualKwh: h.actual_kwh,
    expectedKwh: baseline[h.reading_month - 1] ?? 0,
  }));

  const result = checkPerformance({ readings });

  return NextResponse.json({ expectedKwh, ...result });
}
