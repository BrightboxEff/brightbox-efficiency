"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";

const inputClasses =
  "mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss";
const labelClasses = "block text-sm font-medium text-charcoal";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl py-12">
      <h1 className="text-3xl font-semibold text-charcoal">Contact Us</h1>
      <p className="mt-2 text-charcoal/70">
        Questions about any of our services? Send a message and we&apos;ll get back to you — or
        email directly at{" "}
        <a href={`mailto:${BRAND.contactEmail}`} className="text-moss underline underline-offset-2">
          {BRAND.contactEmail}
        </a>
        .
      </p>

      {sent ? (
        <div className="mt-8 rounded-lg border border-moss/30 bg-moss/10 p-6 text-center">
          <p className="font-medium text-charcoal">Thanks — message sent.</p>
          <p className="mt-1 text-sm text-charcoal/70">We&apos;ll get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-border-muted bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="name" className={labelClasses}>Name *</label>
            <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label htmlFor="email" className={labelClasses}>Email address *</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label htmlFor="message" className={labelClasses}>Message *</label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClasses}
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gold px-4 py-2.5 font-medium text-charcoal transition hover:bg-gold/90 disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
