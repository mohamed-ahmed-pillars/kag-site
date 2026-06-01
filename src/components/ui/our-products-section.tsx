"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Zap } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";
import { ProductCard } from "@/components/ui/product-card";

type ProductKey =
  | "sauce"
  | "favebeans"
  | "favebeansTehina"
  | "chiliFavebeans"
  | "mangoJar"
  | "appleJam";

const PRODUCTS: {
  key: ProductKey;
  image: string;
  video: string;
  themeColor: string;
}[] = [
  { key: "sauce",           image: "/sauce.png",           video: "/sauce.mp4",           themeColor: "0 65% 38%"   },
  { key: "favebeans",       image: "/favebeans.png",       video: "/favebeans.mp4",       themeColor: "28 45% 28%"  },
  { key: "favebeansTehina", image: "/favebeanstehina.png", video: "/favebeanstehina.mp4", themeColor: "38 35% 38%"  },
  { key: "chiliFavebeans",  image: "/chilifavebeans.png",  video: "/chilifavebeans.mp4",  themeColor: "12 70% 38%"  },
  { key: "mangoJar",        image: "/mangojar.png",        video: "/mangojar.mp4",        themeColor: "38 80% 42%"  },
  { key: "appleJam",        image: "/applejam.png",        video: "/applejam.mp4",        themeColor: "350 55% 32%" },
];

export default function OurProductsSection() {
  const t = useTranslations("ourProducts");
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
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
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

  return (
    <section
      ref={sectionRef}
      id="our-products"
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
          <h2 className="mb-4 text-center font-display text-4xl font-light md:text-5xl">
            {t("heading")}
          </h2>
          <motion.div
            className="h-1 bg-primary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-foreground/80"
          variants={itemVariants}
        >
          {t("intro")}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
          variants={containerVariants}
        >
          {PRODUCTS.map((product) => (
            <motion.div
              key={product.key}
              variants={itemVariants}
              className="h-[450px]"
            >
              <ProductCard
                brand={t(`items.${product.key}.brand`)}
                name={t(`items.${product.key}.name`)}
                imageUrl={product.image}
                videoUrl={product.video}
                themeColor={product.themeColor}
                previewLabel={t("previewLabel")}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center"
          variants={itemVariants}
        >
          <FlowButton href="/products" text={t("cta")} />
        </motion.div>
      </motion.div>
    </section>
  );
}
