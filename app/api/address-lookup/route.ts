/**
 * app/api/address-lookup/route.ts
 * Looks up individual addresses at a UK postcode via Ideal Postcodes — a
 * separate concern from lib/postcode.ts, which only geocodes the postcode
 * itself (lat/lon) for the solar calculation and is left untouched.
 * Purely a display nicety: which exact address this is for, in the results
 * and PDF. Requires IDEAL_POSTCODES_API_KEY; falls back gracefully if unset
 * so manual address entry still works without it.
 */

import { NextRequest, NextResponse } from "next/server";

interface IdealPostcodesAddress {
  line_1: string;
  line_2: string;
  line_3: string;
  post_town: string;
  postcode: string;
}

function formatAddress(a: IdealPostcodesAddress): string {
  return [a.line_1, a.line_2, a.line_3, a.post_town, a.postcode]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

export async function GET(req: NextRequest) {
  const postcode = req.nextUrl.searchParams.get("postcode");

  if (!postcode) {
    return NextResponse.json({ error: "Postcode is required." }, { status: 400 });
  }

  const apiKey = process.env.IDEAL_POSTCODES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Address lookup isn't configured yet.", addresses: [] },
      { status: 501 }
    );
  }

  const cleaned = postcode.trim();

  let res: Response;
  try {
    res = await fetch(
      `https://api.ideal-postcodes.co.uk/v1/postcodes/${encodeURIComponent(cleaned)}?api_key=${apiKey}`
    );
  } catch {
    return NextResponse.json(
      { error: "Address lookup failed. Please enter the address manually.", addresses: [] },
      { status: 502 }
    );
  }

  if (res.status === 404) {
    // Ideal Postcodes only returns 404 for a postcode it genuinely can't
    // find — a real "no addresses" result, not a service failure.
    return NextResponse.json({ addresses: [] });
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Address lookup failed. Please enter the address manually.", addresses: [] },
      { status: 502 }
    );
  }

  const data = await res.json();
  const addresses: IdealPostcodesAddress[] = data.result ?? [];
  return NextResponse.json({ addresses: addresses.map(formatAddress) });
}
