"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";
import { trackEmailClick, trackLinkedInClick } from "./Analytics";

const EMAIL = "n@nicolassteinberg.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/nicolas-steinberg-pro/";

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportSettings}
        className="container-narrow text-center"
      >
        {/* Section title */}
        <motion.h2
          variants={fadeInUp}
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-paper mb-8"
        >
          {t.contact.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-paper-muted mb-12 max-w-lg mx-auto"
        >
          {t.contact.description}
          <br />
          {t.contact.description2}
        </motion.p>

        {/* Contact buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-8"
        >
          {/* Email button with visible address */}
          <div className="flex flex-col items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              onClick={trackEmailClick}
              className="btn-ghost w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{t.contact.emailButton}</span>
            </a>
            <span className="text-paper-muted text-sm tracking-wide">{EMAIL}</span>
          </div>

          {/* LinkedIn button */}
          <div className="flex flex-col items-center gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackLinkedInClick}
              className="btn-ghost w-full sm:w-auto justify-center"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>{t.contact.linkedinButton}</span>
            </a>
            <span className="text-paper-muted text-sm tracking-wide invisible">&nbsp;</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
