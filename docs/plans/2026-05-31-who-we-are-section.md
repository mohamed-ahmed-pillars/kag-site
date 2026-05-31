# Who We Are Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship the "Who We Are" home-page section described in `docs/plans/2026-05-31-who-we-are-section-design.md` — six pillar cards around a framed product video, an animated certifications marquee, three tone-of-voice value cards, and a brand-primary CTA banner.

**Architecture:** Single client component (`src/components/ui/who-we-are-section.tsx`) mounted in `src/app/[locale]/page.tsx` below `<HeroSection />`. Uses `framer-motion` for scroll/in-view reveals and parallax, pure CSS keyframes for the marquee, brand pattern PNGs from `/public/pattern/` for pillar icons, and `useTranslations` for all copy. No new dependencies.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 with brand CSS vars · framer-motion · lucide-react · next-intl 4 · next/image · `bun` for scripts.

**Verification gates:** This is a pure presentational UI component with no business logic — there is no unit-test infrastructure for React components in this repo (only `bun:test` for Zod schema validation in `tests/lib/`). Per the project's global instructions, the verification gates between steps are:

1. `bun x tsc --noEmit` — must exit cleanly with no output.
2. After all visual steps are done, `bun dev` and a manual browser walk-through across `/en`, `/fr`, `/ar` at desktop + mobile widths.

**Constraints (project memory — re-read before editing):**

- Brand tokens only: `bg-primary` / `bg-secondary` / `text-foreground` / etc. Never hex literals from the reference (`#88734C`, `#202e44`).
- Fonts: `font-sans` / `font-heading` / `font-display`. Never hardcode `font-family` or pull from Google Fonts.
- Section animation vocabulary must match `src/components/ui/about-us-section.tsx` (scroll-triggered reveals, parallax blobs, staggered variants, hover micro-interactions).
- Default CTA button is `FlowButton` from `@/components/ui/flow-button`.
- Pillar icons MUST use the matching `/public/pattern/*-lime.png` file, not lucide-react. Lucide allowed only for the three value cards (no pattern match for abstract values).
- Project assets only (no Unsplash / stock URLs).

---

## Task 1 — Add i18n keys for the section

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/fr.json`
- Modify: `src/i18n/messages/ar.json`

**Step 1.1 — Append the `whoWeAre` namespace to `en.json`.**

Read the current file first (it currently has only `nav`). Add a new top-level key alongside `nav`, exactly:

```json
"whoWeAre": {
  "eyebrow": "OUR STORY",
  "heading": "Who We Are",
  "intro": "KAG is an Egyptian food group producing, distributing, and exporting trusted food products — from tomato sauces and jams to juices and fava beans. We build for both local communities and global markets, grounded in three values: Quality. Innovation. Growth.",
  "pillars": {
    "manufacturing":   { "title": "Manufacturing",          "description": "Tomato sauces, jams, juices, fava beans — produced in-house to international food-safety standards." },
    "privateLabel":    { "title": "Private Labeling",       "description": "We manufacture under your brand, with consistent quality at the volumes retail demands." },
    "customRecipe":    { "title": "Custom Recipe",          "description": "Bring us a flavor profile or a target market — we develop the recipe, sample it, and scale it." },
    "distribution":    { "title": "Distribution & Trading", "description": "A trade network that moves food goods reliably across Egypt and into regional markets." },
    "export":          { "title": "Export",                 "description": "KAG products on shelves abroad — partnering with importers who value Egyptian origin and consistent supply." },
    "quality":         { "title": "Quality & Food Safety",  "description": "Every batch passes through documented quality controls so what leaves our factory matches the spec." }
  },
  "certifications": {
    "heading": "Backed by international standards"
  },
  "values": {
    "quality":     { "title": "Quality",     "description": "Tomato sauces, jams, and juices crafted to international food-safety standards — every batch, every market." },
    "innovation":  { "title": "Innovation",  "description": "New recipes, new packaging, new partnerships — we evolve what KAG puts on the shelf so it stays relevant." },
    "growth":      { "title": "Growth",      "description": "Built in Egypt for the world: we grow KAG, our private-label partners, and the trade networks that carry our food." }
  },
  "cta": {
    "heading": "Ready to bring KAG quality to your shelves?",
    "sub": "Talk to our team about manufacturing, private-label, custom recipes, or export.",
    "button": "Talk to our team"
  }
}
```

**Step 1.2 — Mirror the exact same key tree into `fr.json` and `ar.json`.**

Per the design (Q5 = A): seed fr/ar with the **English copy verbatim** as placeholders. Mohammed translates later. Keep the JSON valid (commas, no trailing comma on the last key).

**Step 1.3 — Verify JSON is parseable.**

Run:
```bash
bun -e 'console.log(JSON.parse(require("fs").readFileSync("src/i18n/messages/en.json", "utf8")).whoWeAre.heading); console.log(JSON.parse(require("fs").readFileSync("src/i18n/messages/fr.json", "utf8")).whoWeAre.heading); console.log(JSON.parse(require("fs").readFileSync("src/i18n/messages/ar.json", "utf8")).whoWeAre.heading)'
```

Expected output (3 lines):
```
Who We Are
Who We Are
Who We Are
```

**Step 1.4 — Commit.**

```bash
git add src/i18n/messages/ && git commit -m "i18n: add whoWeAre namespace (en/fr/ar seeded with English)"
```

---

## Task 2 — Add the marquee CSS to `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Step 2.1 — Read `src/app/globals.css`** to find a clean insertion point (after the existing `@keyframes` block if one exists, otherwise at end of file before any final closing braces).

**Step 2.2 — Append exactly this block:**

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.group:hover .animate-marquee {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
```

**Step 2.3 — Verify the dev server still parses CSS.**

Run:
```bash
bun x tsc --noEmit
```
Expected: clean exit, no output. (CSS isn't type-checked but `tsc` confirms nothing else broke.)

**Step 2.4 — Commit.**

```bash
git add src/app/globals.css && git commit -m "css: add marquee keyframes + pause-on-hover + reduced-motion guard"
```

---

## Task 3 — Create the section scaffold (file, imports, root structure, animation variants, parallax blobs, decorative dots)

**Files:**
- Create: `src/components/ui/who-we-are-section.tsx`

**Step 3.1 — Re-read the style reference** to keep the animation vocabulary in sync:

```bash
# Just open it for reference — no edit
```
Read: `src/components/ui/about-us-section.tsx` lines 32–182 (the imports, `useScroll`/`useTransform` setup, `containerVariants` / `itemVariants`, parallax blobs, dots).

**Step 3.2 — Write the scaffold file** with this exact content:

```tsx
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
        {/* Heading block — added in Task 4 */}
        {/* Pillar grid — added in Task 5 */}
        {/* Marquee — added in Task 6 */}
        {/* Value cards — added in Task 7 */}
        {/* CTA banner — added in Task 8 */}
      </motion.div>
    </section>
  );
}
```

**Step 3.3 — Type-check.**

Run:
```bash
bun x tsc --noEmit
```
Expected: clean (the component compiles even though it's still mostly empty — `cn`, `FlowButton`, and the lucide imports are unused but will be consumed in later tasks; TypeScript will warn but not error unless strict unused-import lints are on; if it does error, suppress with `// eslint-disable-next-line` is wrong — instead, **move these imports to the tasks where they're first used**: comment them out in this step and uncomment when adding the consuming code).

If you do see unused-import errors:
- Remove `import { cn } from "@/lib/utils";` (re-add in Task 5)
- Remove `import { FlowButton } from "@/components/ui/flow-button";` (re-add in Task 8)
- Remove `Award, Sparkles, TrendingUp` from the lucide import; keep only `Zap` for Task 4

**Step 3.4 — Commit.**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "feat(who-we-are): scaffold component with parallax blobs and motion variants"
```

---

## Task 4 — Add the heading block (eyebrow, h2, animated underline, intro paragraph)

**Files:**
- Modify: `src/components/ui/who-we-are-section.tsx`

**Step 4.1 — Replace the `{/* Heading block — added in Task 4 */}` placeholder** inside the inner `motion.div` with:

```tsx
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
```

**Step 4.2 — Type-check.**

```bash
bun x tsc --noEmit
```
Expected: clean.

**Step 4.3 — Commit.**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "feat(who-we-are): add heading, eyebrow, underline, and intro paragraph"
```

---

## Task 5 — Build the pillar grid (3 left, framed video center, 3 right)

**Files:**
- Modify: `src/components/ui/who-we-are-section.tsx`

**Step 5.1 — At the top of the file** (above the default export), define the pillar data shape and the `PillarItem` sub-component. **Also re-add the `cn` import** if you removed it in Task 3.

Add these imports at the top of the imports block (merge with existing lines):

```tsx
import { cn } from "@/lib/utils";
import type { Variants } from "framer-motion";
```

Below the imports, before the `export default function`, add:

```tsx
const pillars = [
  { key: "manufacturing", icon: "/pattern/manufacturing-lime.png",        side: "left"  },
  { key: "privateLabel",  icon: "/pattern/private-label-lime.png",        side: "left"  },
  { key: "customRecipe",  icon: "/pattern/wheat-lime.png",                side: "left"  },
  { key: "distribution",  icon: "/pattern/distribution-truck-lime.png",   side: "right" },
  { key: "export",        icon: "/pattern/export-globe-lime.png",         side: "right" },
  { key: "quality",       icon: "/pattern/kag-monogram-lime.png",         side: "right" },
] as const;

type PillarKey = (typeof pillars)[number]["key"];

interface PillarItemProps {
  iconSrc: string;
  title: string;
  description: string;
  variants: Variants;
  delay: number;
  direction: "left" | "right";
}

function PillarItem({
  iconSrc,
  title,
  description,
  variants,
  delay,
  direction,
}: PillarItemProps) {
  return (
    <motion.div
      className="group flex flex-col"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-3 flex items-center gap-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconSrc} alt="" className="h-10 w-10 object-contain" />
        </motion.div>
        <h3 className="font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
      </motion.div>
      <p className="pl-16 text-sm leading-relaxed text-foreground/80">
        {description}
      </p>
    </motion.div>
  );
}
```

Note: `alt=""` is intentional — the icon is decorative (the visible `<h3>` carries the meaning).

**Step 5.2 — Replace the `{/* Pillar grid — added in Task 5 */}` placeholder** with:

```tsx
{/* Pillar grid: 3 left, framed video center, 3 right */}
<div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
  {/* Left column */}
  <div className="space-y-16">
    {pillars
      .filter((p) => p.side === "left")
      .map((p, i) => (
        <PillarItem
          key={p.key}
          iconSrc={p.icon}
          title={t(`pillars.${p.key}.title`)}
          description={t(`pillars.${p.key}.description`)}
          variants={itemVariants}
          delay={i * 0.2}
          direction="left"
        />
      ))}
  </div>

  {/* Center: framed video */}
  <div className="order-first mb-8 flex items-center justify-center md:order-none md:mb-0">
    <motion.div className="relative w-full max-w-xs" variants={itemVariants}>
      <motion.div
        className="overflow-hidden rounded-md shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        <video
          src="/mangojar.mp4"
          poster="/mangojar.png"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Decorative offset frame */}
      <motion.div
        className="absolute inset-0 -m-3 rounded-md border-4 border-secondary z-[-1]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />

      {/* Floating decorative orbs */}
      <motion.div
        className="absolute -top-4 -right-8 h-16 w-16 rounded-full bg-primary/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        style={{ y: y1 }}
      />
      <motion.div
        className="absolute -bottom-6 -left-10 h-20 w-20 rounded-full bg-secondary/15"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
        style={{ y: y2 }}
      />
    </motion.div>
  </div>

  {/* Right column */}
  <div className="space-y-16">
    {pillars
      .filter((p) => p.side === "right")
      .map((p, i) => (
        <PillarItem
          key={p.key}
          iconSrc={p.icon}
          title={t(`pillars.${p.key}.title`)}
          description={t(`pillars.${p.key}.description`)}
          variants={itemVariants}
          delay={i * 0.2}
          direction="right"
        />
      ))}
  </div>
</div>
```

**Step 5.3 — Type-check.**

```bash
bun x tsc --noEmit
```
Expected: clean.

If you see "PillarKey declared but never used" — that's fine to ignore (it's there for future strong-typing); or delete the `type PillarKey = …` line entirely. Doesn't affect runtime.

**Step 5.4 — Commit.**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "feat(who-we-are): add pillar grid with pattern icons and framed video"
```

---

## Task 6 — Add the certifications marquee

**Files:**
- Modify: `src/components/ui/who-we-are-section.tsx`

**Step 6.1 — Add a constant for the cert list** (above the `export default function`, alongside `pillars`):

```tsx
const certifications = [
  { src: "/certifications/iso-22000.avif", alt: "ISO 22000" },
  { src: "/certifications/halal.avif",     alt: "Halal" },
  { src: "/certifications/fda.png",        alt: "FDA" },
  { src: "/certifications/gmp.png",        alt: "GMP" },
  { src: "/certifications/brc.png",        alt: "BRC" },
  { src: "/certifications/iso-45001.avif", alt: "ISO 45001" },
] as const;
```

**Step 6.2 — Replace the `{/* Marquee — added in Task 6 */}` placeholder** with:

```tsx
{/* Certifications marquee */}
<motion.div className="mt-24" variants={itemVariants}>
  <h3 className="mb-6 text-center font-heading text-sm font-medium uppercase tracking-wider text-foreground/60">
    {t("certifications.heading")}
  </h3>

  <div
    aria-label="International certifications"
    className="group relative overflow-hidden"
  >
    {/* Left edge fade */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
    {/* Right edge fade */}
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

    <div className="animate-marquee flex w-max gap-16">
      {/* Render twice for seamless loop */}
      {[...certifications, ...certifications].map((cert, i) => (
        <div
          key={`${cert.alt}-${i}`}
          className="flex shrink-0 items-center justify-center px-4"
          aria-hidden={i >= certifications.length ? "true" : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cert.src}
            alt={i >= certifications.length ? "" : cert.alt}
            className="h-12 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16"
          />
        </div>
      ))}
    </div>
  </div>
</motion.div>
```

**Step 6.3 — Type-check.**

```bash
bun x tsc --noEmit
```
Expected: clean.

**Step 6.4 — Commit.**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "feat(who-we-are): add auto-scrolling certifications marquee with edge fade"
```

---

## Task 7 — Add the Quality / Innovation / Growth value cards

**Files:**
- Modify: `src/components/ui/who-we-are-section.tsx`

**Step 7.1 — Re-add the unused lucide imports** (`Award`, `Sparkles`, `TrendingUp`) at the top if you removed them in Task 3 — they're consumed in this step.

The full lucide import line should be:
```tsx
import { Award, Sparkles, TrendingUp, Zap } from "lucide-react";
```

**Step 7.2 — Add a constant for the value cards** (above the export, alongside `pillars` and `certifications`):

```tsx
const values = [
  { key: "quality",    Icon: Award },
  { key: "innovation", Icon: Sparkles },
  { key: "growth",     Icon: TrendingUp },
] as const;
```

**Step 7.3 — Add a stats-ref + isStatsInView** inside the component (just under the existing `isInView` line):

```tsx
const valuesRef = useRef<HTMLDivElement>(null);
const isValuesInView = useInView(valuesRef, { once: false, amount: 0.3 });
```

**Step 7.4 — Replace the `{/* Value cards — added in Task 7 */}` placeholder** with:

```tsx
{/* Value cards: Quality / Innovation / Growth */}
<motion.div
  ref={valuesRef}
  className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3"
  initial="hidden"
  animate={isValuesInView ? "visible" : "hidden"}
  variants={containerVariants}
>
  {values.map(({ key, Icon }, i) => (
    <motion.div
      key={key}
      className="group flex flex-col items-center rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary/10"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        <Icon className="h-6 w-6" />
      </motion.div>
      <h3 className="font-heading text-xl font-medium text-foreground">
        {t(`values.${key}.title`)}
      </h3>
      <p className="mt-2 text-sm text-foreground/70">
        {t(`values.${key}.description`)}
      </p>
      <motion.div className="mt-3 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-16" />
    </motion.div>
  ))}
</motion.div>
```

**Step 7.5 — Type-check.**

```bash
bun x tsc --noEmit
```
Expected: clean.

**Step 7.6 — Commit.**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "feat(who-we-are): add Quality/Innovation/Growth value cards"
```

---

## Task 8 — Add the CTA banner

**Files:**
- Modify: `src/components/ui/who-we-are-section.tsx`

**Step 8.1 — Confirm the `FlowButton` import** is at the top of the file. If you removed it in Task 3, re-add:

```tsx
import { FlowButton } from "@/components/ui/flow-button";
```

**Step 8.2 — Replace the `{/* CTA banner — added in Task 8 */}` placeholder** with:

```tsx
{/* CTA banner */}
<motion.div
  className="mt-20 flex flex-col items-center justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground md:flex-row"
  initial={{ opacity: 0, y: 30 }}
  animate={isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
  transition={{ duration: 0.8, delay: 0.5 }}
>
  <div className="flex-1">
    <h3 className="mb-2 font-heading text-2xl font-medium">
      {t("cta.heading")}
    </h3>
    <p className="text-primary-foreground/80">{t("cta.sub")}</p>
  </div>
  <FlowButton href="/contact" text={t("cta.button")} className="px-10 py-3" />
</motion.div>
```

**Step 8.3 — Type-check.**

```bash
bun x tsc --noEmit
```
Expected: clean.

**Step 8.4 — Commit.**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "feat(who-we-are): add brand-primary CTA banner with FlowButton"
```

---

## Task 9 — Mount the section in the home page

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 9.1 — Read** the current `page.tsx` (it currently imports and renders only `<HeroSection />`).

**Step 9.2 — Add the import** at the top alongside `HeroSection`:

```tsx
import WhoWeAreSection from '@/components/ui/who-we-are-section';
```

**Step 9.3 — Render `<WhoWeAreSection />`** inside `<main>` directly below `<HeroSection />`:

```tsx
<main>
  <HeroSection />
  <WhoWeAreSection />
</main>
```

**Step 9.4 — Type-check.**

```bash
bun x tsc --noEmit
```
Expected: clean.

**Step 9.5 — Commit.**

```bash
git add src/app/[locale]/page.tsx && git commit -m "feat(home): mount WhoWeAreSection on the home page"
```

---

## Task 10 — Manual browser verification

**Step 10.1 — Start the dev server.**

```bash
bun dev
```

Wait for "Ready in ..." (typically <2s on cached builds). The server runs on `http://localhost:3000` (or `3001` if 3000 is taken — read the actual port from the output).

**Step 10.2 — Visit `http://localhost:3000/en` in a browser.**

Verify, in order:
- The section appears below the hero.
- Scrolling triggers the fade/slide-in for the eyebrow → heading → underline → intro → pillars (cascade timing should feel sequential, ~200ms apart).
- The `mangojar.mp4` video is playing in the framed center, no overlay buttons.
- Parallax blobs and floating dots are visible and move on scroll.
- Pillar cards each show their pattern icon (lime variant on a soft blue square), title, and one-line description.
- Hover a pillar card: it lifts, icon wiggles, title turns blue.
- The marquee scrolls smoothly, edge-fades on left/right are visible, hovering the strip pauses the scroll, hovering an individual logo restores color/opacity.
- Value cards (Quality / Innovation / Growth) cascade in when scrolled to, lift on hover, secondary-color underline grows.
- The CTA banner is brand-primary blue with white text, the FlowButton fills the right side; clicking it navigates to `/en/contact`.

**Step 10.3 — Visit `http://localhost:3000/fr` and `http://localhost:3000/ar`.**

Verify:
- Section renders without runtime errors (no missing-translation warnings in the browser console or terminal).
- French and Arabic locales show the seeded English copy (expected for now — translation is deferred).
- On `/ar` (RTL), the layout flips: pillar "left" column appears on the right and vice versa. The marquee still scrolls in the same physical direction (left); confirm logos are not stretched/squashed.

**Step 10.4 — Resize to mobile (DevTools, ~375px width).**

Verify:
- Pillars stack into a single column.
- The framed video appears above the pillars (per `order-first md:order-none`).
- The marquee still scrolls and fades.
- Value cards stack vertically.
- CTA banner stacks heading above the button.

**Step 10.5 — Stop the dev server (`Ctrl+C`).**

**Step 10.6 — If everything looks correct, no commit needed** — the previous commits already capture the implementation. If you found a regression, return to the relevant Task (4–8) and patch, then re-verify.

---

## Task 11 — Final cleanup pass

**Files:**
- Modify (if necessary): `src/components/ui/who-we-are-section.tsx`

**Step 11.1 — Re-read the final file end-to-end.** Look for:
- Unused imports (TypeScript with strict settings may not flag these; check manually).
- Stale `{/* placeholder */}` comments left over from earlier tasks.
- Any hardcoded hex colors that snuck in (search the file for `#`).
- Any inline `font-family` declarations (none should exist).

**Step 11.2 — Run the full type-check + build** to confirm production parity:

```bash
bun x tsc --noEmit && bun run build
```

Expected: both succeed. If `bun run build` fails on something we missed, fix and recommit.

**Step 11.3 — If any cleanup was needed, commit:**

```bash
git add src/components/ui/who-we-are-section.tsx && git commit -m "chore(who-we-are): tidy unused imports and stale comments"
```

If no cleanup was needed, skip the commit.

---

## Out of scope (deferred per design doc)

These are explicitly **not** part of this plan — do not attempt:

- Real French and Arabic translations (Mohammed translates later).
- Real Manufacturing video — `mangojar.mp4` stays as placeholder.
- Numeric stat counters (years in business, export countries, etc.) — separate future section.
- `full-pattern-tile.png` background watermark — evaluate visually post-launch.
- Linking pillar cards to dedicated `/services/*` pages — pillars are descriptive only in this section.
- Unit tests for the section — no React-component test infrastructure exists in this repo and the section is purely presentational.
