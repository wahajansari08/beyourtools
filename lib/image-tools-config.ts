export type ImageFormat =
  | "jpg"
  | "png"
  | "webp"
  | "gif"
  | "svg"
  | "avif"
  | "bmp"
  | "tiff"
  | "ico"
  | "heic"
  | "jxl"
  | "psd"
  | "tga"
  | "pdf";

export interface FormatDef {
  id: ImageFormat;
  label: string;
  /** File extensions accepted by the input (lower-case, no leading dot) */
  extensions: string[];
  /** MIME types for the file picker */
  mimes: string[];
  /** Whether the browser Canvas API can decode this natively */
  canvasReadable: boolean;
  /** Whether the browser Canvas API can encode this natively */
  canvasWritable: boolean;
}

export const formats: FormatDef[] = [
  { id: "jpg",  label: "JPG",  extensions: ["jpg","jpeg"], mimes: ["image/jpeg"],              canvasReadable: true,  canvasWritable: true  },
  { id: "png",  label: "PNG",  extensions: ["png"],        mimes: ["image/png"],               canvasReadable: true,  canvasWritable: true  },
  { id: "webp", label: "WebP", extensions: ["webp"],       mimes: ["image/webp"],              canvasReadable: true,  canvasWritable: true  },
  { id: "gif",  label: "GIF",  extensions: ["gif"],        mimes: ["image/gif"],               canvasReadable: true,  canvasWritable: false },
  { id: "svg",  label: "SVG",  extensions: ["svg"],        mimes: ["image/svg+xml"],           canvasReadable: true,  canvasWritable: false },
  { id: "avif", label: "AVIF", extensions: ["avif"],       mimes: ["image/avif"],              canvasReadable: true,  canvasWritable: true  },
  { id: "bmp",  label: "BMP",  extensions: ["bmp"],        mimes: ["image/bmp"],               canvasReadable: true,  canvasWritable: false },
  { id: "tiff", label: "TIFF", extensions: ["tif","tiff"], mimes: ["image/tiff"],              canvasReadable: false, canvasWritable: false },
  { id: "ico",  label: "ICO",  extensions: ["ico"],        mimes: ["image/x-icon"],            canvasReadable: false, canvasWritable: false },
  { id: "heic", label: "HEIC", extensions: ["heic","heif"],mimes: ["image/heic","image/heif"], canvasReadable: false, canvasWritable: false },
  { id: "jxl",  label: "JXL",  extensions: ["jxl"],        mimes: ["image/jxl"],               canvasReadable: false, canvasWritable: false },
  { id: "psd",  label: "PSD",  extensions: ["psd"],        mimes: ["image/vnd.adobe.photoshop","application/octet-stream"], canvasReadable: false, canvasWritable: false },
  { id: "tga",  label: "TGA",  extensions: ["tga"],        mimes: ["image/x-tga","application/octet-stream"], canvasReadable: false, canvasWritable: false },
  { id: "pdf",  label: "PDF",  extensions: ["pdf"],        mimes: ["application/pdf"],         canvasReadable: false, canvasWritable: false },
];

export function getFormat(id: string): FormatDef | undefined {
  return formats.find((f) => f.id === id);
}

/** All (from → to) pairs defined in the spec */
export interface ConversionRoute {
  from: ImageFormat;
  to: ImageFormat;
  /** URL slug, e.g. "jpg-to-png" */
  slug: string;
}

// Raw pairs from the specification
const RAW_PAIRS: [ImageFormat, ImageFormat][] = [
  // JPG
  ["jpg","png"],["jpg","webp"],["jpg","gif"],["jpg","svg"],["jpg","avif"],["jpg","bmp"],["jpg","tiff"],["jpg","ico"],["jpg","heic"],["jpg","pdf"],
  // PNG
  ["png","jpg"],["png","webp"],["png","gif"],["png","svg"],["png","avif"],["png","bmp"],["png","tiff"],["png","ico"],["png","heic"],["png","pdf"],
  // WebP
  ["webp","jpg"],["webp","png"],["webp","gif"],["webp","svg"],["webp","avif"],["webp","bmp"],["webp","tiff"],["webp","ico"],["webp","heic"],["webp","pdf"],
  // GIF
  ["gif","jpg"],["gif","png"],["gif","webp"],["gif","svg"],["gif","avif"],["gif","bmp"],["gif","tiff"],["gif","ico"],["gif","pdf"],
  // SVG
  ["svg","jpg"],["svg","png"],["svg","webp"],["svg","gif"],["svg","avif"],["svg","bmp"],["svg","tiff"],["svg","ico"],["svg","pdf"],
  // AVIF
  ["avif","jpg"],["avif","png"],["avif","webp"],["avif","gif"],["avif","svg"],["avif","bmp"],["avif","tiff"],["avif","ico"],["avif","pdf"],
  // BMP
  ["bmp","jpg"],["bmp","png"],["bmp","webp"],["bmp","gif"],["bmp","svg"],["bmp","avif"],["bmp","tiff"],["bmp","ico"],["bmp","pdf"],
  // TIFF
  ["tiff","jpg"],["tiff","png"],["tiff","webp"],["tiff","gif"],["tiff","svg"],["tiff","avif"],["tiff","bmp"],["tiff","ico"],["tiff","pdf"],
  // ICO
  ["ico","jpg"],["ico","png"],["ico","webp"],["ico","gif"],["ico","svg"],["ico","avif"],["ico","bmp"],["ico","tiff"],["ico","pdf"],
  // HEIC
  ["heic","jpg"],["heic","png"],["heic","webp"],["heic","gif"],["heic","svg"],["heic","avif"],["heic","bmp"],["heic","tiff"],["heic","pdf"],
  // JXL
  ["jxl","jpg"],["jxl","png"],["jxl","webp"],["jxl","gif"],["jxl","avif"],["jxl","bmp"],["jxl","tiff"],["jxl","pdf"],
  // PSD
  ["psd","jpg"],["psd","png"],["psd","webp"],["psd","gif"],["psd","svg"],["psd","avif"],["psd","bmp"],["psd","tiff"],["psd","pdf"],
  // TGA
  ["tga","jpg"],["tga","png"],["tga","webp"],["tga","gif"],["tga","bmp"],["tga","tiff"],["tga","avif"],["tga","pdf"],
];

export const conversionRoutes: ConversionRoute[] = RAW_PAIRS.map(([from, to]) => ({
  from,
  to,
  slug: `${from}-to-${to}`,
}));

export function getConversion(slug: string): ConversionRoute | undefined {
  return conversionRoutes.find((r) => r.slug === slug);
}

/** Returns all conversions where `from` matches the given format */
export function conversionsFrom(from: ImageFormat): ConversionRoute[] {
  return conversionRoutes.filter((r) => r.from === from);
}

/** Returns all conversions where `to` matches the given format */
export function conversionsTo(to: ImageFormat): ConversionRoute[] {
  return conversionRoutes.filter((r) => r.to === to);
}

/** Group routes by their source format for the hub page */
export function routesBySourceFormat(): Record<ImageFormat, ConversionRoute[]> {
  const result = {} as Record<ImageFormat, ConversionRoute[]>;
  for (const route of conversionRoutes) {
    if (!result[route.from]) result[route.from] = [];
    result[route.from].push(route);
  }
  return result;
}

/** Human-readable title for a conversion */
export function conversionTitle(route: ConversionRoute): string {
  const f = getFormat(route.from)!;
  const t = getFormat(route.to)!;
  return `${f.label} to ${t.label}`;
}

/** Whether a conversion can be done entirely in the browser via Canvas */
export function isNativelySupported(route: ConversionRoute): boolean {
  const f = getFormat(route.from)!;
  const t = getFormat(route.to)!;
  // PDF output is handled by jsPDF (always "supported" with the lib)
  if (t.id === "pdf") return true;
  // SVG output from raster: we wrap in an <image> tag (always works)
  if (t.id === "svg") return true;
  // ICO output: we build a minimal ICO from a canvas PNG
  if (t.id === "ico") return true;
  return f.canvasReadable && t.canvasWritable;
}

/**
 * Which external library (if any) is needed for this conversion.
 * null = pure canvas, "jspdf" = PDF output, "wasm" = needs server/WASM
 */
export function conversionEngine(route: ConversionRoute): "canvas" | "jspdf" | "wasm" {
  if (route.to === "pdf") return "jspdf";
  if (isNativelySupported(route)) return "canvas";
  return "wasm";
}

/* ─── Format knowledge base ──────────────────────────────────────────────────
   Factual per-format notes used to build unique, genuinely useful content on
   each conversion pair page (e.g. jpg-to-png). Every pair page combines the
   two formats' facts with pair-specific insights, so no two pages read alike.
────────────────────────────────────────────────────────────────────────────── */

export interface FormatNotes {
  /** e.g. "Lossy raster image" */
  kind: string;
  /** e.g. "Lossy", "Lossless" */
  compression: string;
  transparency: boolean;
  animation: boolean;
  /** Short phrase, e.g. "photographs for the web" */
  bestFor: string;
  /** 1-2 factual sentences about the format */
  detail: string;
}

const FORMAT_NOTES: Record<ImageFormat, FormatNotes> = {
  jpg: {
    kind: "Lossy raster image",
    compression: "Lossy",
    transparency: false,
    animation: false,
    bestFor: "photographs for the web",
    detail:
      "JPG is a lossy raster format designed for photographs. It squeezes 24-bit color images into very small files by discarding detail the human eye barely notices, but it cannot store transparency.",
  },
  png: {
    kind: "Lossless raster image",
    compression: "Lossless",
    transparency: true,
    animation: false,
    bestFor: "screenshots and graphics with transparency",
    detail:
      "PNG is a lossless raster format that preserves every pixel exactly. It supports full alpha transparency, which makes it the default choice for screenshots, UI graphics, and logos on the web.",
  },
  webp: {
    kind: "Modern raster image",
    compression: "Lossy or lossless",
    transparency: true,
    animation: true,
    bestFor: "smaller web images",
    detail:
      "WebP is a modern raster format offering both lossy and lossless compression. It supports transparency and animation, typically producing files 25\u201335% smaller than JPG or PNG at equivalent quality.",
  },
  gif: {
    kind: "Raster image (256 colors)",
    compression: "Lossless (256 colors)",
    transparency: true,
    animation: true,
    bestFor: "simple animations",
    detail:
      "GIF is a raster format limited to 256 colors with 1-bit transparency. Its main strength is simple frame-based animation, which keeps it popular for memes and tiny looping clips.",
  },
  svg: {
    kind: "Vector graphic",
    compression: "N/A (vector format)",
    transparency: true,
    animation: true,
    bestFor: "logos and icons",
    detail:
      "SVG is a vector format: images are described with shapes and paths instead of pixels, so they stay razor-sharp at any size. It supports transparency and animation, ideal for logos and icons.",
  },
  avif: {
    kind: "Modern raster image",
    compression: "Lossy or lossless",
    transparency: true,
    animation: true,
    bestFor: "high-efficiency web photos",
    detail:
      "AVIF is a modern raster format based on the AV1 video codec, with lossy and lossless modes. It delivers excellent quality at very small file sizes, plus transparency and animation support.",
  },
  bmp: {
    kind: "Uncompressed raster image",
    compression: "Uncompressed",
    transparency: false,
    animation: false,
    bestFor: "legacy Windows software",
    detail:
      "BMP is an uncompressed raster format from early Windows. Files are large because pixel data is stored with little or no compression, and it has no transparency support.",
  },
  tiff: {
    kind: "Lossless raster image",
    compression: "Lossless",
    transparency: true,
    animation: false,
    bestFor: "print production and archival scans",
    detail:
      "TIFF is a flexible, usually lossless raster format favored in print production and archiving. It supports transparency, layers, and very high bit depths.",
  },
  ico: {
    kind: "Icon container",
    compression: "Varies (PNG/BMP inside)",
    transparency: true,
    animation: false,
    bestFor: "favicons",
    detail:
      "ICO is a container format for small icons, typically holding multiple PNG or BMP images at different sizes. It is the standard format for website favicons.",
  },
  heic: {
    kind: "High-efficiency raster image",
    compression: "Lossy (HEVC)",
    transparency: true,
    animation: true,
    bestFor: "iPhone photos",
    detail:
      "HEIC is a high-efficiency raster format based on HEVC video compression, used by default on iPhones. It stores photos at roughly half the size of JPG, with transparency and burst-sequence support.",
  },
  jxl: {
    kind: "Next-gen raster image",
    compression: "Lossy or lossless",
    transparency: true,
    animation: true,
    bestFor: "future-proof web imaging",
    detail:
      "JPEG XL is a next-generation raster format supporting both lossy and lossless compression with transparency and animation. Browser support is still rolling out.",
  },
  psd: {
    kind: "Layered design document",
    compression: "Lossless (layered)",
    transparency: true,
    animation: false,
    bestFor: "editing in Photoshop",
    detail:
      "PSD is Adobe Photoshop's native layered document format. It preserves layers, masks, and transparency for further editing rather than final delivery.",
  },
  tga: {
    kind: "Raster image",
    compression: "Uncompressed / RLE",
    transparency: true,
    animation: false,
    bestFor: "game textures",
    detail:
      "TGA (Targa) is a raster format common in game development and video production. It supports an alpha channel and stores pixels uncompressed or with simple RLE compression.",
  },
  pdf: {
    kind: "Document container",
    compression: "Varies (embedded)",
    transparency: false,
    animation: false,
    bestFor: "print-ready documents",
    detail:
      "PDF is a fixed-layout document format, not a pure image format. It can embed raster images and vector graphics, making it ideal for print-ready documents.",
  },
};

export function getFormatNotes(id: ImageFormat): FormatNotes {
  return FORMAT_NOTES[id];
}

/**
 * Pair-specific, genuinely useful notes for a from \u2192 to conversion.
 * Composed from the two formats' factual properties so each pair page
 * carries unique, accurate guidance instead of spun filler.
 */
export function pairInsight(from: ImageFormat, to: ImageFormat): string[] {
  const f = getFormatNotes(from);
  const t = getFormatNotes(to);
  const fl = getFormat(from)!.label;
  const tl = getFormat(to)!.label;
  const notes: string[] = [];

  if (from === "svg" && to !== "svg") {
    notes.push(
      `SVG is resolution-independent, so the ${tl} output is rendered at a fixed pixel size. Export at a large size if you need it for print.`
    );
  }
  if (to === "svg" && from !== "svg") {
    notes.push(
      `The ${fl} pixels are embedded as a bitmap inside the SVG wrapper, so the result won't gain true vector scalability. It's useful when you need an SVG container, not infinite sharpness.`
    );
  }
  if (from === "pdf") {
    notes.push(
      `PDF pages are rasterized during conversion: text and vector elements become pixels and are no longer selectable or editable.`
    );
  }
  if (to === "pdf") {
    notes.push(
      `Your ${fl} image is embedded into a fixed-layout PDF document, ideal for printing, emailing, or archiving a non-editable copy.`
    );
  }
  if (f.transparency && !t.transparency) {
    notes.push(
      `${tl} doesn't support transparency, so transparent areas are flattened onto a solid white background.`
    );
  }
  if (!f.transparency && t.transparency && from !== "pdf") {
    notes.push(
      `${tl} supports transparency, but conversion can't invent it: opaque areas of your ${fl} stay opaque.`
    );
  }
  if (from === "jpg" && (to === "png" || to === "bmp" || to === "tiff")) {
    notes.push(
      `Converting lossy ${fl} to lossless ${tl} preserves every remaining pixel exactly, but it can't restore detail the original compression already discarded.`
    );
  }
  if (
    (from === "png" || from === "bmp" || from === "tiff") &&
    (to === "jpg" || to === "webp" || to === "avif")
  ) {
    notes.push(
      `Switching to ${tl}'s efficient compression usually cuts file size dramatically with little visible quality change, a good tradeoff for web use.`
    );
  }
  if (
    (to === "webp" || to === "avif") &&
    (from === "gif" || from === "svg" || from === "ico" || from === "tga" || from === "psd" || from === "heic" || from === "jxl")
  ) {
    notes.push(
      `As a modern format, ${tl} typically produces files 25\u201350% smaller than ${fl} at similar visual quality.`
    );
  }
  if (to === "ico") {
    notes.push(
      `ICO files are tiny icon containers, perfect for favicons, but large photos lose detail when shrunk to icon sizes.`
    );
  }
  if (to === "gif") {
    notes.push(
      `GIF is limited to 256 colors, so photos and smooth gradients may show visible banding after conversion.`
    );
  }
  if (!getFormat(from)!.canvasReadable) {
    notes.push(
      `This format needs our extended in-browser decoder, so very large ${fl} files may take a few extra seconds. Everything still happens on your device.`
    );
  }

  return notes.slice(0, 4);
}

// ── Image editing tools ─────────────────────────────────────────────────────
// Image Resizer / Cropper / Compressor live here (category listing). Their
// route URLs stay exactly /<slug>; only the category changed, not the URLs.
export interface ImageToolDef {
  slug: string;
  name: string;
  description: string;
  category: "Image Tools";
  title: string;
  metaDescription: string;
  tagline: string;
  keywords: string[];
  howTo: { name: string; description: string; steps: { name: string; text: string }[] };
  features: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  related: string[];
}

export const imageTools: ImageToolDef[] = [
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images by exact pixels or percentage with aspect-ratio lock and social presets.",
    category: "Image Tools",
    title: "Free Image Resizer - Resize Photos Online | BeYourTools",
    metaDescription:
      "Resize images online for free by pixels or percentage, with aspect-ratio lock and presets for Instagram, YouTube and X. Works in your browser - no upload.",
    tagline:
      "Big photo, tiny upload slot? Resize any image to the exact dimensions you need in seconds - your file never leaves your browser.",
    keywords: ["image resizer", "resize image online", "resize photo", "picture resizer", "resize png", "resize jpg", "social media image sizes", "image dimensions"],
    howTo: {
      name: "How to resize an image",
      description: "Steps to resize an image using BeYourTools.",
      steps: [
        { name: "Upload your image", text: "Drag and drop an image file or click to browse your device." },
        { name: "Set new dimensions", text: "Enter width and height in pixels, or switch to percent mode and scale by a percentage." },
        { name: "Lock the aspect ratio", text: "Keep the lock toggle on to change one dimension without stretching the other." },
        { name: "Choose a preset (optional)", text: "Pick a ready-made size for Instagram posts, stories, YouTube thumbnails, X headers or Facebook posts." },
        { name: "Download", text: "Choose PNG, JPEG or WebP and download your resized image instantly." },
      ],
    },
    features: [
      { title: "Pixel or percent mode", desc: "Type exact width and height, or scale the whole image by a percentage." },
      { title: "Aspect-ratio lock", desc: "One-click lock keeps proportions correct so nothing gets stretched." },
      { title: "Social media presets", desc: "Instagram post & story, YouTube thumbnail, X header, Facebook post sizes built in." },
      { title: "3 output formats", desc: "Export as PNG for crispness, JPEG for photos, or WebP for the smallest files." },
      { title: "Live preview", desc: "See the resized result before you download - no guesswork." },
      { title: "100% private", desc: "Resizing happens on a canvas in your browser. No uploads, no waiting." },
    ],
    faqs: [
      { question: "Will resizing make my image blurry?", answer: "Scaling down is almost always clean. Scaling up beyond the original size can soften details because the browser has to invent pixels - try to stay at or below 100% when sharpness matters." },
      { question: "How do I resize without stretching my photo?", answer: "Keep the aspect-ratio lock on (it's on by default). Then changing the width automatically recalculates the height, so the image keeps its original proportions." },
      { question: "What's the right size for an Instagram post?", answer: "1080 x 1080 px is the standard square post size. For stories and reels use 1080 x 1920 px. Both are included as one-click presets in the tool." },
      { question: "Which format should I download - PNG, JPEG or WebP?", answer: "Use JPEG for photos (smallest file), PNG for graphics with sharp edges or transparency, and WebP when you want the best quality-to-size ratio for the web." },
      { question: "Is the image resizer really free?", answer: "Yes - no sign-up, no watermarks, no limits. Everything runs in your browser." },
    ],
    related: ["image-cropper", "image-compressor", "favicon-generator"],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description: "Crop images with a drag-to-select box, aspect presets, and live dimension readout.",
    category: "Image Tools",
    title: "Free Image Cropper - Crop Photos Online | BeYourTools",
    metaDescription:
      "Crop images online with a drag-to-select box, aspect presets (1:1, 4:3, 16:9), and live dimensions. Free, private, runs in your browser.",
    tagline:
      "Cut the clutter out of your photos. Drag a box over the part you want to keep - it's that simple, and your image never leaves your device.",
    keywords: ["image cropper", "crop image online", "crop photo", "free photo cropper", "crop to square", "16:9 crop", "crop png", "crop jpg"],
    howTo: {
      name: "How to crop an image",
      description: "Steps to crop an image using BeYourTools.",
      steps: [
        { name: "Upload your image", text: "Drag and drop a photo or click to browse." },
        { name: "Pick an aspect ratio", text: "Choose Free, 1:1, 4:3, 3:2 or 16:9 - or leave it free to draw any shape." },
        { name: "Draw your crop box", text: "Click/touch and drag across the image to select the area you want to keep. Watch the live pixel dimensions." },
        { name: "Apply the crop", text: "Click Apply crop to cut the image to your selection." },
        { name: "Download", text: "Download the cropped result as PNG or JPEG." },
      ],
    },
    features: [
      { title: "Drag-to-select cropping", desc: "Click and drag right on the image to draw your crop box - works with touch too." },
      { title: "Aspect presets", desc: "Free, 1:1, 4:3, 3:2 and 16:9 ratios for avatars, thumbnails and wallpapers." },
      { title: "Live dimensions", desc: "The readout shows your selection's pixel size as you drag, in real time." },
      { title: "Full-resolution output", desc: "Cropping uses the original pixels, not the on-screen preview." },
      { title: "PNG or JPEG download", desc: "Keep transparency with PNG, or go smaller with JPEG." },
      { title: "100% private", desc: "Your photo is cropped on a canvas in your browser and never uploaded." },
    ],
    faqs: [
      { question: "How do I crop a photo into a perfect square?", answer: "Select the 1:1 preset, then drag anywhere on the image. The box stays square automatically - perfect for profile pictures and Instagram posts." },
      { question: "Does cropping reduce image quality?", answer: "No. Cropping just discards pixels outside your selection. The pixels you keep are untouched, so quality stays exactly as the original." },
      { question: "Can I re-crop after applying?", answer: "Yes - the cropped image becomes your new working image, so you can draw another box and crop again as many times as you like." },
      { question: "What if my image is huge?", answer: "The preview scales the image down to fit your screen for comfortable dragging, but the crop is applied to the full-resolution original." },
      { question: "Are my photos uploaded anywhere?", answer: "No. Cropping runs entirely in your browser via the canvas API. Your photos never leave your device." },
    ],
    related: ["image-resizer", "image-compressor", "favicon-generator"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Shrink image file size with a quality slider, format choice and max-dimension scaling.",
    category: "Image Tools",
    title: "Free Image Compressor - Reduce File Size Online | BeYourTools",
    metaDescription:
      "Compress images online with a quality slider, JPEG/WebP/PNG output and max-dimension scaling. See original vs compressed size instantly.",
    tagline:
      "Oversized images slowing your site down? Squeeze them down to a fraction of their size while keeping them looking great - all offline, in your browser.",
    keywords: ["image compressor", "compress image online", "reduce image size", "compress jpg", "compress png", "webp compressor", "image optimizer", "reduce photo file size"],
    howTo: {
      name: "How to compress an image",
      description: "Steps to compress an image using BeYourTools.",
      steps: [
        { name: "Upload your image", text: "Drop a JPEG, PNG or WebP file into the uploader." },
        { name: "Pick an output format", text: "Choose JPEG for photos, WebP for the smallest files, or PNG for lossless graphics." },
        { name: "Move the quality slider", text: "Drag the slider between 1 and 100. The tool re-encodes instantly so you can compare." },
        { name: "Set a max dimension (optional)", text: "Scale huge photos down to a maximum width/height to shrink the file even further." },
        { name: "Download", text: "Check the original vs compressed size and savings percentage, then download." },
      ],
    },
    features: [
      { title: "Quality slider 1-100", desc: "Fine-grained control - find your sweet spot between size and quality." },
      { title: "JPEG, WebP & PNG output", desc: "Re-encode into the format that gives you the smallest file." },
      { title: "Max-dimension scaling", desc: "Optionally downscale oversized images as part of compression." },
      { title: "Before/after stats", desc: "Original size, compressed size and savings percentage shown side by side." },
      { title: "Visual preview", desc: "See exactly what the compressed image looks like before downloading." },
      { title: "100% private", desc: "Compression happens locally - nothing is sent to a server." },
    ],
    faqs: [
      { question: "How much can I compress an image without losing quality?", answer: "For photos, JPEG quality around 75-85 usually cuts 60-80% of the file size with barely visible difference. WebP can go further. The live preview lets you compare before downloading." },
      { question: "Why doesn't PNG compression change the size much?", answer: "PNG is lossless, so the quality slider doesn't apply to it. For PNGs, the biggest savings come from the max-dimension scaling option, or converting the image to WebP." },
      { question: "What's the difference between JPEG and WebP?", answer: "WebP typically produces files 25-35% smaller than JPEG at the same visual quality. All modern browsers support it, so it's a great choice for web images." },
      { question: "Will compressing help my website load faster?", answer: "Yes - images are usually the heaviest part of a page. Smaller files mean faster loads, better SEO and happier visitors on slow connections." },
      { question: "Are my images uploaded to a server?", answer: "No. The compressor re-encodes your image in your browser using the canvas API. Files never leave your device." },
      { question: "Is the image compressor free? Do I need to sign up?", answer: "Completely free, with no sign-up and no watermark on your compressed images. Compress as many images as you like - there are no daily limits." },
      { question: "Does compressing an image remove its EXIF metadata?", answer: "Yes, when the image is re-encoded. The compressor builds a fresh file from the image pixels, so the original EXIF block (GPS location, date, device model) does not carry over. Always check the output file's properties before sharing to confirm. Our guide to removing EXIF metadata from photos before sharing explains the full process, including the cases where metadata survives." },
      { question: "How do I compress an image to a specific file size, like under 200 KB?", answer: "Work down in steps: start at quality 80 and check the reported size, then drop by 10 at a time until you are under your target. If quality alone is not enough, set a max dimension as well, since fewer pixels mean a smaller file at any quality. Switching a photo from JPEG to WebP at the same step usually saves another 25 to 35 percent." },
      { question: "Should I resize before or after compressing?", answer: "Resize first. Shrink the image to the size it will actually be displayed at using the Image Resizer, then compress that smaller file. Compressing a 4000-pixel photo that will only ever be shown at 800 pixels wastes quality budget on pixels nobody will see." },
    ],
    related: ["image-resizer", "image-cropper", "favicon-generator"],
  },
  {
  slug: "youtube-thumbnail-downloader",
  name: "YouTube Thumbnail Downloader",
  description: "Download any YouTube video's thumbnail image in all available qualities.",
  category: "Image Tools",
  title: "YouTube Thumbnail Downloader - Save Video Thumbnails | BeYourTools",
  metaDescription:
    "Download YouTube thumbnails free in HD, SD and small sizes. Paste any YouTube link - watch, Shorts, youtu.be or embed - and save the thumbnail image.",
  tagline:
    "Need the thumbnail from a YouTube video? Paste the link and grab the preview image in every available size - straight from your browser.",
  keywords: ["youtube thumbnail downloader", "download youtube thumbnail", "yt thumbnail saver", "youtube thumbnail grabber", "save youtube preview image"],
  howTo: {
    name: "How to download a YouTube thumbnail",
    description: "Steps to save a YouTube video thumbnail.",
    steps: [
      { name: "Paste the video link", text: "Copy any YouTube URL - watch pages, Shorts, youtu.be short links and embeds all work." },
      { name: "Preview the qualities", text: "The tool extracts the video ID and shows every public thumbnail size, from small to full HD." },
      { name: "Download", text: "Hit Download under the size you want. The image saves straight to your device." },
    ],
  },
  features: [
    { title: "All URL formats", desc: "youtube.com/watch, youtu.be, /shorts/ and /embed/ links are all recognised." },
    { title: "Every public quality", desc: "Default, MQ, HQ, SD and maxres HD previews side by side." },
    { title: "One-click downloads", desc: "Each size has its own Download button - no right-click needed." },
    { title: "Instant validation", desc: "Invalid links get a clear error message instead of a broken image." },
    { title: "100% private", desc: "Only the public thumbnail image is fetched. Nothing is uploaded." },
  ],
  faqs: [
    { question: "Does this download the YouTube video itself?", answer: "No. This tool downloads only the public thumbnail image - the small preview picture YouTube shows for a video. It cannot download video or audio, and it can't touch private or deleted videos." },
    { question: "Which YouTube links work?", answer: "Standard watch URLs (youtube.com/watch?v=...), short links (youtu.be/...), Shorts (/shorts/...) and embeds (/embed/...) all work. The tool pulls out the 11-character video ID from any of them." },
    { question: "Why is the HD thumbnail small for some videos?", answer: "YouTube only generates the maxres 1280x720 thumbnail for some uploads. If the uploader's video didn't get one, YouTube serves a smaller image in its place - that's YouTube's doing, not the tool's." },
    { question: "Is it free? Do I need an account?", answer: "Completely free, no account, no limits. Thumbnails are public images, so fetching them needs no login." },
    { question: "Is it legal to download a thumbnail?", answer: "Thumbnails belong to the video's owner, so only reuse thumbnails you own or have permission to use. Downloading one for personal reference is generally fine; republishing someone else's thumbnail as your own is not." },
    { question: "Are my pasted links stored anywhere?", answer: "No. The link is parsed in your browser's memory and never sent to any server - the thumbnail images load directly from YouTube's image servers." },
  ],
  related: ["image-resizer", "image-compressor", "favicon-generator"],
  },
];

export function getImageTool(slug: string): ImageToolDef | undefined {
  return imageTools.find((t) => t.slug === slug);
}


