export interface JsonPathResult {
  matches: { path: string; value: unknown }[];
  error: string | null;
}

/** Tokenises a JSONPath expression into path segments. */
function tokenise(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  // Strip leading "$"
  if (expr[i] === "$") i++;

  while (i < expr.length) {
    if (expr[i] === ".") {
      i++;
      if (expr[i] === ".") {
        // recursive descent ".."
        tokens.push("..");
        i++;
      }
      // read key
      const start = i;
      while (i < expr.length && expr[i] !== "." && expr[i] !== "[") i++;
      const key = expr.slice(start, i);
      if (key) tokens.push(key);
    } else if (expr[i] === "[") {
      i++;
      const start = i;
      while (i < expr.length && expr[i] !== "]") i++;
      tokens.push(`[${expr.slice(start, i)}]`);
      i++; // skip "]"
    } else {
      // bare key at root level (e.g. "key" without leading ".")
      const start = i;
      while (i < expr.length && expr[i] !== "." && expr[i] !== "[") i++;
      tokens.push(expr.slice(start, i));
    }
  }
  return tokens.filter(Boolean);
}

function matchesFilter(value: unknown, filter: string): boolean {
  // Simple subset: @.key == "val", @.key > num, @.key < num, @.key != "val"
  const eqStr = filter.match(/^@\.(\w+)\s*==\s*"([^"]*)"$/);
  if (eqStr) return (value as Record<string, unknown>)?.[eqStr[1]] === eqStr[2];

  const eqNum = filter.match(/^@\.(\w+)\s*==\s*(-?\d+(?:\.\d+)?)$/);
  if (eqNum) return (value as Record<string, unknown>)?.[eqNum[1]] === Number(eqNum[2]);

  const neqStr = filter.match(/^@\.(\w+)\s*!=\s*"([^"]*)"$/);
  if (neqStr) return (value as Record<string, unknown>)?.[neqStr[1]] !== neqStr[2];

  const gt = filter.match(/^@\.(\w+)\s*>\s*(-?\d+(?:\.\d+)?)$/);
  if (gt) return Number((value as Record<string, unknown>)?.[gt[1]]) > Number(gt[2]);

  const lt = filter.match(/^@\.(\w+)\s*<\s*(-?\d+(?:\.\d+)?)$/);
  if (lt) return Number((value as Record<string, unknown>)?.[lt[1]]) < Number(lt[2]);

  // @.key - existence check
  const exists = filter.match(/^@\.(\w+)$/);
  if (exists) return (value as Record<string, unknown>)?.[exists[1]] !== undefined;

  return false;
}

function query(
  node: unknown,
  tokens: string[],
  currentPath: string,
  results: { path: string; value: unknown }[]
) {
  if (tokens.length === 0) {
    results.push({ path: currentPath, value: node });
    return;
  }

  const [head, ...tail] = tokens;

  if (head === "..") {
    // Recursive descent: apply rest of tokens to current node and all descendants
    query(node, tail, currentPath, results);
    if (Array.isArray(node)) {
      node.forEach((child, i) => query(child, tokens, `${currentPath}[${i}]`, results));
    } else if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
        query(child, tokens, `${currentPath}.${key}`, results);
      }
    }
    return;
  }

  if (head === "*") {
    if (Array.isArray(node)) {
      node.forEach((child, i) => query(child, tail, `${currentPath}[${i}]`, results));
    } else if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
        query(child, tail, `${currentPath}.${key}`, results);
      }
    }
    return;
  }

  // Bracket notation: [0], ['key'], [*], [0,1], [0:3], [?(...)]
  if (head.startsWith("[") && head.endsWith("]")) {
    const inner = head.slice(1, -1).trim();

    // Filter: [?(...)]
    const filterMatch = inner.match(/^\?\((.+)\)$/);
    if (filterMatch) {
      if (Array.isArray(node)) {
        node.forEach((child, i) => {
          if (matchesFilter(child, filterMatch[1].trim())) {
            query(child, tail, `${currentPath}[${i}]`, results);
          }
        });
      }
      return;
    }

    // Wildcard [*]
    if (inner === "*") {
      if (Array.isArray(node)) {
        node.forEach((child, i) => query(child, tail, `${currentPath}[${i}]`, results));
      } else if (node && typeof node === "object") {
        for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
          query(child, tail, `${currentPath}.${key}`, results);
        }
      }
      return;
    }

    // Slice [start:end]
    if (/^-?\d*:-?\d*$/.test(inner)) {
      if (Array.isArray(node)) {
        const [startStr, endStr] = inner.split(":");
        const len = node.length;
        let start = startStr ? parseInt(startStr) : 0;
        let end = endStr ? parseInt(endStr) : len;
        if (start < 0) start = Math.max(0, len + start);
        if (end < 0) end = Math.max(0, len + end);
        end = Math.min(end, len);
        for (let i = start; i < end; i++) query(node[i], tail, `${currentPath}[${i}]`, results);
      }
      return;
    }

    // Union [0,1,2] or ['a','b']
    if (inner.includes(",")) {
      const parts = inner.split(",").map((p) => p.trim().replace(/^['"]|['"]$/g, ""));
      for (const part of parts) {
        const idx = Number(part);
        if (!isNaN(idx) && Array.isArray(node) && idx < node.length) {
          query(node[idx < 0 ? node.length + idx : idx], tail, `${currentPath}[${idx}]`, results);
        } else if (node && typeof node === "object") {
          const child = (node as Record<string, unknown>)[part];
          if (child !== undefined) query(child, tail, `${currentPath}.${part}`, results);
        }
      }
      return;
    }

    // String key or numeric index
    const unquoted = inner.replace(/^['"]|['"]$/g, "");
    const idx = Number(unquoted);
    if (!isNaN(idx) && Array.isArray(node)) {
      const resolved = idx < 0 ? node.length + idx : idx;
      if (resolved >= 0 && resolved < node.length) query(node[resolved], tail, `${currentPath}[${resolved}]`, results);
    } else if (node && typeof node === "object") {
      const child = (node as Record<string, unknown>)[unquoted];
      if (child !== undefined) query(child, tail, `${currentPath}.${unquoted}`, results);
    }
    return;
  }

  // Plain key
  if (node && typeof node === "object" && !Array.isArray(node)) {
    const child = (node as Record<string, unknown>)[head];
    if (child !== undefined) query(child, tail, `${currentPath}.${head}`, results);
  }
}

/**
 * Evaluate a JSONPath expression against a parsed JSON value.
 * Supports: $, ., .., *, [n], ['key'], [start:end], [a,b], [?(filter)]
 */
export function evaluateJsonPath(jsonInput: string, expression: string): JsonPathResult {
  if (!jsonInput.trim()) return { matches: [], error: null };
  if (!expression.trim()) return { matches: [], error: null };

  let root: unknown;
  try {
    root = JSON.parse(jsonInput);
  } catch (e) {
    return { matches: [], error: `JSON parse error: ${e instanceof Error ? e.message : "Invalid JSON"}` };
  }

  if (!expression.trim().startsWith("$")) {
    return { matches: [], error: 'Expression must start with "$".' };
  }

  try {
    const tokens = tokenise(expression.trim());
    const results: { path: string; value: unknown }[] = [];
    query(root, tokens, "$", results);
    return { matches: results, error: null };
  } catch (e) {
    return { matches: [], error: `Expression error: ${e instanceof Error ? e.message : "Unknown error"}` };
  }
}
