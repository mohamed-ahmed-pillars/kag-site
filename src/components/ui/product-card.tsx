"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  CardHoverReveal,
  CardHoverRevealContent,
  CardHoverRevealMain,
} from "@/components/ui/reveal-on-hover";
import { RequestQuoteButton } from "@/components/ui/request-quote-button";
import type { Product } from "@/lib/data/products";

interface ProductCardProps {
  product: Product;
  locale: string;
  labels: {
    brand: Record<Product["brand"], string>;
    packaging: Record<Product["packaging"]["type"], string>;
    perCarton: string;
    net: string;
    drained: string;
  };
}

function Chip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "spec" | "pack";
}) {
  const cls =
    tone === "spec"
      ? "bg-secondary/20 text-secondary"
      : "bg-white/15 text-white";
  return (
    <span
      className={`rounded-full px-2 py-1 text-[11px] leading-none font-medium ${cls}`}
    >
      {children}
    </span>
  );
}

function Placeholder({ name }: { name: string }) {
  return (
    <div
      className="relative h-full w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/bg6.jpg')" }}
      role="img"
      aria-label={name}
    >
      <div className="absolute inset-0 bg-primary/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/navbarLogo.svg"
          alt=""
          width={140}
          height={48}
          className="opacity-50"
        />
      </div>
    </div>
  );
}

export default function ProductCard({
  product,
  locale,
  labels,
}: ProductCardProps) {
  const t = useTranslations("products.items");
  const isAr = locale === "ar";
  const name = t(`${product.slug}.name`);
  const description = t(`${product.slug}.description`);
  const netWeight = isAr ? product.specs.netWeightAr : product.specs.netWeight;
  const drained = isAr
    ? product.specs.drainedWeightAr
    : product.specs.drainedWeight;

  return (
    <CardHoverReveal className="aspect-[4/5] w-full rounded-2xl border border-primary/10 bg-card shadow-sm">
      <CardHoverRevealMain>
        {product.image ? (
          <Image
            src={product.image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Placeholder name={name} />
        )}
      </CardHoverRevealMain>

      <CardHoverRevealContent className="space-y-3 rounded-2xl bg-primary/75 text-white">
        <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wider">
          {labels.brand[product.brand]}
        </span>

        <h3 className="text-base font-semibold leading-tight">{name}</h3>
        <p className="text-xs leading-relaxed text-white/75">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          <Chip tone="spec">
            {labels.net} {netWeight}
          </Chip>
          {drained && (
            <Chip tone="spec">
              {labels.drained} {drained}
            </Chip>
          )}
          {product.specs.concentration && (
            <Chip tone="spec">{product.specs.concentration}</Chip>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Chip tone="pack">{labels.packaging[product.packaging.type]}</Chip>
          <Chip tone="pack">
            {product.packaging.unitsPerCarton}
            {labels.perCarton}
          </Chip>
        </div>

        <div className="pt-2">
          <RequestQuoteButton type="brands" productId={product.id} variant="secondary" className="px-5 py-2 text-xs" />
        </div>
      </CardHoverRevealContent>
    </CardHoverReveal>
  );
}
