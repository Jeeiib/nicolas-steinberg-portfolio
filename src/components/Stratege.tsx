"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";
import { trackGemsClick } from "./Analytics";

const GEMS_URL =
  "https://gemini.google.com/gem/15BXEgs3nCiF4ZO9Vv6M1lkNvCgj6apBN?usp=sharing";

export default function Stratege() {
  const { t } = useI18n();

  return (
    <section id="stratege" className="section bg-obsidian">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        className="container-narrow text-center"
      >
        {/* Surtitle */}
        <motion.span
          variants={fadeInUp}
          className="inline-block text-brass text-xs md:text-sm tracking-[0.3em] uppercase mb-6"
        >
          {t.stratege.surtitle}
        </motion.span>

        {/* Title */}
        <motion.h2
          variants={fadeInUp}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-paper mb-8"
        >
          {t.stratege.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="max-w-2xl mx-auto text-paper-muted leading-relaxed mb-12"
        >
          {t.stratege.description}
          <span className="text-paper">{t.stratege.gemsLabel}</span>
          {t.stratege.poweredBy}
          <span className="text-paper font-medium">{t.stratege.geminiLabel}</span>
          {t.stratege.descriptionEnd}
        </motion.p>

        {/* CTA Button */}
        <motion.a
          variants={fadeInUp}
          href={GEMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackGemsClick}
          className="btn-ghost inline-flex items-center gap-3 group"
        >
          <span>{t.stratege.cta}</span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </motion.a>

        {/* Disclaimer */}
        <motion.p
          variants={fadeInUp}
          className="mt-8 text-xs text-paper-muted/60"
        >
          {t.stratege.disclaimer}
          <br />
          {t.stratege.disclaimer2}
        </motion.p>
      </motion.div>
    </section>
  );
}
