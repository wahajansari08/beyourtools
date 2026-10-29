/**
 * Rich per-format profiles + pair content for audio converter pair pages
 * (e.g. /mp3-to-wav, /wav-to-mp3, /m4a-to-mp3). Each pair page composes its
 * intro, comparison table, when / when-not guidance, quality and size notes
 * and FAQs from the two formats' factual profiles plus pair-specific notes,
 * so each pair page carries substantively unique, accurate content instead
 * of the shared name-swap guide text.
 */

export interface AudioFormatProfile {
  fullName: string;
  kind: string;
  codecNote: string;
  qualityNote: string;
  support: string;
  strengths: string[];
  weaknesses: string[];
  sizeNote: string;
}

export const AUDIO_FORMAT_PROFILES: Record<string, AudioFormatProfile> = {
  mp3: {
    fullName: "MPEG Audio Layer III",
    kind: "Lossy compressed audio",
    codecNote: "MP3, typically 128 to 320 kbps",
    qualityNote: "Very good at 192 to 320 kbps; some detail discarded permanently",
    support: "Everywhere: every player, phone, car stereo and editor",
    strengths: [
      "Plays on literally every device and platform",
      "Small files that are easy to share, stream and store",
      "Bitrate choice trades size against quality",
    ],
    weaknesses: [
      "Lossy: detail discarded in encoding cannot be recovered",
      "Repeated re-encoding degrades quality further",
    ],
    sizeNote: "Roughly 1 MB per minute at 128 kbps, 2.4 MB at 320 kbps",
  },
  wav: {
    fullName: "Waveform Audio File Format",
    kind: "Uncompressed PCM audio",
    codecNote: "Linear PCM, usually 16-bit or 24-bit",
    qualityNote: "Exact: every sample preserved, no compression artefacts",
    support: "Every editor, DAW and Windows tool; most players, but large for sharing",
    strengths: [
      "Perfect quality, the standard for recording and editing",
      "No encoding artefacts, so edits and effects stay clean",
      "Required by many DAWs, samplers and legacy systems",
    ],
    weaknesses: [
      "Very large: about 10 MB per minute for CD-quality stereo",
      "Awkward for streaming, messaging and portable players",
    ],
    sizeNote: "About 10 MB per minute at 44.1 kHz 16-bit stereo",
  },
  flac: {
    fullName: "Free Lossless Audio Codec",
    kind: "Lossless compressed audio",
    codecNote: "FLAC, variable bitrate around 700 to 1,000 kbps for CD audio",
    qualityNote: "Bit-perfect: decodes to exactly the original PCM audio",
    support: "Most players, Android and Windows; iPhone since iOS 11, weaker on older car stereos",
    strengths: [
      "Perfect quality at roughly half the size of WAV",
      "The standard archival format for CD rips",
      "Good metadata support for album, artist and track info",
    ],
    weaknesses: [
      "Still 5 to 10 times larger than a high-bitrate MP3",
      "Not accepted by some older players and car stereos",
    ],
    sizeNote: "Roughly 5 MB per minute for CD-quality stereo, versus 10 MB for WAV",
  },
  ogg: {
    fullName: "Ogg Vorbis",
    kind: "Lossy compressed audio in an Ogg container",
    codecNote: "Vorbis, typically 96 to 192 kbps",
    qualityNote: "Very good at 160 to 192 kbps, often slightly better than MP3 at the same bitrate",
    support: "Strong on Android, Linux and browsers; weak on Apple devices and older car stereos",
    strengths: [
      "Open and royalty-free, with good quality per megabyte",
      "Common for game audio, Discord clips and Linux exports",
      "Efficient for speech and music at modest bitrates",
    ],
    weaknesses: [
      "Not played by many Apple devices, older stereos and some editors",
      "The .ogg extension is also used for Opus audio, which is a different codec",
    ],
    sizeNote: "Similar to MP3: roughly 1 MB per minute at 128 kbps",
  },
  m4a: {
    fullName: "MPEG-4 Audio",
    kind: "Usually lossy AAC audio in an MP4 container",
    codecNote: "AAC, typically 128 to 256 kbps",
    qualityNote: "Slightly better than MP3 at the same bitrate, still lossy",
    support: "All Apple devices and most modern players; weaker on older hardware",
    strengths: [
      "The native format of iPhone recordings, iTunes and Apple Music",
      "Better quality per megabyte than MP3",
      "Good metadata and chapter support",
    ],
    weaknesses: [
      "Not accepted by some older players, car stereos and editors",
      "DRM-protected M4A files from old iTunes purchases cannot be converted",
    ],
    sizeNote: "Similar to MP3: roughly 1 MB per minute at 128 kbps",
  },
};

export interface AudioPairFaq {
  question: string;
  answer: string;
}

export interface AudioPairContent {
  from: string;
  to: string;
  intro: string;
  consequence: string;
  qualitySize: string;
  whenTo: string[];
  whenNotTo: string[];
  settingTip: string;
  faqs: AudioPairFaq[];
}

export const AUDIO_PAIR_CONTENT: Record<string, AudioPairContent> = {
  "mp3-to-wav": {
    from: "mp3",
    to: "wav",
    intro:
      "MP3 to WAV is a compatibility conversion, not a quality upgrade, and knowing that distinction saves disappointment. Some audio editors, DAWs, samplers and legacy systems only accept uncompressed PCM WAV, and they refuse MP3 files outright. Converting wraps the same audio in a WAV container so those tools can open it, edit it and process it without re-encoding artefacts piling up.",
    consequence:
      "Headline consequence: the audio becomes editable everywhere, but the file becomes roughly 10 times larger while sounding exactly the same. Nothing lost in the original MP3 compression comes back, because the detail was discarded when the MP3 was made.",
    qualitySize:
      "The tool decodes the MP3 and writes uncompressed 16-bit PCM WAV, preserving the original sample rate and channels. Expect a 5 MB MP3 to become roughly 40 to 80 MB of WAV depending on duration, sample rate and channels. The WAV sounds identical to the MP3: larger, not better. The real benefit comes later, when you edit the WAV and export again without stacking a second lossy encode on top of the first.",
    whenTo: [
      "Importing audio into a DAW, sampler or editor that requires PCM WAV",
      "Preparing a file for further editing, effects or mastering",
      "Feeding audio to a legacy system or hardware that rejects MP3",
      "Normalizing or processing audio you plan to export again later",
    ],
    whenNotTo: [
      "Trying to improve sound quality: conversion cannot recover lost detail",
      "Sharing or streaming, where MP3 is smaller and universally playable",
      "Storing a music library, where WAV wastes roughly 10 times the space",
    ],
    settingTip:
      "Convert to WAV once, do all your editing on the WAV, and export to MP3 only at the very end. That single final encode keeps quality as high as the source allows.",
    faqs: [
      {
        question: "Why convert MP3 to WAV?",
        answer:
          "Some audio editing applications, DAWs and legacy systems require uncompressed PCM WAV files. WAV is also better for further editing, because editing a WAV and exporting once avoids stacking another lossy encode on top of the MP3 compression.",
      },
      {
        question: "Will the WAV file sound better than the MP3?",
        answer:
          "No. Converting MP3 to WAV does not recover quality lost during MP3 compression. The WAV will be larger but the audio quality is the same as the source MP3.",
      },
      {
        question: "How large will the WAV file be?",
        answer:
          "WAV files are much larger than MP3. A 5 MB MP3 typically becomes 40 to 80 MB WAV depending on duration, sample rate and channels. CD-quality stereo WAV runs about 10 MB per minute.",
      },
      {
        question: "Does MP3 to WAV conversion lose any quality?",
        answer:
          "No further quality is lost beyond what the MP3 already lost. Decoding MP3 to PCM WAV is exact for the audio that remains, so the WAV is a faithful, if larger, copy of the MP3 sound.",
      },
      {
        question: "Should I keep the MP3 after converting to WAV?",
        answer:
          "Yes, keep it as your compact backup. The WAV is your working copy for editing; the MP3 is far easier to store, share and play on the go.",
      },
    ],
  },
  "wav-to-mp3": {
    from: "wav",
    to: "mp3",
    intro:
      "WAV files sound perfect and take up an unreasonable amount of space: a single album can be hundreds of megabytes, and a long recording can exceed messaging and upload limits. Converting WAV to MP3 trades a small, usually inaudible amount of quality for a file 5 to 15 times smaller that plays on every device and uploads anywhere.",
    consequence:
      "Headline consequence: a huge studio-quality file becomes a small portable one. The trade is permanent: MP3 discards audio detail to achieve that size, so keep the WAV as your master and treat the MP3 as the sharing copy.",
    qualitySize:
      "This tool offers bitrate choices from 64 to 320 kbps. A 50 MB WAV typically compresses to 3 to 8 MB at 128 to 192 kbps. At 192 kbps most listeners cannot tell the MP3 from the WAV in a blind test, and 320 kbps is effectively transparent for casual listening. Lower bitrates suit speech; music deserves 192 kbps or higher. Converting back to WAV later will not restore what MP3 removed.",
    whenTo: [
      "Sharing a recording by email, message or upload form with a size limit",
      "Building a portable music library for a phone or car stereo",
      "Publishing a podcast episode or voice recording for streaming",
      "Archiving a listening copy while the WAV master stays safe elsewhere",
    ],
    whenNotTo: [
      "When the file is still being edited or mastered: keep working in WAV",
      "For professional delivery to a client, label or broadcaster",
      "When storage is not a problem and maximum quality is the priority",
    ],
    settingTip:
      "Use 320 kbps for music you care about, 192 kbps for general listening, and 128 kbps for speech-only recordings. If the WAV is a master, never replace it with the MP3: keep both.",
    faqs: [
      {
        question: "How much smaller will the MP3 be?",
        answer:
          "Typically 5 to 15 times smaller than the original WAV. A 50 MB WAV file may compress to 3 to 8 MB MP3 at 128 to 192 kbps, depending on duration and content.",
      },
      {
        question: "Does converting WAV to MP3 lose quality?",
        answer:
          "Yes. MP3 is a lossy format. Higher bitrates (192 to 320 kbps) preserve more quality but produce larger files. 192 kbps is transparent for most listeners, and 320 kbps is effectively transparent for casual listening.",
      },
      {
        question: "Can I convert stereo WAV to mono MP3?",
        answer:
          "The tool preserves the original channel layout by default. Mono and stereo conversion is not currently available in this tool.",
      },
      {
        question: "What bitrate should I choose for WAV to MP3?",
        answer:
          "320 kbps for music you want to keep at near-original quality, 192 kbps for everyday listening, and 128 kbps for speech-only recordings like interviews or lectures.",
      },
      {
        question: "Can I get the WAV quality back by converting MP3 to WAV?",
        answer:
          "No. Converting MP3 back to WAV just produces a large file with MP3-quality audio. The detail MP3 discarded is gone permanently, which is why you should keep the original WAV as your master.",
      },
    ],
  },
  "m4a-to-mp3": {
    from: "m4a",
    to: "mp3",
    intro:
      "M4A is Apple's home turf: iPhone voice memos, iTunes purchases and Apple Music downloads all arrive as M4A, and most of the time that is fine. Problems start with older car stereos, some Android apps, editors and upload forms that expect MP3 and refuse M4A. Converting M4A to MP3 trades a small amount of quality for the one audio format that plays absolutely everywhere.",
    consequence:
      "Headline consequence: an Apple-only audio file becomes a universal one. The cost is a second lossy encode: M4A is already compressed with AAC, and re-encoding to MP3 discards a little more detail, so a high bitrate matters here more than usual.",
    qualitySize:
      "Use the highest bitrate available, 320 kbps, to keep the extra loss minimal. The MP3 ends up roughly the same size as the M4A at a comparable bitrate, since both are lossy formats of similar efficiency. For speech the difference between 192 and 320 kbps is hard to hear; for music, 320 kbps is the safe choice when converting from one lossy format to another.",
    whenTo: [
      "Playing iPhone voice memos or Apple Music files on a non-Apple device",
      "Uploading audio to a platform or form that only accepts MP3",
      "Editing in a tool that imports MP3 but not M4A",
      "Sharing an Apple recording with someone on Windows or Android",
    ],
    whenNotTo: [
      "When the file already plays everywhere you need it: M4A is slightly more efficient than MP3",
      "For professional audio work, where keeping the original AAC or a WAV is better",
      "For DRM-protected M4A files from old iTunes purchases, which cannot be converted",
    ],
    settingTip:
      "Always pick 320 kbps for M4A to MP3. This is a lossy-to-lossy conversion, so the highest bitrate is the only way to keep the added quality loss negligible.",
    faqs: [
      {
        question: "What is M4A?",
        answer:
          "M4A is an audio-only MP4 container file using AAC audio encoding. It is commonly used by Apple devices, iTunes and Apple Music, and it offers slightly better quality per megabyte than MP3.",
      },
      {
        question: "Will converting M4A to MP3 reduce quality?",
        answer:
          "Since both M4A and MP3 are lossy formats, re-encoding introduces some additional quality loss. Use the highest bitrate available (320 kbps) to minimise this. For most listening the difference is very small.",
      },
      {
        question: "Can I convert Apple DRM-protected M4A files?",
        answer:
          "No. DRM-protected files (purchased from older iTunes versions) cannot be processed by this tool. Only DRM-free M4A files are supported.",
      },
      {
        question: "Will the MP3 be larger or smaller than the M4A?",
        answer:
          "Roughly the same at a comparable bitrate. AAC and MP3 are similarly efficient, so the file size is decided by the bitrate you choose, not by the format change itself.",
      },
      {
        question: "Does the MP3 keep the M4A metadata and tags?",
        answer:
          "Metadata is preserved where possible, but some Apple-specific tags and chapters may not carry over to MP3. Check the output file's tags if artwork or chapter marks matter to you.",
      },
    ],
  },
  "flac-to-mp3": {
    from: "flac",
    to: "mp3",
    intro:
      "FLAC is the format you keep when quality matters: a CD rip stored as FLAC sounds exactly like the original disc, at roughly half the size of WAV. MP3 is the format you use when compatibility and size matter more. Converting FLAC to MP3 is the standard way to take a carefully archived library onto a phone, a car stereo or a streaming upload form that will not accept FLAC.",
    consequence:
      "Headline consequence: a bit-perfect archive file becomes a small universal file, and that trade is permanent. MP3 discards audio detail to reach its size, so keep the FLAC as your master and treat the MP3 as the portable copy.",
    qualitySize:
      "Use 320 kbps for music. A 30 MB FLAC track typically becomes about 7 MB at 320 kbps, 4 to 5 MB at 192 kbps and 3 MB at 128 kbps. At 320 kbps most listeners cannot tell the MP3 from the FLAC in casual listening, but the difference is real and measurable, which is why archiving in MP3 alone is a mistake. For speech-only FLAC recordings, 128 kbps is plenty and shrinks the file even further.",
    whenTo: [
      "Playing a FLAC library on a phone, car stereo or player that does not support FLAC",
      "Uploading audio to a platform or form that only accepts MP3",
      "Sharing tracks by email or message where FLAC is too large",
      "Building a portable listening library while the FLAC archive stays safe",
    ],
    whenNotTo: [
      "When the file is your only copy: keep the FLAC, do not replace it with the MP3",
      "For professional delivery, mastering or further editing",
      "When storage is not a problem and the player already supports FLAC",
    ],
    settingTip:
      "Convert from FLAC at 320 kbps, never from an existing MP3. Starting from FLAC gives the encoder the full-quality source, so the MP3 is as good as MP3 can be.",
    faqs: [
      {
        question: "How much smaller is MP3 than FLAC?",
        answer:
          "Typically 3 to 10 times smaller depending on bitrate. A 30 MB FLAC track becomes roughly 7 MB at 320 kbps, 4 to 5 MB at 192 kbps and about 3 MB at 128 kbps.",
      },
      {
        question: "Can I convert MP3 back to FLAC to restore quality?",
        answer:
          "You can change the container, but you cannot restore quality. Converting MP3 to FLAC produces a large lossless file that still contains only MP3-quality audio, because the detail MP3 discarded is gone permanently.",
      },
      {
        question: "What bitrate should I choose for FLAC to MP3?",
        answer:
          "320 kbps for music you care about, 192 kbps for everyday listening and 128 kbps for speech-only recordings. Since FLAC is a perfect source, a high bitrate is the best way to keep the MP3 close to the original.",
      },
      {
        question: "Does FLAC to MP3 conversion keep the tags and artwork?",
        answer:
          "Metadata is preserved where possible, including artist, title and album tags. Check the output file if artwork or unusual tags matter to you, since some players read FLAC and MP3 tags differently.",
      },
      {
        question: "Should I delete the FLAC file after converting?",
        answer:
          "No. Keep the FLAC as your archive master. Storage is cheap, re-ripping a CD is not, and you can always make a new MP3 from FLAC later, but you can never rebuild FLAC quality from an MP3.",
      },
    ],
  },
  "ogg-to-mp3": {
    from: "ogg",
    to: "mp3",
    intro:
      "OGG Vorbis is a capable open format, but it lives outside the mainstream: many Apple devices, older car stereos and some editors simply will not play it. Converting OGG to MP3 solves that in one step, because MP3 plays on virtually every device made in the last twenty years. The price is a second lossy encode, so the bitrate you pick matters more here than in a lossless-to-MP3 conversion.",
    consequence:
      "Headline consequence: an open-format file that some devices refuse becomes a universal file every device plays. The cost is a small extra quality loss on top of the lossy Vorbis encoding, which is why 192 kbps or higher is the sensible floor for music.",
    qualitySize:
      "The MP3 ends up roughly the same size as the OGG at a comparable bitrate, since both are lossy formats of similar efficiency. A 5 MB OGG at around 160 kbps becomes roughly 4 to 7 MB as MP3 depending on the bitrate you choose. Note the .ogg extension trap: some .ogg files actually contain Opus audio, common in Discord voice clips and game audio, and Opus to MP3 is the same lossy-to-lossy story with the same bitrate advice.",
    whenTo: [
      "Playing OGG files from Linux, a game soundtrack or Discord clips on an iPhone or car stereo",
      "Uploading audio to a platform or form that only accepts MP3",
      "Sharing a recording with someone whose player does not support OGG",
      "Editing in a tool that imports MP3 but not OGG Vorbis",
    ],
    whenNotTo: [
      "When the file already plays everywhere you need it: Vorbis is slightly more efficient than MP3",
      "For further editing or mastering, where a lossless export would be better",
      "At low bitrates for music: a 64 or 96 kbps MP3 made from OGG will sound noticeably worse",
    ],
    settingTip:
      "Use 192 kbps for everyday listening and 320 kbps for music you care about. This is a lossy-to-lossy conversion, so a low bitrate stacks a second audible loss on top of the first.",
    faqs: [
      {
        question: "What is the difference between OGG Vorbis and Opus?",
        answer:
          "Both can use the .ogg container, but they are different codecs. Vorbis is the classic Ogg music codec, while Opus is a newer codec common in Discord voice clips, game chat and WebRTC calls. Both are lossy, so converting either to MP3 follows the same rule: use a high bitrate to keep the extra loss small.",
      },
      {
        question: "Will converting OGG to MP3 improve quality?",
        answer:
          "No. Both formats are lossy, and re-encoding discards a little more detail. The MP3 will sound the same at best, and slightly worse at low bitrates. The gain is compatibility, not quality.",
      },
      {
        question: "What bitrate should I choose for OGG to MP3?",
        answer:
          "192 kbps for everyday listening, 320 kbps for music, and 128 kbps for speech-only recordings such as voice clips. Avoid going below the bitrate of the original OGG for music.",
      },
      {
        question: "Why does my iPhone or car stereo not play OGG files?",
        answer:
          "Apple devices and many older car stereos never added OGG Vorbis support, while MP3 support is universal. Converting to MP3 is the simplest fix, and it avoids installing a separate player app.",
      },
      {
        question: "Will the MP3 be larger or smaller than the OGG?",
        answer:
          "Roughly the same at a comparable bitrate. Vorbis and MP3 are similarly efficient, so the file size is decided by the bitrate you choose, not by the format change itself.",
      },
    ],
  },
};

export function getAudioPairContent(slug: string): AudioPairContent | undefined {
  return AUDIO_PAIR_CONTENT[slug];
}
