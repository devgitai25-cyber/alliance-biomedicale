import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n.config';

export default createMiddleware({
    // A list of all locales that are supported
    locales,

    // Used when no locale matches
    defaultLocale,

    // Always use locale prefix
    localePrefix: 'always',
});

export const config = {
    // Match all pathnames except for:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /favicon.ico, /robots.txt, etc. (static files)
    // - /admin (Admin routes)
    matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)'],
};
