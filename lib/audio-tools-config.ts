export type AudioCategory = "Converters" | "Cutters & Trimmers" | "Compressors" | "Mergers" | "Effects & Processing" | "Recorder";

export interface AudioTool {
  slug: string;
  name: string;
  description: string;
  category: AudioCategory;
  icon: string;
}

export const audioTools: AudioTool[] = [
  // Converters
  { slug: "mp3-converter",    name: "MP3 Converter",      description: "Convert any audio file to MP3 with selectable bitrate.",                    category: "Converters",              icon: "🎵" },
  { slug: "audio-converter",  name: "Audio Converter",    description: "Convert between MP3, WAV, OGG, FLAC, M4A, AAC and more.",                   category: "Converters",              icon: "🔄" },
  { slug: "mp4-to-mp3",       name: "MP4 to MP3",         description: "Extract the audio track from an MP4 video and save it as MP3.",             category: "Converters",              icon: "🎬" },
  { slug: "mp3-to-wav",       name: "MP3 to WAV",         description: "Convert MP3 audio to uncompressed WAV format.",                             category: "Converters",              icon: "🔉" },
  { slug: "wav-to-mp3",       name: "WAV to MP3",         description: "Convert WAV audio to compressed MP3 with bitrate control.",                 category: "Converters",              icon: "🔊" },
  { slug: "m4a-to-mp3",       name: "M4A to MP3",         description: "Convert M4A (Apple audio) files to widely compatible MP3.",                 category: "Converters",              icon: "🍎" },
  { slug: "flac-to-mp3",      name: "FLAC to MP3",        description: "Convert lossless FLAC files to compressed MP3 format.",                     category: "Converters",              icon: "🎼" },
  { slug: "ogg-to-mp3",       name: "OGG to MP3",         description: "Convert OGG Vorbis audio files to MP3 format.",                             category: "Converters",              icon: "🎶" },
  // Cutters & Trimmers
  { slug: "mp3-cutter",       name: "MP3 Cutter",         description: "Cut an MP3 file -select start and end points and save the section.",       category: "Cutters & Trimmers",      icon: "✂️" },
  { slug: "audio-cutter",     name: "Audio Cutter",       description: "Cut audio files in any supported format by selecting a range.",             category: "Cutters & Trimmers",      icon: "🔪" },
  { slug: "mp3-trimmer",      name: "MP3 Trimmer",        description: "Trim silence or unwanted sections from the start or end of an MP3.",        category: "Cutters & Trimmers",      icon: "📐" },
  // Compressors
  { slug: "mp3-compressor",   name: "MP3 Compressor",     description: "Reduce MP3 file size by re-encoding at a lower bitrate.",                   category: "Compressors",             icon: "📦" },
  { slug: "audio-compressor", name: "Audio Compressor",   description: "Compress audio files to reduce size while preserving quality.",             category: "Compressors",             icon: "🗜️" },
  // Mergers
  { slug: "mp3-merger",       name: "MP3 Merger",         description: "Merge multiple MP3 files into one seamless audio file.",                    category: "Mergers",                 icon: "🔗" },
  { slug: "audio-joiner",     name: "Audio Joiner",       description: "Join multiple audio files of any format into a single output.",             category: "Mergers",                 icon: "➕" },
  // Effects & Processing
  { slug: "mp3-volume-booster",         name: "MP3 Volume Booster",        description: "Increase the volume of an MP3 file with gain control.",            category: "Effects & Processing", icon: "🔈" },
  { slug: "audio-normalizer",           name: "Audio Normalizer",          description: "Normalize audio levels to a consistent peak or dynamic level.",    category: "Effects & Processing", icon: "📊" },
  { slug: "change-audio-speed",         name: "Change Audio Speed",        description: "Speed up or slow down audio without re-uploading.",               category: "Effects & Processing", icon: "⏩" },
  { slug: "remove-silence-from-audio",  name: "Remove Silence",            description: "Automatically detect and remove silent sections from audio.",     category: "Effects & Processing", icon: "🔇" },
  // Recorder
  { slug: "audio-recorder",  name: "Audio Recorder",     description: "Record audio directly from your microphone and download the result.",       category: "Recorder",                icon: "🎙️" },
];

export const audioCategories: AudioCategory[] = [
  "Converters",
  "Cutters & Trimmers",
  "Compressors",
  "Mergers",
  "Effects & Processing",
  "Recorder",
];

export function getAudioTool(slug: string): AudioTool | undefined {
  return audioTools.find((t) => t.slug === slug);
}

export function audioByCategory(category: AudioCategory): AudioTool[] {
  return audioTools.filter((t) => t.category === category);
}

export function relatedAudioTools(slug: string, max = 5): AudioTool[] {
  const tool = getAudioTool(slug);
  if (!tool) return [];
  return audioTools
    .filter((t) => t.category === tool.category && t.slug !== slug)
    .slice(0, max);
}
