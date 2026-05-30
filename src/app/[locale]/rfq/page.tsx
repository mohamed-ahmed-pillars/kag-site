import { setRequestLocale } from 'next-intl/server';
import { RfqForm } from './rfq-form';

export default async function RfqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <RfqForm />
    </main>
  );
}
