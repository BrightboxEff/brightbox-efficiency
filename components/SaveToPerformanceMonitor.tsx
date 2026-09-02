"use client";

import { useState } from "react";
import Link from "next/link";

interface SaveToPerformanceMonitorProps {
  postcode: string;
  addressLine?: string;
  projectName?: string;
  systemSizeKwp: number;
  monthlyBaselineKwh: number[];
}

export default function SaveToPerformanceMonitor({
  postcode,
  addressLine,
  projectName,
  systemSizeKwp,
  monthlyBaselineKwh,
}: SaveToPerformanceMonitorProps) {
  const [systemReference, setSystemReference] = useState(projectName ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/monitored-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemReference,
          postcode,
          addressLine,
          systemSizeKwp,
          monthlyBaselineKwh,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-charcoal">Track this system&apos;s performance</h2>
      <p className="mt-1 text-sm text-charcoal/70">
        Save this quote&apos;s expected generation as a baseline, then log actual monthly readings
        later to get an automatic healthy/watch/alert status — no re-entry of the expected figures
        needed.
      </p>

      {saved ? (
        <p className="mt-4 rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
          Saved.{" "}
          <Link href="/performance-monitor" className="font-medium text-moss underline underline-offset-2">
            Go to your Performance Monitor dashboard →
          </Link>
        </p>
      ) : (
        <form onSubmit={handleSave} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="systemReference" className="block text-sm font-medium text-charcoal">
              Label for this system
            </label>
            <input
              id="systemReference"
              required
              placeholder="e.g. Smith, 14 Oak Road"
              value={systemReference}
              onChange={(e) => setSystemReference(e.target.value)}
              className="mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save to Performance Monitor"}
          </button>
        </form>
      )}

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
