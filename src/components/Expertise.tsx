"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

export default function Expertise() {
  const { t } = useI18n();

  const expertiseAreas = [
    {
      id: "excellence",
      title: t.expertise.area1Title,
      description: t.expertise.area1Desc,
    },
    {
      id: "reputation",
      title: t.expertise.area2Title,
      description: t.expertise.area2Desc,
    },
    {
      id: "leadership",
      title: t.expertise.area3Title,
      description: t.expertise.area3Desc,
    },
  ];

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
          {t.expertise.title}
        </motion.h2>

        {/* Grid of expertise areas */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={area.id}
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
