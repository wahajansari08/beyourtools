import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-converter");

export default function Page() {
  return renderVideoTool("video-converter");
}

