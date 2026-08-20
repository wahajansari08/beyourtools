import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3TrimmerClient from "./Mp3TrimmerClient";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MP3 Trimmer - Trim MP3 Audio Online Free | BeYourTools",
  description: "Trim MP3 files to the exact section you need. Set start and end points, preview your selection, and download the trimmed audio. Free and browser-based.",
  keywords: "mp3 trimmer, trim mp3 online, mp3 cutter trimmer, trim audio online free, mp3 clip maker",
  alternates: { canonical: `${SITE.url}/mp3-trimmer` },
};

export default function Mp3TrimmerPage() {
  return (
    <AudioToolPage
      slug="mp3-trimmer"
      title="MP3 Trimmer"
      categoryLabel="Cutters & Trimmers"
      tagline="Precisely trim your MP3 to keep only the part you need. Use the visual timeline to set exact start and end points."
      description="Free online MP3 trimmer. Set precise start/end timestamps, preview the selection, and download the trimmed MP3."
      howTo={[
        { title: "Upload MP3", text: "Drop your MP3 file or click to browse." },
        { title: "Set trim points", text: "Drag the start and end sliders or type precise values in the input fields. The visual bar shows your selection." },
        { title: "Preview", text: "Click Preview to hear exactly what will be exported." },
        { title: "Trim and download", text: 'Click "Trim MP3" then download your result.' },
      ]}
      features={[
        "Visual start/end timeline selection",
        "Precise decimal-second timestamp inputs",
        "Real-time selection preview",
        "Shows original and trimmed duration",
        "FFmpeg-powered, 100% browser-based",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "What is the difference between MP3 Trimmer and MP3 Cutter?", answer: "Both tools do the same job — select a region and export it. The Trimmer interface is optimised for precision trimming with exact timestamp inputs, while the Cutter is designed for quickly grabbing a section by dragging handles." },
        { question: "Can I trim from the start only?", answer: "Yes — set the start slider to where you want the audio to begin and leave the end at the file's full duration." },
        { question: "Will trimming affect audio quality?", answer: "Re-encoding to MP3 at 192 kbps causes minimal perceptible quality loss. If quality is critical, consider saving as WAV using the Audio Cutter tool." },
      ]}
    >
      <Mp3TrimmerClient />
    </AudioToolPage>
  );
}
