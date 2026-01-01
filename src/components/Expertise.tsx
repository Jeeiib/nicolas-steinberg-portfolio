"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";

const expertiseAreas = [
  {
    title: "Standards d'Excellence",
    description:
      "Définition et implémentation de protocoles opérationnels de haut niveau. Formation aux pratiques et codes du luxe international.",
  },
  {
    title: "Ingénierie de la Réputation",
    description:
      "Pilotage stratégique de l'image de marque et optimisation chirurgicale des classements et de la e-réputation.",
  },
  {
    title: "Management & Leadership",
    description:
      "Direction d'équipes en environnements complexes et haute gestion de la performance opérationnelle.",
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="section">
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
          Expertise Stratégique
        </motion.h2>

        {/* Grid of expertise areas */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={area.title}
              variants={fadeInUp}
              className="group text-center md:text-left"
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
                {area.title}
              </h3>

              {/* Description */}
              <p className="text-paper-muted leading-relaxed text-base">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
