"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Bean,
  Cherry,
  GlassWater,
  LayoutGrid,
  Salad,
  Soup,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ui/product-card";
import type { Product, ProductCategory } from "@/lib/data/products";

type TabKey = "all" | ProductCategory;

const TABS: { key: TabKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", icon: LayoutGrid },
  { key: "tomato_paste", icon: Soup },
  { key: "fava_beans", icon: Bean },
  { key: "beans_peas", icon: Sprout },
  { key: "canned_vegetables", icon: Salad },
  { key: "jams", icon: Cherry },
  { key: "juices", icon: GlassWater },
];

interface Labels {
  catalog: { eyebrow: string; heading: string; intro: string };
  tabs: Record<TabKey, string>;
  card: {
    brand: Record<Product["brand"], string>;
    packaging: Record<Product["packaging"]["type"], string>;
    perCarton: string;
    net: string;
    drained: string;
  };
}

interface ProductsTabsProps {
  products: Product[];
  locale: string;
  labels: Labels;
}

export default function ProductsTabs({
  products,
  locale,
  labels,
}: ProductsTabsProps) {
  const [active, setActive] = useState<TabKey>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.1 });

  const filtered = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter((p) => p.category === active),
    [active, products]
  );

  return (
    <section
      id="catalog"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <span className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-primary">
            {labels.catalog.eyebrow}
          </span>
          <h2 className="mb-4 font-display text-4xl font-light md:text-5xl">
            {labels.catalog.heading}
          </h2>
          <motion.div
            className="h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={inView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <p className="mt-6 max-w-2xl text-foreground/80">
            {labels.catalog.intro}
          </p>
        </motion.div>

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {TABS.map(({ key, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground/70 hover:bg-muted/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {labels.tabs[key]}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <ProductCard
                  product={product}
                  locale={locale}
                  labels={labels.card}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
