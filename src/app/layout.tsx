import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import Analytics from "@/components/Analytics";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://nicolassteinberg.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nicolas Steinberg | Steinberg Hospitality Analytics",
    template: "%s | Steinberg Hospitality Analytics",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.svg",
  },
  description:
    "Ne subissez plus l'opérationnel. Accédez à l'intelligence artificielle experte en standards hôteliers. Audit, SOPs et Gestion de crise pour tout établissement.",
  keywords: [
    "Nicolas Steinberg",
    "hospitality",
    "luxury hotels",
    "guest experience",
    "hotel management",
    "Paris",
    "5 étoiles",
    "hôtellerie de luxe",
    "expérience client",
    "TripAdvisor",
    "intelligence artificielle",
    "audit hôtelier",
    "SOPs",
    "gestion de crise",
  ],
  authors: [{ name: "Nicolas Steinberg" }],
  creator: "Nicolas Steinberg",
  openGraph: {
    title: "Nicolas Steinberg | Steinberg Hospitality Analytics",
    description: "Ne subissez plus l'opérationnel. Accédez à l'intelligence artificielle experte en standards hôteliers. Audit, SOPs et Gestion de crise pour tout établissement.",
    url: siteUrl,
    siteName: "Nicolas Steinberg",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolas Steinberg | Steinberg Hospitality Analytics",
    description: "Ne subissez plus l'opérationnel. Accédez à l'intelligence artificielle experte en standards hôteliers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
      >
        <Analytics />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
