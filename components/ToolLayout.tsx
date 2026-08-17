import { ReactNode } from "react";
import ToolHeader from "./ToolHeader";
import RelatedTools from "./RelatedTools";
import type { ToolCategory } from "@/lib/tools-config";

export default function ToolLayout({
  eyebrow,
  title,
  description,
  category,
  currentSlug,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  category: ToolCategory;
  currentSlug: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <ToolHeader eyebrow={eyebrow} title={title} description={description} />
      {children}
      <RelatedTools category={category} currentSlug={currentSlug} />
    </div>
  );
}
