import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SimpleConvertClient from "@/components/audio/SimpleConvertClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FLAC to MP3 Converter - Convert FLAC to MP3 Free Online | BeYourTools",
  description: "Convert lossless FLAC files to compressed MP3 online for free. Reduce file size while keeping good audio quality. Browser-based, no upload.",
  keywords: "flac to mp3, convert flac to mp3, flac to mp3 online, lossless to mp3, flac converter",
  alternates: { canonical: `${SITE.url}/flac-to-mp3` },
};

export default function FlacToMp3Page() {
  return (
    <AudioToolPage
      slug="flac-to-mp3"
      title="FLAC to MP3"
      categoryLabel="Converters"
      tagline="Convert lossless FLAC audio to compressed MP3. Dramatically reduces file size for portable playback and sharing."
      description="Free online FLAC to MP3 converter. Converts lossless FLAC to compressed MP3 in your browser."
      howTo={[
        { title: "Choose bitrate", text: "Higher bitrate (320 kbps) preserves more of the original FLAC quality." },
        { title: "Upload FLAC", text: "Drop your FLAC file or click to browse." },
        { title: "Convert", text: 'Click "Convert to MP3".' },
        { title: "Download", text: "Preview and download your MP3." },
      ]}
      features={[
        "Converts lossless FLAC to MP3",
        "Selectable bitrate 64–320 kbps",
        "Preserves metadata where possible",
        "No upload -100% browser-based",
      ]}
      formats={["FLAC → MP3"]}
      faqs={[
        { question: "Does converting FLAC to MP3 lose quality?", answer: "Yes. MP3 is a lossy format -converting FLAC (lossless) to MP3 permanently reduces audio quality. Use 320 kbps for the best result. The original FLAC file is not affected." },
        { question: "Why convert FLAC to MP3?", answer: "FLAC files can be 5–10× larger than MP3. MP3 is more widely supported by devices and streaming platforms. For casual listening, a high-bitrate MP3 is often indistinguishable from FLAC." },
        { question: "Can I convert back from MP3 to FLAC?", answer: "You can convert the container, but you cannot recover the audio quality lost during MP3 encoding. Converting MP3 back to FLAC just produces a large lossless file with MP3-quality audio." },
      ]}
    >
      <SimpleConvertClient
        fromExt="flac" toExt="mp3" toMime="audio/mpeg"
        accept=".flac,audio/flac,audio/x-flac" acceptLabel="FLAC files"
        showBitrate={true}
        extraNote="Converting FLAC to MP3 reduces file size but introduces lossy compression. Use 320 kbps for best quality."
      />
    </AudioToolPage>
  );
}
