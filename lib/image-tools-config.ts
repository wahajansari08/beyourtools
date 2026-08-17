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
