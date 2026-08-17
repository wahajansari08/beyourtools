export type ToolCategory =
  | "Format & Validate"
  | "Compare & Manipulate"
  | "Convert"
  | "Generate & Schema"
  | "Encode & Inspect";

export interface ToolDef {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: ToolCategory;
  /** Implemented tools render their real page; others show a "coming soon" state. */
  live: boolean;
}

export const categories: ToolCategory[] = [
  "Format & Validate",
  "Compare & Manipulate",
  "Convert",
  "Generate & Schema",
  "Encode & Inspect",
];

export const tools: ToolDef[] = [
  // Format & Validate
  { slug: "json-formatter", name: "JSON Formatter", short: "Format", description: "Pretty-print JSON with custom indentation.", category: "Format & Validate", live: true },
  { slug: "json-beautifier", name: "JSON Beautifier", short: "Beautify", description: "Clean up messy JSON into a readable layout.", category: "Format & Validate", live: true },
  { slug: "json-validator", name: "JSON Validator", short: "Validate", description: "Check JSON syntax and get precise error locations.", category: "Format & Validate", live: true },
  { slug: "json-minifier", name: "JSON Minifier", short: "Minify", description: "Strip whitespace to shrink JSON payloads.", category: "Format & Validate", live: true },
  { slug: "json-viewer", name: "JSON Viewer / Tree", short: "Viewer", description: "Explore JSON as a collapsible tree.", category: "Format & Validate", live: true },
  { slug: "json-editor", name: "JSON Editor", short: "Editor", description: "Edit JSON with a live tree preview.", category: "Format & Validate", live: true },
  { slug: "json-repair", name: "JSON Repair", short: "Repair", description: "Fix common JSON mistakes automatically.", category: "Format & Validate", live: true },
  { slug: "jsonl-formatter", name: "JSONL Formatter", short: "Format", description: "Pretty-print each line of a JSONL file.", category: "Format & Validate", live: true },
  { slug: "jsonl-validator", name: "JSONL Validator", short: "Validate", description: "Validate every line of a JSONL file independently.", category: "Format & Validate", live: true },

  // Compare & Manipulate
  { slug: "json-diff", name: "JSON Diff / Compare", short: "Diff", description: "Compare two JSON documents side by side.", category: "Compare & Manipulate", live: true },
  { slug: "json-sorter", name: "JSON Sorter", short: "Sort", description: "Sort object keys alphabetically, recursively.", category: "Compare & Manipulate", live: true },
  { slug: "json-merge", name: "JSON Merge", short: "Merge", description: "Deep-merge two JSON objects into one.", category: "Compare & Manipulate", live: true },
  { slug: "json-flatten", name: "JSON Flatten / Unflatten", short: "Flatten", description: "Flatten nested JSON to dot paths, or rebuild it.", category: "Compare & Manipulate", live: true },
  { slug: "jsonpath-tester", name: "JSONPath Tester", short: "Query", description: "Run JSONPath expressions against your JSON.", category: "Compare & Manipulate", live: false },

  // Convert
  { slug: "json-to-csv", name: "JSON → CSV", short: "To CSV", description: "Turn a JSON array into a CSV file.", category: "Convert", live: true },
  { slug: "csv-to-json", name: "CSV → JSON", short: "From CSV", description: "Turn CSV rows into a JSON array.", category: "Convert", live: true },
  { slug: "json-to-yaml", name: "JSON → YAML", short: "To YAML", description: "Convert JSON to readable YAML.", category: "Convert", live: true },
  { slug: "yaml-to-json", name: "YAML → JSON", short: "From YAML", description: "Convert YAML documents into JSON.", category: "Convert", live: true },
  { slug: "json-to-xml", name: "JSON → XML", short: "To XML", description: "Convert JSON objects into XML markup.", category: "Convert", live: true },
  { slug: "xml-to-json", name: "XML → JSON", short: "From XML", description: "Convert XML documents into JSON.", category: "Convert", live: true },
  { slug: "json-to-typescript", name: "JSON → TypeScript", short: "To TS", description: "Generate TypeScript interfaces from JSON.", category: "Convert", live: false },
  { slug: "json-to-python", name: "JSON → Python", short: "To Python", description: "Generate Python dataclasses from JSON.", category: "Convert", live: false },
  { slug: "json-to-sql", name: "JSON → SQL", short: "To SQL", description: "Generate SQL CREATE TABLE + INSERT statements.", category: "Convert", live: false },
  { slug: "json-to-excel", name: "JSON → Excel", short: "To Excel", description: "Export a JSON array as an .xlsx workbook.", category: "Convert", live: false },

  // Generate & Schema
  { slug: "json-schema-generator", name: "JSON Schema Generator", short: "Schema", description: "Infer a JSON Schema from sample data.", category: "Generate & Schema", live: false },
  { slug: "json-schema-validator", name: "JSON Schema Validator", short: "Validate", description: "Validate JSON against a JSON Schema.", category: "Generate & Schema", live: false },
  { slug: "json-generator", name: "JSON Generator", short: "Generate", description: "Generate mock JSON data from a template.", category: "Generate & Schema", live: false },

  // Encode & Inspect
  { slug: "base64", name: "Base64 Encode/Decode", short: "Base64", description: "Encode or decode Base64 text.", category: "Encode & Inspect", live: true },
  { slug: "jwt-decoder", name: "JWT Decoder", short: "JWT", description: "Decode a JWT's header and payload.", category: "Encode & Inspect", live: true },
  { slug: "json-token-counter", name: "JSON Token Counter", short: "Tokens", description: "Estimate LLM token count for a JSON payload.", category: "Encode & Inspect", live: true },
];

export function getTool(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory): ToolDef[] {
  return tools.filter((t) => t.category === category);
}
