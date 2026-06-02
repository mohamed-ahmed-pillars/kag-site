"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Ship, Anchor, Container } from "lucide-react";

const TERM_KEYS = ["fob", "cif", "exw", "dap"] as const;
type TermKey = (typeof TERM_KEYS)[number];

interface ExportIncotermsProps {
  eyebrow: string;
  heading: string;
  intro: string;
  terms: Record<TermKey, { title: string; description: string }>;
  ports: { heading: string; items: string[] };
  containers: { heading: string; items: string[] };
}

export default function ExportIncoterms({
  eyebrow,
  heading,
  intro,
  terms,
  ports,
  containers,
}: ExportIncotermsProps) {
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
      id="incoterms"
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
            <Ship className="h-4 w-4" />
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
          {TERM_KEYS.map((key, i) => (
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
              <span className="mb-3 font-display text-3xl font-bold text-primary">
                {terms[key].title}
              </span>
              <p className="text-sm leading-relaxed text-foreground/75">
                {terms[key].description}
              </p>
              <motion.div className="mt-4 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-20" />
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Anchor className="h-5 w-5" />
              <h3 className="font-heading text-lg font-semibold">{ports.heading}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ports.items.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-primary"
                >
                  {p}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Container className="h-5 w-5" />
              <h3 className="font-heading text-lg font-semibold">{containers.heading}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {containers.items.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-medium text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
