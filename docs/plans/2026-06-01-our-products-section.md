# Our Products — Section Implementation Plan

**Goal:** Build a home-page "Our Products" section showing six Yamkers SKUs with hover-to-play product videos and a section-level "See All Products" CTA, matching `card-21` visual language and the project's existing section vocabulary.

**Architecture:** Two new client components — `ProductCard` (single tile, image + lazy video swap, themed glow via inline CSS var) and `OurProductsSection` (heading + parallax blobs + 6-card grid + CTA). Section data is a local typed array; strings come from a new `ourProducts` i18n namespace in EN/FR/AR. Mounted in `src/app/[locale]/page.tsx` after `<WhatWeOfferSection />`.

**Tech stack:** Next.js (custom variant — see `AGENTS.md`), React 19, TypeScript, Tailwind v4, framer-motion, next-intl, lucide-react (`Play`), FlowButton, Next `<Image>` and HTML `<video>`.

**Design doc:** `docs/plans/2026-06-01-our-products-section-design.md`

**Conventions (from project memory):**
- Brand colors: `bg-primary` (#374c9b), `bg-secondary` (#d5de24)
- Fonts: `font-display` for H2, `font-heading` for sub-titles
- Section root MUST NOT set any `bg-*` (body `/bg6.jpg` shows through)
- Primary CTAs use `FlowButton`
- In-app links use `import { Link } from "@/i18n/navigation"`
- Commits authored solely by Mohammed — no `Co-Authored-By: Claude` trailer
- Stage with `git add .`

---

## Task 0 — Pre-flight

1. Confirm asset files exist:
   ```bash
   ls public/sauce.{png,mp4} public/favebeans.{png,mp4} public/favebeanstehina.{png,mp4} public/chilifavebeans.{png,mp4} public/mangojar.{png,mp4} public/applejam.{png,mp4}
   ```
   Expected: 12 files listed.
2. Baseline:
   ```bash
   npx tsc --noEmit
   npm run lint
   ```
   Expected: tsc clean; lint = 6 errors + 1 warning (established baseline).

No commit.

---

## Task 1 — i18n keys

**Files:**
- Modify `src/i18n/messages/en.json` — add `ourProducts` namespace
- Modify `src/i18n/messages/fr.json` — add French translation
- Modify `src/i18n/messages/ar.json` — add Arabic translation

**Shape (EN):**
```json
"ourProducts": {
  "eyebrow": "OUR PRODUCTS",
  "heading": "What's in every Yamkers jar",
  "intro": "Six everyday Yamkers favourites — produced in-house to international food-safety standards and ready for Egyptian and global pantries alike.",
  "previewLabel": "Hover to preview",
  "cta": "See All Products",
  "items": {
    "sauce":           { "name": "Yamkers Sauce",                    "brand": "Yamkers" },
    "favebeans":       { "name": "Yamkers Fava Beans",               "brand": "Yamkers" },
    "favebeansTehina": { "name": "Yamkers Fava Beans with Tehina",   "brand": "Yamkers" },
    "chiliFavebeans":  { "name": "Yamkers Chili Fava Beans",         "brand": "Yamkers" },
    "mangoJar":        { "name": "Yamkers Mango Jar",                "brand": "Yamkers" },
    "appleJam":        { "name": "Yamkers Apple Jam",                "brand": "Yamkers" }
  }
}
```

FR translations:
- eyebrow: `"NOS PRODUITS"`
- heading: `"Ce que contient chaque pot Yamkers"`
- intro: `"Six incontournables Yamkers du quotidien — produits en interne selon les normes internationales de sécurité alimentaire et prêts à rejoindre les garde-mangers égyptiens et internationaux."`
- previewLabel: `"Survolez pour prévisualiser"`
- cta: `"Voir tous les produits"`
- item names: `"Yamkers Sauce Tomate"`, `"Yamkers Fèves"`, `"Yamkers Fèves au Tahini"`, `"Yamkers Fèves Piquantes"`, `"Yamkers Confiture de Mangue"`, `"Yamkers Confiture de Pomme"`; brand: `"Yamkers"` (proper noun)

AR translations:
- eyebrow: `"منتجاتنا"`
- heading: `"ما يحتويه كل مرطبان يامكرز"`
- intro: `"ستة من مفضلات يامكرز اليومية — مُنتجة داخليًا وفق المعايير الدولية لسلامة الغذاء، وجاهزة للموائد المصرية والعالمية على حد سواء."`
- previewLabel: `"مرّر للمعاينة"`
- cta: `"اطلع على جميع المنتجات"`
- item names: `"صلصة يامكرز"`, `"فول يامكرز"`, `"فول يامكرز بالطحينة"`, `"فول يامكرز الحار"`, `"مربى المانجو يامكرز"`, `"مربى التفاح يامكرز"`; brand: `"يامكرز"`

**Verify:** `node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/en.json','utf8'));"` (and fr, ar). All three must parse.

**No commit yet** — tied to the section commit at end.

---

## Task 2 — `ProductCard` component

**File:** Create `src/components/ui/product-card.tsx`

**Props:**
```ts
type ProductCardProps = {
  brand: string;
  name: string;
  imageUrl: string;     // /sauce.png
  videoUrl: string;     // /sauce.mp4
  themeColor: string;   // "0 65% 38%" — HSL triplet without hsl()
  previewLabel: string;
  className?: string;
};
```

**Behavior:**
- Wrapper is a `<div className="group ...">` (no `<a>` — see design tradeoff).
- Inline style sets `--theme-color: <themeColor>`.
- Base image: Next `<Image fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />` with `object-cover`.
- Video layer on top, `opacity-0 group-hover:opacity-100 transition-opacity duration-500`, `playsInline muted loop preload="metadata"`, `object-cover`. Initially `paused`.
- Hover state on desktop:
  - `onPointerEnter` (only if `event.pointerType === "mouse"`) and not `useReducedMotion()` → call `video.play()`
  - `onPointerLeave` (mouse) → `video.pause(); video.currentTime = 0`
- Touch / coarse-pointer state via `IntersectionObserver` (threshold `0.6`):
  - When intersecting and pointer is coarse and not reduced-motion → play; trigger opacity transition by toggling internal `isActive` state.
  - When leaving → pause + opacity 0.
- Visual themed gradient overlay using `hsl(var(--theme-color)/...)` linear-gradient (top → bottom: `0.9 → 0.6 → transparent`), shadow `0 0 40px -15px hsl(var(--theme-color) / 0.5)`, and `group-hover:scale-105` + boosted shadow.
- Content stack (bottom-anchored, white text):
  - Small uppercase tracking-wide `<span>{brand}</span>` with subtle opacity.
  - `<h3 className="font-heading text-2xl md:text-3xl">{name}</h3>`
  - Themed pill: `hsl(var(--theme-color)/0.2)` bg + backdrop-blur + border `hsl(var(--theme-color)/0.3)`, padding, rounded; contents = `<Play />` icon + `<span>{previewLabel}</span>`. Hover boosts bg/border to `/0.4` and `/0.5`.

**Verify:** `npx tsc --noEmit` clean. No lint regressions.

---

## Task 3 — `OurProductsSection` component

**File:** Create `src/components/ui/our-products-section.tsx`

**Structure:**
```tsx
"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";
import { ProductCard } from "@/components/ui/product-card";

type ProductKey = "sauce" | "favebeans" | "favebeansTehina" | "chiliFavebeans" | "mangoJar" | "appleJam";

const PRODUCTS: { key: ProductKey; image: string; video: string; themeColor: string }[] = [
  { key: "sauce",           image: "/sauce.png",           video: "/sauce.mp4",           themeColor: "0 65% 38%"   },
  { key: "favebeans",       image: "/favebeans.png",       video: "/favebeans.mp4",       themeColor: "28 45% 28%"  },
  { key: "favebeansTehina", image: "/favebeanstehina.png", video: "/favebeanstehina.mp4", themeColor: "38 35% 38%"  },
  { key: "chiliFavebeans",  image: "/chilifavebeans.png",  video: "/chilifavebeans.mp4",  themeColor: "12 70% 38%"  },
  { key: "mangoJar",        image: "/mangojar.png",        video: "/mangojar.mp4",        themeColor: "38 80% 42%"  },
  { key: "appleJam",        image: "/applejam.png",        video: "/applejam.mp4",        themeColor: "350 55% 32%" },
];
```

- `sectionRef` + `useInView({ once: false, amount: 0.1 })` (mirrors `WhoWeAreSection`).
- `useScroll` + `useTransform` for two parallax blobs (`y1`, `y2`, `rotate1`, `rotate2`).
- `containerVariants` (stagger 0.08, delayChildren 0.2) and `itemVariants` (y 20→0, opacity 0→1, 0.6s easeOut).
- Section root: `<section ref={sectionRef} className="relative w-full overflow-hidden py-24 px-4">`. **No `bg-*`.**
- Two parallax blobs (primary/5 and secondary/5) absolutely positioned, like `WhoWeAreSection`.
- Inner container `motion.div max-w-6xl mx-auto relative z-10`.
- Header block: eyebrow (`Zap` + uppercase `t("eyebrow")`), H2 (`font-display`), short bar accent (animated width), `t("intro")` paragraph.
- Grid: `motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"`. Each child wrapped in `motion.div variants={itemVariants}` and given fixed `h-[450px]` (matches demo).
- CTA: centered `motion.div mt-16 flex justify-center` with `<FlowButton href="/products" text={t("cta")} />`.

**Verify:** dev render — section appears, hover on a card swaps to video, CTA links to `/products`.

---

## Task 4 — Mount on home page

**File:** Modify `src/app/[locale]/page.tsx`

Add import and render after `<WhatWeOfferSection />`:
```tsx
import OurProductsSection from "@/components/ui/our-products-section";
// ...
<main>
  <HeroSection />
  <WhoWeAreSection />
  <WhatWeOfferSection />
  <OurProductsSection />
</main>
```

**Verify:** `npx tsc --noEmit` clean.

---

## Task 5 — Final verification

```bash
npx tsc --noEmit
npm run lint
npm run dev
```

Manually check on `http://localhost:3000/en`:
- Section renders below "What We Offer"
- 6 cards visible in 3×2 grid on desktop
- Hover on a card → video plays smoothly, image fades out
- Mouse-out → video pauses + rewinds + image fades in
- Touch (DevTools mobile mode): video auto-plays when card is in viewport
- "See All Products" button routes to `/products`
- No console errors, no hydration warnings

Re-check `/fr` and `/ar` show translated strings; RTL on `/ar` still looks correct.

---

## Task 6 — Commit

```bash
git add .
git commit -m "feat(our-products): add Our Products section with hover-video product cards"
```

No `Co-Authored-By: Claude` trailer.
