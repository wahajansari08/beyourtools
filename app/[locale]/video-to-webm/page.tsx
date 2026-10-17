import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

const __enMetadata = buildVideoMetadata("video-to-webm");

export default function Page() {
  return renderVideoTool("video-to-webm");
}



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "video-to-webm", __enMetadata);
}
