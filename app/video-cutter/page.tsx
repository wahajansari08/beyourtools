import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-cutter");

export default function Page() {
  return renderVideoTool("video-cutter");
}

