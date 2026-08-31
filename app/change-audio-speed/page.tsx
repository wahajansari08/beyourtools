import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SpeedChangerClient from "./SpeedChangerClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Change Audio Speed - Speed Up or Slow Down Audio Free | BeYourTools",
  description: "Change the speed of any audio file online for free. Speed up or slow down MP3, WAV, FLAC and more. Export a new audio file at the selected speed. Browser-based.",
  keywords: "change audio speed, speed up audio online, slow down audio, audio speed changer, mp3 speed changer, change playback speed",
  alternates: { canonical: `${SITE.url}/change-audio-speed` },
};

export default function ChangeAudioSpeedPage() {
  return (
    <AudioToolPage
      slug="change-audio-speed"
      title="Change Audio Speed"
      categoryLabel="Effects & Processing"
      tagline="Speed up or slow down any audio file and export a new file at the selected speed. Supports 0.25× to 4× with custom values."
      description="Free online audio speed changer. Change speed from 0.25× to 4× and export a new audio file. Browser-based, no upload."
      howTo={[
        { title: "Select speed", text: "Choose a preset (0.25×, 0.5×, 0.75×, 1×, 1.25×, 1.5×, 1.75×, 2×) or drag the Custom slider." },
        { title: "Upload audio", text: "Drop your audio file or click to browse." },
        { title: "Export", text: 'Click "Export" and the audio is re-encoded at the new tempo.' },
        { title: "Preview and download", text: "The output plays at the new speed. Download the MP3 file." },
      ]}
      features={[
        "Speed presets: 0.25× to 2×",
        "Custom speed slider up to 4×",
        "Exports a permanent new audio file",
        "Supports MP3, WAV, FLAC, M4A, OGG input",
        "Output as MP3",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "Does changing speed affect pitch?", answer: "Yes. Changing speed also changes pitch proportionally - faster audio sounds higher-pitched, slower audio sounds lower-pitched. Pitch-preserving time-stretching is not currently supported by this tool." },
        { question: "What is the maximum speed?", answer: "Up to 4×. Very high speeds may produce unnatural results depending on the source audio." },
        { question: "What is the difference between this and playback speed in the browser?", answer: "The browser audio player's speed control only changes playback in the browser - it does not create a new file. This tool permanently re-encodes the audio at the new tempo so you can download and use it anywhere." },
      ]}
    >
      <SpeedChangerClient />
    </AudioToolPage>
  );
}
