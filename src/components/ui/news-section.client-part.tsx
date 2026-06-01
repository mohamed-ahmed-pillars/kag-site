"use client";

import { useRef } from 'react';
import Image from 'next/image';
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
                    aria-label={`${t('readMore')}: ${post.title}`}
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
