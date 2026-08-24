import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("remove-audio-from-video");

export default function Page() {
  return renderVideoTool("remove-audio-from-video");
}

