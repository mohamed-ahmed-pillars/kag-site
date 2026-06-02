import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { fontVariables } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'KAG — Khalid Abdelhamid Group | Egyptian Food Manufacturer',
    template: '%s | KAG',
  },
  description:
    'KAG (Khalid Abdelhamid Group) is an Egyptian food manufacturer producing sauces, jams, juices, fava beans, and condiments for retail, private label, and global export from Cairo.',
  applicationName: 'KAG',
  icons: {
    icon: [
      { url: '/icon-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png',  media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/icon-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png',  media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: [
      { url: '/icon-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png',  media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir} className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale as Locale}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
