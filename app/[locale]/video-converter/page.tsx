import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

const __enMetadata = buildVideoMetadata("video-converter");

export default function Page() {
  return renderVideoTool("video-converter");
}



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "video-converter", __enMetadata);
}
