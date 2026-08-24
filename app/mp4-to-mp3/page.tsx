import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("mp4-to-mp3");

export default function Page() {
  return renderVideoTool("mp4-to-mp3");
}
