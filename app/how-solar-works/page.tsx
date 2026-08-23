import Image from "next/image";
import Link from "next/link";
import SolarFlowDiagram from "@/components/SolarFlowDiagram";

export const metadata = {
  title: "How Solar Works — Brightbox Efficiency",
};

const steps = [
  {
    title: "Sunlight hits your panels",
    description:
      "Solar panels are made of photovoltaic (PV) cells that generate direct current (DC) electricity whenever daylight hits them — even on an overcast day, just less of it.",
  },
  {
    title: "The inverter converts it to usable power",
    description:
      "Your home and the UK grid both run on alternating current (AC), not DC. The inverter — a box usually mounted near your meter — converts the panels' raw DC output into AC electricity your appliances can actually use.",
  },
  {
    title: "Your home uses it first",
    description:
      "Whatever you're using at that moment — kettle, lights, freezer, EV charger — draws from your solar generation before it draws from the grid, so you're not paying a supplier for power you're already making.",
  },
  {
    title: "A battery stores the rest, if you have one",
    description:
      "Extra generation you're not using immediately can charge a home battery instead of going to waste, so you can draw on stored solar power in the evening or at night rather than buying it back from the grid.",
  },
  {
    title: "Surplus power is exported and paid for",
    description:
      "Once your home (and battery, if fitted) has what it needs, any leftover generation flows out to the national grid automatically — and you get paid for it. See below for how that payment actually works.",
  },
];

export default function HowSolarWorksPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="relative h-40 overflow-hidden rounded-xl sm:h-52">
        <Image
          src="/hero-rooftop.jpg"
          alt="Commercial rooftop solar installation"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="relative flex h-full flex-col items-start justify-end p-6">
          <h1 className="text-3xl font-semibold text-cream">How Solar Works</h1>
        </div>
      </div>

      <p className="mt-4 text-charcoal/80">
        Solar panels aren&apos;t complicated once you can see where the electricity actually goes.
        Here&apos;s the whole journey, from sunlight to your bill, in one picture — then broken
        down step by step below.
      </p>

      <div className="mt-8">
        <SolarFlowDiagram />
      </div>

      <h2 className="pt-10 text-xl font-semibold text-charcoal">The journey, step by step</h2>
      <div className="mt-4 space-y-5">
        {steps.map((s, i) => (
          <div key={s.title} className="flex gap-4 rounded-lg border border-border-muted bg-white p-5 shadow-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-cream">
              {i + 1}
            </span>
            <div>
              <h3 className="font-medium text-charcoal">{s.title}</h3>
              <p className="mt-1.5 text-sm text-charcoal/70">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="pt-10 text-xl font-semibold text-charcoal">Selling power back to the grid</h2>
      <div className="mt-4 space-y-4 text-charcoal/80">
        <p>
          Every UK electricity supplier with more than 150,000 domestic customers is legally
          required to offer a <strong>Smart Export Guarantee (SEG)</strong> tariff — a rate, in
          pence per kWh, that they pay you for every unit of solar electricity you export to the
          grid rather than use yourself. It&apos;s metered separately from your normal import
          meter (or via a smart meter that tracks both directions), so exports are measured, not
          estimated.
        </p>
        <p>
          SEG rates vary by supplier and change over time, and you&apos;re free to choose a
          different supplier for your export tariff than the one you buy electricity from — it&apos;s
          worth shopping around rather than accepting whatever your current supplier defaults you
          to. A bigger system, or adding a battery so you use more of your own generation before
          exporting the rest, both change the numbers — which is exactly what the{" "}
          <Link href="/calculator" className="text-moss underline underline-offset-2">
            solar payback calculator
          </Link>{" "}
          models for your specific roof and system size.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-border-muted bg-cream p-6 text-center">
        <h2 className="text-lg font-semibold text-charcoal">See what this means for you</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Run your own postcode and roof through the calculator for a real generation, savings,
          and payback estimate — or book an energy efficiency survey for a full, engineer-reviewed
          look at your site.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/calculator"
            className="w-full rounded-md bg-gold px-5 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 sm:w-auto"
          >
            Try the calculator
          </Link>
          <Link
            href="/survey"
            className="w-full rounded-md border border-moss px-5 py-2.5 font-medium text-moss transition hover:bg-moss hover:text-cream sm:w-auto"
          >
            Book an energy survey
          </Link>
        </div>
      </div>
    </div>
  );
}
