/**
 * Rich per-format profiles + pair content for video converter pair pages
 * (e.g. /mov-to-mp4, /video-to-gif). Each pair page composes its intro,
 * comparison table, when / when-not guidance, quality and size notes and
 * FAQs from the two formats' factual profiles plus pair-specific notes, so
 * each pair page carries substantively unique, accurate content instead of
 * the shared name-swap guide text.
 */

export interface VideoFormatProfile {
  fullName: string;
  kind: string;
  videoCodec: string;
  audioCodec: string;
  transparencyNote: string;
  animationNote: string;
  support: string;
  strengths: string[];
  weaknesses: string[];
  sizeNote: string;
}

export const VIDEO_FORMAT_PROFILES: Record<string, VideoFormatProfile> = {
  mp4: {
    fullName: "MPEG-4 Part 14",
    kind: "Video container",
    videoCodec: "Usually H.264 or H.265",
    audioCodec: "Usually AAC",
    transparencyNote: "No alpha channel in standard MP4 playback",
    animationNote: "Video, not a still-image animation format",
    support: "Everywhere: browsers, phones, TVs, editors and social platforms",
    strengths: [
      "Plays on practically every device and platform",
      "Good balance of quality and file size",
      "Accepted by every major upload form and editor",
    ],
    weaknesses: [
      "No transparency support for overlays",
      "Re-encoding a lossy source discards a little more detail",
    ],
    sizeNote: "Compact for its quality; the usual sharing default",
  },
  mov: {
    fullName: "Apple QuickTime Movie",
    kind: "Video container",
    videoCodec: "Often H.264, HEVC or ProRes",
    audioCodec: "Usually AAC or uncompressed PCM",
    transparencyNote: "Can carry an alpha channel with ProRes 4444, rarely used for sharing",
    animationNote: "Video, not a still-image animation format",
    support: "Best on Apple devices and editors; patchy on Windows, Android and the web",
    strengths: [
      "The native format of iPhone, iPad and Mac recordings",
      "Can hold very high quality masters, including ProRes",
      "Works smoothly in Final Cut Pro and other Apple workflows",
    ],
    weaknesses: [
      "Large files when recorded in high quality or ProRes",
      "Many Windows players, Android phones and websites refuse it",
    ],
    sizeNote: "Often much larger than the same clip as MP4",
  },
  mkv: {
    fullName: "Matroska Video",
    kind: "Video container",
    videoCodec: "Often H.264, H.265, VP9 or AV1",
    audioCodec: "Often AAC, DTS, AC3 or FLAC",
    transparencyNote: "No alpha channel in standard playback",
    animationNote: "Video, not a still-image animation format",
    support: "Great in VLC and desktop players; weak on smart TVs, phones and browsers",
    strengths: [
      "Holds several audio tracks, subtitles and chapters in one file",
      "A favourite for high quality rips and archives",
      "Open format with no licensing cost",
    ],
    weaknesses: [
      "Many TVs, phones and browsers cannot play it at all",
      "Extra tracks and subtitles may not survive a move to MP4",
    ],
    sizeNote: "Similar to MP4 for the same video; the container itself adds little",
  },
  webm: {
    fullName: "WebM (Google)",
    kind: "Video container",
    videoCodec: "VP8, VP9 or AV1",
    audioCodec: "Vorbis or Opus",
    transparencyNote: "VP9 WebM can carry an alpha channel",
    animationNote: "Video, not a still-image animation format",
    support: "All modern browsers; weaker on Apple devices, older editors and social uploads",
    strengths: [
      "Small files at good quality, built for web playback",
      "Royalty-free codecs, ideal for embedding on a website",
      "Can keep transparency with VP9",
    ],
    weaknesses: [
      "Rejected by many social platforms, editors and older devices",
      "Encoding takes longer than H.264 MP4 in a browser",
    ],
    sizeNote: "Often smaller than MP4 at the same visual quality",
  },
  gif: {
    fullName: "Graphics Interchange Format",
    kind: "Animated image",
    videoCodec: "Frame-by-frame images, no video codec",
    audioCodec: "None: GIF has no audio track",
    transparencyNote: "1-bit only: a pixel is fully clear or fully solid",
    animationNote: "Yes, frame-by-frame animation that loops",
    support: "Everywhere images work: chats, comments, docs and social posts",
    strengths: [
      "Loops automatically wherever images are shown",
      "Needs no video player and no play button",
      "Perfect for short reactions, demos and memes",
    ],
    weaknesses: [
      "Only 256 colours, so gradients and photos look banded",
      "No sound at all",
      "Files balloon quickly with length, width or frame rate",
    ],
    sizeNote: "Small for tiny clips, huge for long or wide ones",
  },
  mp3: {
    fullName: "MPEG Audio Layer III",
    kind: "Audio only",
    videoCodec: "None: audio only",
    audioCodec: "MP3, lossy, typically 128 to 320 kbps",
    transparencyNote: "Not applicable: audio only",
    animationNote: "Not applicable: audio only",
    support: "Everywhere: every player, phone, car stereo and editor",
    strengths: [
      "Plays on literally every device",
      "Small files that are easy to share and store",
      "Bitrate choice trades size against quality",
    ],
    weaknesses: [
      "Lossy: some detail is discarded and cannot be recovered",
      "No video, chapters or album art in the audio stream itself",
    ],
    sizeNote: "Roughly 1 MB per minute at 128 kbps",
  },
};

export interface VideoPairFaq {
  question: string;
  answer: string;
}

export interface VideoPairContent {
  from: string;
  to: string;
  intro: string;
  consequence: string;
  qualitySize: string;
  whenTo: string[];
  whenNotTo: string[];
  settingTip: string;
  faqs: VideoPairFaq[];
}

export const VIDEO_PAIR_CONTENT: Record<string, VideoPairContent> = {
  "mov-to-mp4": {
    from: "mov",
    to: "mp4",
    intro:
      "MOV is the native recording format of iPhones, iPads and Macs, and it is a fine format inside the Apple world. The trouble starts when the clip has to leave it: many Windows PCs, Android phones, websites and upload forms either refuse MOV files or play them without sound. Converting MOV to MP4 keeps the same clip in the container that every device understands, which is why this is one of the most common video conversions there is.",
    consequence:
      "Headline consequence: the picture stays the same clip, but the file becomes playable everywhere. MOV files recorded on an iPhone are often much larger than they need to be for sharing, and MP4 with H.264 is the format upload forms, editors and players expect.",
    qualitySize:
      "This tool re-encodes the clip to MP4 using a balanced profile, so the resolution stays the same but a small amount of detail can be lost, as with any re-encode from one lossy format to another. The output is usually smaller than the MOV, especially for iPhone recordings saved at high quality. Converting will not sharpen a blurry source or add detail that was never recorded.",
    whenTo: [
      "Sharing a clip with someone on Windows or Android",
      "Uploading to a website, form, LMS or social platform that rejects MOV",
      "Editing in a Windows or cross-platform editor that prefers MP4",
      "Archiving phone clips in a format every future device can open",
    ],
    whenNotTo: [
      "Editing in Final Cut Pro, where keeping the original MOV or ProRes master is better",
      "Delivering a ProRes master to a client or broadcaster",
      "When you only need the audio: extract MP3 instead",
    ],
    settingTip:
      "Keep the default balanced quality and the original resolution for the best result. Lower the resolution only if the file must fit an upload limit, and never upscale a small MOV: upscaling adds file size without adding detail.",
    faqs: [
      {
        question: "Will converting MOV to MP4 lose quality?",
        answer:
          "A little, in principle. This tool re-encodes to MP4, and every re-encode from one lossy format to another discards a small amount of detail. In practice, at the balanced quality setting and the original resolution, the difference is very hard to spot. Keep the original MOV if you plan to edit heavily later.",
      },
      {
        question: "Why does my iPhone video not play on a Windows PC or website?",
        answer:
          "iPhones often record MOV files with HEVC video, which many Windows players, older browsers and upload forms do not support. MP4 with H.264 is the widely supported combination, which is exactly what this conversion produces.",
      },
      {
        question: "Will the MP4 be smaller than the MOV?",
        answer:
          "Usually yes, often noticeably. iPhone recordings at high quality or in HDR can be several times larger than the same clip re-encoded as a balanced MP4. The exact saving depends on the source quality, length and resolution.",
      },
      {
        question: "Does the converted MP4 keep the original audio?",
        answer:
          "Yes. The audio track is carried over into the MP4. If the source has an unusual audio codec, the tool falls back to a compatible encoding so the result still plays everywhere.",
      },
      {
        question: "Can I convert MOV to MP4 without uploading my video?",
        answer:
          "Yes, with this tool. The conversion runs entirely in your browser, so the video never leaves your device. That matters for private clips, client footage and anything you would not want on a server.",
      },
    ],
  },
  "mkv-to-mp4": {
    from: "mkv",
    to: "mp4",
    intro:
      "MKV is a flexible, open container that can hold high quality video, several audio tracks, subtitles and chapters in a single file. That flexibility is also its weakness: many smart TVs, phones, browsers and upload forms cannot play MKV at all. Converting MKV to MP4 puts the same video into the container that practically every player and platform accepts.",
    consequence:
      "Headline consequence: the video becomes playable on TVs, phones and browsers that refuse MKV. One trade-off to know before you convert: MP4 does not carry every MKV extra, so secondary audio tracks and some subtitle tracks may not survive the move.",
    qualitySize:
      "This tool transcodes the MKV to MP4 at a balanced quality with the original resolution kept. The file size usually ends up similar to, or a little smaller than, the source, because the video itself is what dominates the size, not the container. If the MKV holds several audio tracks or subtitles, dropping the extras you do not need can shrink the result further.",
    whenTo: [
      "Playing a downloaded or ripped MKV on a smart TV, phone or tablet",
      "Uploading a clip to a platform that only accepts MP4",
      "Sharing a video with someone who does not have VLC installed",
      "Preparing an MKV for editing in an editor that prefers MP4",
    ],
    whenNotTo: [
      "Archiving a film with multiple audio tracks and subtitle tracks you want to keep",
      "When the file already plays fine in VLC and never leaves your computer",
      "When you only need a short section: cut the MKV first, then convert the clip",
    ],
    settingTip:
      "Check the converted MP4 before deleting the MKV: confirm the right audio track and any subtitles you need are present. Keep the MKV as your archive copy if it holds tracks you might want later.",
    faqs: [
      {
        question: "Why will my MKV not play on my TV or phone?",
        answer:
          "Many smart TVs, mobile browsers and built-in players do not support the MKV container, even when they could decode the video inside it. MP4 is the container those players expect, so converting usually fixes playback without changing the video itself.",
      },
      {
        question: "Does converting MKV to MP4 lose quality?",
        answer:
          "This tool transcodes to MP4, so a small amount of detail can be lost, as with any re-encode. At the balanced quality setting and original resolution the loss is hard to notice. If the MKV uses H.264 video already, a desktop remuxing tool could copy the stream without re-encoding, but this browser tool transcodes for reliable playback.",
      },
      {
        question: "Will subtitles and extra audio tracks survive the conversion?",
        answer:
          "Not necessarily. MP4 supports fewer subtitle formats and track combinations than MKV, so secondary audio tracks and some subtitle tracks may be dropped. Check the output before deleting the original, and keep the MKV if those tracks matter.",
      },
      {
        question: "Is the MP4 smaller than the MKV?",
        answer:
          "Usually about the same, or a little smaller. The container change alone saves almost nothing; most of the size is the video stream. Dropping unneeded audio or subtitle tracks is what actually shrinks the file.",
      },
      {
        question: "Can I convert MKV to MP4 in my browser without uploading?",
        answer:
          "Yes. This tool converts locally in your browser using FFmpeg compiled to WebAssembly, so the file never uploads to a server. Very large MKV files may take a while and need enough free browser memory.",
      },
    ],
  },
  "webm-to-mp4": {
    from: "webm",
    to: "mp4",
    intro:
      "WebM is the web-native video format: small files, good quality, and royalty-free codecs built for browsers. The catch is everything outside the browser. Many social platforms, editors, phones and older devices reject WebM outright, and Safari support has historically lagged. Converting WebM to MP4 trades the web-optimized container for the one every app and device accepts.",
    consequence:
      "Headline consequence: a WebM clip that only plays in a browser becomes an MP4 that uploads, edits and plays anywhere. The one thing MP4 cannot carry over is WebM transparency: a VP9 clip with an alpha channel will get a solid background in MP4.",
    qualitySize:
      "This tool re-encodes the WebM to MP4 at a balanced quality with the original resolution kept. The MP4 is often a little larger than the WebM at the same visual quality, because H.264 is less efficient than VP9, but the difference is usually modest. Re-encoding a lossy source discards a small amount of extra detail, so keep the WebM if you plan to edit further.",
    whenTo: [
      "Uploading a screen recording or web clip to Instagram, TikTok or a form that rejects WebM",
      "Editing a WebM download in an editor that only imports MP4",
      "Sharing a clip with someone on an iPhone or older device",
      "Playing a WebM file on a smart TV or in a desktop player",
    ],
    whenNotTo: [
      "Embedding video on your own website, where WebM is smaller and plays in all modern browsers",
      "When you need the transparent background of a VP9 WebM overlay",
      "When the clip already plays fine and never leaves the browser",
    ],
    settingTip:
      "Keep the original resolution and balanced quality. If the WebM came from a screen recorder, check the output for readable text: small text is the first thing re-encoding softens, so avoid lowering quality or resolution for text-heavy clips.",
    faqs: [
      {
        question: "Why convert WebM to MP4?",
        answer:
          "MP4 is accepted by more apps, social platforms, editors and older devices than WebM. If a site, app or person cannot open your WebM file, MP4 is the fix that almost always works.",
      },
      {
        question: "Will transparency be preserved when converting WebM to MP4?",
        answer:
          "No. Standard MP4 playback does not support an alpha channel, so a transparent WebM becomes an MP4 with a solid background. Keep the WebM if transparency is required, for example for a web overlay.",
      },
      {
        question: "Does converting WebM to MP4 reduce quality?",
        answer:
          "Slightly, as with any re-encode between lossy formats. At balanced quality and original resolution the difference is hard to see for most clips. Text-heavy screen recordings show softening first, so avoid extra quality or resolution cuts for those.",
      },
      {
        question: "Will the MP4 be larger than the WebM?",
        answer:
          "Often a little larger. VP9 WebM compresses more efficiently than H.264 MP4, so the same visual quality needs slightly more bytes as MP4. The gap is usually small, and compatibility is what you gain in return.",
      },
      {
        question: "Does Safari support WebM, or do I need MP4?",
        answer:
          "Modern Safari support for WebM has improved, but MP4 remains the safest format for broad compatibility, especially for older Safari versions, iOS apps and social uploads.",
      },
    ],
  },
  "mp4-to-mp3": {
    from: "mp4",
    to: "mp3",
    intro:
      "Most of the time, what you actually want from a video is the sound: a lecture to listen to on a commute, an interview to quote, music from a clip, or a voice note to keep. Converting MP4 to MP3 strips the picture away and leaves a small audio file that plays on every device, uses far less storage, and is easy to share or transcribe.",
    consequence:
      "Headline consequence: a video file becomes an audio-only file, typically 10 to 20 times smaller. The video track is discarded entirely, so only convert when you are sure you will not need the picture later.",
    qualitySize:
      "You choose the MP3 bitrate from 96 kbps up to 320 kbps. At 320 kbps the audio is close to the original for most ears; at 128 kbps a one-hour video becomes roughly 55 MB of audio. The output can never sound better than the audio inside the original video, and re-encoding an already compressed soundtrack discards a little more detail, so pick a higher bitrate for music and a lower one for speech.",
    whenTo: [
      "Saving a lecture, podcast or interview as audio for listening on the go",
      "Extracting music or a voice track from a video for editing",
      "Shrinking a long video down to something small enough to email or message",
      "Building an audio library from video content you own",
    ],
    whenNotTo: [
      "When you still need the picture: keep the MP4 and extract a copy instead of replacing it",
      "For professional audio mastering, where the original audio track is better than a re-encoded MP3",
      "For videos whose value is visual, such as tutorials with on-screen steps",
    ],
    settingTip:
      "Use 320 kbps for music, 192 kbps for general listening, and 128 kbps for speech-only content such as lectures. Lower bitrates shrink the file further but make music sound thin and cymbals splashy.",
    faqs: [
      {
        question: "What if the video has no audio?",
        answer:
          "The tool will show a friendly processing error. Choose a video that contains an audio track; a silent video has nothing to extract.",
      },
      {
        question: "Does this preserve the video?",
        answer:
          "No. The output is an MP3 audio file only, and the video track is discarded. Keep your original MP4 file if you might need the picture later.",
      },
      {
        question: "What bitrate should I choose for MP4 to MP3?",
        answer:
          "320 kbps for music you care about, 192 kbps for everyday listening, and 128 kbps or lower for speech-only recordings like lectures. Higher bitrates mean larger files but better sound.",
      },
      {
        question: "Can I convert MP4 to MP3 without uploading my video?",
        answer:
          "Yes. This tool extracts the audio locally in your browser, so the video never leaves your device. That is useful for private recordings, interviews and client footage.",
      },
      {
        question: "Will the MP3 sound as good as the original video?",
        answer:
          "Very close at 320 kbps, but never better. MP3 is lossy, and the audio inside most MP4 files is already compressed, so extraction re-encodes it once more. For casual listening the difference is negligible.",
      },
    ],
  },
  "video-to-gif": {
    from: "mp4",
    to: "gif",
    intro:
      "GIFs work where video does not: they autoplay and loop inside chats, comments, docs, emails and social posts with no play button and no player. Converting a short video clip to GIF turns a reaction, a product demo or a highlight into a shareable animation. The format is old and limited, so the trick is keeping the clip short, small and low in frame rate, or the file becomes enormous.",
    consequence:
      "Headline consequence: a video clip becomes a looping silent animation that plays everywhere images do. The price is steep: colour drops to 256 colours, sound disappears completely, and file size grows fast with length and width.",
    qualitySize:
      "GIF has no video compression worth the name, so a few seconds at modest width is the sweet spot. This tool defaults to a short clip with sensible width and frame rate, and warns about large outputs. Cutting the frame rate from 30 to 10 fps, or the width from 640 to 480 pixels, can shrink a GIF dramatically with little visible loss for a reaction clip. Photographic gradients and smooth motion look banded and choppy in GIF no matter what you do.",
    whenTo: [
      "Sharing a reaction or short highlight in Slack, Discord, Reddit or a chat",
      "Embedding a tiny product demo in a doc, email or README",
      "Making a meme or looping animation from a 2 to 5 second clip",
      "Previewing motion where a video player is unavailable",
    ],
    whenNotTo: [
      "For clips longer than about 10 seconds: use MP4 video instead",
      "For anything where sound matters: GIF has no audio track",
      "For photographic or gradient-heavy footage, which GIF renders with visible banding",
      "For full-quality sharing: MP4 is smaller and looks far better",
    ],
    settingTip:
      "Keep clips under 5 seconds, width around 480 pixels, and frame rate at 10 to 15 fps. If the GIF is still too large, shorten the clip first: length is the biggest lever on file size.",
    faqs: [
      {
        question: "Why are GIF files so large?",
        answer:
          "GIF is an older animation format with no modern video compression: every frame is stored as an image. Short clips, smaller width and lower frame rates keep output sizes manageable, which is why this tool defaults to a short range.",
      },
      {
        question: "What duration should I use for a video to GIF conversion?",
        answer:
          "A few seconds is best, both for browser memory and download size. Reactions and highlights usually land in 2 to 5 seconds; beyond 10 seconds an MP4 video is almost always the better choice.",
      },
      {
        question: "Does a GIF keep the video's sound?",
        answer:
          "No. GIF has no audio track, so sound is discarded. If the audio matters, convert to MP4 instead, or extract the audio as MP3.",
      },
      {
        question: "Why does my GIF look worse than the video?",
        answer:
          "GIF is limited to 256 colours, so photos, gradients and smooth motion get banded and posterized. Flat graphics, cartoons and high-contrast clips survive the conversion best.",
      },
      {
        question: "Will the GIF loop automatically?",
        answer:
          "Yes, in most chats, browsers and social apps, GIFs loop on their own with no play button. Some platforms convert uploads to video behind the scenes, which can change looping behaviour.",
      },
    ],
  },
  "gif-to-mp4": {
    from: "gif",
    to: "mp4",
    intro:
      "GIFs are convenient but wasteful: an animation that plays fine in a chat can be tens of megabytes, and many platforms quietly convert GIF uploads to video anyway. Converting GIF to MP4 keeps the same animation in a modern video codec that is usually far smaller, smoother and easier to share, especially on Instagram, TikTok and in presentations.",
    consequence:
      "Headline consequence: the same looping animation becomes an MP4 that is often 5 to 10 times smaller and plays more smoothly. The animation itself does not gain quality: MP4 cannot restore colours the GIF already flattened to 256.",
    qualitySize:
      "Expect a large size saving, because H.264 compresses repeated frames far better than GIF's frame-by-frame storage. A 10 MB GIF often becomes a 1 to 2 MB MP4. Visual quality stays roughly the same as the GIF, including its 256-colour banding, since conversion cannot invent colours that were lost when the GIF was made.",
    whenTo: [
      "Uploading an animation to Instagram, TikTok or a platform that prefers video",
      "Embedding an animation in a presentation or website without a huge file",
      "Sharing a long animation that is too large as a GIF",
      "Reducing storage for a collection of saved GIFs",
    ],
    whenNotTo: [
      "When you need the animation to autoplay and loop inside a chat or comment that only accepts images",
      "When transparency matters: MP4 has no alpha channel in standard playback",
      "When the GIF is already tiny: conversion gains little",
    ],
    settingTip:
      "Keep the original resolution and balanced quality; upscaling a small GIF only enlarges the file. Note that looping depends on the player or platform where you use the MP4, not on the file itself.",
    faqs: [
      {
        question: "Why convert GIF to MP4?",
        answer:
          "MP4 is often much smaller than GIF and plays smoothly in modern browsers and apps. Platforms like Instagram and TikTok prefer video uploads, so MP4 is the practical format for sharing animations there.",
      },
      {
        question: "Will the MP4 loop?",
        answer:
          "The exported MP4 contains the animation frames once. Looping depends on the player or platform where you use it: most social apps loop short videos, but a plain video player may stop at the end.",
      },
      {
        question: "Will converting GIF to MP4 improve quality?",
        answer:
          "No. The GIF already reduced the animation to 256 colours, and MP4 cannot restore colours or detail that were lost. The gain is file size and smooth playback, not picture quality.",
      },
      {
        question: "How much smaller is MP4 than GIF?",
        answer:
          "Often 5 to 10 times smaller for the same animation, because video codecs reuse unchanged pixels between frames while GIF stores each frame separately. Long or detailed animations save the most.",
      },
      {
        question: "Does the MP4 keep GIF transparency?",
        answer:
          "No. Standard MP4 playback has no alpha channel, so transparent GIF pixels become a solid background. Keep the GIF if transparency is required.",
      },
    ],
  },
  "video-to-webm": {
    from: "mp4",
    to: "webm",
    intro:
      "If a video lives on a website, WebM is usually the smarter format: VP9 and AV1 compress better than H.264, the codecs are royalty-free, and every modern browser plays WebM natively. Converting MP4 to WebM is the move when page weight and loading speed matter more than universal device compatibility.",
    consequence:
      "Headline consequence: the same clip becomes smaller and faster to load on the web, at the cost of compatibility outside the browser. Social uploads, editors and older devices often reject WebM, so keep an MP4 copy for those.",
    qualitySize:
      "Expect a smaller file than the MP4 at similar visual quality, since VP9 is more efficient than H.264, though the exact saving depends on the content. Encoding takes longer in a browser than an MP4 transcode, and re-encoding a lossy source discards a little more detail, so this conversion is best done once from the best-quality source you have.",
    whenTo: [
      "Embedding video on a website or web app where load speed matters",
      "Serving a hero or background video to modern browsers",
      "Reducing bandwidth for a video-heavy page",
      "Publishing to a platform that accepts WebM and rewards small files",
    ],
    whenNotTo: [
      "Uploading to Instagram, TikTok or editors that expect MP4",
      "Sharing with people on iPhones, older devices or desktop players",
      "When you need the clip to play absolutely everywhere: MP4 is still the safe default",
    ],
    settingTip:
      "Pick the quality and frame rate the page actually needs: a background loop rarely needs 60 fps or full HD. Lower frame rates and modest resolutions shrink WebM files further with little visible cost on a web page.",
    faqs: [
      {
        question: "When should I use WebM?",
        answer:
          "Use WebM for modern web playback, especially when you control the website or app that will display the video. Smaller files mean faster page loads and less bandwidth.",
      },
      {
        question: "Does Safari support WebM?",
        answer:
          "Modern Safari support has improved, but MP4 remains the safest format for broad compatibility. For public web pages, serve WebM with an MP4 fallback so every browser gets a playable file.",
      },
      {
        question: "Is WebM smaller than MP4?",
        answer:
          "Usually yes at the same visual quality, because VP9 compresses more efficiently than H.264. The saving varies with content: animation and screen recordings compress especially well.",
      },
      {
        question: "Does converting MP4 to WebM lose quality?",
        answer:
          "Slightly, as with any re-encode between lossy formats. Starting from the highest-quality MP4 you have, and keeping the original resolution, keeps the loss hard to notice.",
      },
      {
        question: "Why does WebM encoding take longer?",
        answer:
          "VP9 and AV1 are more computationally demanding than H.264, and this tool runs the encoder in your browser via WebAssembly. Longer or higher-resolution clips take proportionally longer; lower the resolution or frame rate if you are in a hurry.",
      },
    ],
  },
};

export function getVideoPairContent(slug: string): VideoPairContent | undefined {
  return VIDEO_PAIR_CONTENT[slug];
}
