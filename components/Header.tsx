import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-moss">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-lg font-semibold text-cream">{BRAND.productName}</span>
          <span className="text-xs text-cream/70">{BRAND.name}</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-cream/80 transition hover:text-cream">
              Calculator
            </Link>
            <Link href="/settings" className="text-sm font-medium text-cream/80 transition hover:text-cream">
              Settings
            </Link>
            <LogoutButton />
          </nav>
        )}
      </div>
    </header>
  );
}
