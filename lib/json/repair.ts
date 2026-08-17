export interface RepairResult {
  output: string;
  error: string | null;
  fixes: string[];
  wasAlreadyValid: boolean;
}

/**
 * Attempts to repair common JSON mistakes: trailing commas, single-quoted
 * strings, unquoted keys, JS-style comments, and stray NaN/Infinity/undefined.
 * This is heuristic, not a full parser - it aims to handle the common cases
 * people hit when pasting JS objects or hand-edited JSON.
 */
export function repairJson(input: string): RepairResult {
  const fixes: string[] = [];

  if (!input.trim()) {
    return { output: "", error: null, fixes: [], wasAlreadyValid: false };
  }

  // Fast path: already valid.
  try {
    JSON.parse(input);
    return { output: JSON.stringify(JSON.parse(input), null, 2), error: null, fixes: [], wasAlreadyValid: true };
  } catch {
    // fall through to repair
  }

  let text = input;

  // Remove // line comments and /* */ block comments (outside strings, best-effort).
  const withoutBlockComments = text.replace(/\/\*[\s\S]*?\*\//g, "");
  if (withoutBlockComments !== text) fixes.push("Removed block comments");
  text = withoutBlockComments;

  const withoutLineComments = text.replace(/(^|[^:])\/\/.*$/gm, "$1");
  if (withoutLineComments !== text) fixes.push("Removed line comments");
  text = withoutLineComments;

  // Replace single-quoted strings with double-quoted strings.
  const singleQuoteFixed = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_m, inner) => {
    const escaped = inner.replace(/"/g, '\\"');
    return `"${escaped}"`;
  });
  if (singleQuoteFixed !== text) fixes.push("Converted single quotes to double quotes");
  text = singleQuoteFixed;

  // Quote unquoted object keys: { key: 1 } -> { "key": 1 }
  const unquotedKeysFixed = text.replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)(\s*:)/g, '$1"$2"$3');
  if (unquotedKeysFixed !== text) fixes.push("Quoted unquoted object keys");
  text = unquotedKeysFixed;

  // Remove trailing commas before } or ]
  const trailingCommaFixed = text.replace(/,\s*([}\]])/g, "$1");
  if (trailingCommaFixed !== text) fixes.push("Removed trailing commas");
  text = trailingCommaFixed;

  // Replace undefined with null
  const undefinedFixed = text.replace(/:\s*undefined/g, ": null");
  if (undefinedFixed !== text) fixes.push("Replaced undefined with null");
  text = undefinedFixed;

  // Replace NaN / Infinity with null (not valid JSON)
  const nanFixed = text.replace(/:\s*(NaN|Infinity|-Infinity)/g, ": null");
  if (nanFixed !== text) fixes.push("Replaced NaN/Infinity with null");
  text = nanFixed;

  try {
    const parsed = JSON.parse(text);
    return { output: JSON.stringify(parsed, null, 2), error: null, fixes, wasAlreadyValid: false };
  } catch (e) {
    return {
      output: text,
      error: `Could not fully repair: ${e instanceof Error ? e.message : "Invalid JSON"}`,
      fixes,
      wasAlreadyValid: false,
    };
  }
}
