import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioNormalizerClient from "./AudioNormalizerClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Audio Normalizer - Normalize Audio Volume Online Free | BeYourTools",
  description: "Normalize audio levels online for free. Peak normalization or dynamic normalization. Supports MP3, WAV, FLAC and more. Browser-based, no upload.",
  keywords: "audio normalizer, normalize audio online, audio volume normalizer, peak normalization, loudness normalization, audio leveler",
  alternates: { canonical: `${SITE.url}/audio-normalizer` },
};

export default function AudioNormalizerPage() {
  return (
    <AudioToolPage
      slug="audio-normalizer"
      title="Audio Normalizer"
      categoryLabel="Effects & Processing"
      tagline="Normalize audio to a consistent volume level. Choose peak normalization for a single gain adjustment, or dynamic normalization to even out the whole file."
      description="Free online audio normalizer. Supports peak and dynamic normalization. Works with MP3, WAV, FLAC, M4A and more. Browser-based."
      howTo={[
        { title: "Choose mode", text: "Peak normalization adjusts overall gain to a target level. Dynamic normalization evens out volume variations across the file." },
        { title: "Set target (peak mode)", text: "The default -1.0 dBFS leaves headroom to prevent clipping. Lower values like -3 dBFS are safer for files with many peaks." },
        { title: "Upload audio", text: "Drop your audio file or click to browse." },
        { title: "Normalize and download", text: 'Click "Normalize audio", preview the result, and download.' },
      ]}
      features={[
        "Peak normalization with target dBFS control",
        "Dynamic normalization for even loudness",
        "Supports MP3, WAV, FLAC, M4A, OGG input",
        "Outputs normalized MP3",
        "Audio preview before and after",
        "100% browser-based — no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "What is the difference between peak and dynamic normalization?", answer: "Peak normalization adjusts the overall volume so the loudest moment reaches your target level. Dynamic normalization goes further — it analyzes the audio throughout and continuously balances quieter and louder sections for a more even listening experience." },
        { question: "Is this the same as LUFS/loudness normalization?", answer: "Dynamic mode provides perceptual leveling across the file. It is not a broadcast-grade LUFS measurement tool. For strict broadcast standards, a dedicated mastering tool is recommended." },
        { question: "Will normalizing change the pitch or speed?", answer: "No. Normalization only adjusts volume/gain. Pitch and speed are not affected." },
      ]}
    >
      <AudioNormalizerClient />
    </AudioToolPage>
  );
}
