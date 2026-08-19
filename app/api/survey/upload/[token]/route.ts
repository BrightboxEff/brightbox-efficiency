/**
 * app/api/survey/upload/[token]/route.ts
 * Accepts utility bill uploads for a paid survey submission, identified by
 * a one-time upload token (not a Brightbox login — this is a public,
 * unauthenticated flow). Stores files in the private "utility-bills"
 * bucket, then kicks off the AI report draft and notifies the team.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateEnergyReport } from "@/lib/reportGeneration";
import { sendSurveyReportReadyEmail } from "@/lib/email";
import { BRAND } from "@/lib/brand";

const BUCKET = "utility-bills";
const MAX_FILES = 12;
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const supabase = createAdminClient();

  const { data: submission } = await supabase
    .from("energy_survey_submissions")
    .select("id, first_name, business_name")
    .eq("upload_token", params.token)
    .eq("status", "paid")
    .single();

  if (!submission) {
    return NextResponse.json(
      { error: "This upload link is invalid or has already been used." },
      { status: 404 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("bills").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Please attach at least one file." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Please attach at most ${MAX_FILES} files.` }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `${file.name}: only PDF, PNG, and JPG files are accepted.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: `${file.name} is too large (max 15MB).` }, { status: 400 });
    }
  }

  const paths: string[] = [];
  for (const [i, file] of files.entries()) {
    const path = `${submission.id}/${Date.now()}-${i}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
    });
    if (uploadError) {
      console.error("Bill upload failed:", uploadError);
      return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }
    paths.push(path);
  }

  await supabase
    .from("energy_survey_submissions")
    .update({
      status: "bills_uploaded",
      bill_file_paths: paths,
      bills_uploaded_at: new Date().toISOString(),
    })
    .eq("id", submission.id);

  try {
    const draft = await generateEnergyReport(submission.id);

    await supabase
      .from("energy_survey_submissions")
      .update({
        status: "report_ready",
        report_draft: draft,
        report_generated_at: new Date().toISOString(),
      })
      .eq("id", submission.id);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendSurveyReportReadyEmail({
      to: BRAND.contactEmail,
      businessName: submission.business_name,
      reviewUrl: `${siteUrl}/survey/review/${submission.id}`,
    });
  } catch (err: any) {
    // Bills are safely stored either way — report generation can be
    // retried manually from the review page if this fails.
    console.error("Report generation failed:", err.message);
  }

  return NextResponse.json({ success: true });
}
