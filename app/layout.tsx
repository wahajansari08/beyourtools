import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";
import CookieBanner from "@/components/CookieBanner";
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
    template: "%s | BeYourTools",
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
  alternates: { canonical: SITE.url },
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
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('byt-theme');var cls=t==='light'?'light':t==='dark'?'dark':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(cls);}catch(e){}})();`,
          }}
        />

        <JsonLd data={[websiteSchema(), organizationSchema()]} />
      </head>

      <body className="min-h-screen bg-page font-body text-secondary antialiased">
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="min-h-[calc(100vh-56px-100px)]">
            {children}
          </main>
          <Footer />
          <CookieBanner />
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
