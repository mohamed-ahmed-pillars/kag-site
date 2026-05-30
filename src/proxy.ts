import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: Request) {
  const response = intlMiddleware(request as never);
  try {
    const url = new URL(request.url);
    response.headers.set('x-pathname', url.pathname);
  } catch {
    /* noop */
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
