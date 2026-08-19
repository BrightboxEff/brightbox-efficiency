import { createAdminClient } from "@/lib/supabase/server";
import BillUploadForm from "@/components/BillUploadForm";

export default async function UploadBillsPage({ params }: { params: { token: string } }) {
  const supabase = createAdminClient();
  const { data: submission } = await supabase
    .from("energy_survey_submissions")
    .select("business_name, status")
    .eq("upload_token", params.token)
    .single();

  if (!submission) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">Link not found</h1>
        <p className="mt-3 text-charcoal/70">
          This upload link doesn&apos;t look right — please check the link from your email, or
          contact us if you need help.
        </p>
      </div>
    );
  }

  if (submission.status !== "paid") {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold text-charcoal">Link already used</h1>
        <p className="mt-3 text-charcoal/70">
          This upload link has already been used for {submission.business_name}. If you need to
          share additional documents, just reply to your confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-16">
      <h1 className="text-2xl font-semibold text-charcoal">Share your utility bills</h1>
      <p className="mt-3 text-charcoal/70">
        For {submission.business_name} — upload your bills from the last 12 months. Files are
        stored privately and only used to prepare your report.
      </p>
      <div className="mt-6">
        <BillUploadForm token={params.token} />
      </div>
    </div>
  );
}
