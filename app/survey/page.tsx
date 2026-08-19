"use client";

import { useEffect, useState } from "react";
import EnergySurveyForm from "@/components/EnergySurveyForm";

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

      <div className="mt-8 max-w-2xl">
        <EnergySurveyForm />
      </div>
    </div>
  );
}
