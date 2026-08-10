/**
 * app/api/stripe/portal/route.ts
 * Creates a Stripe Billing Portal session so an installer can manage or
 * cancel their subscription.
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

  if (!installer?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found yet." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: installer.stripe_customer_id,
    return_url: `${siteUrl}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
