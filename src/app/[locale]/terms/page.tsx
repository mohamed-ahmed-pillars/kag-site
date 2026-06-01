import type { Metadata } from 'next';
import { Scale } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalSections from '@/components/ui/legal-sections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms' });
  const sections = t.raw('sections') as { title: string; body: string }[];

  return (
    <section className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Scale className="h-4 w-4" />
            {t('hero.badge')}
          </div>
          <h1 className="mb-3 font-heading text-4xl md:text-5xl">
            {t('hero.title')}
          </h1>
          <div className="mx-auto mb-4 h-1 w-24 bg-secondary" />
          <p className="mx-auto max-w-2xl text-foreground/80">
            {t('hero.subtitle')}
          </p>
        </div>
        <LegalSections sections={sections} lastUpdated={t('lastUpdated')} />
      </div>
    </section>
  );
}
