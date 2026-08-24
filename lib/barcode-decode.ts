/**
 * Client-side barcode decode via @zxing/browser.
 * Supports CODE128, CODE39, EAN-13, EAN-8, UPC-A, ITF, etc.
 */
export async function decodeBarcodeFromFile(file: File): Promise<{ text: string; format: string }> {
  const { BrowserMultiFormatReader } = await import("@zxing/browser");
  const reader = new BrowserMultiFormatReader();

  const url = URL.createObjectURL(file);
  try {
    const result = await reader.decodeFromImageUrl(url);
    return {
      text: result.getText(),
      format: result.getBarcodeFormat().toString(),
    };
  } catch {
    throw new Error(
      "No barcode detected in this image. Ensure the barcode is fully visible, well-lit, and not blurry."
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
