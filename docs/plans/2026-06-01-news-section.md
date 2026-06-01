# News Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a homepage "News" section that surfaces the three most recent MDX posts, and rename the existing `/blog` route + content folder + nav label to "News" end-to-end.

**Architecture:** A new `<NewsSection />` Server Component (in `src/components/ui/news-section.tsx`) reads MDX frontmatter via a shared `listNewsPosts` helper (`src/lib/news.ts`), then passes the top 3 posts to a `"use client"` motion subcomponent in the same file. The existing `/blog` route + content folder is `git mv`'d to `/news`, and the nav + i18n keys are renamed to match.

**Tech Stack:** Next.js 16, React 19, TypeScript, next-intl 4, `@next/mdx` + `gray-matter`, framer-motion 12, Tailwind v4, shadcn (`Card`, `Badge`), existing `FlowButton`.

**Reference spec:** `docs/superpowers/specs/2026-06-01-news-section-design.md`

**Verification model:** This codebase has no component unit tests. Each task ends with `bun run typecheck` (and `bun run lint` where relevant), plus a manual dev-server check at the end. Use `bun run` for scripts (`bun test` is the project's test runner, but no tests are wired for sections).

---

## Task 1: Rename routes and content folders to `news`

**Files:**
- Move: `src/app/[locale]/blog/page.tsx` → `src/app/[locale]/news/page.tsx`
- Move: `src/app/[locale]/blog/[slug]/page.tsx` → `src/app/[locale]/news/[slug]/page.tsx`
- Move: `src/content/blog/{en,ar,fr}/` → `src/content/news/{en,ar,fr}/` (folders are empty)
- Modify: `src/app/[locale]/news/page.tsx` (the `'blog'` literal inside)
- Modify: `src/app/[locale]/news/[slug]/page.tsx` (two `'blog'` references inside)

**Step 1: Move the directories with git**

```bash
git mv src/app/[locale]/blog src/app/[locale]/news
git mv src/content/blog src/content/news
```

Run: `git status`
Expected: shows two renamed directories (and their files), no other changes.

**Step 2: Update path literal in `news/page.tsx`**

In `src/app/[locale]/news/page.tsx`, change the `path.join` call:

```diff
-    const dir = path.join(process.cwd(), 'src', 'content', 'blog', locale);
+    const dir = path.join(process.cwd(), 'src', 'content', 'news', locale);
```

**Step 3: Update path literals in `news/[slug]/page.tsx`**

In `src/app/[locale]/news/[slug]/page.tsx`, change two references:

```diff
-    const dir = path.join(process.cwd(), 'src', 'content', 'blog', locale);
+    const dir = path.join(process.cwd(), 'src', 'content', 'news', locale);
```

```diff
-    const mod = await import(`@/content/blog/${locale}/${slug}.mdx`);
+    const mod = await import(`@/content/news/${locale}/${slug}.mdx`);
```

**Step 4: Verify no stale `/blog` or `content/blog` references remain in app code**

Run: `grep -rn "content/blog\|/blog" src/app src/content 2>/dev/null`
Expected: no output.

**Step 5: Typecheck**

Run: `bun run typecheck`
Expected: no errors. (The header still references `/blog` — that's expected and handled in Task 3; it's a string, not a type, so it won't fail typecheck.)

**Step 6: Commit**

```bash
git add .
git commit -m "refactor: rename /blog route and content folder to /news"
```

---

## Task 2: Update i18n JSON files (rename `nav.blog`, add `news` namespace)

**Files:**
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ar.json`
- Modify: `src/i18n/messages/fr.json`

**Step 1: Update `en.json`**

In `src/i18n/messages/en.json`, rename `nav.blog` → `nav.news`:

```diff
   "nav": {
     "home": "Home",
-    "blog": "Blog",
+    "news": "News",
     "contact": "Contact us",
```

Then add a new top-level `news` namespace immediately after the `whoWeAre` block (placement is not load-bearing — just keep the file readable). Insert before the next top-level key:

```json
  "news": {
    "eyebrow": "FROM OUR NEWSROOM",
    "heading": "Latest News",
    "intro": "Milestones, certifications, and product launches from across KAG's manufacturing, private-label, and export operations.",
    "viewAll": "View all news",
    "readMore": "Read more"
  },
```

**Step 2: Update `ar.json`**

Rename `nav.blog` → `nav.news` (same diff, Arabic value):

```diff
-    "blog": "المدونة",
+    "news": "الأخبار",
```

Add the `news` namespace:

```json
  "news": {
    "eyebrow": "من غرفة الأخبار",
    "heading": "أحدث الأخبار",
    "intro": "إنجازات وشهادات وإطلاق منتجات جديدة عبر عمليات التصنيع والعلامة الخاصة والتصدير في KAG.",
    "viewAll": "عرض كل الأخبار",
    "readMore": "اقرأ المزيد"
  },
```

**Step 3: Update `fr.json`**

Rename `nav.blog` → `nav.news`:

```diff
-    "blog": "Blog",
+    "news": "Actualités",
```

Add the `news` namespace:

```json
  "news": {
    "eyebrow": "DEPUIS NOTRE SALLE DE PRESSE",
    "heading": "Dernières Actualités",
    "intro": "Étapes clés, certifications et lancements de produits dans nos activités de fabrication, marque privée et exportation chez KAG.",
    "viewAll": "Voir toutes les actualités",
    "readMore": "Lire la suite"
  },
```

**Step 4: Validate JSON syntactically**

Run: `bun run typecheck`
Expected: no errors. (next-intl validates message shape against `useTranslations` calls, but since no caller uses `news.*` yet, this will pass.)

Sanity check the JSON parses:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/en.json'))" \
  && node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/ar.json'))" \
  && node -e "JSON.parse(require('fs').readFileSync('src/i18n/messages/fr.json'))" \
  && echo "all valid"
```

Expected output: `all valid`

**Step 5: Commit**

```bash
git add .
git commit -m "i18n: rename nav.blog → nav.news, add news section copy (en/ar/fr)"
```

---

## Task 3: Update `header.tsx` to use `news` key and `/news` URL

**Files:**
- Modify: `src/components/ui/header.tsx` (4 sites — see Step 1)

**Step 1: Identify the lines to change**

Run: `grep -n "blog\|/blog" src/components/ui/header.tsx`
Expected output: 4 lines — two `href="/blog"` and two `t("blog")`. Note exact line numbers.

**Step 2: Replace `/blog` with `/news` (both occurrences)**

Use Edit with `replace_all: true` on the literal `"/blog"`:

```diff
-          <Link href="/blog" ...>
+          <Link href="/news" ...>
...
-              href="/blog"
+              href="/news"
```

**Step 3: Replace `t("blog")` with `t("news")` (both occurrences)**

```diff
-            {t("blog")}
+            {t("news")}
```

**Step 4: Verify no stale references remain anywhere in `src/`**

Run: `grep -rn "t(\"blog\"\|/blog" src/ 2>/dev/null`
Expected: no output.

**Step 5: Typecheck + lint**

Run: `bun run typecheck && bun run lint src/components/ui/header.tsx`
Expected: no errors, no warnings on this file.

**Step 6: Commit**

```bash
git add .
git commit -m "feat(header): point nav at /news and use news i18n key"
```

---

## Task 4: Extract `listNewsPosts` helper into `src/lib/news.ts`

**Files:**
- Create: `src/lib/news.ts`
- Modify: `src/app/[locale]/news/page.tsx`

**Step 1: Create the shared helper**

Create `src/lib/news.ts` with this exact content:

```ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { routing, type Locale } from '@/i18n/routing';

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  label: string;
  image: string;
  author?: string;
};

export async function listNewsPosts(locale: Locale): Promise<NewsPost[]> {
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;
  const dir = path.join(process.cwd(), 'src', 'content', 'news', safeLocale);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const posts: NewsPost[] = [];
  for (const name of files) {
    if (!name.endsWith('.mdx')) continue;
    const raw = await fs.readFile(path.join(dir, name), 'utf-8');
    const { data } = matter(raw);
    posts.push({
      slug: name.replace(/\.mdx$/, ''),
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      excerpt: String(data.excerpt ?? ''),
      label: String(data.label ?? ''),
      image: String(data.image ?? ''),
      author: data.author ? String(data.author) : undefined,
    });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
```

**Step 2: Refactor `news/page.tsx` to use the helper**

Replace the whole file with:

```tsx
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { listNewsPosts } from '@/lib/news';

export default async function NewsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const posts = await listNewsPosts(safeLocale);
  return (
    <main>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>{p.slug}</li>
        ))}
      </ul>
    </main>
  );
}
```

(Note: styling the index page is out of scope per the spec — this just keeps the existing bare list working.)

**Step 3: Typecheck**

Run: `bun run typecheck`
Expected: no errors.

**Step 4: Commit**

```bash
git add .
git commit -m "refactor(news): extract listNewsPosts into src/lib/news.ts"
```

---

## Task 5: Scaffold English MDX posts

**Files:**
- Create: `src/content/news/en/kag-expands-to-berlin-istanbul.mdx`
- Create: `src/content/news/en/iso-22000-recertification.mdx`
- Create: `src/content/news/en/yamkers-fava-beans-launch.mdx`

**Step 1: Create `kag-expands-to-berlin-istanbul.mdx`**

```mdx
---
title: "KAG expands export footprint to Berlin and Istanbul"
date: "2026-05-20"
excerpt: "Two new distribution partnerships in Germany and Türkiye bring KAG products closer to European and regional shelves."
label: "Export"
image: "/exportstrip.jpg"
author: "KAG Newsroom"
---

KAG has finalized distribution agreements with two new partners in Berlin and Istanbul, broadening the company's European and regional reach. The agreements cover tomato sauces, jams, and the Yamkers fava beans range — the same product families already shipping across Cairo's existing export corridor.

The Berlin partnership focuses on European retail channels, with first containers expected to clear customs during Q3. The Istanbul agreement adds a regional hub that shortens lead times to surrounding markets and complements KAG's existing Beirut and North African routes.

"Both partners share our priorities — consistent quality, dependable supply, and clear documentation," said the export team. "That makes it easier to scale together."
```

**Step 2: Create `iso-22000-recertification.mdx`**

```mdx
---
title: "ISO 22000 recertification across all production lines"
date: "2026-04-10"
excerpt: "Independent auditors renewed KAG's ISO 22000 food safety certification with zero major findings, covering every active production line."
label: "Quality"
image: "/certifications/iso-22000.avif"
author: "KAG Newsroom"
---

KAG has successfully passed its ISO 22000 recertification audit, with the renewed certificate covering all active production lines — sauces, jams, juices, and fava beans. The audit was completed with zero major findings and a small number of minor observations, each closed within the standard remediation window.

ISO 22000 sits alongside our existing Halal, FDA, GMP, and BRC certifications. Together they form the baseline that lets KAG products move into regulated markets without friction at the border.

For private-label partners and importers, recertification means documentation continues without interruption — the same audit trail, the same controls, just refreshed against the latest standard.
```

**Step 3: Create `yamkers-fava-beans-launch.mdx`**

```mdx
---
title: "New Yamkers fava beans range hits Egyptian shelves"
date: "2026-03-02"
excerpt: "Three new Yamkers fava beans recipes — including a chili variant — are now in distribution across Egyptian supermarkets and grocers."
label: "Product"
image: "/favebeans.png"
author: "KAG Newsroom"
---

Yamkers, KAG's everyday household brand, has expanded its fava beans line with three new recipes now reaching Egyptian shelves. The range includes a chili variant developed in response to direct shopper feedback over the past two seasons.

Production runs on the same lines already supplying Yamkers' core sauces and jams, with quality controls unchanged. Distribution coverage matches our existing supermarket and trade network — no new logistics infrastructure was needed.

Early sell-through data from the launch markets is strong. We'll be watching repeat-purchase rates closely as the range settles in over the next quarter.
```

**Step 4: Verify all three files parse as MDX**

Run: `bun run typecheck`
Expected: no errors.

Sanity check frontmatter is well-formed:

```bash
node -e "const m=require('gray-matter');['kag-expands-to-berlin-istanbul','iso-22000-recertification','yamkers-fava-beans-launch'].forEach(s=>{const r=m.read('src/content/news/en/'+s+'.mdx');console.log(s,'-',r.data.title)})"
```

Expected output: three lines, each printing the slug and the title.

**Step 5: Commit**

```bash
git add .
git commit -m "content(news): scaffold three English starter posts"
```

---

## Task 6: Scaffold Arabic MDX posts

**Files:**
- Create: `src/content/news/ar/kag-expands-to-berlin-istanbul.mdx`
- Create: `src/content/news/ar/iso-22000-recertification.mdx`
- Create: `src/content/news/ar/yamkers-fava-beans-launch.mdx`

Same three slugs and frontmatter shape; Arabic translations of the English content.

**Step 1: Create `kag-expands-to-berlin-istanbul.mdx`**

```mdx
---
title: "KAG توسّع نطاق التصدير إلى برلين واسطنبول"
date: "2026-05-20"
excerpt: "شراكتان جديدتان للتوزيع في ألمانيا وتركيا تقرّبان منتجات KAG من رفوف السوقين الأوروبي والإقليمي."
label: "تصدير"
image: "/exportstrip.jpg"
author: "غرفة أخبار KAG"
---

أبرمت KAG اتفاقيتين جديدتين للتوزيع مع شريكين في برلين واسطنبول، لتوسّع بذلك حضورها الأوروبي والإقليمي. تشمل الاتفاقيتان صلصات الطماطم والمربيات وتشكيلة فول يامكرز — نفس مجموعات المنتجات التي تُشحَن بالفعل عبر ممر التصدير القائم من القاهرة.

تركّز شراكة برلين على قنوات البيع بالتجزئة في أوروبا، ومن المتوقع وصول أولى الحاويات وتخليصها جمركياً خلال الربع الثالث. أما اتفاقية اسطنبول فتضيف مركزاً إقليمياً يُقلّص زمن التوصيل إلى الأسواق المجاورة ويُكمّل مسارَي KAG القائمَين عبر بيروت وشمال أفريقيا.

وقال فريق التصدير: "يتشارك الطرفان معنا الأولويات نفسها — جودة ثابتة، إمدادات يُعتمد عليها، وتوثيق واضح. هذا ما يُسهّل التوسّع معاً."
```

**Step 2: Create `iso-22000-recertification.mdx`**

```mdx
---
title: "تجديد شهادة ISO 22000 لجميع خطوط الإنتاج"
date: "2026-04-10"
excerpt: "جدّد المُدقّقون المستقلون شهادة سلامة الغذاء ISO 22000 لـ KAG دون أي ملاحظات جوهرية، وبتغطية شاملة لكل خطوط الإنتاج النشطة."
label: "جودة"
image: "/certifications/iso-22000.avif"
author: "غرفة أخبار KAG"
---

اجتازت KAG بنجاح تدقيق تجديد شهادة ISO 22000، وتغطي الشهادة المُجدّدة جميع خطوط الإنتاج النشطة — الصلصات والمربيات والعصائر والفول. أُنجز التدقيق دون أي ملاحظات جوهرية، مع عدد محدود من الملاحظات الثانوية أُغلِقت جميعها ضمن المهلة المعتادة للمعالجة.

تأتي ISO 22000 جنباً إلى جنب مع شهاداتنا الأخرى من Halal وFDA وGMP وBRC. وتُشكّل معاً الأساس الذي يُتيح لمنتجات KAG الدخول إلى الأسواق المنظَّمة دون عوائق على الحدود.

بالنسبة لشركاء العلامة الخاصة والمستوردين، يعني التجديد استمرار التوثيق دون انقطاع — المسار التدقيقي نفسه، والضوابط نفسها، مع تحديث وفق آخر إصدار للمعيار.
```

**Step 3: Create `yamkers-fava-beans-launch.mdx`**

```mdx
---
title: "تشكيلة فول يامكرز الجديدة على رفوف السوق المصري"
date: "2026-03-02"
excerpt: "ثلاث وصفات جديدة من فول يامكرز — من بينها وصفة بالفلفل الحار — متوفّرة الآن في السوبر ماركتات والبقالات في مصر."
label: "منتج"
image: "/favebeans.png"
author: "غرفة أخبار KAG"
---

وسّعت يامكرز، علامة KAG المنزلية اليومية، تشكيلة الفول الخاصة بها بثلاث وصفات جديدة وصلت إلى رفوف السوق المصري. تشمل التشكيلة وصفةً بالفلفل الحار طُوِّرت بناءً على ملاحظات مباشرة من المستهلكين على مدى الموسمَين الماضيَين.

يعمل الإنتاج على نفس خطوط التصنيع التي تُغذّي صلصات يامكرز ومربياتها الأساسية، مع الحفاظ على ضوابط الجودة دون تغيير. وتُطابق التغطية الجغرافية شبكة السوبر ماركت والتجارة القائمة لدينا — دون الحاجة إلى أي بنية لوجستية إضافية.

تُشير بيانات البيع الأولية في أسواق الإطلاق إلى أداء قوي. وسنُتابع معدّلات الشراء المتكرّر عن كثب مع استقرار التشكيلة خلال الربع المقبل.
```

**Step 4: Verify**

Run: `bun run typecheck`
Expected: no errors.

**Step 5: Commit**

```bash
git add .
git commit -m "content(news): scaffold three Arabic starter posts"
```

---

## Task 7: Scaffold French MDX posts

**Files:**
- Create: `src/content/news/fr/kag-expands-to-berlin-istanbul.mdx`
- Create: `src/content/news/fr/iso-22000-recertification.mdx`
- Create: `src/content/news/fr/yamkers-fava-beans-launch.mdx`

Same slugs and frontmatter shape; French translations.

**Step 1: Create `kag-expands-to-berlin-istanbul.mdx`**

```mdx
---
title: "KAG étend son empreinte export à Berlin et Istanbul"
date: "2026-05-20"
excerpt: "Deux nouveaux partenariats de distribution en Allemagne et en Türkiye rapprochent les produits KAG des rayons européens et régionaux."
label: "Exportation"
image: "/exportstrip.jpg"
author: "Salle de presse KAG"
---

KAG a finalisé des accords de distribution avec deux nouveaux partenaires à Berlin et à Istanbul, élargissant ainsi sa portée européenne et régionale. Les accords couvrent les sauces tomates, les confitures et la gamme de fèves Yamkers — les mêmes familles de produits déjà expédiées via le corridor d'exportation existant depuis Le Caire.

Le partenariat berlinois cible les circuits de distribution européens, avec un premier dédouanement de conteneurs attendu au troisième trimestre. L'accord d'Istanbul ajoute un hub régional qui raccourcit les délais vers les marchés voisins et complète les routes existantes de KAG via Beyrouth et l'Afrique du Nord.

« Les deux partenaires partagent nos priorités — une qualité constante, un approvisionnement fiable et une documentation claire », indique l'équipe export. « Cela facilite la croissance commune. »
```

**Step 2: Create `iso-22000-recertification.mdx`**

```mdx
---
title: "Recertification ISO 22000 sur toutes les lignes de production"
date: "2026-04-10"
excerpt: "Les auditeurs indépendants ont renouvelé la certification ISO 22000 de KAG sans constat majeur, couvrant l'ensemble des lignes de production actives."
label: "Qualité"
image: "/certifications/iso-22000.avif"
author: "Salle de presse KAG"
---

KAG a passé avec succès son audit de recertification ISO 22000, et le certificat renouvelé couvre toutes les lignes de production actives — sauces, confitures, jus et fèves. L'audit s'est conclu sans aucun constat majeur, avec un petit nombre d'observations mineures, toutes clôturées dans la fenêtre de correction habituelle.

La norme ISO 22000 s'ajoute à nos certifications Halal, FDA, GMP et BRC. Ensemble, elles constituent la base qui permet aux produits KAG d'entrer sur les marchés réglementés sans friction à la frontière.

Pour les partenaires en marque privée et les importateurs, la recertification signifie une documentation maintenue sans interruption — la même piste d'audit, les mêmes contrôles, simplement actualisés selon la dernière version de la norme.
```

**Step 3: Create `yamkers-fava-beans-launch.mdx`**

```mdx
---
title: "La nouvelle gamme de fèves Yamkers arrive dans les rayons égyptiens"
date: "2026-03-02"
excerpt: "Trois nouvelles recettes de fèves Yamkers — dont une variante au piment — sont désormais distribuées dans les supermarchés et épiceries d'Égypte."
label: "Produit"
image: "/favebeans.png"
author: "Salle de presse KAG"
---

Yamkers, la marque grand public de KAG, élargit sa gamme de fèves avec trois nouvelles recettes désormais présentes dans les rayons égyptiens. La gamme inclut une variante au piment développée en réponse directe aux retours des consommateurs au cours des deux dernières saisons.

La production utilise les mêmes lignes que celles qui alimentent déjà les sauces et confitures Yamkers, sans modification des contrôles qualité. La couverture de distribution correspond à notre réseau actuel de supermarchés et de commerce — aucune nouvelle infrastructure logistique n'a été nécessaire.

Les premières données de sortie de caisse sont solides. Nous surveillerons de près les taux de ré-achat à mesure que la gamme s'installera au cours du prochain trimestre.
```

**Step 4: Verify**

Run: `bun run typecheck`
Expected: no errors.

**Step 5: Commit**

```bash
git add .
git commit -m "content(news): scaffold three French starter posts"
```

---

## Task 8: Build the `NewsSection` component

**Files:**
- Create: `src/components/ui/news-section.tsx`

**Step 1: Create the file**

Create `src/components/ui/news-section.tsx` with this content:

```tsx
import { listNewsPosts, type NewsPost } from '@/lib/news';
import { routing, type Locale } from '@/i18n/routing';
import { NewsSectionClient } from './news-section.client-part';

export default async function NewsSection({ locale }: { locale: string }) {
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  let posts = await listNewsPosts(safeLocale);
  if (posts.length === 0 && safeLocale !== routing.defaultLocale) {
    posts = await listNewsPosts(routing.defaultLocale);
  }
  return <NewsSectionClient posts={posts.slice(0, 3)} />;
}

export type { NewsPost };
```

**Step 2: Create the client subcomponent**

The plan splits the client component into its own file (`news-section.client-part.tsx`) instead of putting `"use client"` and `async` exports in the same file — Next.js doesn't allow a client and server component to live in the same file. Create `src/components/ui/news-section.client-part.tsx`:

```tsx
"use client";

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FlowButton } from '@/components/ui/flow-button';
import type { NewsPost } from '@/lib/news';

export function NewsSectionClient({ posts }: { posts: NewsPost[] }) {
  const t = useTranslations('news');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      id="news"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-24 text-foreground"
    >
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col items-center mb-12"
          variants={itemVariants}
        >
          <motion.span
            className="text-primary font-medium mb-2 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Newspaper className="w-4 h-4" />
            {t('eyebrow')}
          </motion.span>
          <h2 className="font-heading text-4xl md:text-5xl font-light mb-4 text-center">
            {t('heading')}
          </h2>
          <motion.div
            className="w-24 h-1 bg-secondary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.p
            className="text-center max-w-2xl mx-auto mt-6 text-foreground/80"
            variants={itemVariants}
          >
            {t('intro')}
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <motion.div
              key={post.slug}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="grid h-full grid-rows-[auto_auto_1fr_auto] overflow-hidden bg-white/70 backdrop-blur-sm">
                <Link
                  href={`/news/${post.slug}`}
                  className="block aspect-[16/9] w-full overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <CardHeader className="gap-2">
                  {post.label ? (
                    <Badge variant="secondary" className="w-fit">
                      {post.label}
                    </Badge>
                  ) : null}
                  <h3 className="font-heading text-lg md:text-xl hover:underline">
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/news/${post.slug}`}
                    className="inline-flex items-center text-primary font-medium hover:underline"
                  >
                    {t('readMore')}
                    <ArrowRight className="ms-2 size-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          variants={itemVariants}
        >
          <FlowButton text={t('viewAll')} href="/news" />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

**Step 3: Typecheck**

Run: `bun run typecheck`
Expected: no errors.

**Step 4: Lint the two new files**

Run: `bun run lint src/components/ui/news-section.tsx src/components/ui/news-section.client-part.tsx`
Expected: no errors.

**Step 5: Commit**

```bash
git add .
git commit -m "feat(news): add homepage NewsSection (server shell + client motion)"
```

---

## Task 9: Wire `NewsSection` into the homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Update the homepage**

Replace `src/app/[locale]/page.tsx` with:

```tsx
import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/ui/hero-section';
import WhoWeAreSection from '@/components/ui/who-we-are-section';
import WhatWeOfferSection from '@/components/ui/what-we-offer-section';
import OurProductsSection from '@/components/ui/our-products-section';
import PrivateLabelSection from '@/components/ui/private-label-section';
import ExportSection from '@/components/ui/export-section';
import GlobalReachSection from '@/components/ui/global-reach-section';
import NewsSection from '@/components/ui/news-section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <WhatWeOfferSection />
      <OurProductsSection />
      <PrivateLabelSection />
      <ExportSection />
      <GlobalReachSection />
      <NewsSection locale={locale} />
    </main>
  );
}
```

**Step 2: Typecheck + lint**

Run: `bun run typecheck && bun run lint`
Expected: no errors.

**Step 3: Build**

Run: `bun run build`
Expected: build succeeds; the build output lists `/[locale]/news` and `/[locale]/news/[slug]` routes; no warnings about missing translations or unused i18n keys.

**Step 4: Manual dev-server verification**

Run: `bun run dev` (in another shell, or kill it after the check)

Open in browser:
- `http://localhost:3000/` → English homepage. Scroll to the new News section after Global Reach.
  - Eyebrow says "FROM OUR NEWSROOM" with newspaper icon, heading "Latest News" in `font-heading`, lime underline animates in.
  - Three cards render in order: Berlin/Istanbul → ISO 22000 → Yamkers (newest first).
  - Card images load from `/exportstrip.jpg`, `/certifications/iso-22000.avif`, `/favebeans.png`.
  - Hover a card → it lifts (`y: -5`), image scales slightly.
  - Section has NO background tint of its own — the body `/bg6.jpg` pattern shows through.
  - Click any card → lands on `/news/<slug>` and the MDX body renders.
  - Click "View all news" FlowButton → lands on `/news` (bare list — expected).
- `http://localhost:3000/ar` → Arabic homepage. Confirm same 3 cards with Arabic titles/excerpts, RTL layout flips card direction and arrow icons correctly.
- `http://localhost:3000/fr` → French homepage. Confirm French titles/excerpts.
- Click the "News" nav entry in the header → lands on `/news` in the current locale.

**Step 5: Final stale-reference sweep**

Run: `grep -rn "/blog\|t(\"blog\"\|content/blog\|nav\.blog" src/ 2>/dev/null`
Expected: no output.

**Step 6: Commit**

```bash
git add .
git commit -m "feat(home): render NewsSection after Global Reach"
```

---

## Done

After Task 9, the homepage shows a News section in all three locales, every link routes correctly, build + typecheck + lint are clean, and the legacy `/blog` references are gone.
