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
