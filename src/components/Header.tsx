"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { t, locale, toggleLocale } = useI18n();

  // Navigation items - NEW ORDER: Philosophie > Expertise > Performance > Steinberg Hospit > Contact
  const navItems = [
    { label: t.nav.philosophy, href: "#philosophie" },
    { label: t.nav.expertise, href: "#expertise" },
    { label: t.nav.performance, href: "#performance" },
    { label: t.nav.analytics, href: "#steinberg-hospitality-analytics" },
    { label: t.nav.contact, href: "#contact" },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ScrollSpy - Detect active section
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace("#", ""));

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      // Offset for fixed header
      const headerOffset = -60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const isActive = (href: string) => {
    return activeSection === href.replace("#", "");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform-gpu before:absolute before:inset-0 before:-top-4 before:bg-obsidian before:-z-10 ${
        isScrolled
          ? "bg-obsidian/95 backdrop-blur-xl border-b border-brass-light"
          : "bg-obsidian"
      }`}
    >
      <nav className="container-narrow mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo / Name */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection("");
          }}
          className="font-serif text-lg tracking-wide text-paper hover:text-brass transition-colors duration-300"
        >
          NS
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-brass"
                    : "text-paper-muted hover:text-brass"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Language toggle */}
          <li>
            <button
              onClick={toggleLocale}
              className="text-sm font-medium tracking-wider uppercase text-brass hover:text-paper hover:bg-brass/20 transition-all duration-300 border border-brass px-3 py-1"
              aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label={t.nav.menu}
        >
          <span
            className={`block w-6 h-px bg-paper transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-paper transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-paper transition-transform duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-obsidian/95 backdrop-blur-xl border-b border-brass-light"
      >
        <ul className="px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`block text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-brass"
                    : "text-paper-muted hover:text-brass"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Language toggle */}
          <li className="pt-4 border-t border-brass-light">
            <button
              onClick={() => {
                toggleLocale();
                setIsMobileMenuOpen(false);
              }}
              className="text-sm font-medium tracking-wider uppercase text-brass hover:text-paper transition-colors duration-300"
            >
              {locale === "fr" ? "English" : "Français"}
            </button>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  );
}
