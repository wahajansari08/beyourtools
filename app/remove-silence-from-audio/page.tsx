import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import RemoveSilenceClient from "./RemoveSilenceClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Remove Silence from Audio - Online Free | BeYourTools",
  description: "Automatically remove silent sections from audio files online for free. Adjust threshold, minimum duration and padding. Browser-based, no upload.",
  keywords: "remove silence from audio, silence remover, remove quiet parts audio, trim silence audio online, audio silence detector",
  alternates: { canonical: `${SITE.url}/remove-silence-from-audio` },
};

export default function RemoveSilencePage() {
  return (
    <AudioToolPage
      slug="remove-silence-from-audio"
      title="Remove Silence from Audio"
      categoryLabel="Effects & Processing"
      tagline="Automatically strip silent gaps from your audio. Ideal for podcasts, recordings and interviews. Adjust threshold and minimum duration to protect natural speech pauses."
      description="Free online silence remover for audio. Removes silent sections from MP3, WAV, FLAC and more. Browser-based, no upload."
      howTo={[
        { title: "Set threshold", text: "-40 dBFS is a safe default. Increase (e.g. -30 dBFS) to remove more, decrease (e.g. -50 dBFS) to be more conservative." },
        { title: "Set minimum duration", text: "Only silence longer than this value is removed. 0.5s prevents removing natural brief pauses in speech." },
        { title: "Set padding", text: "Keeps a small buffer of silence around speech to avoid clipping words at their edges." },
        { title: "Upload and process", text: "Drop your audio file, click Remove silence, and download the result." },
      ]}
      features={[
        "Configurable silence threshold (-60 to -20 dBFS)",
        "Minimum silence duration control",
        "Speech padding to protect word edges",
        "Supports MP3, WAV, FLAC, M4A, OGG input",
        "Audio preview before and after",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "Will this remove speech?", answer: "If the threshold is set too high or minimum duration too low, quiet speech may be incorrectly removed. Use conservative settings (-40 dBFS, 0.5s minimum) for speech recordings and test on a short clip first." },
        { question: "What is the silence threshold?", answer: "Audio samples below this dBFS level are considered silence. -40 dBFS means anything quieter than 1% of maximum digital volume is treated as silence." },
        { question: "Why keep padding?", answer: "Words often start and end with very quiet sounds (consonants, breath). A small padding (0.1s) prevents the tool from clipping the beginning and end of words." },
      ]}
    >
      <RemoveSilenceClient />
    </AudioToolPage>
  );
}
