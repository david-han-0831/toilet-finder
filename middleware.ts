import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    '/',
    '/(de|ko|en)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
}; 