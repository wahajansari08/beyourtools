import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioJoinerClient from "./AudioJoinerClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Audio Joiner - Join Audio Files Online Free | BeYourTools",
  description: "Join multiple audio files of any format into one. Supports MP3, WAV, FLAC, M4A, OGG. Reorder files and download merged audio. Free, browser-based.",
  keywords: "audio joiner, join audio files online, merge audio files, combine audio online, audio merger free",
  path: "/audio-joiner",
});

export default function AudioJoinerPage() {
  return (
    <AudioToolPage
      slug="audio-joiner"
      title="Audio Joiner"
      categoryLabel="Mergers"
      tagline="Join multiple audio files from any supported format into a single file. Choose your output format and reorder files before joining."
      description="Free online audio joiner. Combine MP3, WAV, FLAC, M4A and OGG files into one audio file. Browser-based, no upload."
      howTo={[
        { title: "Choose output format", text: "Select MP3, WAV or OGG as your output." },
        { title: "Add files", text: "Drop multiple audio files or click to browse. Mix and match formats." },
        { title: "Reorder", text: "Use ▲ / ▼ to arrange files in playback order." },
        { title: "Join and download", text: 'Click "Join" and download the merged file.' },
      ]}
      features={[
        "Supports MP3, WAV, FLAC, M4A, OGG, Opus input",
        "Output to MP3, WAV or OGG",
        "Reorderable file list",
        "Shows duration and size per file",
        "Total duration summary",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "Can I mix different audio formats?", answer: "Yes. You can upload MP3, WAV, FLAC, M4A and OGG files in the same batch. All files are decoded and re-encoded to your chosen output format." },
        { question: "Does the order of files matter?", answer: "Yes. Files are joined in the order shown in the list. Use the ▲ / ▼ buttons to rearrange them before joining." },
        { question: "What is the difference between Audio Joiner and MP3 Merger?", answer: "The Audio Joiner supports multiple input formats and lets you choose the output format. The MP3 Merger is dedicated to MP3-only input and output." },
        { question: "Which output format should I choose: MP3, WAV or OGG?", answer: "Pick MP3 for sharing and playback everywhere: it is encoded at 192 kbps, about 1.4 MB per minute. Pick WAV only if you need lossless quality for editing, since it is uncompressed: about 10.6 MB per minute, roughly 7 times the size of the MP3. Pick OGG for a smaller open format file at about 128 kbps, roughly 1 MB per minute." },
        { question: "Can I join files recorded at different sample rates, or mix mono and stereo?", answer: "Yes. Every file is decoded first and then re-encoded to one uniform output, so a mono voice memo and a stereo music track join in the same file without failing. Files that are damaged or use an unusual codec can still fail even if the extension looks familiar." },
        { question: "Is there a pause or a crossfade between the joined files?", answer: "No. Files are joined end to end with no gap and no crossfade. If you need a pause, add a short silent audio file between the clips before joining." },
      ]}
    >
      <AudioJoinerClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "audio-joiner", __enMetadata);
}
