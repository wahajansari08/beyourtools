import { describeJsonError } from "./formatter";

export interface ValidationResult {
  valid: boolean;
  error: string | null;
  parsed?: unknown;
}

export function validateJson(input: string): ValidationResult {
  if (!input.trim()) {
    return { valid: false, error: "Input is empty." };
  }
  try {
    const parsed = JSON.parse(input);
    return { valid: true, error: null, parsed };
  } catch (e) {
    return { valid: false, error: describeJsonError(e, input) };
  }
}

export interface JsonlValidationLine {
  line: number;
  valid: boolean;
  error: string | null;
}

export function validateJsonl(input: string): JsonlValidationLine[] {
  const lines = input.split("\n");
  const results: JsonlValidationLine[] = [];
  lines.forEach((raw, idx) => {
    const text = raw.trim();
    if (!text) return;
    try {
      JSON.parse(text);
      results.push({ line: idx + 1, valid: true, error: null });
    } catch (e) {
      results.push({ line: idx + 1, valid: false, error: e instanceof Error ? e.message : "Invalid JSON" });
    }
  });
  return results;
}
