export type DiffType = "added" | "removed" | "changed" | "unchanged";

export interface DiffEntry {
  path: string;
  type: DiffType;
  left?: unknown;
  right?: unknown;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Produces a flat list of differences between two JSON values, keyed by path. */
export function diffJson(left: unknown, right: unknown, path = "$"): DiffEntry[] {
  const entries: DiffEntry[] = [];

  const bothObjects = isObject(left) && isObject(right);
  const bothArrays = Array.isArray(left) && Array.isArray(right);

  if (bothObjects) {
    const l = left as Record<string, unknown>;
    const r = right as Record<string, unknown>;
    const keys = Array.from(new Set([...Object.keys(l), ...Object.keys(r)])).sort();
    for (const key of keys) {
      const childPath = `${path}.${key}`;
      if (!(key in l)) {
        entries.push({ path: childPath, type: "added", right: r[key] });
      } else if (!(key in r)) {
        entries.push({ path: childPath, type: "removed", left: l[key] });
      } else {
        entries.push(...diffJson(l[key], r[key], childPath));
      }
    }
  } else if (bothArrays) {
    const l = left as unknown[];
    const r = right as unknown[];
    const max = Math.max(l.length, r.length);
    for (let i = 0; i < max; i++) {
      const childPath = `${path}[${i}]`;
      if (i >= l.length) {
        entries.push({ path: childPath, type: "added", right: r[i] });
      } else if (i >= r.length) {
        entries.push({ path: childPath, type: "removed", left: l[i] });
      } else {
        entries.push(...diffJson(l[i], r[i], childPath));
      }
    }
  } else {
    const equal = JSON.stringify(left) === JSON.stringify(right);
    if (!equal) {
      entries.push({ path, type: "changed", left, right });
    }
  }

  return entries;
}

export function summarizeDiff(entries: DiffEntry[]) {
  return {
    added: entries.filter((e) => e.type === "added").length,
    removed: entries.filter((e) => e.type === "removed").length,
    changed: entries.filter((e) => e.type === "changed").length,
  };
}
