import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-merger");

export default function Page() {
  return renderVideoTool("video-merger");
}

