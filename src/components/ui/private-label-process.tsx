"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Workflow } from "lucide-react";

const STEP_KEYS = [
  "brief",
  "recipe",
  "samples",
  "pilot",
  "production",
  "shipment",
] as const;

type StepKey = (typeof STEP_KEYS)[number];

interface PrivateLabelProcessProps {
  eyebrow: string;
  heading: string;
  intro: string;
  steps: Record<StepKey, { title: string; description: string }>;
}

export default function PrivateLabelProcess({
  eyebrow,
  heading,
  intro,
  steps,
}: PrivateLabelProcessProps) {
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
      id="process"
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
        className="container relative z-10 mx-auto max-w-5xl"
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
            <Workflow className="h-4 w-4" />
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

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-6 w-0.5 bg-primary/20 md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-12">
            {STEP_KEYS.map((key, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.li
                  key={key}
                  className="relative md:grid md:grid-cols-2 md:gap-12"
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute left-6 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 md:left-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-primary shadow-md">
                      {i + 1}
                    </div>
                  </div>

                  <div
                    className={`ps-16 md:ps-0 ${
                      isLeft ? "md:col-start-1 md:pe-12 md:text-end" : "md:col-start-2 md:ps-12"
                    }`}
                  >
                    <div className="rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm">
                      <h3 className="mb-2 font-heading text-xl text-foreground">
                        {steps[key].title}
                      </h3>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {steps[key].description}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
