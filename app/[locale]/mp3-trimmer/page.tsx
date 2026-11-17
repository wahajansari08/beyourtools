import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp3TrimmerClient from "./Mp3TrimmerClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "MP3 Trimmer - Trim MP3 Audio Online Free | BeYourTools",
  description: "Trim MP3 files to the exact section you need. Set start and end points, preview your selection, and download the trimmed audio. Free and browser-based.",
  keywords: "mp3 trimmer, trim mp3 online, mp3 cutter trimmer, trim audio online free, mp3 clip maker",
  path: "/mp3-trimmer",
});

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
        "100% browser-based - no upload",
      ]}
      formats={["MP3"]}
      faqs={[
        { question: "What is the difference between MP3 Trimmer and MP3 Cutter?", answer: "There is no functional difference. Both tools use the same selection controls and the same trimming engine, so either page gives you the same result. Use whichever page you landed on." },
        { question: "Can I trim from the start only?", answer: "Yes - set the start slider to where you want the audio to begin and leave the end at the file's full duration." },
        { question: "Will trimming affect audio quality?", answer: "No. Trimming copies the MP3 frames without re-encoding, so the audio stays bit-identical to the original at its original bitrate. There is no 192 kbps re-encode and no quality loss from trimming." },
        { question: "How much smaller does the file get when I trim it?", answer: "The output size follows the length you keep, because the bitrate stays the same. For example, a 4 minute song at 128 kbps is about 3.8 MB, and trimming it to 1 minute leaves about 0.96 MB. Halving the length roughly halves the file size." },
        { question: "Can I trim the start and the end off in one pass?", answer: "Yes, if the part you want to keep is one continuous stretch. Set the start where the good audio begins and the end where it finishes, and everything outside that range is dropped in a single run. To remove a section from the middle as well, trim once, then upload the result and trim again." },
      ]}
    >
      <Mp3TrimmerClient />
    </AudioToolPage>
  );
}


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "mp3-trimmer", __enMetadata);
}
