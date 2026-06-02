"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_KEYS = [
  "moq",
  "leadTime",
  "samples",
  "artwork",
  "regulatory",
  "incoterms",
] as const;
type FaqKey = (typeof FAQ_KEYS)[number];

interface PrivateLabelFaqProps {
  eyebrow: string;
  heading: string;
  items: Record<FaqKey, { question: string; answer: string }>;
}

export default function PrivateLabelFaq({
  eyebrow,
  heading,
  items,
}: PrivateLabelFaqProps) {
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
      id="faq"
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
        className="container relative z-10 mx-auto max-w-3xl"
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
            <HelpCircle className="h-4 w-4" />
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

        <motion.div className="mt-10" variants={itemVariants}>
          <Accordion defaultValue={[FAQ_KEYS[0]]} className="w-full">
            {FAQ_KEYS.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-start text-base font-semibold text-foreground">
                  {items[key].question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/70">
                  {items[key].answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </motion.div>
    </section>
  );
}
