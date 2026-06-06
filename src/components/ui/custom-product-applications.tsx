"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Boxes } from "lucide-react";

const APPLICATION_KEYS = [
  "sauces",
  "jams",
  "juices",
  "fava",
  "condiments",
] as const;

type ApplicationKey = (typeof APPLICATION_KEYS)[number];

interface CustomProductApplicationsProps {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Record<ApplicationKey, { title: string; description: string }>;
}

export default function CustomProductApplications({
  eyebrow,
  heading,
  intro,
  items,
}: CustomProductApplicationsProps) {
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
      id="applications"
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
            <Boxes className="h-4 w-4" />
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {APPLICATION_KEYS.map((key, i) => (
            <motion.div
              key={key}
              className="group relative flex flex-col rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-secondary/40 hover:bg-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: i * 0.08 },
                },
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <h3 className="mb-3 font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary">
                {items[key].title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/75">
                {items[key].description}
              </p>
              <motion.div className="mt-4 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-20" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
