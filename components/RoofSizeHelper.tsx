"use client";

import { useState } from "react";
import { BUILDING_PRESETS, ROOF_TYPES, estimateRoofAreaM2 } from "@/lib/roofPresets";
import RoofTypeIcon from "@/components/RoofTypeIcon";

interface RoofSizeHelperProps {
  roofTypeId: string;
  onRoofTypeChange: (id: string) => void;
  onApplyRoofSize: (roofSizeM2: number) => void;
}

export default function RoofSizeHelper({
  roofTypeId,
  onRoofTypeChange,
  onApplyRoofSize,
}: RoofSizeHelperProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const estimate =
    length && width ? estimateRoofAreaM2(Number(length), Number(width), roofTypeId) : null;

  return (
    <div className="rounded-md border border-border-muted bg-cream/60 p-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
          Not sure of the roof size? Start from a building type
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUILDING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyRoofSize(preset.roofSizeM2)}
              className="rounded-full border border-border-muted bg-white px-3 py-1.5 text-xs font-medium text-charcoal/70 transition hover:border-gold hover:text-charcoal"
              title={`~${preset.roofSizeM2}m²`}
            >
              {preset.label} <span className="text-charcoal/40">~{preset.roofSizeM2}m²</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">Roof shape</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROOF_TYPES.map((type) => {
            const active = roofTypeId === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onRoofTypeChange(type.id)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-md border px-4 py-2 transition ${
                  active
                    ? "border-moss bg-moss/10 text-moss"
                    : "border-border-muted bg-white text-charcoal/60 hover:border-moss/50"
                }`}
              >
                <RoofTypeIcon type={type.id as "pitched" | "hip" | "flat"} className="h-6 w-8" />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowCalculator((v) => !v)}
          className="text-xs font-medium text-moss underline underline-offset-2"
        >
          {showCalculator ? "Hide" : "Or calculate from building dimensions"}
        </button>

        {showCalculator && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:items-end">
            <div>
              <label htmlFor="footprintLength" className="block text-xs text-charcoal/60">
                Length (m)
              </label>
              <input
                id="footprintLength"
                type="number"
                min={0}
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="mt-1 w-full rounded-md border border-border-muted bg-white px-2 py-1.5 text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
              />
            </div>
            <div>
              <label htmlFor="footprintWidth" className="block text-xs text-charcoal/60">
                Width (m)
              </label>
              <input
                id="footprintWidth"
                type="number"
                min={0}
                step="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1 w-full rounded-md border border-border-muted bg-white px-2 py-1.5 text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3 sm:col-span-2">
              {estimate !== null && (
                <>
                  <span className="text-sm text-charcoal">≈ {estimate}m²</span>
                  <button
                    type="button"
                    onClick={() => onApplyRoofSize(estimate)}
                    className="rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-charcoal transition hover:bg-gold/90"
                  >
                    Use this estimate
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        <p className="mt-2 text-xs text-charcoal/50">
          Footprint × roof-shape factor — a rough estimate, not a substitute for a site survey.
        </p>
      </div>
    </div>
  );
}
