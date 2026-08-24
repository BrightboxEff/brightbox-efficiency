"use client";

import { useEffect, useState } from "react";
import { getStoredCookieConsent, setStoredCookieConsent } from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredCookieConsent() === null);
  }, []);

  function respond(value: "accepted" | "declined") {
    setStoredCookieConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-muted bg-cream px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-charcoal/80">
          We use cookies for analytics to understand how visitors use this site. Declining
          won&apos;t affect how the site works.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => respond("declined")}
            className="rounded-md border border-border-muted px-4 py-2 text-sm font-medium text-charcoal/70 transition hover:border-moss hover:text-charcoal"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="rounded-md bg-moss px-4 py-2 text-sm font-medium text-cream transition hover:bg-moss/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
