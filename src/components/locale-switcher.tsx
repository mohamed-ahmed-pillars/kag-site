import Link from 'next/link';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';

export async function LocaleSwitcher() {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? '/';
  const stripped = stripLocalePrefix(pathname);
  return (
    <nav aria-label="Language">
      {routing.locales.map((loc) => (
        <Link key={loc} href={loc === routing.defaultLocale ? stripped : `/${loc}${stripped}`}>
          {loc.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}

function stripLocalePrefix(pathname: string): string {
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    if (pathname === `/${loc}`) return '/';
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length);
  }
  return pathname;
}
