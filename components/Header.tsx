import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BrandLockup from "@/components/BrandLockup";
import HeaderNav from "@/components/HeaderNav";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="relative border-b border-border-muted bg-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandLockup size="lg" />
        </Link>

        <HeaderNav hasUser={!!user} />
      </div>
    </header>
  );
}
