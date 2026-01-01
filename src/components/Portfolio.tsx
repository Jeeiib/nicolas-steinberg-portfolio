"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";

const achievements = [
  {
    title: "Performance Opérationnelle",
    description:
      "Restructuration des flux de service pour une hausse mesurable de la satisfaction client et de la fluidité des opérations.",
  },
  {
    title: "Optimisation des Standards",
    description:
      "Mise en conformité d'établissements de luxe avec les exigences de qualité les plus strictes du secteur.",
  },
];

export default function Portfolio() {
  const rankingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rankingRef, { once: true, margin: "-20%" });

  return (
    <section id="realisations" className="section">
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
          Performances
        </motion.h2>

        {/* Ranking Animation Section */}
        <motion.div
          ref={rankingRef}
          variants={fadeInUp}
          className="mb-20 md:mb-28"
        >
          <h3 className="font-serif text-xl md:text-2xl text-paper mb-6 text-center">
            Positionnement Marché
          </h3>

          {/* Ranking visualization */}
          <div className="max-w-3xl mx-auto">
            {/* Progress bar container */}
            <div className="relative h-px bg-brass-light mb-8">
              {/* Animated progress */}
              <motion.div
                className="absolute top-0 left-0 h-full bg-brass"
                initial={{ width: "0%" }}
                animate={isInView ? { width: "92%" } : { width: "0%" }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />

              {/* Animated dot */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brass"
                initial={{ left: "0%" }}
                animate={isInView ? { left: "92%" } : { left: "0%" }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between items-start">
              <div className="text-left">
                <span className="block font-serif text-2xl md:text-3xl text-anthracite">
                  1200
                </span>
                <span className="text-xs text-paper-muted tracking-wider uppercase">
                  Départ
                </span>
              </div>

              <div className="text-right">
                <motion.span
                  className="block font-serif text-2xl md:text-3xl"
                  initial={{ color: "#3D3D3D" }}
                  animate={isInView ? { color: "#FAF9F6" } : { color: "#3D3D3D" }}
                  transition={{ duration: 0.5, delay: 3 }}
                >
                  100
                </motion.span>
                <span className="text-xs text-paper-muted tracking-wider uppercase">
                  Top
                </span>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-8 text-center text-paper-muted text-sm md:text-base italic">
              Passage du 1200ème rang au Top 100 des établissements de référence.
            </p>
          </div>
        </motion.div>

        {/* Other achievements */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              variants={fadeInUp}
              className="text-center md:text-left"
            >
              {/* Number indicator */}
              <div className="inline-block mb-6">
                <span className="text-brass text-sm tracking-widest">
                  0{index + 1}
                </span>
                <div className="h-px w-8 bg-brass-light mt-2" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl md:text-2xl text-paper mb-4">
                {achievement.title}
              </h3>

              {/* Description */}
              <p className="text-paper-muted leading-relaxed">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
