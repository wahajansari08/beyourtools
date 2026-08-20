import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-resizer");

export default function Page() {
  return renderVideoTool("video-resizer");
}

