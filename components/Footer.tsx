import Link from "next/link";
import { BRAND } from "@/lib/brand";
import BrandLockup from "@/components/BrandLockup";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-muted bg-cream">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <BrandLockup size="sm" />
        <p className="mt-3 text-sm italic text-charcoal/70">{BRAND.tagline}</p>
        <p className="mt-3 text-xs text-charcoal/50">
          Paul Johnson, trading as {BRAND.name} · sole trader
        </p>
        <p className="mt-4 text-xs text-charcoal/50">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved. ·{" "}
          <a href={`mailto:${BRAND.contactEmail}`} className="underline underline-offset-2">
            {BRAND.contactEmail}
          </a>{" "}
          ·{" "}
          <Link href="/contact" className="underline underline-offset-2">
            Contact Us
          </Link>{" "}
          ·{" "}
          <Link href="/about" className="underline underline-offset-2">
            About Us
          </Link>{" "}
          ·{" "}
          <Link href="/resources" className="underline underline-offset-2">
            Resources
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="underline underline-offset-2">
            Terms &amp; Conditions
          </Link>
        </p>
      </div>
    </footer>
  );
}
