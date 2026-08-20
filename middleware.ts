/**
 * middleware.ts
 * Gates the calculator app behind Supabase auth + a 7-day trial / active
 * Stripe subscription. The landing page and other product pages
 * (maintenance, tutoring, energy survey) are public marketing/purchase
 * pages. Route classes:
 *  - public: no auth required (landing page, login, signup, auth callback,
 *    maintenance, tutoring, energy survey intake + bill upload, stripe
 *    webhook, tutoring/survey checkout)
 *  - authOnly: must be logged in, but trial/subscription state doesn't
 *    matter (billing page, the Stripe routes that get you out of
 *    "expired" state, and the survey report review/send pages — those are
 *    further restricted to the Brightbox admin account in-page, this just
 *    requires *a* login). Checked BEFORE the public list so a more
 *    specific gated path (e.g. /survey/review) wins over a broader public
 *    prefix (e.g. /survey).
 *  - everything else (/calculator, /settings): must be logged in AND have
 *    an active subscription or be within their 7-day trial
 */

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { TRIAL_LENGTH_DAYS } from "@/lib/trial";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/auth/callback",
  "/maintenance",
  "/tutoring",
  "/survey",
  "/about",
  "/terms",
  "/resources",
  "/api/stripe/webhook",
  "/api/tutoring-checkout",
  "/api/survey/submit",
  "/api/survey/upload",
  "/api/quick-estimate",
];
const AUTH_ONLY_PATHS = [
  "/billing",
  "/api/stripe/checkout",
  "/api/stripe/portal",
  "/survey/review",
  "/api/survey/send-report",
];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function hasActiveAccess(installer: { subscription_status: string; trial_start: string } | null) {
  if (!installer) return false;
  if (installer.subscription_status === "active") return true;
  if (installer.subscription_status === "trialing") {
    const trialEnds = new Date(installer.trial_start).getTime() + TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() < trialEnds;
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Checked first, and deliberately not folded into the block below: this
  // is what lets a specific gated path (e.g. /survey/review) win over a
  // broader public prefix (e.g. /survey) that would otherwise match first.
  const isAuthOnly = matchesPath(pathname, AUTH_ONLY_PATHS);

  if (!isAuthOnly && matchesPath(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  const { response, user, installer } = await updateSession(request);

  if (!user) {
    const redirectUrl = new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthOnly) {
    return response;
  }

  if (!hasActiveAccess(installer)) {
    return NextResponse.redirect(new URL("/billing", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
