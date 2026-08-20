import Image from "next/image";
import Link from "next/link";
import { CostIcon, BatteryIcon, ReceiptIcon } from "@/components/ServiceIcons";

export const metadata = {
  title: "Resources — Brightbox Efficiency",
};

const articles = [
  {
    href: "/resources/commercial-solar-cost-uk",
    title: "How much does commercial solar cost in the UK?",
    description:
      "A practical breakdown of what drives commercial solar PV costs, and the questions worth asking before you get quotes.",
    Icon: CostIcon,
  },
  {
    href: "/resources/bess-payback-guide",
    title: "BESS payback: what actually affects it",
    description:
      "Battery storage paybacks vary wildly between sites. Here's what actually moves the numbers, beyond the headline battery price.",
    Icon: BatteryIcon,
  },
  {
    href: "/resources/reading-your-utility-bill",
    title: "Reading your utility bill for hidden waste",
    description:
      "Most of the easiest savings are sitting in plain sight on your existing invoices. Here's what to look for.",
    Icon: ReceiptIcon,
  },
];

export default function ResourcesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="relative h-40 overflow-hidden rounded-xl sm:h-52">
        <Image
          src="/rooftop-site-photo.jpg"
          alt="Commercial rooftop solar array"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="relative flex h-full flex-col items-start justify-end p-6">
          <h1 className="text-3xl font-semibold text-cream">Resources</h1>
        </div>
      </div>
      <p className="mt-4 text-charcoal/70">
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
            className="flex items-start gap-4 rounded-lg border border-border-muted bg-white p-5 shadow-sm transition hover:border-moss"
          >
            <a.Icon className="h-7 w-7 shrink-0 text-moss" />
            <div>
              <h2 className="font-semibold text-charcoal">{a.title}</h2>
              <p className="mt-1.5 text-sm text-charcoal/70">{a.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
