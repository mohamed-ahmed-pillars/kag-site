import type { Locale } from '@/i18n/routing';

export type Product = {
  slug: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  image: string;
  category: string;
};

export const products: Product[] = [];
