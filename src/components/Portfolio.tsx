"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeInUp, staggerContainer, viewportSettings } from "@/lib/animations";
import { useI18n } from "@/lib/i18n";

// Platform logos - Official brand colors
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const BookingLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7">
    <rect width="24" height="24" rx="4" fill="#003580" />
    <path
      fill="#FFFFFF"
      d="M6 5h4.5c2.2 0 3.5 1.1 3.5 3 0 1.3-.7 2.2-1.9 2.6v.1c1.4.3 2.4 1.4 2.4 2.9 0 2.2-1.5 3.4-4 3.4H6V5zm2.4 4.9h1c1 0 1.5-.4 1.5-1.3 0-.7-.5-1.1-1.5-1.1h-1v2.4zm0 5.1h1.2c1.1 0 1.6-.5 1.6-1.4 0-.9-.6-1.4-1.7-1.4H8.4V15z"
    />
    <circle cx="16.5" cy="15.5" r="1.8" fill="#FFFFFF" />
  </svg>
);

const TripAdvisorLogo = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10">
    <path
      fill="#00AF87"
      d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 5.997 5.997 0 0 0 4.04-10.43L24 6.647h-4.35a13.573 13.573 0 0 0-7.644-2.352zM12 6.762c1.88 0 3.615.507 5.125 1.39a5.987 5.987 0 0 0-2.062 1.255 5.994 5.994 0 0 0-6.126 0 5.987 5.987 0 0 0-2.062-1.255 11.017 11.017 0 0 1 5.125-1.39zm-6 3.69a3.748 3.748 0 1 1 0 7.496 3.748 3.748 0 0 1 0-7.496zm12 0a3.748 3.748 0 1 1 0 7.496 3.748 3.748 0 0 1 0-7.496zm-12 1.875a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75zm12 0a1.875 1.875 0 1 0 0 3.75 1.875 1.875 0 0 0 0-3.75z"
    />
  </svg>
);

// Metrics configuration type
interface Metric {
  id: string;
  logoComponent?: React.ReactNode;
  textLabel?: string;
  startValue: number;
  endValue: number;
  suffix: string;
  prefix: string;
  description: string;
  decimals?: number;
}

// Animated counter component
function AnimatedMetric({
  metric,
  progress,
}: {
  metric: Metric;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const value = useTransform(
    progress,
    [0, 1],
    [metric.startValue, metric.endValue]
  );

  const displayValue = useTransform(value, (v) => {
    if (metric.decimals) {
      return v.toFixed(metric.decimals);
    }
    return Math.round(v).toString();
  });

  return (
    <motion.div
      className="text-center px-4 py-8 md:py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo or text label as visual title */}
      <div className="flex items-center justify-center gap-2 mb-6 min-h-[40px]">
        {metric.logoComponent}
        {metric.textLabel && (
          <span className="text-brass text-xs tracking-[0.2em] uppercase">
            {metric.textLabel}
          </span>
        )}
      </div>

      {/* Animated value */}
      <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-paper mb-3">
        <span className="text-paper-muted">{metric.prefix}</span>
        <motion.span>{displayValue}</motion.span>
        <span className="text-paper-muted text-2xl md:text-3xl">
          {metric.suffix}
        </span>
      </div>

      {/* Description */}
      <p className="text-paper-muted text-sm">{metric.description}</p>
    </motion.div>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Metrics configuration - logos as visual titles
  const metrics: Metric[] = [
    {
      id: "ranking",
      logoComponent: <TripAdvisorLogo />,
      startValue: 1875,
      endValue: 1,
      suffix: "",
      prefix: "#",
      description: t.portfolio.metricRankingDesc,
    },
    {
      id: "reputation",
      logoComponent: (
        <>
          <GoogleLogo />
          <BookingLogo />
        </>
      ),
      startValue: 4.2,
      endValue: 9.4,
      suffix: "/10",
      prefix: "",
      decimals: 1,
      description: t.portfolio.metricReputationDesc,
    },
    {
      id: "excellence",
      textLabel: t.portfolio.metricExcellenceLabel,
      startValue: 12,
      endValue: 19,
      suffix: "/20",
      prefix: "",
      description: t.portfolio.metricExcellenceDesc,
    },
  ];

  // Scroll-linked animation - track the METRICS grid
  // Full range: from metrics entering bottom to metrics exiting top
  const { scrollYProgress } = useScroll({
    target: metricsRef,
    offset: ["start end", "end start"],
  });

  // Animation runs early in the scroll range so it's complete when section is centered
  // 0-15%: counters at starting values (metrics just entering)
  // 15-40%: animation runs rapidly
  // 40-100%: counters at final values (ready for nav click centering)
  const animationProgress = useTransform(scrollYProgress, [0.15, 0.4], [0, 1], {
    clamp: true,
  });

  return (
    <section ref={sectionRef} id="performance" className="section">
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
          className="font-serif text-3xl md:text-4xl lg:text-5xl text-paper mb-6 text-center"
        >
          {t.portfolio.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-paper-muted text-center mb-16 md:mb-24 max-w-xl mx-auto"
        >
          {t.portfolio.subtitle}
        </motion.p>

        {/* Metrics grid */}
        <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-brass-light">
          {metrics.map((metric, index) => (
            <div
              key={metric.id}
              className={`border-b border-brass-light ${
                index < metrics.length - 1 ? "md:border-r" : ""
              }`}
            >
              <AnimatedMetric metric={metric} progress={animationProgress} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
