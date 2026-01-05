"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, locale } = useI18n();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="py-12 px-6 border-t border-brass-light"
    >
      <div className="container-narrow text-center">
        {/* Developer Credit Block */}
        <div className="mb-8 inline-block">
          <div
            className="px-6 py-4 border border-[#BDB082]/40 max-w-md mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(189, 176, 130, 0.03) 0%, rgba(0, 0, 0, 0) 100%)"
            }}
          >
            <p className="font-serif text-[#BDB082]/70 text-xs tracking-wide font-light leading-relaxed mb-2">
              {locale === "en"
                ? "Nicolas Steinberg doesn't work alone, discover the Web developer behind the technology"
                : "Nicolas Steinberg ne travaille pas seul, découvrez le développeur Web derrière la technologie"}
            </p>
            <a
              href="https://jbrdevelopment.fr/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-[#BDB082] text-sm tracking-widest font-light
                         hover:text-[#C5B358] hover:drop-shadow-[0_0_8px_rgba(197,179,88,0.5)]
                         transition-all duration-300 inline-block
                         border-b border-transparent hover:border-[#C5B358]/50"
            >
              Jean-Baptiste Renart
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-sm text-paper-muted">
          © {currentYear} Nicolas Steinberg. {t.footer.rights}
        </p>
      </div>
    </motion.footer>
  );
}
