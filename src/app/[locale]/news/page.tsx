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
