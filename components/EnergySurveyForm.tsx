"use client";

import { useState } from "react";
import {
  SPEND_BRACKETS,
  MOTIVATIONS,
  type ConsumptionIntensity,
  type IntensityLevel,
  type EquipmentItem,
} from "@/types/survey";
import { CONSULTATION_HOURLY_RATE_GBP, SURVEY_TIERS, type SurveyTierKey } from "@/lib/pricing";

function emptyEquipmentItem(): EquipmentItem {
  return { name: "", quantity: 1, estimatedWattage: undefined, hoursPerDay: undefined };
}

const inputClasses =
  "mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelClasses = "block text-sm font-medium text-charcoal";

const INTENSITY_ROWS: { key: keyof ConsumptionIntensity; label: string }[] = [
  { key: "hvac", label: "HVAC & Climate Control" },
  { key: "lighting", label: "Lighting Systems" },
  { key: "machinery", label: "Industrial Machinery/Equipment" },
  { key: "it", label: "IT & Data Infrastructure" },
];

export default function EnergySurveyForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [annualSpendBracket, setAnnualSpendBracket] = useState("");
  const [operationsDescription, setOperationsDescription] = useState("");
  const [consumptionIntensity, setConsumptionIntensity] = useState<ConsumptionIntensity>({
    hvac: "low",
    lighting: "low",
    machinery: "low",
    it: "low",
  });
  const [motivations, setMotivations] = useState<string[]>([]);
  const [hasUtilityBills, setHasUtilityBills] = useState<boolean | null>(null);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([emptyEquipmentItem()]);
  const [largestConsumers, setLargestConsumers] = useState("");
  const [urgency, setUrgency] = useState(3);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [wantsConsultation, setWantsConsultation] = useState(false);
  const [consultationHours, setConsultationHours] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  const tier = SURVEY_TIERS[annualSpendBracket as SurveyTierKey];

  function toggleMotivation(value: string) {
    setMotivations((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  }

  function updateEquipmentItem(index: number, patch: Partial<EquipmentItem>) {
    setEquipment((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addEquipmentItem() {
    setEquipment((prev) => [...prev, emptyEquipmentItem()]);
  }

  function removeEquipmentItem(index: number) {
    setEquipment((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  const total = tier?.purchasable
    ? (tier.feeGbp ?? 0) + (wantsConsultation ? consultationHours * CONSULTATION_HOURLY_RATE_GBP : 0)
    : 0;

  const progressChecks = [
    firstName.trim().length > 0,
    lastName.trim().length > 0,
    businessName.trim().length > 0,
    email.includes("@"),
    !!tier,
    operationsDescription.trim().length > 0,
    hasUtilityBills !== null,
    equipment.some((item) => item.name.trim().length > 0),
    termsAccepted,
  ];
  const progressDone = progressChecks.filter(Boolean).length;
  const progressPercent = Math.round((progressDone / progressChecks.length) * 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!tier) {
      setError("Please select your annual spend bracket.");
      return;
    }
    if (hasUtilityBills === null) {
      setError("Please answer whether you have access to your utility bills.");
      return;
    }
    const validEquipment = equipment.filter((item) => item.name.trim().length > 0);
    if (validEquipment.length === 0) {
      setError("Please list at least one piece of equipment.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          businessName,
          email,
          annualSpendBracket,
          operationsDescription,
          consumptionIntensity,
          motivations,
          hasUtilityBills,
          equipment: validEquipment,
          largestConsumers,
          urgency,
          termsAccepted,
          consultationHours: tier.purchasable && wantsConsultation ? consultationHours : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      if (data.inquiry) {
        setInquirySent(true);
        setLoading(false);
        return;
      }
      if (!data.url) {
        throw new Error("Something went wrong.");
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
      setLoading(false);
    }
  }

  if (inquirySent) {
    return (
      <div className="rounded-lg border border-border-muted bg-white p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-charcoal">Request received</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Thanks — the {tier?.name} tier is scoped individually, so we&apos;ve sent your details
          to the Brightbox team. We&apos;ll be in touch by email shortly to discuss availability
          and a quote for your site.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-charcoal">Remote Intake Survey</h2>
      <p className="mt-1 text-sm text-charcoal/70">
        Please provide your details below to assist with your operational footprint assessment.
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-charcoal/60">
          <span>Form progress</span>
          <span>{progressPercent}% complete</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border-muted">
          <div
            className="h-full rounded-full bg-moss transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClasses}>First name *</label>
          <input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClasses}>Last name *</label>
          <input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="businessName" className={labelClasses}>Business name *</label>
          <input id="businessName" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>Email address *</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className={labelClasses}>What is your estimated annual electricity and gas spend? *</legend>
        <div className="mt-2 space-y-2">
          {SPEND_BRACKETS.map((b) => {
            const bTier = SURVEY_TIERS[b.value as SurveyTierKey];
            return (
              <label key={b.value} className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="radio"
                  name="annualSpendBracket"
                  required
                  checked={annualSpendBracket === b.value}
                  onChange={() => setAnnualSpendBracket(b.value)}
                  className="accent-moss"
                />
                {b.label}
                <span className="text-xs text-charcoal/50">
                  — {bTier.name}, {bTier.purchasable ? `£${bTier.feeGbp}` : `from £${bTier.fromGbp?.toLocaleString()}`}
                </span>
              </label>
            );
          })}
        </div>
        {tier && (
          <p className="mt-2 rounded-md bg-cream px-3 py-2 text-xs text-charcoal/70">
            <strong>{tier.name}:</strong> {tier.description}
          </p>
        )}
      </fieldset>

      <div className="mt-6">
        <label htmlFor="operationsDescription" className={labelClasses}>
          Briefly describe your site or business and the day to day operations *
        </label>
        <textarea
          id="operationsDescription"
          required
          rows={4}
          value={operationsDescription}
          onChange={(e) => setOperationsDescription(e.target.value)}
          className={inputClasses}
        />
      </div>

      <fieldset className="mt-6">
        <legend className={labelClasses}>
          How would you rate the energy consumption intensity of the following areas within your facility?
        </legend>
        <div className="mt-3 space-y-3">
          {INTENSITY_ROWS.map((row) => (
            <div key={row.key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-charcoal">{row.label}</span>
              <div className="flex gap-4">
                {(["low", "medium", "high"] as IntensityLevel[]).map((level) => (
                  <label key={level} className="flex items-center gap-1.5 text-sm capitalize text-charcoal/70">
                    <input
                      type="radio"
                      name={`intensity-${row.key}`}
                      checked={consumptionIntensity[row.key] === level}
                      onChange={() => setConsumptionIntensity((prev) => ({ ...prev, [row.key]: level }))}
                      className="accent-moss"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className={labelClasses}>
          What are your primary motivations for seeking an operational efficiency assessment?
        </legend>
        <div className="mt-2 space-y-2">
          {MOTIVATIONS.map((m) => (
            <label key={m.value} className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={motivations.includes(m.value)}
                onChange={() => toggleMotivation(m.value)}
                className="accent-moss"
              />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className={labelClasses}>Do you have access to utility bills for the last 12 months? *</legend>
        <div className="mt-2 flex gap-6">
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="radio" name="hasUtilityBills" required checked={hasUtilityBills === true} onChange={() => setHasUtilityBills(true)} className="accent-moss" />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="radio" name="hasUtilityBills" required checked={hasUtilityBills === false} onChange={() => setHasUtilityBills(false)} className="accent-moss" />
            No
          </label>
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className={labelClasses}>Equipment profile *</legend>
        <p className="mt-1 text-sm text-charcoal/70">
          List your biggest energy-using equipment — HVAC units, fridges/freezers, machinery,
          water heaters, lighting rigs, server racks, etc. Wattage and daily runtime are optional,
          but the more you can estimate, the more precise your savings calculations will be.
        </p>
        <div className="mt-3 space-y-3">
          {equipment.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 rounded-md border border-border-muted p-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-end"
            >
              <div>
                <label className="block text-xs font-medium text-charcoal/70">
                  Item {index === 0 ? "*" : ""}
                </label>
                <input
                  required={index === 0}
                  placeholder="e.g. Walk-in freezer"
                  value={item.name}
                  onChange={(e) => updateEquipmentItem(index, { name: e.target.value })}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateEquipmentItem(index, { quantity: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70">Watts (approx.)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="optional"
                  value={item.estimatedWattage ?? ""}
                  onChange={(e) =>
                    updateEquipmentItem(index, {
                      estimatedWattage: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-charcoal/70">Hours/day</label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  placeholder="optional"
                  value={item.hoursPerDay ?? ""}
                  onChange={(e) =>
                    updateEquipmentItem(index, {
                      hoursPerDay: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className={inputClasses}
                />
              </div>
              <button
                type="button"
                onClick={() => removeEquipmentItem(index)}
                disabled={equipment.length === 1}
                className="h-10 rounded-md border border-border-muted px-3 text-sm text-charcoal/70 transition hover:border-moss disabled:cursor-not-allowed disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addEquipmentItem}
          className="mt-3 rounded-md border border-moss px-3 py-1.5 text-sm font-medium text-moss transition hover:bg-moss/10"
        >
          + Add another item
        </button>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="largestConsumers" className={labelClasses}>
          Anything else worth noting about your biggest energy users? (optional)
        </label>
        <textarea
          id="largestConsumers"
          rows={2}
          value={largestConsumers}
          onChange={(e) => setLargestConsumers(e.target.value)}
          className={inputClasses}
        />
      </div>

      <fieldset className="mt-6">
        <legend className={labelClasses}>On a scale of 1-5, how urgent is your need for energy optimization solutions?</legend>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-xs text-charcoal/60">Not urgent</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="flex flex-col items-center gap-1 text-sm text-charcoal">
              <input type="radio" name="urgency" checked={urgency === n} onChange={() => setUrgency(n)} className="accent-moss" />
              {n}
            </label>
          ))}
          <span className="text-xs text-charcoal/60">High urgency/Critical</span>
        </div>
      </fieldset>

      <div className="mt-6 rounded-md border border-border-muted bg-cream p-4">
        <label className="flex items-start gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 accent-moss"
          />
          I agree to the Brightbox Efficiency{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            Terms &amp; Conditions
          </a>{" "}
          and understand that my report is generated based strictly on my submitted utility data profile. *
        </label>
      </div>

      {tier?.purchasable && (
        <div className="mt-6 rounded-md border border-border-muted bg-white p-4">
          <label className="flex items-start gap-2 text-sm font-medium text-charcoal">
            <input
              type="checkbox"
              checked={wantsConsultation}
              onChange={(e) => setWantsConsultation(e.target.checked)}
              className="mt-0.5 accent-moss"
            />
            I&apos;d also like a follow-up consultation call (£{CONSULTATION_HOURLY_RATE_GBP}/hour)
          </label>
          {wantsConsultation && (
            <div className="mt-3 flex items-center gap-3 pl-6">
              <button
                type="button"
                onClick={() => setConsultationHours((h) => Math.max(1, h - 1))}
                className="h-8 w-8 rounded-md border border-border-muted text-charcoal transition hover:border-moss"
              >
                −
              </button>
              <span className="text-sm text-charcoal">{consultationHours} hour{consultationHours === 1 ? "" : "s"}</span>
              <button
                type="button"
                onClick={() => setConsultationHours((h) => Math.min(20, h + 1))}
                className="h-8 w-8 rounded-md border border-border-muted text-charcoal transition hover:border-moss"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}

      {tier?.purchasable && (
        <div className="mt-6 rounded-md border border-border-muted bg-cream p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">Total due</p>
          <p className="mt-1 text-2xl font-semibold text-moss">£{total.toLocaleString()}</p>
          <p className="mt-1 text-xs text-charcoal/50">
            £{tier.feeGbp} survey fee
            {wantsConsultation ? ` + ${consultationHours} × £${CONSULTATION_HOURLY_RATE_GBP} consultation` : ""}
          </p>
        </div>
      )}

      {tier && !tier.purchasable && (
        <div className="mt-6 rounded-md border border-border-muted bg-cream p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">
            {tier.name} — from £{tier.fromGbp?.toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-charcoal/70">
            This tier is scoped individually to your site, so it isn&apos;t booked online. Submit
            your details below and we&apos;ll follow up by email to arrange availability and a
            quote — no payment is taken now.
          </p>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading || !tier}
        className="mt-6 w-full rounded-md bg-gold px-4 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60 sm:w-auto"
      >
        {loading
          ? tier?.purchasable
            ? "Redirecting to payment…"
            : "Sending request…"
          : !tier
            ? "Select your spend bracket to continue"
            : tier.purchasable
              ? `Continue to payment — £${total}`
              : "Request availability"}
      </button>
    </form>
  );
}
