import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import YoutubeThumbnailClient from "./YoutubeThumbnailClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("youtube-thumbnail-downloader");

const __enMetadata: Metadata = designToolMetadata(tool);

export default function Page() {
  return <DesignToolPageShell tool={tool} client={<YoutubeThumbnailClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "youtube-thumbnail-downloader", __enMetadata);
}
