import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BillingActions from "@/components/BillingActions";

const TRIAL_LENGTH_DAYS = 14;

export default async function BillingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: installer } = await supabase
    .from("installers")
    .select("subscription_status, trial_start")
    .eq("user_id", user.id)
    .single();

  const status = installer?.subscription_status ?? "trialing";
  const hasActiveSubscription = status === "active";

  let trialDaysLeft = 0;
  if (installer?.trial_start) {
    const trialEnds = new Date(installer.trial_start).getTime() + TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000;
    trialDaysLeft = Math.max(0, Math.ceil((trialEnds - Date.now()) / (24 * 60 * 60 * 1000)));
  }

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-semibold text-charcoal">Billing</h1>

      {hasActiveSubscription ? (
        <p className="mt-3 text-charcoal/70">Your subscription is active. Thanks for being a Brightbox customer.</p>
      ) : status === "trialing" && trialDaysLeft > 0 ? (
        <p className="mt-3 text-charcoal/70">
          You have <strong>{trialDaysLeft}</strong> day{trialDaysLeft === 1 ? "" : "s"} left in your
          free trial. Subscribe now to keep access after it ends.
        </p>
      ) : (
        <p className="mt-3 text-charcoal/70">
          Your free trial has ended. Subscribe for £19/month to keep using the calculator.
        </p>
      )}

      <BillingActions hasActiveSubscription={hasActiveSubscription} />
    </div>
  );
}
