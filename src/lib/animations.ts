import { Variants } from "framer-motion";

// Fade in from bottom - used for most elements
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Fade in without movement - for subtle appearances
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Container that staggers children animations
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Slower stagger for more dramatic reveals
export const slowStaggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

// Line grow animation - for brass separators
export const lineGrow: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

// Scale in - for images
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Viewport settings for scroll-triggered animations
export const viewportSettings = {
  once: true,
  margin: "-20% 0px -20% 0px",
  amount: 0.2,
};

// Ranking animation - for the 1200 → 100 progress
export const rankingAnimation = {
  initial: { width: "0%" },
  animate: {
    width: "92%", // 1200 to 100 = ~92% of the way
    transition: {
      duration: 3,
      ease: "easeInOut",
    },
  },
};
