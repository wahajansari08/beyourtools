import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioCutterClient from "./AudioCutterClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Audio Cutter - Cut Audio Files Online Free | BeYourTools",
  description: "Cut any audio file online for free. Supports MP3, WAV, FLAC, M4A, OGG and more. Select start/end, preview, and download. Browser-based, no upload.",
  keywords: "audio cutter, cut audio online, trim audio online, audio trimmer, cut wav online, cut flac online",
  alternates: { canonical: `${SITE.url}/audio-cutter` },
};

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
      ]}
    >
      <AudioCutterClient />
    </AudioToolPage>
  );
}
