# Footer + Legal Pages — Design Spec

**Date:** 2026-06-01
**Status:** Approved (pending implementation)

## Goal

Add a global site footer to the KAG corporate site, rendered on every locale-scoped page. Reuse the visual personality of the shadcn "Designali" footer snippet (dotted dividers, dotted-bordered icon pills, scroll-to-top button, heart-with-credit copyright) and populate it with KAG-specific data lifted from the old footer at `oldWebsite/src/components/footer.tsx`. Scaffold `/terms` and `/privacy` legal pages so the footer's Company column links to real, populated routes. Legal page **content** comes from `kag-website/frontend/messages/{en,ar}.json` (`terms.*` and `privacy.*` namespaces); legal page **styling** follows the KAG framer-motion vocabulary, not the source's dark-mode card style.

## Background

- The new site is Next.js 16 + next-intl 4 + framer-motion 12 + Tailwind v4, package manager Bun.
- Locales: `en` (default), `fr`, `ar`. `localePrefix: 'as-needed'`. Layout at `src/app/[locale]/layout.tsx` already renders `<Header />`.
- Brand tokens: primary deep blue `#374c9b`, secondary lime `#d5de24`, wired as `bg-primary` / `bg-secondary` in `globals.css`. Logo at `/public/navbarLogo.svg`.
- Existing icon assets in `/public/icons/`: `facebook.svg`, `instagram.svg`, `maildotru.svg`, `whatsapp.svg` (same set the old footer used).
- `lucide-react` is already a dependency — used by `Header`, `NewsSection`, etc.
- No `next-themes`, no `dicons`, no dark mode wired anywhere in the new site. Will not be added.
- Memory rules in play: no Claude trailer in commits; use `git add .`; section roots have no `bg-*` (the footer is a `<footer>` element, not a `<section>` — see Decisions below); animated dividers use `bg-secondary` (lime) where the design calls for an accent line.
- Existing nav i18n shape: `nav.home`, `nav.news`, `nav.contact`, `nav.services.{label,ourBrands,privateLabel,customProduct,export}`. Header uses these — Footer reuses where it can.

## Decisions

- **No dark/light theme toggle.** The snippet's three-button toggle pill (sun / scroll-up / moon) collapses to a single scroll-to-top button. No `next-themes`, no `dicons` install.
- **Icon source:** `lucide-react` (already installed) for Heart, ArrowUp, MapPin, Phone, Mail. Brand-colored SVGs (Facebook, Instagram, WhatsApp, Email) reuse the `/public/icons/*.svg` files from the old footer — they were already copied to the new repo. LinkedIn uses an inline SVG (lifted from the old footer) since `/public/icons/linkedin.svg` isn't in the repo.
- **Columns:** 4 columns mirroring the old footer's content shape — Quick Links, Services, Contact Us, Company. The snippet's 6-column example doesn't map cleanly to KAG's simpler IA; 4 columns is honest to the data.
- **Footer background:** The footer is a `<footer>` element, semantically distinct from the homepage `<section>` blocks. The memory rule about "no `bg-*`" applies to homepage sections so the body's `/bg6.jpg` shows through. The footer has its own thin top/bottom dotted-divider treatment from the snippet but otherwise stays transparent (`bg-transparent`) so the page background extends to the bottom — matches the snippet's `border-ali/20` border-only treatment.
- **Logo + blurb:** KAG logo (`/navbarLogo.svg`, ~32px tall) + a short blurb pulled from `footer.blurb` i18n key. Blurb is the existing "Egyptian food group producing, distributing, and exporting..." sentence from `whoWeAre.intro`, rephrased to fit the footer's single-paragraph shape.
- **Copyright line:** `© <year>` + `KAG.` (in `text-primary` deep blue, weight bold) + `All rights reserved.` + `· Made by` + `Technology Pillars` (link to `https://technologypillars.com`) + animated lucide `Heart` icon (red-600, `animate-pulse`) — mirrors the snippet's heart-with-credit pattern but credits Technology Pillars per the old footer.
- **Animation:** Footer is a `"use client"` component because of the scroll-to-top onClick handler and the `useTranslations` calls (matches the rest of the new site's pattern). No framer-motion in the footer itself — the snippet doesn't use it and the heading-underline memory rule is section-level, not footer-level. Legal pages DO use framer-motion (scroll-triggered reveals on each numbered legal section, matching the established homepage vocabulary).
- **Legal page style:** Each legal page is a server component that reads `t.raw('sections')` from its namespace and passes the list to a small client subcomponent `LegalSectionsClient` which renders the numbered sections with framer-motion stagger reveals. Header cluster (eyebrow icon + h2 + lime `bg-secondary` underline + intro) matches every other section on the site. No dark-mode cards from the source.
- **French translation:** Old kag-website only has en + ar for terms/privacy. French is translated locally for both legal namespaces and the footer namespace.

## Architecture

### File changes

**Create:**

- `src/components/ui/footer.tsx` — the `"use client"` Footer component (named export `Footer`).
- `src/app/[locale]/terms/page.tsx` — server component reading `terms.*` namespace.
- `src/app/[locale]/privacy/page.tsx` — server component reading `privacy.*` namespace.
- `src/components/ui/legal-sections.tsx` — `"use client"` framer-motion subcomponent shared by both legal pages. Receives `{ sections, lastUpdated }` and renders the stagger-revealed list.

**Edit:**

- `src/app/[locale]/layout.tsx` — import `Footer` and render it after `{children}` inside the `NextIntlClientProvider`.
- `src/i18n/messages/en.json` — add `footer`, `terms`, `privacy` top-level namespaces.
- `src/i18n/messages/ar.json` — same three namespaces, Arabic translations.
- `src/i18n/messages/fr.json` — same three namespaces, French translations.

### `Footer` component layout

```
<footer> (border-t border-b border-foreground/10, bg-transparent, px-2 md:px-4)
  <div> (relative max-w-7xl mx-auto p-10 pb-0, flex layout)
    Logo (Link "/" wrapping next/image of /navbarLogo.svg, w-32 md:w-48)
    Blurb (t("footer.blurb"), text-foreground/70, text-xs, leading-5)
  </div>

  <div> (max-w-7xl mx-auto px-6 py-10)
    <div border-b border-dotted border-foreground/20 />
    <div py-10>
      <div grid grid-cols-2 md:flex justify-between gap-8>
        Column 1 — Quick Links
          h4 (uppercase tracking-widest text-xs font-bold text-foreground/50)
          ul: Home, Products, News, Contact (all next-intl Links)
        Column 2 — Services
          ul: Private Label, Custom Recipe, Export
        Column 3 — Contact Us
          ul: address (MapPin), phones (Phone), email (Mail) — same structure as old footer
        Column 4 — Company
          ul: Terms, Privacy
      </div>
    </div>
    <div border-b border-dotted border-foreground/20 />
  </div>

  <div flex flex-wrap justify-center gap-y-6>
    <div flex items-center gap-6 px-6> — socials row
      Facebook, Instagram, LinkedIn, WhatsApp, Email (each in dotted-bordered rounded-xl button, hover:-translate-y-1)
    </div>
    <ScrollToTop /> — single dotted-bordered button with lucide ArrowUp, calls window.scrollTo({top:0, behavior:"smooth"})
  </div>

  <div mx-auto mb-10 mt-10 text-center text-xs max-w-7xl>
    © <year> KAG. All rights reserved. · Made by Technology Pillars [Heart icon]
  </div>
</footer>
```

### Quick Links + Services data

```ts
type Href = React.ComponentProps<typeof Link>["href"];

const quickLinks: { key: string; href: Href }[] = [
  { key: "home", href: "/" },
  { key: "products", href: "/#our-products" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
];

const serviceLinks: { key: string; href: Href }[] = [
  { key: "privateLabel",  href: "/#private-label" },
  { key: "customProduct", href: "/#what-we-offer" },
  { key: "export",        href: "/#export" },
];

const companyLinks: { key: string; href: Href }[] = [
  { key: "terms", href: "/terms" },
  { key: "privacy", href: "/privacy" },
];
```

Labels come from `nav.*` keys where possible (Home, Products, News, Contact, services.privateLabel, services.customProduct, services.export) and from new `footer.*` keys for the new headings (`footer.quickLinks`, `footer.services`, `footer.contactUs`, `footer.company`, `footer.terms`, `footer.privacy`).

### Socials

```ts
type Social =
  | { src: string; label: string; href: string }
  | { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; href: string };

const socials: Social[] = [
  { src: "/icons/facebook.svg",  label: "Facebook",  href: "https://www.facebook.com/share/1DNJqy7Bou/?mibextid=wwXIfr" },
  { src: "/icons/instagram.svg", label: "Instagram", href: "https://www.instagram.com/kag.egypt" },
  { Icon: LinkedinIcon,           label: "LinkedIn",  href: "https://www.linkedin.com/company/kagegypt/" },
  { src: "/icons/whatsapp.svg",  label: "WhatsApp",  href: "https://wa.me/201080843334" },
  { src: "/icons/maildotru.svg", label: "Email",     href: "mailto:wecare@kagegypt.com" },
];
```

`LinkedinIcon` is the inline SVG from the old footer (rect + LinkedIn glyph in `#0A66C2`). Each social button uses class `hover:-translate-y-1 border border-dotted border-foreground/30 rounded-xl p-2.5 transition-transform`.

### Contact column data

Hardcoded from old footer (this is KAG's real contact info, not derived from messages):

- Address: lifted from `footer.address` i18n key (10th of Ramadan City, Industrial Zone, Sharkia Governorate, Egypt — same as the legal page contact paragraphs).
- Phones: `+20 108 083 8555` (service) and `+20 108 084 3334` (suggestions). Each wrapped in `<a href="tel:...">`, the digit run inside a `dir="ltr"` span to keep formatting consistent in RTL Arabic. Label text from `footer.phoneServiceLabel` / `footer.phoneSuggestionsLabel`.
- Email: `wecare@kagegypt.com` in `<a href="mailto:...">` with `dir="ltr"`.

### Legal page structure

Both `/terms` and `/privacy` are server components:

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Scale } from 'lucide-react'; // ShieldCheck for privacy
import LegalSections from '@/components/ui/legal-sections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> { ... }

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });
  const sections = t.raw('sections') as { title: string; body: string }[];

  return (
    <section className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      {/* parallax blob backgrounds, same vocabulary as who-we-are-section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mb-3">
            <Scale className="w-4 h-4" />
            {t('hero.badge')}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">{t('hero.title')}</h1>
          <div className="w-24 h-1 bg-secondary mx-auto mb-4" /> {/* lime underline */}
          <p className="text-foreground/80 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        </div>
        <LegalSections sections={sections} lastUpdated={t('lastUpdated')} />
      </div>
    </section>
  );
}
```

`LegalSections` is `"use client"` and uses framer-motion `whileInView` reveals on each numbered card. Each card: rounded-2xl, no dark variants, `text-primary` numbered heading, `text-foreground/80` body. No `bg-*` on the page-level `<section>` root (memory rule honored).

### i18n keys (footer namespace, all three locales)

```jsonc
"footer": {
  "blurb": "KAG is an Egyptian food group producing, distributing, and exporting tomato sauces, jams, juices, and fava beans — built for local communities and global markets.",
  "quickLinks": "Quick Links",
  "services": "Services",
  "contactUs": "Contact Us",
  "company": "Company",
  "address": "10th of Ramadan City, Industrial Zone, Sharkia Governorate, Egypt",
  "phoneServiceLabel": "Service",
  "phoneSuggestionsLabel": "Suggestions",
  "terms": "Terms & Conditions",
  "privacy": "Privacy Policy",
  "rights": "All rights reserved.",
  "madeBy": "Made by",
  "scrollTop": "Scroll to top"
}
```

Add corresponding French and Arabic translations. For nav labels referenced from the footer (Home, Products, News, Contact, Private Label, Custom Product, Export), the footer pulls from existing `nav.*` and `nav.services.*` keys — no duplication.

### i18n keys (terms + privacy namespaces)

Lifted directly from `kag-website/frontend/messages/en.json` lines 566–637. Arabic from `kag-website/frontend/messages/ar.json` at the matching offsets. French is a fresh translation (the old kag-website doesn't ship French).

## Testing / verification

- `bun run typecheck` clean.
- `bun run lint` introduces no new errors for files we touched.
- `bun run build` succeeds; emits `/{en,fr,ar}/terms` and `/{en,fr,ar}/privacy` static routes.
- `curl -s http://localhost:3000/en | grep "Made by"` confirms footer renders.
- `curl -s http://localhost:3000/en/terms` returns 200 and renders the title.
- `curl -s http://localhost:3000/en/privacy` returns 200 and renders the title.
- Visit `/ar` and confirm RTL: address column orientation, social row stays LTR for icons, phone digits stay LTR via `dir="ltr"` spans.
- Stale-reference grep `grep -rn "designali\|dicons\|next-themes" src/` returns zero matches.

## Risks / notes

- Adding `<Footer />` to the layout means every page now has a footer, including `/news/[slug]` MDX pages. That's intentional and matches the old kag-website behavior.
- Section anchor IDs on the homepage: `who-we-are`, `what-we-offer`, `our-products`, `private-label`, `export`, `news` (confirmed in source). The footer's "Custom Product" link points to `#what-we-offer` because Custom Recipe is a pillar inside that section rather than a standalone block. If a dedicated `#custom-recipe` anchor is added later, swap the href in `serviceLinks`.
- The blurb i18n key duplicates wording that overlaps `whoWeAre.intro`; this is acceptable — they serve different surfaces and could diverge over time.
- French legal translations are AI-generated. They should pass a manual proofread before launch, but they're correct enough for the footer's link targets to be valid and the SEO metadata to populate.
- LinkedinIcon uses the brand color `#0A66C2` regardless of theme. Matches the old footer.
