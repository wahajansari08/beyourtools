import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { buildVideoMetadata } from "@/components/video/videoPageHelpers";
import { getVideoTool } from "@/lib/video-tools-config";
import { notFound } from "next/navigation";
import SocialVideoResizerClient from "./SocialVideoResizerClient";
import SocialVideoResizerPage from "./SocialVideoResizerPage";

const __enMetadata: Metadata = buildVideoMetadata("social-video-resizer");

export default function Page() {
  const tool = getVideoTool("social-video-resizer");
  if (!tool) notFound();
  return <SocialVideoResizerPage tool={tool} client={<SocialVideoResizerClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "social-video-resizer", __enMetadata);
}
