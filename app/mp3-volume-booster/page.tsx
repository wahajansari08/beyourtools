import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import VolumeBoosterClient from "./VolumeBoosterClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MP3 Volume Booster - Increase MP3 Volume Online Free | BeYourTools",
  description: "Boost the volume of your MP3 file online for free. Choose a gain preset or set a custom level. Preview and download. Browser-based, no upload.",
  keywords: "mp3 volume booster, increase mp3 volume, boost audio volume online, mp3 louder, volume increaser",
  alternates: { canonical: `${SITE.url}/mp3-volume-booster` },
};

export default function VolumeBoosterPage() {
  return (
    <AudioToolPage
      slug="mp3-volume-booster"
      title="MP3 Volume Booster"
      categoryLabel="Effects & Processing"
      tagline="Make your MP3 louder by applying gain. Choose from +25% to +100% presets or set a custom level."
      description="Free online MP3 volume booster. Increase volume using gain presets or a custom slider. Browser-based, no upload."
      howTo={[
        { title: "Choose gain", text: "Select a preset (+25%, +50%, +75%, +100%) or drag the Custom slider." },
        { title: "Upload MP3", text: "Drop your MP3 or click to browse." },
        { title: "Boost", text: 'Click "Boost volume". The FFmpeg volume filter applies the gain.' },
        { title: "Preview and download", text: "Listen to the boosted audio before downloading." },
      ]}
      features={[
        "Gain presets: +25%, +50%, +75%, +100%",
        "Custom gain slider up to +200%",
        "Clipping warning for high gain values",
        "Audio preview before and after",
        "100% browser-based — no upload",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "Will boosting volume cause distortion?", answer: "High gain can cause clipping (a harsh digital distortion) when audio peaks exceed the maximum digital level. Gains up to +50% are usually safe for quieter recordings. The tool warns you if gain is very high." },
        { question: "What is the difference between volume boost and normalization?", answer: "Volume boost applies a fixed gain multiplier to the whole file. Normalization analyzes the peaks and adjusts gain so the loudest point reaches a target level — more intelligent but different in purpose." },
        { question: "Can I boost only part of the file?", answer: "Not with this tool. Use the MP3 Cutter to extract a section first, then boost that section separately." },
      ]}
    >
      <VolumeBoosterClient />
    </AudioToolPage>
  );
}
