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
