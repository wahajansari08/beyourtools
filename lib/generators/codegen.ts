// ─── Shared helpers ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = any;

function inferType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as string;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c: string) => c.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[^a-z0-9_]/g, "_");
}

// ─── TypeScript codegen ───────────────────────────────────────────────────────

const tsInterfaces: Map<string, string> = new Map();

function tsTypeOf(value: unknown, key: string, depth: number): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const itemType = tsTypeOf(value[0], key, depth);
    return `${itemType}[]`;
  }
  if (typeof value === "object") {
    const name = toPascalCase(key) || `Nested${depth}`;
    buildTsInterface(value as Record<string, unknown>, name, depth + 1);
    return name;
  }
  if (typeof value === "number") return Number.isInteger(value) ? "number" : "number";
  return typeof value;
}

function buildTsInterface(obj: Record<string, unknown>, name: string, depth: number) {
  if (tsInterfaces.has(name)) return;
  const lines: string[] = [`interface ${name} {`];
  for (const [key, value] of Object.entries(obj)) {
    const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    lines.push(`  ${safeName}: ${tsTypeOf(value, key, depth)};`);
  }
  lines.push("}");
  tsInterfaces.set(name, lines.join("\n"));
}

export interface CodegenResult {
  output: string;
  error: string | null;
}

export function jsonToTypeScript(input: string, rootName = "Root"): CodegenResult {
  if (!input.trim()) return { output: "", error: null };
  tsInterfaces.clear();
  try {
    const parsed: unknown = JSON.parse(input);
    const root = Array.isArray(parsed) ? (parsed[0] ?? {}) : parsed;
    if (typeof root !== "object" || root === null) {
      return { output: `type ${rootName} = ${typeof root};`, error: null };
    }
    buildTsInterface(root as Record<string, unknown>, toPascalCase(rootName), 0);
    const output = Array.from(tsInterfaces.values()).reverse().join("\n\n");
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

// ─── Python dataclass codegen ────────────────────────────────────────────────

const pyClasses: Map<string, string> = new Map();

function pyTypeOf(value: unknown, key: string, depth: number): string {
  if (value === null) return "Optional[Any]";
  if (Array.isArray(value)) {
    if (value.length === 0) return "List[Any]";
    return `List[${pyTypeOf(value[0], key, depth)}]`;
  }
  if (typeof value === "object") {
    const name = toPascalCase(key) || `Nested${depth}`;
    buildPyClass(value as Record<string, unknown>, name, depth + 1);
    return `"${name}"`;
  }
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "float";
  if (typeof value === "string") return "str";
  return "Any";
}

function buildPyClass(obj: Record<string, unknown>, name: string, depth: number) {
  if (pyClasses.has(name)) return;
  const lines: string[] = [`@dataclass`, `class ${name}:`];
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    lines.push("    pass");
  } else {
    for (const [key, value] of entries) {
      const safeName = toSnakeCase(key) || `field_${key}`;
      lines.push(`    ${safeName}: ${pyTypeOf(value, key, depth)}`);
    }
  }
  pyClasses.set(name, lines.join("\n"));
}

export function jsonToPython(input: string, rootName = "Root"): CodegenResult {
  if (!input.trim()) return { output: "", error: null };
  pyClasses.clear();
  try {
    const parsed: unknown = JSON.parse(input);
    const root = Array.isArray(parsed) ? (parsed[0] ?? {}) : parsed;
    if (typeof root !== "object" || root === null) {
      return { output: `# primitive value: ${typeof root}`, error: null };
    }
    buildPyClass(root as Record<string, unknown>, toPascalCase(rootName), 0);
    const header = "from __future__ import annotations\nfrom dataclasses import dataclass\nfrom typing import Any, List, Optional\n\n";
    const output = header + Array.from(pyClasses.values()).reverse().join("\n\n");
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

// ─── SQL codegen ─────────────────────────────────────────────────────────────

function sqlTypeOf(value: unknown): string {
  if (value === null) return "TEXT";
  if (typeof value === "boolean") return "BOOLEAN";
  if (typeof value === "number") return Number.isInteger(value) ? "INTEGER" : "REAL";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)) return "TIMESTAMP";
    return value.length > 255 ? "TEXT" : "VARCHAR(255)";
  }
  return "TEXT"; // objects / arrays → serialised
}

function sqlEscape(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") return String(value);
  const str = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `'${str.replace(/'/g, "''")}'`;
}

export function jsonToSql(input: string, tableName = "records"): CodegenResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed: unknown = JSON.parse(input);
    const arr: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.length === 0) return { output: "", error: null };

    // Collect all keys
    const keySet = new Set<string>();
    arr.forEach((row) => {
      if (row && typeof row === "object" && !Array.isArray(row)) {
        Object.keys(row as Record<string, unknown>).forEach((k) => keySet.add(k));
      }
    });
    const keys = Array.from(keySet);
    if (keys.length === 0) return { output: "", error: "Expected an array of objects." };

    // Infer types from first non-null sample
    const colTypes: Record<string, string> = {};
    for (const key of keys) {
      for (const row of arr) {
        const v = (row as Record<string, unknown>)[key];
        if (v !== null && v !== undefined) { colTypes[key] = sqlTypeOf(v); break; }
      }
      if (!colTypes[key]) colTypes[key] = "TEXT";
    }

    const safeName = toSnakeCase(tableName) || "records";
    const cols = keys.map((k) => `  ${toSnakeCase(k)} ${colTypes[k]}`).join(",\n");
    const create = `CREATE TABLE IF NOT EXISTS ${safeName} (\n${cols}\n);\n`;

    const inserts = arr
      .map((row) => {
        const values = keys.map((k) => {
          const v = (row as Record<string, unknown>)[k];
          return sqlEscape(typeof v === "object" && v !== null ? JSON.stringify(v) : v);
        });
        return `INSERT INTO ${safeName} (${keys.map(toSnakeCase).join(", ")}) VALUES (${values.join(", ")});`;
      })
      .join("\n");

    return { output: `${create}\n${inserts}`, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

// ─── Shared type-inference helper (used by schema generator) ─────────────────
export { inferType, toPascalCase };
