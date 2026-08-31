import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioCompressorClient from "./AudioCompressorClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Audio Compressor - Compress Audio Files Online Free | BeYourTools",
  description: "Compress audio files to reduce size online for free. Supports MP3, WAV, FLAC, M4A, OGG. Choose output format and compression level. Browser-based, no upload.",
  keywords: "audio compressor, compress audio online, reduce audio file size, audio file compressor, compress wav, compress flac",
  alternates: { canonical: `${SITE.url}/audio-compressor` },
};

export default function AudioCompressorPage() {
  return (
    <AudioToolPage
      slug="audio-compressor"
      title="Audio Compressor"
      categoryLabel="Compressors"
      tagline="Compress audio files from any supported format to MP3, OGG or AAC - choose your compression level and output format."
      description="Free online audio compressor. Supports MP3, WAV, FLAC, M4A, OGG input. Output to MP3, OGG or AAC with selectable compression preset."
      howTo={[
        { title: "Choose output format", text: "Select MP3, OGG or AAC as your output format." },
        { title: "Choose compression level", text: "Pick a preset - Balanced (128 kbps) is good for most use cases." },
        { title: "Upload audio", text: "Drop your audio file or click to browse." },
        { title: "Compress and download", text: 'Click "Compress Audio", preview the result, and download.' },
      ]}
      features={[
        "Supports MP3, WAV, FLAC, M4A, OGG input",
        "Output to MP3, OGG or AAC",
        "5 compression presets",
        "Shows file size reduction",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "What output formats are available?", answer: "MP3 (widest compatibility), OGG Vorbis (open-source, good quality), and AAC (good quality, used by Apple devices)." },
        { question: "Can I compress a WAV or FLAC file?", answer: "Yes. Upload any supported format and it will be compressed to your chosen output format and bitrate." },
        { question: "What is the difference between this and the MP3 Compressor?", answer: "This tool supports multiple input and output formats. The MP3 Compressor is dedicated to MP3-in, MP3-out compression." },
      ]}
    >
      <AudioCompressorClient />
    </AudioToolPage>
  );
}
