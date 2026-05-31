"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Award, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlowButton } from "@/components/ui/flow-button";

export default function WhoWeAreSection() {
  const t = useTranslations("whoWeAre");
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

        {/* Pillar grid — added in Task 5 */}
        {/* Marquee — added in Task 6 */}
        {/* Value cards — added in Task 7 */}
        {/* CTA banner — added in Task 8 */}
      </motion.div>
    </section>
  );
}
