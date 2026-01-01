"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  const scrollToContent = () => {
    const philosophie = document.querySelector("#philosophie");
    if (philosophie) {
      philosophie.scrollIntoView({ behavior: "smooth" });
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
        {/* Portrait */}
        <motion.div
          variants={fadeIn}
          className="relative w-40 h-40 md:w-52 md:h-52 mb-10 rounded-full overflow-hidden border border-brass-light"
        >
          <Image
            src="/images/nicolas-portrait.webp"
            alt="Nicolas Steinberg"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={fadeInUp}
          className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wide text-paper mb-6"
        >
          NICOLAS STEINBERG
        </motion.h1>

        {/* Signature phrase */}
        <motion.p
          variants={fadeInUp}
          className="max-w-xl text-base md:text-lg text-paper-muted leading-relaxed tracking-wide"
        >
          L&apos;art de la précision. L&apos;exigence du détail.
          <br className="hidden md:block" />{" "}
          La maîtrise de l&apos;invisible.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        aria-label="Défiler vers le contenu"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-px h-12 bg-gradient-to-b from-transparent via-brass to-transparent"
        />
      </motion.button>
    </section>
  );
}
