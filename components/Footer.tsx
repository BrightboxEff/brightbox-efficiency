import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-muted bg-cream">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-moss">{BRAND.name}</p>
        <p className="mt-1 text-sm italic text-charcoal/70">{BRAND.tagline}</p>
        <p className="mt-4 text-xs text-charcoal/50">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved. ·{" "}
          <a href={`mailto:${BRAND.contactEmail}`} className="underline underline-offset-2">
            {BRAND.contactEmail}
          </a>
        </p>
      </div>
    </footer>
  );
}
