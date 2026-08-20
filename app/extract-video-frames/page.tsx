import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("extract-video-frames");

export default function Page() {
  return renderVideoTool("extract-video-frames");
}

