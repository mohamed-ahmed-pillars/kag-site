import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/ui/hero-section';
import WhoWeAreSection from '@/components/ui/who-we-are-section';
import WhatWeOfferSection from '@/components/ui/what-we-offer-section';
import OurProductsSection from '@/components/ui/our-products-section';
import PrivateLabelSection from '@/components/ui/private-label-section';
import CustomProductSection from '@/components/ui/custom-product-section';
import ExportSection from '@/components/ui/export-section';
import GlobalReachSection from '@/components/ui/global-reach-section';
import NewsSection from '@/components/ui/news-section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <WhatWeOfferSection />
      <OurProductsSection />
      <PrivateLabelSection />
      <CustomProductSection />
      <ExportSection />
      <GlobalReachSection />
      <NewsSection locale={locale} />
    </main>
  );
}
