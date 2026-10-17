import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ImageCompressorClient from "./ImageCompressorClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("image-compressor");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "image-compressor", __enMetadata);
}

export default function ImageCompressorClientPage() {
  return <DesignToolPageShell tool={tool} client={<ImageCompressorClient />} />;
}
