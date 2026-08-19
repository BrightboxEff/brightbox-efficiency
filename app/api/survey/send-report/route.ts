/**
 * app/api/survey/send-report/route.ts
 * Sends the (possibly edited) final energy survey report to the customer.
 * Restricted to the Brightbox admin account — this is an internal action,
 * not something any logged-in installer should be able to trigger.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendSurveyFinalReportEmail } from "@/lib/email";
import { BRAND } from "@/lib/brand";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== BRAND.contactEmail) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { submissionId, reportHtml } = await req.json();

  if (!submissionId || !reportHtml) {
    return NextResponse.json({ error: "submissionId and reportHtml are required." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: submission } = await admin
    .from("energy_survey_submissions")
    .select("email, first_name, status")
    .eq("id", submissionId)
    .single();

  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  await sendSurveyFinalReportEmail({
    to: submission.email,
    firstName: submission.first_name,
    reportHtml,
  });

  await admin
    .from("energy_survey_submissions")
    .update({
      status: "report_sent",
      report_final: reportHtml,
      report_sent_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  return NextResponse.json({ success: true });
}
