import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import ImageCropperClient from "./ImageCropperClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("image-cropper");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "image-cropper", __enMetadata);
}

export default function ImageCropperClientPage() {
  return <DesignToolPageShell tool={tool} client={<ImageCropperClient />} />;
}
