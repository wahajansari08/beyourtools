import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-speed-changer");

export default function Page() {
  return renderVideoTool("video-speed-changer");
}

