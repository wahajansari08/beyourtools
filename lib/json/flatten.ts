type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function flattenJson(obj: JsonValue, prefix = "", result: Record<string, unknown> = {}): Record<string, unknown> {
  if (obj !== null && typeof obj === "object") {
    const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v] as const) : Object.entries(obj);
    if (entries.length === 0) {
      result[prefix || "$"] = Array.isArray(obj) ? [] : {};
      return result;
    }
    for (const [key, value] of entries) {
      const path = prefix ? `${prefix}.${key}` : key;
      flattenJson(value as JsonValue, path, result);
    }
  } else {
    result[prefix] = obj;
  }
  return result;
}

export function unflattenJson(flat: Record<string, unknown>): unknown {
  const result: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split(".");
    let current: Record<string, unknown> = result;
    keys.forEach((key, idx) => {
      const isLast = idx === keys.length - 1;
      if (isLast) {
        current[key] = value;
      } else {
        const nextIsArray = /^\d+$/.test(keys[idx + 1]);
        if (current[key] === undefined) {
          current[key] = nextIsArray ? [] : {};
        }
        current = current[key] as Record<string, unknown>;
      }
    });
  }
  return result;
}
