import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("mov-to-mp4");

export default function Page() {
  return renderVideoTool("mov-to-mp4");
}

