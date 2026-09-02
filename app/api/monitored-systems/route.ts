/**
 * app/api/monitored-systems/route.ts
 * Performance Monitor add-on: saves a system's PVGIS baseline (captured
 * from a completed calculator run) so future readings can be compared
 * against it automatically, with no re-entry needed.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const { systemReference, postcode, addressLine, systemSizeKwp, monthlyBaselineKwh } = body;

  if (
    !systemReference ||
    !postcode ||
    !systemSizeKwp ||
    !Array.isArray(monthlyBaselineKwh) ||
    monthlyBaselineKwh.length !== 12
  ) {
    return NextResponse.json(
      {
        error:
          "systemReference, postcode, systemSizeKwp and a 12-value monthlyBaselineKwh are required.",
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("monitored_systems")
    .insert({
      user_id: user.id,
      system_reference: systemReference,
      postcode,
      address_line: addressLine ?? null,
      system_size_kwp: systemSizeKwp,
      monthly_baseline_kwh: monthlyBaselineKwh,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Could not save monitored system:", error);
    return NextResponse.json({ error: "Could not save this system for monitoring." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  // RLS also enforces this, but scoping the delete explicitly keeps intent clear.
  const { error } = await supabase.from("monitored_systems").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Could not remove this system." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
