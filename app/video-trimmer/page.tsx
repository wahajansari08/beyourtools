import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-trimmer");

export default function Page() {
  return renderVideoTool("video-trimmer");
}

