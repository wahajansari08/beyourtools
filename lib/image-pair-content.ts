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
  "gif-to-png": {
    exampleHeading: "Worked example: a 480 x 270 GIF still from GIF to PNG",
    example: [
      "Take a typical 480 x 270 GIF still, the kind used for a reaction image or a small icon. GIF stores at most 256 colours per frame, and the converter decodes the GIF in the browser, which keeps only the first frame, so an animated GIF becomes one still image. A flat-colour GIF still of this size typically weighs roughly 20 to 60 KB. As PNG, the same still typically lands in a similar range, often a little smaller for flat graphics because PNG compression is more efficient, and the PNG keeps the exact pixels with no further loss. For a photo-like GIF the PNG can be larger, because the GIF's palette already threw away colour detail and PNG stores every pixel losslessly. These are typical figures, not measurements.",
      "The gain is not size but fidelity going forward. The PNG can be edited and re-saved without another round of loss, and it opens in every editor, while the GIF's 256-colour palette is a dead end for editing. If the still will be edited again, the PNG is the better master to keep.",
    ],
    edgeCases: [
      {
        title: "Animation is lost; only the first frame survives",
        body: "The browser decodes a GIF as a single still image, so a 4-second animation at 10 frames a second, 40 frames in total, becomes one frame. If the motion matters, keep the GIF.",
      },
      {
        title: "No colours are recovered",
        body: "A GIF holds at most 256 colours per frame, and converting to PNG cannot put back the colours the palette dropped. A photo GIF keeps its banding and its flat gradients exactly as they were.",
      },
      {
        title: "Transparency stays, but hard edges stay hard",
        body: "GIF transparency is on or off per pixel, so the PNG keeps the transparent pixels transparent, but a hard GIF edge stays hard. No new semi-transparency is created, so a feathered edge will not smooth out in the conversion.",
      },
    ],
    betterChoice:
      "If the still has no transparency and you want the smallest file, convert to JPG instead: at the default quality of 92 it is typically much smaller than either the GIF or the PNG for photo-like images. If the animation matters, keep the GIF, because no conversion on this site preserves it.",
    faqs: [
      {
        question: "Will an animated GIF keep animating after converting to PNG?",
        answer:
          "No. PNG has no animation, outside the rarely used APNG variant, and the converter keeps only the first frame of the GIF. If you need the motion, keep the GIF, or pull the frames out with a dedicated GIF tool.",
      },
      {
        question: "Does converting a GIF to PNG improve the quality?",
        answer:
          "No. If the GIF used fewer than 256 colours, the pixels are identical, and if the palette already dropped colours, the PNG cannot recover them. What the PNG gives you is a lossless master that will not degrade further when you edit and re-save it.",
      },
      {
        question: "Is the PNG smaller than the GIF?",
        answer:
          "For flat graphics, logos, and screenshots, usually yes or about the same, because PNG compression is more efficient than GIF's. For photo-like GIFs the PNG can be larger. Either way the difference is small next to the compatibility gain: PNG opens in every editor.",
      },
    ],
  },
  "bmp-to-jpg": {
    exampleHeading: "Worked example: a 4000 x 3000 BMP photo from BMP to JPG",
    example: [
      "A 24-bit BMP stores 3 bytes for every pixel and almost no compression, so a 4000 x 3000 photo is 36.0 MB before the header is even counted. Converted to JPG at the tool's default quality of 92, the same photo typically lands around 2 to 4 MB, roughly a tenth of the BMP, with no visible difference at normal viewing sizes. Drop the quality to 80 and it often falls below 2 MB. These are typical figures for a detailed photo, not measurements.",
      "The saving scales with size: a 1920 x 1080 BMP is 6.22 MB and typically becomes roughly 400 to 800 KB as JPG. That is why BMPs from old Windows software, scanners, and industrial cameras are worth converting before emailing or uploading. The BMP is ten times the file for the same picture.",
    ],
    edgeCases: [
      {
        title: "JPG is lossy, so keep a master",
        body: "Every JPG save discards a little detail, and re-saving the JPG again loses a little more. Keep the BMP, or convert to PNG once, as the master if you plan to edit the image again.",
      },
      {
        title: "BMP has no transparency to lose",
        body: "BMP stores no alpha channel, so nothing about transparency changes in the conversion. The only choice that matters is the JPG quality.",
      },
      {
        title: "Unusual BMPs may not decode",
        body: "The browser decodes the common 24-bit BMP flavour. Rare variants, such as 32-bit or RLE-compressed BMPs from old software, may fail to load, in which case the tool reports that the image could not be decoded.",
      },
    ],
    betterChoice:
      "If the image is a screenshot, logo, or anything with text and sharp edges, convert to PNG instead: JPG softens hard edges, while PNG keeps them exact. JPG is the right target for photographs and other smooth images.",
    faqs: [
      {
        question: "Why is my BMP file so big?",
        answer:
          "A 24-bit BMP stores 3 bytes per pixel with almost no compression: a 4000 x 3000 photo is 36 MB, and a 1920 x 1080 screenshot is 6.22 MB. JPG compresses the same picture to roughly a tenth of that size.",
      },
      {
        question: "Will the JPG look worse than the BMP?",
        answer:
          "At the default quality of 92, no visible difference for photographs at normal viewing sizes. Text and thin lines soften first, so keep quality at 90 or above for screenshots, or use PNG for anything with text.",
      },
      {
        question: "What quality should I pick?",
        answer:
          "92, the default, for sharing and archiving; 80 when the file must fit an email or upload limit; 90 or above when the image has text. Below 80, artefacts start to show in skies and gradients.",
      },
    ],
  },
  "png-to-avif": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from PNG to AVIF",
    example: [
      "Take a 4000 x 3000 phone photo saved as PNG at around 10 to 14 MB. As JPG at the tool's default quality of 92 it typically lands around 2 to 4 MB. As AVIF at the same quality setting it typically lands around 1 to 2 MB, roughly half the JPG and roughly a tenth of the PNG, because AVIF compresses about 40 to 60 percent smaller than JPEG at matched quality. These are typical figures, not measurements: a noisy low light shot compresses worse, and a simple graphic compresses far better.",
      "AVIF also keeps the PNG's transparency, so a logo or icon with a see-through background converts without the flattening that JPG forces. That combination, smaller than JPG and transparent like PNG, is the reason to pick AVIF for web images.",
    ],
    edgeCases: [
      {
        title: "AVIF encoding is slow",
        body: "AVIF compression is compute heavy, roughly 5 to 20 times slower to encode than WebP. A large photo can take several seconds in the browser, which is normal, not a failure.",
      },
      {
        title: "Older browsers and apps may not open AVIF",
        body: "AVIF support is broad in current browsers but not universal in older software. If the file must open anywhere, WebP or JPG is the safer target.",
      },
      {
        title: "If your browser cannot encode AVIF, you get a WebP",
        body: "The tool tries AVIF first and falls back to WebP when the browser has no AVIF encoder, and it tells you in a warning. Check the downloaded file's extension before you share it.",
      },
    ],
    betterChoice:
      "If the image must open in older editors or upload forms that reject AVIF, convert to WebP instead: it is the same idea, smaller than JPG with transparency kept, and it opens almost everywhere. For maximum compatibility of all, JPG is still the safe choice.",
    faqs: [
      {
        question: "Is AVIF smaller than WebP?",
        answer:
          "Typically yes, by about a fifth at matched quality. In matched-quality benchmarks AVIF runs about 37 percent smaller than JPEG while WebP runs about 22 percent smaller, so AVIF lands roughly 19 percent smaller than WebP. The gap is worth it for web images and not worth it when compatibility matters.",
      },
      {
        question: "Why does the conversion take so long?",
        answer:
          "AVIF encoding is far more compute heavy than JPG or WebP, so a large photo can take several seconds in the browser. The wait is the encoder working, and the file is smaller for it.",
      },
      {
        question: "Does AVIF keep transparency?",
        answer:
          "Yes. AVIF supports an alpha channel, so a transparent PNG stays transparent after conversion, unlike JPG, which flattens transparency onto a solid colour.",
      },
    ],
  },
  "jpg-to-avif": {
    exampleHeading: "Worked example: a 3 MB JPG photo from JPG to AVIF",
    example: [
      "Take a typical 4000 x 3000 phone photo saved as JPG at about 3 MB. Converted to AVIF at the same quality setting it typically lands around 1.2 to 1.8 MB, roughly 40 to 60 percent smaller, because AVIF compresses far more efficiently than JPEG at matched quality. These are typical figures, not measurements: a noisy photo saves less, a clean studio shot saves more.",
      "The saving comes with a warning. No quality is gained: the AVIF is a re-encode of the JPG's pixels, artefacts included, so a blocky sky stays blocky. What AVIF gives you is the same picture in a smaller file, not a better picture.",
    ],
    edgeCases: [
      {
        title: "The AVIF carries no EXIF data",
        body: "The converter re-encodes pixels only, so the location, camera, and date information in the JPG is not copied into the AVIF. That is good for sharing, since location data is gone, but keep the original JPG if you need the metadata.",
      },
      {
        title: "Encoding is slow on large photos",
        body: "AVIF is compute heavy, so a 4000 x 3000 photo can take several seconds to encode in the browser. That is normal, not a failure.",
      },
      {
        title: "If your browser cannot encode AVIF, you get a WebP",
        body: "The tool tries AVIF first and falls back to WebP when the browser has no AVIF encoder, and it tells you in a warning. Check the downloaded file's extension before you share it.",
      },
    ],
    betterChoice:
      "If the file must open everywhere, keep the JPG: AVIF still meets resistance in older software. If it must be as small as possible and stay compatible with current browsers, AVIF is the pick, with WebP as the middle ground.",
    faqs: [
      {
        question: "Will converting JPG to AVIF make my photo sharper?",
        answer:
          "No. The AVIF is a re-encode of the same pixels, so JPG artefacts are copied faithfully. It stops further loss and shrinks the file, but it cannot clean the image up.",
      },
      {
        question: "How much smaller is AVIF than JPG?",
        answer:
          "Typically 40 to 60 percent smaller at matched quality: a 3 MB JPG usually becomes about 1.2 to 1.8 MB as AVIF. The exact saving depends on the photo.",
      },
      {
        question: "Can I convert AVIF back to JPG?",
        answer:
          "Yes, the AVIF to JPG converter works the same way, but each round trip re-encodes and loses a little. Keep the original JPG as the master and convert copies for sharing.",
      },
    ],
  },
  "gif-to-webp": {
    exampleHeading: "Worked example: a 480 x 270 GIF still from GIF to WebP",
    example: [
      "Take a 480 x 270 GIF still, the kind used for a reaction image or a small icon. A flat-colour GIF of that size typically weighs roughly 20 to 60 KB. Converted to WebP at the tool's default quality of 92, the same still typically lands smaller, often by a fifth to a third, because WebP compresses more efficiently than GIF's palette scheme, and the WebP keeps the transparency. These are typical figures, not measurements: flat graphics save the least, photo-like stills save the most.",
      "The trade is the animation. The browser decodes the GIF as a single still image, so a 4-second animation at 10 frames a second, 40 frames in total, becomes one frame. If the motion is the point of the file, this conversion is the wrong one.",
    ],
    edgeCases: [
      {
        title: "Animation is lost; only the first frame survives",
        body: "The browser decodes a GIF as a single still image, so the WebP is a still image too. Animated WebP needs a dedicated tool that encodes every frame.",
      },
      {
        title: "The 256-colour limit stays",
        body: "A GIF holds at most 256 colours per frame, and the WebP starts from those colours. Banding in gradients and flat skies survives the conversion.",
      },
      {
        title: "Transparency is kept",
        body: "GIF transparency is on or off per pixel, and WebP supports an alpha channel, so transparent pixels stay transparent. Hard edges stay hard, because no new semi-transparency is created.",
      },
    ],
    betterChoice:
      "If the GIF is animated and the motion matters, keep the GIF: no conversion on this site preserves the animation. If you need a lossless still for editing, convert to PNG instead. WebP is the pick when you want the smallest single still that keeps transparency.",
    faqs: [
      {
        question: "Does the WebP keep animating?",
        answer:
          "No. The converter keeps only the first frame, so the WebP is a still image. Animated WebP needs a dedicated GIF to WebP tool that encodes every frame with its timing.",
      },
      {
        question: "Is WebP smaller than GIF?",
        answer:
          "Usually, for photo-like stills, by roughly a fifth to a third at the default quality of 92. For flat graphics with few colours, the two are close, because GIF's palette is already efficient there.",
      },
      {
        question: "What quality does the tool use for WebP?",
        answer:
          "The default quality is 92, the same as for JPG. Lower it toward 80 for a smaller file when the still is only being shared, and keep it at 90 or above when the image has text.",
      },
    ],
  },
  "bmp-to-png": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from BMP to PNG",
    example: [
      "Take a typical 4000 x 3000 photo saved as BMP. A BMP stores every pixel uncompressed at 3 bytes each, so the file weighs 36.0 MB. Converted to PNG, the same photo typically lands around 10 to 14 MB, roughly a third of the BMP, because PNG compresses losslessly instead of storing every pixel raw. Nothing about the picture changes: the PNG holds exactly the same pixels. These are typical figures, not measurements: a noisy photo compresses worse, a clean studio shot better.",
      "The saving is far bigger for flat graphics. A screenshot or diagram saved as BMP is mostly solid colour, and PNG compresses solid areas extremely well, so a 36 MB BMP of flat graphics can come back as a PNG of only a few megabytes. If the BMP came from a scanner or a paint program, PNG is almost always the better file to keep.",
    ],
    edgeCases: [
      {
        title: "BMP has no transparency to keep",
        body: "BMP files are opaque, so the PNG is opaque too. Converting to PNG cannot add a transparent background that was not in the BMP, and removing a background is an editing job, not a conversion.",
      },
      {
        title: "Rare BMP variants may fail to decode",
        body: "Most BMPs are plain 24-bit files and convert without trouble. Rare 32-bit BMPs with an alpha channel and old run-length encoded BMPs may fail to decode in the browser, in which case the tool reports that the format is not supported. Opening the file in an editor and re-saving it as a plain 24-bit BMP fixes it.",
      },
      {
        title: "No quality setting, because nothing is lost",
        body: "PNG is lossless, so there is no quality slider to tune: the output is simply the decoded pixels, stored exactly. The only choice that matters is the source file itself, and keeping the BMP as a master is pointless once the PNG exists, since the PNG holds the same pixels in a third of the space.",
      },
    ],
    betterChoice:
      "If the image is a photo headed for the web or an upload form, convert to JPG instead: it is typically 2 to 4 MB for the same 4000 x 3000 photo, far smaller than the PNG. Keep PNG when the image must stay pixel exact for editing, or when it is a screenshot, diagram, or logo with text.",
    faqs: [
      {
        question: "Why is my BMP file so large compared to the PNG?",
        answer:
          "A BMP stores every pixel uncompressed, 3 bytes per pixel, so a 4000 x 3000 photo is 36.0 MB before anything is done to it. PNG compresses the same pixels losslessly, typically to around a third of that size for a photo and far less for flat graphics, with no pixel changed.",
      },
      {
        question: "Does converting BMP to PNG lose quality?",
        answer:
          "No. PNG is a lossless format, so the PNG holds exactly the same pixels as the BMP. The file gets smaller purely because PNG compresses the pixel data instead of storing it raw. You can convert back and forth between BMP and PNG as often as you like with no drift.",
      },
    ],
  },
  "svg-to-jpg": {
    exampleHeading: "Worked example: a logo SVG rasterised to JPG",
    example: [
      "Take a simple two-colour logo saved as SVG, about 8 KB of vector shapes. SVG has no pixels, so the tool first rasterises it at the size you choose, then encodes the result as JPG. Rasterised at 2000 x 2000, that logo typically lands around 50 to 150 KB as a JPG at the tool's default quality of 92, because large flat areas compress very efficiently. A detailed illustration with gradients and fine lines at the same size typically lands around 300 to 600 KB. These are typical figures, not measurements: the output size is set by the raster size you pick and the detail in the artwork, not by the size of the SVG file.",
      "The key choice is the raster size. Rasterise at the size the JPG will actually be shown, because a 2000-pixel logo shrunk to a 200-pixel thumbnail wastes most of its bytes, and a 500-pixel raster stretched to a poster turns blurry. The tool's resize option sets the output dimensions before encoding, so pick the display size first.",
    ],
    edgeCases: [
      {
        title: "Text in the SVG becomes pixels",
        body: "Once rasterised, the text in an SVG is no longer text: it cannot be selected, searched, or edited. If the JPG is headed to a document where the words matter, keep the SVG as well, or rasterise at a high resolution so the text stays readable.",
      },
      {
        title: "Transparency is flattened, not kept",
        body: "JPG has no alpha channel, so see-through areas become the background colour you pick in the tool above (white by default). A logo on a transparent background needs its background colour matched to the page it will sit on, or it ends up with a visible box.",
      },
      {
        title: "Fonts inside the SVG may fall back",
        body: "An SVG that names a font your device does not have is rendered with a fallback font, so the JPG can look different from the SVG in its home editor. Converting text to outlines in the editor before exporting the SVG avoids the problem entirely.",
      },
    ],
    betterChoice:
      "If the destination accepts SVG, keep the SVG: it stays sharp at every size and is usually the smallest file. If the file needs transparency or a lossless master, convert to PNG instead of JPG. For email clients, social media, and upload forms that refuse SVG, JPG is the safe choice.",
    faqs: [
      {
        question: "What size should I rasterise my SVG at?",
        answer:
          "Rasterise at the size the JPG will actually be shown. A logo for a website header is usually fine at 1000 to 2000 pixels wide; a social media post wants the platform's exact size, such as 1080 pixels wide for Instagram. Rasterising larger only makes a bigger file, and rasterising smaller then stretching it makes a blurry one.",
      },
      {
        question: "Will the JPG look as sharp as the SVG?",
        answer:
          "At the size you rasterise it, yes, for all practical purposes at quality 90 or above. The difference is that the JPG is fixed at that size: zoom past it and it softens, while the SVG stays sharp at any zoom. For text-heavy artwork, keep quality at 90 or above, or use PNG.",
      },
    ],
  },
  "avif-to-png": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from AVIF to PNG",
    example: [
      "Take a typical 4000 x 3000 photo saved as AVIF at about 1.5 MB. AVIF is the most efficient format browsers support, so the same photo as JPG at the tool's default quality of 92 is typically around 3 to 4 MB. Converted to PNG, it typically grows to around 10 to 16 MB, roughly 3 to 5 times larger than the JPG and about ten times the AVIF, because PNG stores every decoded pixel losslessly instead of discarding fine detail. Nothing about the picture improves: the PNG is a pixel exact copy of the AVIF, artefacts included. These are typical figures, not measurements: a noisy photo grows more, a clean studio shot grows less.",
      "That growth is the price of a format every editor can open and re-save without further loss. It is worth paying when the PNG is a working master for editing, and a waste when the file is only being shared, where the original AVIF was already the smaller, sharper choice.",
    ],
    edgeCases: [
      {
        title: "No quality is gained, only preserved",
        body: "AVIF artefacts baked into the source, such as softness in fine detail, are copied faithfully into the PNG. Converting to PNG stops further loss, but it cannot clean the image up.",
      },
      {
        title: "Animated AVIF becomes a single still frame",
        body: "AVIF can hold an image sequence, but PNG is a still format, so only the first frame survives. If the motion matters, keep the AVIF or convert to a format that supports animation.",
      },
      {
        title: "Wide colour and HDR are narrowed to standard colour",
        body: "AVIF can hold up to 12-bit colour with HDR; PNG here holds 8 bits in standard colour. Vivid HDR highlights and very smooth gradients can flatten or band slightly after conversion, though at normal viewing most people cannot see it.",
      },
    ],
    betterChoice:
      "If the destination accepts AVIF, keep the AVIF: it is smaller and loses nothing in this direction. If the goal is a smaller file for sharing, convert to JPG instead of PNG. Convert to PNG only when you need a lossless editing master, transparency, or compatibility with an editor that refuses AVIF.",
    faqs: [
      {
        question: "Does the PNG keep my AVIF image's transparency?",
        answer:
          "Yes. Both formats carry a full alpha channel, so transparent areas stay transparent with no background fill and no halo around cut-out edges. If your AVIF is fully opaque, the PNG is opaque too; conversion cannot add transparency that was not there.",
      },
      {
        question: "Why is the PNG so much bigger than the AVIF?",
        answer:
          "AVIF is a modern lossy format that discards fine detail the eye barely notices, while PNG stores every decoded pixel exactly. The same 4000 x 3000 photo that is about 1.5 MB as AVIF is typically 10 to 16 MB as PNG. The PNG is bigger because it refuses to throw anything away, not because it holds a better picture.",
      },
    ],
  },
  "webp-to-avif": {
    exampleHeading: "Worked example: a 2400-pixel photo from WebP to AVIF",
    example: [
      "Take a typical 2400-pixel-wide photo saved as WebP at about 570 KB, the size our own format comparison measured for that resolution. Converted to AVIF at the tool's default quality of 92, the same photo typically lands around 410 KB, about 28 percent smaller, because AVIF compresses more efficiently than WebP at similar quality. Resolution does not change, and the picture looks the same at normal viewing sizes. These are typical figures, not measurements: a detailed scene saves less, a plain one saves more.",
      "The saving is real but modest, which is the honest shape of this conversion. WebP is already efficient, so the jump to AVIF is a refinement, not a transformation like PNG to JPG. It is worth doing when every kilobyte counts, such as a hero image on a slow connection, and not worth the effort for a one-off share.",
    ],
    edgeCases: [
      {
        title: "Encoding is slow, and older browsers fall back to WebP",
        body: "AVIF encoding is 5 to 20 times slower than WebP, so a large image can take a noticeable moment to convert. If the browser cannot encode AVIF at all, the tool saves a WebP instead and says so in a warning, so check the downloaded file's extension before uploading it somewhere that expects AVIF.",
      },
      {
        title: "Animated WebP becomes a single still frame",
        body: "The browser decodes a WebP as a single still image, so only the first frame survives. AVIF can hold an image sequence, but this converter does not encode one. If the motion matters, keep the WebP.",
      },
      {
        title: "Transparency survives, but there is no quality slider for it",
        body: "WebP and AVIF both carry a full alpha channel, so cut-out logos and icons stay cut out. The quality setting still applies to the colour data, so a logo with text wants quality 90 or above, just as it does for JPG.",
      },
    ],
    betterChoice:
      "If the destination accepts AVIF and the file is served to many people, AVIF is the better choice: it is smaller at the same quality. If the destination is an editor, an upload form, or an older device, keep the WebP, which opens almost everywhere AVIF does not yet. For a one-off share, the saving is rarely worth the slower encode.",
    faqs: [
      {
        question: "How much smaller is AVIF than WebP?",
        answer:
          "Typically around a quarter smaller at similar quality. A 2400-pixel photo that is about 570 KB as WebP is typically around 410 KB as AVIF, a saving of about 28 percent. The gap is wider on detailed photos and narrower on flat graphics, where WebP is already efficient.",
      },
      {
        question: "Why did I get a WebP file instead of an AVIF?",
        answer:
          "Your browser cannot encode AVIF, so the tool saved a WebP instead and showed a warning saying so. AVIF encoding needs a recent browser version: Chrome 85 or later, Edge 121 or later, Firefox 93 or later, or Safari 16 or later. Try a newer browser, or keep the WebP, which is nearly as small.",
      },
    ],
  },
  "jpg-to-pdf": {
    exampleHeading: "Worked example: ten JPG photos into one PDF",
    example: [
      "Take ten photos, each a 4000 x 3000 JPG of about 3 MB. Converted to PDF, each photo becomes one page, and the image on that page is the photo re-encoded as a JPEG at quality 92, so the finished PDF typically lands around 25 to 30 MB, close to the size of the JPGs you started with plus a few kilobytes of PDF structure. Nothing is downsampled: the PDF holds the photos at their full pixel size. These are typical figures, not measurements: photos that were already heavily compressed come back slightly smaller, clean high quality ones stay near their original size.",
      "The page size follows the image, not a paper size. A 4000-pixel-wide photo becomes a page about 1,058 mm wide at the tool's 96 DPI mapping, roughly five A4 widths, so the PDF is a set of very large pages that a printer scales down to fit. That is fine for viewing and sharing, and it is the reason to shrink oversized photos with the image resizer before converting if the PDF is meant to be printed.",
    ],
    edgeCases: [
      {
        title: "Text in the photos is not selectable",
        body: "A JPG holds pixels, not text, so words photographed or screenshotted in the image stay as pixels in the PDF. There is no text layer and no OCR, so the PDF cannot be searched and its text cannot be copied. For a document whose words matter, use a real PDF creator instead.",
      },
      {
        title: "Camera data does not carry over",
        body: "The converter re-encodes pixels only, so EXIF data such as camera settings, dates, and GPS tags does not survive in the PDF. Keep the original JPGs if that data matters.",
      },
      {
        title: "One image means one page, in the order you add them",
        body: "Each JPG becomes its own page, so ten images make ten pages. Add them in the order you want the pages to appear, because there is no reorder step after conversion. For a different page order, convert again with the images in the right order.",
      },
    ],
    betterChoice:
      "If the goal is a real document with selectable text, use the PDF tools instead: build the document from text, or convert a Word file. If the goal is sharing photos as a single file, this conversion is the right one, but shrink the photos first when the PDF is meant to be emailed or printed at A4.",
    faqs: [
      {
        question: "How big will the PDF be compared to my JPGs?",
        answer:
          "Close to the same size. Each photo is re-encoded as a JPEG at quality 92 and placed on its own page, so ten 3 MB JPGs typically make a PDF of around 25 to 30 MB. The PDF adds only a few kilobytes of structure per page. If the PDF must be smaller, shrink the JPGs with the image resizer before converting.",
      },
      {
        question: "Can I convert PNG images to PDF this way?",
        answer:
          "Not on this page: the image converter route takes JPG, PNG, WebP, AVIF, GIF, BMP, and SVG as sources, but the dedicated JPG to PDF tool in the PDF tools section accepts JPG and JPEG files only. For PNG images, use the separate PNG to PDF tool, which works the same way, one page per image.",
      },
    ],
  },
  "png-to-bmp": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from PNG to BMP",
    example: [
      "Take a typical 4000 x 3000 photo saved as PNG, around 10 to 14 MB. A BMP stores every pixel uncompressed at 3 bytes each, so the same photo as BMP weighs 36.0 MB, more than twice the PNG and roughly ten times the JPG the same photo would be. Nothing about the picture changes: the BMP holds exactly the same pixels, only stored raw instead of compressed. These are typical figures, not measurements: a noisy photo makes a larger PNG, a clean studio shot a smaller one, but the BMP is always 36.0 MB for this pixel size, because uncompressed means uncompressed.",
      "The size is set by the pixel dimensions alone. A 1920 x 1080 photo becomes a BMP of 6.22 MB, and a 1080 x 1080 square becomes 3.50 MB, whatever the photo shows. That is why BMP is a format you convert to only when a program demands it, never as a way to store photos.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened, not kept",
        body: "PNG can hold see-through areas, but BMP here is 24-bit with no alpha channel, so transparent pixels are flattened onto the background colour you pick in the tool above (white by default). A logo on a transparent background needs its background colour matched to where it will sit, or it ends up with a visible box.",
      },
      {
        title: "No quality setting, because nothing is lost",
        body: "BMP is uncompressed, so there is no quality slider to tune: the output is simply the decoded pixels, stored exactly. The only choice that matters is whether the destination really needs BMP, because the file is always far larger than the PNG you started with.",
      },
      {
        title: "The BMP is bigger than the PNG, always",
        body: "Converting to BMP never saves space. It exists for old software, embedded systems, and a few Windows programs that only read BMP. If the file is headed for the web, an email, or an upload form, keep the PNG or convert to JPG instead.",
      },
    ],
    betterChoice:
      "If the destination accepts PNG, keep the PNG: it holds the same pixels in a third of the space and keeps transparency. If the file must be small, convert to JPG instead: it is typically 2 to 4 MB for the same 4000 x 3000 photo. Convert to BMP only when a specific program refuses anything else.",
    faqs: [
      {
        question: "Why is the BMP so much bigger than the PNG?",
        answer:
          "A BMP stores every pixel uncompressed, 3 bytes per pixel, so a 4000 x 3000 photo is 36.0 MB before anything is done to it. PNG compresses the same pixels losslessly, typically to around a third of that size for a photo and far less for flat graphics, with no pixel changed.",
      },
      {
        question: "Does converting PNG to BMP lose quality?",
        answer:
          "No, the pixels are identical: BMP is uncompressed, so nothing is discarded. The only thing lost is transparency, which is flattened onto the background colour you pick. You can convert back and forth between PNG and BMP as often as you like with no drift in the visible pixels.",
      },
    ],
  },
  "jpg-to-bmp": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from JPG to BMP",
    example: [
      "Take a typical 4000 x 3000 photo saved as JPG at the tool's default quality of 92, around 3 MB. A BMP stores every pixel uncompressed at 3 bytes each, so the same photo as BMP weighs 36.0 MB, about twelve times the JPG. Nothing about the picture improves: the BMP is a pixel exact copy of the JPG, compression artefacts included, only stored raw instead of compressed. These are typical figures, not measurements: a noisy photo makes a larger JPG, a clean studio shot a smaller one, but the BMP is always 36.0 MB for this pixel size.",
      "The size is set by the pixel dimensions alone. A 1920 x 1080 photo becomes a BMP of 6.22 MB, and a 1080 x 1080 square becomes 3.50 MB, whatever the photo shows. That is why BMP is a format you convert to only when a program demands it, never as a way to store photos.",
    ],
    edgeCases: [
      {
        title: "No quality is gained, only preserved",
        body: "JPG artefacts baked into the source, such as softness in fine detail, are copied faithfully into the BMP. Converting to BMP stops further loss, but it cannot clean the image up, and the file is twelve times larger for the privilege.",
      },
      {
        title: "No quality setting, because nothing is lost",
        body: "BMP is uncompressed, so there is no quality slider to tune: the output is simply the decoded pixels, stored exactly. The only choice that matters is whether the destination really needs BMP.",
      },
      {
        title: "The BMP is far bigger than the JPG, always",
        body: "Converting to BMP never saves space. It exists for old software, embedded systems, and a few Windows programs that only read BMP. If the file is headed for the web, an email, or an upload form, keep the JPG.",
      },
    ],
    betterChoice:
      "If the destination accepts JPG, keep the JPG: it holds the same picture in a twelfth of the space. If the file needs transparency or a lossless master, convert to PNG instead of BMP. Convert to BMP only when a specific program refuses anything else.",
    faqs: [
      {
        question: "Why is the BMP so much bigger than the JPG?",
        answer:
          "A BMP stores every pixel uncompressed, 3 bytes per pixel, so a 4000 x 3000 photo is 36.0 MB before anything is done to it. JPG compresses the same pixels with a lossy method, typically to around 3 MB at quality 92 for a photo, with artefacts too small to notice at normal viewing.",
      },
      {
        question: "Does converting JPG to BMP lose quality?",
        answer:
          "No, the pixels are identical: BMP is uncompressed, so nothing is discarded in this step. The artefacts already in the JPG stay, because they are part of the pixels now, but nothing new is added. Converting back to JPG afterwards would add a second round of compression, so keep the original JPG as well.",
      },
    ],
  },
  "webp-to-bmp": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from WebP to BMP",
    example: [
      "Take a typical 4000 x 3000 photo saved as WebP, typically around 1.5 to 3 MB. A BMP stores every pixel uncompressed at 3 bytes each, so the same photo as BMP weighs 36.0 MB, about 12 to 24 times the WebP. Nothing about the picture changes: the BMP holds exactly the same pixels, only stored raw instead of compressed. These are typical figures, not measurements: a noisy photo makes a larger WebP, a clean studio shot a smaller one, but the BMP is always 36.0 MB for this pixel size.",
      "The size is set by the pixel dimensions alone. A 1920 x 1080 photo becomes a BMP of 6.22 MB, and a 1080 x 1080 square becomes 3.50 MB, whatever the photo shows. That is why BMP is a format you convert to only when a program demands it, never as a way to store photos.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened, not kept",
        body: "WebP can hold see-through areas, but BMP here is 24-bit with no alpha channel, so transparent pixels are flattened onto the background colour you pick in the tool above (white by default). A logo on a transparent background needs its background colour matched to where it will sit, or it ends up with a visible box.",
      },
      {
        title: "Animated WebP becomes a single still frame",
        body: "WebP can hold an image sequence, but BMP is a still format, so only the first frame survives. If the motion matters, keep the WebP or convert to a format that supports animation.",
      },
      {
        title: "No quality is gained, only preserved",
        body: "WebP artefacts baked into the source are copied faithfully into the BMP. Converting to BMP stops further loss, but it cannot clean the image up, and the file is many times larger for the privilege.",
      },
    ],
    betterChoice:
      "If the destination accepts WebP, keep the WebP: it holds the same pixels in a fraction of the space and keeps transparency. If the file must be small and widely compatible, convert to JPG instead. Convert to BMP only when a specific program refuses anything else.",
    faqs: [
      {
        question: "Why is the BMP so much bigger than the WebP?",
        answer:
          "A BMP stores every pixel uncompressed, 3 bytes per pixel, so a 4000 x 3000 photo is 36.0 MB before anything is done to it. WebP compresses the same pixels efficiently, typically to around 1.5 to 3 MB for a photo of that size, with no visible difference at normal viewing.",
      },
      {
        question: "Does converting WebP to BMP lose quality?",
        answer:
          "No, the pixels are identical: BMP is uncompressed, so nothing is discarded in this step. The only thing lost is transparency, which is flattened onto the background colour you pick, and animation, where only the first frame survives.",
      },
    ],
  },
  "gif-to-bmp": {
    exampleHeading: "Worked example: a 480 x 270 still from GIF to BMP",
    example: [
      "Take a typical 480 x 270 GIF, roughly 20 to 60 KB. A BMP stores every pixel uncompressed at 3 bytes each, so the same still image as BMP weighs 389 KB, about six to nineteen times the GIF. Nothing about the picture changes: the BMP holds exactly the same pixels, only stored raw instead of compressed. These are typical figures, not measurements: a busy GIF with many colours makes a larger file, a simple one a smaller one, but the BMP is always 389 KB for this pixel size.",
      "The size is set by the pixel dimensions alone. A 1920 x 1080 GIF frame becomes a BMP of 6.22 MB, whatever the picture shows. That is why BMP is a format you convert to only when a program demands it, never as a way to store images.",
    ],
    edgeCases: [
      {
        title: "Animation is lost: only the first frame survives",
        body: "A GIF can hold an image sequence, but BMP is a still format, so a 40-frame clip at 10 frames a second becomes a single still image. If the motion matters, keep the GIF or convert to a format that supports animation.",
      },
      {
        title: "No colours are recovered",
        body: "GIF holds at most 256 colours, and converting to BMP cannot add the colours back. The BMP has the same 256-colour palette look as the GIF, only stored uncompressed. A photo saved as GIF stays flat and banded after conversion.",
      },
      {
        title: "Transparency is flattened, not kept",
        body: "GIF transparency is a single transparent colour, not a smooth alpha channel, and BMP has no alpha channel at all, so transparent pixels are flattened onto the background colour you pick in the tool above (white by default). A cut-out GIF needs its background colour matched to where it will sit.",
      },
    ],
    betterChoice:
      "If the GIF is animated, keep the GIF: BMP cannot hold motion. If it is a still image that must stay small, convert to PNG instead: it is lossless, keeps the same pixels, and is typically far smaller than the BMP. Convert to BMP only when a specific program refuses anything else.",
    faqs: [
      {
        question: "Why is the BMP so much bigger than the GIF?",
        answer:
          "A BMP stores every pixel uncompressed, 3 bytes per pixel, so a 480 x 270 still is 389 KB before anything is done to it. GIF compresses the same pixels and holds at most 256 colours, so the same still is typically only 20 to 60 KB.",
      },
      {
        question: "Does converting GIF to BMP keep the animation?",
        answer:
          "No. BMP is a still format, so only the first frame of an animated GIF survives. The BMP is a single still image at the GIF's pixel size. If the motion matters, keep the GIF.",
      },
    ],
  },
  "svg-to-webp": {
    exampleHeading: "Worked example: a logo SVG rasterised to WebP",
    example: [
      "Take a simple two-colour logo saved as SVG, about 8 KB of vector shapes. SVG has no pixels, so the tool first rasterises it at the size you choose, then encodes the result as WebP. Rasterised at 2000 x 2000, that logo typically lands around 35 to 100 KB as a WebP at the tool's default quality of 92, because large flat areas compress very efficiently and WebP runs about 25 to 35% smaller than JPG for the same picture. A detailed illustration with gradients and fine lines at the same size typically lands around 200 to 400 KB. These are typical figures, not measurements: the output size is set by the raster size you pick and the detail in the artwork, not by the size of the SVG file.",
      "The key choice is the raster size. Rasterise at the size the WebP will actually be shown, because a 2000-pixel logo shrunk to a 200-pixel thumbnail wastes most of its bytes, and a 500-pixel raster stretched to a poster turns blurry. The tool's resize option sets the output dimensions before encoding, so pick the display size first.",
    ],
    edgeCases: [
      {
        title: "Text in the SVG becomes pixels",
        body: "Once rasterised, the text in an SVG is no longer text: it cannot be selected, searched, or edited. If the WebP is headed to a document where the words matter, keep the SVG as well, or rasterise at a high resolution so the text stays readable.",
      },
      {
        title: "Transparency is kept",
        body: "Unlike JPG, WebP supports an alpha channel, so see-through areas in the SVG stay see-through in the WebP. A logo on a transparent background converts cleanly, with no background colour to pick.",
      },
      {
        title: "Fonts inside the SVG may fall back",
        body: "An SVG that names a font your device does not have is rendered with a fallback font, so the WebP can look different from the SVG in its home editor. Converting text to outlines in the editor before exporting the SVG avoids the problem entirely.",
      },
    ],
    betterChoice:
      "If the destination accepts SVG, keep the SVG: it stays sharp at every size and is usually the smallest file. If the file needs a raster format with transparency, WebP is the right choice over JPG. For email clients, social media, and upload forms that refuse SVG, WebP is the safe choice when they accept it, and JPG when they do not.",
    faqs: [
      {
        question: "What size should I rasterise my SVG at?",
        answer:
          "Rasterise at the size the WebP will actually be shown. A logo for a website header is usually fine at 1000 to 2000 pixels wide; a social media post wants the platform's exact size, such as 1080 pixels wide for Instagram. Rasterising larger only makes a bigger file, and rasterising smaller then stretching it makes a blurry one.",
      },
      {
        question: "Will the WebP look as sharp as the SVG?",
        answer:
          "At the size you rasterise it, yes, for all practical purposes at quality 90 or above. The difference is that the WebP is fixed at that size: zoom past it and it softens, while the SVG stays sharp at any zoom. For text-heavy artwork, keep quality at 90 or above, or use PNG.",
      },
    ],
  },
  "svg-to-avif": {
    exampleHeading: "Worked example: a logo SVG rasterised to AVIF",
    example: [
      "Take a simple two-colour logo saved as SVG, about 8 KB of vector shapes. SVG has no pixels, so the tool first rasterises it at the size you choose, then encodes the result as AVIF. Rasterised at 2000 x 2000, that logo typically lands around 25 to 70 KB as an AVIF at the tool's default quality of 92, because large flat areas compress very efficiently and AVIF runs about 40 to 60% smaller than JPG for the same picture, and roughly a quarter smaller than WebP. A detailed illustration with gradients and fine lines at the same size typically lands around 150 to 300 KB. These are typical figures, not measurements: the output size is set by the raster size you pick and the detail in the artwork, not by the size of the SVG file.",
      "The key choice is the raster size. Rasterise at the size the AVIF will actually be shown, because a 2000-pixel logo shrunk to a 200-pixel thumbnail wastes most of its bytes, and a 500-pixel raster stretched to a poster turns blurry. The tool's resize option sets the output dimensions before encoding, so pick the display size first. AVIF also encodes slowly, roughly 5 to 20 times slower than WebP, so a large raster can take a few seconds where a WebP would be instant.",
    ],
    edgeCases: [
      {
        title: "Text in the SVG becomes pixels",
        body: "Once rasterised, the text in an SVG is no longer text: it cannot be selected, searched, or edited. An SVG that names a font your device does not have is also rendered with a fallback font, so the AVIF can look different from the SVG in its home editor. Converting text to outlines in the editor before exporting the SVG avoids the font problem, and rasterising at a high resolution keeps the text readable.",
      },
      {
        title: "Transparency is kept",
        body: "Unlike JPG, AVIF supports an alpha channel, so see-through areas in the SVG stay see-through in the AVIF. A logo on a transparent background converts cleanly, with no background colour to pick.",
      },
      {
        title: "A browser without an AVIF encoder saves WebP instead",
        body: "AVIF encoding depends on the browser, and some browsers cannot encode it. When that happens the tool saves the same rasterised image as WebP instead and tells you so in a warning, rather than failing. The WebP is a little larger than the AVIF would have been, but it holds the same pixels at the same quality setting.",
      },
    ],
    betterChoice:
      "If the destination accepts SVG, keep the SVG: it stays sharp at every size and is usually the smallest file. If the file needs a raster format with transparency, AVIF is the smallest choice, and WebP is the fallback when AVIF is not supported. For email clients, social media, and upload forms that refuse SVG, use AVIF where it is accepted and JPG where it is not.",
    faqs: [
      {
        question: "What size should I rasterise my SVG at?",
        answer:
          "Rasterise at the size the AVIF will actually be shown. A logo for a website header is usually fine at 1000 to 2000 pixels wide; a social media post wants the platform's exact size, such as 1080 pixels wide for Instagram. Rasterising larger only makes a bigger file and a slower encode, and rasterising smaller then stretching it makes a blurry one.",
      },
      {
        question: "Will the AVIF look as sharp as the SVG?",
        answer:
          "At the size you rasterise it, yes, for all practical purposes at quality 90 or above. The difference is that the AVIF is fixed at that size: zoom past it and it softens, while the SVG stays sharp at any zoom. For text-heavy artwork, keep quality at 90 or above, or use PNG.",
      },
    ],
  },
  "avif-to-webp": {
    exampleHeading: "Worked example: a 4000 x 3000 photo from AVIF to WebP",
    example: [
      "Take a typical 4000 x 3000 phone photo saved as AVIF, around 1.5 MB. Converted to WebP at the tool's default quality of 92, the same photo typically lands around 2 MB, larger than the AVIF it came from. That is not a fault in the conversion: WebP is simply the older, less efficient codec. For the same picture at matched quality, AVIF runs about 40 to 60% smaller than JPG while WebP runs about 25 to 35% smaller, so a WebP of the same pixels is roughly 1.4 times the AVIF. On a 2400-pixel photo the published figures are about 820 KB as JPG, 570 KB as WebP, and 410 KB as AVIF, the same ratio. These are typical figures, not measurements: a noisy low light shot compresses worse in both formats, and a simple graphic compresses far better.",
      "The pixels do not change in the conversion, only the packaging. The WebP holds the same 4000 x 3000 image, just stored with a less efficient codec, so the file grows while the picture stays the same. If the file is headed somewhere that accepts AVIF, keep the AVIF: converting to WebP only makes sense when the destination refuses AVIF and accepts WebP.",
    ],
    edgeCases: [
      {
        title: "No quality is gained, only preserved",
        body: "WebP is a re-encode, not a copy: the AVIF is decoded to pixels and encoded again at quality 92, so a little detail is lost in the second pass and the compression artefacts from the AVIF are copied faithfully into the WebP. Converting back and forth between the two formats drifts the picture slightly each time, so keep the AVIF as the master and convert only the copy you need.",
      },
      {
        title: "An animated AVIF becomes a single still",
        body: "The browser decoder reads only the first frame of an animated AVIF, so the WebP is a still image of that frame and the motion is gone. If the animation matters, keep the AVIF, or convert to a video format instead.",
      },
      {
        title: "HDR and wide colour are narrowed to 8-bit standard colour",
        body: "An AVIF can hold 10-bit HDR and wide colour gamut data, but the browser canvas path decodes to 8-bit standard colour, so the WebP is a standard dynamic range image. Bright highlights and deep colours are clipped to what an 8-bit image can hold, which is fine for a screen but not for re-editing.",
      },
    ],
    betterChoice:
      "If the destination accepts AVIF, keep the AVIF: it is the smaller file for the same picture. Convert to WebP only when a specific program, upload form, or older device refuses AVIF and accepts WebP. If the destination refuses WebP too, convert to JPG instead, which is typically 2 to 4 MB for the same 4000 x 3000 photo.",
    faqs: [
      {
        question: "Why is the WebP bigger than the AVIF?",
        answer:
          "AVIF compresses better than WebP: for the same picture at matched quality, AVIF runs about 40 to 60% smaller than JPG while WebP runs about 25 to 35% smaller, so the WebP is roughly 1.4 times the AVIF. The same 4000 x 3000 photo that weighs about 1.5 MB as AVIF typically becomes about 2 MB as WebP, with identical pixels.",
      },
      {
        question: "Does converting AVIF to WebP lose quality?",
        answer:
          "A little, yes. The AVIF is decoded and re-encoded as WebP at quality 92, so the second pass discards a small amount of detail, and any artefacts already in the AVIF are carried over. At quality 90 or above the difference is invisible at normal viewing sizes, but keep the AVIF as your master and convert only the copy you need.",
      },
    ],
  },
  "png-to-pdf": {
    exampleHeading: "Worked example: a 4000 x 3000 PNG in a PDF",
    example: [
      "Take a typical 4000 x 3000 phone photo saved as PNG, around 10 to 14 MB. Converted to PDF, it becomes a one-page document of about 2 to 4 MB, because the PDF embeds the image as a JPG at quality 92 rather than carrying the PNG data. Ten such photos become a ten-page PDF of about 20 to 40 MB, one image per page in the order you added them. The PDF carries no EXIF data from the PNG: the image is re-encoded from the canvas pixels, so camera settings and location are left behind. These are typical figures, not measurements: a noisy photo makes a larger PDF page, a clean studio shot a smaller one.",
      "The page is as big as the image. The converter sizes each page to the image pixels at 96 DPI, so a 4000-pixel-wide photo makes a page about 1,058 mm wide and 794 mm tall, roughly five A4 widths. That is fine for viewing on screen, but a PDF that must fit an upload limit or print on A4 needs the image resized first: resize the PNG to 794 x 1123 pixels for an exact A4 page, then convert. A PDF is a wrapper, not a compression choice, so shrinking the PDF means shrinking the pixels that go into it.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened, not kept",
        body: "PDF pages here hold a JPG image, and JPG has no alpha channel, so see-through areas in the PNG become the background colour you pick in the tool above (white by default). A logo on a transparent background needs its background colour matched to where the PDF will be viewed or printed, or it ends up with a visible box.",
      },
      {
        title: "Text in the image is not selectable",
        body: "The PDF holds a picture of the image, not the image's contents as text, so words in a screenshot or a scanned page cannot be selected, searched, or copied from the PDF. There is no OCR step. If the words matter, keep the PNG as well, or use a text extraction route instead.",
      },
      {
        title: "The page is as big as the image",
        body: "Each PDF page is sized to the image pixels at 96 DPI, so a phone photo makes a page about 1,058 mm wide. Viewers handle it fine, but printers scale it down to fit the paper, and some upload forms reject oversized pages. Resize the image to the page size you actually want before converting.",
      },
    ],
    betterChoice:
      "Use PDF when the file must look the same everywhere, for sharing or printing a fixed layout. If the file must be small, resize the PNG first or convert it to JPG, which is typically 2 to 4 MB for the same 4000 x 3000 photo, and then build the PDF from the smaller image. For a document whose text must stay editable, a PDF built from images is the wrong tool: convert the text instead.",
    faqs: [
      {
        question: "How big will the PDF be?",
        answer:
          "About the size of the image as a JPG at quality 92, because the PDF embeds the image that way. A 4000 x 3000 PNG of 10 to 14 MB becomes a one-page PDF of about 2 to 4 MB, and ten such pages become about 20 to 40 MB. Resize the image before converting if the PDF must fit an upload limit.",
      },
      {
        question: "Can I make the PDF page A4 size?",
        answer:
          "Yes, by resizing the image first: an A4 page at 96 DPI is 794 x 1123 pixels, so resize the PNG to those dimensions and the PDF page comes out at exactly A4. Without resizing, the page is sized to the image pixels, so a 4000-pixel-wide photo makes a page about 1,058 mm wide.",
      },
    ],
  },
  "webp-to-pdf": {
    exampleHeading: "Worked example: a 4000 x 3000 WebP in a PDF",
    example: [
      "Take a typical 4000 x 3000 phone photo saved as WebP, around 1.5 to 3 MB. Converted to PDF, it becomes a one-page document of about 2 to 4 MB, larger than the WebP it came from. That is not a fault in the conversion: the PDF embeds the image as a JPG at quality 92, and JPG is a less efficient codec than WebP for the same pixels, since WebP runs about 25 to 35% smaller than JPG at matched quality. Ten such photos become a ten-page PDF of about 20 to 40 MB, one image per page in the order you added them. The PDF carries no EXIF data from the WebP: the image is re-encoded from the canvas pixels. These are typical figures, not measurements: a noisy photo makes a larger PDF page, a clean studio shot a smaller one.",
      "The page is as big as the image. The converter sizes each page to the image pixels at 96 DPI, so a 4000-pixel-wide photo makes a page about 1,058 mm wide and 794 mm tall, roughly five A4 widths. That is fine for viewing on screen, but a PDF that must fit an upload limit or print on A4 needs the image resized first: resize the WebP to 794 x 1123 pixels for an exact A4 page, then convert.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened, not kept",
        body: "WebP can hold see-through areas, but the PDF page holds a JPG image, and JPG has no alpha channel, so transparent pixels become the background colour you pick in the tool above (white by default). A logo on a transparent background needs its background colour matched to where the PDF will be viewed or printed, or it ends up with a visible box.",
      },
      {
        title: "An animated WebP becomes a single still",
        body: "The browser decoder reads only the first frame of an animated WebP, so the PDF page is a still image of that frame and the motion is gone. If the animation matters, keep the WebP, or convert to a video format instead.",
      },
      {
        title: "Text in the image is not selectable",
        body: "The PDF holds a picture of the image, not the image's contents as text, so words in a screenshot or a scanned page cannot be selected, searched, or copied from the PDF. There is no OCR step. If the words matter, keep the WebP as well, or use a text extraction route instead.",
      },
    ],
    betterChoice:
      "Use PDF when the file must look the same everywhere, for sharing or printing a fixed layout. Keep the WebP when the file is headed for the web, where it is the smaller file. If the PDF must be small, resize the WebP first, because the PDF size follows the pixels, not the WebP file size.",
    faqs: [
      {
        question: "Why is the PDF bigger than the WebP?",
        answer:
          "The PDF embeds the image as a JPG at quality 92, and JPG is less efficient than WebP for the same pixels: WebP runs about 25 to 35% smaller than JPG at matched quality. A 4000 x 3000 WebP of 1.5 to 3 MB therefore becomes a PDF page of about 2 to 4 MB, with identical pixels.",
      },
      {
        question: "Will the PDF keep the WebP transparency?",
        answer:
          "No. The PDF page holds a JPG image, which has no alpha channel, so transparent areas are flattened onto the background colour you pick in the tool above, white by default. Pick the colour of the page the PDF will sit on if the transparency matters to how it looks.",
      },
    ],
  },
  "bmp-to-webp": {
    exampleHeading: "Worked example: a 4000 x 3000 BMP to WebP",
    example: [
      "Take a typical 4000 x 3000 photo saved as BMP, 36.0 MB, because BMP stores every pixel uncompressed at 3 bytes each. Converted to WebP at the tool's default quality of 92, the same photo typically lands around 1.3 to 3 MB, roughly a tenth of the BMP. The saving comes from WebP's lossy compression: for the same picture, WebP runs about 25 to 35% smaller than JPG, and the JPG of this photo would be about 2 to 4 MB. A 1920 x 1080 photo becomes a BMP of 6.22 MB and a WebP of around 260 to 600 KB. These are typical figures, not measurements: a noisy photo makes a larger WebP, a flat graphic a far smaller one, but the BMP is always 36.0 MB for this pixel size, because uncompressed means uncompressed.",
      "The size is set by the pixel dimensions and the detail in the picture, not by the BMP file size. A flat screenshot with large solid areas compresses far better than a detailed photograph at the same pixel size, so two BMPs of identical size can become very different WebPs. That is why BMP is a format you convert from, never a format you store photos in.",
    ],
    edgeCases: [
      {
        title: "WebP is lossy, BMP is not",
        body: "Converting to WebP at quality 92 discards a small amount of detail that the BMP held exactly, so the WebP is not a pixel exact copy of the BMP. At quality 90 or above the difference is invisible at normal viewing sizes, but keep the BMP as the master if you plan to re-edit or re-encode the image later.",
      },
      {
        title: "BMP has no transparency to keep",
        body: "The BMP here is 24-bit with no alpha channel, so there are no see-through areas to flatten and no background colour to pick. The WebP simply holds the same opaque pixels, compressed.",
      },
      {
        title: "Rare BMP variants may fail to decode",
        body: "Most BMPs are plain 24-bit files and decode cleanly, but rare 32-bit or RLE-compressed BMPs may fail in the browser decoder. If a BMP fails to load, open it in an image editor and save it as a plain 24-bit BMP, or export it as PNG first and convert from there.",
      },
    ],
    betterChoice:
      "If the file is headed for the web, an email, or an upload form, WebP is the right choice: it holds the same picture in roughly a tenth of the space. Keep the BMP only when a specific program demands it. If the destination refuses WebP, convert to JPG instead, which is typically 2 to 4 MB for the same 4000 x 3000 photo.",
    faqs: [
      {
        question: "Why is the WebP so much smaller than the BMP?",
        answer:
          "A BMP stores every pixel uncompressed, 3 bytes per pixel, so a 4000 x 3000 photo is 36.0 MB before anything is done to it. WebP compresses the same pixels, discarding detail the eye cannot see at quality 92, typically to around 1.3 to 3 MB for that photo, roughly a tenth of the BMP.",
      },
      {
        question: "Does converting BMP to WebP lose quality?",
        answer:
          "A little, yes. BMP is uncompressed, so it holds every pixel exactly, while WebP at quality 92 is lossy and discards a small amount of detail. At quality 90 or above the difference is invisible at normal viewing sizes. Keep the BMP as your master if you plan to re-edit the image, and convert only the copy you need.",
      },
    ],
  },
  "svg-to-bmp": {
    exampleHeading: "Worked example: a logo SVG rasterised to BMP",
    example: [
      "Take a simple two-colour logo saved as SVG, about 8 KB of vector shapes. SVG has no pixels, so the tool first rasterises it at the size you choose, then writes the result as a BMP. Rasterised at 2000 x 2000, that logo becomes a BMP of 12.0 MB, because BMP stores every pixel uncompressed at 3 bytes per pixel plus a 54 byte header: 2000 times 2000 times 3 is 12,000,000 bytes, plus the header. At 1000 x 1000 the same logo is 3.0 MB. These are exact figures from the BMP format, not estimates: the output size is set entirely by the raster size you pick and the pixel count, not by the size of the SVG file.",
      "The key choice is the raster size. Rasterise at the size the BMP will actually be used at, because a 2000-pixel logo shrunk to a 200-pixel thumbnail wastes most of its bytes, and a 500-pixel raster stretched to a poster turns blurry. The tool's resize option sets the output dimensions before encoding, so pick the display size first, and remember that every doubling of the width and height quadruples the BMP file size.",
    ],
    edgeCases: [
      {
        title: "Transparency is flattened",
        body: "BMP has no transparency, so see-through areas in the SVG are flattened onto a solid background colour, white by default, which you can pick in the tool. A logo on a transparent background does not stay transparent in BMP, so check the result on a coloured background before using it.",
      },
      {
        title: "Text in the SVG becomes pixels",
        body: "Once rasterised, the text in an SVG is no longer text: it cannot be selected, searched, or edited. If the BMP is headed to a document where the words matter, keep the SVG as well, or rasterise at a high resolution so the text stays readable.",
      },
      {
        title: "Fonts inside the SVG may fall back",
        body: "An SVG that names a font your device does not have is rendered with a fallback font, so the BMP can look different from the SVG in its home editor. Converting text to outlines in the editor before exporting the SVG avoids the problem entirely.",
      },
    ],
    betterChoice:
      "If the destination accepts SVG, keep the SVG: it stays sharp at every size and is usually the smallest file by a wide margin. Convert to BMP only when a specific program demands it, such as an old Windows application or a game engine that reads BMP textures, and rasterise at the exact size that program needs.",
    faqs: [
      {
        question: "Why is the BMP so much bigger than the SVG?",
        answer:
          "An SVG stores shapes as instructions, so a logo can be 8 KB, while a BMP stores every pixel uncompressed at 3 bytes per pixel. A 2000 x 2000 BMP is 12.0 MB and a 4000 x 3000 BMP is 36.0 MB, whatever the SVG weighed. The BMP is not holding more detail than the SVG, it is just holding the same picture in the most wasteful possible way.",
      },
      {
        question: "What raster size should I pick for SVG to BMP?",
        answer:
          "Pick the size the BMP will actually be shown at. A logo for a website header is usually fine at 1000 to 2000 pixels wide, and a texture for a game wants the exact pixel size the engine expects. Rasterising larger only makes a bigger file, and every doubling of the width and height quadruples it, so do not rasterise at 4000 pixels for a 400-pixel job.",
      },
    ],
  },
  "avif-to-bmp": {
    exampleHeading: "Worked example: a photo AVIF expanded to BMP",
    example: [
      "Take a 4000 x 3000 photo saved as AVIF, about 1.5 MB, which is typical for an AVIF at good quality. Converting it to BMP gives a file of 36.0 MB: BMP stores every pixel uncompressed at 3 bytes per pixel plus a 54 byte header, so 4000 times 3000 times 3 is 36,000,000 bytes. That is 24 times the size of the AVIF, for the same pixels. A 1920 x 1080 AVIF of about 0.7 MB becomes a BMP of 6.22 MB, about 9 times bigger. These are exact figures from the BMP format: the output size is set by the pixel count alone, never by how small the AVIF was.",
      "The size jump is the whole story of this conversion. AVIF is one of the most efficient formats in use, and BMP is the least efficient, so the conversion only ever makes the file bigger, by roughly 10 to 25 times for a typical photo. Do it only when a program demands a BMP and cannot read anything else.",
    ],
    edgeCases: [
      {
        title: "No quality is gained",
        body: "BMP is lossless, but it can only preserve the pixels it is given. The AVIF artefacts, the small compression errors in the original, are copied faithfully into the BMP, so the result looks exactly like the AVIF and no better. Converting to BMP never repairs a compressed image.",
      },
      {
        title: "Animation is lost",
        body: "BMP is a still-image format, so only the first frame of an animated AVIF is kept. If the AVIF moves, convert the frame you want, or use a format that keeps animation instead.",
      },
      {
        title: "Wide colour is narrowed",
        body: "An AVIF can carry HDR or wide-gamut colour, but BMP holds ordinary 8-bit colour, so the extra range is narrowed on conversion. For a photo headed to print or to an editor, keep the AVIF as the master and convert only the copy the destination needs.",
      },
    ],
    betterChoice:
      "Keep the AVIF whenever you can: it is smaller, sharper for its size, and keeps wide colour. Convert to BMP only when a specific program demands it, such as an old Windows application or a game engine that reads BMP textures, and keep the AVIF as your master, because the BMP will be many times larger for the same picture.",
    faqs: [
      {
        question: "Why would anyone convert AVIF to BMP?",
        answer:
          "Almost always because a program demands it. Some older Windows applications, game engines, and specialist tools read BMP and nothing else, so the conversion is a compatibility step, not a quality step. For anything else, AVIF is the better format to keep, and PNG is the better lossless format to convert to.",
      },
      {
        question: "Does the BMP keep the AVIF quality?",
        answer:
          "It keeps the AVIF pixels exactly, including their compression artefacts, because BMP is lossless. What it does not keep is the AVIF file size or its wide-colour range: the BMP is roughly 10 to 25 times bigger for the same photo, and HDR or wide-gamut colour is narrowed to ordinary 8-bit colour.",
      },
    ],
  },
  "bmp-to-pdf": {
    exampleHeading: "Worked example: a BMP photo wrapped in a PDF",
    example: [
      "Take a 4000 x 3000 photo saved as BMP, 36.0 MB of uncompressed pixels. Converting it to PDF gives a one-page PDF of about 2 to 4 MB, because the tool embeds the image as a JPEG at quality 92 rather than carrying the raw pixels: the same photo as a JPG is typically 2 to 4 MB, and the PDF adds only a small amount of page overhead. Ten such photos become a ten-page PDF of about 20 to 40 MB. The PDF is much smaller than the BMP, not because anything was thrown away on purpose, but because JPEG compression replaces 36 MB of raw pixels with a few megabytes of compressed ones.",
      "The page is as big as the image. The tool places the image at 96 DPI, so a 4000-pixel-wide photo makes a page about 1,058 mm wide, roughly five A4 widths side by side, and a 3000-pixel-tall photo makes a page about 794 mm tall. For a normal A4 page, resize the image to 794 x 1123 pixels first, which is A4 at 96 DPI.",
    ],
    edgeCases: [
      {
        title: "The PDF is smaller than the BMP, and that is normal",
        body: "A BMP is uncompressed, so a 4000 x 3000 photo is 36.0 MB, while the PDF embeds a JPEG at quality 92, typically 2 to 4 MB for the same photo. The PDF is not a worse copy: it is the same picture compressed, and the size saving is the point of the conversion.",
      },
      {
        title: "Text in the image is not selectable",
        body: "The PDF holds a picture of the image, not text, so words in the BMP cannot be selected, searched, or copied from the PDF. If the text matters, it needs OCR or a retyped document, not a conversion.",
      },
      {
        title: "Transparency is flattened",
        body: "BMP has no transparency, so there is nothing to lose here, but the PDF page itself is opaque: the image sits on a fixed white page, and the result is a document, not a floating image.",
      },
    ],
    betterChoice:
      "Use BMP to PDF when the picture needs to be a document: printing, emailing, archiving, or sending to someone who will open it in a reader rather than an editor. If the destination expects an image file, convert to JPG or PNG instead, which stay images and are smaller than the BMP too.",
    faqs: [
      {
        question: "Why is the PDF smaller than the BMP?",
        answer:
          "Because the PDF does not carry the raw pixels. A 4000 x 3000 BMP is 36.0 MB of uncompressed data, while the PDF embeds the image as a JPEG at quality 92, typically 2 to 4 MB for the same photo, plus a small amount of page overhead. The compression is lossy, but at quality 92 the difference is invisible at normal viewing sizes.",
      },
      {
        question: "Will the PDF page be A4?",
        answer:
          "Only if the image is 794 x 1123 pixels, which is A4 at the 96 DPI the tool places images at. A 4000-pixel-wide photo makes a page about 1,058 mm wide, roughly five A4 widths. Resize the image to 794 x 1123 pixels with the Image Resizer before converting if you need a normal A4 page.",
      },
    ],
  },
  "gif-to-pdf": {
    exampleHeading: "Worked example: a GIF still wrapped in a PDF",
    example: [
      "Take a 480 x 270 GIF, about 20 to 60 KB, which is typical for a short animated clip or a simple graphic at that size. Converting it to PDF gives a one-page PDF of typically 20 to 60 KB, about the same as the GIF, because the tool embeds the single kept frame as a JPEG at quality 92, and a small flat graphic compresses to roughly the same size either way. The page is 127 mm wide, because the tool places the image at 96 DPI and 480 pixels at 96 DPI is 5 inches, which is 127 mm. A larger GIF makes a proportionally larger page: a 1920-pixel-wide GIF makes a page about 508 mm wide.",
      "Only the first frame survives. A GIF with 40 frames at 10 frames per second becomes one still image, the first frame, and the other 39 frames are dropped. If the motion is the point, keep the GIF, or export the clip as a video instead.",
    ],
    edgeCases: [
      {
        title: "Animation is lost",
        body: "PDF is a still-image format, so an animated GIF becomes one still frame, the first one. The 40 frames of a 4-second clip at 10 frames per second are reduced to a single image, and there is no way to keep the motion in a PDF.",
      },
      {
        title: "The 256-colour palette stays",
        body: "A GIF holds at most 256 colours, and the PDF keeps the same limited palette, because it embeds the same pixels. Colours that were already banded or posterised in the GIF stay banded in the PDF, so converting does not smooth gradients or recover lost colours.",
      },
      {
        title: "Text in the GIF is not selectable",
        body: "The PDF holds a picture of the GIF frame, not text, so words in the image cannot be selected, searched, or copied from the PDF. If the text matters, it needs OCR or a retyped document, not a conversion.",
      },
    ],
    betterChoice:
      "Use GIF to PDF when a single frame needs to be a document: printing it, emailing it, or archiving it with other pages. If the animation matters, keep the GIF, and if the destination expects an image, convert to PNG instead, which keeps the still frame without wrapping it in a document.",
    faqs: [
      {
        question: "Does the PDF keep the animation?",
        answer:
          "No. A PDF is a still-image format, so only the first frame of the GIF is kept and the rest are dropped. A 4-second GIF with 40 frames at 10 frames per second becomes a single still image in the PDF. If the motion matters, keep the GIF or export the clip as a video.",
      },
      {
        question: "What page size will the PDF be?",
        answer:
          "The page is as big as the image, placed at 96 DPI. A 480-pixel-wide GIF makes a page 127 mm wide, and a 1920-pixel-wide GIF makes a page about 508 mm wide. For a normal A4 page, resize the image to 794 x 1123 pixels first, which is A4 at 96 DPI.",
      },
    ],
  },
  "jpg-to-svg": {
    exampleHeading: "Worked example: a JPG photo wrapped as an SVG",
    example: [
      "Take a 4000 x 3000 photo saved as JPG, about 3 MB. Converting it to SVG gives a file of about 13 to 19 MB, several times bigger than the JPG, because the tool embeds the image as a PNG inside the SVG markup: the same photo as a PNG is typically 10 to 14 MB, and base64 encoding inflates that by a third, to about 13 to 19 MB, plus a small amount of XML wrapper. The SVG is not a smaller or sharper version of the photo. It is the same raster image in a bigger, text-based container.",
      "The size jump is the honest price of the format. SVG is a vector format, but this conversion does not trace the photo into vectors: it wraps the pixels in an SVG file so that systems which only accept SVG can take the image. If the destination accepts JPG, PNG, or WebP, converting to SVG gains nothing and costs file size.",
    ],
    edgeCases: [
      {
        title: "The SVG is not a real vector image",
        body: "The converter embeds the JPG bitmap inside an SVG wrapper, which is useful when a system specifically requires an .svg file, but the picture inside is still pixels and will blur when enlarged. Turning a photo or logo into a true vector requires tracing it in a design tool, and no automatic conversion does that.",
      },
      {
        title: "The file gets bigger, not smaller",
        body: "A 3 MB JPG becomes a 13 to 19 MB SVG, because the PNG embed is larger than the JPG and base64 encoding adds another third on top. Do not convert to SVG to save space: it is the one direction in which the file reliably grows.",
      },
      {
        title: "Some systems reject the embedded kind of SVG",
        body: "A few upload forms and design tools accept SVG files but strip or refuse embedded images inside them, because they expect pure vector shapes. If the destination rejects the file, convert to PNG instead, which every image system accepts.",
      },
    ],
    betterChoice:
      "Convert JPG to SVG only when a destination accepts SVG and refuses JPG, such as an upload form or a design tool that only takes SVG input. For everything else, keep the JPG, or convert to PNG or WebP, which stay smaller and work everywhere an image is expected.",
    faqs: [
      {
        question: "Is the SVG a real vector image?",
        answer:
          "No. The converter embeds your JPG bitmap inside an SVG wrapper, so the file opens anywhere an SVG is accepted, but the picture inside is still pixels and will blur when enlarged. A true vector version needs tracing in a design tool such as Illustrator or Inkscape, which redraws the shapes rather than wrapping the pixels.",
      },
      {
        question: "When is JPG to SVG actually useful?",
        answer:
          "Almost only when a destination accepts SVG and refuses JPG: some upload forms, content systems, and design tools take SVG input and nothing else. In that case the wrapper gets the photo through the door. For display, sharing, or printing, keep the JPG or convert to PNG or WebP instead, which are smaller and sharper for the same picture.",
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
