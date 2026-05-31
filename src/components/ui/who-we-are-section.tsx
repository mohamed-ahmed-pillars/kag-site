"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { Award, Sparkles, TrendingUp, Zap } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

const pillars = [
  { key: "manufacturing", icon: "/pattern/manufacturing-lime.png",        side: "left"  },
  { key: "privateLabel",  icon: "/pattern/private-label-lime.png",        side: "left"  },
  { key: "customRecipe",  icon: "/pattern/wheat-lime.png",                side: "left"  },
  { key: "distribution",  icon: "/pattern/distribution-truck-lime.png",   side: "right" },
  { key: "export",        icon: "/pattern/export-globe-lime.png",         side: "right" },
  { key: "quality",       icon: "/pattern/kag-monogram-lime.png",         side: "right" },
] as const;

const certifications = [
  { src: "/certifications/iso-22000.avif", alt: "ISO 22000" },
  { src: "/certifications/halal.avif",     alt: "Halal" },
  { src: "/certifications/fda.png",        alt: "FDA" },
  { src: "/certifications/gmp.png",        alt: "GMP" },
  { src: "/certifications/brc.png",        alt: "BRC" },
  { src: "/certifications/iso-45001.avif", alt: "ISO 45001" },
] as const;

const values = [
  { key: "quality",    Icon: Award },
  { key: "innovation", Icon: Sparkles },
  { key: "growth",     Icon: TrendingUp },
] as const;

interface PillarItemProps {
  iconSrc: string;
  title: string;
  description: string;
  variants: Variants;
  delay: number;
  direction: "left" | "right";
}

function PillarItem({
  iconSrc,
  title,
  description,
  variants,
  delay,
  direction,
}: PillarItemProps) {
  return (
    <motion.div
      className="group flex flex-col"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-3 flex items-center gap-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} alt="" className="h-10 w-10 object-contain" />
        </motion.div>
        <h3 className="font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
      </motion.div>
      <p className="ps-16 text-sm leading-relaxed text-foreground/80">
        {description}
      </p>
    </motion.div>
  );
}

export default function WhoWeAreSection() {
  const t = useTranslations("whoWeAre");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const valuesRef = useRef<HTMLDivElement>(null);
  const isValuesInView = useInView(valuesRef, { once: false, amount: 0.3 });

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
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="who-we-are"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background px-4 py-24 text-foreground"
    >
      {/* Parallax background blobs */}
      <motion.div
        className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/5 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      {/* Floating accent dots */}
      <motion.div
        className="absolute left-1/4 top-1/2 h-4 w-4 rounded-full bg-primary/30"
        animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/3 h-6 w-6 rounded-full bg-secondary/30"
        animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Heading block */}
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
            <Zap className="h-4 w-4" />
            {t("eyebrow")}
          </motion.span>

          <h2 className="mb-4 text-center font-display text-4xl md:text-5xl">
            {t("heading")}
          </h2>

          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {t("intro")}
        </motion.p>

        {/* Pillar grid: 3 left, framed video center, 3 right */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left column */}
          <div className="space-y-16">
            {pillars
              .filter((p) => p.side === "left")
              .map((p, i) => (
                <PillarItem
                  key={p.key}
                  iconSrc={p.icon}
                  title={t(`pillars.${p.key}.title`)}
                  description={t(`pillars.${p.key}.description`)}
                  variants={itemVariants}
                  delay={i * 0.2}
                  direction="left"
                />
              ))}
          </div>

          {/* Center: framed video */}
          <div className="order-first mb-8 flex items-center justify-center md:order-none md:mb-0">
            <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
              <motion.div
                className="overflow-hidden rounded-md shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <video
                  src="/mangojar.mp4"
                  poster="/mangojar.png"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Decorative offset frame */}
              <motion.div
                className="absolute inset-0 -m-3 rounded-md border-4 border-secondary z-[-1]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />

              {/* Floating decorative orbs */}
              <motion.div
                className="absolute -top-4 -right-8 h-16 w-16 rounded-full bg-primary/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={{ y: y1 }}
              />
              <motion.div
                className="absolute -bottom-6 -left-10 h-20 w-20 rounded-full bg-secondary/15"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                style={{ y: y2 }}
              />
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-16">
            {pillars
              .filter((p) => p.side === "right")
              .map((p, i) => (
                <PillarItem
                  key={p.key}
                  iconSrc={p.icon}
                  title={t(`pillars.${p.key}.title`)}
                  description={t(`pillars.${p.key}.description`)}
                  variants={itemVariants}
                  delay={i * 0.2}
                  direction="right"
                />
              ))}
          </div>
        </div>

        {/* Certifications marquee */}
        <motion.div className="mt-24" variants={itemVariants}>
          <h3 id="cert-marquee-heading" className="mb-6 text-center font-heading text-sm font-medium uppercase tracking-wider text-foreground/60">
            {t("certifications.heading")}
          </h3>

          <div
            aria-labelledby="cert-marquee-heading"
            role="region"
            className="group relative overflow-hidden"
          >
            {/* Left edge fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            {/* Right edge fade */}
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

            <div className="animate-marquee flex w-max gap-16">
              {/* Render twice for seamless loop */}
              {[...certifications, ...certifications].map((cert, i) => (
                <div
                  key={`${cert.alt}-${i}`}
                  className="flex shrink-0 items-center justify-center px-4"
                  aria-hidden={i >= certifications.length ? "true" : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.src}
                    alt={i >= certifications.length ? "" : cert.alt}
                    className="h-12 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Value cards: Quality / Innovation / Growth */}
        <motion.div
          ref={valuesRef}
          className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3"
          initial="hidden"
          animate={isValuesInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {values.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              className="group flex flex-col items-center rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary/10"
                whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <h3 className="font-heading text-xl font-medium text-foreground">
                {t(`values.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {t(`values.${key}.description`)}
              </p>
              <motion.div className="mt-3 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-16" />
            </motion.div>
          ))}
        </motion.div>
        {/* CTA banner */}
        <motion.div
          className="mt-20 flex flex-col items-center justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1">
            <h3 className="mb-2 font-heading text-2xl font-medium">
              {t("cta.heading")}
            </h3>
            <p className="text-primary-foreground/80">{t("cta.sub")}</p>
          </div>
          <FlowButton href="/contact" text={t("cta.button")} className="px-10 py-3" />
        </motion.div>
      </motion.div>
    </section>
  );
}
