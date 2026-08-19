import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import BrandLockup from "@/components/BrandLockup";

const navLinkClasses = "text-sm font-medium text-charcoal/70 transition hover:text-moss";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border-muted bg-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandLockup size="lg" />
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/calculator" className={navLinkClasses}>
            Calculator
          </Link>
          <Link href="/maintenance" className={navLinkClasses}>
            Maintenance Consultation
          </Link>
          <Link href="/tutoring" className={navLinkClasses}>
            Interview Tutoring
          </Link>
          <Link href="/survey" className={navLinkClasses}>
            Energy Survey
          </Link>

          {user ? (
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
      </div>
    </header>
  );
}
