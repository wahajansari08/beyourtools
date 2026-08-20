import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-thumbnail-generator");

export default function Page() {
  return renderVideoTool("video-thumbnail-generator");
}

