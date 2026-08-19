/**
 * app/api/survey/submit/route.ts
 * Stores an energy efficiency survey submission and creates a Stripe
 * Checkout session for the £200 survey fee plus any optional £60/hour
 * follow-up consultation hours. Public — no Brightbox account required.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { ENERGY_SURVEY_FEE_GBP, CONSULTATION_HOURLY_RATE_GBP } from "@/lib/pricing";
import type { EnergySurveyFormValues } from "@/types/survey";

const MAX_CONSULTATION_HOURS = 20;

export async function POST(req: NextRequest) {
  const body: EnergySurveyFormValues = await req.json();

  const {
    firstName,
    lastName,
    businessName,
    email,
    annualSpendBracket,
    operationsDescription,
    consumptionIntensity,
    motivations,
    hasUtilityBills,
    largestConsumers,
    urgency,
    termsAccepted,
    consultationHours,
  } = body;

  if (!firstName || !lastName || !businessName || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Missing required contact details." }, { status: 400 });
  }
  if (!termsAccepted) {
    return NextResponse.json({ error: "You must accept the terms to continue." }, { status: 400 });
  }
  const hours = Math.min(MAX_CONSULTATION_HOURS, Math.max(0, Number(consultationHours) || 0));

  const supabase = createAdminClient();

  const { data: submission, error: insertError } = await supabase
    .from("energy_survey_submissions")
    .insert({
      first_name: firstName,
      last_name: lastName,
      business_name: businessName,
      email,
      annual_spend_bracket: annualSpendBracket,
      operations_description: operationsDescription,
      consumption_intensity: consumptionIntensity,
      motivations,
      has_utility_bills: hasUtilityBills,
      largest_consumers: largestConsumers,
      urgency,
      terms_accepted: termsAccepted,
      consultation_hours: hours,
    })
    .select("id")
    .single();

  if (insertError || !submission) {
    console.error("Failed to create survey submission:", insertError);
    return NextResponse.json({ error: "Could not save your submission." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const lineItems: Array<{
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string };
    };
    quantity: number;
  }> = [
    {
      price_data: {
        currency: "gbp",
        unit_amount: ENERGY_SURVEY_FEE_GBP * 100,
        product_data: { name: "Energy Efficiency Survey" },
      },
      quantity: 1,
    },
  ];

  if (hours > 0) {
    lineItems.push({
      price_data: {
        currency: "gbp",
        unit_amount: CONSULTATION_HOURLY_RATE_GBP * 100,
        product_data: { name: "Follow-up consultation (per hour)" },
      },
      quantity: hours,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: lineItems,
    metadata: { energy_survey_submission_id: submission.id },
    success_url: `${siteUrl}/survey?submitted=success`,
    cancel_url: `${siteUrl}/survey?submitted=cancelled`,
  });

  await supabase
    .from("energy_survey_submissions")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", submission.id);

  return NextResponse.json({ url: session.url });
}
