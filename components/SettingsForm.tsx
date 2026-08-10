"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoUploadForm from "@/components/LogoUploadForm";
import ColorPickerField from "@/components/ColorPickerField";
import type { InstallerSettings } from "@/types";

interface SettingsFormProps {
  userId: string;
  initialSettings: InstallerSettings;
}

export default function SettingsForm({ userId, initialSettings }: SettingsFormProps) {
  const [companyName, setCompanyName] = useState(initialSettings.companyName);
  const [primaryColor, setPrimaryColor] = useState(initialSettings.primaryColor);
  const [accentColor, setAccentColor] = useState(initialSettings.accentColor);
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("installers")
      .update({
        company_name: companyName,
        primary_color: primaryColor,
        accent_color: accentColor,
      })
      .eq("user_id", userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  return (
    <form
      onSubmit={handleSave}
      className="mt-8 space-y-6 rounded-lg border border-border-muted bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-charcoal">
          Company name
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
        />
      </div>

      <LogoUploadForm userId={userId} currentLogoUrl={logoUrl} onUploaded={setLogoUrl} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ColorPickerField label="Primary colour" value={primaryColor} onChange={setPrimaryColor} />
        <ColorPickerField label="Accent colour" value={accentColor} onChange={setAccentColor} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-moss">Settings saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
