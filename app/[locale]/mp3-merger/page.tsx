import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3MergerClient from "./Mp3MergerClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "MP3 Merger - Merge MP3 Files Online Free | BeYourTools",
  description: "Merge multiple MP3 files into a single audio file. Reorder files, preview, and download the merged MP3. Free and browser-based.",
  keywords: "mp3 merger, merge mp3 online, merge mp3 files, combine mp3 online, join mp3 files",
  path: "/mp3-merger",
});

export default function Mp3MergerPage() {
  return (
    <AudioToolPage
      slug="mp3-merger"
      title="MP3 Merger"
      categoryLabel="Mergers"
      tagline="Combine multiple MP3 files into a single audio file. Add files, reorder them with the arrow buttons, and download the merged result."
      description="Free online MP3 merger. Add MP3 files, set the order, and download a single merged MP3. Browser-based, no upload."
      howTo={[
        { title: "Add MP3 files", text: "Drop multiple MP3 files or click to browse. You can add files multiple times to build your list." },
        { title: "Reorder", text: "Use the ▲ / ▼ buttons to arrange files in the order you want them to play." },
        { title: "Merge", text: 'Click "Merge" to join all files in sequence.' },
        { title: "Download", text: "Preview the merged audio and download it as a single MP3." },
      ]}
      features={[
        "No set limit on the number of files",
        "Reorder files with up and down buttons",
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
        { question: "How big will the merged MP3 be?", answer: "The output is always encoded at 192 kbps, so size depends only on total length: about 1.4 MB per minute. Three 3 minute songs merge into 9 minutes, about 13 MB." },
        { question: "Can I add a pause or a crossfade between songs?", answer: "No. Files are joined end to end with no silence and no crossfade, so one song starts the instant the previous one ends. If you need a pause, merge a short silent MP3 between the songs first." },
        { question: "What happens if my MP3s have different bitrates or sample rates?", answer: "They still merge. Every file is decoded and re-encoded to one uniform 192 kbps MP3, so mixed bitrates, sample rates and mono/stereo files are matched automatically. Re-encoding also means a small quality loss on files that were already MP3, since they are compressed twice." },
      ]}
    >
      <Mp3MergerClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "mp3-merger", __enMetadata);
}
