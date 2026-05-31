"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlowButton } from "@/components/ui/flow-button";

type PillarKey = "ourBrands" | "privateLabel" | "customRecipe" | "export";

const PILLARS: { key: PillarKey; icon: string }[] = [
  { key: "ourBrands",    icon: "/pattern/kag-monogram-lime.png" },
  { key: "privateLabel", icon: "/pattern/private-label-lime.png" },
  { key: "customRecipe", icon: "/pattern/wheat-lime.png" },
  { key: "export",       icon: "/pattern/export-globe-lime.png" },
];

export default function WhatWeOfferSection() {
  const t = useTranslations("whatWeOffer");
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

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const centerY = window.innerHeight / 2;
      let bestIndex = 0;
      let bestDist = Infinity;
      sentinelRefs.current.forEach((node, i) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - centerY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });
      if (bestIndex !== activeIndexRef.current) {
        activeIndexRef.current = bestIndex;
        setActiveIndex(bestIndex);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

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
      id="what-we-offer"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
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
        <motion.div className="mb-6 flex flex-col items-center" variants={itemVariants}>
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

        {/* Timeline body — pillar entries get filled in subsequent tasks */}
        <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
          {PILLARS.map((p, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={p.key}
                className="relative flex flex-col gap-4 md:flex-row md:gap-16"
                aria-current={isActive ? "step" : undefined}
              >
                {/* Sticky icon + title column */}
                <div className="flex h-min w-64 shrink-0 items-center gap-4 md:sticky md:top-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-lg p-2 transition-colors duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.icon} alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-sm font-medium">
                        {t(`pillars.${p.key}.title`)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t(`pillars.${p.key}.subtitle`)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sentinel for active detection */}
                <div
                  ref={(el) => {
                    sentinelRefs.current[index] = el;
                    return () => {
                      sentinelRefs.current[index] = null;
                    };
                  }}
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 opacity-0"
                />

                {/* Card body — placeholder for now */}
                <article
                  className={cn(
                    "flex flex-1 flex-col rounded-2xl border p-3 transition-all duration-300",
                    isActive
                      ? "border-primary/40 bg-white/70 shadow-lg backdrop-blur-sm dark:bg-black/50"
                      : "border-foreground/10 bg-white/40 dark:bg-black/30",
                  )}
                >
                  {p.key === "customRecipe" && (
                    <StandardCard
                      image="/recipe.jpg"
                      title={t("pillars.customRecipe.title")}
                      description={t("pillars.customRecipe.description")}
                      items={t.raw("pillars.customRecipe.items") as string[]}
                      ctaText={t("pillars.customRecipe.cta")}
                      ctaHref="/contact"
                      isActive={isActive}
                    />
                  )}
                  {p.key === "export" && (
                    <StandardCard
                      image="/exportstrip.jpg"
                      title={t("pillars.export.title")}
                      description={t("pillars.export.description")}
                      items={t.raw("pillars.export.items") as string[]}
                      ctaText={t("pillars.export.cta")}
                      ctaHref="/export"
                      isActive={isActive}
                    />
                  )}
                  {p.key === "ourBrands" && (
                    <div className="p-4 text-sm text-muted-foreground">TODO: Our Brands</div>
                  )}
                  {p.key === "privateLabel" && (
                    <div className="p-4 text-sm text-muted-foreground">TODO: Private Label</div>
                  )}
                </article>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

type StandardCardProps = {
  image: string;
  title: string;
  description: string;
  items: string[];
  ctaText: string;
  ctaHref: string;
  isActive: boolean;
};

function StandardCard({
  image,
  title,
  description,
  items,
  ctaText,
  ctaHref,
  isActive,
}: StandardCardProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="mb-4 h-72 w-full rounded-lg object-cover"
        loading="lazy"
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <h3
            className={cn(
              "font-heading text-md font-medium leading-tight tracking-tight md:text-lg transition-colors duration-200",
              isActive ? "text-primary" : "text-foreground/70",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-xs leading-relaxed md:text-sm transition-all duration-300",
              isActive
                ? "text-muted-foreground line-clamp-none"
                : "text-muted-foreground/80 line-clamp-2",
            )}
          >
            {description}
          </p>
        </div>

        <div
          aria-hidden={!isActive}
          className={cn(
            "grid transition-all duration-500 ease-out",
            isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border border-foreground/10 bg-white/50 p-4 dark:bg-black/30">
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <FlowButton href={ctaHref} text={ctaText} className="px-6 py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
