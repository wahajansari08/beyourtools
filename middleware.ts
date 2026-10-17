import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Locale detection (Accept-Language) + prefix handling. English ("en",
// the default locale) is served with NO URL prefix — existing URLs are
// byte-identical. Other locales are prefixed (/es/, /fr/, ...).
// Canonicals + hreflang are computed statically per page (see
// lib/i18n-content.ts), so the middleware stays stateless.
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, static assets, and well-known files (sitemap.xml,
  // robots.txt, llms.txt, manifest, icons). Everything else is locale-routed.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
