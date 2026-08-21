/**
 * app/api/address-lookup/route.ts
 * Looks up individual addresses at a UK postcode via getaddress.io — a
 * separate concern from lib/postcode.ts, which only geocodes the postcode
 * itself (lat/lon) for the solar calculation and is left untouched.
 * Purely a display nicety: which exact address this is for, in the results
 * and PDF. Requires GETADDRESS_API_KEY; falls back gracefully if unset so
 * manual address entry still works without it.
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const postcode = req.nextUrl.searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json({ error: "Postcode is required." }, { status: 400 });
  }

  const apiKey = process.env.GETADDRESS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Address lookup isn't configured yet.", addresses: [] },
      { status: 501 }
    );
  }

  const cleaned = postcode.trim().replace(/\s+/g, "");

  let res: Response;
  try {
    res = await fetch(
      `https://api.getaddress.io/find/${encodeURIComponent(cleaned)}?api-key=${apiKey}`
    );
  } catch {
    return NextResponse.json(
      { error: "Address lookup failed. Please enter the address manually.", addresses: [] },
      { status: 502 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Address lookup failed. Please enter the address manually.", addresses: [] },
      { status: 502 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ addresses: data.addresses ?? [] });
}
