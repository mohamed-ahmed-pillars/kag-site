# News Section — Design Spec

**Date:** 2026-06-01
**Status:** Approved (pending implementation)

## Goal

Add a "News" section to the KAG homepage that surfaces the three most recent posts from the existing MDX content pipeline, and rename the existing `/blog` route + content + nav label to "News" end-to-end so the site uses a single consistent term.

## Background

- The site already has a `/blog` route at `src/app/[locale]/blog/{page.tsx,[slug]/page.tsx}` that reads MDX files from `src/content/blog/<locale>/`. Both content folders (`en`, `ar`, `fr`) currently exist but are empty.
- The homepage in `src/app/[locale]/page.tsx` currently composes: Hero → WhoWeAre → WhatWeOffer → OurProducts → PrivateLabel → Export → GlobalReach.
- shadcn `Card`, `Badge`, and `Button` already exist under `src/components/ui/`. Brand tokens (`bg-primary` deep blue, `bg-secondary` lime), local fonts (`font-heading`, `font-sans`), and the project body background (`/bg6.jpg`) are wired in `globals.css`.
- All sections follow a shared framer-motion vocabulary (scroll-triggered reveals, parallax blobs, staggered variants, hover micro-interactions) — see `src/components/ui/who-we-are-section.tsx` and `src/components/ui/about-us-section.tsx`.

## Decisions

- **Section label:** "News" (not "Blog" / "Insights"). Reflects the manufacturer/exporter context — press milestones, certifications, product launches.
- **Route + folder + nav:** renamed in full to "News". URL becomes `/news`, content folder becomes `src/content/news/`, i18n key `nav.blog` → `nav.news`.
- **Data source:** the existing MDX pipeline. The homepage section reuses the same listing logic as the `/news` index page (read frontmatter from `src/content/news/<locale>/*.mdx`, sort by date desc) and slices the top three.
- **Starter content:** three MDX posts scaffolded in all three locales (en/ar/fr) so each locale has a populated section from day one.
- **Out of scope:** styling the `/news` index page (still a bare `<ul>` of slugs after this change), pagination, tags, search.

## Architecture

### File changes

**Rename (`git mv`):**

```
src/app/[locale]/blog/                → src/app/[locale]/news/
src/content/blog/                     → src/content/news/
```

Inside both renamed page files (`news/page.tsx`, `news/[slug]/page.tsx`), update the literal path segment `'blog'` to `'news'` so `fs.readdir` / `import()` resolve against the new folder.

**Edit:**

- `src/i18n/messages/en.json`, `ar.json`, `fr.json`
  - rename `nav.blog` → `nav.news`
  - add new top-level `news` namespace: `{ eyebrow, heading, intro, viewAll, readMore }`
- `src/app/[locale]/news/page.tsx` — refactor to call `listNewsPosts` from `src/lib/news.ts` instead of inlining its own copy of the logic
- `src/components/ui/header.tsx` — four edits: `t("blog")` × 2 → `t("news")` (lines ~154, 243) and `/blog` × 2 → `/news` (lines ~153, 236)
- `src/app/[locale]/page.tsx` — import and render `<NewsSection />` directly after `<GlobalReachSection />`

**Create:**

- `src/lib/news.ts` — shared `listNewsPosts(locale)` helper + `NewsPost` type
- `src/components/ui/news-section.tsx` — the new section (server shell + client subcomponent in one file)
- `src/content/news/en/kag-expands-to-berlin-istanbul.mdx`
- `src/content/news/en/iso-22000-recertification.mdx`
- `src/content/news/en/yamkers-fava-beans-launch.mdx`
- same three slugs under `src/content/news/ar/` and `src/content/news/fr/` (9 files total)

### `NewsSection` component

Split into a thin **server component** (data) and a **client subcomponent** (motion), mirroring how the rest of the homepage sections are structured.

To avoid duplicating the file-system listing logic between `news/page.tsx` and `NewsSection`, the read+parse helper is extracted into a small shared module:

- `src/lib/news.ts` — exports `listNewsPosts(locale: Locale): Promise<NewsPost[]>` and the `NewsPost` type. `news/page.tsx` is refactored to call it; `NewsSection` calls it too.

**Server shell (`news-section.tsx` default export, no `"use client"`):**

- `async function NewsSection({ locale }: { locale: Locale })`
- Calls `await listNewsPosts(locale)`, slices top 3, passes `posts: NewsPost[]` as a prop to the client subcomponent.
- Frontmatter shape (the `NewsPost` type): `{ slug: string; title: string; date: string; excerpt: string; label: string; image: string; author?: string }`.
- Falls back to default-locale posts if the requested locale folder is empty.

**Client motion subcomponent (`"use client"`, defined in the same file and named e.g. `NewsSectionClient`):**

- Receives `posts: NewsPost[]` from the server shell.
- Pulls static copy (eyebrow / heading / intro / CTA / read-more) via `useTranslations("news")` — this is the same pattern as `who-we-are-section.tsx` and the other homepage sections, all of which are `"use client"` and call `useTranslations` directly.

- Uses `useRef`, `useInView`, `useScroll`, `useTransform` exactly as in `who-we-are-section.tsx`.
- Wrapper: `<section id="news" className="relative w-full overflow-hidden px-4 py-24 text-foreground">` — **no `bg-*`** (memory rule).
- Two parallax blob `motion.div`s (one `bg-primary/5`, one `bg-secondary/10`) anchored top-left and bottom-right, driven by `scrollYProgress` transforms — matches the established pattern.
- Heading cluster:
  - Eyebrow row: `<Newspaper className="w-4 h-4" />` + `t("eyebrow")`, color `text-primary`.
  - `<h2 className="font-heading text-4xl md:text-5xl">` containing `t("heading")`.
  - Animated underline: `<motion.div className="w-24 h-1 bg-secondary" initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 1, delay: 0.5 }} />` — lime per memory rule.
  - Intro paragraph `t("intro")` in `text-foreground/80`, centered, max-w-2xl.
- Card grid: `grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8`. Each card is a `motion.div` wrapping `<Card>` with the existing shadcn structure (`Card / CardHeader / CardContent / CardFooter`):
  - 16:9 cover `<img>` linking to `/news/<slug>` (uses `next-intl` `Link` so locale is preserved).
  - `<Badge variant="secondary">` showing `post.label` above the title.
  - Title `<h3 className="font-heading text-lg md:text-xl">` linking to the post.
  - `post.excerpt` in `text-muted-foreground`.
  - "Read more →" footer link (`text-primary`, `hover:underline`) to `/news/<slug>`.
  - Cards animate in via the same `containerVariants` / `itemVariants` stagger used elsewhere; `whileHover={{ y: -5, transition: { duration: 0.2 } }}`.
- CTA below the grid: `<FlowButton text={t("viewAll")} />` wrapping a `next-intl` `Link` to `/news` (memory rule: FlowButton is the default primary CTA). Centered.

### Starter post content

All three posts use existing assets from `/public/` (memory rule: no stock images). English titles/excerpts below; Arabic and French are full translations.

| slug | label | image | date |
|---|---|---|---|
| `kag-expands-to-berlin-istanbul` | Export | `/exportstrip.jpg` | 2026-05-20 |
| `iso-22000-recertification` | Quality | `/certifications/iso-22000.avif` | 2026-04-10 |
| `yamkers-fava-beans-launch` | Product | `/favebeans.png` | 2026-03-02 |

Each MDX file has frontmatter (`title, date, excerpt, label, image, author`) plus two short body paragraphs and a closing line. Content is editorial-quality placeholder — believable for KAG but ready to be rewritten.

### i18n keys (added to all three locale JSONs)

```jsonc
"nav": {
  "news": "News" // was nav.blog
  // ...
},
"news": {
  "eyebrow": "FROM OUR NEWSROOM",
  "heading": "Latest News",
  "intro": "Milestones, certifications, and product launches from across KAG's manufacturing, private-label, and export operations.",
  "viewAll": "View all news",
  "readMore": "Read more"
}
```

Arabic and French use locale-appropriate translations (not transliteration).

## Testing / verification

- `pnpm dev` (or whichever script is wired) and visit `/en`, `/ar`, `/fr`. Confirm the News section renders the three cards in the correct order, the underline is lime, hover micro-interactions fire, and the section has no background of its own (the body's `/bg6.jpg` shows through).
- Click a card → lands on `/news/<slug>` and the MDX body renders.
- Click "View all news" → lands on `/news` (still the bare list — expected, out of scope).
- Click the "News" nav entry → also lands on `/news`.
- Confirm no console errors and no broken `/blog/*` links remain (`grep -ri "/blog" src/` should return zero matches after the rename).

## Risks / notes

- The `/blog` rename is a URL change. Since the route is essentially unused (empty content folders, bare list page, not in sitemap yet), the risk of broken external links is minimal. No redirect needed for now.
- `import('@/content/news/<locale>/<slug>.mdx')` inside `[slug]/page.tsx` uses Next.js's MDX loader, which must already be configured in `next.config.*` for the existing `/blog` route to compile — the rename inherits that configuration unchanged.
- Frontmatter is read with `gray-matter` (already a dependency, per the existing `news/page.tsx`).
