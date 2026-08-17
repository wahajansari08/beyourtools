export interface EncodeResult {
  output: string;
  error: string | null;
}

export function base64Encode(input: string): EncodeResult {
  try {
    const bytes = new TextEncoder().encode(input);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return { output: btoa(binary), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Could not encode input" };
  }
}

export function base64Decode(input: string): EncodeResult {
  try {
    const binary = atob(input.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { output: new TextDecoder().decode(bytes), error: null };
  } catch {
    return { output: "", error: "Input is not valid Base64." };
  }
}
