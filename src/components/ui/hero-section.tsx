"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

const heroVideos = ["/1.mp4", "/2.mp4", "/3.mp4", "/4.mp4", "/testvid.mp4"] as const;

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [videoIdx, setVideoIdx] = useState(0);

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
        key={videoIdx}
        src={heroVideos[videoIdx]}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={() => setVideoIdx((i) => (i + 1) % heroVideos.length)}
        style={{ scale: videoScale }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

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
            Welcome to KAG
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mb-6 text-4xl font-light leading-tight md:text-6xl lg:text-7xl"
          >
            Crafting Quality
            <br />
            Beyond Borders
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-xl text-base text-white/80 md:text-lg"
          >
            From farm to table, we deliver premium products and a story of
            excellence to every corner of the world.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <FlowButton text="Discover More" />
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
