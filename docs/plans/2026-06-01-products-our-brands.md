# Products / Our Brands Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the public `/products` catalog page (48 Yamkers SKUs in 6 categories with hover-reveal cards), promote `Our Brands` to a top-level navbar item, and ship a full-bleed video hero cycling 8 product mp4s under a 60 % black mask.

**Architecture:** Server `page.tsx` calls `getTranslations('products')` and renders two client components: `<ProductsHero />` (video cycle + scroll parallax) and `<ProductsTabs />` (filter state + grid of `<ProductCard />`). Product data lives in a single typed TS module `src/lib/data/products.ts` — no Excel runtime. Cards are built on a brand-new `<CardHoverReveal>` primitive (verbatim copy of the user-supplied snippet).

**Tech Stack:** Next.js 16 (app router, Turbopack), next-intl 4, React 19, framer-motion 12, Tailwind v4, lucide-react. No new npm dependencies. Bun is the package manager.

**Spec:** `docs/superpowers/specs/2026-06-01-products-our-brands-design.md`

**Project conventions to honor (memory rules):**
- No `Co-Authored-By: Claude` trailer on commits
- Use `git add .` for staging
- Don't add Claude attribution to file contents
- Section roots have no `bg-*` — body's `/bg6.jpg` shows through
- Animated section heading underlines use `bg-secondary` (lime), not `bg-primary`
- Default CTA is `FlowButton` from `@/components/ui/flow-button`
- Primary brand color `bg-primary` (#374c9b), secondary `bg-secondary` (#d5de24)
- Logo at `/public/navbarLogo.svg`
- Links from `@/i18n/navigation`, NOT `next/link`
- Project AGENTS.md warning: "This is NOT the Next.js you know" — read `node_modules/next/dist/docs/` if unfamiliar with a Next.js 16 API
- shadcn `TabsList` has cva height variants — but we're NOT using shadcn Tabs here, we're rolling our own buttons, so that memory doesn't apply

**Verification approach:** This repo has no Jest/Vitest. The verification gates are:
1. `bun run typecheck` — must exit 0
2. `bun run build` — must produce all locale routes successfully
3. Visual smoke check in dev (`bun dev`) at `http://localhost:3000/products`, `/ar/products`, `/fr/products`

---

### Task 1: Add `reveal-on-hover` primitive

**Files:**
- Create: `src/components/ui/reveal-on-hover.tsx`

**Step 1:** Create `src/components/ui/reveal-on-hover.tsx` with the verbatim user-supplied code (no modifications):

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface CardHoverRevealContextValue {
  isHovered: boolean
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>
}
const CardHoverRevealContext = React.createContext<CardHoverRevealContextValue>(
  {} as CardHoverRevealContextValue
)
const useCardHoverRevealContext = () => {
  const context = React.useContext(CardHoverRevealContext)
  if (!context) {
    throw new Error(
      "useCardHoverRevealContext must be used within a CardHoverRevealProvider"
    )
  }
  return context
}
const CardHoverReveal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <CardHoverRevealContext.Provider
      value={{
        isHovered,
        setIsHovered,
      }}
    >
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    </CardHoverRevealContext.Provider>
  )
})
CardHoverReveal.displayName = "CardHoverReveal"

interface CardHoverRevealMainProps {
  initialScale?: number
  hoverScale?: number
}
const CardHoverRevealMain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CardHoverRevealMainProps
>(({ className, initialScale = 1, hoverScale = 1.05, ...props }, ref) => {
  const { isHovered } = useCardHoverRevealContext()
  return (
    <div
      ref={ref}
      className={cn("size-full transition-transform duration-300 ", className)}
      style={
        isHovered
          ? { transform: `scale(${hoverScale})`, ...props.style }
          : { transform: `scale(${initialScale})`, ...props.style }
      }
      {...props}
    />
  )
})
CardHoverRevealMain.displayName = "CardHoverRevealMain"

const CardHoverRevealContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isHovered } = useCardHoverRevealContext()
  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-[auto_1.5rem_1.5rem] p-6 backdrop-blur-lg transition-all duration-500 ease-in-out",
        className
      )}
      style={
        isHovered
          ? { translate: "0%", opacity: 1, ...props.style }
          : { translate: "0% 120%", opacity: 0, ...props.style }
      }
      {...props}
    />
  )
})
CardHoverRevealContent.displayName = "CardHoverRevealContent"

export { CardHoverReveal, CardHoverRevealMain, CardHoverRevealContent }
```

**Step 2:** Verify typecheck passes.

Run: `bun run typecheck`
Expected: exit 0, no output.

**Step 3:** Commit.

```bash
git add .
git commit -m "feat(ui): add CardHoverReveal primitive"
```

---

### Task 2: Add `Product` type and seed data

**Files:**
- Create: `src/lib/data/products.ts`

**Step 1:** Create `src/lib/data/products.ts` with the type definitions and the 48 SKU seed. This file is long; copy verbatim and do **not** abbreviate any entry:

```ts
export type ProductCategory =
  | "tomato_paste"
  | "fava_beans"
  | "beans_peas"
  | "canned_vegetables"
  | "jams"
  | "juices";

export type ProductBrand = "yamkers" | "tasbeka";

export type PackagingType =
  | "tin"
  | "glass_jar"
  | "plastic_cup"
  | "sachet"
  | "tetra_pak";

export type ShippingType = "carton" | "shrink_wrap";

export interface Product {
  id: number;
  slug: string;
  brand: ProductBrand;
  category: ProductCategory;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string | null;
  specs: {
    netWeight: string;
    netWeightAr: string;
    drainedWeight?: string;
    drainedWeightAr?: string;
    concentration?: string;
  };
  packaging: {
    type: PackagingType;
    unitsPerCarton: number;
    shipping: ShippingType;
  };
}

export const products: Product[] = [
  // ── Tomato Paste ──────────────────────────────────────────────────
  {
    id: 1, slug: "tomato-paste-400g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 400 g Tin", nameAr: "صلصة طماطم 400 جرام",
    descriptionEn: "Rich 28–30 % tomato paste in a 400 g tin — base for sauces, soups, and stews.",
    descriptionAr: "صلصة طماطم 400 جرام بتركيز 28-30٪ — أساس للصلصات والشوربات والطواجن.",
    image: "/Products/400 g.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 2, slug: "tomato-paste-800g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 800 g Tin", nameAr: "صلصة طماطم 800 جرام",
    descriptionEn: "Family-size 800 g tin of 28–30 % concentrated tomato paste.",
    descriptionAr: "عبوة عائلية 800 جرام بتركيز 28-30٪.",
    image: "/Products/800g.png",
    specs: { netWeight: "800 g", netWeightAr: "800 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 6, shipping: "shrink_wrap" },
  },
  {
    id: 3, slug: "tomato-paste-2800g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 2.8 kg Tin", nameAr: "صلصة طماطم 2.8 كجم",
    descriptionEn: "Catering-size 2.8 kg tin, 20–22 % concentration.",
    descriptionAr: "حجم مطاعم 2.8 كجم بتركيز 20-22٪.",
    image: "/Products/2800 g.png",
    specs: { netWeight: "2800 g", netWeightAr: "2800 جرام", concentration: "20–22 %" },
    packaging: { type: "tin", unitsPerCarton: 4, shipping: "carton" },
  },
  {
    id: 4, slug: "tomato-paste-4200g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 4.2 kg Tin", nameAr: "صلصة طماطم 4.2 كجم",
    descriptionEn: "Wholesale 4.2 kg tin of 28–30 % tomato paste for HORECA use.",
    descriptionAr: "حجم جملة 4.2 كجم بتركيز 28-30٪ للفنادق والمطاعم.",
    image: null,
    specs: { netWeight: "4200 g", netWeightAr: "4200 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 2, shipping: "shrink_wrap" },
  },
  {
    id: 5, slug: "tomato-paste-360g-jar", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 360 g Glass Jar", nameAr: "صلصة طماطم 360 جرام برطمان زجاج",
    descriptionEn: "Tomato paste in a reclosable 360 g glass jar, 22–24 % concentration.",
    descriptionAr: "صلصة طماطم في برطمان زجاج 360 جرام بتركيز 22-24٪.",
    image: "/Products/jar.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام", concentration: "22–24 %" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 6, slug: "tomato-paste-120g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 120 g Tin", nameAr: "صلصة طماطم 120 جرام",
    descriptionEn: "Single-meal 120 g tin of 28–30 % tomato paste.",
    descriptionAr: "علبة 120 جرام لوجبة واحدة بتركيز 28-30٪.",
    image: "/Products/120 g.png",
    specs: { netWeight: "120 g", netWeightAr: "120 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 25, shipping: "carton" },
  },
  {
    id: 7, slug: "tomato-paste-60g-tin", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 60 g Tin", nameAr: "صلصة طماطم 60 جرام",
    descriptionEn: "Compact 60 g tin — perfect for single recipes or lunchboxes.",
    descriptionAr: "علبة صغيرة 60 جرام مناسبة لوصفة واحدة.",
    image: "/Products/Yam tomato paste 60g.png",
    specs: { netWeight: "60 g", netWeightAr: "60 جرام", concentration: "28–30 %" },
    packaging: { type: "tin", unitsPerCarton: 50, shipping: "carton" },
  },
  {
    id: 8, slug: "tomato-paste-50g-sachet", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 50 g Sachet", nameAr: "صلصة طماطم 50 جرام ظرف",
    descriptionEn: "50 g tear-open sachet, 28–30 % paste — pantry- and travel-friendly.",
    descriptionAr: "ظرف 50 جرام بتركيز 28-30٪ مناسب للسفر.",
    image: "/Products/sachet.png",
    specs: { netWeight: "50 g", netWeightAr: "50 جرام", concentration: "28–30 %" },
    packaging: { type: "sachet", unitsPerCarton: 96, shipping: "carton" },
  },
  {
    id: 9, slug: "tomato-paste-70g-sachet", brand: "yamkers", category: "tomato_paste",
    nameEn: "Tomato Paste 70 g Sachet", nameAr: "صلصة طماطم 70 جرام ظرف",
    descriptionEn: "70 g tear-open sachet of 28–30 % tomato paste.",
    descriptionAr: "ظرف 70 جرام بتركيز 28-30٪.",
    image: "/Products/sachet.png",
    specs: { netWeight: "70 g", netWeightAr: "70 جرام", concentration: "28–30 %" },
    packaging: { type: "sachet", unitsPerCarton: 96, shipping: "carton" },
  },

  // ── Fava Beans ───────────────────────────────────────────────────
  {
    id: 10, slug: "fava-beans-plain-3kg", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans Plain — 3 kg", nameAr: "فول مدمس سادة 3 كجم",
    descriptionEn: "Yamkers fava beans, plain, in a 3 kg foodservice tin (1.95 kg drained).",
    descriptionAr: "فول مدمس سادة 3 كجم (المصفى 1.95 كجم).",
    image: "/Products/3 kg.png",
    specs: { netWeight: "3 kg", netWeightAr: "3 كجم", drainedWeight: "1950 g", drainedWeightAr: "1950 جرام" },
    packaging: { type: "tin", unitsPerCarton: 4, shipping: "carton" },
  },
  {
    id: 11, slug: "fava-beans-plain-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans Plain — 400 g", nameAr: "فول مدمس سادة 400 جرام",
    descriptionEn: "Classic plain fava beans, 400 g tin (260 g drained) — ready to heat and serve.",
    descriptionAr: "فول مدمس سادة 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Plain copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 12, slug: "fava-beans-hot-chili-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Hot Chili — 400 g", nameAr: "فول مدمس بالشطة الحارة 400 جرام",
    descriptionEn: "Fava beans simmered with red hot chili, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بالشطة الحمراء 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Hot Chili copy - Copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 13, slug: "fava-beans-tahini-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Tahini — 400 g", nameAr: "فول مدمس بالطحينة 400 جرام",
    descriptionEn: "Creamy fava beans blended with tahini, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بالطحينة 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Tahini copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 14, slug: "fava-beans-sunflower-oil-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Sunflower Oil — 400 g", nameAr: "فول مدمس بزيت عباد الشمس 400 جرام",
    descriptionEn: "Plain fava beans finished with sunflower oil, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بزيت عباد الشمس 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Oil copy - Copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 15, slug: "fava-beans-olive-oil-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans with Olive Oil — 400 g", nameAr: "فول مدمس بزيت الزيتون 400 جرام",
    descriptionEn: "Fava beans finished with olive oil, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بزيت الزيتون 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-Olive Oil copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 16, slug: "fava-beans-tomato-sauce-400g", brand: "yamkers", category: "fava_beans",
    nameEn: "Fava Beans in Tomato Sauce — 400 g", nameAr: "فول مدمس بالصلصة 400 جرام",
    descriptionEn: "Fava beans in tomato sauce, 400 g tin (260 g drained).",
    descriptionAr: "فول مدمس بالصلصة 400 جرام (المصفى 260 جرام).",
    image: "/Products/Tin Can-tomato copy.png",
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Beans & Peas ─────────────────────────────────────────────────
  {
    id: 17, slug: "white-beans-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "White Beans — 400 g", nameAr: "فاصولياء بيضاء 400 جرام",
    descriptionEn: "Plain white beans, 400 g tin (260 g drained).",
    descriptionAr: "فاصولياء بيضاء 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 18, slug: "white-beans-tomato-sauce-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "White Beans in Tomato Sauce — 400 g", nameAr: "فاصولياء بيضاء بالصلصة 400 جرام",
    descriptionEn: "White beans in tomato sauce, 400 g tin (260 g drained).",
    descriptionAr: "فاصولياء بيضاء بالصلصة 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 19, slug: "red-beans-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "Red Beans — 400 g", nameAr: "فاصولياء حمراء 400 جرام",
    descriptionEn: "Red kidney beans, 400 g tin (260 g drained).",
    descriptionAr: "فاصولياء حمراء 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 20, slug: "green-peas-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "Green Peas — 400 g", nameAr: "بازلاء خضراء 400 جرام",
    descriptionEn: "Tender garden peas, 400 g tin (240 g drained).",
    descriptionAr: "بازلاء خضراء 400 جرام (المصفى 240 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 21, slug: "peas-tomato-sauce-400g", brand: "yamkers", category: "beans_peas",
    nameEn: "Peas in Tomato Sauce — 400 g", nameAr: "بازلاء بالصلصة 400 جرام",
    descriptionEn: "Green peas simmered in tomato sauce, 400 g tin (240 g drained).",
    descriptionAr: "بازلاء بالصلصة 400 جرام (المصفى 240 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Canned Vegetables ────────────────────────────────────────────
  {
    id: 22, slug: "sweet-corn-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Sweet Corn — 400 g", nameAr: "ذرة حلوة 400 جرام",
    descriptionEn: "Whole-kernel sweet corn, 400 g tin (244 g drained).",
    descriptionAr: "ذرة حلوة 400 جرام (المصفى 244 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "244 g", drainedWeightAr: "244 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 23, slug: "chickpeas-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Chickpeas — 400 g", nameAr: "حمص 400 جرام",
    descriptionEn: "Cooked chickpeas, 400 g tin (260 g drained) — ready for hummus or salad.",
    descriptionAr: "حمص 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 24, slug: "chickpeas-tahini-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Chickpeas with Tahini — 400 g", nameAr: "حمص بالطحينة 400 جرام",
    descriptionEn: "Chickpeas blended with tahini, 400 g tin (260 g drained).",
    descriptionAr: "حمص بالطحينة 400 جرام (المصفى 260 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "260 g", drainedWeightAr: "260 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },
  {
    id: 25, slug: "green-okra-400g", brand: "yamkers", category: "canned_vegetables",
    nameEn: "Green Okra — 400 g", nameAr: "بامية خضراء 400 جرام",
    descriptionEn: "Tender green okra, 400 g tin (240 g drained).",
    descriptionAr: "بامية خضراء 400 جرام (المصفى 240 جرام).",
    image: null,
    specs: { netWeight: "400 g", netWeightAr: "400 جرام", drainedWeight: "240 g", drainedWeightAr: "240 جرام" },
    packaging: { type: "tin", unitsPerCarton: 24, shipping: "shrink_wrap" },
  },

  // ── Jams — 30 g plastic portion cups ─────────────────────────────
  {
    id: 26, slug: "fig-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Fig Jam 30 g Cup", nameAr: "مربى تين 30 جرام كأس",
    descriptionEn: "Single-portion fig jam, 30 g cup — hotel and HORECA breakfast staple.",
    descriptionAr: "مربى تين 30 جرام كأس بلاستيك.",
    image: "/Products/fig Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 27, slug: "strawberry-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Strawberry Jam 30 g Cup", nameAr: "مربى فراولة 30 جرام كأس",
    descriptionEn: "Single-portion strawberry jam, 30 g cup.",
    descriptionAr: "مربى فراولة 30 جرام كأس بلاستيك.",
    image: "/Products/Strawberry Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 28, slug: "guava-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Guava Jam 30 g Cup", nameAr: "مربى جوافة 30 جرام كأس",
    descriptionEn: "Single-portion guava jam, 30 g cup.",
    descriptionAr: "مربى جوافة 30 جرام كأس بلاستيك.",
    image: "/Products/guava Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 29, slug: "apricot-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Apricot Jam 30 g Cup", nameAr: "مربى مشمش 30 جرام كأس",
    descriptionEn: "Single-portion apricot jam, 30 g cup.",
    descriptionAr: "مربى مشمش 30 جرام كأس بلاستيك.",
    image: "/Products/apricots Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 30, slug: "apple-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Apple Jam 30 g Cup", nameAr: "مربى تفاح 30 جرام كأس",
    descriptionEn: "Single-portion apple jam, 30 g cup.",
    descriptionAr: "مربى تفاح 30 جرام كأس بلاستيك.",
    image: "/Products/Apple Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 31, slug: "peach-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Peach Jam 30 g Cup", nameAr: "مربى خوخ 30 جرام كأس",
    descriptionEn: "Single-portion peach jam, 30 g cup.",
    descriptionAr: "مربى خوخ 30 جرام كأس بلاستيك.",
    image: "/Products/Peach Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 32, slug: "mango-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Mango Jam 30 g Cup", nameAr: "مربى مانجو 30 جرام كأس",
    descriptionEn: "Single-portion mango jam, 30 g cup.",
    descriptionAr: "مربى مانجو 30 جرام كأس بلاستيك.",
    image: "/Products/mango Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 33, slug: "orange-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Orange Jam 30 g Cup", nameAr: "مربى برتقال 30 جرام كأس",
    descriptionEn: "Single-portion orange jam, 30 g cup.",
    descriptionAr: "مربى برتقال 30 جرام كأس بلاستيك.",
    image: "/Products/orange Jam Portion copy.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },
  {
    id: 34, slug: "mixed-fruit-jam-30g-cup", brand: "yamkers", category: "jams",
    nameEn: "Mixed Fruit Jam 30 g Cup", nameAr: "مربى فواكه مشكلة 30 جرام كأس",
    descriptionEn: "Single-portion mixed-fruit jam, 30 g cup.",
    descriptionAr: "مربى فواكه مشكلة 30 جرام كأس بلاستيك.",
    image: "/Products/mixed fruits Jam Portion.png",
    specs: { netWeight: "30 g", netWeightAr: "30 جرام" },
    packaging: { type: "plastic_cup", unitsPerCarton: 144, shipping: "carton" },
  },

  // ── Jams — 360 g glass jars ──────────────────────────────────────
  {
    id: 35, slug: "fig-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Fig Jam 360 g Jar", nameAr: "مربى تين 360 جرام برطمان",
    descriptionEn: "Whole-fig jam in a reclosable 360 g glass jar.",
    descriptionAr: "مربى تين 360 جرام في برطمان زجاج.",
    image: "/Products/Fig Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 36, slug: "strawberry-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Strawberry Jam 360 g Jar", nameAr: "مربى فراولة 360 جرام برطمان",
    descriptionEn: "Whole-strawberry jam in a 360 g glass jar.",
    descriptionAr: "مربى فراولة 360 جرام في برطمان زجاج.",
    image: "/Products/Strawberry Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 37, slug: "guava-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Guava Jam 360 g Jar", nameAr: "مربى جوافة 360 جرام برطمان",
    descriptionEn: "Guava jam in a 360 g glass jar.",
    descriptionAr: "مربى جوافة 360 جرام في برطمان زجاج.",
    image: "/Products/Guava Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 38, slug: "apricot-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Apricot Jam 360 g Jar", nameAr: "مربى مشمش 360 جرام برطمان",
    descriptionEn: "Apricot jam in a 360 g glass jar.",
    descriptionAr: "مربى مشمش 360 جرام في برطمان زجاج.",
    image: "/Products/Apricot Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 39, slug: "apple-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Apple Jam 360 g Jar", nameAr: "مربى تفاح 360 جرام برطمان",
    descriptionEn: "Apple jam in a 360 g glass jar.",
    descriptionAr: "مربى تفاح 360 جرام في برطمان زجاج.",
    image: "/Products/Apple Jam 3d.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 40, slug: "peach-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Peach Jam 360 g Jar", nameAr: "مربى خوخ 360 جرام برطمان",
    descriptionEn: "Peach jam in a 360 g glass jar.",
    descriptionAr: "مربى خوخ 360 جرام في برطمان زجاج.",
    image: "/Products/Peach Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 41, slug: "mango-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Mango Jam 360 g Jar", nameAr: "مربى مانجو 360 جرام برطمان",
    descriptionEn: "Mango jam in a 360 g glass jar.",
    descriptionAr: "مربى مانجو 360 جرام في برطمان زجاج.",
    image: "/Products/Mango Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 42, slug: "orange-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Orange Jam 360 g Jar", nameAr: "مربى برتقال 360 جرام برطمان",
    descriptionEn: "Orange jam in a 360 g glass jar.",
    descriptionAr: "مربى برتقال 360 جرام في برطمان زجاج.",
    image: null,
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },
  {
    id: 43, slug: "mixed-fruit-jam-360g-jar", brand: "yamkers", category: "jams",
    nameEn: "Mixed Fruit Jam 360 g Jar", nameAr: "مربى فواكه مشكلة 360 جرام برطمان",
    descriptionEn: "Mixed-fruit jam in a 360 g glass jar.",
    descriptionAr: "مربى فواكه مشكلة 360 جرام في برطمان زجاج.",
    image: "/Products/Mixed Jam 3d copy.png",
    specs: { netWeight: "360 g", netWeightAr: "360 جرام" },
    packaging: { type: "glass_jar", unitsPerCarton: 12, shipping: "shrink_wrap" },
  },

  // ── Juices ───────────────────────────────────────────────────────
  {
    id: 44, slug: "orange-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Orange Juice 235 ml", nameAr: "عصير برتقال 235 مل",
    descriptionEn: "Yamkers orange juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير برتقال 235 مل في عبوة تتراباك.",
    image: "/Products/Orange Juice.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 45, slug: "guava-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Guava Juice 235 ml", nameAr: "عصير جوافة 235 مل",
    descriptionEn: "Yamkers guava juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير جوافة 235 مل في عبوة تتراباك.",
    image: "/Products/Guava Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 46, slug: "mango-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Mango Juice 235 ml", nameAr: "عصير مانجو 235 مل",
    descriptionEn: "Yamkers mango juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير مانجو 235 مل في عبوة تتراباك.",
    image: "/Products/Mango Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 47, slug: "apple-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Apple Juice 235 ml", nameAr: "عصير تفاح 235 مل",
    descriptionEn: "Yamkers apple juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير تفاح 235 مل في عبوة تتراباك.",
    image: "/Products/Apple Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
  {
    id: 48, slug: "cocktail-juice-235ml", brand: "yamkers", category: "juices",
    nameEn: "Cocktail Juice 235 ml", nameAr: "عصير كوكتيل 235 مل",
    descriptionEn: "Mixed-fruit cocktail juice in a 235 ml Tetra Pak.",
    descriptionAr: "عصير كوكتيل 235 مل في عبوة تتراباك.",
    image: "/Products/coktail Juice copy.png",
    specs: { netWeight: "235 ml", netWeightAr: "235 مل" },
    packaging: { type: "tetra_pak", unitsPerCarton: 27, shipping: "shrink_wrap" },
  },
];
```

**Step 2:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0.

**Step 3:** Commit.

```bash
git add .
git commit -m "feat(products): add Product type and 48-SKU Yamkers seed data"
```

---

### Task 3: Add `products` i18n namespace + move `ourBrands` to top level

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ar.json`
- Modify: `src/i18n/messages/fr.json`

**Step 1:** In `src/i18n/messages/en.json`, find `nav.services.ourBrands` (under the `nav.services` block) and **remove** that key. Then add `"ourBrands": "Our Brands"` as a sibling of `"home"`, `"products"`, `"news"`, etc. inside the `nav` object.

**Step 2:** In `src/i18n/messages/en.json`, add a new top-level `products` namespace immediately after the existing `terms` or `privacy` namespace (order doesn't matter, place it where neighbours read well):

```jsonc
"products": {
  "hero": {
    "eyebrow": "OUR BRANDS",
    "heading": "Yamkers",
    "subhead": "Egypt's pantry, packed and ready for the world."
  },
  "catalog": {
    "eyebrow": "CATALOG",
    "heading": "Browse Products",
    "intro": "Filter by category. Hover any pack to see specs, weights, and carton details."
  },
  "tabs": {
    "all": "All",
    "tomato_paste": "Tomato Paste",
    "fava_beans": "Fava Beans",
    "beans_peas": "Beans & Peas",
    "canned_vegetables": "Canned Vegetables",
    "jams": "Jams",
    "juices": "Juices"
  },
  "card": {
    "perCarton": "/carton",
    "net": "Net",
    "drained": "Drained",
    "brand": {
      "yamkers": "Yamkers",
      "tasbeka": "Tasbeka"
    },
    "packaging": {
      "tin": "Tin can",
      "glass_jar": "Glass jar",
      "plastic_cup": "Plastic cup",
      "sachet": "Sachet",
      "tetra_pak": "Tetra Pak"
    }
  },
  "cta": "Explore Catalog"
}
```

**Step 3:** In `src/i18n/messages/ar.json`, mirror Step 1 (move `ourBrands` out of `nav.services` to `nav`) and Step 2 with Arabic strings:

```jsonc
"products": {
  "hero": {
    "eyebrow": "علاماتنا التجارية",
    "heading": "يامكرز",
    "subhead": "مذاق مصر، معبأ وجاهز للعالم."
  },
  "catalog": {
    "eyebrow": "الكتالوج",
    "heading": "تصفح المنتجات",
    "intro": "اختر فئة وحرّك المؤشر فوق أي منتج لعرض المواصفات والأوزان وتفاصيل التعبئة."
  },
  "tabs": {
    "all": "الكل",
    "tomato_paste": "صلصة الطماطم",
    "fava_beans": "الفول المدمس",
    "beans_peas": "الفاصولياء والبازلاء",
    "canned_vegetables": "الخضروات المعلبة",
    "jams": "المربى",
    "juices": "العصائر"
  },
  "card": {
    "perCarton": " /كرتون",
    "net": "الوزن الصافي",
    "drained": "الوزن المصفى",
    "brand": {
      "yamkers": "يامكرز",
      "tasbeka": "تسبكة"
    },
    "packaging": {
      "tin": "علبة صفيح",
      "glass_jar": "برطمان زجاج",
      "plastic_cup": "كأس بلاستيك",
      "sachet": "ظرف",
      "tetra_pak": "تتراباك"
    }
  },
  "cta": "تصفح الكتالوج"
}
```

**Step 4:** In `src/i18n/messages/fr.json`, mirror Steps 1 + 2 with French strings:

```jsonc
"products": {
  "hero": {
    "eyebrow": "NOS MARQUES",
    "heading": "Yamkers",
    "subhead": "Le garde-manger égyptien, prêt pour le monde."
  },
  "catalog": {
    "eyebrow": "CATALOGUE",
    "heading": "Parcourir les produits",
    "intro": "Filtrez par catégorie. Survolez une référence pour voir les spécifications, poids et conditionnement."
  },
  "tabs": {
    "all": "Tous",
    "tomato_paste": "Concentré de tomate",
    "fava_beans": "Fèves",
    "beans_peas": "Haricots et petits pois",
    "canned_vegetables": "Légumes en conserve",
    "jams": "Confitures",
    "juices": "Jus"
  },
  "card": {
    "perCarton": " /carton",
    "net": "Net",
    "drained": "Égoutté",
    "brand": {
      "yamkers": "Yamkers",
      "tasbeka": "Tasbeka"
    },
    "packaging": {
      "tin": "Boîte en fer-blanc",
      "glass_jar": "Bocal en verre",
      "plastic_cup": "Coupelle plastique",
      "sachet": "Sachet",
      "tetra_pak": "Brique Tetra Pak"
    }
  },
  "cta": "Voir le catalogue"
}
```

**Step 5:** Verify the JSON is valid in all three files and that no other code reads `nav.services.ourBrands` (header is the only consumer — Task 4 fixes it). Run:

```bash
node -e "['en','ar','fr'].forEach(l => JSON.parse(require('fs').readFileSync('src/i18n/messages/'+l+'.json','utf8')));"
```
Expected: no output, no errors.

**Step 6:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0 — and **note**: typecheck won't catch the `nav.services.ourBrands` removal until Task 4 (where the consumer is fixed). It is OK if next-intl produces a `MISSING_MESSAGE` runtime warning at this point; that's resolved by Task 4.

**Step 7:** Commit.

```bash
git add .
git commit -m "feat(i18n): add products namespace; lift ourBrands to nav top level"
```

---

### Task 4: Promote `Our Brands` to top-level navbar

**Files:**
- Modify: `src/components/ui/header.tsx`

**Step 1:** Open `src/components/ui/header.tsx`. Locate the `serviceItems` array near the top (around line 14):

```ts
const serviceItems = [
  { key: "ourBrands", href: "/services/our-brands" },
  { key: "privateLabel", href: "/services/private-label" },
  { key: "customProduct", href: "/services/custom-product" },
  { key: "export", href: "/services/export" },
] as const;
```

Remove the `ourBrands` entry so the array contains only `privateLabel`, `customProduct`, `export`.

**Step 2:** In the **desktop** nav block (the `<div className="hidden items-center gap-5 md:flex">` chunk), find the `<Link href="/">{t("home")}</Link>` line. Immediately after that link, insert:

```tsx
<Link href="/products" className={buttonVariants({ variant: "ghost" })}>
  {t("ourBrands")}
</Link>
```

**Step 3:** In the **mobile** menu block (the `<div className="grid gap-y-2">` inside the mobile sheet), find the `<Link href="/" onClick={closeMobile} … >{t("home")}</Link>` line. Immediately after that link, insert:

```tsx
<Link
  href="/products"
  onClick={closeMobile}
  className={buttonVariants({
    variant: "ghost",
    className: "justify-start",
  })}
>
  {t("ourBrands")}
</Link>
```

**Step 4:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0.

**Step 5:** Smoke (dev should already be running on :3000):

```bash
curl -s http://localhost:3000/ | grep -o "Our Brands" | head -1
curl -s http://localhost:3000/ar | grep -o "علاماتنا" | head -1
```
Expected: each prints once.

**Step 6:** Commit.

```bash
git add .
git commit -m "feat(nav): promote Our Brands to top-level navbar linking to /products"
```

---

### Task 5: Build `<ProductsHero />`

**Files:**
- Create: `src/components/ui/products-hero.tsx`

**Step 1:** Create `src/components/ui/products-hero.tsx`:

```tsx
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

const heroVideos = [
  "/applejam.mp4",
  "/chilifavebeans.mp4",
  "/favebeans.mp4",
  "/favebeanstehina.mp4",
  "/mangojar.mp4",
  "/sauce.mp4",
  "/plable.mp4",
  "/privatelable.mp4",
] as const;

interface ProductsHeroProps {
  eyebrow: string;
  heading: string;
  subhead: string;
  cta: string;
}

export default function ProductsHero({
  eyebrow,
  heading,
  subhead,
  cta,
}: ProductsHeroProps) {
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
      transition: { staggerChildren: 0.2, delayChildren: 0.4 },
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
      className="relative h-[80vh] w-full overflow-hidden"
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
            {eyebrow}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mb-6 font-display text-5xl font-light leading-tight md:text-7xl"
          >
            {heading}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-xl text-base text-white/80 md:text-lg"
          >
            {subhead}
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center">
            <FlowButton href="#catalog" text={cta} />
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
```

**Step 2:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0.

**Step 3:** Commit.

```bash
git add .
git commit -m "feat(products): add ProductsHero with cycling video reel"
```

---

### Task 6: Build `<ProductCard />`

**Files:**
- Create: `src/components/ui/product-card.tsx`

**Step 1:** Create `src/components/ui/product-card.tsx`:

```tsx
"use client";

import Image from "next/image";
import {
  CardHoverReveal,
  CardHoverRevealContent,
  CardHoverRevealMain,
} from "@/components/ui/reveal-on-hover";
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

const brandLogos: Record<Product["brand"], string> = {
  yamkers: "/yamkers_logo.png",
  tasbeka: "/tasbeka_logo.png",
};

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
      : "bg-primary/30 text-primary-foreground";
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
  const isAr = locale === "ar";
  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
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
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Placeholder name={name} />
        )}
      </CardHoverRevealMain>

      <CardHoverRevealContent className="space-y-3 rounded-2xl bg-zinc-900/75 text-zinc-50">
        <div className="flex items-center gap-2">
          <Image
            src={brandLogos[product.brand]}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wider">
            {labels.brand[product.brand]}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-tight">{name}</h3>
        <p className="text-xs leading-relaxed text-zinc-50/75">{description}</p>

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
      </CardHoverRevealContent>
    </CardHoverReveal>
  );
}
```

**Step 2:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0.

**Step 3:** Commit.

```bash
git add .
git commit -m "feat(products): add ProductCard with hover-reveal + placeholder"
```

---

### Task 7: Build `<ProductsTabs />`

**Files:**
- Create: `src/components/ui/products-tabs.tsx`

**Step 1:** Create `src/components/ui/products-tabs.tsx`:

```tsx
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
```

**Step 2:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0.

**Step 3:** Commit.

```bash
git add .
git commit -m "feat(products): add ProductsTabs with filter state + animated grid"
```

---

### Task 8: Replace `/products` page with the real implementation

**Files:**
- Modify: `src/app/[locale]/products/page.tsx`

**Step 1:** Overwrite the current stub with:

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import ProductsHero from "@/components/ui/products-hero";
import ProductsTabs from "@/components/ui/products-tabs";
import { products } from "@/lib/data/products";
import type {
  PackagingType,
  ProductBrand,
  ProductCategory,
} from "@/lib/data/products";

type TabKey = "all" | ProductCategory;

const TAB_KEYS: TabKey[] = [
  "all",
  "tomato_paste",
  "fava_beans",
  "beans_peas",
  "canned_vegetables",
  "jams",
  "juices",
];

const BRAND_KEYS: ProductBrand[] = ["yamkers", "tasbeka"];

const PACKAGING_KEYS: PackagingType[] = [
  "tin",
  "glass_jar",
  "plastic_cup",
  "sachet",
  "tetra_pak",
];

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  const tabs = Object.fromEntries(
    TAB_KEYS.map((k) => [k, t(`tabs.${k}`)])
  ) as Record<TabKey, string>;
  const brand = Object.fromEntries(
    BRAND_KEYS.map((k) => [k, t(`card.brand.${k}`)])
  ) as Record<ProductBrand, string>;
  const packaging = Object.fromEntries(
    PACKAGING_KEYS.map((k) => [k, t(`card.packaging.${k}`)])
  ) as Record<PackagingType, string>;

  return (
    <>
      <ProductsHero
        eyebrow={t("hero.eyebrow")}
        heading={t("hero.heading")}
        subhead={t("hero.subhead")}
        cta={t("cta")}
      />
      <ProductsTabs
        products={products}
        locale={locale}
        labels={{
          catalog: {
            eyebrow: t("catalog.eyebrow"),
            heading: t("catalog.heading"),
            intro: t("catalog.intro"),
          },
          tabs,
          card: {
            brand,
            packaging,
            perCarton: t("card.perCarton"),
            net: t("card.net"),
            drained: t("card.drained"),
          },
        }}
      />
    </>
  );
}
```

**Step 2:** Verify typecheck.

Run: `bun run typecheck`
Expected: exit 0.

**Step 3:** Smoke (with dev running):

```bash
curl -s http://localhost:3000/products | grep -o "Browse Products" | head -1
curl -s http://localhost:3000/ar/products | grep -o "تصفح" | head -1
curl -s http://localhost:3000/fr/products | grep -o "Parcourir" | head -1
```
Expected: each prints once.

**Step 4:** Commit.

```bash
git add .
git commit -m "feat(products): wire /products page to hero + tabs"
```

---

### Task 9: Visual smoke + build verification

**Files:** none modified.

**Step 1:** Open the running dev server in a browser (or have the user do so) at each URL and confirm:

- `http://localhost:3000/` — navbar has a new top-level "Our Brands" link; Services dropdown no longer contains it.
- `http://localhost:3000/products` — hero video plays, mask is 60 % opaque, "Explore Catalog" anchors to `#catalog`, scrolling reveals the tabs section.
- Click each of the 7 tabs — only the matching products appear; animation is smooth; "All" shows 48 cards.
- Hover any card with a real image — image scales subtly, dark panel slides up with chips + description.
- Hover any placeholder card (e.g. White Beans) — placeholder shows `/bg6.jpg` tinted blue with faded `navbarLogo.svg`; hover reveal still works.
- `http://localhost:3000/ar/products` — entire page flips RTL, tab labels and card content render in Arabic.
- `http://localhost:3000/fr/products` — French strings render.
- Mobile menu (resize to <768 px) — "Our Brands" item appears above "Services" accordion.

**Step 2:** Production build.

Run: `bun run build`
Expected: build completes, output includes prerendered routes `/products`, `/ar/products`, `/fr/products`.

**Step 3:** Final tidy (if any artifacts to discard).

```bash
git status
```
Expected: clean.

**Step 4:** Final commit (only if Step 1 surfaced a visual bug worth fixing — otherwise skip).

---

## Out of scope (deferred — do NOT do in this plan)

- Tasbeka product data (only Yamkers in the seed).
- Per-product detail page / route / modal.
- "Add to RFQ / Request quote" flow on cards.
- Search box across catalog.
- Sorting (price, weight, A→Z).
- Excel re-import tooling — current import is a one-time manual operation captured in `products.ts`.
- Real photography for placeholder SKUs — drop new files into `/public/Products/` and update the affected `image: null` fields.
