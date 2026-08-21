import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("webm-to-mp4");

export default function Page() {
  return renderVideoTool("webm-to-mp4");
}
