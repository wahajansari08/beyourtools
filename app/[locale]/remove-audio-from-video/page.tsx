import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

const __enMetadata = buildVideoMetadata("remove-audio-from-video");

export default function Page() {
  return renderVideoTool("remove-audio-from-video");
}



export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "remove-audio-from-video", __enMetadata);
}
