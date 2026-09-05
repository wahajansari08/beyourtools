import type { Metadata } from "next";
import AudioToolPage from "@/components/audio/AudioToolPage";
import AudioRecorderClient from "./AudioRecorderClient";
import { createToolMetadata } from "@/lib/seo";

export const metadata: Metadata = createToolMetadata({
  title: "Online Audio Recorder - Record Voice Free | BeYourTools",
  description: "Record audio from your microphone directly in the browser. Pause, resume, stop and download your recording. Free, no sign-up, no upload.",
  keywords: "online audio recorder, voice recorder online, record audio browser, microphone recorder, free voice recorder, record sound online",
  path: "/audio-recorder",
});

export default function AudioRecorderPage() {
  return (
    <AudioToolPage
      slug="audio-recorder"
      title="Audio Recorder"
      categoryLabel="Recorder"
      tagline="Record audio directly from your microphone in the browser. Pause, resume and download your recording - no installation needed."
      description="Free online audio recorder. Record from your microphone, pause, resume and download. No upload, no account required."
      howTo={[
        { title: "Allow microphone", text: 'Click "Start Recording" and allow microphone access when your browser prompts you.' },
        { title: "Record", text: "Speak or play audio. The timer shows how long you have been recording." },
        { title: "Pause / Resume", text: "Pause recording at any time and resume when ready. The timer continues from where you left off." },
        { title: "Stop and download", text: 'Click "Stop" when done. Preview the recording and download it.' },
      ]}
      features={[
        "Start, pause, resume, stop controls",
        "Live recording timer",
        "Automatic format detection (WebM/OGG/MP4)",
        "Playback before downloading",
        "Descriptive filename with timestamp",
        "Microphone released after recording stops",
        "No upload - recording stays on your device",
      ]}
      formats={["WebM (Opus)", "OGG (Opus)", "MP4"]}
      faqs={[
        { question: "What format will the recording be in?", answer: "The format depends on your browser. Chrome and Edge use WebM with Opus audio. Firefox uses OGG. Safari may use MP4. The tool automatically detects the best supported format." },
        { question: "Can I convert the recording to MP3?", answer: "Yes. After downloading, upload the file to the Audio Converter tool on this site to convert it to MP3 or any other format." },
        { question: "Will the microphone stay on after I stop?", answer: "No. The microphone stream is released as soon as you click Stop, cancel, or leave the page." },
        { question: "Does this work on mobile?", answer: "Yes, on modern iOS (Safari) and Android (Chrome) browsers. iOS requires Safari and HTTPS. The recorder uses the standard browser MediaRecorder API." },
      ]}
    >
      <AudioRecorderClient />
    </AudioToolPage>
  );
}
