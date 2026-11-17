import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3CutterClient from "./Mp3CutterClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "MP3 Cutter - Cut MP3 Audio Online Free | BeYourTools",
  description: "Cut MP3 files online for free. Select the exact start and end point, preview your selection, and download the trimmed audio. Browser-based, no upload.",
  keywords: "mp3 cutter, cut mp3 online, trim mp3, mp3 trimmer online, cut audio online free",
  path: "/mp3-cutter",
});

export default function Mp3CutterPage() {
  return (
    <AudioToolPage
      slug="mp3-cutter"
      title="MP3 Cutter"
      categoryLabel="Cutters & Trimmers"
      tagline="Select a precise start and end point in your MP3 file and save just that section. Perfect for ringtones, clips and highlights."
      description="Free online MP3 cutter. Cut any section from an MP3 file using start and end sliders. Browser-based, no upload."
      howTo={[
        { title: "Upload MP3", text: "Drop your MP3 or click to browse." },
        { title: "Set start and end", text: "Drag the start and end sliders, or type exact timestamps. Preview your selection with the Preview button." },
        { title: "Cut", text: 'Click "Cut MP3" to process only the selected region.' },
        { title: "Download", text: "Preview the cut audio and download it." },
      ]}
      features={[
        "Visual start/end selection sliders",
        "Precise timestamp inputs",
        "Preview selection before cutting",
        "Shows original and selected duration",
        "100% browser-based - no upload",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "Can I cut to millisecond precision?", answer: "The sliders work to 0.1-second precision. For finer control, type the exact value in seconds in the number inputs (e.g. 12.5)." },
        { question: "Does cutting re-encode the MP3?", answer: "No. The selected region is copied without re-encoding, so the audio stays bit-identical to the original and keeps its original bitrate. The cut lands on the nearest MP3 frame boundary, within about 26 milliseconds of the time you set." },
        { question: "Will the cut start exactly at the second I picked?", answer: "Almost. MP3 audio is stored in frames of about 26 milliseconds, so the cut lands on the nearest frame boundary, within about 26 milliseconds of the time you set. For ringtones, clips and highlights that difference is too small to hear." },
        { question: "How big is a 30 second ringtone cut from an MP3?", answer: "It depends on the bitrate of your file. A 30 second clip from a 128 kbps MP3 is about 470 KB, and the same 30 seconds from a 320 kbps file is about 1.2 MB. Both are far below the usual ringtone and message attachment limits, so either works." },
        { question: "What if I want multiple clips from one file?", answer: "Process the file once per clip. Each run lets you set a new start/end region." },
      ]}
    >
      <Mp3CutterClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "mp3-cutter", __enMetadata);
}
