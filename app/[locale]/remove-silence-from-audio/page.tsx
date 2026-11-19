import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import RemoveSilenceClient from "./RemoveSilenceClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Remove Silence from Audio - Online Free | BeYourTools",
  description: "Automatically remove silent sections from audio files online for free. Adjust threshold, minimum duration and padding. Browser-based, no upload.",
  keywords: "remove silence from audio, silence remover, remove quiet parts audio, trim silence audio online, audio silence detector",
  path: "/remove-silence-from-audio",
});

export default function RemoveSilencePage() {
  return (
    <AudioToolPage
      slug="remove-silence-from-audio"
      title="Remove Silence from Audio"
      categoryLabel="Effects & Processing"
      tagline="Automatically strip silent gaps from your audio. Ideal for podcasts, recordings and interviews. Adjust threshold and minimum duration to protect natural speech pauses."
      description="Free online silence remover for audio. Removes silent sections from MP3, WAV, FLAC and more. Browser-based, no upload."
      howTo={[
        { title: "Set threshold", text: "-40 dBFS is a safe default. Increase (e.g. -30 dBFS) to remove more, decrease (e.g. -50 dBFS) to be more conservative." },
        { title: "Set minimum duration", text: "Silence longer than this value is shortened to this value, not removed completely. With the 0.5s default, a 2 second pause becomes a 0.5 second pause, and pauses shorter than 0.5s are left alone." },
        { title: "Set padding", text: "Keeps a short buffer of silence at the start of the recording so it does not begin abruptly." },
        { title: "Upload and process", text: "Drop your audio file, click Remove silence, and download the result." },
      ]}
      features={[
        "Configurable silence threshold (-60 to -20 dBFS)",
        "Minimum silence duration control",
        "Speech padding to protect word edges",
        "Supports MP3, WAV, FLAC, M4A, OGG input",
        "Audio preview before and after",
        "100% browser-based - no upload",
      ]}
      formats={["MP3", "WAV", "FLAC", "M4A", "OGG", "Opus", "AAC", "WebM"]}
      faqs={[
        { question: "Will this remove speech?", answer: "If the threshold is set too high or minimum duration too low, quiet speech may be incorrectly removed. Use conservative settings (-40 dBFS, 0.5s minimum) for speech recordings and test on a short clip first." },
        { question: "What is the silence threshold?", answer: "Audio samples below this dBFS level are considered silence. -40 dBFS means anything quieter than 1% of maximum digital volume is treated as silence." },
        { question: "Why keep padding?", answer: "Padding keeps a short buffer of silence at the very start of the recording, so the file does not begin abruptly mid-word. Pauses in the middle are shortened to the minimum-duration value instead, and that remaining half second is what leaves breathing room around words." },
        { question: "Does it remove silence completely or shorten it?", answer: "It shortens it. Every silence gap longer than the minimum duration is cut down to exactly that value, so a 2 second pause becomes a 0.5 second pause at the default setting, and a 0.3 second pause is left alone. The result keeps a natural rhythm instead of sounding clipped together." },
        { question: "What file do I get back?", answer: "An MP3 re-encoded at 192 kbps, whatever format you uploaded. The original file is never changed, and the download is named after it with -no-silence added. Because the audio is re-encoded, a file that was already MP3 loses a small amount of quality to the second encode, so keep the original if you plan to edit further." },
        { question: "Can it remove background noise?", answer: "No. It only cuts sections that fall below the silence threshold. Steady background noise such as a fan or traffic hum stays, because it is above the threshold even during pauses. Set the threshold between your room noise and your speaking level: -40 dBFS is a safe default for a quiet room, and -50 dBFS is more conservative when the room is noisy." },
      ]}
    >
      <RemoveSilenceClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "remove-silence-from-audio", __enMetadata);
}
