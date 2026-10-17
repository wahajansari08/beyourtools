import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

const __enMetadata = buildVideoMetadata("webm-to-mp4");

export default function Page() {
  return renderVideoTool("webm-to-mp4");
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "webm-to-mp4", __enMetadata);
}
