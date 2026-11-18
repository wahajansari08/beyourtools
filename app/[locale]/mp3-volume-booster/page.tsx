import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import VolumeBoosterClient from "./VolumeBoosterClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "MP3 Volume Booster - Boost Audio Volume | BeYourTools",
  description: "Boost the volume of your MP3 file online for free, up to +300%. Choose a gain preset or set a custom level. Preview and download. Browser-based, no upload.",
  keywords: "mp3 volume booster, increase mp3 volume, boost audio volume online, mp3 louder, volume increaser",
  path: "/mp3-volume-booster",
});

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
        { title: "Boost", text: 'Click "Boost volume". The gain is applied to the entire audio file locally.' },
        { title: "Preview and download", text: "Listen to the boosted audio before downloading." },
      ]}
      features={[
        "Gain presets: +25%, +50%, +75%, +100%",
        "Custom gain slider up to +300%",
        "Clipping warning for high gain values",
        "Audio preview before and after",
        "100% browser-based - no upload",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "Will boosting volume cause distortion?", answer: "High gain can cause clipping (a harsh digital distortion) when audio peaks exceed the maximum digital level. A +50% boost adds 3.5 dB, so it is safe only if your file peaks below about -3.5 dBFS. Quiet voice memos usually qualify; finished music that already peaks near 0 dBFS will clip. The tool warns you if gain is very high." },
        { question: "What is the difference between volume boost and normalization?", answer: "Volume boost applies a fixed gain multiplier to the whole file. Normalization measures the file's loudness and adjusts gain toward a target level, so the amount of boost depends on how loud the file already is." },
        { question: "Can I boost only part of the file?", answer: "Not with this tool. Use the MP3 Cutter to extract a section first, then boost that section separately." },
        { question: "How loud is each preset in decibels?", answer: "A percent boost is a gain multiplier, and decibels equal 20 times log10 of that multiplier. +25% is x1.25, or +1.9 dB. +50% is x1.50, or +3.5 dB. +75% is x1.75, or +4.9 dB. +100% is x2.00, or +6.0 dB. The custom slider goes to x4.00, or +12.0 dB. Doubling the volume (+100%) adds about 6 dB, not 100 dB." },
        { question: "How much can I boost before the audio distorts?", answer: "It depends on how loud your file already is. Boosting multiplies every peak, so clipping starts when the loudest peak passes the digital maximum. +50% clips any file peaking above -3.5 dBFS, and +100% clips any file peaking above -6.0 dBFS. A quiet voice memo peaking at -20 dBFS can take a very large boost: lifting it to -1 dBFS needs about x8.9 gain. A finished song that already peaks near 0 dBFS will clip at almost any boost. Preview before downloading, and use the smallest preset that sounds loud enough." },
        { question: "Can I make a file quieter instead of louder?", answer: "No. The slider starts at +5% and only goes up, to +300%, so this tool only makes audio louder. To lower volume, use the Audio Normalizer with a low target, or a desktop editor." },
      ]}
    >
      <VolumeBoosterClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "mp3-volume-booster", __enMetadata);
}
