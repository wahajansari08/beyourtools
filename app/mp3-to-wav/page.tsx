import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SimpleConvertClient from "@/components/audio/SimpleConvertClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "MP3 to WAV Converter - Convert MP3 to WAV Free Online | BeYourTools",
  description: "Convert MP3 audio to uncompressed WAV format online for free. Browser-based, no upload, instant download.",
  keywords: "mp3 to wav, convert mp3 to wav, mp3 to wav online, mp3 to wav converter free",
  path: "/mp3-to-wav",
});

export default function Mp3ToWavPage() {
  return (
    <AudioToolPage
      slug="mp3-to-wav"
      title="MP3 to WAV"
      categoryLabel="Converters"
      tagline="Convert MP3 files to uncompressed WAV format - useful for audio editing software that requires PCM audio."
      description="Free online MP3 to WAV converter. Converts to PCM 16-bit WAV in your browser."
      howTo={[
        { title: "Upload MP3", text: "Drop your MP3 file or click to browse." },
        { title: "Convert", text: 'Click "Convert to WAV". The audio is decoded and encoded to uncompressed WAV locally.' },
        { title: "Download", text: "Preview and download the WAV file." },
      ]}
      features={[
        "Converts MP3 to uncompressed PCM WAV",
        "Preserves original sample rate and channels",
        "No quality loss beyond original MP3 compression",
        "Instant browser-based conversion",
      ]}
      formats={["MP3 → WAV"]}
      faqs={[
        { question: "Why convert MP3 to WAV?", answer: "Some audio editing applications, DAWs and legacy systems require uncompressed PCM WAV files. WAV is also better for further editing as it avoids re-encoding artifacts." },
        { question: "Will the WAV file sound better than the MP3?", answer: "No. Converting MP3 to WAV does not recover quality lost during MP3 compression. The WAV will be larger but the audio quality is the same as the source MP3." },
        { question: "How large will the WAV file be?", answer: "WAV files are much larger than MP3. A 5 MB MP3 typically becomes 40–80 MB WAV depending on duration, sample rate and channels." },
      ]}
    >
      <SimpleConvertClient
        fromExt="mp3" toExt="wav" toMime="audio/wav"
        accept=".mp3,audio/mpeg" acceptLabel="MP3 files"
        showBitrate={false}
      />
    </AudioToolPage>
  );
}
