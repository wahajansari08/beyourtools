import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";
import { websiteSchema, organizationSchema, SITE } from "@/lib/seo";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500","600","700"] });
const body    = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono    = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "BeYourTools — Free Online Developer Tools",
    template: "%s | BeYourTools",
  },
  description: "Free browser-based tools for developers — JSON formatter, validator, converter, image converter, PDF tools and more. No upload, no sign-up, 100% private.",
  keywords: "JSON tools, image converter, PDF tools, JSON formatter, JSON validator, free developer tools, online tools",
  authors: [{ name: "BeYourTools", url: SITE.url }],
  creator: "BeYourTools",
  publisher: "BeYourTools",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    title: "BeYourTools — Free Online Developer Tools",
    description: "Free browser-based tools for developers — JSON, image, PDF and more. Nothing leaves your browser.",
    images: [{ url: `${SITE.url}/og-default.png`, width: 1200, height: 630, alt: "BeYourTools" }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: "BeYourTools — Free Online Developer Tools",
    description: "Free browser-based tools for developers — JSON, image, PDF and more.",
    images: [`${SITE.url}/og-default.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('byt-theme');var cls=t==='light'?'light':t==='dark'?'dark':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(cls);}catch(e){}})();` }} />
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
      </head>
      <body className="min-h-screen bg-page font-body text-secondary antialiased">
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="min-h-[calc(100vh-56px-100px)]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
