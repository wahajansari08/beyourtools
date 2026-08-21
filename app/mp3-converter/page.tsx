import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3ConverterClient from "./Mp3ConverterClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MP3 Converter - Convert Audio to MP3 Online Free | BeYourTools",
  description: "Convert audio files to MP3 online for free. Supports WAV, FLAC, M4A, OGG, AAC, MP4 and more. Choose bitrate and download instantly. 100% browser-based.",
  keywords: "mp3 converter, convert to mp3, audio to mp3, wav to mp3 online, flac to mp3, m4a to mp3",
  alternates: { canonical: `${SITE.url}/mp3-converter` },
};

export default function Mp3ConverterPage() {
  return (
    <AudioToolPage
      slug="mp3-converter"
      title="MP3 Converter"
      categoryLabel="Converters"
      tagline="Convert any audio file to MP3 instantly in your browser. Select your preferred bitrate and download — no upload required."
      description="Free online MP3 converter. Convert WAV, FLAC, M4A, OGG, AAC and MP4 files to MP3 directly in your browser."
      howTo={[
        { title: "Upload audio", text: "Drag and drop or click to select your audio file (MP3, WAV, FLAC, M4A, OGG, MP4 and more)." },
        { title: "Choose bitrate", text: "Select your desired MP3 bitrate — 128 kbps for smaller files, 320 kbps for best quality." },
        { title: "Convert", text: 'Click "Convert to MP3" and wait a moment while the conversion runs locally in your browser.' },
        { title: "Download", text: "Preview the result and download your MP3." },
      ]}
      features={[
        "Supports WAV, FLAC, M4A, OGG, AAC, MP4, WebM and more",
        "Selectable bitrate: 64–320 kbps",
        "Audio preview before and after conversion",
        "100% browser-based — no upload",
        "Free, no sign-up required",
        "Shows file size before and after",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "AAC", "OGG", "Opus", "MP4", "WebM", "WMA"]}
      faqs={[
        { question: "What formats can I convert to MP3?", answer: "WAV, FLAC, M4A, AAC, OGG, Opus, WebM and MP4 (audio extraction). Most common audio formats are supported." },
        { question: "Which bitrate should I choose?", answer: "192 kbps is a good balance of quality and file size. Use 320 kbps for best quality, or 128 kbps to reduce file size." },
        { question: "Is my audio uploaded anywhere?", answer: "No. All conversion runs entirely in your browser. Your files never leave your device." },
        { question: "Why does conversion take a moment?", answer: "The first conversion of your session takes a little longer as the tool loads. Subsequent conversions are faster." },
      ]}
    >
      <Mp3ConverterClient />
    </AudioToolPage>
  );
}
