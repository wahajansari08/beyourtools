import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ImageResizerClient from "./ImageResizerClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("image-resizer");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "image-resizer", __enMetadata);
}

export default function ImageResizerClientPage() {
  return <DesignToolPageShell tool={tool} client={<ImageResizerClient />} />;
}
