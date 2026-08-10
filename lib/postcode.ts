/**
 * lib/postcode.ts
 * Converts a UK postcode into latitude/longitude using postcodes.io
 * (free, no API key required, maintained by the ONS-backed Postcodes.io project)
 */

export interface PostcodeResult {
  postcode: string;
  latitude: number;
  longitude: number;
  region: string;
  adminDistrict: string;
}

export async function lookupPostcode(rawPostcode: string): Promise<PostcodeResult> {
  const postcode = rawPostcode.trim().replace(/\s+/g, "");

  if (!postcode) {
    throw new Error("Postcode is required");
  }

  const res = await fetch(
    `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
  );

  if (!res.ok) {
    throw new Error(
      `Could not find postcode "${rawPostcode}". Please check it and try again.`
    );
  }

  const data = await res.json();

  if (!data || data.status !== 200 || !data.result) {
    throw new Error(`No location data found for postcode "${rawPostcode}".`);
  }

  const { latitude, longitude, region, admin_district } = data.result;

  return {
    postcode: rawPostcode.toUpperCase(),
    latitude,
    longitude,
    region: region ?? "Unknown",
    adminDistrict: admin_district ?? "Unknown",
  };
}
