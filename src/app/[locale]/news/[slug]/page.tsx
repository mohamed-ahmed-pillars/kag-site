import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import type { ComponentType } from 'react';
import { ArrowLeft, CalendarDays, UserCircle2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { listNewsPosts, type NewsPost } from '@/lib/news';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const dir = path.join(process.cwd(), 'src', 'content', 'news', locale);
    let files: string[] = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      /* dir missing - no posts */
    }
    for (const name of files) {
      if (name.endsWith('.mdx')) out.push({ locale, slug: name.replace(/\.mdx$/, '') });
    }
  }
  return out;
}

const POST_LOADERS: Record<string, () => Promise<{ default: ComponentType }>> = {
  'en/iso-22000-recertification': () => import('@/content/news/en/iso-22000-recertification.mdx'),
  'en/kag-expands-to-berlin-istanbul': () => import('@/content/news/en/kag-expands-to-berlin-istanbul.mdx'),
  'en/yamkers-fava-beans-launch': () => import('@/content/news/en/yamkers-fava-beans-launch.mdx'),
  'ar/iso-22000-recertification': () => import('@/content/news/ar/iso-22000-recertification.mdx'),
  'ar/kag-expands-to-berlin-istanbul': () => import('@/content/news/ar/kag-expands-to-berlin-istanbul.mdx'),
  'ar/yamkers-fava-beans-launch': () => import('@/content/news/ar/yamkers-fava-beans-launch.mdx'),
  'fr/iso-22000-recertification': () => import('@/content/news/fr/iso-22000-recertification.mdx'),
  'fr/kag-expands-to-berlin-istanbul': () => import('@/content/news/fr/kag-expands-to-berlin-istanbul.mdx'),
  'fr/yamkers-fava-beans-launch': () => import('@/content/news/fr/yamkers-fava-beans-launch.mdx'),
};

async function loadPost(locale: Locale, slug: string): Promise<ComponentType | null> {
  const loader = POST_LOADERS[`${locale}/${slug}`];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default as ComponentType;
  } catch {
    return null;
  }
}

async function loadMeta(locale: Locale, slug: string): Promise<NewsPost | null> {
  const posts = await listNewsPosts(locale);
  return posts.find((p) => p.slug === slug) ?? null;
}

function formatDate(iso: string, locale: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  let Post = await loadPost(safeLocale, slug);
  if (!Post && safeLocale !== routing.defaultLocale) {
    Post = await loadPost(routing.defaultLocale, slug);
  }
  if (!Post) notFound();
  let meta = await loadMeta(safeLocale, slug);
  if (!meta && safeLocale !== routing.defaultLocale) {
    meta = await loadMeta(routing.defaultLocale, slug);
  }
  const t = await getTranslations('news');

  return (
    <main className="relative w-full overflow-hidden px-4 py-16 text-foreground sm:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

      <div className="mx-auto max-w-3xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary/70 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>

        <header className="mt-6 space-y-4">
          {meta?.label && (
            <Badge variant="secondary" className="w-fit">
              {meta.label}
            </Badge>
          )}
          <h1 className="font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">
            {meta?.title ?? slug}
          </h1>
          <span className="block h-1 w-24 bg-secondary" />
          {meta?.excerpt && (
            <p className="text-base text-primary/70">{meta.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-foreground/60">
            {meta?.date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(meta.date, safeLocale)}
              </span>
            )}
            {meta?.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserCircle2 className="h-3.5 w-3.5" />
                {meta.author}
              </span>
            )}
          </div>
        </header>

        {meta?.image && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-primary/10 bg-card/60">
            <Image
              src={meta.image}
              alt={meta.title}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        <article
          className={
            'mt-10 space-y-5 text-base leading-relaxed text-foreground/85 ' +
            '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary ' +
            '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-primary ' +
            '[&_p]:leading-relaxed ' +
            '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/70 ' +
            '[&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5 ' +
            '[&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-1.5 ' +
            '[&_blockquote]:border-s-4 [&_blockquote]:border-secondary [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:text-foreground/75 ' +
            '[&_code]:rounded [&_code]:bg-primary/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-primary ' +
            '[&_img]:rounded-2xl [&_img]:my-6 ' +
            '[&_hr]:my-10 [&_hr]:border-primary/10'
          }
        >
          <Post />
        </article>

        <div className="mt-14 flex items-center justify-center border-t border-primary/10 pt-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
        </div>
      </div>
    </main>
  );
}
