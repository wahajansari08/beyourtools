export interface GeneratorResult {
  output: string;
  error: string | null;
}

type Template = unknown;

// Simple seeded PRNG so output is deterministic within a session.
let seed = 42;
function rand(): number {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return ((seed >>> 0) / 0xffffffff);
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number) {
  return parseFloat((rand() * (max - min) + min).toFixed(2));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

// ─── Built-in fakers ─────────────────────────────────────────────────────────

const FIRST_NAMES = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Iris", "Jack"];
const LAST_NAMES = ["Smith", "Jones", "Chen", "Patel", "Kim", "Garcia", "Müller", "Okafor", "Tanaka", "Dubois"];
const DOMAINS = ["example.com", "test.dev", "mail.net", "acme.org"];
const LOREM_WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor"];
const COLORS = ["red", "green", "blue", "yellow", "purple", "orange", "cyan", "magenta"];
const STATUSES = ["active", "inactive", "pending", "archived"];

function fakeDate(): string {
  const y = randInt(2020, 2025);
  const m = String(randInt(1, 12)).padStart(2, "0");
  const d = String(randInt(1, 28)).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fakeDateTime(): string {
  return `${fakeDate()}T${String(randInt(0, 23)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}:00Z`;
}

function fakeUuid(): string {
  const hex = () => randInt(0, 15).toString(16);
  const seg = (n: number) => Array.from({ length: n }, hex).join("");
  return `${seg(8)}-${seg(4)}-4${seg(3)}-${pick(["8","9","a","b"])}${seg(3)}-${seg(12)}`;
}

function fakeEmail(first: string, last: string): string {
  return `${first.toLowerCase()}.${last.toLowerCase()}@${pick(DOMAINS)}`;
}

function fakeUrl(): string {
  return `https://${pick(DOMAINS)}/${pick(LOREM_WORDS)}`;
}

function fakeSentence(): string {
  const len = randInt(4, 8);
  const words = Array.from({ length: len }, () => pick(LOREM_WORDS));
  return words.join(" ").replace(/^./, (c) => c.toUpperCase()) + ".";
}

/**
 * Resolve a {{faker}} placeholder to a generated value.
 * Supported tokens: name, firstName, lastName, email, integer, float,
 * boolean, date, datetime, uuid, url, sentence, color, status,
 * loremWord
 */
function resolvePlaceholder(token: string): unknown {
  const t = token.trim().toLowerCase();
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);

  if (t === "name" || t === "fullname") return `${first} ${last}`;
  if (t === "firstname") return first;
  if (t === "lastname") return last;
  if (t === "email") return fakeEmail(first, last);
  if (t === "url") return fakeUrl();
  if (t === "uuid" || t === "id") return fakeUuid();
  if (t === "date") return fakeDate();
  if (t === "datetime") return fakeDateTime();
  if (t === "boolean") return rand() > 0.5;
  if (t === "color") return pick(COLORS);
  if (t === "status") return pick(STATUSES);
  if (t === "sentence" || t === "lorem") return fakeSentence();
  if (t === "loremword" || t === "word") return pick(LOREM_WORDS);
  if (t.startsWith("integer")) {
    const m = t.match(/integer\((\d+),(\d+)\)/);
    return m ? randInt(Number(m[1]), Number(m[2])) : randInt(1, 1000);
  }
  if (t.startsWith("float")) {
    const m = t.match(/float\((-?[\d.]+),(-?[\d.]+)\)/);
    return m ? randFloat(Number(m[1]), Number(m[2])) : randFloat(0, 100);
  }
  return token; // unknown — return as-is
}

// ─── Template walker ─────────────────────────────────────────────────────────

function resolveString(str: string): unknown {
  // If the entire string is a single {{placeholder}}, return the typed value
  const full = str.match(/^\{\{([^}]+)\}\}$/);
  if (full) return resolvePlaceholder(full[1]);

  // Inline replacements (always returns a string)
  return str.replace(/\{\{([^}]+)\}\}/g, (_m, token) => String(resolvePlaceholder(token)));
}

function generateValue(template: Template, count: number): unknown {
  if (typeof template === "string") return resolveString(template);
  if (typeof template === "number" || typeof template === "boolean") return template;
  if (template === null) return null;

  if (Array.isArray(template)) {
    if (template.length === 0) return [];
    // Special: [{"$repeat": N, "$template": {...}}]
    if (template.length === 1 && template[0] && typeof template[0] === "object") {
      const obj = template[0] as Record<string, unknown>;
      if ("$repeat" in obj) {
        const n = typeof obj["$repeat"] === "number" ? obj["$repeat"] : count;
        const tmpl = obj["$template"] ?? obj;
        return Array.from({ length: n }, () => generateValue(tmpl as Template, count));
      }
    }
    return template.map((item) => generateValue(item as Template, count));
  }

  if (typeof template === "object" && template !== null) {
    const obj = template as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = generateValue(value as Template, count);
    }
    return result;
  }

  return template;
}

/**
 * Generate mock JSON from a template.
 * Template strings containing {{placeholder}} are replaced with fake data.
 * Use {"$repeat": N, "$template": {...}} inside an array to repeat N objects.
 */
export function generateJson(templateInput: string, count = 5): GeneratorResult {
  if (!templateInput.trim()) return { output: "", error: null };
  seed = 42; // reset seed for deterministic output

  try {
    const template: Template = JSON.parse(templateInput);
    const output = generateValue(template, count);
    return { output: JSON.stringify(output, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid template JSON" };
  }
}
