import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import CalculatorClient from "@/components/CalculatorClient";
import type { InstallerSettings } from "@/types";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let installer: InstallerSettings = {
    companyName: BRAND.name,
    logoUrl: null,
    primaryColor: BRAND.colors.mossGreen,
    accentColor: BRAND.colors.warmGold,
  };

  if (user) {
    const { data } = await supabase
      .from("installers")
      .select("company_name, logo_url, primary_color, accent_color")
      .eq("user_id", user.id)
      .single();

    if (data) {
      installer = {
        companyName: data.company_name || BRAND.name,
        logoUrl: data.logo_url,
        primaryColor: data.primary_color,
        accentColor: data.accent_color,
      };
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Solar Payback Calculator</h1>
      <p className="mt-2 text-charcoal/70">
        Enter your customer&apos;s details to estimate solar generation, savings, and payback
        period.
      </p>

      <div className="mt-8">
        <CalculatorClient installer={installer} />
      </div>
    </div>
  );
}
