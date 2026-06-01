# Our Products — Section Design

**Date:** 2026-06-01
**Status:** Approved by user 2026-06-01

## Goal

A home-page "Our Products" section that showcases six flagship Yamkers SKUs as a wall of image cards. On hover (or in-view on touch devices) each card swaps from the still product image to a muted, looping product video. A single section-level CTA — "See All Products" — routes to `/products`.

## Visual reference

Cards adapt the user-provided `card-21.tsx` (DestinationCard): rounded, themed glow, parallax-zoom background, themed-gradient overlay, themed pill at the bottom. The `<a>` wrapper is dropped because cards are not individually clickable (no per-product page exists).

## Layout

- Section eyebrow + heading + intro copy at top (same rhythm as `WhoWeAreSection` and `WhatWeOfferSection`).
- Grid: `lg:grid-cols-3 md:grid-cols-2 grid-cols-1`, `gap-8`, cards `aspect-[3/4]` or fixed `h-[450px]`.
- Centered `FlowButton` "See All Products" → `/products` below the grid.
- Section root: NO `bg-*` (project convention — body `/bg6.jpg` shows through).
- Mounted on `src/app/[locale]/page.tsx` after `<WhatWeOfferSection />`.

## Card interaction

- Each card renders the product PNG as the base layer (Next `<Image>`, `sizes` set, no `priority`).
- A `<video playsInline muted loop preload="metadata">` is layered on top, `opacity-0` by default.
- On desktop (`group-hover`) the video gets `opacity-100` and starts playing; on hover-out it pauses and resets.
- On touch devices (no hover capability) the section uses an `IntersectionObserver`: when a card is sufficiently in view, its video auto-plays; when it leaves, it pauses.
- Image stays mounted underneath so first paint is instant and there's no flash if video hasn't buffered.
- `useReducedMotion()` is respected — when true, video does not play (image-only).

## Per-product data

| Asset slug | Display name | themeColor (HSL triplet) |
|---|---|---|
| `sauce` | Yamkers Sauce | `0 65% 38%` (deep tomato red) |
| `favebeans` | Yamkers Fava Beans | `28 45% 28%` (warm brown) |
| `favebeansTehina` | Yamkers Fava Beans with Tehina | `38 35% 38%` (tan / sesame) |
| `chiliFavebeans` | Yamkers Chili Fava Beans | `12 70% 38%` (spicy red-orange) |
| `mangoJar` | Yamkers Mango Jar | `38 80% 42%` (amber gold) |
| `appleJam` | Yamkers Apple Jam | `350 55% 32%` (burgundy) |

Asset files (already in `public/`):
- `sauce.png` / `sauce.mp4`
- `favebeans.png` / `favebeans.mp4`
- `favebeanstehina.png` / `favebeanstehina.mp4`
- `chilifavebeans.png` / `chilifavebeans.mp4`
- `mangojar.png` / `mangojar.mp4`
- `applejam.png` / `applejam.mp4`

## Card content

Replaces the card-21 "location / flag / stats" trio.

- Top small label: brand — `Yamkers`
- Big title: product display name
- Bottom themed pill replaces "Explore Now": Play icon + label "Hover to preview" on desktop / "Tap to preview" on touch (a single label `previewLabel` from i18n is fine — keep it short)

## i18n shape

Top-level namespace `ourProducts` in `en.json`, `fr.json`, `ar.json`:

```json
"ourProducts": {
  "eyebrow": "OUR PRODUCTS",
  "heading": "What's in every Yamkers jar",
  "intro": "Six everyday Yamkers favourites — produced in-house to international food-safety standards and ready for Egyptian and global pantries alike.",
  "previewLabel": "Hover to preview",
  "cta": "See All Products",
  "items": {
    "sauce":           { "name": "Yamkers Sauce" },
    "favebeans":       { "name": "Yamkers Fava Beans" },
    "favebeansTehina": { "name": "Yamkers Fava Beans with Tehina" },
    "chiliFavebeans":  { "name": "Yamkers Chili Fava Beans" },
    "mangoJar":        { "name": "Yamkers Mango Jar" },
    "appleJam":        { "name": "Yamkers Apple Jam" }
  }
}
```

Brand label `"Yamkers"` is rendered as a constant in the component (not translated — proper noun) except in Arabic where it should display as `يامكرز`. To keep things simple, we add `"brand"` per item too:

```json
"items": {
  "sauce": { "name": "Yamkers Sauce", "brand": "Yamkers" },
  ...
}
```

In `ar.json` `brand` becomes `"يامكرز"`. (FR uses `"Yamkers"` — proper noun.)

## Animations (match `who-we-are-section.tsx` vocabulary)

- Heading + intro: scroll-triggered fade-up via `useInView` + `containerVariants` / `itemVariants`.
- Grid: stagger-reveal from below (`staggerChildren: 0.08`).
- One soft parallax blob in `bg-primary/5` and one in `bg-secondary/5` behind the grid, with `y` and `rotate` driven by section `scrollYProgress`.
- Card hover: card-21's own scale + glow already covers the micro-interaction; no extra framer needed inside the card.

## Files

| File | Action |
|---|---|
| `src/components/ui/product-card.tsx` | Create — adapted card-21 (renamed, drops `<a>` wrapper, adds `<video>` overlay + hover/in-view logic) |
| `src/components/ui/our-products-section.tsx` | Create — section wrapper (heading, grid, parallax blobs, CTA, animations) |
| `src/app/[locale]/page.tsx` | Modify — mount section after `<WhatWeOfferSection />` |
| `src/i18n/messages/en.json` | Modify — add `ourProducts` namespace |
| `src/i18n/messages/fr.json` | Modify — add `ourProducts` namespace (French) |
| `src/i18n/messages/ar.json` | Modify — add `ourProducts` namespace (Arabic) |

## Tradeoffs / decisions

- **Drop `<a>` wrapper**: no per-product detail page exists. Cards are showcase tiles, navigation lives on the section CTA.
- **`preload="metadata"`**: keeps page weight reasonable (6 videos × ~few MB = significant). Cost: ~100-300 ms lag before first frame plays on initial hover. Acceptable.
- **`themeColor` via inline CSS variable**: keeps a single component handling all 6 cards with different glows. Tailwind v4 supports arbitrary `hsl(var(--theme-color))` references inside utility strings.
- **No carousel / no pagination**: 6 items map cleanly to a 2×3 or 3×2 grid; carousel would add complexity for no benefit.
- **No tests**: this repo has no component-test runner wired up beyond `bun test` (none of the existing sections have unit tests). Typecheck + lint + manual dev-server render is the verification bar.
