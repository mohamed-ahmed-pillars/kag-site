# What We Offer — Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new "What We Offer" home-page section that introduces KAG's four working pillars (Our Brands, Private Label, Custom Recipe, Export) using a scroll-driven vertical timeline pattern derived from `src/components/ui/release-time-line.tsx`.

**Architecture:** A single client component (`src/components/ui/what-we-offer-section.tsx`) renders four pillar entries. Layout = sticky left icon column + right content card, with scroll-proximity active detection (RAF + `getBoundingClientRect` on per-entry sentinels). Inactive cards collapse their description (line-clamp) and items grid (CSS `grid-rows-[0fr]` → `[1fr]`); active card expands. Site-wide framer-motion vocabulary (parallax blobs, floating accent dots, staggered reveals) wraps the section. Two of the four cards (Our Brands, Private Label) have custom bodies; the other two follow the standard timeline card shape. Strings come from a new `whatWeOffer` i18n namespace in EN/FR/AR (FR/AR receive EN placeholders, matching the existing `whoWeAre` convention).

**Tech Stack:** Next.js (this repo's variant — see `AGENTS.md`), React 19, TypeScript, Tailwind v4, framer-motion, next-intl, lucide-react, FlowButton (`@/components/ui/flow-button`), `buttonVariants` from `@/components/ui/button`, project pattern icons in `/public/pattern/`.

**Design doc:** `docs/plans/2026-05-31-what-we-offer-section-design.md`

**Conventions (from project memory):**
- Brand colors: `bg-primary` (#374c9b), `bg-secondary` (#d5de24)
- Fonts: `font-display` for the H2, `font-heading` for sub-titles
- **Section root MUST NOT set any `bg-*`** (body `/bg6.jpg` shows through)
- Primary CTAs use `FlowButton`; outline/utility CTAs use `buttonVariants({ variant: "outline" })`
- In-app links use `import { Link } from "@/i18n/navigation"` (not next/link)
- Commits authored solely by Mohammed — **no `Co-Authored-By: Claude` trailer**
- Stage with `git add .`

---

## Task 0: Pre-flight check

**Step 1: Confirm assets exist**

Run:
```bash
ls public/yamkers_logo.png public/tasbeka_logo.png public/ourbrandsbackground.webp public/privatelable.jpg public/recipe.jpg public/exportstrip.jpg public/pattern/kag-monogram-lime.png public/pattern/private-label-lime.png public/pattern/wheat-lime.png public/pattern/export-globe-lime.png
```
Expected: every file listed, no errors.

**Step 2: Confirm dev server can boot**

Run:
```bash
npm run dev
```
Expected: server starts on port (usually 3000 or 3001) and `/en` renders the existing Hero + WhoWeAre sections without console errors. Kill the server when verified.

**Step 3: Confirm typecheck baseline is clean**

Run:
```bash
npm run typecheck 2>/dev/null || npx tsc --noEmit
```
Expected: zero errors.

**No commit for Task 0.** It's verification only.

---

## Task 1: Add `whatWeOffer` i18n keys to EN

**Files:**
- Modify: `src/i18n/messages/en.json` — append a `whatWeOffer` block as a sibling of `whoWeAre`

**Step 1: Add the namespace**

Insert the block below as the last sibling inside the top-level object (after `whoWeAre`):

```json
"whatWeOffer": {
  "eyebrow": "WHAT WE OFFER",
  "heading": "Four pillars, one promise",
  "intro": "From our own household brands to private-label production, bespoke recipes, and global export — every pillar is built on KAG's commitment to quality, consistency, and partnership.",
  "pillars": {
    "ourBrands": {
      "title": "Our Brands",
      "subtitle": "Yamkers & Tasbeka",
      "description": "Two trusted household names crafted in Egypt — covering tomato sauces, jams, juices, and fava beans for everyday tables.",
      "categories": ["Sauces", "Jams", "Juices", "Fava Beans"],
      "cta": {
        "primary": "See Our Products",
        "secondary": "Request a Quote"
      }
    },
    "privateLabel": {
      "badge": "PRIVATE LABEL",
      "title": "Expert Private Label Producers",
      "subtitle": "Your brand, our expertise",
      "tagline": "Your brand, our expertise.",
      "paragraphs": [
        "We produce tailor-made private-label products for international clients and partners. From sourcing premium ingredients to state-of-the-art manufacturing, we prioritize quality at every step.",
        "As a trusted partner, we work closely with each client to develop and deliver customized private-label solutions aligned with their brand vision and market positioning."
      ],
      "features": [
        { "title": "State-of-the-Art Manufacturing", "desc": "Modern lines and automated production." },
        { "title": "Premium Ingredients",            "desc": "Sourced through long-term grower partnerships." },
        { "title": "Dedicated Partnership",          "desc": "Close collaboration on tailored solutions." },
        { "title": "Global Scale",                   "desc": "International reach and distribution." }
      ],
      "capabilitiesHeading": "Our Capabilities",
      "capabilities": [
        "Custom Recipe Development",
        "Brand-Specific Packaging",
        "Quality Assurance & Testing",
        "Regulatory Compliance",
        "Supply Chain Management",
        "Global Distribution Support"
      ],
      "cta": "Partner with Us"
    },
    "customRecipe": {
      "title": "Custom Recipe",
      "subtitle": "From flavor brief to shelf",
      "description": "Bring us a flavor profile, a target market, or a competitor benchmark — our R&D team develops, samples, and scales the recipe that fits.",
      "items": [
        "Flavor profiling & formulation",
        "Sensory & shelf-life testing",
        "Pilot batch & scale-up trials",
        "Packaging match for target market"
      ],
      "cta": "Start a Recipe"
    },
    "export": {
      "title": "Export",
      "subtitle": "Egyptian origin, global shelves",
      "description": "KAG products move reliably across borders — backed by export documentation, logistics partners, and importers who value consistent supply.",
      "items": [
        "Established regional & global markets",
        "Logistics & export documentation",
        "Trusted importer/partner network",
        "Egyptian-origin consistency at scale"
      ],
      "cta": "Reach Global Markets"
    }
  }
}
```

**Step 2: Verify JSON parses**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/en.json','utf8'))" && echo OK
```
Expected: `OK`.

**Step 3: Commit**

```bash
git add .
git commit -m "i18n(what-we-offer): seed EN copy for new pillars section"
```

---

## Task 2: Mirror the same block into FR and AR

**Files:**
- Modify: `src/i18n/messages/fr.json`
- Modify: `src/i18n/messages/ar.json`

**Rationale:** The existing `whoWeAre` block is stored as EN placeholders in both FR and AR — the translator fills them later. We follow the same convention.

**Step 1:** Copy the exact same `whatWeOffer` block from Task 1 into the top-level object of `fr.json` (as the last sibling).

**Step 2:** Copy the exact same `whatWeOffer` block from Task 1 into the top-level object of `ar.json` (as the last sibling).

**Step 3: Verify both parse**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/fr.json','utf8'))" && \
node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/ar.json','utf8'))" && echo OK
```
Expected: `OK`.

**Step 4: Commit**

```bash
git add .
git commit -m "i18n(what-we-offer): mirror EN placeholders into FR and AR"
```

---

## Task 3: Scaffold `WhatWeOfferSection` with section header + entries data (no card body yet)

**Files:**
- Create: `src/components/ui/what-we-offer-section.tsx`

**Goal of this task:** Get the section header rendering (eyebrow, heading, accent bar, intro) with the site-wide parallax blobs + floating dots, plus a placeholder list of pillar entries. We will fill in each pillar card in subsequent tasks.

**Step 1: Create the file**

Write `src/components/ui/what-we-offer-section.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Zap } from "lucide-react";

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
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sentinelRefs.current.length) return;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const centerY = window.innerHeight / 3;
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
      if (bestIndex !== activeIndex) setActiveIndex(bestIndex);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeIndex]);

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
                aria-current={isActive ? "true" : "false"}
              >
                {/* Sticky icon + title column */}
                <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        "rounded-lg p-2 " +
                        (isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.icon} alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-sm font-medium">
                        {t(`pillars.${p.key}.title`)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.has?.(`pillars.${p.key}.subtitle`)
                          ? t(`pillars.${p.key}.subtitle`)
                          : null}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sentinel for active detection */}
                <div
                  ref={(el) => {
                    sentinelRefs.current[index] = el;
                  }}
                  aria-hidden
                  className="absolute -top-24 left-0 h-12 w-12 opacity-0"
                />

                {/* Card body — placeholder for now */}
                <article
                  className={
                    "flex flex-1 flex-col rounded-2xl border p-3 transition-all duration-300 " +
                    (isActive
                      ? "border-primary/40 bg-white/70 shadow-lg backdrop-blur-sm dark:bg-black/50"
                      : "border-foreground/10 bg-white/40 dark:bg-black/30")
                  }
                >
                  <div className="p-4 text-sm text-muted-foreground">
                    TODO: pillar body for <b>{p.key}</b>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
```

**NOTE on `t.has`:** if `t.has` is not available in the current `next-intl` version, replace the subtitle line with a try/catch fallback returning `null`. This will be tightened in Task 4 when we wire real subtitles. The simplest version, which always works, is:

```tsx
{/* subtitle is optional — pillars that don't define one omit the line */}
{(["ourBrands", "customRecipe", "export"] as const).includes(p.key as never)
  ? <span className="text-xs text-muted-foreground">{t(`pillars.${p.key}.subtitle`)}</span>
  : p.key === "privateLabel"
    ? <span className="text-xs text-muted-foreground">{t("pillars.privateLabel.subtitle")}</span>
    : null}
```

Or — since every pillar in our schema actually has a `subtitle` — just unconditionally render `{t(`pillars.${p.key}.subtitle`)}`. Use that simpler form.

**Step 2: Wire into the home page**

Edit `src/app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/ui/hero-section';
import WhoWeAreSection from '@/components/ui/who-we-are-section';
import WhatWeOfferSection from '@/components/ui/what-we-offer-section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <WhatWeOfferSection />
    </main>
  );
}
```

**Step 3: Typecheck + lint**

Run:
```bash
npx tsc --noEmit
```
Expected: zero errors.

Run:
```bash
npm run lint
```
Expected: zero errors for the new file (warnings for the explicit `eslint-disable-next-line` are intentional).

**Step 4: Browser smoke test**

Run `npm run dev`, open `http://localhost:3000/en`, scroll to below the "Who We Are" section. Verify:
- The new "What We Offer" eyebrow + heading + accent bar + intro render
- Four placeholder cards appear with sticky icon columns
- As you scroll, the sticky icon highlight (primary background) shifts to the card centered in the viewport
- No console errors

Kill the dev server when verified.

**Step 5: Commit**

```bash
git add .
git commit -m "feat(what-we-offer): scaffold timeline section with header and active scroll detection"
```

---

## Task 4: Implement the "Custom Recipe" and "Export" cards (standard timeline shape)

These two are the simplest — they follow the original `release-time-line.tsx` card shape with image, title, description, items list, and a FlowButton. Build them first to validate the standard card pattern, then layer the two custom cards on top.

**Files:**
- Modify: `src/components/ui/what-we-offer-section.tsx`

**Step 1: Add imports**

At the top of the file, add:

```tsx
import { FlowButton } from "@/components/ui/flow-button";
```

**Step 2: Add a `StandardCard` helper inside the file** (above the default export, or below — choice is yours).

```tsx
type StandardCardProps = {
  image: string;
  title: string;
  description: string;
  items: string[];
  ctaText: string;
  ctaHref: string;
  isActive: boolean;
};

function StandardCard({ image, title, description, items, ctaText, ctaHref, isActive }: StandardCardProps) {
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
            className={
              "font-heading text-md font-medium leading-tight tracking-tight md:text-lg transition-colors duration-200 " +
              (isActive ? "text-primary" : "text-foreground/70")
            }
          >
            {title}
          </h3>
          <p
            className={
              "text-xs leading-relaxed md:text-sm transition-all duration-300 " +
              (isActive
                ? "text-muted-foreground line-clamp-none"
                : "text-muted-foreground/80 line-clamp-2")
            }
          >
            {description}
          </p>
        </div>

        <div
          aria-hidden={!isActive}
          className={
            "grid transition-all duration-500 ease-out " +
            (isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
          }
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border border-foreground/10 bg-white/50 p-4 dark:bg-black/30">
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
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
```

**Step 3: Replace the TODO placeholder for `customRecipe` and `export`**

Inside the `PILLARS.map(...)` body, replace the TODO `<div>` so that when `p.key === "customRecipe"` or `p.key === "export"`, you render:

```tsx
{p.key === "customRecipe" && (
  <StandardCard
    image="/recipe.jpg"
    title={t("pillars.customRecipe.title")}
    description={t("pillars.customRecipe.description")}
    items={(t.raw("pillars.customRecipe.items") as string[])}
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
    items={(t.raw("pillars.export.items") as string[])}
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
```

**Step 4: Typecheck + lint + browser smoke**

```bash
npx tsc --noEmit && npm run lint
```
Expected: zero errors.

`npm run dev` → `http://localhost:3000/en` → scroll. Verify:
- Custom Recipe card shows `/recipe.jpg`, title, description, and (when centered) the bullet list + FlowButton "Start a Recipe" linking to `/contact`
- Export card shows `/exportstrip.jpg` and (when centered) "Reach Global Markets" linking to `/export`
- Cards above/below the centered card collapse the items list and clamp the description to 2 lines
- No console errors

**Step 5: Commit**

```bash
git add .
git commit -m "feat(what-we-offer): build standard timeline cards for Custom Recipe and Export"
```

---

## Task 5: Implement the "Our Brands" custom card

**Files:**
- Modify: `src/components/ui/what-we-offer-section.tsx`

**Step 1: Add imports**

```tsx
import { AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
```

**Step 2: Build a `BrandLogoCarousel` helper** (above the default export):

```tsx
const BRAND_LOGOS = [
  { src: "/yamkers_logo.png", alt: "Yamkers" },
  { src: "/tasbeka_logo.png", alt: "Tasbeka" },
];

function BrandLogoCarousel() {
  const [i, setI] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setI((v) => (v + 1) % BRAND_LOGOS.length), 3000);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    // Show both side-by-side, no rotation
    return (
      <div className="flex items-center justify-center gap-10">
        {BRAND_LOGOS.map((b) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={b.alt} src={b.src} alt={b.alt} className="h-24 w-auto object-contain" />
        ))}
      </div>
    );
  }

  const current = BRAND_LOGOS[i];
  return (
    <div className="relative flex h-28 w-full items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.img
          key={current.alt}
          src={current.src}
          alt={current.alt}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute h-24 w-auto object-contain drop-shadow-lg"
        />
      </AnimatePresence>
    </div>
  );
}
```

**Step 3: Build an `OurBrandsCard` helper:**

```tsx
type OurBrandsCardProps = {
  title: string;
  description: string;
  categories: string[];
  primaryCta: string;
  secondaryCta: string;
  isActive: boolean;
};

function OurBrandsCard({
  title,
  description,
  categories,
  primaryCta,
  secondaryCta,
  isActive,
}: OurBrandsCardProps) {
  return (
    <>
      <div
        className="relative mb-4 h-72 w-full overflow-hidden rounded-lg bg-cover bg-center"
        style={{ backgroundImage: "url('/ourbrandsbackground.webp')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex h-full items-center justify-center p-6">
          <BrandLogoCarousel />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3
            className={
              "font-heading text-md font-medium leading-tight tracking-tight md:text-lg transition-colors duration-200 " +
              (isActive ? "text-primary" : "text-foreground/70")
            }
          >
            {title}
          </h3>
          <p
            className={
              "text-xs leading-relaxed md:text-sm transition-all duration-300 " +
              (isActive
                ? "text-muted-foreground line-clamp-none"
                : "text-muted-foreground/80 line-clamp-2")
            }
          >
            {description}
          </p>

          {/* Category chips — always visible, brand-defining */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          aria-hidden={!isActive}
          className={
            "grid transition-all duration-500 ease-out " +
            (isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
          }
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
              <Link
                href="/rfq"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-6"
                )}
              >
                {secondaryCta}
              </Link>
              <FlowButton href="/products" text={primaryCta} className="px-6 py-2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 4: Render it in the map**

Replace the `ourBrands` TODO with:

```tsx
{p.key === "ourBrands" && (
  <OurBrandsCard
    title={t("pillars.ourBrands.title")}
    description={t("pillars.ourBrands.description")}
    categories={(t.raw("pillars.ourBrands.categories") as string[])}
    primaryCta={t("pillars.ourBrands.cta.primary")}
    secondaryCta={t("pillars.ourBrands.cta.secondary")}
    isActive={isActive}
  />
)}
```

**Step 5: Typecheck + lint + browser smoke**

```bash
npx tsc --noEmit && npm run lint
```

Browser checks:
- Our Brands card shows the dark-tinted brand background
- Yamkers and Tasbeka logos cycle every ~3 seconds with a soft fade
- Category chips (Sauces / Jams / Juices / Fava Beans) render in lime-tinted pills
- When the card is active, two CTAs appear: outline "Request a Quote" → `/rfq` and FlowButton "See Our Products" → `/products`
- With `prefers-reduced-motion: reduce` enabled in browser DevTools (Rendering panel), both logos render side-by-side without rotation
- No console errors

**Step 6: Commit**

```bash
git add .
git commit -m "feat(what-we-offer): add Our Brands card with brand-logo carousel and dual CTA"
```

---

## Task 6: Implement the "Private Label" custom card

**Files:**
- Modify: `src/components/ui/what-we-offer-section.tsx`

**Step 1: Add imports**

```tsx
import { Factory, Leaf, Handshake, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
```

**Step 2: Build a `PrivateLabelCard` helper**

```tsx
const PRIVATE_LABEL_FEATURE_ICONS: LucideIcon[] = [Factory, Leaf, Handshake, Globe];

type PrivateLabelCardProps = {
  badge: string;
  title: string;
  tagline: string;
  paragraphs: string[];
  features: { title: string; desc: string }[];
  capabilitiesHeading: string;
  capabilities: string[];
  cta: string;
  isActive: boolean;
};

function PrivateLabelCard({
  badge,
  title,
  tagline,
  paragraphs,
  features,
  capabilitiesHeading,
  capabilities,
  cta,
  isActive,
}: PrivateLabelCardProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/privatelable.jpg"
        alt=""
        className="mb-4 h-72 w-full rounded-lg object-cover"
        loading="lazy"
      />

      <div className="space-y-4">
        <div className="space-y-3">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {badge}
          </span>

          <h3
            className={
              "font-heading text-md font-medium leading-tight tracking-tight md:text-lg transition-colors duration-200 " +
              (isActive ? "text-primary" : "text-foreground/70")
            }
          >
            {title}
          </h3>

          <p className="italic text-secondary text-sm font-medium">{tagline}</p>

          <div
            className={
              "space-y-3 text-xs leading-relaxed md:text-sm transition-all duration-300 " +
              (isActive ? "text-muted-foreground line-clamp-none" : "line-clamp-2 text-muted-foreground/80")
            }
          >
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div
          aria-hidden={!isActive}
          className={
            "grid transition-all duration-500 ease-out " +
            (isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
          }
        >
          <div className="overflow-hidden">
            <div className="space-y-4 pt-2">
              {/* 2x2 feature grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((f, i) => {
                  const Icon = PRIVATE_LABEL_FEATURE_ICONS[i] ?? Factory;
                  return (
                    <div
                      key={f.title}
                      className="flex items-start gap-3 rounded-lg border border-foreground/10 bg-white/50 p-3 dark:bg-black/30"
                    >
                      <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{f.title}</div>
                        <div className="text-xs text-muted-foreground">{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Capabilities list */}
              <div className="rounded-lg border border-foreground/10 bg-white/50 p-4 dark:bg-black/30">
                <div className="mb-2 font-heading text-sm font-semibold text-foreground">
                  {capabilitiesHeading}
                </div>
                <ul className="space-y-2">
                  {capabilities.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                      <span className="leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <FlowButton href="/contact" text={cta} className="px-6 py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 3: Render it in the map**

Replace the `privateLabel` TODO with:

```tsx
{p.key === "privateLabel" && (
  <PrivateLabelCard
    badge={t("pillars.privateLabel.badge")}
    title={t("pillars.privateLabel.title")}
    tagline={t("pillars.privateLabel.tagline")}
    paragraphs={(t.raw("pillars.privateLabel.paragraphs") as string[])}
    features={(t.raw("pillars.privateLabel.features") as { title: string; desc: string }[])}
    capabilitiesHeading={t("pillars.privateLabel.capabilitiesHeading")}
    capabilities={(t.raw("pillars.privateLabel.capabilities") as string[])}
    cta={t("pillars.privateLabel.cta")}
    isActive={isActive}
  />
)}
```

**Step 4: Typecheck + lint + browser smoke**

```bash
npx tsc --noEmit && npm run lint
```

Browser checks:
- Private Label card shows `/privatelable.jpg`, "PRIVATE LABEL" pill badge, title, italic lime tagline, two paragraphs
- When active: 4 feature cards in a 2-col grid (1-col on mobile), "Our Capabilities" bullet list with 6 items, FlowButton "Partner with Us" → `/contact`
- When inactive: paragraphs clamp to 2 lines, feature grid + capabilities + CTA hidden
- No console errors

**Step 5: Commit**

```bash
git add .
git commit -m "feat(what-we-offer): add Private Label card with feature grid and capabilities list"
```

---

## Task 7: Full verification pass

**Step 1: Typecheck + lint (full project)**

```bash
npx tsc --noEmit && npm run lint
```
Expected: zero errors.

**Step 2: Build the production bundle**

```bash
npm run build
```
Expected: build succeeds; check for any prerender warnings related to the new section.

**Step 3: Visual verification across all four pillars at `/en`, `/fr`, `/ar`**

Run `npm run dev`. For each locale, verify:
- Section header renders with eyebrow, heading, accent bar, intro
- All four pillar cards render with the correct image / icon
- Scroll-active behavior swaps the sticky icon highlight and expands the centered card
- All CTAs link to the right routes: `/products`, `/rfq`, `/contact`, `/export`
- AR locale: the layout flips correctly (RTL), category chips and bullets still render properly
- No console errors or hydration mismatches

**Step 4: Reduced-motion check**

In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce", reload, and verify the Our Brands carousel no longer auto-rotates (both logos shown side-by-side).

**Step 5: Mobile breakpoint check**

Toggle DevTools mobile viewport (e.g. iPhone 12). Verify the cards stack into single column, sticky icon column collapses above the card, and nothing overflows horizontally.

**Step 6: If any issue surfaced — fix it, then re-run Step 1.**

**Step 7: No commit unless fixes were needed.** If fixes were made, commit with a `fix(what-we-offer): ...` message describing the fix.

---

## Done

After Task 7 succeeds:
- The home page renders Hero → Who We Are → What We Offer
- Four pillars cycle through active/inactive states as the user scrolls
- All copy is keyed off `whatWeOffer` in en/fr/ar (FR/AR carry EN placeholders)
- Buttons link to `/products`, `/rfq`, `/contact`, `/export`
- No new dependencies were added (uses existing framer-motion, lucide-react, next-intl, FlowButton, buttonVariants)

@superpowers:verification-before-completion should be invoked before claiming completion in any session that runs this plan.
