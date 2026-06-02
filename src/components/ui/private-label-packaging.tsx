"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Package } from "lucide-react";

const PACKAGING_KEYS = ["tin", "glass", "pet", "pouch"] as const;
type PackagingKey = (typeof PACKAGING_KEYS)[number];

const ICON_BY_KEY: Record<PackagingKey, string> = {
  tin:   "/pattern/manufacturing-lime.png",
  glass: "/pattern/private-label-lime.png",
  pet:   "/pattern/wheat-lime.png",
  pouch: "/pattern/kag-monogram-lime.png",
};

interface PrivateLabelPackagingProps {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Record<PackagingKey, { title: string; moq: string; capacities: string[] }>;
}

export default function PrivateLabelPackaging({
  eyebrow,
  heading,
  intro,
  items,
}: PrivateLabelPackagingProps) {
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
      id="packaging"
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
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Package className="h-4 w-4" />
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGING_KEYS.map((key, i) => (
            <motion.div
              key={key}
              className="group flex flex-col items-center rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: i * 0.1 },
                },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10"
                whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              >
                <Image
                  src={ICON_BY_KEY[key]}
                  alt=""
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
              <h3 className="font-heading text-lg font-medium text-foreground">
                {items[key].title}
              </h3>
              <p className="mt-1 text-xs text-foreground/60">{items[key].moq}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {items[key].capacities.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-secondary/20 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <motion.div className="mt-3 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-16" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
