import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3CompressorClient from "./Mp3CompressorClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MP3 Compressor - Compress MP3 Files Online Free | BeYourTools",
  description: "Reduce MP3 file size online for free. Choose a compression preset, compress your MP3, and see the exact size reduction before downloading.",
  keywords: "mp3 compressor, compress mp3 online, reduce mp3 file size, mp3 file size reducer, compress audio online",
  alternates: { canonical: `${SITE.url}/mp3-compressor` },
};

export default function Mp3CompressorPage() {
  return (
    <AudioToolPage
      slug="mp3-compressor"
      title="MP3 Compressor"
      categoryLabel="Compressors"
      tagline="Reduce the size of your MP3 file by re-encoding at a lower bitrate. Choose from presets ranging from maximum compression to best quality."
      description="Free online MP3 compressor. Select a compression preset and reduce MP3 file size in your browser."
      howTo={[
        { title: "Choose preset", text: "Select a compression preset based on your needs - Balanced is a good default for most uses." },
        { title: "Upload MP3", text: "Drop your MP3 file or click to browse." },
        { title: "Compress", text: 'Click "Compress MP3". The tool re-encodes at the selected bitrate.' },
        { title: "Check reduction", text: "The file info shows original and compressed size. Download if the result meets your needs." },
      ]}
      features={[
        "5 compression presets from 64 to 320 kbps",
        "Shows original vs compressed file size",
        "Audio preview before and after",
        "100% browser-based - no upload",
        "Free, no sign-up",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "How much will my file be compressed?", answer: "The output size depends on your input file and the selected bitrate. A 10 MB MP3 at 320 kbps may compress to ~4 MB at 128 kbps. Actual results vary by content." },
        { question: "Which preset should I use?", answer: "For email attachments or web use: Balanced (128 kbps). For podcasts and voice: High compression (96 kbps). For music where quality matters: High quality (192 kbps) or Best quality (320 kbps)." },
        { question: "Is lossy compression reversible?", answer: "No. MP3 compression is lossy and irreversible. Always keep a copy of your original file." },
      ]}
    >
      <Mp3CompressorClient />
    </AudioToolPage>
  );
}
