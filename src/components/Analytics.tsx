"use client";

import Script from "next/script";

// Nicolas's GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-8S0VHD5V8Z";

export default function Analytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

// Function to track Gems click
export function trackGemsClick() {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", "gems_click", {
      event_category: "engagement",
      event_label: "Stratege Gems Button",
    });
  }
}

// Function to track LinkedIn click
export function trackLinkedInClick() {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", "linkedin_click", {
      event_category: "contact",
      event_label: "LinkedIn Profile Button",
    });
  }
}

// Function to track Email click
export function trackEmailClick() {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", "email_click", {
      event_category: "contact",
      event_label: "Email Contact Button",
    });
  }
}
