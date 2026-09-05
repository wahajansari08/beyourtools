import type { Metadata } from "next";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "JSON Editor - BeYourTools",
  description: "Edit JSON directly and see a live, structured preview update as you type.",
  keywords: "json editor, online json editor, json tree view, format json",
  path: "/json-editor",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
