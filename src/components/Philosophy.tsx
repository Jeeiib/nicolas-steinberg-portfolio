"use client";

import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  lineGrow,
  viewportSettings,
} from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

export default function Philosophy() {
  const { t } = useI18n();

  const principles = [
    {
      number: "I",
      title: t.philosophy.principle1Title,
      description: t.philosophy.principle1Desc,
    },
    {
      number: "II",
      title: t.philosophy.principle2Title,
      description: t.philosophy.principle2Desc,
    },
    {
      number: "III",
      title: t.philosophy.principle3Title,
      description: t.philosophy.principle3Desc,
    },
  ];

  return (
    <section id="philosophie" className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        className="container-narrow"
      >
        {/* Section title */}
        <motion.h2
          variants={fadeInUp}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-paper mb-16 md:mb-24 text-center"
        >
          {t.philosophy.title}
        </motion.h2>

        {/* Principles list */}
        <div className="space-y-0">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.number}
              variants={fadeInUp}
              className="group"
            >
              {/* Top separator line */}
              {index === 0 && (
                <motion.div variants={lineGrow} className="brass-line mb-12" />
              )}

              <div className="py-12 md:py-16">
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                  {/* Number */}
                  <span className="font-serif text-2xl md:text-3xl text-brass shrink-0 w-12">
                    {principle.number}.
                  </span>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-serif text-xl md:text-2xl text-paper mb-4">
                      {principle.title}
                    </h3>
                    <p className="text-paper-muted leading-relaxed max-w-2xl">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom separator line */}
              <motion.div variants={lineGrow} className="brass-line" />
            </motion.div>
          ))}
        </div>

        {/* Conclusion quote */}
        <motion.blockquote
          variants={fadeInUp}
          className="mt-16 md:mt-24 text-center"
        >
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-paper italic">
            &ldquo;{t.philosophy.quote}&rdquo;
          </p>
        </motion.blockquote>
      </motion.div>
    </section>
  );
}
