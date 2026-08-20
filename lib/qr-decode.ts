/**
 * Client-side QR decode via @zxing/browser.
 * Returns the decoded text or throws with a user-friendly message.
 */
export async function decodeQRFromFile(file: File): Promise<string> {
  const { BrowserQRCodeReader } = await import("@zxing/browser");
  const reader = new BrowserQRCodeReader();

  const url = URL.createObjectURL(file);
  try {
    const result = await reader.decodeFromImageUrl(url);
    return result.getText();
  } catch {
    throw new Error("No QR code found in this image. Make sure the image is clear and contains a QR code.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function decodeQRFromImageElement(img: HTMLImageElement): Promise<string> {
  const { BrowserQRCodeReader } = await import("@zxing/browser");
  const reader = new BrowserQRCodeReader();
  try {
    const result = await reader.decodeFromImageElement(img);
    return result.getText();
  } catch {
    throw new Error("No QR code found in this image. Make sure the image is clear and contains a QR code.");
  }
}
