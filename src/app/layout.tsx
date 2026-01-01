import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Nicolas Steinberg | Hospitality & Guest Experience Leader",
  description:
    "L'art de la précision. L'exigence du détail. La maîtrise de l'invisible. Guest Experience Leader dans l'hôtellerie de luxe 5 étoiles.",
  keywords: [
    "hospitality",
    "luxury hotels",
    "guest experience",
    "hotel management",
    "Paris",
    "5 étoiles",
  ],
  authors: [{ name: "Nicolas Steinberg" }],
  openGraph: {
    title: "Nicolas Steinberg | Hospitality & Guest Experience Leader",
    description: "L'art de la précision. L'exigence du détail. La maîtrise de l'invisible.",
    type: "website",
    locale: "fr_FR",
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
        {children}
      </body>
    </html>
  );
}
