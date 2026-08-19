import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import SurveyReportReview from "@/components/SurveyReportReview";

const BUCKET = "utility-bills";

export default async function SurveyReviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/survey/review/${params.id}`);
  }
  if (user.email !== BRAND.contactEmail) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">Not authorized</h1>
        <p className="mt-3 text-charcoal/70">This page is only available to the Brightbox admin account.</p>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: submission } = await admin
    .from("energy_survey_submissions")
    .select(
      "id, first_name, last_name, business_name, email, status, report_draft, report_final, bill_file_paths, operations_description, largest_consumers, consultation_hours"
    )
    .eq("id", params.id)
    .single();

  if (!submission) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">Not found</h1>
      </div>
    );
  }

  const billLinks = await Promise.all(
    submission.bill_file_paths.map(async (path: string) => {
      const { data } = await admin.storage.from(BUCKET).createSignedUrl(path, 3600);
      return { path, url: data?.signedUrl ?? null };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">
        Review report — {submission.business_name}
      </h1>
      <p className="mt-2 text-sm text-charcoal/70">
        {submission.first_name} {submission.last_name} · {submission.email}
        {submission.consultation_hours > 0 && ` · +${submission.consultation_hours}h consultation add-on`}
      </p>

      <div className="mt-6 rounded-lg border border-border-muted bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal/60">Their survey answers</h2>
        <p className="mt-2 text-sm text-charcoal"><strong>Operations:</strong> {submission.operations_description}</p>
        <p className="mt-2 text-sm text-charcoal"><strong>Largest consumers:</strong> {submission.largest_consumers}</p>

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Uploaded bills</h2>
        {billLinks.length === 0 ? (
          <p className="mt-2 text-sm text-charcoal/60">No files uploaded yet.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {billLinks.map((b, i) => (
              <li key={b.path}>
                {b.url ? (
                  <a href={b.url} target="_blank" rel="noreferrer" className="text-sm text-moss underline underline-offset-2">
                    Bill {i + 1}
                  </a>
                ) : (
                  <span className="text-sm text-charcoal/50">Bill {i + 1} (link expired, refresh page)</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {submission.status === "report_sent" ? (
        <p className="mt-6 rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
          This report was already sent to the customer.
        </p>
      ) : !submission.report_draft ? (
        <p className="mt-6 rounded-md border border-border-muted bg-cream px-4 py-3 text-sm text-charcoal/70">
          No draft report yet — it&apos;s either still generating, generation failed, or bills
          haven&apos;t been uploaded. Refresh this page in a minute.
        </p>
      ) : (
        <div className="mt-6">
          <SurveyReportReview
            submissionId={submission.id}
            initialContent={submission.report_final ?? submission.report_draft}
          />
        </div>
      )}
    </div>
  );
}
