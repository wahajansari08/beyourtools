import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("add-audio-to-video");

export default function Page() {
  return renderVideoTool("add-audio-to-video");
}
