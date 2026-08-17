export interface FormatResult {
  output: string;
  error: string | null;
}

/**
 * Formats a JSON string with the given indentation.
 * indent: number of spaces, or "tab" for tab indentation.
 */
export function formatJson(input: string, indent: number | "tab" = 2): FormatResult {
  if (!input.trim()) {
    return { output: "", error: null };
  }
  try {
    const parsed = JSON.parse(input);
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
