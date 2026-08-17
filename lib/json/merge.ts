export interface MergeResult {
  output: string;
  error: string | null;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function deepMerge(base: unknown, override: unknown): unknown {
  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      result[key] = key in base ? deepMerge(base[key], value) : value;
    }
    return result;
  }
  // Arrays and primitives: override wins.
  return override;
}

export function mergeJsonStrings(a: string, b: string): MergeResult {
  if (!a.trim() || !b.trim()) return { output: "", error: null };
  try {
    const left = JSON.parse(a);
    const right = JSON.parse(b);
    const merged = deepMerge(left, right);
    return { output: JSON.stringify(merged, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
