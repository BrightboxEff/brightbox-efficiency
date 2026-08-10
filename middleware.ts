/**
 * middleware.ts
 * Gates the whole app behind Supabase auth + a 14-day trial / active Stripe
 * subscription. Route classes:
 *  - public: no auth required (login, signup, auth callback, stripe webhook)
 *  - authOnly: must be logged in, but trial/subscription state doesn't matter
 *    (billing page + the Stripe routes that get you out of "expired" state)
 *  - everything else: must be logged in AND have an active subscription or
 *    be within their 14-day trial
 */

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const TRIAL_LENGTH_DAYS = 14;

const PUBLIC_PATHS = ["/login", "/signup", "/auth/callback", "/api/stripe/webhook"];
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
