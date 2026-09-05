import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import SimpleConvertClient from "@/components/audio/SimpleConvertClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "WAV to MP3 Converter - Compress WAV to MP3 Free Online | BeYourTools",
  description: "Convert WAV audio to MP3 online for free. Choose bitrate, reduce file size, and download instantly. Browser-based, no upload.",
  keywords: "wav to mp3, convert wav to mp3, wav to mp3 online, wav to mp3 converter free, compress wav",
  path: "/wav-to-mp3",
});

export default function WavToMp3Page() {
  return (
    <AudioToolPage
      slug="wav-to-mp3"
      title="WAV to MP3"
      categoryLabel="Converters"
      tagline="Compress large WAV files to MP3 - reduce file size significantly while keeping good audio quality."
      description="Free online WAV to MP3 converter with bitrate control. Convert in your browser, no upload needed."
      howTo={[
        { title: "Select bitrate", text: "Choose your MP3 bitrate - 192 kbps is a good default." },
        { title: "Upload WAV", text: "Drop your WAV file or click to browse." },
        { title: "Convert", text: 'Click "Convert to MP3". The audio is re-encoded locally in your browser.' },
        { title: "Download", text: "Preview and download the MP3. Check the size reduction in the file info." },
      ]}
      features={[
        "Converts WAV PCM to compressed MP3",
        "Selectable bitrate 64–320 kbps",
        "Significant file size reduction",
        "Audio preview before and after",
        "No upload - 100% browser-based",
      ]}
      formats={["WAV → MP3"]}
      faqs={[
        { question: "How much smaller will the MP3 be?", answer: "Typically 5–15× smaller than the original WAV. A 50 MB WAV file may compress to 3–8 MB MP3 at 128–192 kbps." },
        { question: "Does converting WAV to MP3 lose quality?", answer: "Yes. MP3 is a lossy format. Higher bitrates (192–320 kbps) preserve more quality but produce larger files. 192 kbps is transparent for most listeners." },
        { question: "Can I convert stereo WAV to mono MP3?", answer: "The tool preserves the original channel layout by default. Mono/stereo conversion is not currently available in this tool." },
      ]}
    >
      <SimpleConvertClient
        fromExt="wav" toExt="mp3" toMime="audio/mpeg"
        accept=".wav,audio/wav,audio/x-wav" acceptLabel="WAV files"
        showBitrate={true}
      />
    </AudioToolPage>
  );
}
