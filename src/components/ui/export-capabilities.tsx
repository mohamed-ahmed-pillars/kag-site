"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Zap } from "lucide-react";

const CAPABILITY_KEYS = [
  "volume",
  "branded",
  "formats",
  "regulatory",
  "shelfLife",
  "documentation",
] as const;

type CapabilityKey = (typeof CAPABILITY_KEYS)[number];

const ICON_BY_KEY: Record<CapabilityKey, string> = {
  volume:        "/pattern/manufacturing-lime.png",
  branded:       "/pattern/private-label-lime.png",
  formats:       "/pattern/wheat-lime.png",
  regulatory:    "/pattern/kag-monogram-lime.png",
  shelfLife:     "/pattern/distribution-truck-lime.png",
  documentation: "/pattern/export-globe-lime.png",
};

interface ExportCapabilitiesProps {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Record<CapabilityKey, { title: string; description: string }>;
}

export default function ExportCapabilities({
  eyebrow,
  heading,
  intro,
  items,
}: ExportCapabilitiesProps) {
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };
  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="capabilities"
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
        className="container relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="h-4 w-4" />
            {eyebrow}
          </motion.span>
          <h2 className="mb-4 text-center font-display text-4xl md:text-5xl">{heading}</h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {intro}
        </motion.p>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITY_KEYS.map((key) => (
            <motion.div
              key={key}
              className="group flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-3 flex items-center gap-3">
                <motion.div
                  className="rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20"
                  whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ICON_BY_KEY[key]} alt="" className="h-10 w-10 object-contain" />
                </motion.div>
                <h3 className="font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary">
                  {items[key].title}
                </h3>
              </div>
              <p className="ps-16 text-sm leading-relaxed text-foreground/80">
                {items[key].description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
