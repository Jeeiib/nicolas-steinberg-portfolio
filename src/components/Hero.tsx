"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

// GA4 Tracking
const trackHeroCta = () => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "hero_cta_clicked", {
      event_category: "engagement",
      event_label: "Access Analysis CTA",
    });
  }
};

export default function Hero() {
  const { t, locale } = useI18n();

  const scrollToContent = () => {
    const philosophie = document.querySelector("#philosophie");
    if (philosophie) {
      philosophie.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToAnalytics = () => {
    trackHeroCta();
    const analytics = document.querySelector("#steinberg-hospitality-analytics");
    if (analytics) {
      // Scroll lower to show the chat container better
      const offset = 150; // Extra offset to scroll past the section title
      const elementPosition = analytics.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY + offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian to-obsidian/90 pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Portrait - Compacted spacing */}
        <motion.div
          variants={fadeIn}
          className="relative w-36 h-36 md:w-44 md:h-44 mb-6 rounded-full overflow-hidden border border-brass-light"
        >
          <Image
            src="/images/nicolas-portrait.webp"
            alt="Nicolas Steinberg"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Name - Compacted spacing */}
        <motion.h1
          variants={fadeInUp}
          className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-wide text-paper mb-4"
        >
          NICOLAS STEINBERG
        </motion.h1>

        {/* Signature phrase - Without tagline2 */}
        <motion.p
          variants={fadeInUp}
          className="max-w-xl text-base md:text-lg text-paper-muted leading-relaxed tracking-wide mb-8"
        >
          {t.hero.tagline}
        </motion.p>

        {/* CTA - Emerald Green Velvet Style */}
        <motion.button
          variants={fadeInUp}
          onClick={scrollToAnalytics}
          className="group px-6 py-3 text-sm font-medium tracking-widest uppercase
                     bg-[#004d40] border border-[#BDB082]/60 text-[#BDB082]
                     hover:bg-[#00382e] hover:border-[#C5B358] hover:text-[#C5B358]
                     hover:shadow-[0_0_20px_rgba(0,77,64,0.4)]
                     transition-all duration-300 flex items-center gap-3"
        >
          <span>{locale === "en" ? "ACCESS STEINBERG HOSPITALITY ANALYTICS" : "ACCÉDER À STEINBERG HOSPITALITY ANALYTICS"}</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label={t.hero.scrollLabel}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-px h-10 bg-gradient-to-b from-transparent via-brass to-transparent"
        />
      </motion.button>
    </section>
  );
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, string | number | boolean>) => void;
  }
}
