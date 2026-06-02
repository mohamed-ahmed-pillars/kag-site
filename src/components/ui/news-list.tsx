'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { NewsPost } from '@/lib/news';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

function formatDate(iso: string, locale: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
}

export function NewsList({ posts, locale }: { posts: NewsPost[]; locale: string }) {
  const t = useTranslations('news');
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: false, amount: 0.1 });

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-primary/10 bg-card/60 p-10 text-center text-sm text-primary/70">
        {t('empty')}
      </div>
    );
  }

  return (
    <motion.div
      ref={gridRef}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {posts.map((post) => (
        <motion.div key={post.slug} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="grid h-full grid-rows-[auto_auto_1fr_auto] overflow-hidden bg-white/70 backdrop-blur-sm">
            <Link
              href={`/news/${post.slug}`}
              className="block aspect-[16/9] w-full overflow-hidden"
              aria-hidden="true"
              tabIndex={-1}
            >
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={450}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>
            <CardHeader className="gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {post.label ? (
                  <Badge variant="secondary" className="w-fit">
                    {post.label}
                  </Badge>
                ) : <span />}
                {post.date && (
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(post.date, locale)}
                  </span>
                )}
              </div>
              <h3 className="font-heading text-lg md:text-xl hover:underline">
                <Link href={`/news/${post.slug}`}>{post.title}</Link>
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/80">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/news/${post.slug}`}
                className="inline-flex items-center text-primary font-medium hover:underline"
                aria-label={`${t('readMore')}: ${post.title}`}
              >
                {t('readMore')}
                <ArrowRight className="ms-2 size-4" />
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
