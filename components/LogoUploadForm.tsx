"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface LogoUploadFormProps {
  userId: string;
  currentLogoUrl: string | null;
  onUploaded: (url: string) => void;
}

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export default function LogoUploadForm({ userId, currentLogoUrl, onUploaded }: LogoUploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, or SVG).");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Logo must be smaller than 2MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const extension = file.name.split(".").pop() ?? "png";
    const path = `${userId}/logo-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("logos").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("installers")
      .update({ logo_url: publicUrl })
      .eq("user_id", userId);

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      return;
    }

    setPreviewUrl(publicUrl);
    onUploaded(publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal">Company logo</label>

      {previewUrl && (
        <div className="mt-2 flex h-16 w-40 items-center rounded-md border border-border-muted bg-white p-2">
          <Image
            src={previewUrl}
            alt="Company logo"
            width={140}
            height={48}
            className="max-h-12 w-auto object-contain"
            unoptimized
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:rounded-md file:border-0 file:bg-moss file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-moss/90"
      />

      {uploading && <p className="mt-1 text-sm text-charcoal/60">Uploading…</p>}
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
      <p className="mt-1 text-xs text-charcoal/50">PNG, JPG, or SVG. Max 2MB.</p>
    </div>
  );
}
