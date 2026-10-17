import type { ReactNode } from "react";

// Pass-through root layout. The real <html>/<body> document shell (including
// lang/dir attributes, fonts, theme bootstrap script, and ad/analytics tags)
// lives in app/[locale]/layout.tsx so every locale gets correct attributes.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
