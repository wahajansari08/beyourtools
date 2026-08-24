import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-compressor");

export default function Page() {
  return renderVideoTool("video-compressor");
}

