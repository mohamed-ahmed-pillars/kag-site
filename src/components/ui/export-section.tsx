"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { CheckCircle2, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FlowButton } from "@/components/ui/flow-button";

export default function ExportSection() {
  const t = useTranslations("export");
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

  const features = t.raw("features") as string[];

  return (
    <section
      ref={sectionRef}
      id="export"
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
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {t("section.intro")}
        </motion.p>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-14">
          {/* LEFT */}
          <div className="md:col-span-6 space-y-8">
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="h-7 rounded-full border-primary/30 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                <span className="me-2 inline-flex h-2 w-2 rounded-full bg-primary" />
                {t("eyebrow")}
              </Badge>
            </motion.div>

            <motion.h2
              className="font-heading text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
              variants={itemVariants}
            >
              {t("heading.lead")}{" "}
              <span className="text-primary">{t("heading.accent")}</span>{" "}
              {t("heading.trail")}
            </motion.h2>

            <motion.p
              className="max-w-xl leading-relaxed text-foreground/80"
              variants={itemVariants}
            >
              {t("description")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={itemVariants}
            >
              <FlowButton
                href="/export"
                text={t("cta.primary")}
                variant="primary"
              />
              <FlowButton
                href="/products"
                text={t("cta.secondary")}
                variant="secondary"
              />
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div
            className="relative md:col-span-6"
            variants={itemVariants}
          >
            <div className="relative rounded-2xl border border-primary/10 bg-card/80 p-6 shadow-lg backdrop-blur-sm">
              <div className="relative mb-6 aspect-video overflow-hidden rounded-lg border border-primary/10">
                <Image
                  src="/exportstrip.jpg"
                  alt={t("section.heading")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent"
                />
              </div>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={
                      isInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: 20 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.7 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex items-start gap-4"
                  >
                    <div className="shrink-0 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="text-base text-foreground/80">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
