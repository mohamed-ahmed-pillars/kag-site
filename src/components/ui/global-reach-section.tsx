"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Globe2 } from "lucide-react";
import { WorldMap } from "@/components/ui/map";

const CAIRO = { lat: 30.0084, lng: 31.5333, label: "Cairo" } as const;

type Destination = { lat: number; lng: number; key: string };

const DESTINATIONS: Destination[] = [
  // Middle East
  { lat: 25.2048, lng: 55.2708, key: "dubai" },
  { lat: 24.7136, lng: 46.6753, key: "riyadh" },
  { lat: 31.9539, lng: 35.9106, key: "amman" },
  { lat: 33.8938, lng: 35.5018, key: "beirut" },
  // Europe
  { lat: 51.5074, lng: -0.1278, key: "london" },
  { lat: 51.9244, lng: 4.4777,  key: "rotterdam" },
  { lat: 48.8566, lng: 2.3522,  key: "paris" },
  // Africa
  { lat: -1.2921, lng: 36.8219, key: "nairobi" },
  { lat: 6.5244,  lng: 3.3792,  key: "lagos" },
  { lat: 33.5731, lng: -7.5898, key: "casablanca" },
  // South America
  { lat: -23.5505, lng: -46.6333, key: "saoPaulo" },
];

export default function GlobalReachSection() {
  const t = useTranslations("globalReach");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const cairoLabel = t("origin.label");
  const dots = DESTINATIONS.map((d) => ({
    start: { lat: CAIRO.lat, lng: CAIRO.lng, label: cairoLabel },
    end: { lat: d.lat, lng: d.lng, label: t(`destinations.${d.key}`) },
  }));

  const regions = t.raw("regions") as Array<{ name: string; countries: string }>;

  return (
    <section
      ref={sectionRef}
      id="global-reach"
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
    >
      <motion.div
        className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-7xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="mb-6 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Globe2 className="h-4 w-4" />
            {t("section.eyebrow")}
          </motion.span>
          <h2 className="mb-4 text-center font-display text-4xl font-light md:text-5xl">
            {t("section.heading")}
          </h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-12 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {t("section.intro")}
        </motion.p>

        <motion.div
          className="overflow-hidden rounded-2xl border border-primary/10 bg-card/60 p-3 shadow-lg backdrop-blur-sm sm:p-4"
          variants={itemVariants}
        >
          <WorldMap dots={dots} lineColor="#374c9b" dotColor="#374c9b66" />
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={itemVariants}
        >
          {regions.map((r, i) => (
            <motion.div
              key={i}
              className="group rounded-xl border border-primary/10 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-primary/30"
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {r.name}
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed">
                {r.countries}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
