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
        <div className="mb-8">
          <p className="text-[#BDB082]/60 text-xs tracking-wide font-light mb-4">
            {locale === "en" ? (
              <>
                Did you like Nicolas Steinberg's vision, methods and precision?
                <br className="hidden sm:inline" />{" "}
                Discover the Web developer behind the technical side of this tool
              </>
            ) : (
              <>
                Vous avez aimé la vision, les méthodes et la précision de Nicolas Steinberg ?
                <br className="hidden sm:inline" />{" "}
                Découvrez le développeur Web derrière l'aspect technique de cet outil
              </>
            )}
          </p>
          <a
            href="https://jbrdevelopment.fr/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 text-[#BDB082] text-sm tracking-widest font-light
                       border border-[#BDB082]/50 rounded-full
                       hover:text-[#C5B358] hover:border-[#C5B358]
                       hover:shadow-[0_0_15px_rgba(197,179,88,0.3)]
                       transition-all duration-300"
          >
            Jean-Baptiste Renart
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-paper-muted">
          © {currentYear} Nicolas Steinberg. {t.footer.rights}
        </p>
      </div>
    </motion.footer>
  );
}
