/**
 * app/api/tutoring-checkout/route.ts
 * Creates a one-time Stripe Checkout session for 1:1 engineering interview
 * tutoring hours, at a fixed £60/hour. Public — no Brightbox account
 * required, this is a standalone service purchase, not part of the
 * calculator SaaS subscription.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const HOURLY_RATE_GBP = 60;
const MIN_HOURS = 1;
const MAX_HOURS = 20;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hours, email } = body;

  const parsedHours = Number(hours);
  if (!Number.isInteger(parsedHours) || parsedHours < MIN_HOURS || parsedHours > MAX_HOURS) {
    return NextResponse.json(
      { error: `Hours must be a whole number between ${MIN_HOURS} and ${MAX_HOURS}.` },
      { status: 400 }
    );
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          unit_amount: HOURLY_RATE_GBP * 100,
          product_data: {
            name: "1:1 Engineering Interview Tutoring (per hour)",
          },
        },
        quantity: parsedHours,
      },
    ],
    metadata: { tutoring_hours: String(parsedHours) },
    success_url: `${siteUrl}/tutoring?purchase=success`,
    cancel_url: `${siteUrl}/tutoring?purchase=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
