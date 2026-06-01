import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { ComponentType } from 'react';
import { routing, type Locale } from '@/i18n/routing';

export async function generateStaticParams() {
  const out: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const dir = path.join(process.cwd(), 'src', 'content', 'news', locale);
    let files: string[] = [];
    try {
      files = await fs.readdir(dir);
    } catch {
      /* dir missing — no posts */
    }
    for (const name of files) {
      if (name.endsWith('.mdx')) out.push({ locale, slug: name.replace(/\.mdx$/, '') });
    }
  }
  return out;
}

async function loadPost(locale: Locale, slug: string): Promise<ComponentType | null> {
  try {
    const mod = await import(`@/content/news/${locale}/${slug}.mdx`);
    return mod.default as ComponentType;
  } catch {
    return null;
  }
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
  const Post = await loadPost(safeLocale, slug);
  if (!Post) notFound();
  return (
    <main>
      <Post />
    </main>
  );
}
