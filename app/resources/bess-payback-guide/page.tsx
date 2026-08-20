import Link from "next/link";

export const metadata = {
  title: "BESS Payback Guide — Brightbox Efficiency",
};

export default function BessPaybackGuidePage() {
  return (
    <article className="mx-auto max-w-3xl py-12">
      <Link href="/resources" className="text-sm text-moss underline underline-offset-2">
        ← Resources
      </Link>
      <h1 className="mt-3 text-3xl font-semibold text-charcoal">
        BESS payback: what actually affects it
      </h1>

      <div className="mt-6 space-y-5 text-charcoal/80">
        <p>
          Battery Energy Storage System (BESS) payback periods vary enormously between sites —
          two facilities with an identical battery installed can see very different returns. The
          battery price itself is rarely the deciding factor; how it&apos;s used is.
        </p>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">What moves the numbers most</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Your load profile shape</strong> — a battery earns its keep by shifting energy
            from cheap/self-generated periods to expensive ones. A site with a flat, predictable
            demand curve gets far less value from storage than one with sharp peaks it can shave.
          </li>
          <li>
            <strong>Tariff structure</strong> — time-of-use tariffs, demand charges, and export
            rates all change the maths substantially. The same battery can be marginal on a flat
            tariff and clearly worthwhile on a peak/off-peak one.
          </li>
          <li>
            <strong>Self-consumption vs. export</strong> — if you already export most excess solar
            generation, a battery competes with your export income, not just with grid import
            price. That&apos;s a very different calculation to a site that currently wastes generation.
          </li>
          <li>
            <strong>Cycling and degradation</strong> — how hard you cycle the battery affects both
            the annual value it delivers and how quickly its usable capacity fades. A conservative
            cycling strategy can extend useful life meaningfully.
          </li>
          <li>
            <strong>Grid services and flexibility markets</strong> — depending on your site and
            connection, additional revenue may be available beyond simple bill savings (e.g.
            demand response participation). This is often overlooked in a first-pass payback
            estimate.
          </li>
          <li>
            <strong>Resilience value</strong> — backup power during outages has real value that
            doesn&apos;t show up in a pure £/kWh payback calculation, but matters a lot for some sites.
          </li>
        </ul>

        <h2 className="pt-3 text-lg font-semibold text-charcoal">Why generic BESS payback figures are misleading</h2>
        <p>
          Any &quot;BESS pays back in X years&quot; figure you see quoted generically is really describing
          one specific load profile and tariff — not your site. The honest version of that
          statement is always &quot;it depends,&quot; and the factors above are what it depends on. A
          proper assessment models your actual half-hourly consumption against your actual tariff,
          not a generic assumption.
        </p>

        <p>
          Our{" "}
          <Link href="/calculator" className="text-moss underline underline-offset-2">
            solar payback calculator
          </Link>{" "}
          includes a battery comparison view that models this against your specific inputs rather
          than a flat industry average.
        </p>
      </div>
    </article>
  );
}
