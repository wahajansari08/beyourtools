import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioConverterClient from "./AudioConverterClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Audio Converter - Convert Between Audio Formats Free | BeYourTools",
  description: "Convert audio files between MP3, WAV, OGG, FLAC, M4A and Opus formats online for free. Browser-based, no upload, instant download.",
  keywords: "audio converter, convert audio online, mp3 to wav, wav to ogg, flac converter, audio format converter",
  path: "/audio-converter",
});

export default function AudioConverterPage() {
  return (
    <AudioToolPage
      slug="audio-converter"
      title="Audio Converter"
      categoryLabel="Converters"
      tagline="Convert audio files between MP3, WAV, OGG, FLAC, M4A, and Opus - pick your output format and bitrate, then download."
      description="Free online audio converter supporting MP3, WAV, OGG, FLAC, M4A, and Opus. All conversion happens in your browser."
      howTo={[
        { title: "Choose output format", text: "Select the format you want to convert to from the buttons above." },
        { title: "Set bitrate (optional)", text: "For lossy formats like MP3 and OGG, pick a bitrate." },
        { title: "Upload audio", text: "Drop your audio file or click to browse." },
        { title: "Convert and download", text: "Click Convert, preview the result, then download." },
      ]}
      features={[
        "Convert to MP3, WAV, OGG, FLAC, M4A, Opus",
        "Selectable bitrate for lossy formats",
        "Supports most common input formats",
        "Audio preview before and after",
        "100% in-browser, no server upload",
      ]}
      formats={["MP3", "WAV", "OGG", "FLAC", "M4A", "AAC", "Opus", "WebM", "MP4"]}
      faqs={[
        { question: "Which output formats are available?", answer: "MP3, WAV, OGG Vorbis, FLAC, M4A (AAC), and Opus." },
        { question: "Can I convert MP4 to audio?", answer: "Yes - upload an MP4 file and select your desired audio format. The video stream is stripped automatically." },
        { question: "Is FLAC lossless?", answer: "Yes, FLAC is a lossless format. Converting lossy MP3 to FLAC won't recover quality lost during MP3 compression, but it won't degrade further." },
      ]}
    >
      <AudioConverterClient />
    </AudioToolPage>
  );
}
