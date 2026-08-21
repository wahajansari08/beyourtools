export type QRBarcodeCategory = "QR Tools" | "Barcode Tools";

export interface QRBarcodeTool {
  slug: string;
  name: string;
  description: string;
  category: QRBarcodeCategory;
  icon: string;
}

export const qrBarcodeTools: QRBarcodeTool[] = [
  // QR Tools
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, WiFi, email, phone, vCard, and more.",
    category: "QR Tools",
    icon: "⬛",
  },
  {
    slug: "qr-code-generator-with-logo",
    name: "QR Code Generator with Logo",
    description: "Generate QR codes with a custom or social logo overlay for URLs, text, WiFi and more.",
    category: "QR Tools",
    icon: "✨",
  },
  {
    slug: "qr-code-scanner",
    name: "QR Code Scanner",
    description: "Scan QR codes using your device camera in real time.",
    category: "QR Tools",
    icon: "📷",
  },
  {
    slug: "qr-code-decoder",
    name: "QR Code Decoder",
    description: "Upload a QR code image and decode its content instantly.",
    category: "QR Tools",
    icon: "🔍",
  },
  {
    slug: "wifi-qr-code-generator",
    name: "WiFi QR Code Generator",
    description: "Create a QR code your guests can scan to join your WiFi network.",
    category: "QR Tools",
    icon: "📶",
  },
  // Barcode Tools
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate barcodes in CODE128, CODE39, EAN-13, UPC, ITF-14 and more.",
    category: "Barcode Tools",
    icon: "📊",
  },
  {
    slug: "barcode-generator-with-logo",
    name: "Barcode Generator with Logo",
    description: "Generate Code 128, EAN-13, EAN-8, UPC-A or Code 39 barcodes with a custom or social logo overlay.",
    category: "Barcode Tools",
    icon: "🏷",
  },
  {
    slug: "barcode-scanner",
    name: "Barcode Scanner",
    description: "Scan barcodes live using your device camera.",
    category: "Barcode Tools",
    icon: "📸",
  },
  {
    slug: "barcode-decoder",
    name: "Barcode Decoder",
    description: "Upload a barcode image and decode its value automatically.",
    category: "Barcode Tools",
    icon: "🔎",
  },
  {
    slug: "upc-barcode-generator",
    name: "UPC Barcode Generator",
    description: "Generate valid UPC-A barcodes with automatic check digit calculation.",
    category: "Barcode Tools",
    icon: "🏷️",
  },
  {
    slug: "ean-barcode-generator",
    name: "EAN Barcode Generator",
    description: "Generate EAN-13 (and EAN-8) barcodes with correct check digit validation.",
    category: "Barcode Tools",
    icon: "🔖",
  },
  {
    slug: "code-128-barcode-generator",
    name: "Code 128 Generator",
    description: "Generate Code 128 barcodes supporting full ASCII text.",
    category: "Barcode Tools",
    icon: "▦",
  },
];

export const qrBarcodeCategories: QRBarcodeCategory[] = ["QR Tools", "Barcode Tools"];

export function getQRBarcodeTool(slug: string): QRBarcodeTool | undefined {
  return qrBarcodeTools.find((t) => t.slug === slug);
}

export function qrBarcodeByCategory(category: QRBarcodeCategory): QRBarcodeTool[] {
  return qrBarcodeTools.filter((t) => t.category === category);
}

/** Related tools: same category, excluding self, max 5 */
export function relatedQRBarcodeTools(slug: string): QRBarcodeTool[] {
  const tool = getQRBarcodeTool(slug);
  if (!tool) return [];
  return qrBarcodeTools
    .filter((t) => t.category === tool.category && t.slug !== slug)
    .slice(0, 5);
}
