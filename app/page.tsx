import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import QuickEstimateWidget from "@/components/QuickEstimateWidget";
import HeroCarousel from "@/components/HeroCarousel";
import { CalculatorIcon, MaintenanceIcon, TutoringIcon, SurveyIcon } from "@/components/ServiceIcons";

const heroSlides = [
  { src: "/hero-rooftop.jpg", alt: "Commercial rooftop solar installation" },
  { src: "/car-paint-robots.jpg", alt: "Automotive production line robotics" },
  { src: "/rooftop-site-photo.jpg", alt: "Large-scale commercial rooftop solar array" },
];

const links = [
  {
    href: "/calculator",
    title: "Solar Payback Calculator",
    description:
      "Postcode-based solar generation, savings, and payback modelling for installers and homeowners.",
    cta: "Try the calculator",
    Icon: CalculatorIcon,
  },
  {
    href: "/maintenance",
    title: "Maintenance Consultation",
    description: "Maintenance strategy, preventative planning, and contractor oversight across HVAC, conveyance, robotics, and solar/BESS equipment.",
    cta: "Learn more",
    Icon: MaintenanceIcon,
  },
  {
    href: "/tutoring",
    title: "1:1 Engineering Interview Tutoring",
    description: "Book hours of one-to-one coaching for technical and engineering interviews.",
    cta: "View tutoring",
    Icon: TutoringIcon,
  },
  {
    href: "/survey",
    title: "Energy Efficiency Survey",
    description: "A remote, bills-based energy efficiency assessment with practical savings tips.",
    cta: "Start the survey",
    Icon: SurveyIcon,
  },
];

const stats = [
  { value: "£2m+", label: "saved in utility costs across large-scale logistics operations" },
  { value: "20+ years", label: "in engineering & maintenance practices" },
  { value: "500MW+", label: "in renewable assets managed end-to-end, globally" },
  { value: "Qualified", label: "Solar Consultant Expert, REI certified" },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl">
        <div className="relative w-full py-14 sm:py-20">
          <HeroCarousel slides={heroSlides} />
          <div className="absolute inset-0 bg-charcoal/55" />
          <div className="relative flex flex-col items-center justify-center px-6 text-center">
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

            <div className="mt-8">
              <QuickEstimateWidget />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border-muted bg-white p-5 text-center shadow-sm">
            <p className="text-2xl font-semibold text-moss">{s.value}</p>
            <p className="mt-1 text-sm text-charcoal/70">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col rounded-lg border border-border-muted bg-white p-6 shadow-sm transition hover:border-moss"
            >
              <item.Icon className="h-8 w-8 text-moss" />
              <h2 className="mt-3 text-lg font-semibold text-charcoal">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm text-charcoal/70">{item.description}</p>
              <span className="mt-4 text-sm font-medium text-moss">{item.cta} →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
