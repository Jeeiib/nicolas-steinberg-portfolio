"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="py-12 px-6 border-t border-brass-light"
    >
      <div className="container-narrow text-center">
        <p className="text-sm text-paper-muted">
          © {currentYear} Nicolas Steinberg. {t.footer.rights}
        </p>
      </div>
    </motion.footer>
  );
}
