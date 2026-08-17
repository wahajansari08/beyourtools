export interface JwtDecodeResult {
  header: unknown;
  payload: unknown;
  signature: string;
  error: string | null;
  expired?: boolean;
  expiresAt?: string;
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(segment.length + ((4 - (segment.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Decodes a JWT's header and payload. This does NOT verify the signature. */
export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: "", error: "A JWT must have 3 parts separated by dots." };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    let expired: boolean | undefined;
    let expiresAt: string | undefined;
    if (payload && typeof payload.exp === "number") {
      expiresAt = new Date(payload.exp * 1000).toISOString();
      expired = Date.now() > payload.exp * 1000;
    }
    return { header, payload, signature: parts[2], error: null, expired, expiresAt };
  } catch {
    return { header: null, payload: null, signature: "", error: "Could not decode token. Check it's a valid JWT." };
  }
}
