"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <motion.video
        src="/herovid.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{ scale: videoScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full w-full items-center justify-center px-4"
      >
        <motion.div
          className="max-w-3xl text-center text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.span
            variants={itemVariants}
            className="mb-4 block text-xs font-medium uppercase tracking-[0.3em] text-white/80 md:text-sm"
          >
            {t("eyebrow")}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-light leading-tight md:text-6xl lg:text-7xl"
          >
            {t("heading.line1")}
            <br />
            {t("heading.line2")}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-xl text-base text-white/80 md:text-lg"
          >
            {t("subhead")}
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <FlowButton
              text={t("cta")}
              onClick={() => {
                sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
