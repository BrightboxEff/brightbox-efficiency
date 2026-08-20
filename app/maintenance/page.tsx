import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Maintenance Consultation — Brightbox Efficiency",
};

const equipmentTypes = [
  "HVAC & climate control",
  "Conveyance & material handling",
  "Robotics & automated painting systems",
  "Welding equipment",
  "Solar PV & BESS",
  "Wider facility & production equipment",
];

const services = [
  {
    title: "Maintenance strategy",
    description:
      "A structured, prioritised maintenance plan across your equipment — built around asset age and condition, criticality to operations, and your risk tolerance, rather than a generic schedule.",
  },
  {
    title: "Preventative maintenance planning",
    description:
      "Scheduled inspection and service intervals designed to catch degradation and faults before they cause downtime, with clear ownership of who does what and when.",
  },
  {
    title: "Contractor & maintenance team oversight",
    description:
      "Independent review of your maintenance contracts and the contractors or teams delivering them — service level clarity, inspection cadence, response times, and whether you're getting what you're paying for.",
  },
  {
    title: "Performance & condition audits",
    description:
      "A health check of existing equipment against expected performance, flagging underperforming assets and the likely root causes.",
  },
  {
    title: "Documentation & reporting",
    description:
      "Clear, consistent maintenance records and reporting so issues, interventions, and outcomes are tracked over time — useful for warranty claims, insurance, and ongoing decision-making.",
  },
];

export default function MaintenanceConsultationPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-semibold text-charcoal">Maintenance Consultation</h1>
      <p className="mt-3 text-charcoal/80">
        Equipment loses value quietly — a missed fault, a slipping service schedule, or an
        underperforming asset can go unnoticed for months while it costs you uptime and money.
        Drawing on experience leading maintenance teams across HVAC, conveyance, robotics and
        automated painting systems, welding equipment, and solar/BESS assets, we help you build a
        maintenance approach that catches that early, rather than finding out at the next annual
        review.
      </p>

      <h2 className="pt-8 text-xl font-semibold text-charcoal">Equipment we cover</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {equipmentTypes.map((e) => (
          <span
            key={e}
            className="rounded-full border border-border-muted bg-white px-3 py-1.5 text-sm text-charcoal/80"
          >
            {e}
          </span>
        ))}
      </div>

      <h2 className="pt-8 text-xl font-semibold text-charcoal">What we cover</h2>
      <div className="mt-4 space-y-5">
        {services.map((s) => (
          <div key={s.title} className="rounded-lg border border-border-muted bg-white p-5 shadow-sm">
            <h3 className="font-medium text-charcoal">{s.title}</h3>
            <p className="mt-1.5 text-sm text-charcoal/70">{s.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border-muted bg-cream p-6 text-center">
        <h2 className="text-lg font-semibold text-charcoal">Enquire for more</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Every site and equipment mix is different, so maintenance consultation is scoped
          individually rather than sold as a fixed package. Tell us a bit about your setup and
          we&apos;ll get back to you.
        </p>
        <a
          href={`mailto:${BRAND.contactEmail}?subject=${encodeURIComponent("Maintenance consultation enquiry")}`}
          className="mt-4 inline-block rounded-md bg-gold px-5 py-2.5 font-medium text-charcoal transition hover:bg-gold/90"
        >
          Email {BRAND.contactEmail}
        </a>
      </div>
    </div>
  );
}
