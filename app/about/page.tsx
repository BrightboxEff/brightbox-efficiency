import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "About Us — Brightbox Efficiency",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="flex items-center gap-5">
        <Image
          src="/paul-headshot.png"
          alt="Paul, founder of Brightbox Efficiency"
          width={175}
          height={175}
          className="h-20 w-20 shrink-0 rounded-full border-2 border-moss object-cover sm:h-24 sm:w-24"
        />
        <div>
          <h1 className="text-3xl font-semibold text-charcoal">About Brightbox Efficiency</h1>
          <p className="mt-1 text-sm italic text-charcoal/60">{BRAND.tagline}</p>
          <p className="mt-2 text-sm text-charcoal/80">
            <span className="font-medium">Paul Johnson</span> — Founder &amp; CEO
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-charcoal/80">
        <p>
          Brightbox Efficiency Consultants is an independent engineering advisory practice
          focused on one problem: energy waste is an invisible drain on cash flow for most
          commercial and industrial sites, and it&apos;s almost always fixable without disrupting
          day-to-day operations.
        </p>
        <p>
          Our approach is built on over 20 years of frontline engineering and maintenance
          practice — starting in engineering roles within the automotive industry before moving
          into renewable energy asset management. That grounding in hands-on maintenance
          discipline now spans solar deployments, Battery Energy Storage System (BESS) roadmaps,
          and facility-scale efficiency programmes, delivering over £2,000,000 in recurring
          annual utility savings at major fulfillment networks. We bring that same
          engineering-first, numbers-led method to every site we work with, whatever its size.
        </p>
        <p>
          We work remotely and diagnose from data: utility invoices, meter logs, and a clear
          picture of what equipment is actually running on-site. That means no disruptive site
          visits for most engagements, no guesswork, and recommendations that are grounded in
          what your bills and equipment profile actually show — not generic checklists.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-charcoal">Credentials &amp; experience</h2>
        <p>
          Brightbox is led by a Senior Renewables Asset Manager with end-to-end responsibility
          for renewable energy assets totalling over 500MW globally, across a multi-country
          onsite solar portfolio spanning the US, India, Japan, Australia, and Europe. That
          day-to-day role covers generation performance monitoring, Solar &amp; Battery Energy
          Storage System (BESS) expansion feasibility, third-party PPA deployment, O&amp;M
          contractor management, wind-risk structural audits, and renewable energy certificate
          (REGO) accreditation with Ofgem.
        </p>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border-muted bg-cream p-6 sm:flex-row">
          <Image
            src="/rei-badge.png"
            alt="Solar Energy Consultant Expert certification badge, The Renewable Energy Institute, 2025 Achiever"
            width={470}
            height={470}
            className="h-32 w-32 shrink-0"
          />
          <div>
            <p className="font-medium text-charcoal">Solar Energy Consultant Expert</p>
            <p className="mt-1 text-sm text-charcoal/70">
              The Renewable Energy Institute — CPD Certified, awarded November 2025.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border-muted">
          <Image
            src="/rooftop-site-photo.jpg"
            alt="A large-scale commercial rooftop solar installation"
            width={2000}
            height={1500}
            className="h-auto w-full object-cover"
          />
        </div>

        <h2 className="pt-4 text-xl font-semibold text-charcoal">What we do</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Solar payback modelling</strong> — postcode-based generation, savings, and
            payback calculations for installers and homeowners via our{" "}
            <Link href="/calculator" className="text-moss underline underline-offset-2">
              solar payback calculator
            </Link>
            .
          </li>
          <li>
            <strong>Energy efficiency surveys</strong> — a remote, bills-based assessment of your
            site&apos;s equipment and consumption, resulting in a practical, engineer-reviewed
            savings report. See{" "}
            <Link href="/survey" className="text-moss underline underline-offset-2">
              the energy survey
            </Link>
            .
          </li>
          <li>
            <strong>Maintenance consultation</strong> — ongoing system health checks and
            maintenance planning for existing installations.
          </li>
          <li>
            <strong>Engineering interview tutoring</strong> — 1:1 coaching for technical and
            engineering interviews, drawing on real hiring-loop experience.
          </li>
        </ul>

        <h2 className="pt-4 text-xl font-semibold text-charcoal">Advisory, not installation</h2>
        <p>
          We provide independent engineering advice and analysis — we don&apos;t carry out
          physical installations or site work ourselves. Where useful, we can make professional
          introductions to vetted local and national suppliers and contractors to help you get
          quotes for implementation, but final execution is always your decision. Full detail is
          in our{" "}
          <Link href="/terms" className="text-moss underline underline-offset-2">
            Terms &amp; Conditions
          </Link>
          .
        </p>

        <h2 className="pt-4 text-xl font-semibold text-charcoal">Get in touch</h2>
        <p>
          Questions about any of our services? Email us at{" "}
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="font-medium text-moss underline underline-offset-2"
          >
            {BRAND.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
