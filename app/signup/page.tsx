"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TRIAL_LENGTH_DAYS } from "@/lib/trial";

export default function SignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session && data.user) {
      // Email confirmation disabled on this project — session is live already.
      await supabase.from("installers").upsert(
        {
          user_id: data.user.id,
          company_name: companyName,
          trial_start: new Date().toISOString(),
        },
        { onConflict: "user_id", ignoreDuplicates: true }
      );
      window.location.href = "/calculator";
      return;
    }

    // Email confirmation required — the /auth/callback route creates the
    // installer row once they click the link.
    setCheckEmail(true);
    setLoading(false);
  }

  if (checkEmail) {
    return (
      <div className="mx-auto max-w-md py-16">
        <h1 className="text-2xl font-semibold text-charcoal">Check your email</h1>
        <p className="mt-3 text-charcoal/80">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it
          to activate your account and start your {TRIAL_LENGTH_DAYS}-day free trial.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-2xl font-semibold text-charcoal">
        Start your {TRIAL_LENGTH_DAYS}-day free trial
      </h1>
      <p className="mt-2 text-sm text-charcoal/70">
        No card required. Cancel anytime during your trial.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-charcoal">
            Company name
          </label>
          <input
            id="companyName"
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-charcoal">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border-muted bg-white px-3 py-2 text-charcoal focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-moss px-4 py-2.5 font-medium text-cream transition hover:bg-moss/90 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Start free trial"}
        </button>
      </form>

      <p className="mt-6 text-sm text-charcoal/70">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-moss underline underline-offset-2">
          Log in
        </Link>
      </p>
    </div>
  );
}
