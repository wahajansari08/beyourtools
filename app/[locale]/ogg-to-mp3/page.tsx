import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SimpleConvertClient from "@/components/audio/SimpleConvertClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "OGG to MP3 Converter: Play OGG Anywhere | BeYourTools",
  description: "Convert OGG Vorbis audio files to MP3 online for free, so they play on iPhones, car stereos and every player. Browser-based conversion, no upload, selectable bitrate up to 320 kbps.",
  keywords: "ogg to mp3, convert ogg to mp3, ogg vorbis to mp3, ogg mp3 converter online, ogg to mp3 for iphone, opus to mp3",
  path: "/ogg-to-mp3",
});

export default function OggToMp3Page() {
  return (
    <AudioToolPage
      slug="ogg-to-mp3"
      title="OGG to MP3"
      categoryLabel="Converters"
      tagline="Convert OGG Vorbis audio files to widely compatible MP3 format, so recordings from Linux, games and Discord clips play on devices that don't support OGG."
      description="Free online OGG to MP3 converter. Converts OGG Vorbis to MP3 in your browser."
      howTo={[
        { title: "Choose bitrate", text: "Select your MP3 bitrate." },
        { title: "Upload OGG", text: "Drop your OGG file or click to browse." },
        { title: "Convert", text: 'Click "Convert to MP3".' },
        { title: "Download", text: "Preview and download your MP3." },
      ]}
      features={[
        "Converts OGG Vorbis to MP3",
        "Selectable bitrate 64–320 kbps",
        "No upload - 100% browser-based",
        "Audio preview before and after",
      ]}
      formats={["OGG → MP3"]}
      faqs={[
        { question: "What is OGG?", answer: "OGG is a free, open-source audio container format that typically uses the Vorbis codec. It offers good quality at lower bitrates but is not as widely supported as MP3." },
        { question: "Why convert OGG to MP3?", answer: "MP3 is supported by virtually all devices and media players. If your OGG file doesn't play on your device, converting to MP3 solves compatibility issues." },
        { question: "Does converting OGG to MP3 lose quality?", answer: "Both OGG and MP3 are lossy formats. Re-encoding introduces minor additional quality loss. Use 192–320 kbps to minimise this." },
      ]}
    >
      <SimpleConvertClient
        fromExt="ogg" toExt="mp3" toMime="audio/mpeg"
        accept=".ogg,audio/ogg,audio/vorbis" acceptLabel="OGG files"
        showBitrate={true}
      />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "ogg-to-mp3", __enMetadata);
}
