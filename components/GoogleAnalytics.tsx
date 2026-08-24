"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COOKIE_CONSENT_EVENT, getStoredCookieConsent } from "@/lib/cookieConsent";

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getStoredCookieConsent() === "accepted");

    function handleChange() {
      setConsented(getStoredCookieConsent() === "accepted");
    }

    window.addEventListener(COOKIE_CONSENT_EVENT, handleChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleChange);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
