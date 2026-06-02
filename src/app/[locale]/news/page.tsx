import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { listNewsPosts } from '@/lib/news';
import { NewsList } from '@/components/ui/news-list';

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
  let posts = await listNewsPosts(safeLocale);
  if (posts.length === 0 && safeLocale !== routing.defaultLocale) {
    posts = await listNewsPosts(routing.defaultLocale);
  }
  const t = await getTranslations('news');

  return (
    <main className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/60">{t('eyebrow')}</span>
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{t('heading')}</h1>
          <span className="mx-auto block h-1 w-24 bg-secondary" />
          <p className="mx-auto max-w-2xl text-sm text-primary/70 sm:text-base">{t('intro')}</p>
        </header>

        <NewsList posts={posts} locale={safeLocale} />
      </div>
    </main>
  );
}
