import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "pt", "hi", "ur", "fr", "de", "zh", "ar"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
  hi: "हिन्दी",
  ur: "اردو",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ar: "العربية",
};

/** Locales that read right-to-left */
export const rtlLocales: Locale[] = ["ur", "ar"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale: "en",
  // English keeps its exact current URLs (no prefix); other locales are prefixed.
  localePrefix: "as-needed",
});
