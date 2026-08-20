import { buildVideoMetadata, renderVideoTool } from "@/components/video/videoPageHelpers";

export const metadata = buildVideoMetadata("mkv-to-mp4");

export default function Page() {
  return renderVideoTool("mkv-to-mp4");
}

