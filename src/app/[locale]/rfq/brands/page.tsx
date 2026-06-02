import { setRequestLocale } from 'next-intl/server';
import { BrandsWizard } from '@/components/ui/rfq/brands-wizard';

export default async function RfqBrandsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product } = await searchParams;
  setRequestLocale(locale);
  return (
    <main className="relative w-full overflow-hidden px-4 py-24 text-foreground">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      <BrandsWizard preselectProductId={product} />
    </main>
  );
}
