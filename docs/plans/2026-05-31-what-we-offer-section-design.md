# What We Offer — Section Design

**Date:** 2026-05-31
**Component:** `src/components/ui/what-we-offer-section.tsx`
**Mounted in:** `src/app/[locale]/page.tsx` (after `WhoWeAreSection`)
**i18n namespace:** `whatWeOffer` (added to `en.json`, `fr.json`, `ar.json`)

## Goal

Introduce the four working pillars of KAG — Our Brands, Private Label, Custom Recipe, Export — as the next home-page section after "Who We Are", using the scroll-driven vertical timeline pattern from `src/components/ui/release-time-line.tsx`.

## Inheriting from `release-time-line.tsx` (Option A: keep collapse/expand)

- Sticky left column (`md:sticky top-8`): pattern icon + title + subtitle. Active state swaps to `bg-primary text-primary-foreground`; inactive uses `bg-muted text-muted-foreground`.
- Right card: image, title, description, expandable items list + CTA(s).
- Scroll-proximity active detection (RAF + sentinel `getBoundingClientRect`) kept verbatim from the reference.
- Inactive card: muted border, `line-clamp-2` description, `grid-rows-[0fr] opacity-0` items.
- Active card: `border-primary/40` + soft shadow, full description, `grid-rows-[1fr] opacity-100` items.

## Site-wide animation conformance

Wrap the section root with the same framer-motion vocabulary as `who-we-are-section.tsx`:
- `useScroll` + `useTransform` parallax blobs (`bg-primary/5`, `bg-secondary/5`, blur-3xl)
- Two floating accent dots (primary/30, secondary/30) with infinite easeInOut bobbing
- `containerVariants` / `itemVariants` for stagger + reveal
- `useInView` driving the visible state

**Section root must NOT set `bg-*`** — the body `/bg6.jpg` shows through (project rule).

## Section header

- Eyebrow `WHAT WE OFFER` with `Zap` icon, `text-primary font-medium`
- Display heading `font-display text-4xl md:text-5xl` centered
- Lime accent bar (`bg-secondary`, width-grow from 0 → 96px)
- Centered intro paragraph in `text-foreground/80`

## Pillar entries

### 1. Our Brands (custom card)

**Sticky icon:** `/pattern/kag-monogram-lime.png`

**Image area:**
- `/ourbrandsbackground.webp` as `background-image` (or `<img>` + absolute overlay)
- `bg-black/70` overlay
- Centered foreground: **auto-rotating brand-logo carousel** — Yamkers ↔ Tasbeka, swap every ~3s, framer-motion `AnimatePresence` with fade + soft scale
- Respect `prefers-reduced-motion` (no auto-rotate; show both side-by-side)
- Logos rendered with `<img>` to avoid Next/Image domain config; fixed max-height (e.g. `h-28`)

**Body:**
- Short description paragraph
- Categories chip row (Sauces, Jams, Juices, Fava Beans) — `bg-secondary/15 text-foreground rounded-full px-3 py-1 text-xs font-medium`

**Expanded block (active only):**
- Two CTAs in a flex row:
  - `FlowButton` "See Our Products" → `/products` (primary)
  - Outline-styled `Link` "Request a Quote" → `/rfq` (secondary — `buttonVariants({ variant: "outline" })` from `@/components/ui/button`)

### 2. Private Label (richer card — *extracted* from the Rich Land reference, not copied)

**Sticky icon:** `/pattern/private-label-lime.png`

**Image:** `/privatelable.jpg` at top of card (same slot as the standard timeline image)

**Body (always visible):**
- Small pill badge "PRIVATE LABEL" (`bg-primary/10 text-primary text-xs uppercase tracking-wider rounded-full px-3 py-1`)
- Title (`text-md font-medium md:text-lg`)
- Italic lime tagline "Your brand, our expertise." (`text-secondary italic`)
- Two short paragraphs (clamped to 2 lines when inactive via `line-clamp-2` on a wrapping div)

**Expanded block (active only):**
- 2×2 mini feature grid with `lucide-react` icons:
  - State-of-the-Art Manufacturing (`Factory`)
  - Premium Ingredients (`Leaf`)
  - Dedicated Partnership (`Handshake`)
  - Global Scale (`Globe`)
  - Each feature: small icon + title + 1-line description, inside `rounded-lg border p-3`
- "Our Capabilities" bullet list (reusing the timeline's bullet styling — small lime dot + text):
  - Custom Recipe Development
  - Brand-Specific Packaging
  - QA & Testing
  - Regulatory Compliance
  - Supply Chain Management
  - Global Distribution Support
- `FlowButton` "Partner with Us" → `/contact`

### 3. Custom Recipe (standard timeline card)

**Sticky icon:** `/pattern/wheat-lime.png`
**Image:** `/recipe.jpg`
**Body:** title + description
**Items (active only):**
- Flavor profiling & formulation
- Sensory & shelf-life testing
- Pilot batch & scale-up trials
- Packaging match for target market
**CTA:** `FlowButton` "Start a Recipe" → `/contact`

### 4. Export (standard timeline card)

**Sticky icon:** `/pattern/export-globe-lime.png`
**Image:** `/exportstrip.jpg`
**Body:** title + description
**Items (active only):**
- Established regional & global markets
- Logistics & export documentation
- Trusted importer/partner network
- Egyptian-origin consistency at scale
**CTA:** `FlowButton` "Reach Global Markets" → `/export`

## Brand-color tweaks vs the reference

- Active sticky icon pill: `bg-primary text-primary-foreground` (reference already does this — keep)
- Active card border: `border-primary/40 dark:border-primary/30` (reference uses `border-gray-50`)
- Bullet dots: `bg-secondary` (lime) instead of `bg-primary/60`
- Title hover/active color: `text-primary` instead of generic `text-foreground`

## i18n schema (`whatWeOffer`)

```jsonc
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
      "tagline": "Your brand, our expertise.",
      "paragraphs": [
        "We produce tailor-made private-label products for international clients and partners. From sourcing premium ingredients to state-of-the-art manufacturing, we prioritize quality at every step.",
        "As a trusted partner, we work closely with each client to develop and deliver customized private-label solutions aligned with their brand vision and market positioning."
      ],
      "features": [
        { "title": "State-of-the-Art Manufacturing", "desc": "Modern lines and automated production." },
        { "title": "Premium Ingredients",           "desc": "Sourced through long-term grower partnerships." },
        { "title": "Dedicated Partnership",         "desc": "Close collaboration on tailored solutions." },
        { "title": "Global Scale",                  "desc": "International reach and distribution." }
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

FR and AR receive parity keys with English placeholders flagged `// TODO translate` or duplicated copy, to be filled by the translator.

## Files touched

- **New:** `src/components/ui/what-we-offer-section.tsx`
- **Edit:** `src/app/[locale]/page.tsx` — import + mount after `<WhoWeAreSection />`
- **Edit:** `src/i18n/messages/en.json` — add `whatWeOffer` block
- **Edit:** `src/i18n/messages/fr.json` — add `whatWeOffer` parity block
- **Edit:** `src/i18n/messages/ar.json` — add `whatWeOffer` parity block

## Out of scope (YAGNI)

- Dynamic CMS-driven pillars
- Per-brand detail pages (we link to `/products` and `/rfq` only)
- Pulling Yamkers / Tasbeka product feeds
- Replacing the existing nav `services` strings — they already exist independently
