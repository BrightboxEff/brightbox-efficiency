"use client";

import { useState } from "react";

interface BillingActionsProps {
  hasActiveSubscription: boolean;
}

export default function BillingActions({ hasActiveSubscription }: BillingActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go(endpoint: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {hasActiveSubscription ? (
        <button
          onClick={() => go("/api/stripe/portal")}
          disabled={loading}
          className="rounded-md bg-moss px-5 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:opacity-60"
        >
          {loading ? "Opening…" : "Manage billing"}
        </button>
      ) : (
        <button
          onClick={() => go("/api/stripe/checkout")}
          disabled={loading}
          className="rounded-md bg-gold px-5 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60"
        >
          {loading ? "Redirecting…" : "Subscribe — £19/month"}
        </button>
      )}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
