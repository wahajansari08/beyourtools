import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioCompressorClient from "./AudioCompressorClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Audio Compressor - Reduce Audio File Size | BeYourTools",
  description: "Compress audio files to reduce size online for free. Supports MP3, WAV, FLAC, M4A, OGG. Presets from 64 to 320 kbps. Fast, private, browser-based compression.",
  keywords: "audio compressor, compress audio online, reduce audio file size, audio file compressor, compress wav, compress flac",
  path: "/audio-compressor",
});

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
        "Shows input and output file sizes",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "What output formats are available?", answer: "MP3 (widest compatibility), OGG Vorbis (open-source, good quality), and AAC (good quality, used by Apple devices)." },
        { question: "Can I compress a WAV or FLAC file?", answer: "Yes. Upload any supported format and it will be compressed to your chosen output format and bitrate." },
        { question: "What is the difference between this and the MP3 Compressor?", answer: "This tool supports multiple input and output formats. The MP3 Compressor is dedicated to MP3-in, MP3-out compression." },
        { question: "How much smaller will my file get at each compression level?", answer: "Output size depends only on bitrate and length: size in bytes equals bitrate in kilobits per second times seconds divided by 8. A 3 minute song is about 1.4 MB at 64 kbps, 2.2 MB at 96 kbps, 2.9 MB at 128 kbps, 4.3 MB at 192 kbps and 7.2 MB at 320 kbps. A 3 minute WAV file is about 31.8 MB, so the same song at 128 kbps MP3 is about 91 percent smaller." },
        { question: "Which preset should I pick for voice and which for music?", answer: "Pick Maximum (64 kbps) or High (96 kbps) for spoken voice, podcasts and voice memos, where small size matters more than fine detail. Pick Balanced (128 kbps) for general music and sharing. Pick High quality (192 kbps) or Best quality (320 kbps) for music you want to keep, since 320 kbps is 2.5 times the size of 128 kbps for the same song." },
        { question: "Can I compress to an exact file size, like under 25 MB for email?", answer: "No. This tool works by preset bitrate only, so you pick the preset and the size follows from your file length. As a guide, one minute of audio is about 0.5 MB at 64 kbps, 1 MB at 128 kbps and 2.4 MB at 320 kbps, so a 25 MB email limit fits about 26 minutes at 128 kbps. If the result is still too big, run it again at a lower preset." },
      ]}
    >
      <AudioCompressorClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "audio-compressor", __enMetadata);
}
