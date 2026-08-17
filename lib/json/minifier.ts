import { describeJsonError } from "./formatter";

export interface MinifyResult {
  output: string;
  error: string | null;
  savedBytes?: number;
  savedPercent?: number;
}

export function minifyJson(input: string): MinifyResult {
  if (!input.trim()) {
    return { output: "", error: null };
  }
  try {
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed);
    const before = new Blob([input]).size;
    const after = new Blob([output]).size;
    const savedBytes = Math.max(before - after, 0);
    const savedPercent = before > 0 ? Math.round((savedBytes / before) * 100) : 0;
    return { output, error: null, savedBytes, savedPercent };
  } catch (e) {
    return { output: "", error: describeJsonError(e, input) };
  }
}
