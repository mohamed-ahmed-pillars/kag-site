# Products / Our Brands Page — Design Spec

**Date:** 2026-06-01
**Owner:** Mohammed (KAG)
**Status:** Approved — ready for plan

---

## Goal

Build the public products catalog at `/products` and surface it as the **Our Brands** top-level navbar entry. Each Yamkers SKU is a hover-reveal card showing specs, packaging, and a short description. Tabs filter by category. The page opens with a full-bleed video hero cycling product b-roll behind a 60% black mask.

## Decisions Locked

| # | Decision | Choice |
|---|---|---|
| 1 | Tabs | All / Tomato Paste / Fava Beans / Beans & Peas / Canned Vegetables / Jams / Juices |
| 2 | Card granularity | One card per SKU (48 cards) |
| 3 | Hover content | Specs chips + packaging chips + short description |
| 4 | Navbar | Top-level `Our Brands` (removed from Services dropdown) → `/products` |
| 5 | Brand scope | Brand chip on every card; architecture brand-aware (Yamkers today, Tasbeka later) |
| 6 | Hero pool | 8 product-flavored mp4s, 60% black mask, key/onEnded cycle pattern |
| 7 | Missing images | Neutral placeholder (faded `navbarLogo.svg` on `bg6.jpg`-tinted card) |
| 8 | Data home | Single typed TS module `src/lib/data/products.ts` (no runtime Excel) |
| 9 | Card layout | Responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, 4:5 aspect |

---

## Architecture

### Route

`/products` — replaces the current stub at `src/app/[locale]/products/page.tsx`. Server component.

### Files

**Add:**

- `src/components/ui/reveal-on-hover.tsx` — pasted verbatim from the user-supplied snippet.
- `src/lib/data/products.ts` — typed `Product[]`.
- `src/components/ui/products-hero.tsx` — client, video cycle + scroll parallax + 60% mask.
- `src/components/ui/products-tabs.tsx` — client, owns `activeCategory` state, renders tab strip + grid.
- `src/components/ui/product-card.tsx` — pure presentational card built on `<CardHoverReveal>`.

**Modify:**

- `src/app/[locale]/products/page.tsx` — async server component using `setRequestLocale` + `getTranslations`.
- `src/components/ui/header.tsx` — remove `ourBrands` from `serviceItems`; add top-level `<Link href="/products">` (desktop) + mobile mirror.
- `src/i18n/messages/en.json`, `ar.json`, `fr.json` — move `nav.services.ourBrands` → `nav.ourBrands`; add `products` namespace.

**Untouched:**

- `src/components/ui/footer.tsx` — no Our Brands link present.
- `src/components/ui/what-we-offer-section.tsx` — internal `ourBrands` pillar refers to a homepage content block, not the nav route.
- `src/i18n/routing.ts` — current setup auto-discovers `/products`.

### Server/Client split

- Page = server component (SEO, locale handling, RSC streaming).
- Hero = client (video state, `useScroll` parallax).
- Tabs/Grid = client (filter state, `AnimatePresence`).
- ProductCard = client (the reveal-on-hover provider needs `useState`).

### Data flow

1. Excel parsed **offline** by the developer into typed objects, committed to `products.ts`. No xlsx runtime dependency.
2. Page renders `<ProductsHero />` then `<ProductsTabs products={products} t={...} />`.
3. Tabs filter `products` by category; grid uses `framer-motion` `layout` + `AnimatePresence` for filter transitions.
4. Each `ProductCard` resolves its image via the `image` field; if `null`, renders placeholder.

---

## Data model

```ts
// src/lib/data/products.ts

export type ProductCategory =
  | "tomato_paste"
  | "fava_beans"
  | "beans_peas"
  | "canned_vegetables"
  | "jams"
  | "juices";

export type ProductBrand = "yamkers" | "tasbeka";

export interface Product {
  id: number;
  slug: string;
  brand: ProductBrand;
  category: ProductCategory;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string | null;            // public path, e.g. "/Products/400 g.png"
  specs: {
    netWeight: string;             // e.g. "400 g"
    netWeightAr: string;           // e.g. "400 جرام"
    drainedWeight?: string;        // e.g. "260 g"
    drainedWeightAr?: string;
    concentration?: string;        // e.g. "28–30 %"
  };
  packaging: {
    type: "tin" | "glass_jar" | "plastic_cup" | "sachet" | "tetra_pak";
    unitsPerCarton: number;
    shipping: "carton" | "shrink_wrap";
  };
}

export const products: Product[] = [/* see catalog below */];
```

Packaging `type` and `shipping` are enums; the UI maps them to localized labels through the `products` i18n namespace so we don't repeat strings 47 times in the data file.

---

## Image resolution

For each SKU, resolve `image` in this order:

1. Excel col K named a file → `/Products/<K>.png` (e.g. `400 g`, `Tin Can-Plain copy`).
2. No col K but a name-match exists in `/public/Products/` (e.g. row "Apricot jam 360 g" → `/Products/Apricot Jam 3d copy.png`).
3. Neither → `image: null` → placeholder.

Pre-scan summary: 15 col-K hits, 22 name-matches, 11 placeholders — specifically: 4200 g tomato paste, white beans + sauce variant, red beans, green peas + sauce variant, sweet corn, chickpeas + tahini variant, green okra, and orange jam 360 g.

---

## Catalog (final)

48 SKUs total. Below is the complete list with descriptions to be written into `products.ts`. IDs are stable; the spec is the source of truth for the seed data.

### Tomato Paste (`tomato_paste`)

1. **Tomato Paste 400 g tin (28–30 %)** — image `/Products/400 g.png` — *EN:* "Rich 28–30 % tomato paste in a 400 g tin — base for sauces, soups, and stews." *AR:* "صلصة طماطم 400 جرام بتركيز 28-30٪ — أساس للصلصات والشوربات والطواجن."
2. **Tomato Paste 800 g tin (28–30 %)** — image `/Products/800g.png` — *EN:* "Family-size 800 g tin of 28–30 % concentrated tomato paste." *AR:* "عبوة عائلية 800 جرام بتركيز 28-30٪."
3. **Tomato Paste 2800 g tin (20–22 %)** — image `/Products/2800 g.png` — *EN:* "Catering-size 2.8 kg tin, 20–22 % concentration." *AR:* "حجم مطاعم 2.8 كجم بتركيز 20-22٪."
4. **Tomato Paste 4200 g tin (28–30 %)** — image *placeholder* — *EN:* "Wholesale 4.2 kg tin of 28–30 % tomato paste for HORECA use." *AR:* "حجم جملة 4.2 كجم بتركيز 28-30٪ للفنادق والمطاعم."
5. **Tomato Paste 360 g glass jar (22–24 %)** — image `/Products/jar.png` — *EN:* "Tomato paste in a reclosable 360 g glass jar, 22–24 % concentration." *AR:* "صلصة طماطم في برطمان زجاج 360 جرام بتركيز 22-24٪."
6. **Tomato Paste 120 g tin (28–30 %)** — image `/Products/120 g.png` — *EN:* "Single-meal 120 g tin of 28–30 % tomato paste." *AR:* "علبة 120 جرام لوجبة واحدة بتركيز 28-30٪."
7. **Tomato Paste 60 g tin (28–30 %)** — image `/Products/Yam tomato paste 60g.png` — *EN:* "Compact 60 g tin — perfect for single recipes or lunchboxes." *AR:* "علبة صغيرة 60 جرام مناسبة لوصفة واحدة."
8. **Tomato Paste 50 g sachet (28–30 %)** — image `/Products/sachet.png` — *EN:* "50 g tear-open sachet, 28–30 % paste — pantry- and travel-friendly." *AR:* "ظرف 50 جرام بتركيز 28-30٪ مناسب للسفر."
9. **Tomato Paste 70 g sachet (28–30 %)** — image `/Products/sachet.png` (shared) — *EN:* "70 g tear-open sachet of 28–30 % tomato paste." *AR:* "ظرف 70 جرام بتركيز 28-30٪."

### Fava Beans (`fava_beans`)

10. **Fava Beans Plain — 3 kg tin** — `/Products/3 kg.png` — *EN:* "Yamkers fava beans, plain, in a 3 kg foodservice tin (1.95 kg drained)." *AR:* "فول مدمس سادة 3 كجم (المصفى 1.95 كجم)."
11. **Fava Beans Plain — 400 g tin** — `/Products/Tin Can-Plain copy.png` — *EN:* "Classic plain fava beans, 400 g tin (260 g drained) — ready to heat and serve." *AR:* "فول مدمس سادة 400 جرام (المصفى 260 جرام)."
12. **Fava Beans with Hot Chili — 400 g tin** — `/Products/Tin Can-Hot Chili copy - Copy.png` — *EN:* "Fava beans simmered with red hot chili, 400 g tin (260 g drained)." *AR:* "فول مدمس بالشطة الحمراء 400 جرام (المصفى 260 جرام)."
13. **Fava Beans with Tahini — 400 g tin** — `/Products/Tin Can-Tahini copy.png` — *EN:* "Creamy fava beans blended with tahini, 400 g tin (260 g drained)." *AR:* "فول مدمس بالطحينة 400 جرام (المصفى 260 جرام)."
14. **Fava Beans with Sunflower Oil — 400 g tin** — `/Products/Tin Can-Oil copy - Copy.png` — *EN:* "Plain fava beans finished with sunflower oil, 400 g tin (260 g drained)." *AR:* "فول مدمس بزيت عباد الشمس 400 جرام (المصفى 260 جرام)."
15. **Fava Beans with Olive Oil — 400 g tin** — `/Products/Tin Can-Olive Oil copy.png` — *EN:* "Fava beans finished with olive oil, 400 g tin (260 g drained)." *AR:* "فول مدمس بزيت الزيتون 400 جرام (المصفى 260 جرام)."
16. **Fava Beans in Tomato Sauce — 400 g tin** — `/Products/Tin Can-tomato copy.png` — *EN:* "Fava beans in tomato sauce, 400 g tin (260 g drained)." *AR:* "فول مدمس بالصلصة 400 جرام (المصفى 260 جرام)."

### Beans & Peas (`beans_peas`)

17. **White Beans — 400 g tin** — *placeholder* — *EN:* "Plain white beans, 400 g tin (260 g drained)." *AR:* "فاصولياء بيضاء 400 جرام (المصفى 260 جرام)."
18. **White Beans in Tomato Sauce — 400 g tin** — *placeholder* — *EN:* "White beans in tomato sauce, 400 g tin (260 g drained)." *AR:* "فاصولياء بيضاء بالصلصة 400 جرام (المصفى 260 جرام)."
19. **Red Beans — 400 g tin** — *placeholder* — *EN:* "Red kidney beans, 400 g tin (260 g drained)." *AR:* "فاصولياء حمراء 400 جرام (المصفى 260 جرام)."
20. **Green Peas — 400 g tin** — *placeholder* — *EN:* "Tender garden peas, 400 g tin (240 g drained)." *AR:* "بازلاء خضراء 400 جرام (المصفى 240 جرام)."
21. **Peas in Tomato Sauce — 400 g tin** — *placeholder* — *EN:* "Green peas simmered in tomato sauce, 400 g tin (240 g drained)." *AR:* "بازلاء بالصلصة 400 جرام (المصفى 240 جرام)."

### Canned Vegetables (`canned_vegetables`)

22. **Sweet Corn — 400 g tin** — *placeholder* — *EN:* "Whole-kernel sweet corn, 400 g tin (244 g drained)." *AR:* "ذرة حلوة 400 جرام (المصفى 244 جرام)."
23. **Chickpeas — 400 g tin** — *placeholder* — *EN:* "Cooked chickpeas, 400 g tin (260 g drained) — ready for hummus or salad." *AR:* "حمص 400 جرام (المصفى 260 جرام)."
24. **Chickpeas with Tahini — 400 g tin** — *placeholder* — *EN:* "Chickpeas blended with tahini, 400 g tin (260 g drained)." *AR:* "حمص بالطحينة 400 جرام (المصفى 260 جرام)."
25. **Green Okra — 400 g tin** — *placeholder* — *EN:* "Tender green okra, 400 g tin (240 g drained)." *AR:* "بامية خضراء 400 جرام (المصفى 240 جرام)."

### Jams (`jams`)

#### Plastic portion cups (30 g, 144/carton)

26. **Fig Jam 30 g cup** — `/Products/fig Jam Portion copy.png` — *EN:* "Single-portion fig jam, 30 g cup — hotel and HORECA breakfast staple." *AR:* "مربى تين 30 جرام كأس بلاستيك."
27. **Strawberry Jam 30 g cup** — `/Products/Strawberry Jam Portion copy.png` — *EN:* "Single-portion strawberry jam, 30 g cup." *AR:* "مربى فراولة 30 جرام كأس بلاستيك."
28. **Guava Jam 30 g cup** — `/Products/guava Jam Portion copy.png` — *EN:* "Single-portion guava jam, 30 g cup." *AR:* "مربى جوافة 30 جرام كأس بلاستيك."
29. **Apricot Jam 30 g cup** — `/Products/apricots Jam Portion copy.png` — *EN:* "Single-portion apricot jam, 30 g cup." *AR:* "مربى مشمش 30 جرام كأس بلاستيك."
30. **Apple Jam 30 g cup** — `/Products/Apple Jam Portion copy.png` — *EN:* "Single-portion apple jam, 30 g cup." *AR:* "مربى تفاح 30 جرام كأس بلاستيك."
31. **Peach Jam 30 g cup** — `/Products/Peach Jam Portion copy.png` — *EN:* "Single-portion peach jam, 30 g cup." *AR:* "مربى خوخ 30 جرام كأس بلاستيك."
32. **Mango Jam 30 g cup** — `/Products/mango Jam Portion copy.png` — *EN:* "Single-portion mango jam, 30 g cup." *AR:* "مربى مانجو 30 جرام كأس بلاستيك."
33. **Orange Jam 30 g cup** — `/Products/orange Jam Portion copy.png` — *EN:* "Single-portion orange jam, 30 g cup." *AR:* "مربى برتقال 30 جرام كأس بلاستيك."
34. **Mixed Fruit Jam 30 g cup** — `/Products/mixed fruits Jam Portion.png` — *EN:* "Single-portion mixed-fruit jam, 30 g cup." *AR:* "مربى فواكه مشكلة 30 جرام كأس بلاستيك."

#### Glass jars (360 g, 12/carton)

35. **Fig Jam 360 g jar** — `/Products/Fig Jam 3d copy.png` — *EN:* "Whole-fig jam in a reclosable 360 g glass jar." *AR:* "مربى تين 360 جرام في برطمان زجاج."
36. **Strawberry Jam 360 g jar** — `/Products/Strawberry Jam 3d copy.png` — *EN:* "Whole-strawberry jam in a 360 g glass jar." *AR:* "مربى فراولة 360 جرام في برطمان زجاج."
37. **Guava Jam 360 g jar** — `/Products/Guava Jam 3d copy.png` — *EN:* "Guava jam in a 360 g glass jar." *AR:* "مربى جوافة 360 جرام في برطمان زجاج."
38. **Apricot Jam 360 g jar** — `/Products/Apricot Jam 3d copy.png` — *EN:* "Apricot jam in a 360 g glass jar." *AR:* "مربى مشمش 360 جرام في برطمان زجاج."
39. **Apple Jam 360 g jar** — `/Products/Apple Jam 3d.png` — *EN:* "Apple jam in a 360 g glass jar." *AR:* "مربى تفاح 360 جرام في برطمان زجاج."
40. **Peach Jam 360 g jar** — `/Products/Peach Jam 3d copy.png` — *EN:* "Peach jam in a 360 g glass jar." *AR:* "مربى خوخ 360 جرام في برطمان زجاج."
41. **Mango Jam 360 g jar** — `/Products/Mango Jam 3d copy.png` — *EN:* "Mango jam in a 360 g glass jar." *AR:* "مربى مانجو 360 جرام في برطمان زجاج."
42. **Orange Jam 360 g jar** — *placeholder* (no name-match in `/Products/`) — *EN:* "Orange jam in a 360 g glass jar." *AR:* "مربى برتقال 360 جرام في برطمان زجاج."
43. **Mixed Fruit Jam 360 g jar** — `/Products/Mixed Jam 3d copy.png` — *EN:* "Mixed-fruit jam in a 360 g glass jar." *AR:* "مربى فواكه مشكلة 360 جرام في برطمان زجاج."

### Juices (`juices`)

44. **Orange Juice 235 ml Tetra Pak** — `/Products/Orange Juice.png` — *EN:* "Yamkers orange juice in a 235 ml Tetra Pak." *AR:* "عصير برتقال 235 مل في عبوة تتراباك."
45. **Guava Juice 235 ml Tetra Pak** — `/Products/Guava Juice copy.png` — *EN:* "Yamkers guava juice in a 235 ml Tetra Pak." *AR:* "عصير جوافة 235 مل في عبوة تتراباك."
46. **Mango Juice 235 ml Tetra Pak** — `/Products/Mango Juice copy.png` — *EN:* "Yamkers mango juice in a 235 ml Tetra Pak." *AR:* "عصير مانجو 235 مل في عبوة تتراباك."
47. **Apple Juice 235 ml Tetra Pak** — `/Products/Apple Juice copy.png` — *EN:* "Yamkers apple juice in a 235 ml Tetra Pak." *AR:* "عصير تفاح 235 مل في عبوة تتراباك."
48. **Cocktail Juice 235 ml Tetra Pak** — `/Products/coktail Juice copy.png` — *EN:* "Mixed-fruit cocktail juice in a 235 ml Tetra Pak." *AR:* "عصير كوكتيل 235 مل في عبوة تتراباك."

(Total: 48 SKUs, IDs 1–48.)

---

## Components

### `<ProductsHero />` (client)

```
Section: relative h-[80vh] w-full overflow-hidden

  Video element (key={videoIdx}, autoPlay muted playsInline preload="metadata",
    onEnded → setVideoIdx((i)=>(i+1) % HERO_VIDEOS.length), scroll-tied scale 1 → 1.05)
    absolute inset-0 h-full w-full object-cover

  Black mask: absolute inset-0 bg-black/60

  Centered content (z-10):
    - eyebrow chip: "OUR BRANDS" (uppercase, tracked, white/80)
    - h1: products.hero.heading  → "Yamkers"   (font-display, white, 5xl→7xl)
    - subhead: products.hero.subhead          (white/80, max-w-xl)
    - FlowButton: products.cta "Explore Catalog" → anchor #catalog

  Animated ChevronDown bottom (bounce; reused vocabulary)
```

`HERO_VIDEOS = ["/applejam.mp4","/chilifavebeans.mp4","/favebeans.mp4","/favebeanstehina.mp4","/mangojar.mp4","/sauce.mp4","/plable.mp4","/privatelable.mp4"]`.

### `<ProductsTabs products={} />` (client)

- Container `id="catalog" mx-auto max-w-7xl px-4 py-24`.
- Header: eyebrow + h2 + animated `bg-secondary` underline + intro paragraph (centered, framer-motion stagger).
- Tab strip: 7 pills (`flex flex-wrap justify-center gap-3 mb-12`). Active = `bg-primary text-primary-foreground`. Inactive = `bg-muted text-foreground/70 hover:bg-muted/80`. Icons (`lucide-react`):
  - All → `LayoutGrid`
  - Tomato Paste → `Soup`
  - Fava Beans → `Bean`
  - Beans & Peas → `Sprout`
  - Canned Vegetables → `Salad`
  - Jams → `Cherry`
  - Juices → `GlassWater`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` wrapped in `<AnimatePresence mode="popLayout">`. Each `<motion.div layout initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.3,delay:idx*0.04}}>`.

### `<ProductCard product={} locale={} t={} />` (client)

```
<CardHoverReveal className="aspect-[4/5] w-full rounded-2xl border border-primary/10 bg-card shadow-sm">

  <CardHoverRevealMain>
    {product.image
      ? <Image src={product.image} alt={…} fill sizes="(min-width:1280px) 25vw, ..." className="object-cover" />
      : <ImagePlaceholder brand={product.brand} name={…} />}
  </CardHoverRevealMain>

  <CardHoverRevealContent className="space-y-3 rounded-2xl bg-zinc-900/75 text-zinc-50 p-5">
    <div className="flex items-center gap-2">
      <Image src={brandLogo} width={18} height={18} alt="" />
      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-wider">{brandLabel}</span>
    </div>
    <h3 className="text-base font-semibold leading-tight">{name}</h3>
    <p className="text-xs text-zinc-50/75 leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-1.5">
      {/* spec chips — bg-secondary/20 text-secondary */}
      <Chip>Net {netWeight}</Chip>
      {drained && <Chip>Drained {drained}</Chip>}
      {conc    && <Chip>{conc}</Chip>}
    </div>
    <div className="flex flex-wrap gap-1.5">
      {/* packaging chips — bg-primary/30 text-primary-foreground */}
      <Chip>{packagingTypeLabel}</Chip>
      <Chip>{unitsPerCarton}{t("card.perCarton")}</Chip>
    </div>
  </CardHoverRevealContent>

</CardHoverReveal>
```

`<ImagePlaceholder />`: `relative h-full w-full bg-[url('/bg6.jpg')] bg-cover` with overlay `absolute inset-0 bg-primary/40`, centered `<Image src="/navbarLogo.svg" width={120} height={40} className="opacity-50" />`. No "Image coming soon" text — the brand mark alone reads intentional.

### `<ProductsPage />` (server)

```
async function ProductsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  return (
    <>
      <ProductsHero
        eyebrow={t('hero.eyebrow')}
        heading={t('hero.heading')}
        subhead={t('hero.subhead')}
        cta={t('cta')}
      />
      <ProductsTabs
        products={products}
        locale={locale}
        labels={{ /* strings extracted from t */ }}
      />
    </>
  );
}
```

Passing labels as a plain object avoids hauling the `t` function across the server/client boundary.

---

## Navbar diff (`src/components/ui/header.tsx`)

```diff
 const serviceItems = [
-  { key: "ourBrands", href: "/services/our-brands" },
   { key: "privateLabel", href: "/services/private-label" },
   { key: "customProduct", href: "/services/custom-product" },
   { key: "export", href: "/services/export" },
 ] as const;
```

Desktop nav (insert before the Services dropdown):

```tsx
<Link href="/products" className={buttonVariants({ variant: "ghost" })}>
  {t("ourBrands")}
</Link>
```

Mobile menu: same `<Link>` styled with `justify-start`, placed above the Services accordion. Tap closes the menu via `closeMobile`.

---

## i18n changes

For each of `en.json`, `ar.json`, `fr.json`:

- Move `nav.services.ourBrands` → `nav.ourBrands` (keep the existing string).
- Add `products` namespace:

```json
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
    "brand": { "yamkers": "Yamkers", "tasbeka": "Tasbeka" },
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

Arabic equivalents are sourced from the Excel; French is translated by hand at implementation time (no Excel source).

---

## Conventions reused (no new patterns invented)

- **Section root** has no background of its own — body's `/bg6.jpg` shows through.
- **h2 underline** is `bg-secondary h-1 w-24`, animated from `width: 0` to `96` on inView.
- **framer-motion vocabulary** mirrors `about-us-section.tsx`: section-level `useInView({ amount: 0.1 })`, `containerVariants` with stagger, hover micro-interactions.
- **Hero video pattern** matches `hero-section.tsx`: `key={videoIdx}` forces remount, `onEnded` advances index.
- **Buttons:** primary CTA = `<FlowButton />`. shadcn `<Button>` is reserved for icon/utility use (none here).

---

## Testing & verification

1. `bun run typecheck` — type errors block.
2. `bun run build` — verify all 3 locales prerender `/products`, `/en/products`, `/fr/products`, `/ar/products` (with `localePrefix: 'as-needed'` only `/products`, `/fr/products`, `/ar/products` exist).
3. Visual smoke (dev): every tab renders, hover reveals overlay, video hero cycles, mobile menu has Our Brands link, RTL flips correctly on AR.
4. No regressions on existing `/services/private-label`, `/services/custom-product`, `/services/export` routes (still in dropdown).

---

## Out of scope (deferred)

- Tasbeka product data (architecture is brand-aware but no data today).
- Per-product detail page / modal.
- RFQ flow / "Add to quote" cart.
- Search box across catalog.
- Sorting (price, weight, A→Z).
- Real photography for placeholder SKUs (data update only; no code change needed when files appear in `/public/Products/`).
- Excel re-import tooling — current import is a one-time manual operation.
