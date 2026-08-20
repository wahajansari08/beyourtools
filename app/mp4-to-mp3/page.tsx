import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import Mp4ToMp3Client from "./Mp4ToMp3Client";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MP4 to MP3 Converter - Extract Audio from Video Free | BeYourTools",
  description: "Extract the audio track from MP4 videos and save it as MP3. Free, browser-based, no upload. Supports MP4, MOV, MKV and WebM.",
  keywords: "mp4 to mp3, extract audio from video, mp4 to mp3 converter, video to mp3, convert mp4 online",
  alternates: { canonical: `${SITE.url}/mp4-to-mp3` },
};

export default function Mp4ToMp3Page() {
  return (
    <AudioToolPage
      slug="mp4-to-mp3"
      title="MP4 to MP3"
      categoryLabel="Converters"
      tagline="Extract the audio track from an MP4 video and download it as an MP3 file — directly in your browser, no upload needed."
      description="Free MP4 to MP3 converter. Extract audio from MP4, MOV, MKV and WebM video files in your browser."
      howTo={[
        { title: "Choose bitrate", text: "Select the MP3 bitrate for the extracted audio." },
        { title: "Upload MP4", text: "Drop your MP4 or other video file onto the upload area." },
        { title: "Extract", text: 'Click "Extract MP3 audio". The video stream is discarded; only the audio is kept.' },
        { title: "Download", text: "Preview the extracted audio and download the MP3 file." },
      ]}
      features={[
        "Extracts audio from MP4, MOV, MKV and WebM",
        "Selectable MP3 bitrate 64–320 kbps",
        "Video never uploaded to a server",
        "Powered by FFmpeg WebAssembly",
        "Audio preview after extraction",
      ]}
      formats={["MP4", "MOV", "MKV", "WebM", "M4V"]}
      faqs={[
        { question: "Does this work with large MP4 files?", answer: "Yes, but very large files (>500 MB) may be slow in the browser due to memory limits. For best performance keep files under 200 MB." },
        { question: "Is the video uploaded to a server?", answer: "No. FFmpeg runs as WebAssembly in your browser. The video file never leaves your device." },
        { question: "What if the MP4 has no audio?", answer: "The tool will show an error. Make sure your video file contains an audio track before converting." },
      ]}
    >
      <Mp4ToMp3Client />
    </AudioToolPage>
  );
}
