import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("gif-to-mp4");

export default function Page() {
  return renderVideoTool("gif-to-mp4");
}

