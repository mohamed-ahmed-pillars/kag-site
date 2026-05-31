# Who We Are — Section Design

**Date:** 2026-05-31
**Author:** Mohammed (decisions) + Claude (drafting)
**Target:** New section on the home page (`src/app/[locale]/page.tsx`) introducing KAG as a food group.

## Goal

Introduce KAG to first-time visitors with a section that answers "who are these people, and what do they do?" in one screenful + scroll. The section should:

- Surface KAG's six business pillars (Manufacturing, Private Labeling, Custom Recipe, Distribution & Trading, Export, Quality & Food Safety).
- Communicate the brand's tone of voice — **Quality, Innovation, Growth** — as a real visual element, not just naming the words.
- Demonstrate credibility via the six international certifications KAG operates under (ISO 22000, Halal, FDA, GMP, BRC, ISO 45001).
- End with a clear call-to-action that funnels qualified B2B traffic into `/contact`.
- Visually echo the existing `about-us-section.tsx` so the page reads as one cohesive composition.

## Source content (vision + mission)

- **Vision:** Become a leading Egyptian food group producing and trading high-quality food that meets international standards; be a trusted partner in local and global markets.
- **Mission:** Deliver trusted food products (sauces, juices, jams) combining quality, freshness, and consistency; serve both local communities and global markets through innovation and responsibility.
- **Tone of voice:** Quality. Innovation. Growth.

These three documents seed all copy.

## Style anchor

The section mirrors the vocabulary of `src/components/ui/about-us-section.tsx`:

- `useInView` + `framer-motion` scroll-triggered reveals
- Parallax background blobs (`useScroll` + `useTransform`)
- `containerVariants` / `itemVariants` with `staggerChildren`
- Hover micro-interactions on pillar cards (icon rotate, card lift)
- Per-brand-memory rule: never reuse the reference's `#88734C` / `#A9BBC8` / `#202e44` hex values — go through Tailwind brand tokens (`bg-primary`, `bg-secondary`, `text-foreground`, etc.) so the section honors the KAG palette (`--primary: #374c9b`, `--secondary: #d5de24`).

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [eyebrow: Sparkles + "OUR STORY"]                           │
│  <h2 font-display>  Who We Are                               │
│  ──── (animated 96px underline in bg-secondary)              │
│                                                              │
│  <p> intro paragraph distilled from vision+mission           │
│      — ends with the three tone-of-voice words.              │
│                                                              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐      │
│  │ Manufactur. │    │ framed video │    │ Distribut.  │      │
│  │ Priv. Label │    │ mangojar.mp4 │    │ Export      │      │
│  │ Custom Rec. │    │ (placeholder)│    │ Quality &   │      │
│  │             │    │ no overlay   │    │ Food Safety │      │
│  └─────────────┘    └──────────────┘    └─────────────┘      │
│         3 left pillars     center        3 right pillars     │
│                                                              │
│  "Backed by international standards"                         │
│  ◄═══ [iso22000][halal][fda][gmp][brc][iso45001] ═══►        │
│  auto-scrolling marquee, infinite loop, edge fade            │
│                                                              │
│  ┌─────────┐    ┌─────────────┐    ┌─────────┐               │
│  │ QUALITY │    │  INNOVATION │    │  GROWTH │               │
│  └─────────┘    └─────────────┘    └─────────┘               │
│           three tone-of-voice value cards                    │
│                                                              │
│  ╔══════════════════════════════════════════════════╗        │
│  ║ bg-primary CTA banner                            ║        │
│  ║ "Ready to bring KAG quality to your shelves?"    ║        │
│  ║                                  [FlowButton →]  ║        │
│  ║                                  /contact        ║        │
│  ╚══════════════════════════════════════════════════╝        │
└──────────────────────────────────────────────────────────────┘
```

## Components & files

- **New:** `src/components/ui/who-we-are-section.tsx` (client component — `"use client"` required for framer-motion + `<video>` autoplay handling).
- **Modified:** `src/app/[locale]/page.tsx` — import and render `<WhoWeAreSection />` directly below `<HeroSection />` inside `<main>`.
- **Modified:** `src/app/globals.css` — add `@keyframes marquee` and a `.animate-marquee` utility class for the certifications strip.
- **Modified:** `src/i18n/messages/en.json` — add a `whoWeAre` namespace with all section copy.
- **Modified:** `src/i18n/messages/fr.json` / `src/i18n/messages/ar.json` — same key shape, English copy seeded as a placeholder (per Q5 = option A) so the site doesn't crash on fr/ar locales; Mohammed translates later.
- **No new packages.** Uses `framer-motion`, `lucide-react`, `next-intl`, `next/image` — all already installed.

## Pillar definitions

Each pillar card uses a brand pattern icon from `public/pattern/` (per `project_pattern_icons.md`) instead of lucide-react.

| # | Pillar | Pattern icon | One-line description (seed copy) |
| --- | --- | --- | --- |
| 1 | Manufacturing | `manufacturing-lime.png` | Tomato sauces, jams, juices, fava beans — produced in-house to international food-safety standards. |
| 2 | Private Labeling | `private-label-lime.png` | We manufacture under your brand, with consistent quality at the volumes retail demands. |
| 3 | Custom Recipe | `wheat-lime.png` | Bring us a flavor profile or a target market — we develop the recipe, sample it, and scale it. |
| 4 | Distribution & Trading | `distribution-truck-lime.png` | A trade network that moves food goods reliably across Egypt and into regional markets. |
| 5 | Export | `export-globe-lime.png` | KAG products on shelves abroad — partnering with importers who value Egyptian origin and consistent supply. |
| 6 | Quality & Food Safety | `kag-monogram-lime.png` | Every batch passes through documented quality controls so what leaves our factory matches the spec. |

Layout: pillars 1–3 left of the video, pillars 4–6 right. Each rendered via a `<PillarItem>` sub-component matching the `ServiceItem` shape in the reference but using `<img>` + the pattern PNG inside a `bg-primary/10 rounded-lg p-3` tile (so the lime icon reads against a soft blue square).

## Center visual

Replace the reference's framed `<img>` with a framed `<video>`:

- `src="/mangojar.mp4"` (placeholder; Mohammed will swap for the real asset)
- `autoPlay muted loop playsInline preload="metadata"` — required for autoplay across browsers
- No CTA / button overlay (Mohammed's explicit constraint)
- Same `rounded-md overflow-hidden shadow-xl` framing as the reference
- Keep the decorative offset border in `bg-secondary` (lime) at `-m-3 z-[-1]`
- Keep the floating dot animations + parallax `useTransform` blobs around the frame (recolor: `bg-primary/10` and `bg-secondary/15`)

## Certifications marquee

**Placement:** Between the pillar grid and the value cards (Q4 = A).

**Technical approach (pure CSS, no JS lib):**

1. Add to `globals.css`:
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
   ```
2. Render the 6 certificate logos **twice** back-to-back in a horizontally-flexed track (so `translateX(-50%)` loops seamlessly).
3. Each logo: `<img src="/certifications/{name}" alt="{name}" className="h-12 md:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition" />`.
4. Track sits inside a `group overflow-hidden` container with `before:` / `after:` pseudo-elements (or two absolutely-positioned `bg-gradient-to-r from-background to-transparent` divs) for left/right edge fades.
5. Short heading above: *"Backed by international standards"* via `useTranslations`.

**Cert files (already in `public/certifications/`):**
- `iso-22000.avif`
- `halal.avif`
- `fda.png`
- `gmp.png`
- `brc.png`
- `iso-45001.avif`

**RTL note:** in Arabic locale (`dir="rtl"`), the marquee should still scroll in the same physical direction (logos pass by); we won't flip the animation direction. CSS `transform` is direction-agnostic.

## Value cards (Quality / Innovation / Growth)

**Replaces the reference's 4 numeric stat counters** (Q3 = C — turn the brand's tone-of-voice triplet into a real visual element rather than fabricating placeholder stats).

Layout: 3-column grid (`grid-cols-1 sm:grid-cols-3`), `gap-8`, below the marquee.

| Card | Lucide icon | Headline | Sub-copy seed |
| --- | --- | --- | --- |
| Quality | `Award` | **Quality** | Tomato sauces, jams, and juices crafted to international food-safety standards — every batch, every market. |
| Innovation | `Sparkles` | **Innovation** | New recipes, new packaging, new partnerships — we evolve what KAG puts on the shelf so it stays relevant. |
| Growth | `TrendingUp` | **Growth** | Built in Egypt for the world: we grow KAG, our private-label partners, and the trade networks that carry our food. |

Each card: `bg-white/50 backdrop-blur-sm rounded-xl p-6`, hover-lift `whileHover={{ y: -5 }}`, animated underline `w-10 → w-16` in `bg-secondary` on hover (mirrors `StatCounter` underline behavior).

(Note: these three use **lucide icons** intentionally — there are no matching pattern icons for abstract values like "Innovation". The pattern-icons memory rule explicitly allows lucide as the fallback when no semantic match exists.)

## CTA banner

Replaces the reference's `bg-[#202e44]` panel with brand-primary blue.

- Wrapper: `bg-primary text-primary-foreground rounded-xl p-8 mt-20 flex flex-col md:flex-row items-center justify-between gap-6`
- Left: `<h3 font-heading>` *"Ready to bring KAG quality to your shelves?"* + sub `<p>` *"Talk to our team about manufacturing, private-label, custom recipes, or export."*
- Right: `<FlowButton href="/contact" text={t("cta.button")} />` — per project memory, the default CTA button.
- Enters via `useInView`-gated `opacity/y` reveal when the value-cards row is in view.

## Background decoration

Per the section-animation-style memory:

- Two large blurred blobs absolutely positioned in the section root:
  - top-left: `w-64 h-64 rounded-full bg-primary/5 blur-3xl` + parallax `y/rotate`
  - bottom-right: `w-80 h-80 rounded-full bg-secondary/5 blur-3xl` + parallax (opposite direction)
- Two small floating dots:
  - `bg-primary/30` left of center, infinite `y: [0,-15,0], opacity: [0.5,1,0.5]`, `duration: 3`
  - `bg-secondary/30` right of center, infinite `y: [0,20,0]`, `duration: 4`, `delay: 1`
- Optional (post-MVP): apply `/public/pattern/full-pattern-tile.png` as a `background-image` watermark at ~5% opacity on the section root. Will evaluate at implementation time — may be visual noise on top of the blobs. Skip for v1, add if section feels empty.

## i18n keys (en.json)

```json
{
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
}
```

`fr.json` and `ar.json` get the same key tree, seeded with the English copy verbatim (placeholders for Mohammed to translate later).

## Data flow

Section is a single self-contained client component:

- Pure presentational — no fetching, no props.
- All copy via `useTranslations("whoWeAre")`.
- Static arrays defined in-file (`pillars`, `certifications`, `values`).
- No server state, no client state beyond framer-motion's internal scroll/in-view hooks.

## Accessibility

- Section has `id="who-we-are"` so the navbar can deep-link to it.
- `<h2>` for "Who We Are"; pillar/value/CTA headings are `<h3>`.
- Cert logos have meaningful `alt` (`alt="ISO 22000"`, `alt="Halal"`, etc.) so screen readers announce the credibility list.
- Marquee gets `aria-label="International certifications"` on its container and `aria-hidden="true"` on the duplicated track so SR doesn't read each logo twice.
- Video has no captions / audio — `aria-hidden="true"` is appropriate (it's decorative).
- Respect `prefers-reduced-motion`: framer-motion already respects it for most variants; for the CSS marquee, add a media query in `globals.css` that pauses the animation under reduced-motion preference.

## Error / edge-case handling

This is a static presentational section — no runtime errors to handle beyond:

- **Missing video file** (`/mangojar.mp4` removed) → the `<video>` element renders an empty frame. Acceptable for a placeholder phase; we'll add a `poster` attribute (e.g. `/yam.png`) so something always shows.
- **Missing certification logos** → broken images; acceptable trade-off (no fallback graphic), since the files exist and are committed.
- **Missing translation keys on fr/ar** → would surface as `next-intl` runtime errors. Mitigated by seeding fr/ar with the English copy from day one.

## Testing approach

- **Manual UI verification** (per global instructions: "for UI or frontend changes, start the dev server and use the feature in a browser before reporting the task as complete"):
  - Load `/en`, `/fr`, `/ar` — confirm section renders, video plays, marquee scrolls, hover micro-interactions fire.
  - Resize to mobile breakpoint — confirm pillars stack into a single column, video moves above, marquee still scrolls, CTA wraps to vertical.
  - Toggle dark mode (if applicable; check `globals.css` for `.dark` variants) — confirm value cards and marquee fades still read.
  - On `/ar`, confirm RTL layout doesn't break the marquee direction or the framed video offset.
- **Static analysis:** `bun x tsc --noEmit` after each batch of edits, fix any type errors before continuing.
- **No unit tests** — pure presentational components don't warrant them; if logic emerges later we revisit.

## Out of scope (deferred)

- Real numeric stats (years in business, products in range, export countries) — Mohammed will provide once finalized; if added, they go in a *separate* small section, not inside Who We Are.
- French / Arabic *real* translations — placeholders for now.
- Real Manufacturing video — placeholder `mangojar.mp4` for now.
- Pattern-tile background watermark — evaluate at implementation, may skip for v1.
- Linking pillar cards to dedicated service pages — pillars are descriptive only in this section; the navbar's Services dropdown already routes to `/services/*` for deep-dives.

## Decisions recorded

| Q | Decision | Rationale |
| --- | --- | --- |
| Q1 — Pillar count | **6** (added Distribution & Trading + Quality & Food Safety to the user's original 4) | Symmetric 3/3 grid matches the reference; both additions are honestly grounded in the vision/mission text. |
| Q2 — Middle visual | **Looping muted video** `mangojar.mp4` (placeholder) | Food brand reads more alive with motion than with a still; user will swap for a real video later. |
| Q3 — Stats vs values | **Value cards** (Quality / Innovation / Growth) replacing the reference's stat counters | Real brand content beats placeholder numbers. |
| Q4 — Marquee placement | **Between pillars and value cards** | Natural break between "what we do" and "what we stand for"; marquee is operational credibility, not philosophy. |
| Q5 — i18n strategy | **Wire `useTranslations` now, English-only copy**, seed fr/ar with English placeholders | Structure in place from day one without blocking on translation; site doesn't crash on fr/ar. |
| Q6 — CTA banner | **Keep, brand-primary blue, single FlowButton → /contact** | Strong end-of-section attention, on-brand color, matches the "default CTA is FlowButton" memory. |
| Pattern icons | Use `public/pattern/*` for the 6 pillar cards; lucide for the 3 value cards | Per `project_pattern_icons.md`: pattern icons preferred when a semantic match exists. Abstract values have no pattern match → lucide fallback is allowed. |

## Implementation handoff

Next step: invoke the `superpowers:writing-plans` skill to produce a step-by-step implementation plan from this design.
