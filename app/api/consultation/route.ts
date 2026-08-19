/**
 * app/api/consultation/route.ts
 * Creates a one-time £40 Stripe Checkout session for a paid 1-hour
 * consultation call, storing the calculation summary so the webhook can
 * email it to the Brightbox team once payment succeeds. Uses inline
 * price_data rather than a pre-created Stripe price, so no extra Stripe
 * dashboard setup is needed beyond the existing subscription price.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const CONSULTATION_PRICE_GBP = 40;

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const { projectName, postcode, addressLine, summary } = body;

  if (!postcode || !summary) {
    return NextResponse.json({ error: "postcode and summary are required." }, { status: 400 });
  }

  const { data: request, error: insertError } = await supabase
    .from("consultation_requests")
    .insert({
      user_id: user.id,
      project_name: projectName ?? null,
      postcode,
      address_line: addressLine ?? null,
      summary,
    })
    .select("id")
    .single();

  if (insertError || !request) {
    return NextResponse.json({ error: "Could not create consultation request." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: CONSULTATION_PRICE_GBP * 100,
          product_data: {
            name: "1-hour solar consultation call with the Brightbox team",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { consultation_request_id: request.id },
    success_url: `${siteUrl}/calculator?consultation=success`,
    cancel_url: `${siteUrl}/calculator?consultation=cancelled`,
  });

  await supabase
    .from("consultation_requests")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", request.id);

  return NextResponse.json({ url: session.url });
}
