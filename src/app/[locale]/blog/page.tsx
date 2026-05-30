import { setRequestLocale } from 'next-intl/server';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { routing, type Locale } from '@/i18n/routing';

type BlogPost = { slug: string; title: string; date: string; excerpt: string };

async function listPosts(locale: Locale): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), 'src', 'content', 'blog', locale);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const posts: BlogPost[] = [];
  for (const name of files) {
    if (!name.endsWith('.mdx')) continue;
    const raw = await fs.readFile(path.join(dir, name), 'utf-8');
    const { data } = matter(raw);
    posts.push({
      slug: name.replace(/\.mdx$/, ''),
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      excerpt: String(data.excerpt ?? ''),
    });
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const safeLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  const posts = await listPosts(safeLocale);
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
