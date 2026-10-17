import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cabin, Noto_Sans_Devanagari, Noto_Nastaliq_Urdu, Noto_Sans_SC, Noto_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";
import CookieBanner from "@/components/CookieBanner";
import ChatSupport from "@/components/ChatSupport";
import { websiteSchema, organizationSchema, SITE } from "@/lib/seo";
import { routing, isLocale, rtlLocales, type Locale } from "@/i18n/routing";

// Single site-wide Latin font: Cabin (weights 400-700). The legacy CSS variable
// names (--font-display / --font-body / --font-mono) are all aliased to it
// in globals.css so every font-family reference resolves to Cabin.
//
// Script companions (documented exception to the Cabin-only rule): Cabin covers
// Latin only, so Hindi (Devanagari) and Urdu (Arabic script) need real fonts or
// they render as tofu. Noto Sans Devanagari and Noto Nastaliq Urdu are loaded
// with unicode-range subsets, so browsers download them ONLY when Devanagari or
// Arabic-script characters appear on the page, Latin visitors fetch nothing extra
// extra. The font stack puts Cabin first, so all Latin text still uses Cabin.
//
// Added 2026-10-17 (documented exception, same pattern): Chinese (zh) loads
// Noto Sans SC (--font-sans-sc) and Arabic (ar) loads Noto Sans Arabic
// (--font-sans-arabic). Urdu already covers Arabic script via Noto Nastaliq
// Urdu; Noto Sans Arabic gives the ar locale a cleaner UI-weight companion.
// All companions use unicode-range subsets and sit after Cabin in the stack.
const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  weight: ["400", "500", "600", "700"],
});
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700"],
});
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  weight: ["400", "500", "600", "700"],
});
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans-sc",
  weight: ["400", "500", "700"],
});
const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans-arabic",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
};

function localeUrl(locale: string, pathname: string): string {
  const clean = pathname === "/" ? "" : pathname;
  return locale === routing.defaultLocale
    ? `${SITE.url}${clean || "/"}`
    : `${SITE.url}/${locale}${clean}`;
}

/**
 * Base metadata (title template, description). Individual pages own their
 * absolute self-referencing canonical + hreflang via localizeMetadata.
 * this layout intentionally does NOT use headers(), so every page stays
 * statically prerenderable.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: "BeYourTools - Free Online Tools for Everyone",
      template: "%s",
    },
    description:
      "200+ free browser-based developer and utility tools: JSON, image converter, PDF, audio, video, and QR codes. Fast, private, no sign-up.",
    openGraph: { locale: "en_US" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cabin.variable} ${notoDevanagari.variable} ${notoNastaliqUrdu.variable} ${notoSansSC.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('byt-theme');var cls=t==='light'?'light':t==='dark'?'dark':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(cls);}catch(e){}if(typeof window!=='undefined'){window.addEventListener('error',function(e){if(e.filename&&(e.filename.indexOf('chrome-extension://')===0||e.filename.indexOf('moz-extension://')===0)){e.stopImmediatePropagation();e.preventDefault();}},true);window.addEventListener('unhandledrejection',function(e){var s=e.reason&&(e.reason.stack||e.reason.message);if(s&&(s.indexOf('chrome-extension://')!==-1||s.indexOf('moz-extension://')!==-1)){e.stopImmediatePropagation();e.preventDefault();}},true);}})();`,
          }}
        />

        <JsonLd data={[websiteSchema(), organizationSchema()]} />

        {/* Google AdSense */}
        <script
          async
          suppressHydrationWarning
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8289649754182863"
          crossOrigin="anonymous"
        />

        {/* Ad blocking recovery */}
        <script
          async
          suppressHydrationWarning
          src="https://fundingchoicesmessages.google.com/i/pub-8289649754182863?ers=1"
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`,
          }}
        />
      </head>

      <body className="min-h-screen bg-page font-body text-secondary antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Navbar />
            <main id="main-content" className="min-h-[calc(100vh-56px-100px)]">
              {children}
            </main>
            <Footer />
            <CookieBanner />
            <ChatSupport />
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y840CEVDN3"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y840CEVDN3');
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
