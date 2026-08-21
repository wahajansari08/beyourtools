export type VideoCategory =
  | "Compress & Convert"
  | "Cut & Edit"
  | "Resize & Crop"
  | "GIF & Frames"
  | "Audio";

export type VideoToolKind =
  | "compress"
  | "cut"
  | "trim"
  | "convert"
  | "mp4-to-mp3"
  | "mov-to-mp4"
  | "mkv-to-mp4"
  | "webm-to-mp4"
  | "resize"
  | "crop"
  | "video-to-gif"
  | "gif-to-mp4"
  | "merge"
  | "join"
  | "speed"
  | "video-to-webm"
  | "thumbnail"
  | "frames"
  | "remove-audio"
  | "add-audio";

export interface VideoFAQ {
  question: string;
  answer: string;
}

export interface VideoTool {
  slug: string;
  name: string;
  description: string;
  category: VideoCategory;
  icon: string;
  kind: VideoToolKind;
  title: string;
  metaDescription: string;
  tagline: string;
  accept: string;
  acceptLabel: string;
  outputExt: string;
  outputMime: string;
  processLabel: string;
  formats: string[];
  howTo: { title: string; text: string }[];
  features: string[];
  faqs: VideoFAQ[];
  related: string[];
  engine: "ffmpeg" | "browser";
  multiple?: boolean;
}

const privacyFaq = {
  question: "Is my video uploaded to a server?",
  answer: "No. This tool processes your files locally in your browser. BeYourTools does not upload, store, or send your media to a processing API.",
};

export const videoCategories: VideoCategory[] = [
  "Compress & Convert",
  "Cut & Edit",
  "Resize & Crop",
  "GIF & Frames",
  "Audio",
];

export const videoTools: VideoTool[] = [
  {
    slug: "video-compressor",
    name: "Video Compressor",
    description: "Reduce video file size with quality, resolution, and format controls.",
    category: "Compress & Convert",
    icon: "MP4",
    kind: "compress",
    title: "Video Compressor - Compress Video Online Free | BeYourTools",
    metaDescription: "Compress videos online for free. Reduce video file size while maintaining quality. Process your video directly in your browser.",
    tagline: "Compress MP4, WebM, MOV, and other videos locally with practical presets for size and quality.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Compress video",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Drop a video file or choose one from your device." },
      { title: "Choose settings", text: "Pick a compression preset, optional resolution, and output format." },
      { title: "Compress", text: "Process your video locally and wait for the output preview." },
      { title: "Download", text: "Compare file sizes and save the compressed video." },
    ],
    features: ["CRF based quality presets", "Optional downscaling without upscaling by default", "Before and after size comparison", "Output preview before download"],
    faqs: [
      { question: "Will the file always become smaller?", answer: "Usually, but not always. Already optimized videos can occasionally become larger if you choose a high quality preset." },
      { question: "What does CRF mean?", answer: "CRF controls visual quality. Lower values keep more detail and create larger files; higher values compress more aggressively." },
      privacyFaq,
    ],
    related: ["video-resizer", "video-converter", "video-cutter", "video-to-webm"],
    engine: "ffmpeg",
  },
  {
    slug: "video-cutter",
    name: "Video Cutter",
    description: "Cut a precise section from a video using start and end times.",
    category: "Cut & Edit",
    icon: "CUT",
    kind: "cut",
    title: "Video Cutter - Cut Videos Online Free | BeYourTools",
    metaDescription: "Cut videos online for free. Select the exact section you want and download your trimmed video.",
    tagline: "Select the exact start and end point, preview the chosen range, and export only that section.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Cut video",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Choose a video and wait for the duration to load." },
      { title: "Set range", text: "Move the start and end controls or type precise timestamps." },
      { title: "Preview", text: "Jump to the selected section to confirm the cut." },
      { title: "Export", text: "Cut the range locally and download the result." },
    ],
    features: ["Start and end validation", "Selected duration display", "Responsive timeline controls", "Browser-only export"],
    faqs: [
      { question: "Can I cut without re-encoding?", answer: "This tool re-encodes to MP4 for predictable browser playback and codec compatibility." },
      { question: "Can I enter exact times?", answer: "Yes. Use the timestamp fields for second-level precision." },
      privacyFaq,
    ],
    related: ["video-trimmer", "video-merger", "video-joiner", "video-speed-changer"],
    engine: "ffmpeg",
  },
  {
    slug: "video-trimmer",
    name: "Video Trimmer",
    description: "Trim unwanted starts and endings from your video with precise handles.",
    category: "Cut & Edit",
    icon: "TRIM",
    kind: "trim",
    title: "Video Trimmer - Trim Videos Online Free | BeYourTools",
    metaDescription: "Trim videos online for free. Remove unwanted starts or endings and export the selected section in your browser.",
    tagline: "Clean up the beginning or end of a clip with a focused trimming workspace.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Trim video",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Load the clip you want to trim." },
      { title: "Move handles", text: "Set the section to keep with the range controls." },
      { title: "Preview", text: "Check the selected section before exporting." },
      { title: "Download", text: "Export the trimmed clip as MP4." },
    ],
    features: ["Dedicated trimming UI", "Precise start and end inputs", "Output duration preview", "Local browser processing"],
    faqs: [
      { question: "What is the difference between trim and cut?", answer: "Trimming is focused on keeping a clean middle section, usually by removing the beginning or end. Cutting can be used for any selected range." },
      { question: "Does trimming change quality?", answer: "The output is encoded using a balanced MP4 profile so it plays reliably in modern browsers." },
      privacyFaq,
    ],
    related: ["video-cutter", "video-speed-changer", "video-merger", "video-joiner"],
    engine: "ffmpeg",
  },
  {
    slug: "video-converter",
    name: "Video Converter",
    description: "Convert videos between MP4, WebM, MOV, and MKV with quality controls.",
    category: "Compress & Convert",
    icon: "CONV",
    kind: "convert",
    title: "Video Converter - Convert Video Online Free | BeYourTools",
    metaDescription: "Convert videos online for free between supported formats such as MP4 and WebM. Local browser processing with no upload.",
    tagline: "Convert common video files to browser-friendly formats without sending them to a server.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Convert video",
    formats: ["MP4", "WebM", "MOV", "MKV"],
    howTo: [
      { title: "Upload", text: "Select the source video." },
      { title: "Choose output", text: "Pick MP4, WebM, MOV, or MKV and optional quality/resolution settings." },
      { title: "Convert", text: "Convert the video locally in your browser." },
      { title: "Download", text: "Preview and download the converted file." },
    ],
    features: ["Format detection from filename", "Selectable output format", "Quality and resolution controls", "Local conversion"],
    faqs: [
      { question: "Which output format should I choose?", answer: "MP4 is the best default for compatibility. WebM is useful for modern web delivery. MOV and MKV are available when you need those containers." },
      { question: "Can every codec be converted?", answer: "Most common codecs work, but unusual or DRM-protected files may fail in local browser processing." },
      privacyFaq,
    ],
    related: ["mov-to-mp4", "mkv-to-mp4", "webm-to-mp4", "video-to-webm"],
    engine: "ffmpeg",
  },
  {
    slug: "mp4-to-mp3",
    name: "MP4 to MP3",
    description: "Extract MP3 audio from MP4 and other video files.",
    category: "Audio",
    icon: "MP3",
    kind: "mp4-to-mp3",
    title: "MP4 to MP3 Converter - Extract Audio Online Free | BeYourTools",
    metaDescription: "Extract audio from MP4 videos and save it as MP3. Choose bitrate and process the file locally in your browser.",
    tagline: "Turn the audio track from a video into an MP3 file with bitrate control.",
    accept: "video/mp4,video/*,.mp4,.m4v,.mov,.mkv,.webm",
    acceptLabel: "MP4, MOV, MKV, WebM, M4V",
    outputExt: "mp3",
    outputMime: "audio/mpeg",
    processLabel: "Extract MP3 audio",
    formats: ["MP4", "MOV", "MKV", "WebM", "M4V"],
    howTo: [
      { title: "Choose bitrate", text: "Select 96 kbps through 320 kbps depending on the quality you need." },
      { title: "Upload video", text: "Drop an MP4 or another supported video file." },
      { title: "Extract", text: "The tool extracts the audio track and discards the video." },
      { title: "Download", text: "Preview the audio and download the MP3." },
    ],
    features: ["MP3 bitrate selector", "Video preview before extraction", "Audio preview after conversion", "No upload"],
    faqs: [
      { question: "What if the video has no audio?", answer: "The tool will show a friendly processing error. Choose a video that contains an audio track." },
      { question: "Does this preserve the video?", answer: "No. The output is an MP3 audio file only." },
      privacyFaq,
    ],
    related: ["video-to-webm", "audio-converter", "mp3-converter", "remove-audio-from-video"],
    engine: "ffmpeg",
  },
  {
    slug: "mov-to-mp4",
    name: "MOV to MP4",
    description: "Convert Apple MOV videos to widely compatible MP4 files.",
    category: "Compress & Convert",
    icon: "MOV",
    kind: "mov-to-mp4",
    title: "MOV to MP4 Converter - Convert Video Online Free | BeYourTools",
    metaDescription: "Convert MOV to MP4 online for free. Make Apple QuickTime videos easier to share with local browser processing.",
    tagline: "Convert MOV files from iPhone, iPad, or QuickTime into MP4 for easier sharing.",
    accept: "video/quicktime,.mov",
    acceptLabel: "MOV video files",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Convert to MP4",
    formats: ["MOV"],
    howTo: [
      { title: "Upload MOV", text: "Choose a .mov file from your device." },
      { title: "Adjust quality", text: "Use balanced settings or choose a smaller/larger output." },
      { title: "Convert", text: "Re-encode to MP4 locally." },
      { title: "Download", text: "Save the MP4 result." },
    ],
    features: ["MOV to MP4 conversion", "Quality and resolution options", "Output preview", "Private browser processing"],
    faqs: [
      { question: "Why convert MOV to MP4?", answer: "MP4 is usually easier to play, upload, and share across websites and devices." },
      { question: "Will iPhone videos work?", answer: "Most iPhone MOV files work, although very new codecs may depend on browser and FFmpeg support." },
      privacyFaq,
    ],
    related: ["video-converter", "video-compressor", "video-to-webm", "mp4-to-mp3"],
    engine: "ffmpeg",
  },
  {
    slug: "mkv-to-mp4",
    name: "MKV to MP4",
    description: "Convert MKV videos to MP4 for broader playback compatibility.",
    category: "Compress & Convert",
    icon: "MKV",
    kind: "mkv-to-mp4",
    title: "MKV to MP4 Converter - Convert Video Online Free | BeYourTools",
    metaDescription: "Convert MKV videos to MP4 online for free using local browser processing in your browser.",
    tagline: "Make MKV files easier to preview, share, and play by converting them to MP4.",
    accept: ".mkv,video/x-matroska,video/*",
    acceptLabel: "MKV video files",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Convert to MP4",
    formats: ["MKV"],
    howTo: [
      { title: "Upload MKV", text: "Choose the MKV file to convert." },
      { title: "Pick settings", text: "Select quality and optional resolution." },
      { title: "Convert", text: "The file is converted to MP4 locally in your browser." },
      { title: "Download", text: "Save the MP4 output." },
    ],
    features: ["MKV input support", "MP4 output", "Handles common codecs", "No server upload"],
    faqs: [
      { question: "Why might preview not work before converting?", answer: "Some browsers cannot play MKV directly, but FFmpeg may still be able to convert it." },
      { question: "Are subtitles preserved?", answer: "This first implementation focuses on video and audio tracks. Subtitle handling may vary by source file." },
      privacyFaq,
    ],
    related: ["video-converter", "webm-to-mp4", "mov-to-mp4", "video-compressor"],
    engine: "ffmpeg",
  },
  {
    slug: "webm-to-mp4",
    name: "WebM to MP4",
    description: "Convert WebM videos to MP4 with quality and resolution settings.",
    category: "Compress & Convert",
    icon: "WEBM",
    kind: "webm-to-mp4",
    title: "WebM to MP4 Converter - Convert Video Online Free | BeYourTools",
    metaDescription: "Convert WebM to MP4 online for free. Browser-based conversion with no file upload.",
    tagline: "Turn WebM recordings or downloads into MP4 files for wider compatibility.",
    accept: "video/webm,.webm",
    acceptLabel: "WebM video files",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Convert to MP4",
    formats: ["WebM"],
    howTo: [
      { title: "Upload WebM", text: "Select your WebM video." },
      { title: "Choose quality", text: "Use balanced output or customize resolution." },
      { title: "Convert", text: "Convert to MP4 locally in your browser." },
      { title: "Download", text: "Preview and save your MP4 file." },
    ],
    features: ["WebM to MP4 conversion", "Quality presets", "Optional resizing", "Local processing"],
    faqs: [
      { question: "Why convert WebM to MP4?", answer: "MP4 is accepted by more apps, social platforms, and older devices." },
      { question: "Will transparency be preserved?", answer: "MP4 does not generally preserve alpha transparency. Use WebM if transparency is required." },
      privacyFaq,
    ],
    related: ["video-to-webm", "video-converter", "video-compressor", "mp4-to-mp3"],
    engine: "ffmpeg",
  },
  {
    slug: "video-resizer",
    name: "Video Resizer",
    description: "Resize video dimensions with aspect-ratio locking and presets.",
    category: "Resize & Crop",
    icon: "SIZE",
    kind: "resize",
    title: "Video Resizer - Resize Video Online Free | BeYourTools",
    metaDescription: "Resize videos online for free. Change width and height while keeping aspect ratio, directly in your browser.",
    tagline: "Change video dimensions for web, social, or storage without uploading the file.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Resize video",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Load the source video and check its current dimensions." },
      { title: "Choose size", text: "Pick a preset or enter a custom width and height." },
      { title: "Resize", text: "Export the resized video locally." },
      { title: "Download", text: "Preview and save the MP4 result." },
    ],
    features: ["1920x1080, 1280x720, 854x480, 640x360 presets", "Aspect ratio lock", "No upscaling by default", "Original and output dimensions"],
    faqs: [
      { question: "Will this upscale my video?", answer: "No by default. If you choose a size larger than the source, the tool keeps the original size unless you explicitly turn on upscaling." },
      { question: "Does resizing crop the video?", answer: "No. Resizing scales the entire frame. Use Video Cropper to remove edges or change composition." },
      privacyFaq,
    ],
    related: ["video-cropper", "video-compressor", "video-thumbnail-generator", "video-converter"],
    engine: "ffmpeg",
  },
  {
    slug: "video-cropper",
    name: "Video Cropper",
    description: "Crop videos visually with aspect-ratio presets and export MP4.",
    category: "Resize & Crop",
    icon: "CROP",
    kind: "crop",
    title: "Video Cropper - Crop Video Online Free | BeYourTools",
    metaDescription: "Crop videos online for free. Select a crop area, choose an aspect ratio, and export locally in your browser.",
    tagline: "Focus the frame by cropping edges or switching to square, vertical, or widescreen formats.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Crop video",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Choose a video and wait for dimensions to load." },
      { title: "Select crop", text: "Drag the crop box or use numeric controls for exact dimensions." },
      { title: "Pick ratio", text: "Use Free, 16:9, 4:3, 1:1, or 9:16." },
      { title: "Export", text: "Crop and download the MP4 result." },
    ],
    features: ["Visual crop overlay", "Aspect ratio presets", "Pixel dimensions display", "Built-in crop processing"],
    faqs: [
      { question: "Can I make a vertical video?", answer: "Yes. Choose the 9:16 preset and position the crop box around the subject." },
      { question: "Does cropping stretch the video?", answer: "No. Cropping removes pixels outside the selected rectangle. It does not distort the selected area." },
      privacyFaq,
    ],
    related: ["video-resizer", "video-thumbnail-generator", "extract-video-frames", "video-compressor"],
    engine: "ffmpeg",
  },
  {
    slug: "video-to-gif",
    name: "Video to GIF",
    description: "Convert a short video section to an animated GIF.",
    category: "GIF & Frames",
    icon: "GIF",
    kind: "video-to-gif",
    title: "Video to GIF Converter - Make GIFs from Video | BeYourTools",
    metaDescription: "Convert video clips to GIF online for free. Choose start, end, width, FPS, and quality in your browser.",
    tagline: "Create short GIFs from video clips with sensible defaults that avoid huge files.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "gif",
    outputMime: "image/gif",
    processLabel: "Create GIF",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Load a video and pick a short range." },
      { title: "Set GIF options", text: "Choose width, FPS, and quality." },
      { title: "Convert", text: "Generate the GIF locally." },
      { title: "Download", text: "Preview and save the animated GIF." },
    ],
    features: ["Short clip defaults", "GIF width and FPS controls", "Palette generation for better color", "Large file warning"],
    faqs: [
      { question: "Why are GIF files so large?", answer: "GIF is an older animation format. Short clips, smaller width, and lower FPS keep output sizes manageable." },
      { question: "What duration should I use?", answer: "A few seconds is best for browser memory and download size." },
      privacyFaq,
    ],
    related: ["gif-to-mp4", "video-thumbnail-generator", "extract-video-frames", "video-cutter"],
    engine: "ffmpeg",
  },
  {
    slug: "gif-to-mp4",
    name: "GIF to MP4",
    description: "Convert animated GIFs to smaller MP4 video files.",
    category: "GIF & Frames",
    icon: "MP4",
    kind: "gif-to-mp4",
    title: "GIF to MP4 Converter - Convert GIF Online Free | BeYourTools",
    metaDescription: "Convert GIF to MP4 online for free. Create smaller, easier-to-share video files in your browser.",
    tagline: "Turn animated GIFs into MP4 files that are often much smaller and smoother.",
    accept: "image/gif,.gif",
    acceptLabel: "GIF images",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Convert GIF to MP4",
    formats: ["GIF"],
    howTo: [
      { title: "Upload GIF", text: "Choose an animated GIF file." },
      { title: "Choose settings", text: "Select quality and optional resolution." },
      { title: "Convert", text: "Generate an MP4 video locally." },
      { title: "Download", text: "Save the MP4 output." },
    ],
    features: ["GIF input preview", "MP4 output", "Quality and resolution controls", "Browser-only processing"],
    faqs: [
      { question: "Why convert GIF to MP4?", answer: "MP4 is often much smaller than GIF and plays smoothly in modern browsers and apps." },
      { question: "Will the MP4 loop?", answer: "The exported MP4 contains the animation frames once. Looping depends on the player or platform where you use it." },
      privacyFaq,
    ],
    related: ["video-to-gif", "video-compressor", "video-converter", "video-to-webm"],
    engine: "ffmpeg",
  },
  {
    slug: "video-merger",
    name: "Video Merger",
    description: "Merge multiple videos into one MP4 file in your browser.",
    category: "Cut & Edit",
    icon: "MERGE",
    kind: "merge",
    title: "Video Merger - Merge Videos Online Free | BeYourTools",
    metaDescription: "Merge videos online for free. Reorder clips and combine them into one MP4 file locally in your browser.",
    tagline: "Combine multiple clips into one continuous MP4 with queue controls and local processing.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Merge videos",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Add clips", text: "Upload two or more video files." },
      { title: "Reorder", text: "Move clips up or down in the queue." },
      { title: "Merge", text: "Normalize and concatenate the files into one MP4." },
      { title: "Download", text: "Preview and save the merged video." },
    ],
    features: ["Multiple file queue", "Reorder and remove clips", "Total duration and size display", "Normalization before concat"],
    faqs: [
      { question: "Can clips have different sizes?", answer: "Yes. The merger normalizes clips to a common MP4 profile before joining them." },
      { question: "How many clips can I merge?", answer: "There is no fixed small limit, but browser memory becomes the practical limit for large or many videos." },
      privacyFaq,
    ],
    related: ["video-joiner", "video-cutter", "video-trimmer", "video-compressor"],
    engine: "ffmpeg",
    multiple: true,
  },
  {
    slug: "video-joiner",
    name: "Video Joiner",
    description: "Join video clips sequentially with the same local merge engine.",
    category: "Cut & Edit",
    icon: "JOIN",
    kind: "join",
    title: "Video Joiner - Join Videos Online Free | BeYourTools",
    metaDescription: "Join videos online for free. Arrange multiple clips and export one combined video without uploading files.",
    tagline: "Line up clips in order and export a single joined video for sharing or editing.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Join videos",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload videos", text: "Add at least two clips." },
      { title: "Set order", text: "Use queue controls to arrange clips sequentially." },
      { title: "Join", text: "Create one MP4 file in the browser." },
      { title: "Download", text: "Save the final joined clip." },
    ],
    features: ["Sequential clip joining", "Queue preview", "Remove and reorder controls", "Local normalization"],
    faqs: [
      { question: "Is joiner different from merger?", answer: "The engine is shared, but this page is tuned for arranging clips in a simple sequence." },
      { question: "Will audio be included?", answer: "Yes, when the source clips contain compatible audio tracks. Unusual files may require conversion first." },
      privacyFaq,
    ],
    related: ["video-merger", "video-cutter", "video-trimmer", "video-speed-changer"],
    engine: "ffmpeg",
    multiple: true,
  },
  {
    slug: "video-speed-changer",
    name: "Video Speed Changer",
    description: "Speed up or slow down videos from 0.25x to 2x.",
    category: "Cut & Edit",
    icon: "SPD",
    kind: "speed",
    title: "Video Speed Changer - Change Video Speed Online | BeYourTools",
    metaDescription: "Change video speed online for free. Slow down or speed up clips and export locally in your browser.",
    tagline: "Create slow motion or faster clips while seeing how the duration changes.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Change speed",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Choose a source video." },
      { title: "Select speed", text: "Pick a preset from 0.25x to 2x or enter a custom value." },
      { title: "Preview", text: "The player updates playback speed for a quick check." },
      { title: "Export", text: "Process and download the changed-speed video." },
    ],
    features: ["0.25x to 2x presets", "Custom speed input", "Duration estimate", "Audio tempo adjustment"],
    faqs: [
      { question: "Does speed change duration?", answer: "Yes. A 2x video is about half as long, while a 0.5x video is about twice as long." },
      { question: "Is pitch preserved?", answer: "The FFmpeg audio tempo filter is used for common speeds, but pitch preservation can vary with extreme settings and source codecs." },
      privacyFaq,
    ],
    related: ["video-cutter", "video-trimmer", "video-merger", "video-joiner"],
    engine: "ffmpeg",
  },
  {
    slug: "video-to-webm",
    name: "Video to WebM",
    description: "Convert videos to WebM for modern web delivery.",
    category: "Compress & Convert",
    icon: "WEBM",
    kind: "video-to-webm",
    title: "Video to WebM Converter - Convert Video Online | BeYourTools",
    metaDescription: "Convert video to WebM online for free. Choose quality, resolution, and FPS with local browser processing.",
    tagline: "Create WebM files for web pages, modern browsers, and efficient online playback.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "webm",
    outputMime: "video/webm",
    processLabel: "Convert to WebM",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Select a video file." },
      { title: "Choose WebM settings", text: "Pick quality, optional resolution, and FPS." },
      { title: "Convert", text: "Encode to WebM locally in your browser." },
      { title: "Download", text: "Preview and save the WebM file." },
    ],
    features: ["WebM output", "Quality and FPS controls", "Optional resizing", "Efficient browser playback"],
    faqs: [
      { question: "When should I use WebM?", answer: "Use WebM for modern web playback, especially when you control the website or app that will display the video." },
      { question: "Does Safari support WebM?", answer: "Modern Safari support has improved, but MP4 remains the safest format for broad compatibility." },
      privacyFaq,
    ],
    related: ["webm-to-mp4", "video-converter", "video-compressor", "gif-to-mp4"],
    engine: "ffmpeg",
  },
  {
    slug: "video-thumbnail-generator",
    name: "Video Thumbnail Generator",
    description: "Capture a PNG or JPG thumbnail from any timestamp.",
    category: "GIF & Frames",
    icon: "IMG",
    kind: "thumbnail",
    title: "Video Thumbnail Generator - Create Thumbnails from Video | BeYourTools",
    metaDescription: "Generate video thumbnails online for free. Select a timestamp and download PNG or JPG images using browser canvas.",
    tagline: "Pick the perfect frame from your video and save it as PNG or JPG without loading FFmpeg.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "Browser-playable videos such as MP4 and WebM",
    outputExt: "png",
    outputMime: "image/png",
    processLabel: "Generate thumbnail",
    formats: ["MP4", "WebM", "MOV where browser-supported"],
    howTo: [
      { title: "Upload", text: "Choose a video that your browser can preview." },
      { title: "Pick timestamp", text: "Move the slider or enter an exact second." },
      { title: "Generate", text: "The current frame is captured from the video." },
      { title: "Download", text: "Save the thumbnail as PNG or JPG." },
    ],
    features: ["No heavy processing required", "Precise timestamp input", "PNG and JPG downloads", "Lightweight canvas capture"],
    faqs: [
      { question: "Why does this tool use Canvas?", answer: "For single-frame capture, the browser video element and Canvas API are faster and lighter than loading FFmpeg." },
      { question: "What if the video will not preview?", answer: "The browser may not support the source codec. Convert it to MP4 first, then generate a thumbnail." },
      privacyFaq,
    ],
    related: ["extract-video-frames", "video-cropper", "video-resizer", "video-to-gif"],
    engine: "browser",
  },
  {
    slug: "extract-video-frames",
    name: "Extract Video Frames",
    description: "Capture one or several still frames from a browser-playable video.",
    category: "GIF & Frames",
    icon: "FRM",
    kind: "frames",
    title: "Extract Video Frames - Save Frames from Video | BeYourTools",
    metaDescription: "Extract frames from video online for free. Choose timestamps and download PNG or JPG images using browser canvas.",
    tagline: "Save single frames or a small set of evenly spaced frames from a video.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "Browser-playable videos such as MP4 and WebM",
    outputExt: "png",
    outputMime: "image/png",
    processLabel: "Extract frame",
    formats: ["MP4", "WebM", "MOV where browser-supported"],
    howTo: [
      { title: "Upload", text: "Load a browser-playable video." },
      { title: "Select frame", text: "Choose a timestamp or a small interval batch." },
      { title: "Extract", text: "Canvas captures frames from the video element." },
      { title: "Download", text: "Save PNG or JPG images." },
    ],
    features: ["Single-frame extraction", "Optional small batch extraction", "PNG and JPG output", "No FFmpeg for lightweight use"],
    faqs: [
      { question: "Can I extract hundreds of frames?", answer: "This tool is intentionally conservative. Extracting huge batches can overwhelm browser memory." },
      { question: "Why might MKV not work?", answer: "Frame extraction relies on HTMLVideoElement playback, so unsupported browser codecs cannot be captured directly." },
      privacyFaq,
    ],
    related: ["video-thumbnail-generator", "video-to-gif", "video-cropper", "video-resizer"],
    engine: "browser",
  },
  {
    slug: "remove-audio-from-video",
    name: "Remove Audio from Video",
    description: "Create a silent video by removing the audio track.",
    category: "Audio",
    icon: "MUTE",
    kind: "remove-audio",
    title: "Remove Audio from Video - Mute Video Online | BeYourTools",
    metaDescription: "Remove audio from video online for free. Create a silent MP4 locally in your browser without uploading files.",
    tagline: "Strip the audio track from a video and keep the visual stream for a silent MP4.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Remove audio",
    formats: ["MP4", "MOV", "MKV", "WebM", "AVI", "M4V"],
    howTo: [
      { title: "Upload", text: "Choose the video to mute." },
      { title: "Preview", text: "Confirm the selected file." },
      { title: "Remove audio", text: "FFmpeg exports a copy without audio tracks." },
      { title: "Download", text: "Save the silent MP4." },
    ],
    features: ["Audio track removal", "Stream copy where safe", "MP4 fallback encoding", "Preview result"],
    faqs: [
      { question: "Does this re-encode the video?", answer: "The tool first tries a stream-copy style output without audio. If the source container requires compatibility work, FFmpeg handles the export." },
      { question: "Can I remove only part of the audio?", answer: "This tool removes the full audio track. Use Add Audio to replace or mix a separate audio file." },
      privacyFaq,
    ],
    related: ["add-audio-to-video", "mp4-to-mp3", "video-converter", "video-compressor"],
    engine: "ffmpeg",
  },
  {
    slug: "add-audio-to-video",
    name: "Add Audio to Video",
    description: "Add, replace, or mix an audio file with a video.",
    category: "Audio",
    icon: "AUD",
    kind: "add-audio",
    title: "Add Audio to Video - Add Music to Video Online | BeYourTools",
    metaDescription: "Add audio to video online for free. Replace or mix audio tracks and export locally in your browser.",
    tagline: "Combine a video with a music, narration, or sound file using replace or mix mode.",
    accept: "video/*,.mp4,.mov,.mkv,.webm,.avi,.m4v",
    acceptLabel: "MP4, MOV, MKV, WebM, AVI, M4V",
    outputExt: "mp4",
    outputMime: "video/mp4",
    processLabel: "Add audio",
    formats: ["Video: MP4, MOV, MKV, WebM", "Audio: MP3, WAV, M4A, AAC, OGG"],
    howTo: [
      { title: "Upload video", text: "Choose the base video." },
      { title: "Upload audio", text: "Add an audio file for music, voice, or effects." },
      { title: "Choose mix mode", text: "Replace the original audio or mix both tracks with volume controls." },
      { title: "Export", text: "Render and download the MP4 result." },
    ],
    features: ["Separate video and audio uploads", "Replace or mix mode", "Video and audio volume controls", "Audio start offset"],
    faqs: [
      { question: "What happens when audio is shorter than the video?", answer: "The output uses the video duration and ends naturally when the video ends. Short audio stops when it reaches its own end." },
      { question: "Can I keep the original audio?", answer: "Yes. Choose Mix mode and adjust video and audio volume." },
      privacyFaq,
    ],
    related: ["remove-audio-from-video", "mp4-to-mp3", "video-merger", "video-converter"],
    engine: "ffmpeg",
  },
];

export function getVideoTool(slug: string): VideoTool | undefined {
  return videoTools.find((tool) => tool.slug === slug);
}

export function videoByCategory(category: VideoCategory): VideoTool[] {
  return videoTools.filter((tool) => tool.category === category);
}

export function relatedVideoTools(slug: string): VideoTool[] {
  const tool = getVideoTool(slug);
  if (!tool) return [];
  return tool.related
    .map((relatedSlug) => getVideoTool(relatedSlug))
    .filter((relatedTool): relatedTool is VideoTool => Boolean(relatedTool));
}
