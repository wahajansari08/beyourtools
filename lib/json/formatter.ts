export interface FormatResult {
  output: string;
  error: string | null;
}

export interface FormatOptions {
  /** number of spaces, or "tab" for tab indentation */
  indent?: number | "tab";
  /** recursively sort object keys A-Z */
  sortKeys?: boolean;
}

/** Recursively sorts object keys A-Z (arrays keep their order). */
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      out[k] = sortKeysDeep((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}

/**
 * Formats a JSON string with the given indentation.
 * indent: number of spaces, or "tab" for tab indentation.
 */
export function formatJson(input: string, indent?: number | "tab", sortKeys?: boolean): FormatResult;
export function formatJson(input: string, options: FormatOptions): FormatResult;
export function formatJson(
  input: string,
  indentOrOptions?: number | "tab" | FormatOptions,
  sortKeysParam?: boolean
): FormatResult {
  const opts: FormatOptions =
    typeof indentOrOptions === "object"
      ? indentOrOptions
      : { indent: indentOrOptions ?? 2, sortKeys: sortKeysParam ?? false };
  const indent = opts.indent ?? 2;
  if (!input.trim()) {
    return { output: "", error: null };
  }
  try {
    let parsed: unknown = JSON.parse(input);
    if (opts.sortKeys) parsed = sortKeysDeep(parsed);
    const space = indent === "tab" ? "\t" : indent;
    const output = JSON.stringify(parsed, null, space);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: describeJsonError(e, input) };
  }
}

/** Produces a friendlier error message with line/column when possible. */
export function describeJsonError(e: unknown, input: string): string {
  const message = e instanceof Error ? e.message : "Invalid JSON";
  const match = message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1], 10);
    const { line, column } = positionToLineColumn(input, pos);
    return `${message} (line ${line}, column ${column})`;
  }
  return message;
}

export function positionToLineColumn(input: string, pos: number): { line: number; column: number } {
  const upToPos = input.slice(0, pos);
  const lines = upToPos.split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}
