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
    default: "Nicolas Steinberg | Hospitality & Guest Experience Leader",
    template: "%s | Nicolas Steinberg",
  },
  description:
    "L'art de la précision. L'exigence du détail. La maîtrise de l'invisible. Guest Experience Leader dans l'hôtellerie de luxe 5 étoiles à Paris.",
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
  ],
  authors: [{ name: "Nicolas Steinberg" }],
  creator: "Nicolas Steinberg",
  openGraph: {
    title: "Nicolas Steinberg | Hospitality & Guest Experience Leader",
    description: "L'art de la précision. L'exigence du détail. La maîtrise de l'invisible.",
    url: siteUrl,
    siteName: "Nicolas Steinberg",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolas Steinberg | Hospitality & Guest Experience Leader",
    description: "L'art de la précision. L'exigence du détail. La maîtrise de l'invisible.",
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
