"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="flex justify-center py-4">
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-px h-12 bg-gradient-to-b from-transparent via-brass to-transparent origin-top"
      />
    </div>
  );
}
