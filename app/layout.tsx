import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";
import CookieBanner from "@/components/CookieBanner";
import ChatSupport from "@/components/ChatSupport";
import { websiteSchema, organizationSchema, SITE } from "@/lib/seo";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "BeYourTools - Free Online Tools for Everyone",
    template: "%s",
  },
  description:
    "200+ free browser-based tools - JSON formatter, image converter, PDF editor, audio tools, video tools, QR code generator and more. No upload, no sign-up.",
  keywords:
    "free online tools, JSON formatter, image converter, PDF tools, audio converter, mp3 converter, video compressor, QR code generator, barcode generator",
  authors: [{ name: "BeYourTools", url: SITE.url }],
  creator: "BeYourTools",
  publisher: "BeYourTools",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    title: "BeYourTools - Free Online Tools for Everyone",
    description:
      "200+ free browser-based tools - JSON, image, PDF, audio, video, QR codes and more. Nothing leaves your browser.",
    images: [
      {
        url: `${SITE.url}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "BeYourTools - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: "BeYourTools - Free Online Tools for Everyone",
    description:
      "200+ free browser-based tools - JSON, image, PDF, audio, video, QR codes and more.",
    images: [`${SITE.url}/og-default.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
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

        {/* Error protection message for blocked ad scripts */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){var adScript=document.querySelector('script[src*="adsbygoogle.js"]');function showMessage(){if(document.getElementById('ad-blocking-message'))return;var message=document.createElement('div');message.id='ad-blocking-message';message.setAttribute('role','status');message.style.cssText='position:fixed;bottom:16px;left:16px;right:16px;z-index:2147483647;padding:12px 16px;border:1px solid #f0c36d;border-radius:6px;background:#fff8e1;color:#5f4300;font:14px/1.4 Arial,sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.12)';message.textContent='You are seeing this message because ad or script blocking software is interfering with this page. Disable it, then reload the page.';document.body&&document.body.appendChild(message)}if(adScript){adScript.addEventListener('error',showMessage);setTimeout(function(){if(!window.adsbygoogle)showMessage()},2000)}})();`,
          }}
        />
      </head>

      <body className="min-h-screen bg-page font-body text-secondary antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="min-h-[calc(100vh-56px-100px)]">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <ChatSupport />
        </ThemeProvider>

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
