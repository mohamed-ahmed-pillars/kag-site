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
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { FlowButton } from "@/components/ui/flow-button";

type Step = { id: string; title: string; text: string };

type TabMedia =
  | { value: string; type: "image"; src: string }
  | { value: string; type: "video"; src: string };

const TABS: TabMedia[] = [
  { value: "production", type: "video", src: "/privatelable.mp4" },
  { value: "packaging", type: "image", src: "/privatelable.png" },
  { value: "export", type: "image", src: "/exportstrip.jpg" },
];

export default function PrivateLabelSection() {
  const t = useTranslations("privateLabel");
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

  const stats = t.raw("stats") as string[];
  const steps = t.raw("steps") as Step[];

  return (
    <section
      ref={sectionRef}
      id="private-label"
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
            <Zap className="h-4 w-4" />
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

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-14">
          {/* LEFT */}
          <div className="md:col-span-6">
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="mb-6 h-7 rounded-full border-primary/30 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                {t("eyebrow")}
              </Badge>
            </motion.div>

            <motion.h2
              className="font-heading text-balance text-4xl font-bold leading-[1.0] tracking-tight text-primary sm:text-5xl md:text-6xl"
              variants={itemVariants}
            >
              {t("heading")}
            </motion.h2>

            <motion.p
              className="mt-6 max-w-xl text-foreground/80 leading-relaxed"
              variants={itemVariants}
            >
              {t("description")}
            </motion.p>

            {stats.length > 0 && (
              <motion.div
                className="mt-6 flex flex-wrap gap-2"
                variants={itemVariants}
              >
                {stats.map((s, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="h-7 rounded-full bg-primary/10 px-3 text-xs font-medium text-primary"
                  >
                    {s}
                  </Badge>
                ))}
              </motion.div>
            )}

            <motion.div className="mt-10 max-w-xl" variants={itemVariants}>
              <Accordion defaultValue={steps[0] ? [steps[0].id] : []} className="w-full">
                {steps.map((step) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="text-start text-base font-semibold text-foreground">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-foreground/70 leading-relaxed">
                      {step.text}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-8 flex flex-wrap gap-3">
                <FlowButton
                  href="/contact"
                  text={t("cta.primary")}
                  variant="primary"
                />
                <FlowButton
                  href="/products"
                  text={t("cta.secondary")}
                  variant="secondary"
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}
          <motion.div className="md:col-span-6" variants={itemVariants}>
            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-lg">
              <Tabs defaultValue={TABS[0].value} className="relative h-full w-full">
                <div className="relative h-[480px] w-full sm:h-[560px] lg:h-[680px]">
                  {TABS.map((tab, idx) => (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="absolute inset-0 m-0 h-full w-full"
                    >
                      {tab.type === "video" ? (
                        <video
                          src={tab.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={tab.src}
                          alt={t(`tabs.${tab.value}`)}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                          priority={idx === 0}
                        />
                      )}
                      {tab.value === "packaging" && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-black/40"
                        />
                      )}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent"
                      />
                    </TabsContent>
                  ))}
                </div>

                <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-10 flex w-full justify-center px-4">
                  <TabsList className="flex w-auto items-center gap-1 rounded-full bg-muted px-4 group-data-horizontal/tabs:h-12">
                    {TABS.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="h-8 flex-none rounded-full px-5 py-2 text-sm font-medium text-foreground/70 data-active:bg-primary data-active:text-primary-foreground"
                      >
                        {t(`tabs.${tab.value}`)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
