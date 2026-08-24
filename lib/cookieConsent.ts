/**
 * lib/cookieConsent.ts
 * Shared consent state for the analytics cookie banner. Vercel Analytics
 * is cookieless (no consent needed), but Google Analytics sets cookies
 * (_ga, _gid), so it's gated behind this until the visitor accepts.
 */

export const COOKIE_CONSENT_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-changed";

export type CookieConsent = "accepted" | "declined";

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export function setStoredCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
