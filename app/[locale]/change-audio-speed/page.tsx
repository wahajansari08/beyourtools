import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SpeedChangerClient from "./SpeedChangerClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Change Audio Speed - Speed Up & Slow Down | BeYourTools",
  description: "Change the speed of any audio file online for free. Speed up or slow down MP3, WAV, FLAC and more. Export instantly in your browser.",
  keywords: "change audio speed, speed up audio online, slow down audio, audio speed changer, mp3 speed changer, change playback speed",
  path: "/change-audio-speed",
});

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
        { question: "Does changing speed affect pitch?", answer: "No. The tool uses FFmpeg's atempo filter, which stretches time without changing pitch, so a voice sped up to 1.5x still sounds like the same person, just faster. The chipmunk effect only happens with varispeed, where speed and pitch move together, and this tool does not do that." },
        { question: "How much shorter is a 10-minute podcast at 1.5x?", answer: "6 minutes and 40 seconds. Divide the length by the speed: 10 minutes at 1.5x is 6 minutes 40 seconds, at 2x it is 5 minutes, and at 0.5x it is 20 minutes. The file size changes in the same proportion, because the export is re-encoded for the new, shorter duration." },
        { question: "Does speeding up make the file smaller?", answer: "Yes, roughly in proportion to the speed. The export is an MP3 at 192 kbps, which is about 24 KB per second, so a 10 minute recording is about 14.4 MB. At 2x it becomes a 5 minute file of about 7.2 MB. Slowing down does the opposite: the same 10 minutes at 0.5x becomes 20 minutes and about 28.8 MB." },
        { question: "Why does 0.25x sound strange?", answer: "Extreme stretches push the time-stretching further from the original, so the processing becomes audible as a fluttery or metallic quality, especially on music. Small changes such as 1.25x or 1.5x usually sound natural. If 0.25x sounds wrong, try 0.5x first and listen before going slower." },
        { question: "What is the maximum speed?", answer: "Up to 4×. Very high speeds may produce unnatural results depending on the source audio." },
        { question: "What is the difference between this and playback speed in the browser?", answer: "The browser audio player's speed control only changes playback in the browser - it does not create a new file. This tool permanently re-encodes the audio at the new tempo so you can download and use it anywhere." },
      ]}
    >
      <SpeedChangerClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "change-audio-speed", __enMetadata);
}
