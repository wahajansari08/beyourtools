import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioCutterClient from "./AudioCutterClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Audio Cutter - Cut Audio Files Online Free | BeYourTools",
  description: "Cut any audio file online for free. Supports MP3, WAV, FLAC, M4A, OGG and more. Select start/end, preview, and download. Browser-based, no upload.",
  keywords: "audio cutter, cut audio online, trim audio online, audio trimmer, cut wav online, cut flac online",
  path: "/audio-cutter",
});

export default function AudioCutterPage() {
  return (
    <AudioToolPage
      slug="audio-cutter"
      title="Audio Cutter"
      categoryLabel="Cutters & Trimmers"
      tagline="Cut any audio file by selecting a start and end point. Supports MP3, WAV, FLAC, M4A, OGG and more formats."
      description="Free online audio cutter supporting multiple formats. Select a region, preview it, and download the cut section."
      howTo={[
        { title: "Upload audio", text: "Drop your audio file (MP3, WAV, FLAC, M4A, OGG) or click to browse." },
        { title: "Select region", text: "Use the start/end sliders or type exact values to define the section you want to keep." },
        { title: "Preview", text: "Click Preview to listen to only the selected region before cutting." },
        { title: "Cut and download", text: 'Click "Cut Audio" then download your clip.' },
      ]}
      features={[
        "Supports MP3, WAV, FLAC, M4A, OGG, Opus and more",
        "Visual start/end selection with sliders",
        "Precise timestamp number inputs",
        "Preview selection before cutting",
        "Output format matches input format",
        "100% browser-based, no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "What formats are supported?", answer: "MP3, WAV, FLAC, M4A/AAC, OGG, Opus and WebM. The output is in the same format as the input." },
        { question: "Can I cut to an exact millisecond?", answer: "The number inputs accept decimal values (e.g. 10.5 seconds). Sub-100ms accuracy depends on the audio codec keyframe spacing." },
        { question: "Is my audio file uploaded anywhere?", answer: "No. All processing happens locally in your browser. Your files never leave your device." },
        { question: "Does cutting lower the quality of my audio?", answer: "No, not for MP3, M4A, OGG, FLAC, Opus or WebM files. The tool copies the frames inside your selection without decoding or re-encoding them, so the kept audio is bit-identical to the original. WAV files are the one exception: they are rewritten as 16-bit PCM, so a standard 16-bit WAV comes through unchanged." },
        { question: "How exact is the cut point?", answer: "The cut lands on the nearest audio frame boundary, not on the exact millisecond. For MP3 that is within about 26 milliseconds of the time you set, and other formats have their own frame sizes. If you need a cut at an exact sample, use a desktop audio editor instead." },
        { question: "Can I cut several clips from one file in a single run?", answer: "No. Each run exports one continuous region. To make a second clip, click Process another file, upload the same file again and set a new start and end. Your original file is never changed, so you can repeat this as often as you like." },
      ]}
    >
      <AudioCutterClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "audio-cutter", __enMetadata);
}
