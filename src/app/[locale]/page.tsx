import { setRequestLocale, getTranslations } from 'next-intl/server';
import HeroSection from '@/components/ui/hero-section';
import WhoWeAreSection from '@/components/ui/who-we-are-section';
import WhatWeOfferSection from '@/components/ui/what-we-offer-section';
import OurProductsSection from '@/components/ui/our-products-section';
import PrivateLabelSection from '@/components/ui/private-label-section';
import CustomProductSection from '@/components/ui/custom-product-section';
import ExportSection from '@/components/ui/export-section';
import GlobalReachSection from '@/components/ui/global-reach-section';
import NewsSection from '@/components/ui/news-section';
import { DynamicIslandTOC } from '@/components/ui/dynamic-island-toc';

type SectionKey =
  | 'hero'
  | 'whoWeAre'
  | 'whatWeOffer'
  | 'ourProducts'
  | 'privateLabel'
  | 'customProduct'
  | 'export'
  | 'globalReach'
  | 'news';

function TocAnchor({ id, title }: { id: string; title: string }) {
  return (
    <span
      id={id}
      data-toc
      data-toc-depth="2"
      data-toc-title={title}
      className="sr-only"
      aria-hidden="true"
    >
      {title}
    </span>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.toc');
  const section = (k: SectionKey) => t(`sections.${k}`);

  return (
    <main>
      <TocAnchor id="hero" title={section('hero')} />
      <HeroSection />

      <TocAnchor id="who-we-are" title={section('whoWeAre')} />
      <WhoWeAreSection />

      <TocAnchor id="what-we-offer" title={section('whatWeOffer')} />
      <WhatWeOfferSection />

      <TocAnchor id="our-products" title={section('ourProducts')} />
      <OurProductsSection />

      <TocAnchor id="private-label" title={section('privateLabel')} />
      <PrivateLabelSection />

      <TocAnchor id="custom-product" title={section('customProduct')} />
      <CustomProductSection />

      <TocAnchor id="export" title={section('export')} />
      <ExportSection />

      <TocAnchor id="global-reach" title={section('globalReach')} />
      <GlobalReachSection />

      <TocAnchor id="news" title={section('news')} />
      <NewsSection locale={locale} />

      <DynamicIslandTOC
        selector="[data-toc]"
        expandedLabel={t('expandedLabel')}
        closedLabel={t('closedLabel')}
      />
    </main>
  );
}
