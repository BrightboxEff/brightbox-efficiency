"use client";

import { useState } from "react";
import type { CalculateRequest } from "@/types";

interface CalculatorFormProps {
  onSubmit: (input: CalculateRequest) => void;
  loading: boolean;
}

const inputClasses =
  "mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelClasses = "block text-sm font-medium text-charcoal";

export default function CalculatorForm({ onSubmit, loading }: CalculatorFormProps) {
  const [postcode, setPostcode] = useState("");
  const [roofSizeM2, setRoofSizeM2] = useState("");
  const [systemSizeKwp, setSystemSizeKwp] = useState("");
  const [systemCostGbp, setSystemCostGbp] = useState("");
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      postcode,
      roofSizeM2: roofSizeM2 ? Number(roofSizeM2) : undefined,
      systemSizeKwp: Number(systemSizeKwp),
      systemCostGbp: Number(systemCostGbp),
      batteryCapacityKwh: batteryCapacityKwh ? Number(batteryCapacityKwh) : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border-muted bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-charcoal">Customer &amp; system details</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="postcode" className={labelClasses}>
            Postcode
          </label>
          <input
            id="postcode"
            type="text"
            required
            placeholder="SW1A 1AA"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="roofSizeM2" className={labelClasses}>
            Roof size (m²)
          </label>
          <input
            id="roofSizeM2"
            type="number"
            min={0}
            step="0.1"
            placeholder="25"
            value={roofSizeM2}
            onChange={(e) => setRoofSizeM2(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="systemSizeKwp" className={labelClasses}>
            System size (kWp)
          </label>
          <input
            id="systemSizeKwp"
            type="number"
            required
            min={0}
            step="0.1"
            placeholder="4.2"
            value={systemSizeKwp}
            onChange={(e) => setSystemSizeKwp(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="systemCostGbp" className={labelClasses}>
            System cost (£)
          </label>
          <input
            id="systemCostGbp"
            type="number"
            required
            min={0}
            step="1"
            placeholder="6500"
            value={systemCostGbp}
            onChange={(e) => setSystemCostGbp(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="batteryCapacityKwh" className={labelClasses}>
            Battery size (kWh)
          </label>
          <input
            id="batteryCapacityKwh"
            type="number"
            min={0}
            step="0.1"
            placeholder="5 (leave blank if no battery)"
            value={batteryCapacityKwh}
            onChange={(e) => setBatteryCapacityKwh(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-gold px-4 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Calculating…" : "Calculate payback"}
      </button>
    </form>
  );
}
