/**
 * middleware.ts
 * Gates the calculator app behind Supabase auth + a 7-day trial / active
 * Stripe subscription. The landing page and other product pages
 * (maintenance, tutoring) are public marketing/purchase pages. Route
 * classes:
 *  - public: no auth required (landing page, login, signup, auth callback,
 *    maintenance, tutoring, stripe webhook, tutoring checkout)
 *  - authOnly: must be logged in, but trial/subscription state doesn't
 *    matter (billing page + the Stripe routes that get you out of
 *    "expired" state)
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
  "/api/stripe/webhook",
  "/api/tutoring-checkout",
];
const AUTH_ONLY_PATHS = ["/billing", "/api/stripe/checkout", "/api/stripe/portal"];

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

  if (matchesPath(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  const { response, user, installer } = await updateSession(request);

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (matchesPath(pathname, AUTH_ONLY_PATHS)) {
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
