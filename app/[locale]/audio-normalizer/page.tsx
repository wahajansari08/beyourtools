import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioNormalizerClient from "./AudioNormalizerClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Audio Normalizer - Normalize Audio Volume | BeYourTools",
  description: "Normalize audio levels online for free. Loudness normalization or dynamic normalization. Supports MP3, WAV, FLAC and more. Browser-based, no upload.",
  keywords: "audio normalizer, normalize audio online, audio volume normalizer, peak normalization, loudness normalization, audio leveler",
  path: "/audio-normalizer",
});

export default function AudioNormalizerPage() {
  return (
    <AudioToolPage
      slug="audio-normalizer"
      title="Audio Normalizer"
      categoryLabel="Effects & Processing"
      tagline="Normalize audio to a consistent volume level. Choose loudness normalization for a single gain adjustment, or dynamic normalization to even out the whole file."
      description="Free online audio normalizer. Supports loudness and dynamic normalization. Works with MP3, WAV, FLAC, M4A and more. Browser-based."
      howTo={[
        { title: "Choose mode", text: "Loudness normalization adjusts overall gain so the file's measured loudness reaches the target level. Dynamic normalization evens out volume variations across the file." },
        { title: "Set target (loudness mode)", text: "The default -1.0 LUFS is a loud target, with the peak ceiling set to the same level to prevent clipping. Lower values like -3 set a quieter target with a lower peak ceiling, leaving more headroom." },
        { title: "Upload audio", text: "Drop your audio file or click to browse." },
        { title: "Normalize and download", text: 'Click "Normalize audio", preview the result, and download.' },
      ]}
      features={[
        "Loudness normalization with target LUFS control",
        "Dynamic normalization for even loudness",
        "Supports MP3, WAV, FLAC, M4A, OGG input",
        "Outputs normalized MP3",
        "Audio preview before and after",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "What is the difference between loudness and dynamic normalization?", answer: "Loudness normalization measures how loud the whole file sounds and applies one gain change so that loudness reaches your target. The loudest peak is capped at the same level to prevent clipping. Dynamic normalization goes further: it analyzes the audio throughout and continuously balances quieter and louder sections for a more even listening experience." },
        { question: "Is this the same as LUFS/loudness normalization?", answer: "Yes, in part. Loudness mode uses FFmpeg's loudnorm filter, which measures loudness in LUFS and adjusts the file toward your target. It runs in a single pass, so it is not as exact as a two-pass broadcast master, and this tool offers no -14 LUFS streaming preset. Dynamic mode is different: it balances volume throughout the file instead of targeting one loudness number." },
        { question: "Will normalizing change the pitch or speed?", answer: "No. Normalization only adjusts volume/gain. Pitch and speed are not affected." },
        { question: "What loudness targets do Spotify, YouTube and podcasts use?", answer: "Spotify and YouTube play audio at about -14 LUFS, Apple Music at about -16 LUFS, podcasts commonly at -16 LUFS, and European broadcast (EBU R128) at -23 LUFS. LUFS measures perceived loudness across the whole file, not just the loudest peak. Note that this tool's target slider only goes down to -12, so it cannot match the -14 LUFS streaming target exactly; the lowest setting here is louder than Spotify's target." },
        { question: "Will normalizing make a quiet podcast and a loud song play at the same volume?", answer: "Loudness mode moves the whole file by one fixed amount based on its measured loudness, so loud and quiet parts keep their difference: a whisper stays quieter than a shout in the same file. Dynamic mode goes further and adjusts gain throughout the file, lifting quiet sections and taming loud ones, so the result sounds more even but less natural. For matching several separate files, run each one with the same target." },
        { question: "What target should I pick?", answer: "The default -1.0 is very loud: it aims about 13 dB above Spotify's -14 LUFS level, so it suits making a single quiet file as loud as possible, not matching streaming loudness. If your file already sounds fine and you only want headroom protection, pick a lower value such as -3 or -6, which leaves more room before the peak ceiling. The slider steps are 0.5 dB from -12 to 0." },
      ]}
    >
      <AudioNormalizerClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "audio-normalizer", __enMetadata);
}
