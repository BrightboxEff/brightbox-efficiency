"use client";

import { useState } from "react";

const HOURLY_RATE_GBP = 60;

export default function TutoringPurchaseForm() {
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = hours * HOURLY_RATE_GBP;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tutoring-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, email }),
      });
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
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border-muted bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-charcoal">Book tutoring hours</h2>
      <p className="mt-1 text-sm text-charcoal/70">£{HOURLY_RATE_GBP}/hour, 1:1 with a Brightbox engineer.</p>

      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-charcoal">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss sm:w-80"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="hours" className="block text-sm font-medium text-charcoal">
          Hours
        </label>
        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHours((h) => Math.max(1, h - 1))}
            className="h-9 w-9 rounded-md border border-border-muted text-charcoal transition hover:border-moss"
            aria-label="Decrease hours"
          >
            −
          </button>
          <input
            id="hours"
            type="number"
            min={1}
            max={20}
            value={hours}
            onChange={(e) =>
              setHours(Math.min(20, Math.max(1, Number(e.target.value) || 1)))
            }
            className="w-16 rounded-md border border-border-muted bg-white px-2 py-2 text-center text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          />
          <button
            type="button"
            onClick={() => setHours((h) => Math.min(20, h + 1))}
            className="h-9 w-9 rounded-md border border-border-muted text-charcoal transition hover:border-moss"
            aria-label="Increase hours"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border-muted bg-cream p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">Total</p>
        <p className="mt-1 text-2xl font-semibold text-moss">£{total.toLocaleString()}</p>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-md bg-gold px-4 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Redirecting to payment…" : `Buy ${hours} hour${hours === 1 ? "" : "s"} — £${total}`}
      </button>
    </form>
  );
}
