import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

const links = [
  {
    href: "/calculator",
    title: "Solar Payback Calculator",
    description:
      "Postcode-based solar generation, savings, and payback modelling for installers and homeowners.",
    cta: "Try the calculator",
  },
  {
    href: "/maintenance",
    title: "Maintenance Consultation",
    description: "Ongoing system health checks and maintenance planning for existing installations.",
    cta: "Learn more",
  },
  {
    href: "/tutoring",
    title: "1:1 Engineering Interview Tutoring",
    description: "Book hours of one-to-one coaching for technical and engineering interviews.",
    cta: "View tutoring",
  },
  {
    href: "/survey",
    title: "Energy Efficiency Survey",
    description: "A remote, bills-based energy efficiency assessment with practical savings tips.",
    cta: "Start the survey",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl">
        <div className="relative h-80 w-full sm:h-96">
          <Image
            src="/hero-rooftop.jpg"
            alt="Commercial rooftop solar installation"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/55" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <Image
              src="/brightbox-icon.png"
              alt=""
              width={237}
              height={219}
              priority
              className="h-16 w-auto sm:h-20"
            />
            <h1 className="mt-4 text-3xl font-semibold text-cream sm:text-4xl">
              Brightbox Efficiency
            </h1>
            <p className="mt-3 max-w-xl text-cream/90">{BRAND.tagline}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-md bg-gold px-5 py-2.5 font-medium text-charcoal transition hover:bg-gold/90"
              >
                Start free trial
              </Link>
              <Link
                href="/calculator"
                className="rounded-md border border-cream/70 px-5 py-2.5 font-medium text-cream transition hover:bg-cream/10"
              >
                Try the calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col rounded-lg border border-border-muted bg-white p-6 shadow-sm transition hover:border-moss"
            >
              <h2 className="text-lg font-semibold text-charcoal">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm text-charcoal/70">{item.description}</p>
              <span className="mt-4 text-sm font-medium text-moss">{item.cta} →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
