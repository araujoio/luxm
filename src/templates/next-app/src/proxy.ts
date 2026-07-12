import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import luxm from '../luxm.json';

const intlMiddleware = createMiddleware(routing);

const allLocales = new Set<string>(luxm.i18n.locales);
const supportedLocales = new Set<string>(luxm.i18n.supportedLocales);
const defaultLocale = luxm.i18n.defaultLocale;
const knownRoutes = new Set<string>([
  ...(luxm.routes.publicRoutes as string[]).map(r => r.startsWith('/') ? r : `/${r}`),
  ...(luxm.routes.privateRoutes as string[]).map(r => r.startsWith('/') ? r : `/${r}`),
]);

export default function middleware(request: NextRequest) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const locale = segments[0] ?? '';
  const routePath = '/' + segments.slice(1).join('/');

  if (locale && allLocales.has(locale) && !supportedLocales.has(locale)) {
    const routeExists = knownRoutes.has(routePath);

    if (!routeExists) {
      const response = intlMiddleware(request);
      const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
      const safeLocale = cookieLocale && supportedLocales.has(cookieLocale)
        ? cookieLocale
        : defaultLocale;
      response.cookies.set('NEXT_LOCALE', safeLocale);
      return response;
    }

    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const fallbackLocale = cookieLocale && supportedLocales.has(cookieLocale)
      ? cookieLocale
      : defaultLocale;

    const url = request.nextUrl.clone();
    url.pathname = `/${fallbackLocale}/locale-not-supported`;
    url.searchParams.set('locale', locale);

    if (routePath !== '/') {
      url.searchParams.set('path', routePath);
    }

    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};