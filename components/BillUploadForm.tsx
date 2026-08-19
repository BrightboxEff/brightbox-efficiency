"use client";

import { useState } from "react";

export default function BillUploadForm({ token }: { token: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please attach at least one file.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((f) => formData.append("bills", f));

    try {
      const res = await fetch(`/api/survey/upload/${token}`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed.");
      }
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
        Thanks — your bills have been received. We&apos;ll be in touch with your report shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <label htmlFor="bills" className="block text-sm font-medium text-charcoal">
        Utility bills (PDF, PNG, or JPG — last 12 months)
      </label>
      <input
        id="bills"
        type="file"
        multiple
        accept="application/pdf,image/png,image/jpeg"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:rounded-md file:border-0 file:bg-moss file:px-4 file:py-2 file:text-sm file:font-medium file:text-cream hover:file:bg-moss/90"
      />
      {files.length > 0 && (
        <p className="mt-2 text-xs text-charcoal/60">{files.length} file{files.length === 1 ? "" : "s"} selected</p>
      )}

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-md bg-gold px-4 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60"
      >
        {loading ? "Uploading…" : "Submit bills"}
      </button>
    </form>
  );
}
