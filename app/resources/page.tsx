import Link from "next/link";

export const metadata = {
  title: "Resources — Brightbox Efficiency",
};

const articles = [
  {
    href: "/resources/commercial-solar-cost-uk",
    title: "How much does commercial solar cost in the UK?",
    description:
      "A practical breakdown of what drives commercial solar PV costs, and the questions worth asking before you get quotes.",
  },
  {
    href: "/resources/bess-payback-guide",
    title: "BESS payback: what actually affects it",
    description:
      "Battery storage paybacks vary wildly between sites. Here's what actually moves the numbers, beyond the headline battery price.",
  },
  {
    href: "/resources/reading-your-utility-bill",
    title: "Reading your utility bill for hidden waste",
    description:
      "Most of the easiest savings are sitting in plain sight on your existing invoices. Here's what to look for.",
  },
];

export default function ResourcesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-semibold text-charcoal">Resources</h1>
      <p className="mt-2 text-charcoal/70">
        Practical, no-nonsense guides on solar, battery storage, and energy efficiency — the same
        thinking behind our{" "}
        <Link href="/survey" className="text-moss underline underline-offset-2">
          energy efficiency survey
        </Link>
        , made public.
      </p>

      <div className="mt-8 space-y-5">
        {articles.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="block rounded-lg border border-border-muted bg-white p-5 shadow-sm transition hover:border-moss"
          >
            <h2 className="font-semibold text-charcoal">{a.title}</h2>
            <p className="mt-1.5 text-sm text-charcoal/70">{a.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
