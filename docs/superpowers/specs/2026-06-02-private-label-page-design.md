# Private Label Page Design

**Date:** 2026-06-02
**Status:** Design approved by user; ready for implementation plan
**Route:** `/private-label` (locale-prefixed via next-intl)

---

## Goal

Build a dedicated `/private-label` page that opens with a fresh full-screen hero and presents detailed capabilities, process, packaging options, certifications, and FAQ — all dressed in the same framer-motion vocabulary as `WhoWeAreSection` (scroll-triggered reveals, parallax blobs, centered eyebrow + lime underline, staggered children). The existing home `PrivateLabelSection` is left untouched; it continues to serve as the home-page teaser.

## Non-goals

- Do **not** modify `src/components/ui/private-label-section.tsx` (home teaser).
- Do **not** introduce new global state, CMS, or backend.
- Do **not** add map / global-reach content (already lives in its own section).
- Do **not** add product listings (already at `/products`).

---

## Information architecture

```
/private-label
├── 1. Hero (full-screen, looping video, scroll-tied scale, centered copy + CTA)
├── 2. Capabilities (6-pillar grid, who-we-are pillar vocabulary)
├── 3. Process (6-step vertical timeline, alternating zig-zag on md+)
├── 4. Packaging & formats (4-card grid)
├── 5. Quality & certifications (shared marquee)
├── 6. FAQ (shadcn Accordion, 6 items)
└── 7. CTA banner (primary bg, FlowButton → /rfq)
```

### Section animation vocabulary (shared, matches who-we-are)

Every section root uses:
- `useRef` + `useInView(ref, { once: false, amount: 0.1 })` for visibility tracking
- `useScroll` with `offset: ["start end", "end start"]` driving parallax blobs (`y1`/`y2`/`rotate1`/`rotate2`)
- `containerVariants` with `staggerChildren: 0.1`, `delayChildren: 0.15`
- `itemVariants` with `y: 24 → 0`, `opacity: 0 → 1`, `duration: 0.6`, `ease: "easeOut"`
- Heading block: animated eyebrow with `Zap` (or appropriate lucide) icon + display heading + animated lime underline (`h-1 bg-secondary`, `width: 0 → 96`)
- Two parallax blobs (top-left primary, bottom-right secondary), pointer-events-none, blur-3xl

---

## 1. Hero (`PrivateLabelHero`)

**File:** `src/components/ui/private-label-hero.tsx` (client component)

Pattern mirrors `ProductsHero` exactly:

- `<section ref={sectionRef} className="relative h-screen w-full overflow-hidden">`
- `<motion.video src="/privatelable.mp4" autoPlay muted loop playsInline preload="metadata" style={{ scale: videoScale }} className="absolute inset-0 h-full w-full object-cover" />`
- `<div className="absolute inset-0 bg-black/60" />`
- Scroll transforms: `contentY 0→120`, `contentOpacity 1→0` over `[0, 0.6]`, `videoScale 1→1.1`
- Centered content stack (staggered children):
  - Eyebrow: `text-xs uppercase tracking-[0.3em] text-white/80`
  - Heading: `font-display text-5xl md:text-7xl font-light leading-tight`
  - Subhead: `text-base md:text-lg text-white/80 max-w-xl`
  - `FlowButton` → `#capabilities` (anchor to next section)
- Animated chevron-down at bottom (`y: [0, 10, 0]`, infinite, ease-in-out)

**Props:** `{ eyebrow, heading, subhead, cta }` (all strings from i18n).

---

## 2. Capabilities (`PrivateLabelCapabilities`)

**File:** `src/components/ui/private-label-capabilities.tsx`
**Section id:** `capabilities`

Six pillars in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`), each rendered with the **exact same `PillarItem` look as `WhoWeAreSection`** — but since the layout is a uniform grid (not zig-zag), the icon+title row stays in a fixed direction (no left/right alternation needed).

Card markup per pillar:
```tsx
<motion.div className="group flex flex-col" variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}>
  <motion.div className="mb-3 flex items-center gap-3">
    <motion.div
      className="rounded-lg bg-primary/10 p-3 transition-colors duration-300 group-hover:bg-primary/20"
      whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
    >
      <img src={iconSrc} alt="" className="h-10 w-10 object-contain" />
    </motion.div>
    <h3 className="font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary">
      {title}
    </h3>
  </motion.div>
  <p className="ps-16 text-sm leading-relaxed text-foreground/80">{description}</p>
</motion.div>
```

**Pillar mapping (icons from `/public/pattern/`):**

| Key | Title | Icon |
|-----|-------|------|
| `rnd` | R&D & Formulation | `wheat-lime.png` |
| `manufacturing` | In-house Manufacturing | `manufacturing-lime.png` |
| `packaging` | Packaging Flexibility | `private-label-lime.png` |
| `regulatory` | Regulatory & Labeling | `kag-monogram-lime.png` |
| `qa` | QA & Certifications | `export-globe-lime.png` |
| `logistics` | Export Logistics | `distribution-truck-lime.png` |

---

## 3. Process timeline (`PrivateLabelProcess`)

**File:** `src/components/ui/private-label-process.tsx`

Vertical timeline of 6 numbered steps. On `md+`, alternating zig-zag layout (odd steps left, even steps right) with a `bg-primary/20` vertical spine running through the center column. On mobile, single-column stack with the spine on the left.

**Steps:**

| # | Key | Title (EN) |
|---|-----|------------|
| 1 | `brief` | Brief & Goals |
| 2 | `recipe` | Recipe Development |
| 3 | `samples` | Samples & Sign-off |
| 4 | `pilot` | Pilot Run |
| 5 | `production` | Full Production |
| 6 | `shipment` | Shipment & Aftercare |

Per-step markup (md+):
- Wrapper row: `relative flex md:items-center` with spine `absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-primary/20` rendered once on the parent.
- Number circle: `flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary font-display text-lg font-bold shadow-md`
- Step card (the side opposite the circle on alternating rows): `rounded-xl border border-primary/10 bg-card/60 p-6 backdrop-blur-sm` containing title (`font-heading text-xl`) + description (`text-sm text-foreground/80`).
- Direction-aware reveal: odd rows slide in from `x: -40`, even rows from `x: 40`, all `opacity: 0 → 1` once in view.

---

## 4. Packaging & formats (`PrivateLabelPackaging`)

**File:** `src/components/ui/private-label-packaging.tsx`

Same heading block (eyebrow + display heading + lime underline + intro). Below: 4-card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`).

Each card matches the new global-reach stat card style (centered, white surface, hover lift, animated lime bar at bottom):

```tsx
<motion.div
  className="group flex flex-col items-center rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white"
  variants={{ hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } } }}
  whileHover={{ y: -5, transition: { duration: 0.2 } }}
>
  <motion.div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10"
              whileHover={{ rotate: 360, transition: { duration: 0.8 } }}>
    <Image src={iconSrc} alt="" width={40} height={40} className="object-contain" />
  </motion.div>
  <h3 className="font-heading text-lg font-medium text-foreground">{title}</h3>
  <p className="mt-1 text-xs text-foreground/60">{moqLine}</p>
  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
    {capacities.map((c) => (
      <span key={c} className="rounded-full bg-secondary/20 px-2 py-0.5 text-[11px] font-medium text-primary">{c}</span>
    ))}
  </div>
  <motion.div className="mt-3 h-0.5 w-10 bg-secondary transition-all duration-300 group-hover:w-16" />
</motion.div>
```

**Format mapping:**

| Key | Title | Capacities | Icon (reuse) |
|-----|-------|-----------|--------------|
| `tin` | Tin (Canned) | 400 g · 800 g · 2.5 kg · 4.5 kg | `manufacturing-lime.png` |
| `glass` | Glass Jar | 250 g · 450 g · 650 g | `private-label-lime.png` |
| `pet` | PET Bottle | 250 ml · 500 ml · 1 L | `wheat-lime.png` |
| `pouch` | Pouch / Stick | 80 g · 250 g | `kag-monogram-lime.png` |

MOQ line is a short i18n string per format (e.g., "MOQ: 1× 20ft container").

---

## 5. Certifications marquee (shared component)

**File (new):** `src/components/ui/certifications-marquee.tsx`
**Refactor:** Extract the existing marquee block from `WhoWeAreSection` (lines 276-309 of `who-we-are-section.tsx`) into this new component. `WhoWeAreSection` then imports and uses it with the same `heading` prop value as before. The new private-label page also uses it with its own heading text.

**Props:** `{ heading: string }`

**Internals:** unchanged from current implementation — same 6 logos, same `animate-marquee` class, same edge-fade gradients, same hover behavior. The certs list stays hardcoded inside the shared component (it's a global brand asset, not page-specific).

**Acceptance:** `who-we-are` section renders identically post-refactor (visual diff = none).

---

## 6. FAQ (`PrivateLabelFaq`)

**File:** `src/components/ui/private-label-faq.tsx`

Centered max-`w-3xl` container. Heading block (eyebrow + display heading + lime underline). Below: shadcn `Accordion` (single, collapsible) with 6 items:

| Key | Question theme |
|-----|----------------|
| `moq` | Minimum order quantities |
| `leadTime` | Lead times (sampling, pilot, full production) |
| `samples` | Sample policy & cost |
| `artwork` | Custom artwork & label design |
| `regulatory` | Regulatory documentation & shelf-life |
| `incoterms` | Incoterms & shipping arrangements |

All trigger/content text from i18n.

---

## 7. CTA banner

Inline JSX in `page.tsx` (no separate component — it's 12 lines). Identical to the who-we-are CTA:

```tsx
<motion.div
  className="mt-20 flex flex-col items-center justify-between gap-6 rounded-xl bg-primary p-8 text-primary-foreground md:flex-row"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.3 }}
  transition={{ duration: 0.8, delay: 0.5 }}
>
  <div className="flex-1">
    <h3 className="mb-2 font-heading text-2xl font-medium">{t("cta.heading")}</h3>
    <p className="text-primary-foreground/80">{t("cta.sub")}</p>
  </div>
  <FlowButton href="/rfq" text={t("cta.button")} className="px-10 py-3" />
</motion.div>
```

---

## i18n schema

New top-level namespace `privateLabelPage` in **all three** locale files (`en.json`, `ar.json`, `fr.json`). Existing `privateLabel` namespace (home teaser) stays untouched.

```jsonc
"privateLabelPage": {
  "hero":          { "eyebrow": "", "heading": "", "subhead": "", "cta": "" },
  "capabilities":  {
    "eyebrow": "", "heading": "", "intro": "",
    "items": {
      "rnd":           { "title": "", "description": "" },
      "manufacturing": { "title": "", "description": "" },
      "packaging":     { "title": "", "description": "" },
      "regulatory":    { "title": "", "description": "" },
      "qa":            { "title": "", "description": "" },
      "logistics":     { "title": "", "description": "" }
    }
  },
  "process":       {
    "eyebrow": "", "heading": "", "intro": "",
    "steps": {
      "brief":      { "title": "", "description": "" },
      "recipe":     { "title": "", "description": "" },
      "samples":    { "title": "", "description": "" },
      "pilot":      { "title": "", "description": "" },
      "production": { "title": "", "description": "" },
      "shipment":   { "title": "", "description": "" }
    }
  },
  "packaging":     {
    "eyebrow": "", "heading": "", "intro": "",
    "items": {
      "tin":   { "title": "", "moq": "", "capacities": ["", "", "", ""] },
      "glass": { "title": "", "moq": "", "capacities": ["", "", ""] },
      "pet":   { "title": "", "moq": "", "capacities": ["", "", ""] },
      "pouch": { "title": "", "moq": "", "capacities": ["", ""] }
    }
  },
  "certifications": { "heading": "" },
  "faq":           {
    "eyebrow": "", "heading": "",
    "items": {
      "moq":        { "question": "", "answer": "" },
      "leadTime":   { "question": "", "answer": "" },
      "samples":    { "question": "", "answer": "" },
      "artwork":    { "question": "", "answer": "" },
      "regulatory": { "question": "", "answer": "" },
      "incoterms":  { "question": "", "answer": "" }
    }
  },
  "cta":           { "heading": "", "sub": "", "button": "" }
}
```

EN/AR/FR copy will be drafted during implementation (factual, neutral B2B tone matching existing site voice).

---

## Header navigation

Add `Private Label` as a top-level link alongside `Our Brands`.

- **i18n key:** `nav.privateLabel` (sibling of `nav.ourBrands`, `nav.home`, …) in all three locales.
- **Header component:** add a new `<Link href="/private-label">` ghost button in the desktop nav block, and a corresponding mobile-menu entry below the Our Brands entry. Same pattern as the existing Our Brands link added in commit `91bc7bc`.

---

## Page composition (`src/app/[locale]/private-label/page.tsx`)

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import PrivateLabelHero from "@/components/ui/private-label-hero";
import PrivateLabelCapabilities from "@/components/ui/private-label-capabilities";
import PrivateLabelProcess from "@/components/ui/private-label-process";
import PrivateLabelPackaging from "@/components/ui/private-label-packaging";
import CertificationsMarquee from "@/components/ui/certifications-marquee";
import PrivateLabelFaq from "@/components/ui/private-label-faq";
// CTA banner inline

export default async function PrivateLabelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privateLabelPage");
  // build typed labels via Object.fromEntries over key lists (same pattern as products/page.tsx)
  return (
    <>
      <PrivateLabelHero ... />
      <PrivateLabelCapabilities ... />
      <PrivateLabelProcess ... />
      <PrivateLabelPackaging ... />
      {/* certifications section wrapper provides heading + spacing */}
      <section className="px-4 py-24"><CertificationsMarquee heading={t("certifications.heading")} /></section>
      <PrivateLabelFaq ... />
      {/* CTA banner inline */}
    </>
  );
}
```

Hero is full-bleed (no container). All other sections follow who-we-are's `px-4 py-24` + inner `container mx-auto max-w-7xl` pattern. No section sets a `bg-*` on its root (per memory: body's `/bg6.jpg` shows through).

---

## File summary

| Action | Path |
|--------|------|
| **Create** | `src/app/[locale]/private-label/page.tsx` |
| **Create** | `src/components/ui/private-label-hero.tsx` |
| **Create** | `src/components/ui/private-label-capabilities.tsx` |
| **Create** | `src/components/ui/private-label-process.tsx` |
| **Create** | `src/components/ui/private-label-packaging.tsx` |
| **Create** | `src/components/ui/private-label-faq.tsx` |
| **Create** | `src/components/ui/certifications-marquee.tsx` |
| **Modify** | `src/components/ui/who-we-are-section.tsx` (replace inline marquee with shared component) |
| **Modify** | `src/components/ui/header.tsx` (add Private Label link, desktop + mobile) |
| **Modify** | `src/i18n/messages/en.json` (add `privateLabelPage` + `nav.privateLabel`) |
| **Modify** | `src/i18n/messages/ar.json` (mirror) |
| **Modify** | `src/i18n/messages/fr.json` (mirror) |

Net new: **7 files**. Modified: **5 files**. Total touched: **12**.

---

## Acceptance criteria

1. `/en/private-label`, `/private-label` (en default), `/ar/private-label`, `/fr/private-label` all render server-side without runtime errors.
2. `bun run typecheck` passes.
3. `bun run build` produces the four prerendered routes above.
4. Hero video autoplays muted on first paint; scroll downward scales the video to 1.1 by section exit.
5. All six capability cards render with the correct lime PNG icons from `/public/pattern/`.
6. Process timeline alternates zig-zag on `md+`; collapses to single-column on mobile with left-anchored spine.
7. Packaging cards animate lime bar from `w-10` to `w-16` on hover; icon spins 360°.
8. Certifications marquee on `/private-label` is visually identical to the one on the home `/#who-we-are` section (verified by side-by-side comparison).
9. FAQ accordion expands/collapses on click; one item open at a time (`type="single"` collapsible).
10. CTA `FlowButton` links to `/rfq`.
11. Header shows `Private Label` link on desktop and inside the mobile menu, in all three locales.
12. RTL Arabic layout: process timeline mirrors correctly (no broken icons or flipped numbers).
13. Existing home `PrivateLabelSection` is unchanged (binary diff against `HEAD` = empty for that file).
14. Existing `WhoWeAreSection` looks identical post-marquee-refactor (no visual regression).

---

## Out of scope (parking lot)

- A11y deep-pass (focus traps, reduced-motion query) — site-wide concern, future PR.
- Localized SEO metadata (OpenGraph, hreflang) — covered by existing `generateMetadata` patterns elsewhere; add later if needed.
- Image-asset commissioning for packaging cards — using existing `/public/pattern/` icons as placeholders; swap to real packaging photography when available.
