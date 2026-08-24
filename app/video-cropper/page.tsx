import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("video-cropper");

export default function Page() {
  return renderVideoTool("video-cropper");
}

