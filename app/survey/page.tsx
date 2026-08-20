"use client";

import { useEffect, useState } from "react";
import EnergySurveyForm from "@/components/EnergySurveyForm";
import { SURVEY_TIERS } from "@/lib/pricing";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "You submit your details",
    description: "Answer a short survey about your site, equipment, and energy use, then pay the survey fee.",
  },
  {
    step: "2",
    title: "Share your bills",
    description: "We email you a secure link to upload the last 12 months of utility bills — stored privately, never public.",
  },
  {
    step: "3",
    title: "AI drafts your report",
    description: "Your bills and equipment profile are analysed to draft a numbers-led first pass — fast, and grounded in your actual data.",
  },
  {
    step: "4",
    title: "A Brightbox engineer reviews it",
    description: "Every draft is checked, edited, and has real engineering expertise added before it's ever sent to you.",
  },
];

export default function SurveyPage() {
  const [status, setStatus] = useState<"success" | "cancelled" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const submitted = params.get("submitted");
    if (submitted === "success" || submitted === "cancelled") {
      setStatus(submitted);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Energy Efficiency Survey</h1>
      <p className="mt-2 max-w-2xl text-charcoal/70">
        A remote, bills-based energy efficiency assessment for your business — practical
        savings tips and equipment recommendations, prepared by a Brightbox consultant.
      </p>

      {status === "success" && (
        <p className="mt-4 rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
          Thanks — payment received. Check your email for a secure link to share your utility
          bills.
        </p>
      )}
      {status === "cancelled" && (
        <p className="mt-4 rounded-md border border-border-muted bg-cream px-4 py-3 text-sm text-charcoal/70">
          Payment was cancelled — no charge was made.
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-charcoal">How your report gets made</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="rounded-lg border border-border-muted bg-white p-4 shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-moss text-sm font-semibold text-cream">
                {s.step}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-charcoal">{s.title}</h3>
              <p className="mt-1 text-xs text-charcoal/70">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-charcoal">Choose your tier</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Pricing scales with your site — pick the bracket that matches your annual energy spend
          below in the form.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.values(SURVEY_TIERS).map((tier) => (
            <div key={tier.key} className="flex flex-col rounded-lg border border-border-muted bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-charcoal">{tier.name}</h3>
              <p className="mt-1 text-xl font-semibold text-moss">
                {tier.purchasable ? `£${tier.feeGbp}` : `From £${tier.fromGbp?.toLocaleString()}`}
              </p>
              <p className="mt-2 flex-1 text-xs text-charcoal/70">{tier.description}</p>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
                {tier.purchasable ? "Book online below" : "Enquire — scoped individually"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 max-w-2xl">
        <EnergySurveyForm />
      </div>
    </div>
  );
}
