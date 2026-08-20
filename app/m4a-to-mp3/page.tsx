import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SimpleConvertClient from "@/components/audio/SimpleConvertClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "M4A to MP3 Converter - Convert M4A to MP3 Free Online | BeYourTools",
  description: "Convert M4A (Apple audio) files to MP3 online for free. Browser-based, no upload, selectable bitrate.",
  keywords: "m4a to mp3, convert m4a to mp3, m4a to mp3 online, apple audio to mp3, aac to mp3",
  alternates: { canonical: `${SITE.url}/m4a-to-mp3` },
};

export default function M4aToMp3Page() {
  return (
    <AudioToolPage
      slug="m4a-to-mp3"
      title="M4A to MP3"
      categoryLabel="Converters"
      tagline="Convert M4A files (commonly used by Apple devices and iTunes) to universally compatible MP3 format."
      description="Free online M4A to MP3 converter. Converts Apple AAC audio to MP3 in your browser."
      howTo={[
        { title: "Choose bitrate", text: "Select your desired MP3 bitrate." },
        { title: "Upload M4A", text: "Drop your M4A file or click to browse." },
        { title: "Convert", text: 'Click "Convert to MP3".' },
        { title: "Download", text: "Preview the result and download your MP3." },
      ]}
      features={[
        "Converts M4A (AAC) to MP3",
        "Selectable bitrate 64–320 kbps",
        "Works with iTunes and Apple Music exports",
        "100% browser-based, no upload",
      ]}
      formats={["M4A", "AAC → MP3"]}
      faqs={[
        { question: "What is M4A?", answer: "M4A is an audio-only MP4 container file using AAC audio encoding. It is commonly used by Apple devices, iTunes, and Apple Music." },
        { question: "Will converting M4A to MP3 reduce quality?", answer: "Since both M4A and MP3 are lossy formats, re-encoding introduces some additional quality loss. Use the highest bitrate available (320 kbps) to minimise this." },
        { question: "Can I convert Apple DRM-protected M4A files?", answer: "No. DRM-protected files (purchased from older iTunes versions) cannot be processed by this tool. Only DRM-free M4A files are supported." },
      ]}
    >
      <SimpleConvertClient
        fromExt="m4a" toExt="mp3" toMime="audio/mpeg"
        accept=".m4a,.aac,audio/mp4,audio/aac,audio/x-m4a" acceptLabel="M4A, AAC files"
        showBitrate={true}
      />
    </AudioToolPage>
  );
}
