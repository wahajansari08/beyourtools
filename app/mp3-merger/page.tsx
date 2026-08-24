import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3MergerClient from "./Mp3MergerClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MP3 Merger - Merge Multiple MP3 Files Online Free | BeYourTools",
  description: "Merge multiple MP3 files into one seamless audio file. Reorder files, preview, and download the merged MP3. Free and browser-based.",
  keywords: "mp3 merger, merge mp3 files, combine mp3 online, join mp3 files, mp3 joiner online free",
  alternates: { canonical: `${SITE.url}/mp3-merger` },
};

export default function Mp3MergerPage() {
  return (
    <AudioToolPage
      slug="mp3-merger"
      title="MP3 Merger"
      categoryLabel="Mergers"
      tagline="Combine multiple MP3 files into one seamless audio file. Add files, drag to reorder, and download the merged result."
      description="Free online MP3 merger. Add MP3 files, set the order, and download a single merged MP3. Browser-based, no upload."
      howTo={[
        { title: "Add MP3 files", text: "Drop multiple MP3 files or click to browse. You can add files multiple times to build your list." },
        { title: "Reorder", text: "Use the ▲ / ▼ buttons to arrange files in the order you want them to play." },
        { title: "Merge", text: 'Click "Merge" to join all files in sequence.' },
        { title: "Download", text: "Preview the merged audio and download it as a single MP3." },
      ]}
      features={[
        "Add unlimited MP3 files",
        "Drag-and-reorder file list",
        "Shows file size and duration for each file",
        "Shows total merged duration",
        "Audio preview of merged output",
        "100% browser-based - no upload",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "Is there a limit on how many files I can merge?", answer: "There is no hard limit, but merging many large files may be slow due to browser memory constraints. For best performance, keep total file size under 200 MB." },
        { question: "Will there be a gap between merged files?", answer: "No silence is added between files. They are concatenated back-to-back. If you need silence between files, add a short silent MP3 between them." },
        { question: "Can I merge MP3 files with different bitrates?", answer: "Yes. The tool handles files with different bitrates and re-encodes the output at 192 kbps." },
      ]}
    >
      <Mp3MergerClient />
    </AudioToolPage>
  );
}
