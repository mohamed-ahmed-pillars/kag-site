'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowUp, Mail as MailIcon, MapPin, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Href = React.ComponentProps<typeof Link>['href'];

const quickLinks: { key: string; href: Href }[] = [
  { key: 'home', href: '/' },
  { key: 'products', href: '/products' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
];

const serviceLinks: { key: string; href: Href }[] = [
  { key: 'privateLabel', href: '/private-label' },
  { key: 'customProduct', href: '/custom-product' },
  { key: 'export', href: '/export' },
];

const companyLinks: { key: 'terms' | 'privacy'; href: Href }[] = [
  { key: 'terms', href: '/terms' },
  { key: 'privacy', href: '/privacy' },
];

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect width="22" height="22" x="1" y="1" rx="3" fill="#0A66C2" />
    <path
      fill="#fff"
      d="M8.05 18.5H5.4V9.95h2.65v8.55zM6.72 8.77a1.54 1.54 0 1 1 0-3.08 1.54 1.54 0 0 1 0 3.08zM18.6 18.5h-2.65v-4.16c0-.99-.02-2.27-1.38-2.27-1.39 0-1.6 1.08-1.6 2.2v4.23H10.3V9.95h2.55v1.17h.04c.35-.67 1.22-1.38 2.51-1.38 2.69 0 3.19 1.77 3.19 4.07v4.69z"
    />
  </svg>
);

type Social =
  | { src: string; label: string; href: string }
  | { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; href: string };

const socials: Social[] = [
  {
    src: '/icons/facebook.svg',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1DNJqy7Bou/?mibextid=wwXIfr',
  },
  {
    src: '/icons/instagram.svg',
    label: 'Instagram',
    href: 'https://www.instagram.com/kag.egypt',
  },
  {
    Icon: LinkedinIcon,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/kagegypt/',
  },
  {
    src: '/icons/whatsapp.svg',
    label: 'WhatsApp',
    href: 'https://wa.me/201033322050',
  },
  {
    src: '/icons/maildotru.svg',
    label: 'Email',
    href: 'mailto:wecare@kagegypt.com',
  },
];

const iconButton =
  'hover:-translate-y-1 rounded-xl border border-dotted border-foreground/30 p-2.5 transition-transform';

function handleScrollTop() {
  window.scroll({ top: 0, behavior: 'smooth' });
}

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full border-b border-t border-foreground/10 bg-transparent px-2 md:px-4">
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <Link href="/" aria-label="KAG">
          <Image
            src="/navbarLogo.svg"
            alt="KAG"
            width={120}
            height={40}
            className="h-auto w-32 md:w-48"
          />
        </Link>
        <p className="bg-transparent text-center text-xs leading-5 text-foreground/70 md:text-left">
          {t('blurb')}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="border-b border-dotted border-foreground/20" />
        <div className="py-10">
          <div className="grid grid-cols-2 gap-8 leading-6 md:flex md:flex-row md:justify-between">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('quickLinks')}
              </h4>
              <ul className="flex flex-col space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.key} className="flow-root">
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-xs"
                    >
                      {tNav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('services')}
              </h4>
              <ul className="flex flex-col space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.key} className="flow-root">
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-xs"
                    >
                      {tNav(`services.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('contactUs')}
              </h4>
              <ul className="flex flex-col space-y-3">
                <li className="flex items-start gap-2 text-sm text-foreground/70 md:text-xs">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
                  <span>{t('address')}</span>
                </li>
                <li className="flex items-start gap-2 text-sm md:text-xs">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
                  <div className="flex flex-col gap-0.5">
                    <a
                      href="tel:+201080838555"
                      className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                    >
                      {t('phoneServiceLabel')}: <span dir="ltr">+20 108 083 8555</span>
                    </a>
                    <a
                      href="tel:+201080843334"
                      className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                    >
                      {t('phoneSuggestionsLabel')}: <span dir="ltr">+20 108 084 3334</span>
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-2 text-sm md:text-xs">
                  <MailIcon className="h-4 w-4 shrink-0 text-foreground/50" />
                  <a
                    href="mailto:wecare@kagegypt.com"
                    dir="ltr"
                    className="text-foreground/70 transition-colors duration-200 hover:text-foreground"
                  >
                    wecare@kagegypt.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-foreground/50">
                {t('company')}
              </h4>
              <ul className="flex flex-col space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.key} className="flow-root">
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground md:text-xs"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-b border-dotted border-foreground/20" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 gap-y-6 px-6">
        {socials.map((social) => (
          <a
            key={social.label}
            aria-label={social.label}
            href={social.href}
            rel="noreferrer"
            target="_blank"
            className={iconButton}
          >
            {'src' in social ? (
              <Image src={social.src} alt={social.label} width={20} height={20} className="h-5 w-5" />
            ) : (
              <social.Icon className="h-5 w-5" />
            )}
          </a>
        ))}
        <button
          type="button"
          onClick={handleScrollTop}
          aria-label={t('scrollTop')}
          className={iconButton}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row flex-wrap items-center justify-center gap-1 text-foreground/60">
          <span>©</span>
          <span>{currentYear}</span>
          <span className="font-bold text-primary">KAG.</span>
          <span>{t('rights')}</span>
          <span className="mx-1">·</span>
          <span>{t('madeBy')}</span>
          <a
            href="https://technologypillars.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground transition-colors duration-200 hover:text-primary"
          >
            Technology Pillars
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
