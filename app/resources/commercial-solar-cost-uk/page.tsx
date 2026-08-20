import Link from "next/link";

export const metadata = {
  title: "Commercial Solar Cost UK — Brightbox Efficiency",
};

export default function CommercialSolarCostPage() {
  return (
    <article className="mx-auto max-w-3xl py-12">
      <Link href="/resources" className="text-sm text-moss underline underline-offset-2">
        ← Resources
      </Link>
      <h1 className="mt-3 text-3xl font-semibold text-charcoal">
        How much does commercial solar cost in the UK?
      </h1>

      <div className="mt-6 space-y-5 text-charcoal/80">
        <p>
          There&apos;s no single answer here, because commercial solar cost is driven far more by
          site-specific factors than by a simple £/kWp headline figure. That said, the main
          drivers are consistent across almost every project, and knowing them makes it much
          easier to sanity-check quotes.
        </p>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">What actually drives the cost</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>System size and roof type</strong> — larger systems generally have a lower
            cost per kWp, but a complex or aged roof (multiple pitches, existing penetrations,
            structural reinforcement needed) can push costs up regardless of size.
          </li>
          <li>
            <strong>Grid connection</strong> — if your site needs a distribution network operator
            (DNO) upgrade to export or use the generation you&apos;re planning, that can be one of the
            largest single line items, and it&apos;s easy to miss in an early estimate.
          </li>
          <li>
            <strong>Roof condition and access</strong> — scaffolding, working at height
            requirements, and whether the roof needs remedial work before installation all affect
            labour cost significantly.
          </li>
          <li>
            <strong>Inverter and mounting choice</strong> — string vs. optimised systems, and
            ballasted vs. penetrative mounting, trade off upfront cost against long-term
            performance and roof warranty implications.
          </li>
          <li>
            <strong>Battery storage, if included</strong> — adding BESS increases upfront cost
            substantially, and whether it pays for itself depends heavily on your load profile and
            tariff structure (see our{" "}
            <Link href="/resources/bess-payback-guide" className="text-moss underline underline-offset-2">
              BESS payback guide
            </Link>
            ).
          </li>
        </ul>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">Questions worth asking before you get quotes</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>What roof survey has actually been done, or is this a desktop estimate?</li>
          <li>Is a DNO application included in the quote, or a separate cost?</li>
          <li>What&apos;s the assumed system loss percentage, and is it justified for your roof orientation and shading?</li>
          <li>What ongoing maintenance is included, and for how long?</li>
          <li>What happens to the warranty if something else on the roof needs work later?</li>
        </ul>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">The honest starting point</h2>
        <p>
          Before spending money on formal quotes, a postcode-based generation and payback estimate
          gets you a realistic starting range in minutes. Try our{" "}
          <Link href="/calculator" className="text-moss underline underline-offset-2">
            solar payback calculator
          </Link>{" "}
          — it uses real solar irradiance data (PVGIS) for your location, not a flat national
          average.
        </p>
      </div>
    </article>
  );
}
