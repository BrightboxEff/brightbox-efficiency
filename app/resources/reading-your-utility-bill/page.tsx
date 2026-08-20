import Link from "next/link";
import { ReceiptIcon } from "@/components/ServiceIcons";

export const metadata = {
  title: "Reading Your Utility Bill — Brightbox Efficiency",
};

export default function ReadingYourUtilityBillPage() {
  return (
    <article className="mx-auto max-w-3xl py-12">
      <Link href="/resources" className="text-sm text-moss underline underline-offset-2">
        ← Resources
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <ReceiptIcon className="h-8 w-8 shrink-0 text-moss" />
        <h1 className="text-3xl font-semibold text-charcoal">
          Reading your utility bill for hidden waste
        </h1>
      </div>

      <div className="mt-6 space-y-5 text-charcoal/80">
        <p>
          Most businesses look at their utility bill once a month, just long enough to check the
          total. That&apos;s understandable, but it also means the easiest, zero-cost savings —
          the ones that don&apos;t need a survey, a consultant, or new equipment — usually go
          unnoticed for years.
        </p>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">What to actually look at</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Baseload (your lowest overnight/weekend usage)</strong> — this is roughly what
            you use when nothing should be running. If it&apos;s high relative to your daytime peak, it
            usually means equipment left on unnecessarily: HVAC, lighting, chillers, or standby
            loads on machinery.
          </li>
          <li>
            <strong>Standing charges vs. unit rates</strong> — check both are competitive for your
            contract type, not just the headline unit rate. Standing charges are easy to overlook
            and vary more between suppliers than people expect.
          </li>
          <li>
            <strong>Maximum demand / capacity charges</strong> — if your bill includes a demand or
            capacity charge, a single short spike can set the charge for the whole billing period.
            Look for whether your contracted capacity actually matches what you use.
          </li>
          <li>
            <strong>Month-to-month consistency</strong> — a sudden, unexplained jump is worth
            investigating immediately; it&apos;s often a fault (a stuck damper, a failed timer, a
            malfunctioning compressor) rather than genuinely higher demand.
          </li>
          <li>
            <strong>Seasonal patterns that don&apos;t match your operations</strong> — if your spend
            rises in summer but your business doesn&apos;t get busier, that&apos;s frequently cooling
            running harder than it needs to, not more legitimate demand.
          </li>
        </ul>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">Why 12 months of bills matters</h2>
        <p>
          A single bill tells you almost nothing on its own — it&apos;s the pattern across a full year
          that reveals whether something&apos;s actually wrong or just seasonal. That&apos;s why a proper
          assessment always asks for 12 consecutive months, not a snapshot.
        </p>

        <p>
          If you&apos;d rather have this done properly against your actual equipment and bills, that&apos;s
          exactly what our{" "}
          <Link href="/survey" className="text-moss underline underline-offset-2">
            energy efficiency survey
          </Link>{" "}
          does.
        </p>
      </div>
    </article>
  );
}
