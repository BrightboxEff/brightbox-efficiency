"use client";

import { useState } from "react";

export default function SurveyReportReview({
  submissionId,
  initialContent,
}: {
  submissionId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/survey/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, reportHtml: content }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send.");
      }
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-md border border-moss/30 bg-moss/10 px-4 py-3 text-sm text-charcoal">
        Report sent to the customer.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-muted bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-charcoal">Report draft</h2>
      <p className="mt-1 text-sm text-charcoal/70">
        AI-drafted from their bills and answers — edit freely, add your own expertise, then send.
        This is a simple HTML editor: use tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;/&lt;li&gt;,
        &lt;strong&gt;.
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={24}
        className="mt-4 w-full rounded-md border border-border-muted bg-white p-3 font-mono text-sm text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal/60">Preview</p>
          <div
            className="mt-2 max-h-96 overflow-y-auto rounded-md border border-border-muted bg-cream p-4 text-sm text-charcoal"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <button
        type="button"
        onClick={handleSend}
        disabled={sending}
        className="mt-4 rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send to customer"}
      </button>
    </div>
  );
}
