"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FlagStatus } from "@/lib/performance";
import { MONTH_LABELS } from "@/types";

export interface MonitoredSystemWithStatus {
  id: string;
  systemReference: string;
  postcode: string;
  addressLine: string | null;
  systemSizeKwp: number;
  monthlyBaselineKwh: number[];
  readingCount: number;
  status: FlagStatus;
  summary: string;
  likelyCause: string | null;
}

const STATUS_STYLES: Record<FlagStatus, string> = {
  healthy: "bg-moss/10 text-moss border-moss/30",
  watch: "bg-gold/10 text-gold border-gold/30",
  alert: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<FlagStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  alert: "Alert",
};

const now = new Date();

function SystemCard({ system }: { system: MonitoredSystemWithStatus }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [actualKwh, setActualKwh] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogReading(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/performance-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemId: system.id,
          readingMonth: Number(month),
          readingYear: Number(year),
          actualKwh: Number(actualKwh),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setActualKwh("");
      setExpanded(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (!confirm(`Remove "${system.systemReference}" from monitoring? This can't be undone.`)) return;

    const res = await fetch("/api/monitored-systems", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: system.id }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-lg border border-border-muted bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-charcoal">{system.systemReference}</h3>
          <p className="text-sm text-charcoal/60">
            {system.addressLine ? `${system.addressLine} · ` : ""}
            {system.postcode} · {system.systemSizeKwp} kWp
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[system.status]}`}
        >
          {STATUS_LABELS[system.status]}
        </span>
      </div>

      <p className="mt-3 text-sm text-charcoal/80">{system.summary}</p>
      {system.likelyCause && (
        <p className="mt-2 rounded-md bg-cream px-3 py-2 text-sm text-charcoal/70">
          {system.likelyCause}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-md border border-moss px-3 py-1.5 text-sm font-medium text-moss transition hover:bg-moss hover:text-cream"
        >
          {expanded ? "Cancel" : "+ Log a reading"}
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm text-charcoal/50 underline underline-offset-2 hover:text-red-700"
        >
          Remove
        </button>
        <span className="text-xs text-charcoal/40">
          {system.readingCount} reading{system.readingCount === 1 ? "" : "s"} logged
        </span>
      </div>

      {expanded && (
        <form
          onSubmit={handleLogReading}
          className="mt-4 flex flex-col gap-3 rounded-md border border-border-muted bg-cream p-4 sm:flex-row sm:items-end"
        >
          <div>
            <label className="block text-xs font-medium text-charcoal/70">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 rounded-md border border-border-muted bg-white px-2 py-1.5 text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
            >
              {MONTH_LABELS.map((label, i) => (
                <option key={label} value={i + 1}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-charcoal/70">Year</label>
            <input
              type="number"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 w-24 rounded-md border border-border-muted bg-white px-2 py-1.5 text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-charcoal/70">Actual kWh generated</label>
            <input
              type="number"
              required
              min={0}
              step="0.1"
              placeholder="from the customer's inverter app or smart meter"
              value={actualKwh}
              onChange={(e) => setActualKwh(e.target.value)}
              className="mt-1 w-full rounded-md border border-border-muted bg-white px-2 py-1.5 text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-9 rounded-md bg-moss px-4 text-sm font-medium text-cream transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save reading"}
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default function PerformanceMonitorDashboard({
  systems,
}: {
  systems: MonitoredSystemWithStatus[];
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Performance Monitor</h1>
      <p className="mt-2 max-w-2xl text-charcoal/70">
        Systems you&apos;re tracking, with an automatic status based on actual generation vs. each
        system&apos;s saved baseline.
      </p>

      {systems.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border-muted bg-white p-8 text-center">
          <p className="text-charcoal/70">No systems being monitored yet.</p>
          <p className="mt-1 text-sm text-charcoal/50">
            Run a quote on the{" "}
            <Link href="/calculator" className="text-moss underline underline-offset-2">
              calculator
            </Link>{" "}
            and save it to start tracking a system&apos;s performance.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {systems.map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </div>
      )}
    </div>
  );
}
