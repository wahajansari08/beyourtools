import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-to-gif");

export default function Page() {
  return renderVideoTool("video-to-gif");
}

