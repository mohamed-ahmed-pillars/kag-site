import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Boxes, Package } from 'lucide-react';
import { FlowButton } from '@/components/ui/flow-button';

export default async function RfqChooserPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('rfq.chooser');

  return (
    <main className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/60">{t('eyebrow')}</span>
          <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{t('heading')}</h1>
          <span className="mx-auto block h-1 w-24 bg-secondary" />
          <p className="mx-auto max-w-2xl text-sm text-primary/70 sm:text-base">{t('intro')}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group flex flex-col gap-4 rounded-3xl border border-primary/10 bg-card/60 p-8 transition-all hover:-translate-y-1 hover:border-secondary">
            <Boxes className="h-10 w-10 text-primary" />
            <h2 className="font-display text-xl font-bold text-primary">{t('brands.heading')}</h2>
            <p className="text-sm text-primary/70">{t('brands.description')}</p>
            <div className="mt-auto">
              <FlowButton href="/rfq/brands" text={t('brands.cta')} />
            </div>
          </div>

          <div className="group flex flex-col gap-4 rounded-3xl border border-primary/10 bg-card/60 p-8 transition-all hover:-translate-y-1 hover:border-secondary">
            <Package className="h-10 w-10 text-primary" />
            <h2 className="font-display text-xl font-bold text-primary">{t('privateLabel.heading')}</h2>
            <p className="text-sm text-primary/70">{t('privateLabel.description')}</p>
            <div className="mt-auto">
              <FlowButton href="/rfq/private-label" text={t('privateLabel.cta')} variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
