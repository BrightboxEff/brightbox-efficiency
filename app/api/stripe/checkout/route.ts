/**
 * app/api/stripe/checkout/route.ts
 * Creates a Stripe Checkout Session for the £19/month subscription and
 * returns its URL for the client to redirect to.
 */

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data: installer } = await supabase
    .from("installers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = installer?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("installers")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${siteUrl}/calculator?checkout=success`,
    cancel_url: `${siteUrl}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
