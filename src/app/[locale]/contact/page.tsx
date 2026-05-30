import { setRequestLocale } from 'next-intl/server';
import { ContactForm } from './contact-form';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <ContactForm />
    </main>
  );
}
