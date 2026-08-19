/**
 * app/api/stripe/webhook/route.ts
 * Keeps installers.subscription_status in sync with Stripe, and handles the
 * one-time £40 consultation payment and tutoring-hours purchases (emails
 * the Brightbox team once paid). Configure this URL in the Stripe Dashboard
 * (or `stripe listen --forward-to`) for: checkout.session.completed,
 * customer.subscription.updated, customer.subscription.deleted
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendConsultationRequestEmail,
  sendTutoringPurchaseEmail,
  sendSurveyBillRequestEmail,
  sendSurveyPaidNotificationEmail,
} from "@/lib/email";
import { BRAND } from "@/lib/brand";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "payment" && session.metadata?.consultation_request_id) {
        const requestId = session.metadata.consultation_request_id;

        const { data: consultationRequest } = await supabase
          .from("consultation_requests")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", requestId)
          .select("user_id, project_name, postcode, address_line, summary")
          .single();

        if (consultationRequest) {
          const { data: installer } = await supabase
            .from("installers")
            .select("company_name")
            .eq("user_id", consultationRequest.user_id)
            .single();

          const { data: authUser } = await supabase.auth.admin.getUserById(
            consultationRequest.user_id
          );

          await sendConsultationRequestEmail({
            to: BRAND.contactEmail,
            installerEmail: authUser?.user?.email ?? "unknown",
            installerCompanyName: installer?.company_name || BRAND.name,
            projectName: consultationRequest.project_name ?? undefined,
            postcode: consultationRequest.postcode,
            addressLine: consultationRequest.address_line ?? undefined,
            summary: consultationRequest.summary,
          });
        }
        break;
      }

      if (session.mode === "payment" && session.metadata?.tutoring_hours) {
        const hours = Number(session.metadata.tutoring_hours);
        const buyerEmail = session.customer_details?.email ?? session.customer_email ?? "unknown";
        await sendTutoringPurchaseEmail({
          to: BRAND.contactEmail,
          buyerEmail,
          hours,
          totalGbp: (session.amount_total ?? 0) / 100,
        });
        break;
      }

      if (session.mode === "payment" && session.metadata?.energy_survey_submission_id) {
        const submissionId = session.metadata.energy_survey_submission_id;

        const { data: submission } = await supabase
          .from("energy_survey_submissions")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", submissionId)
          .select("first_name, email, business_name, consultation_hours, upload_token")
          .single();

        if (submission) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

          await sendSurveyBillRequestEmail({
            to: submission.email,
            firstName: submission.first_name,
            uploadUrl: `${siteUrl}/survey/upload/${submission.upload_token}`,
          });

          await sendSurveyPaidNotificationEmail({
            to: BRAND.contactEmail,
            submitterEmail: submission.email,
            businessName: submission.business_name,
            consultationHours: submission.consultation_hours,
          });
        }
        break;
      }

      const userId = session.client_reference_id;
      if (userId) {
        await supabase
          .from("installers")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: "active",
          })
          .eq("user_id", userId);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status === "active" ? "active" : subscription.status;
      await supabase
        .from("installers")
        .update({
          subscription_status: status,
          stripe_subscription_id: subscription.id,
        })
        .eq("stripe_customer_id", subscription.customer as string);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
