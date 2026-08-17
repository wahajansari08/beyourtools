import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  title: "Jsonifyr — JSON tools for developers",
  description:
    "Format, validate, convert, and inspect JSON entirely in your browser. Formatter, diff, CSV/YAML/XML conversion, JWT decoder, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink-950 font-body text-mist-100 antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-56px-100px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
