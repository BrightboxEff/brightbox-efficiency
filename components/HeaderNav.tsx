"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const navLinkClasses = "text-sm font-medium text-charcoal/70 transition hover:text-moss";
const mobileNavLinkClasses = "block py-2.5 text-base font-medium text-charcoal/80 hover:text-moss";

const links = [
  { href: "/calculator", label: "Calculator" },
  { href: "/maintenance", label: "Maintenance Consultation" },
  { href: "/tutoring", label: "Interview Tutoring" },
  { href: "/survey", label: "Energy Survey" },
];

export default function HeaderNav({ hasUser }: { hasUser: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="hidden items-center gap-6 md:flex">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={navLinkClasses}>
            {l.label}
          </Link>
        ))}

        {hasUser ? (
          <>
            <Link href="/settings" className={navLinkClasses}>
              Settings
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className={navLinkClasses}>
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-moss px-3 py-1.5 text-sm font-medium text-cream transition hover:bg-moss/90"
            >
              Start free trial
            </Link>
          </>
        )}
      </nav>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md text-charcoal md:hidden"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 border-b border-border-muted bg-cream px-4 pb-4 shadow-sm md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={mobileNavLinkClasses} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-border-muted pt-2">
            {hasUser ? (
              <>
                <Link href="/settings" className={mobileNavLinkClasses} onClick={() => setOpen(false)}>
                  Settings
                </Link>
                <div className="pt-1">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={mobileNavLinkClasses} onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-md bg-moss px-4 py-2.5 text-center text-sm font-medium text-cream"
                >
                  Start free trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
