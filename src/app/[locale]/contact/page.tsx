import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from './contact-form';
import { FlowButton } from '@/components/ui/flow-button';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tFooter = await getTranslations('footer');

  const socials = [
    { src: '/icons/whatsapp.svg', label: 'WhatsApp', href: 'https://wa.me/201080843334' },
    { src: '/icons/facebook.svg', label: 'Facebook', href: 'https://www.facebook.com/share/1DNJqy7Bou/?mibextid=wwXIfr' },
    { src: '/icons/instagram.svg', label: 'Instagram', href: 'https://www.instagram.com/kag.egypt' },
  ];

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

        <div className="grid gap-8 md:grid-cols-5">
          <aside className="space-y-6 md:col-span-2">
            <div className="rounded-3xl border border-primary/10 bg-card/60 p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold text-primary">{t('info.heading')}</h2>
              <p className="mt-2 text-sm text-primary/70">{t('info.intro')}</p>

              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-primary/60">{t('info.address')}</span>
                    <span className="text-primary">{tFooter('address')}</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-primary">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider text-primary/60">{t('info.phone')}</span>
                    <a href="tel:+201080838555" className="text-primary hover:text-primary/70">
                      {tFooter('phoneServiceLabel')}: <span dir="ltr">+20 108 083 8555</span>
                    </a>
                    <a href="tel:+201080843334" className="text-primary hover:text-primary/70">
                      {tFooter('phoneSuggestionsLabel')}: <span dir="ltr">+20 108 084 3334</span>
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-primary">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-primary/60">{t('info.email')}</span>
                    <a href="mailto:wecare@kagegypt.com" dir="ltr" className="text-primary hover:text-primary/70">
                      wecare@kagegypt.com
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-6 border-t border-primary/10 pt-5">
                <span className="text-xs uppercase tracking-wider text-primary/60">{t('info.followUs')}</span>
                <div className="mt-3 flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="rounded-xl border border-dotted border-primary/30 p-2.5 transition-transform hover:-translate-y-0.5"
                    >
                      <Image src={s.src} alt={s.label} width={20} height={20} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/10 bg-card/60 p-6 sm:p-8">
              <h3 className="font-display text-base font-bold text-primary">{t('rfq.heading')}</h3>
              <p className="mt-2 text-sm text-primary/70">{t('rfq.intro')}</p>
              <div className="mt-4">
                <FlowButton href="/rfq" text={t('rfq.cta')} variant="secondary" />
              </div>
            </div>
          </aside>

          <section className="md:col-span-3">
            <ContactForm />
          </section>
        </div>
      </div>
    </main>
  );
}
