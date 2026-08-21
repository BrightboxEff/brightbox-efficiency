"use client";

import { useState } from "react";
import type { CalculatorFormValues } from "@/types";
import { DEFAULT_ROOF_TYPE_ID, getRoofType } from "@/lib/roofPresets";
import SliderField from "@/components/SliderField";
import RoofSizeHelper from "@/components/RoofSizeHelper";
import AddressLookup from "@/components/AddressLookup";

interface CalculatorFormProps {
  onSubmit: (input: CalculatorFormValues) => void;
  loading: boolean;
}

const inputClasses =
  "mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelClasses = "block text-sm font-medium text-charcoal";

export default function CalculatorForm({ onSubmit, loading }: CalculatorFormProps) {
  const [projectName, setProjectName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [roofSizeM2, setRoofSizeM2] = useState("");
  const [roofType, setRoofType] = useState(DEFAULT_ROOF_TYPE_ID);
  const [systemSizeKwp, setSystemSizeKwp] = useState("4");
  const [systemCostGbp, setSystemCostGbp] = useState("6500");
  const [batteryCapacityKwh, setBatteryCapacityKwh] = useState("");
  const [batteryCostGbp, setBatteryCostGbp] = useState("");
  const [systemSizeAutoSet, setSystemSizeAutoSet] = useState(false);

  const MAX_SYSTEM_SIZE_KWP = 20;

  function snapSystemSizeToRoof(sizeM2: number, roofTypeId: string) {
    if (!sizeM2) return;
    const maxViableKwp = sizeM2 / getRoofType(roofTypeId).usableM2PerKwp;
    const capped = Math.min(MAX_SYSTEM_SIZE_KWP, Math.round(maxViableKwp * 10) / 10);
    setSystemSizeKwp(String(capped));
    setSystemSizeAutoSet(true);
  }

  function handleRoofSizeChange(value: string) {
    setRoofSizeM2(value);
    snapSystemSizeToRoof(value ? Number(value) : 0, roofType);
  }

  function handleRoofTypeChange(id: string) {
    setRoofType(id);
    snapSystemSizeToRoof(roofSizeM2 ? Number(roofSizeM2) : 0, id);
  }

  function handleApplyRoofSize(size: number) {
    setRoofSizeM2(String(size));
    snapSystemSizeToRoof(size, roofType);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      projectName: projectName || undefined,
      postcode,
      addressLine: addressLine || undefined,
      roofSizeM2: roofSizeM2 ? Number(roofSizeM2) : undefined,
      roofType,
      systemSizeKwp: Number(systemSizeKwp),
      systemCostGbp: Number(systemCostGbp),
      batteryCapacityKwh: batteryCapacityKwh ? Number(batteryCapacityKwh) : undefined,
      batteryCostGbp: batteryCostGbp ? Number(batteryCostGbp) : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border-muted bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-charcoal">Customer &amp; system details</h2>

      <div className="mt-4">
        <label htmlFor="projectName" className={labelClasses}>
          Project / business name <span className="font-normal text-charcoal/50">— optional</span>
        </label>
        <input
          id="projectName"
          type="text"
          placeholder="e.g. Smith Residence or Acme Ltd"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className={`${inputClasses} sm:w-96`}
        />
      </div>

      <div className="mt-4">
        <AddressLookup
          postcode={postcode}
          onPostcodeChange={setPostcode}
          addressLine={addressLine}
          onAddressLineChange={setAddressLine}
        />
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <SliderField
            id="roofSizeM2"
            label="Roof size"
            unit="m²"
            min={0}
            max={150}
            step={1}
            value={roofSizeM2}
            onChange={handleRoofSizeChange}
          />
          <div className="mt-3">
            <RoofSizeHelper
              roofTypeId={roofType}
              onRoofTypeChange={handleRoofTypeChange}
              onApplyRoofSize={handleApplyRoofSize}
            />
          </div>
        </div>

        <SliderField
          id="systemSizeKwp"
          label="System size"
          unit="kWp"
          required
          min={0}
          max={20}
          step={0.1}
          value={systemSizeKwp}
          onChange={(value) => {
            setSystemSizeKwp(value);
            setSystemSizeAutoSet(false);
          }}
          helperText={
            systemSizeAutoSet
              ? "Suggested from your roof size — drag or type to fine-tune."
              : undefined
          }
        />

        <SliderField
          id="systemCostGbp"
          label="System cost"
          unit="£"
          required
          min={0}
          max={30000}
          step={50}
          value={systemCostGbp}
          onChange={setSystemCostGbp}
        />

        <SliderField
          id="batteryCapacityKwh"
          label="Battery size — optional"
          unit="kWh"
          min={0}
          max={20}
          step={0.5}
          value={batteryCapacityKwh}
          onChange={setBatteryCapacityKwh}
          helperText="Not sure if you need one? Most homes don't start with a battery — a typical size, if you want backup power or to store more of your own solar, is around 4-5kWh for a house this size. Leave at 0 to skip."
        />

        <SliderField
          id="batteryCostGbp"
          label="Battery cost — optional"
          unit="£"
          min={0}
          max={10000}
          step={50}
          value={batteryCostGbp}
          onChange={setBatteryCostGbp}
          helperText="Portion of the system cost that's the battery — enables a battery-specific payback figure below."
        />
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
