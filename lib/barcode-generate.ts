/**
 * Barcode generation helpers using JsBarcode.
 * Returns { svgString, pngDataUrl } or throws with a user-friendly message.
 */

export interface BarcodeOptions {
  format: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  margin?: number;
  lineColor?: string;
  background?: string;
}

export async function generateBarcode(
  value: string,
  options: BarcodeOptions
): Promise<{ svgString: string; pngDataUrl: string }> {
  const JsBarcode = (await import("jsbarcode")).default;

  // --- SVG ---
  const svgNS = "http://www.w3.org/2000/svg";
  const svgEl = document.createElementNS(svgNS, "svg");

  try {
    JsBarcode(svgEl, value, {
      format: options.format,
      width: options.width ?? 2,
      height: options.height ?? 100,
      displayValue: options.displayValue ?? true,
      fontSize: options.fontSize ?? 14,
      margin: options.margin ?? 10,
      lineColor: options.lineColor ?? "#000000",
      background: options.background ?? "#ffffff",
      valid: (valid: boolean) => {
        if (!valid) throw new Error(`"${value}" is not valid for the ${options.format} barcode format.`);
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid barcode value.";
    throw new Error(msg);
  }

  const svgString = new XMLSerializer().serializeToString(svgEl);

  // --- PNG via canvas ---
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  const pngDataUrl = await new Promise<string>((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width || 300;
      canvas.height = img.height || 150;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(svgUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Failed to render barcode to PNG."));
    };
    img.src = svgUrl;
  });

  return { svgString, pngDataUrl };
}

// ─── UPC-A check digit ─────────────────────────────────────────────────────

/** Calculate UPC-A check digit from 11-digit string */
export function calcUPCACheckDigit(digits11: string): string {
  if (!/^\d{11}$/.test(digits11)) throw new Error("UPC-A requires exactly 11 digits.");
  let odd = 0, even = 0;
  for (let i = 0; i < 11; i++) {
    const d = parseInt(digits11[i], 10);
    if (i % 2 === 0) odd += d;
    else even += d;
  }
  const total = odd * 3 + even;
  return String((10 - (total % 10)) % 10);
}

/** Validate a complete 12-digit UPC-A */
export function validateUPCA(digits12: string): boolean {
  if (!/^\d{12}$/.test(digits12)) return false;
  return calcUPCACheckDigit(digits12.slice(0, 11)) === digits12[11];
}

// ─── EAN-13 check digit ────────────────────────────────────────────────────

/** Calculate EAN-13 check digit from 12-digit string */
export function calcEAN13CheckDigit(digits12: string): string {
  if (!/^\d{12}$/.test(digits12)) throw new Error("EAN-13 requires exactly 12 digits before the check digit.");
  let odd = 0, even = 0;
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digits12[i], 10);
    if (i % 2 === 0) odd += d;
    else even += d;
  }
  const total = odd + even * 3;
  return String((10 - (total % 10)) % 10);
}

/** Validate a complete 13-digit EAN-13 */
export function validateEAN13(digits13: string): boolean {
  if (!/^\d{13}$/.test(digits13)) return false;
  return calcEAN13CheckDigit(digits13.slice(0, 12)) === digits13[12];
}

// ─── EAN-8 check digit ─────────────────────────────────────────────────────

export function calcEAN8CheckDigit(digits7: string): string {
  if (!/^\d{7}$/.test(digits7)) throw new Error("EAN-8 requires exactly 7 digits before the check digit.");
  let odd = 0, even = 0;
  for (let i = 0; i < 7; i++) {
    const d = parseInt(digits7[i], 10);
    if (i % 2 === 0) odd += d;
    else even += d;
  }
  const total = odd * 3 + even;
  return String((10 - (total % 10)) % 10);
}

export function validateEAN8(digits8: string): boolean {
  if (!/^\d{8}$/.test(digits8)) return false;
  return calcEAN8CheckDigit(digits8.slice(0, 7)) === digits8[7];
}
