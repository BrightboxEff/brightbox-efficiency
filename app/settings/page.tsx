import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import SettingsForm from "@/components/SettingsForm";
import type { InstallerSettings } from "@/types";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("installers")
    .select("company_name, logo_url, primary_color, accent_color")
    .eq("user_id", user.id)
    .single();

  const initialSettings: InstallerSettings = {
    companyName: data?.company_name || "",
    logoUrl: data?.logo_url ?? null,
    primaryColor: data?.primary_color || BRAND.colors.mossGreen,
    accentColor: data?.accent_color || BRAND.colors.warmGold,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal">Branding settings</h1>
      <p className="mt-2 text-charcoal/70">
        Customise the logo and colours used on your branded PDF reports.
      </p>

      <SettingsForm userId={user.id} initialSettings={initialSettings} />
    </div>
  );
}
