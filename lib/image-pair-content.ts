/**
 * Rich per-format profiles + pair-content generator for image converter
 * pair pages (e.g. /image-converter/png-to-jpg).
 *
 * Every pair page composes its intro, comparison table, when / when-not
 * guidance, quality & size notes and FAQs from the two formats' factual
 * profiles, so each of the 118 pair pages carries substantively unique,
 * accurate content instead of template filler.
 */
import {
  getFormat,
  getFormatNotes,
  type ConversionRoute,
  type ImageFormat,
} from "./image-tools-config";

export type CompressionClass =
  | "lossy"
  | "lossless"
  | "both"
  | "uncompressed"
  | "vector"
  | "container"
  | "document";

export interface FormatProfile {
  /** Full official name, e.g. "Joint Photographic Experts Group" */
  fullName: string;
  compressionClass: CompressionClass;
  /** e.g. "24-bit colour (16.7 million colours)" */
  colorDepth: string;
  /** e.g. "Full alpha channel" */
  transparencyNote: string;
  animationNote: string;
  /**
   * Relative file size for the same photographic image, 1 (smallest) to 6
   * (largest). -1 = not comparable (vector / icon / document wrapper).
   */
  sizeRank: number;
  /** Typical-size phrase used in the comparison table */
  sizeNote: string;
  /** Where the format can actually be opened / displayed */
  support: string;
  strengths: string[];
  weaknesses: string[];
  /** One-line quality character, e.g. "already lossy-compressed" */
  qualityNote: string;
}

export const FORMAT_PROFILES: Record<ImageFormat, FormatProfile> = {
  jpg: {
    fullName: "Joint Photographic Experts Group",
    compressionClass: "lossy",
    colorDepth: "24-bit colour (16.7 million colours)",
    transparencyNote: "None",
    animationNote: "No",
    sizeRank: 3,
    sizeNote: "Small for photos",
    support: "Everywhere: all browsers, phones, cameras and editors",
    strengths: [
      "Tiny file sizes for photographs",
      "Opens on literally every device and platform",
      "The safe default for email, uploads and sharing",
    ],
    weaknesses: [
      "No transparency, so logos and cut-outs get a solid background",
      "Sharp edges and text develop fuzzy artefacts",
      "Every re-save discards a little more detail",
    ],
    qualityNote: "already lossy-compressed",
  },
  png: {
    fullName: "Portable Network Graphics",
    compressionClass: "lossless",
    colorDepth: "Up to 48-bit colour plus a 16-bit alpha channel",
    transparencyNote: "Full alpha channel",
    animationNote: "No (still image; APNG is a separate extension)",
    sizeRank: 4,
    sizeNote: "Large for photos, compact for graphics",
    support: "Everywhere: all browsers and image editors",
    strengths: [
      "Every pixel preserved exactly, with no compression artefacts",
      "Full transparency for logos, screenshots and UI graphics",
      "Crisp text and sharp edges",
    ],
    weaknesses: [
      "Photographs can be 5 to 10 times larger than the same image as JPG",
      "No animation",
      "Overkill for plain photos where nobody sees the difference",
    ],
    qualityNote: "lossless, with every pixel intact",
  },
  webp: {
    fullName: "WebP (Google)",
    compressionClass: "both",
    colorDepth: "24-bit colour plus an 8-bit alpha channel",
    transparencyNote: "Full alpha channel",
    animationNote: "Yes, animated WebP",
    sizeRank: 2,
    sizeNote: "About 25-35% smaller than JPG or PNG",
    support: "All modern browsers; some older editors and apps still cannot open it",
    strengths: [
      "Much smaller files than JPG or PNG at the same visual quality",
      "Lossy and lossless modes, transparency and animation in one format",
      "Purpose-built for fast-loading web pages",
    ],
    weaknesses: [
      "Some older software, and a few social or upload platforms, reject it",
      "Not every image editor can save or even open it yet",
    ],
    qualityNote: "efficient modern compression",
  },
  gif: {
    fullName: "Graphics Interchange Format",
    compressionClass: "lossless",
    colorDepth: "256 colours maximum (8-bit palette)",
    transparencyNote: "1-bit only (a pixel is fully clear or fully solid)",
    animationNote: "Yes, frame-by-frame animation",
    sizeRank: 4,
    sizeNote: "Small for simple graphics, huge for video-like clips",
    support: "Everywhere: all browsers and messaging apps",
    strengths: [
      "Simple looping animation that plays anywhere",
      "Perfect for flat graphics, icons and memes with few colours",
      "Supported by every browser and chat app ever made",
    ],
    weaknesses: [
      "The 256-colour limit bands and dithers photos and gradients",
      "Transparency is all-or-nothing, so soft shadows get jagged edges",
      "Long animations balloon in size compared with real video formats",
    ],
    qualityNote: "limited to a 256-colour palette",
  },
  svg: {
    fullName: "Scalable Vector Graphics",
    compressionClass: "vector",
    colorDepth: "Unlimited (mathematical shapes, not pixels)",
    transparencyNote: "Yes, shapes can be transparent",
    animationNote: "Yes, via CSS or SMIL",
    sizeRank: -1,
    sizeNote: "Tiny for logos and icons; impractical for photos",
    support: "All modern browsers; design tools such as Illustrator, Figma and Inkscape",
    strengths: [
      "Infinitely scalable with zero quality loss",
      "Tiny files for logos, icons and illustrations",
      "Editable as text: colours and shapes can be changed in code",
    ],
    weaknesses: [
      "Cannot represent photographs efficiently",
      "A raster photo placed inside an SVG does not become a true vector",
      "Some upload forms and older systems refuse it",
    ],
    qualityNote: "resolution-independent vector data",
  },
  avif: {
    fullName: "AV1 Image File Format",
    compressionClass: "both",
    colorDepth: "Up to 12-bit colour with HDR support",
    transparencyNote: "Full alpha channel",
    animationNote: "Yes, image sequences",
    sizeRank: 1,
    sizeNote: "Often about 50% smaller than JPG at similar quality",
    support: "Chrome, Firefox, Edge and Safari 16.4+; some apps and older browsers cannot open it",
    strengths: [
      "The strongest compression available in browsers today",
      "HDR and wide-gamut colour for modern displays",
      "Transparency and animation supported",
    ],
    weaknesses: [
      "Compatibility is still catching up outside modern browsers",
      "Some social platforms and editors reject AVIF uploads",
      "Encoding is slower than JPG or WebP",
    ],
    qualityNote: "state-of-the-art AV1 compression",
  },
  bmp: {
    fullName: "Bitmap Image File",
    compressionClass: "uncompressed",
    colorDepth: "Up to 32-bit colour",
    transparencyNote: "Not in practice (rarely honoured)",
    animationNote: "No",
    sizeRank: 6,
    sizeNote: "Very large, roughly 3 bytes per pixel before any compression",
    support: "Native on Windows; most editors open it, browsers rarely serve it",
    strengths: [
      "Dead simple format that legacy Windows software always understands",
      "No compression means no compression artefacts",
    ],
    weaknesses: [
      "Enormous files, often 10 times a JPG of the same image",
      "No usable transparency",
      "Almost never the right choice for the web",
    ],
    qualityNote: "uncompressed pixel data",
  },
  tiff: {
    fullName: "Tagged Image File Format",
    compressionClass: "lossless",
    colorDepth: "Up to 16 bits per channel, plus CMYK for print",
    transparencyNote: "Yes, alpha channels and layers",
    animationNote: "No (but can hold multiple pages)",
    sizeRank: 6,
    sizeNote: "Very large, built for fidelity rather than size",
    support: "Print, scanning and photo software; web browsers do not display TIFF",
    strengths: [
      "The print and archiving standard: maximum fidelity, CMYK and layers",
      "Stores high bit-depth scans without throwing data away",
      "Multi-page files for scanned documents",
    ],
    weaknesses: [
      "Browsers cannot display it, so it is useless for web pages",
      "Files are very large",
      "Overkill for everyday sharing",
    ],
    qualityNote: "maximum-fidelity lossless data",
  },
  ico: {
    fullName: "Icon File Format",
    compressionClass: "container",
    colorDepth: "Up to 32-bit colour with alpha",
    transparencyNote: "Full alpha channel",
    animationNote: "No",
    sizeRank: -1,
    sizeNote: "Tiny by design: icons are at most 256 x 256 pixels",
    support: "Browsers (favicons) and Windows shortcuts",
    strengths: [
      "The standard favicon format: one file holds every size a browser tab needs",
      "Full transparency so icons sit cleanly on any background",
    ],
    weaknesses: [
      "Capped at 256 x 256 pixels, so photos lose almost all detail",
      "Useless for anything except icons",
    ],
    qualityNote: "a multi-size icon container",
  },
  heic: {
    fullName: "High Efficiency Image Container (HEVC)",
    compressionClass: "lossy",
    colorDepth: "10-bit colour",
    transparencyNote: "Yes, alpha and depth data",
    animationNote: "Yes, image sequences and bursts",
    sizeRank: 2,
    sizeNote: "About half the size of JPG at the same quality",
    support: "Apple devices; Windows needs an extension, and browsers do not display HEIC",
    strengths: [
      "The iPhone default: excellent quality at roughly half a JPG's size",
      "Stores bursts, Live Photos and depth data in one file",
      "10-bit colour for smoother gradients",
    ],
    weaknesses: [
      "Poor support outside the Apple ecosystem",
      "Many websites, apps and Windows PCs cannot open it without conversion",
    ],
    qualityNote: "high-efficiency HEVC compression",
  },
  jxl: {
    fullName: "JPEG XL",
    compressionClass: "both",
    colorDepth: "Up to 32-bit float colour with HDR support",
    transparencyNote: "Full alpha channel",
    animationNote: "Yes",
    sizeRank: 1,
    sizeNote: "Roughly 20% smaller than JPG lossy, and strong lossless compression",
    support: "Safari 17+ and some editors; Chrome removed support and Firefox support is experimental",
    strengths: [
      "Excellent lossy and lossless compression in a single format",
      "Can losslessly shrink existing JPG files by about 20%",
      "HDR, wide gamut and progressive decoding built in",
    ],
    weaknesses: [
      "Browser support is patchy and politically unsettled",
      "Few everyday apps can open it yet",
    ],
    qualityNote: "next-generation compression",
  },
  psd: {
    fullName: "Photoshop Document",
    compressionClass: "lossless",
    colorDepth: "Up to 32 bits per channel",
    transparencyNote: "Yes, per-layer alpha, masks and channels",
    animationNote: "No (frame data stays inside Photoshop)",
    sizeRank: 6,
    sizeNote: "Very large: every layer is stored",
    support: "Photoshop and some editors (GIMP, Photopea); browsers cannot display PSD",
    strengths: [
      "Keeps layers, masks and adjustments fully editable",
      "The working master file for professional design",
    ],
    weaknesses: [
      "Not a delivery format: nothing on the web displays it directly",
      "Huge files, and flattening is required to share the image",
    ],
    qualityNote: "a layered editing document",
  },
  tga: {
    fullName: "Truevision TGA (Targa)",
    compressionClass: "lossless",
    colorDepth: "Up to 32-bit colour with an alpha channel",
    transparencyNote: "Full alpha channel",
    animationNote: "No",
    sizeRank: 5,
    sizeNote: "Large: uncompressed or lightly RLE-compressed",
    support: "Game engines and video tools; browsers cannot display TGA",
    strengths: [
      "A game-development staple for textures with clean alpha channels",
      "Simple, predictable pixels that engines load fast",
    ],
    weaknesses: [
      "Invisible outside games and video production",
      "Large files compared with modern formats",
    ],
    qualityNote: "simple lossless pixel data",
  },
  pdf: {
    fullName: "Portable Document Format",
    compressionClass: "document",
    colorDepth: "Depends on the embedded image",
    transparencyNote: "The image is placed on a fixed page",
    animationNote: "No",
    sizeRank: -1,
    sizeNote: "The embedded image plus a small amount of page overhead",
    support: "Everywhere: every browser, phone and computer opens PDF",
    strengths: [
      "The universal format for documents, printing and email attachments",
      "Fixed layout: the page looks identical on every device",
      "Can bundle images into a tidy, shareable document",
    ],
    weaknesses: [
      "It is a document, not an image: editing the picture inside is awkward",
      "Not suitable where a plain image file is expected",
    ],
    qualityNote: "a fixed-layout document",
  },
};

/* ── Pair analysis ─────────────────────────────────────────────────────── */

export interface PairFacts {
  from: ImageFormat;
  to: ImageFormat;
  fromLabel: string;
  toLabel: string;
  fp: FormatProfile;
  tp: FormatProfile;
  transparencyLoss: boolean;
  transparencyRoughed: boolean;
  cannotInventTransparency: boolean;
  lossySourceToLossless: boolean;
  toLossy: boolean;
  animationLost: boolean;
  animationKept: boolean;
  vectorToRaster: boolean;
  rasterToVector: boolean;
  paletteCut: boolean;
  /** -2 much smaller … +2 much larger, null when not comparable */
  sizeTrend: number | null;
}

const LOSSY_SOURCES: ImageFormat[] = ["jpg", "heic"];
const LOSSLESS_TARGETS: ImageFormat[] = ["png", "tiff", "bmp", "tga", "gif"];

export function analysePair(route: ConversionRoute): PairFacts {
  const from = route.from;
  const to = route.to;
  const fp = FORMAT_PROFILES[from];
  const tp = FORMAT_PROFILES[to];
  const fromN = getFormatNotes(from);
  const toN = getFormatNotes(to);

  const sizeTrend =
    fp.sizeRank > 0 && tp.sizeRank > 0 ? tp.sizeRank - fp.sizeRank : null;

  return {
    from,
    to,
    fromLabel: getFormat(from)!.label,
    toLabel: getFormat(to)!.label,
    fp,
    tp,
    transparencyLoss: fromN.transparency && !toN.transparency,
    transparencyRoughed: fromN.transparency && to === "gif",
    cannotInventTransparency: !fromN.transparency && toN.transparency,
    lossySourceToLossless:
      LOSSY_SOURCES.includes(from) && LOSSLESS_TARGETS.includes(to),
    toLossy: tp.compressionClass === "lossy" || to === "webp" || to === "avif" || to === "jxl",
    animationLost: fromN.animation && !toN.animation,
    animationKept: fromN.animation && toN.animation,
    vectorToRaster: from === "svg" && to !== "svg",
    rasterToVector: to === "svg" && from !== "svg",
    paletteCut: to === "gif" && from !== "gif" && from !== "svg",
    sizeTrend,
  };
}

/** The single most important consequence of this conversion, as a sentence. */
export function headlineConsequence(f: PairFacts): string {
  const { fromLabel: F, toLabel: T } = f;
  if (f.transparencyLoss)
    return `The headline change: ${T} has no transparency, so any see-through areas of your ${F} are flattened onto a solid background colour (you can pick that colour in the tool above).`;
  if (f.vectorToRaster)
    return `The headline change: an SVG is resolution-independent, but ${T} is a grid of pixels, so the output is rendered at one fixed size and will soften if you scale it up afterwards.`;
  if (f.rasterToVector)
    return `The headline change: the ${F} pixels are embedded as a bitmap inside an SVG file, so the result works anywhere an SVG container is required but does not become a true, infinitely scalable vector.`;
  if (f.animationLost)
    return `The headline change: ${T} is a still-image format, so only the first frame of an animated ${F} is kept.`;
  if (f.to === "ico")
    return `The headline change: your image is shrunk into icon sizes (at most 256 x 256 pixels) and packed into a single ICO container, ready to use as a favicon.`;
  if (f.to === "pdf")
    return `The headline change: your ${F} image is placed on a fixed-layout PDF page, which makes it easy to print, email and archive, but it stops being a plain image file.`;
  if (f.lossySourceToLossless)
    return `The headline change: ${T} will preserve every pixel of your ${F} exactly as it is now, but it cannot restore detail that ${F} compression already threw away.`;
  if (f.paletteCut)
    return `The headline change: ${T} holds at most 256 colours, so photographs and smooth gradients are dithered or banded down to fit the palette.`;
  if (f.from === "heic")
    return `The headline change: HEIC is the iPhone photo format that much of the non-Apple world still cannot open, and converting to ${T} makes the photo usable everywhere.`;
  if (f.from === "psd")
    return `The headline change: the layered PSD is flattened into a single ${T} image, which is what makes it shareable, while your original PSD keeps every layer for editing.`;
  if (f.from === "tiff")
    return `The headline change: TIFF is built for print and archives and cannot even be displayed by web browsers, so converting to ${T} turns the scan or master file into something shareable.`;
  if (f.to === "jxl" || f.to === "avif" || f.to === "heic")
    return `The headline change: ${T} uses far more efficient compression than ${F}, so files shrink a lot, but check that wherever the image is going can actually open ${T}.`;
  if (f.sizeTrend !== null && f.sizeTrend <= -2)
    return `The headline change: expect a dramatically smaller file, because ${T} compresses far more efficiently than ${F}.`;
  if (f.sizeTrend !== null && f.sizeTrend >= 2)
    return `The headline change: expect a much larger file, because ${T} stores far more data per pixel than ${F}.`;
  return `The headline change: you trade ${F}'s strengths (${f.fp.strengths[0].toLowerCase()}) for ${T}'s (${f.tp.strengths[0].toLowerCase()}).`;
}

/* ── Composed page content ─────────────────────────────────────────────── */

/** Two intro paragraphs, unique to the pair. */
export function pairIntro(route: ConversionRoute): string[] {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  const fromN = getFormatNotes(f.from);
  const toN = getFormatNotes(f.to);

  const audience =
    f.to === "ico"
      ? "website owners who need a favicon"
      : f.to === "pdf"
        ? "anyone who needs to print, email or archive the image as a document"
        : f.from === "heic"
          ? "iPhone owners who need their photos to open on Windows, Android and the web"
          : f.from === "psd"
            ? "designers who need to share or publish a finished design"
            : f.from === "tiff"
              ? "photographers, print shops and archivists working with scans and master files"
              : f.to === "webp" || f.to === "avif" || f.to === "jxl"
                ? "website owners and developers cutting page weight"
                : `anyone whose image is stuck in ${F} when the place it is going expects ${T}`;

  const article = (s: string) => (/^[aeiou]/i.test(s) ? "an" : "a");
  const p1 =
    `Converting ${F} to ${T} means re-encoding ${article(fromN.kind)} ${fromN.kind.toLowerCase()} (${f.fp.fullName}) as ${article(toN.kind)} ${toN.kind.toLowerCase()}. ` +
    `It is a common job for ${audience}. ` +
    headlineConsequence(f);

  const q =
    f.from === f.to
      ? ""
      : f.lossySourceToLossless
        ? `On quality, set expectations correctly: your ${F} is ${f.fp.qualityNote}, and a lossless ${T} can only lock in the quality that is still there. On size, ${T} stores pixels with little or no compression, so the ${T} file will usually be noticeably larger than the ${F} you started with.`
        : f.toLossy && getFormatNotes(f.from).compression !== "Lossy"
          ? `On quality, ${T} compression is lossy: a small amount of fine detail is discarded to hit much smaller file sizes, and the quality slider in the tool above lets you choose the balance. On size, this is normally a big win: expect the ${T} to be a fraction of the ${F} for photographs.`
          : f.sizeTrend !== null && f.sizeTrend <= -2
            ? `On size, this is one of the most rewarding conversions on the site: ${T} typically produces files dramatically smaller than ${F} for the same image, with quality that is hard to tell apart at normal viewing sizes.`
            : f.sizeTrend !== null && f.sizeTrend >= 2
              ? `On size, be ready for growth: ${T} keeps far more data than ${F}, so files commonly end up several times larger. That is the price of ${f.tp.strengths[0].toLowerCase()}.`
              : `Quality is preserved as faithfully as the two formats allow, and file size lands wherever ${T}'s compression puts it: ${f.tp.sizeNote.toLowerCase()}.`;

  const p2 =
    `${fromN.detail} ${toN.detail} ${q}`.replace(/\s+/g, " ").trim();
  return [p1, p2];
}

/** "When to convert" bullets, derived from the pair's facts. */
export function pairWhenTo(route: ConversionRoute): string[] {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  const out: string[] = [];
  out.push(
    `You need the file as ${T}: ${getFormatNotes(f.to).bestFor} is exactly what ${T} is for, and the destination (a website, app, printer or person) expects that format.`
  );
  if (f.sizeTrend !== null && f.sizeTrend <= -1)
    out.push(
      `File size is the problem. Moving from ${F} to ${T} is one of the simplest ways to shrink the image without changing its dimensions.`
    );
  if (f.from === "heic" || f.from === "tiff" || f.from === "psd" || f.from === "tga" || f.from === "jxl")
    out.push(
      `Compatibility is the problem. ${F} cannot be opened or displayed in plenty of everyday places (${f.fp.support.toLowerCase()}), while ${T} works in far more of them.`
    );
  if (f.cannotInventTransparency === false && getFormatNotes(f.to).transparency && (f.to === "png" || f.to === "webp" || f.to === "avif"))
    out.push(
      `Your workflow needs transparency, and ${T} keeps a full alpha channel, unlike formats that flatten everything onto a background.`
    );
  if (f.to === "pdf")
    out.push(
      "You want a tidy, fixed-layout document for printing, emailing or archiving rather than a loose image file."
    );
  if (f.animationKept)
    out.push(
      `You want to keep the animation: both ${F} and ${T} support motion, so the converted file still animates.`
    );
  if (f.to === "ico")
    out.push(
      "You are setting up a website favicon or a Windows shortcut icon and need the real ICO container, not just a renamed PNG."
    );
  if (f.vectorToRaster)
    out.push(
      "You need the artwork as ordinary pixels at a specific size, for example for a platform that does not accept SVG uploads."
    );
  return Array.from(new Set(out)).slice(0, 4);
}

/** "When NOT to convert" bullets, derived from the pair's facts. */
export function pairWhenNotTo(route: ConversionRoute): string[] {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  const out: string[] = [];
  if (f.transparencyLoss)
    out.push(
      `Do not convert if the transparency is the point of the image, for example a logo or sticker: ${T} cannot store it, and the clear areas become a solid colour. Keep the ${F} as your master.`
    );
  if (f.transparencyRoughed)
    out.push(
      `Do not convert if your ${F} relies on soft, semi-transparent edges such as drop shadows or glows: GIF transparency is on-or-off, so those edges turn hard and jagged.`
    );
  if (f.lossySourceToLossless)
    out.push(
      `Do not convert expecting a quality upgrade. ${T} cannot invent the detail that ${F} compression discarded; the file gets bigger, not better. Convert for editing convenience or pixel-exact copies only.`
    );
  if (f.animationLost)
    out.push(
      `Do not convert if the motion matters: ${T} keeps only the first frame, so an animated ${F} becomes a still picture.`
    );
  if (f.from === "psd")
    out.push(
      "Do not treat the converted file as your editable master. Flattening is one-way; keep the PSD if you might change layers later."
    );
  if (f.from === "svg")
    out.push(
      `Do not convert if the image still needs to scale freely (website logo, icon set): the ${T} output is fixed pixels, while the SVG can be resized forever without loss.`
    );
  if (f.to === "jxl" || f.to === "heic")
    out.push(
      `Do not convert if the file is headed somewhere with unknown or older software: ${T} support is still patchy (${f.tp.support.toLowerCase()}), and the recipient may not be able to open it.`
    );
  if (f.to === "tiff" || f.to === "bmp")
    out.push(
      `Do not convert for web or social use: browsers and feeds are not built for ${T}, and the huge file helps no one there. ${T} is for ${getFormatNotes(f.to).bestFor}.`
    );
  out.push(
    `Do not convert your only copy. Whatever the direction, keep the original ${F} file somewhere safe until you have checked the ${T} result.`
  );
  return Array.from(new Set(out)).slice(0, 3);
}

/** Quality & file-size consequences, as one or two paragraphs. */
export function pairQualitySize(route: ConversionRoute): string[] {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  const ps: string[] = [];

  if (f.lossySourceToLossless) {
    ps.push(
      `Quality: converting ${F} to ${T} is a copy, not a restoration. ${T} is lossless, so from this point on the pixels are frozen exactly as they are, including any ${F} compression artefacts already baked in. Nothing gets worse, and nothing gets better. If you still have an original photo or export in a lossless format, convert from that instead.`
    );
  } else if (f.toLossy && f.from !== "jpg" && f.from !== "heic") {
    const srcNote =
      f.from === "svg"
        ? " Because your source is a vector, the encoder starts from a perfectly clean render, so edges stay as sharp as the chosen pixel size allows."
        : f.from === "gif"
          ? " Your GIF source is already limited to 256 colours, so the encoder is rarely the bottleneck: most banding you see afterwards was already in the source."
          : f.from === "tiff" || f.from === "psd" || f.from === "bmp" || f.from === "tga"
            ? ` Your ${F} source is a pristine master, which is the ideal starting point: convert once, at the quality you actually need, and keep the master untouched.`
            : f.from === "png"
              ? " PNG sources are often screenshots or graphics with text, which is exactly where lossy artefacts show first, so stay at the higher end of the quality range for those."
              : ` If your ${F} was saved lossily, this is a second lossy generation; fine for sharing, but convert from an original for anything archival.`;
    ps.push(
      `Quality: ${T} uses lossy compression, so some fine detail is deliberately discarded, mostly where your eye is least likely to notice. Photographs usually survive beautifully; text, line art and sharp colour boundaries are where artefacts show first. Use the quality slider above and zoom in on a detailed area before you commit: around 80 to 90 percent quality is the sweet spot for most photos.${srcNote}`
    );
  } else if (f.toLossy) {
    ps.push(
      `Quality: both ${F} and ${T} are lossy, so this conversion re-compresses already-compressed data (a generation loss). The result is fine for everyday use, but avoid chaining conversions: always convert from the best ${F} you have, and never convert back and forth repeatedly.`
    );
  } else if (f.vectorToRaster) {
    ps.push(
      `Quality: there is no compression loss in the usual sense; the question is purely resolution. The SVG is drawn once at the pixel size the tool uses, so pick dimensions at least as large as the biggest size you plan to display, otherwise the ${T} will look soft when scaled up.`
    );
  } else {
    const tgtNote =
      f.to === "tiff"
        ? " TIFF also preserves high bit depths that other formats discard, which is why print and archive workflows standardise on it."
        : f.to === "bmp"
          ? " BMP stores the pixels almost raw, so the copy is as faithful as it gets, at the cost of very large files."
          : f.to === "png"
            ? " PNG's lossless compression is also why the result stays perfectly editable and re-savable without drifting."
            : "";
    ps.push(
      `Quality: ${T} preserves your ${F} pixels losslessly, so what you see after conversion is exactly what went in, with no new artefacts. Any softness in the result was already in the source file.${tgtNote}`
    );
  }

  if (f.sizeTrend === null) {
    if (f.to === "ico")
      ps.push(
        `File size: ICO output is tiny by construction. The image is scaled down to icon sizes (16 to 256 pixels), so even a multi-megabyte ${F} becomes a file of a few kilobytes.`
      );
    else if (f.to === "pdf")
      ps.push(
        `File size: the PDF wraps your image with a small amount of page overhead, so the result is roughly the size of the embedded image plus a few kilobytes. It is a container change, not a compression win.`
      );
    else if (f.vectorToRaster)
      ps.push(
        `File size: the ${T} size depends on the pixel dimensions you render at. A small web-sized render can be smaller than the SVG of a complex illustration, while a print-sized render of a simple logo will be far larger than the tiny vector file.`
      );
    else
      ps.push(
        `File size: an SVG built around an embedded ${F} bitmap is roughly the size of the ${F} plus a little XML markup. Wrapping does not compress anything.`
      );
  } else if (f.sizeTrend <= -2) {
    ps.push(
      `File size: expect a dramatic drop. ${T} (${f.tp.sizeNote.toLowerCase()}) squeezes the same picture into a fraction of the space that ${F} (${f.fp.sizeNote.toLowerCase()}) needs, which is why this conversion is a favourite for speeding up websites and shrinking email attachments.`
    );
  } else if (f.sizeTrend === -1) {
    ps.push(
      `File size: expect a clear reduction. ${T} compresses more efficiently than ${F} (${f.tp.sizeNote.toLowerCase()} versus ${f.fp.sizeNote.toLowerCase()}), so the same image takes noticeably less space.`
    );
  } else if (f.sizeTrend === 0) {
    ps.push(
      `File size: expect roughly the same size. ${F} and ${T} compress this kind of image to a similar degree, so convert for compatibility or features rather than for space savings.`
    );
  } else if (f.sizeTrend === 1) {
    ps.push(
      `File size: expect some growth. ${T} keeps more data per pixel than ${F} (${f.tp.sizeNote.toLowerCase()}), so the converted file will be somewhat larger.`
    );
  } else {
    ps.push(
      `File size: expect major growth, often several times the original. ${T} is built for fidelity, not economy (${f.tp.sizeNote.toLowerCase()}), while ${F} is ${f.fp.sizeNote.toLowerCase()}. Make sure the destination actually needs ${T} before converting large batches.`
    );
  }
  return ps;
}

/** Extended comparison-table rows: [attribute, from value, to value]. */
export function pairTableRows(route: ConversionRoute): [string, string, string][] {
  const f = analysePair(route);
  const fromN = getFormatNotes(f.from);
  const toN = getFormatNotes(f.to);
  return [
    ["Format type", fromN.kind, toN.kind],
    ["Compression", fromN.compression, toN.compression],
    ["Colour depth", f.fp.colorDepth, f.tp.colorDepth],
    ["Transparency", f.fp.transparencyNote, f.tp.transparencyNote],
    ["Animation", f.fp.animationNote, f.tp.animationNote],
    ["Typical file size", f.fp.sizeNote, f.tp.sizeNote],
    ["Opens in", f.fp.support, f.tp.support],
    ["Best for", fromN.bestFor, toN.bestFor],
  ];
}

export interface PairFaq {
  question: string;
  answer: string;
}

/**
 * Pair-specific setting tip shown inside the how-to steps, or null when the
 * generic steps are enough.
 */
export function pairSettingTip(route: ConversionRoute): string | null {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  if (f.transparencyLoss)
    return `Because ${T} has no transparency, choose a background colour for the clear areas before converting. White is the safe default; match your website or document background for a seamless result.`;
  if (f.to === "ico")
    return "The tool packs the standard favicon sizes into the ICO automatically. Start from a square image so the icon is not cropped awkwardly.";
  if (f.vectorToRaster)
    return `Think about output size before converting: the ${T} is rendered at fixed pixel dimensions, so this is your one chance to pick a resolution big enough for print or retina screens.`;
  if (f.toLossy && f.from !== "jpg" && f.from !== "heic")
    return `Before converting, set the quality slider: around 80 to 90 percent keeps photos looking clean while still cutting most of the file size.`;
  if (f.from === "heic")
    return "If the photo came straight from an iPhone, it may include Live Photo or depth data. The converted file keeps the still image only.";
  return null;
}

/** 5-6 FAQs selected from the pair's real facts. */
export function pairFaqs(route: ConversionRoute): PairFaq[] {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  const faqs: PairFaq[] = [];

  faqs.push({
    question: `How do I convert ${F} to ${T}?`,
    answer:
      `Drop your ${F} file onto the converter above (or click to browse), and the conversion starts automatically in your browser. ` +
      (pairSettingTip(route) ?? "There are no settings you must change for a standard conversion.") +
      ` When it finishes, click Download to save the ${T} file. You can queue several ${F} files at once and download them one by one or together as a ZIP.`,
  });

  if (f.transparencyLoss) {
    faqs.push({
      question: `What happens to transparent parts of my ${F} when I convert to ${T}?`,
      answer: `${T} cannot store transparency at all. Transparent pixels are flattened onto a solid background colour, which you can choose in the converter (white by default). If the image is a logo or sticker that must stay transparent, keep it as ${F} or convert to a format with an alpha channel such as PNG, WebP or AVIF instead.`,
    });
  } else if (f.transparencyRoughed) {
    faqs.push({
      question: `Will my ${F} transparency survive converting to ${T}?`,
      answer: `Only crudely. ${F} has a full alpha channel with soft, semi-transparent edges; GIF transparency is a single on-or-off switch per pixel. Opaque and fully clear areas convert fine, but soft shadows, glows and feathered edges turn hard and jagged.`,
    });
  } else if (f.cannotInventTransparency) {
    faqs.push({
      question: `Will converting ${F} to ${T} give my image a transparent background?`,
      answer: `No. ${T} supports transparency, but conversion cannot invent it: every pixel of your ${F} is opaque, so the ${T} is opaque too. Making a background transparent is an editing job (removing the background), not a format conversion.`,
    });
  }

  if (f.lossySourceToLossless) {
    faqs.push({
      question: `Will converting ${F} to ${T} improve the quality?`,
      answer: `No, and this is the most common myth about this conversion. Your ${F} is ${f.fp.qualityNote}: detail discarded by that compression is gone for good. The ${T} will be a pixel-perfect copy of the ${F} as it is today, just in a larger, lossless file. Convert for editing or compatibility reasons, not for quality.`,
    });
  } else if (f.toLossy && f.from !== "jpg" && f.from !== "heic") {
    faqs.push({
      question: `How much quality do I lose converting ${F} to ${T}?`,
      answer: `At high quality settings (80 to 90 percent on the slider), most people cannot see any difference on photographs. Losses appear first as slight softness or blockiness around sharp edges, text and logos. Because ${T} compression is permanent, always keep your lossless ${F} original if you might edit the image again.`,
    });
  } else if (f.toLossy) {
    faqs.push({
      question: `Does converting ${F} to ${T} reduce quality further?`,
      answer: `Slightly, yes. Both formats are lossy, so the ${T} encoder re-compresses data that ${F} compression already approximated. For everyday sharing the difference is negligible, but always convert from the best-quality ${F} you have and avoid repeated back-and-forth conversions.`,
    });
  }

  if (f.animationLost) {
    faqs.push({
      question: `Will the animation in my ${F} survive converting to ${T}?`,
      answer: `No. ${T} is a still-image format, so only the first frame of your ${F} is kept. If the motion is the point, keep the ${F}, or convert to a format that supports animation such as WebP, AVIF or GIF instead.`,
    });
  } else if (f.animationKept) {
    faqs.push({
      question: `Will the animation in my ${F} survive converting to ${T}?`,
      answer: `Yes. Both ${F} and ${T} support animation, so frames and timing carry over. File size may change noticeably because the two formats compress motion very differently.`,
    });
  }

  if (f.vectorToRaster) {
    faqs.push({
      question: `What size will my ${T} be, and can I enlarge it later?`,
      answer: `The SVG is rendered once at the tool's pixel dimensions. Enlarging the ${T} afterwards just stretches pixels and softens the image. If you need a bigger version, come back to the original SVG and convert again at a larger size; the vector itself never runs out of resolution.`,
    });
  }
  if (f.rasterToVector) {
    faqs.push({
      question: `Does converting ${F} to SVG make my image a real vector?`,
      answer: `No. The converter embeds your ${F} bitmap inside an SVG wrapper, which is useful when a system specifically requires an .svg file, but the picture inside is still pixels and will blur when enlarged. Turning a photo or logo into a true vector requires tracing it in a design tool.`,
    });
  }

  if (f.to === "ico") {
    faqs.push({
      question: `Which sizes go into the ICO file?`,
      answer: `The converter packs the standard favicon sizes (16, 24, 32, 48, 64, 128 and 256 pixels where the source allows) into one ICO container, so browser tabs, bookmarks and Windows shortcuts each pick the size they need. Start from your largest, sharpest square version of the artwork.`,
    });
  }
  if (f.to === "pdf") {
    faqs.push({
      question: `Can I put several ${F} images into one PDF?`,
      answer: `Yes, convert or add each image and they are placed into the document in order. That is the standard way to bundle a set of images into one tidy file for emailing, printing or archiving.`,
    });
  }
  if (f.from === "heic") {
    faqs.push({
      question: `Why do I need to convert HEIC at all?`,
      answer: `HEIC is the default photo format on iPhones because it halves file sizes, but support outside Apple devices is poor: Windows needs an extra extension, browsers do not display it, and many websites refuse HEIC uploads. Converting to ${T} makes the photo open correctly almost anywhere.`,
    });
  }
  if (f.to === "jxl" || f.to === "avif") {
    faqs.push({
      question: `Will everyone be able to open the ${T} file?`,
      answer: `Not quite everyone yet. ${T} support: ${f.tp.support.toLowerCase()}. For your own website with modern browsers that is fine; for files you send to other people, ${F === "JPG" ? "the original" : "a JPG or PNG"} is still the safer choice.`,
    });
  }

  faqs.push({
    question: `Will my ${T} file be bigger or smaller than the ${F}?`,
    answer:
      f.vectorToRaster
        ? `It depends on the size you render at, not on the formats alone. A small ${T} for the web can be just a few kilobytes; a print-sized render can be megabytes. The SVG itself stays tiny and is always your smallest, sharpest master.`
        : f.rasterToVector
          ? `About the same, plus a little XML markup. The SVG wraps your original ${F} bitmap rather than compressing it, so do not expect savings from this conversion.`
          : f.sizeTrend === null
        ? `Roughly similar. This conversion mainly changes the container, not the amount of image data: ${T} is ${f.tp.sizeNote.toLowerCase()}, so expect a file in the same ballpark as your ${F}, plus or minus a little overhead.`
        : f.sizeTrend <= -1
          ? `Smaller, usually by a lot. ${T} (${f.tp.sizeNote.toLowerCase()}) is much more efficient than ${F} (${f.fp.sizeNote.toLowerCase()}), so the same image typically takes a fraction of the space.`
          : f.sizeTrend === 0
            ? `About the same. ${F} and ${T} compress this kind of image to a similar size, so convert for compatibility or features rather than space.`
            : `Bigger, often several times bigger. ${T} stores far more data per pixel (${f.tp.sizeNote.toLowerCase()}) than ${F} (${f.fp.sizeNote.toLowerCase()}). That trade buys fidelity or compatibility, not economy.`,
  });

  faqs.push({
    question: `Is this ${F} to ${T} converter private and free?`,
    answer: `Yes on both counts. The conversion runs entirely in your browser using the Canvas API and WebAssembly, so your ${F} files are never uploaded to a server, never stored, and disappear from memory when you close the tab. There is no account, no watermark and no file limit.`,
  });

  return faqs.slice(0, 6);
}

/** Pair-aware default meta description (used when no translation overrides it). */
export function pairMetaDescription(route: ConversionRoute): string {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  let hook: string;
  if (f.transparencyLoss) hook = `${T} has no transparency, so clear areas are flattened onto a background you choose.`;
  else if (f.lossySourceToLossless) hook = `${T} keeps every remaining pixel exactly, without inventing quality ${F} already lost.`;
  else if (f.vectorToRaster) hook = "Your vector is rendered at a crisp fixed size you control.";
  else if (f.rasterToVector) hook = "Wraps your image in an SVG container for systems that require one.";
  else if (f.animationLost) hook = `Only the first frame is kept, because ${T} is a still format.`;
  else if (f.to === "ico") hook = "Packs all standard favicon sizes into one ICO file.";
  else if (f.to === "pdf") hook = "Places your image on a fixed-layout page, ready to print or email.";
  else if (f.sizeTrend !== null && f.sizeTrend <= -1) hook = `Expect a much smaller file: ${T} compresses far more efficiently than ${F}.`;
  else if (f.sizeTrend !== null && f.sizeTrend >= 1) hook = `Preserves full fidelity in ${T} format for print, editing or archiving.`;
  else hook = `Fast, private conversion with the quality of your ${F} preserved.`;
  return `Convert ${F} to ${T} online for free. ${hook} No upload and no sign-up: conversion runs in your browser and files never leave your device.`;
}

/* ── Deep dives for the highest-traffic pair pages ────────────────────────
 *
 * A worked size example (typical figures, assumptions stated, never
 * presented as measured benchmarks), genuine edge cases checked against
 * the browser converter in lib/converters/image.ts, a better-choice note,
 * and two extra FAQs that do not duplicate pairFaqs(). Only the pairs
 * listed here get a deep dive; every other pair page renders unchanged.
 */

export interface PairDeepDiveEdgeCase {
  title: string;
  body: string;
}

export interface PairDeepDive {
  /** Marker heading, unique per pair, used to verify the section live. */
  exampleHeading: string;
  /** Worked example paragraphs; the first states its assumptions. */
  example: string[];
  edgeCases: PairDeepDiveEdgeCase[];
  /** When a different format is actually the better choice. */
  betterChoice: string;
  faqs: PairFaq[];
}

export const PAIR_DEEP_DIVES: Record<string, PairDeepDive> = {
  "png-to-jpg": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from PNG to JPG",
    example: [
      "Take a typical 4000 x 3000 phone photo saved as PNG. As a PNG it commonly weighs around 10 to 14 MB, because PNG stores every pixel losslessly and photographs compress poorly that way. Converted to JPG at the tool's default quality of 92, the same photo typically lands around 2 to 4 MB, roughly a quarter of the PNG size, with no visible difference at normal viewing sizes. Drop the quality to 80 and it often falls below 2 MB, which is the range most email and upload limits are happy with. These are typical figures for a detailed photo, not measurements: a noisy low light shot compresses worse, and a simple graphic compresses far better.",
      "The saving is smaller for graphics. A flat logo or screenshot with large solid areas may only shrink by half, because PNG already compresses those efficiently. If the PNG is mostly flat colour and text, the JPG may even look worse while barely saving space, which is your cue to keep the PNG.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened, not kept",
        body: "JPG has no alpha channel, so see-through areas become the background colour you pick in the tool above (white by default). Soft shadows and feathered edges are blended onto that colour rather than cut out, so a logo placed on a coloured page can end up with a visible white box. Match the background colour to the page the JPG will sit on.",
      },
      {
        title: "Text and sharp edges suffer first",
        body: "JPG compresses in small blocks tuned for photographs, so small text, thin lines and hard colour boundaries develop fuzzy artefacts before photos do. For screenshots full of text, keep quality at 90 or above, or keep the file as PNG.",
      },
      {
        title: "16-bit colour is narrowed to 8-bit",
        body: "PNG can hold 16 bits per colour channel; JPG holds 8. For ordinary photos the difference is invisible, but a heavily edited gradient can show faint banding after conversion.",
      },
    ],
    betterChoice:
      "If the image must stay transparent, or it is a logo, icon or screenshot with text, convert to WebP instead: WebP keeps the alpha channel and is typically 25 to 35 percent smaller than JPG at similar quality. Keep the PNG as your master in every case, because a JPG cannot give transparency back.",
    faqs: [
      {
        question: "Why does my logo look fuzzy after converting PNG to JPG?",
        answer:
          "JPG compression is tuned for photographs, not hard edges. It works in small blocks, and sharp boundaries between colours blur and ring, especially at lower quality settings. Logos, icons and text heavy screenshots are the worst cases. Raise the quality slider to 90 or above for a cleaner result, and if the logo must stay crisp or transparent, keep it as PNG or convert to WebP instead.",
      },
      {
        question: "What background colour should I choose for a transparent PNG?",
        answer:
          "Pick the colour the JPG will sit on: white for documents and most web pages, black for dark slides, or the exact page colour for a seamless look. The tool fills every transparent pixel with that colour before encoding, and semi-transparent edge pixels are blended onto it, so a mismatched colour leaves a visible halo around the subject.",
      },
    ],
  },
  "jpg-to-png": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from JPG to PNG",
    example: [
      "Take a typical 4000 x 3000 phone photo that is about 3 MB as JPG. Converted to PNG, the same photo typically grows to around 10 to 16 MB, roughly 3 to 5 times larger, because PNG stores every pixel losslessly instead of discarding fine detail the way JPG does. Nothing about the picture improves in the process: the PNG is a pixel exact copy of the JPG, artefacts included. These are typical figures, not measurements: a noisy photo grows more, a clean studio shot grows less.",
      "That growth is the price of a format every editor can open and re-save without further loss. It is worth paying when the PNG is a working master for editing, and a waste when the file is only being shared, where the original JPG was already the smaller, compatible choice.",
    ],
    edgeCases: [
      {
        title: "No quality is gained, only preserved",
        body: "JPG artefacts baked into the source, such as blockiness in skies or ringing around text, are copied faithfully into the PNG. Converting to PNG stops further loss, but it cannot clean the image up.",
      },
      {
        title: "Transparency cannot be invented",
        body: "Every pixel of a JPG is opaque, so the PNG is opaque too. Removing a background is an editing job, not a conversion, and needs a background removal tool.",
      },
      {
        title: "Camera data does not carry over",
        body: "The converter re-encodes pixels only, so EXIF data such as camera settings and location tags, and any embedded colour profile, do not survive in the PNG. Keep the original JPG if that data matters.",
      },
    ],
    betterChoice:
      "If the goal is a smaller file for sharing, do not convert at all: the JPG is already the compact choice. If the goal is editing, PNG is the right master, but convert from the best original you have, not from an already compressed JPG, whenever that original still exists.",
    faqs: [
      {
        question: "Can I edit the PNG and save it back to JPG without losing quality?",
        answer:
          "Almost. Editing the PNG itself is lossless: you can crop, adjust and re-save it as PNG as often as you like with no drift. The loss happens only at the final export back to JPG, and only once, so keep the edited PNG as your master and export a fresh JPG whenever you need a shareable copy.",
      },
      {
        question: "Will the PNG keep my photo's EXIF data and location tags?",
        answer:
          "No. The converter decodes the JPG to pixels and encodes a fresh PNG, so camera settings, dates and GPS tags are not copied across. If you need that data, keep the original JPG alongside the PNG, or use a converter that explicitly preserves metadata.",
      },
    ],
  },
  "avif-to-jpg": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from AVIF to JPG",
    example: [
      "Take a typical 4000 x 3000 photo saved as AVIF at about 1.5 MB. AVIF is the most efficient format browsers support, often around half the size of a JPG at similar quality, so the same photo as JPG at the tool's default quality of 92 typically lands around 3 to 4 MB, roughly twice the AVIF. Resolution does not change: a 4000 x 3000 AVIF comes back as a 4000 x 3000 JPG. These are typical figures, not measurements: a detailed scene grows more, a plain one less.",
      "That growth buys compatibility. AVIF opens in modern browsers, but many editors, upload forms, printers and older devices still refuse it. The JPG opens everywhere, which is the whole reason for the conversion.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened, not kept",
        body: "AVIF can carry a full alpha channel, but JPG cannot, so see-through areas become the background colour you pick in the tool above (white by default). A logo or cut-out placed on a coloured page can end up with a visible box unless the background colour matches the page.",
      },
      {
        title: "Animated AVIF becomes a single still frame",
        body: "AVIF can hold an image sequence, but JPG is a still format, so only the first frame survives. If the motion matters, keep the AVIF or convert to a format that supports animation.",
      },
      {
        title: "Wide colour and HDR are narrowed to standard colour",
        body: "AVIF can hold up to 12-bit colour with HDR; JPG holds 8 bits in standard colour. Vivid HDR highlights and very smooth gradients can flatten or band slightly after conversion, though at quality 90 or above most people cannot see it.",
      },
    ],
    betterChoice:
      "If the destination accepts AVIF, keep the AVIF: it is smaller and loses nothing in this direction. If the file needs transparency or a lossless master, convert to PNG instead of JPG. For everything headed to editors, upload forms, printers or older devices, JPG is the safe choice.",
    faqs: [
      {
        question: "Does converting AVIF to JPG keep the HDR look?",
        answer:
          "No, not fully. JPG stores 8-bit standard colour, while AVIF can hold wider colour and HDR highlights. The converter maps the picture into standard colour, so very bright highlights and deep shadows lose some of their extra range. The result still looks like the same photo at normal viewing, but it is no longer an HDR image.",
      },
      {
        question: "Should I convert my AVIF photos to JPG or PNG?",
        answer:
          "Choose JPG for sharing, uploading and printing: it is universally compatible and far smaller than PNG. Choose PNG only when you need a lossless editing master or transparency, since PNG files of photos are several times larger than the JPG of the same image.",
      },
    ],
  },
  "webp-to-png": {
    exampleHeading: "Worked example: a web photo from WebP to PNG",
    example: [
      "Take a typical 2000 x 1500 photo saved from the web as a lossy WebP of about 500 KB. Converted to PNG, the same picture typically grows to around 2 to 4 MB, several times larger, because PNG stores every decoded pixel losslessly while WebP's efficient compression is left behind. The picture itself does not improve: the PNG is an exact copy of the WebP pixels, including any compression softness already in them. These are typical figures, not measurements.",
      "Convert for compatibility, not for size. The usual reason is an editor, presentation app or upload form that refuses WebP, while PNG opens everywhere.",
    ],
    edgeCases: [
      {
        title: "Animated WebP becomes a single still frame",
        body: "PNG is a still format, so only the first frame of an animated WebP survives. If the motion matters, keep the WebP or convert to a format that supports animation.",
      },
      {
        title: "Lossy WebP artefacts are frozen in",
        body: "A lossy WebP has already discarded fine detail. The PNG preserves the decoded pixels exactly, so softness or banding from the WebP stays visible, and converting back and forth never recovers it.",
      },
      {
        title: "Transparency survives, but there is no quality slider",
        body: "WebP and PNG both carry a full alpha channel, so cut-out logos and icons stay cut out. Because PNG is lossless there is no quality setting to tune: the output is simply the decoded pixels, stored exactly.",
      },
    ],
    betterChoice:
      "If the destination accepts WebP, keep the WebP: it is smaller and loses nothing in this direction. Convert to PNG only when compatibility demands it, and keep the original WebP as your smaller master.",
    faqs: [
      {
        question: "Does the PNG keep my WebP image's transparency?",
        answer:
          "Yes. Both formats carry a full alpha channel, so transparent areas stay transparent with no background fill and no halo around cut-out edges. If your WebP is fully opaque, the PNG is opaque too; conversion cannot add transparency that was not there.",
      },
      {
        question: "Will the PNG look sharper than the WebP?",
        answer:
          "No. PNG is lossless, so it stores exactly the pixels the WebP decodes to, but it cannot restore detail the lossy WebP already discarded. Any softness, banding or blockiness in the WebP is copied faithfully. Convert to PNG for compatibility or editing, not for a sharper image.",
      },
    ],
  },
  "png-to-webp": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from PNG to WebP",
    example: [
      "Take a typical 4000 x 3000 phone photo that is about 12 MB as PNG. Converted to WebP at the tool's default quality of 92, the same photo typically lands around 3 to 4 MB, roughly a quarter to a third of the PNG, with quality that is hard to tell apart at normal viewing sizes. A PNG screenshot with large flat areas shrinks less in proportion, because PNG already compresses flat colour efficiently, but it still usually ends up smaller as WebP. These are typical figures, not measurements.",
    ],
    edgeCases: [
      {
        title: "WebP output here is lossy, even from a lossless PNG",
        body: "The tool encodes WebP through the browser canvas at the quality you set, so a small amount of fine detail is discarded. At quality 92 photos look clean, but text and line art soften first, so keep quality high for screenshots.",
      },
      {
        title: "Transparency is kept, unlike JPG",
        body: "WebP carries a full alpha channel, so a PNG logo or icon with see-through areas stays see-through after conversion, with smooth semi-transparent edges intact.",
      },
      {
        title: "Some older software still rejects WebP",
        body: "All modern browsers open WebP, but a few older editors, upload forms and social platforms still refuse it. If the file is headed somewhere with unknown software, send a JPG or PNG instead.",
      },
    ],
    betterChoice:
      "For web pages, WebP is usually the best of both worlds: smaller than JPG and PNG with transparency intact. For files you send to other people or open in older software, PNG remains the safest choice, and for maximum compatibility with no transparency needs, JPG is the fallback.",
    faqs: [
      {
        question: "Does WebP keep my PNG's transparent background?",
        answer:
          "Yes. WebP supports a full alpha channel, so transparent pixels stay transparent and soft edges such as shadows and glows keep their smooth falloff. That is the key advantage over JPG, which would flatten the same image onto a solid colour.",
      },
      {
        question: "When should I keep the PNG instead of converting to WebP?",
        answer:
          "Keep the PNG when the file is a master for further editing, when it is headed to older software or a platform that rejects WebP, or when it contains tiny text that must stay pixel sharp. WebP wins on file size for web use; PNG wins on universal compatibility and lossless editing.",
      },
    ],
  },
  "jpg-to-webp": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from JPG to WebP",
    example: [
      "Take a typical 4000 x 3000 phone photo that is about 4 MB as JPG. Converted to WebP at the tool's default quality of 92, the same photo typically lands around 2.5 to 3 MB, roughly a quarter to a third smaller, because WebP compresses more efficiently than JPG at similar visual quality. The saving is real but modest, since the JPG was already compressed; the dramatic savings come from PNG to WebP, not from JPG. These are typical figures, not measurements.",
    ],
    edgeCases: [
      {
        title: "This is a second lossy generation",
        body: "JPG already discarded detail, and WebP discards a little more. At quality 92 the extra loss is hard to see on photos, but avoid chaining conversions: always convert from the best JPG you have, and never convert back and forth repeatedly.",
      },
      {
        title: "No transparency is invented",
        body: "JPG pixels are all opaque, so the WebP is opaque too. WebP supports transparency, but conversion cannot create a see-through background from a photo that never had one.",
      },
      {
        title: "Check the destination accepts WebP",
        body: "Modern browsers all open WebP, but some older editors, print services and upload forms still reject it. For files sent to unknown recipients, the original JPG remains the safer choice.",
      },
    ],
    betterChoice:
      "Convert to WebP when the image is headed to a website, where the size saving speeds up page loads. Keep the JPG when the file is headed to people, printers or older software, where universal compatibility matters more than a smaller file.",
    faqs: [
      {
        question: "What quality setting should I use when converting JPG to WebP?",
        answer:
          "Stay near the tool's default of 92 for photos you will display at full size: it keeps the image visually clean while still cutting roughly a quarter to a third off the JPG. Drop to around 80 for thumbnails or chat sharing, where the smaller file matters more than fine detail, and avoid going below 70 for anything user facing, since blockiness shows up first in skies and skin.",
      },
      {
        question: "Will everyone be able to open the WebP file?",
        answer:
          "Almost everyone on a modern browser, but not quite everyone everywhere. WebP support: all modern browsers, while some older editors, print services and upload forms still reject it. For your own website WebP is fine; for files you send to other people, the JPG is still the safer choice.",
      },
    ],
  },
  "svg-to-png": {
    exampleHeading: "Worked example: a logo from SVG to PNG",
    example: [
      "Take a typical logo SVG declared at 512 x 512 pixels. Rasterised to PNG at that size, the result is usually a few tens of kilobytes for a flat logo with few colours, and a few hundred kilobytes for a detailed illustration with gradients and texture. The PNG size depends on the pixel dimensions you render at and the complexity of the artwork, not on the SVG file size: a tiny 3 KB SVG of a complex illustration can produce a large PNG at print dimensions.",
      "The key decision is the output size, because the PNG is fixed pixels. Render at the largest size you plan to display: a 512 pixel PNG stretched to 2000 pixels on a banner looks soft, while a 2000 pixel PNG scaled down for a web page still looks sharp.",
    ],
    edgeCases: [
      {
        title: "The tool renders at the SVG's declared size and never upscales",
        body: "The PNG comes out at the pixel size the SVG declares, and the Resize fields in the tool can only shrink it, keeping the aspect ratio. If you need a bigger PNG, export the SVG at a bigger size first (or re-save it with larger width and height), because enlarging the PNG afterwards only stretches pixels.",
      },
      {
        title: "Text needs its font, or an outline",
        body: "SVG text is rendered with the fonts available in the browser doing the conversion. An uncommon or brand font that is not installed may be substituted with a fallback, changing the look. For exact results, convert text to outlines in a design tool before converting.",
      },
      {
        title: "External images and stylesheets are not loaded",
        body: "Browsers rasterise an SVG in isolation for security, so linked images, external stylesheets and web fonts referenced from inside the file do not load. Embed images and styles in the SVG itself if the PNG comes out missing parts.",
      },
    ],
    betterChoice:
      "Keep the SVG for anything that must scale, such as website logos and icon sets: it stays sharp at every size and is usually smaller. Export PNG only for platforms that reject SVG, such as social posts, slide decks, email signatures and app stores, and export at the exact pixel size each platform needs.",
    faqs: [
      {
        question: "Does the PNG keep the SVG's transparency?",
        answer:
          "Yes. Transparent areas of the SVG stay transparent in the PNG, because PNG carries a full alpha channel. The PNG target has no background fill step, so empty areas of your artwork remain genuinely see-through for overlays, slides and stickers.",
      },
      {
        question: "What size PNG should I export for social media and slides?",
        answer:
          "Export at the exact size the platform displays: 1080 x 1080 pixels for square posts, 1080 x 1920 for stories, 1200 x 628 for link previews, and 1920 x 1080 for full slide images. Because the PNG is rendered from the vector at the size you choose, exporting at the final size keeps edges crisp instead of relying on the platform to resize it.",
      },
    ],
  },
  "webp-to-jpg": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from WebP to JPG",
    example: [
      "Take a typical 4000 x 3000 photo saved as a lossy WebP of about 2.5 MB. Converted to JPG at the tool's default quality of 92, the same photo typically lands around 3 to 4 MB, roughly the same size or a little larger, because JPG compresses less efficiently than WebP. Expect growth, not savings: this conversion is about compatibility, since JPG opens everywhere while WebP still meets resistance in older software. These are typical figures, not measurements.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened onto a background you choose",
        body: "JPG has no alpha channel, so see-through areas of the WebP become the background colour you pick in the tool above (white by default). Semi-transparent shadows blend onto that colour rather than staying soft and see-through.",
      },
      {
        title: "Animated WebP becomes a single still frame",
        body: "Only the first frame of an animated WebP survives as JPG. If the motion matters, keep the WebP.",
      },
      {
        title: "Colour profiles and camera data do not carry over",
        body: "The converter re-encodes pixels only, so an embedded colour profile and any EXIF data are not copied into the JPG. Colours are decoded by the browser and written as a standard JPG, which is fine for sharing but not for colour critical print work.",
      },
    ],
    betterChoice:
      "If the destination accepts WebP, keep the WebP: it is smaller and keeps transparency. Convert to JPG only when compatibility demands it, such as an older editor, a print service or an upload form that rejects WebP. If the image has text or transparency and must stay sharp, PNG is the better target than JPG.",
    faqs: [
      {
        question: "Can I convert a WebP screenshot with text to JPG without blur?",
        answer:
          "Mostly, if you keep quality high. JPG compression softens sharp text and line art before it touches photos, so stay at quality 90 or above for screenshots, and check small text at full zoom before downloading. If the text must stay pixel sharp, or the screenshot has transparency, convert to PNG instead: it is lossless and keeps edges exact.",
      },
      {
        question: "Should I convert my WebP logo to JPG or PNG?",
        answer:
          "PNG, if the logo has transparency or sharp edges: JPG flattens transparency onto a solid colour and softens edges, while PNG keeps both exactly. Choose JPG only for photographic WebP images headed somewhere that rejects WebP.",
      },
    ],
  },
};

/** Deep dive for this pair's page, or null when the pair has none. */
export function pairDeepDive(route: ConversionRoute): PairDeepDive | null {
  return PAIR_DEEP_DIVES[route.slug] ?? null;
}

/**
 * Two "formats in depth" paragraphs (strengths, limits, where each format
 * is actually encountered), used in the format-guide section.
 */
export function pairFormatProfiles(route: ConversionRoute): string[] {
  const f = analysePair(route);
  const { fromLabel: F, toLabel: T } = f;
  const join = (items: string[]) =>
    items.map((s) => s.charAt(0).toLowerCase() + s.slice(1)).join("; ");
  return [
    `Working with ${F}: its strengths are ${join(f.fp.strengths)}. The trade-offs are ${join(f.fp.weaknesses)}. In the real world you will run into ${F} in these places: ${f.fp.support.toLowerCase()}.`,
    `Working with ${T}: its strengths are ${join(f.tp.strengths)}. The trade-offs are ${join(f.tp.weaknesses)}. In the real world you will run into ${T} in these places: ${f.tp.support.toLowerCase()}.`,
  ];
}
