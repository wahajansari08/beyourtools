export interface SortResult {
  output: string;
  error: string | null;
}

function sortValue(value: unknown, order: "asc" | "desc"): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => sortValue(v, order));
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      order === "asc" ? a.localeCompare(b) : b.localeCompare(a)
    );
    const result: Record<string, unknown> = {};
    for (const [k, v] of entries) {
      result[k] = sortValue(v, order);
    }
    return result;
  }
  return value;
}

export function sortJsonKeys(input: string, order: "asc" | "desc" = "asc", indent = 2): SortResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = JSON.parse(input);
    const sorted = sortValue(parsed, order);
    return { output: JSON.stringify(sorted, null, indent), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
