"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// Supported locales
export type Locale = "fr" | "en";

// Translation dictionaries
const dictionaries = {
  fr: {
    // Navigation
    nav: {
      philosophy: "Philosophie",
      expertise: "Expertise",
      strategist: "Stratège",
      achievements: "Réalisations",
      contact: "Contact",
      menu: "Menu",
    },
    // Hero section
    hero: {
      tagline: "L'art de la précision. L'exigence du détail.",
      tagline2: "La maîtrise de l'invisible.",
      scrollLabel: "Défiler vers le contenu",
    },
    // Philosophy section
    philosophy: {
      title: "Principes Directeurs",
      principle1Title: "On ne présume jamais.",
      principle1Desc:
        "L'interprétation est le poison de la relation humaine. Tant que l'on ne sait pas, on ne juge pas. On ne fantasme pas une intention, on ne devine pas un besoin : on se renseigne. Aller chercher l'information factuelle est le fondement de la justesse émotionnelle et de l'excellence opérationnelle.",
      principle2Title: "Oui ou Non.",
      principle2Desc:
        "La clarté est une marque de respect. L'entre-deux est une perte de temps opérationnelle. Décider vite, agir avec justesse.",
      principle3Title: "Rien n'est grave.",
      principle3Desc:
        "Le sang-froid est le socle de l'autorité. Maîtriser l'imprévisible avec distance pour garantir la continuité de l'expérience.",
      quote:
        "Le luxe n'est pas une question de moyens, mais de standards.",
    },
    // Expertise section
    expertise: {
      title: "Expertise Stratégique",
      area1Title: "Standards d'Excellence",
      area1Desc: "Définition et implémentation de protocoles opérationnels de haut niveau. Formation aux pratiques et codes du luxe international.",
      area2Title: "Ingénierie de la Réputation",
      area2Desc: "Pilotage stratégique de l'image de marque et optimisation chirurgicale des classements et de la e-réputation.",
      area3Title: "Leadership & Influence par l'Exemple",
      area3Desc: "Direction d'équipes en environnements de haute exigence. Une autorité qui ne s'impose pas par le titre, mais par l'exemplarité opérationnelle, l'incarnation des standards et la transmission d'une culture de l'excellence.",
    },
    // Stratege section
    stratege: {
      surtitle: "Ingénierie Numérique",
      title: "STRATÈGE",
      description:
        "Modélisation exclusive de mes méthodes d'analyse et standards opérationnels. J'ai condensé mon expertise au sein d'un ",
      gemsLabel: "Gems",
      poweredBy: " personnalisé, propulsé par ",
      geminiLabel: "GEMINI AI by Google",
      descriptionEnd:
        ", pour offrir un accès direct à ma vision stratégique et à mes recommandations, de manière instantanée.",
      cta: "Accéder au Gems \"Stratège\"",
      disclaimer: "Gems est une fonctionnalité de GEMINI AI by Google.",
      disclaimer2: "L'accès nécessite un compte Google.",
    },
    // Portfolio/Achievements section
    portfolio: {
      title: "Performances",
      subtitle:
        "Progression mesurable sur les principales plateformes de référence hôtelière.",
      metricRankingDesc: "Position dans le classement parisien",
      metricReputationDesc: "Réputation digitale",
      metricExcellenceLabel: "Excellence Opérationnelle",
      metricExcellenceDesc: "Évaluation qualité service",
    },
    // Contact section
    contact: {
      title: "Discrétion & Collaboration",
      description: "Pour échanger sur une collaboration d'exception :",
      description2: "",
      emailButton: "Envoyer un courriel",
      linkedinButton: "Profil LinkedIn",
    },
    // Footer
    footer: {
      rights: "Tous droits réservés.",
    },
  },
  en: {
    // Navigation
    nav: {
      philosophy: "Philosophy",
      expertise: "Expertise",
      strategist: "Strategist",
      achievements: "Achievements",
      contact: "Contact",
      menu: "Menu",
    },
    // Hero section
    hero: {
      tagline: "The art of precision. The pursuit of detail.",
      tagline2: "Mastering the invisible.",
      scrollLabel: "Scroll to content",
    },
    // Philosophy section
    philosophy: {
      title: "Guiding Principles",
      principle1Title: "Never presume.",
      principle1Desc:
        "Interpretation is the poison of human relationships. As long as we do not know, we do not judge. We do not fantasize an intention, we do not guess a need: we inquire. Seeking factual information is the foundation of emotional accuracy and operational excellence.",
      principle2Title: "Yes or No.",
      principle2Desc:
        "Clarity is a mark of respect. Indecision is operational waste. Decide quickly, act with precision.",
      principle3Title: "Nothing is critical.",
      principle3Desc:
        "Composure is the foundation of authority. Mastering the unexpected with distance ensures continuity of the experience.",
      quote:
        "Luxury is not a matter of means, but of standards.",
    },
    // Expertise section
    expertise: {
      title: "Strategic Expertise",
      area1Title: "Excellence Standards",
      area1Desc: "Definition and implementation of high-level operational protocols. Training in international luxury practices and codes.",
      area2Title: "Reputation Engineering",
      area2Desc: "Strategic brand image management and precision optimization of rankings and e-reputation.",
      area3Title: "Leadership & Influence by Example",
      area3Desc: "Team direction in high-demand environments. An authority that is not imposed by title, but by operational exemplarity, embodiment of standards, and transmission of a culture of excellence.",
    },
    // Stratege section
    stratege: {
      surtitle: "Digital Engineering",
      title: "STRATEGIST",
      description:
        "Exclusive modeling of my analytical methods and operational standards. I've condensed my expertise into a custom ",
      gemsLabel: "Gems",
      poweredBy: ", powered by ",
      geminiLabel: "GEMINI AI by Google",
      descriptionEnd:
        ", providing direct access to my strategic vision and recommendations, instantly.",
      cta: "Access the \"Strategist\" Gems",
      disclaimer: "Gems is a feature of GEMINI AI by Google.",
      disclaimer2: "Access requires a Google account.",
    },
    // Portfolio/Achievements section
    portfolio: {
      title: "Performance",
      subtitle:
        "Measurable progress across leading hospitality reference platforms.",
      metricRankingDesc: "Paris ranking position",
      metricReputationDesc: "Digital reputation",
      metricExcellenceLabel: "Operational Excellence",
      metricExcellenceDesc: "Service quality rating",
    },
    // Contact section
    contact: {
      title: "Discretion & Collaboration",
      description: "To discuss an exceptional collaboration:",
      description2: "",
      emailButton: "Send an email",
      linkedinButton: "LinkedIn Profile",
    },
    // Footer
    footer: {
      rights: "All rights reserved.",
    },
  },
};

// Type for the dictionary (inferred from structure, not literal values)
export type Dictionary = {
  nav: {
    philosophy: string;
    expertise: string;
    strategist: string;
    achievements: string;
    contact: string;
    menu: string;
  };
  hero: {
    tagline: string;
    tagline2: string;
    scrollLabel: string;
  };
  philosophy: {
    title: string;
    principle1Title: string;
    principle1Desc: string;
    principle2Title: string;
    principle2Desc: string;
    principle3Title: string;
    principle3Desc: string;
    quote: string;
  };
  expertise: {
    title: string;
    area1Title: string;
    area1Desc: string;
    area2Title: string;
    area2Desc: string;
    area3Title: string;
    area3Desc: string;
  };
  stratege: {
    surtitle: string;
    title: string;
    description: string;
    gemsLabel: string;
    poweredBy: string;
    geminiLabel: string;
    descriptionEnd: string;
    cta: string;
    disclaimer: string;
    disclaimer2: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    metricRankingDesc: string;
    metricReputationDesc: string;
    metricExcellenceLabel: string;
    metricExcellenceDesc: string;
  };
  contact: {
    title: string;
    description: string;
    description2: string;
    emailButton: string;
    linkedinButton: string;
  };
  footer: {
    rights: string;
  };
};

// Context type
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  toggleLocale: () => void;
}

// Create context
const I18nContext = createContext<I18nContextType | null>(null);

// Provider component
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Update HTML lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fr" ? "en" : "fr");
  }, [locale, setLocale]);

  const t = dictionaries[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to use translations
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
