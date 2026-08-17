// JSON Schema Generator & Validator (draft-07 subset)

export interface SchemaResult {
  output: string;
  error: string | null;
}

// ─── Generator ────────────────────────────────────────────────────────────────

type JsonSchema = {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  additionalProperties?: boolean;
  description?: string;
  examples?: unknown[];
  $schema?: string;
  anyOf?: JsonSchema[];
};

function inferSchema(value: unknown, samples?: unknown[]): JsonSchema {
  if (value === null) return { type: "null" };

  if (Array.isArray(value)) {
    if (value.length === 0) return { type: "array" };
    // Merge schemas from all elements to build a representative items schema
    const itemSchemas = value.map((item) => inferSchema(item));
    const merged = mergeSchemas(itemSchemas);
    return { type: "array", items: merged };
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const properties: Record<string, JsonSchema> = {};
    for (const [key, val] of Object.entries(obj)) {
      // If we have multiple samples, collect this field across all samples
      const fieldSamples = samples
        ?.filter((s) => s && typeof s === "object" && !Array.isArray(s))
        .map((s) => (s as Record<string, unknown>)[key])
        .filter((v) => v !== undefined);
      properties[key] = inferSchema(val, fieldSamples);
    }
    return {
      type: "object",
      properties,
      required: Object.keys(obj),
      additionalProperties: false,
    };
  }

  if (typeof value === "boolean") return { type: "boolean", examples: [value] };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { type: "integer", examples: [value] } : { type: "number", examples: [value] };
  }
  if (typeof value === "string") return { type: "string", examples: [value] };

  return {};
}

function mergeSchemas(schemas: JsonSchema[]): JsonSchema {
  if (schemas.length === 0) return {};
  if (schemas.length === 1) return schemas[0];

  const types = Array.from(new Set(schemas.map((s) => s.type).filter(Boolean))) as string[];

  if (types.length > 1) {
    return { anyOf: schemas };
  }

  const type = types[0];

  if (type === "object") {
    const allKeys = Array.from(new Set(schemas.flatMap((s) => Object.keys(s.properties ?? {}))));
    const properties: Record<string, JsonSchema> = {};
    for (const key of allKeys) {
      const keySchemas = schemas.map((s) => s.properties?.[key]).filter(Boolean) as JsonSchema[];
      properties[key] = mergeSchemas(keySchemas);
    }
    const required = schemas
      .map((s) => s.required ?? [])
      .reduce((a, b) => a.filter((k) => b.includes(k)));
    return { type: "object", properties, required, additionalProperties: false };
  }

  return schemas[0];
}

export function generateJsonSchema(input: string): SchemaResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed: unknown = JSON.parse(input);
    const root = Array.isArray(parsed) ? (parsed[0] ?? null) : parsed;
    const schema: JsonSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      ...inferSchema(root, Array.isArray(parsed) ? parsed : undefined),
    };
    return { output: JSON.stringify(schema, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

// ─── Validator ────────────────────────────────────────────────────────────────

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  error: string | null;
}

function validateValue(value: unknown, schema: JsonSchema, path: string, issues: ValidationIssue[]) {
  // type check
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
    const typeOk = types.some((t) => {
      if (t === "integer") return typeof value === "number" && Number.isInteger(value);
      return t === actualType;
    });
    if (!typeOk) {
      issues.push({ path, message: `Expected type "${types.join(" | ")}", got "${actualType}".` });
      return; // don't recurse if wrong type
    }
  }

  // anyOf
  if (schema.anyOf) {
    const subIssues: ValidationIssue[][] = schema.anyOf.map((sub) => {
      const tmp: ValidationIssue[] = [];
      validateValue(value, sub, path, tmp);
      return tmp;
    });
    if (subIssues.every((s) => s.length > 0)) {
      issues.push({ path, message: "Value did not match any of the allowed schemas." });
    }
    return;
  }

  // object
  if (schema.type === "object" || (schema.properties && typeof value === "object" && value !== null && !Array.isArray(value))) {
    const obj = value as Record<string, unknown>;

    // required
    for (const req of schema.required ?? []) {
      if (!(req in obj)) {
        issues.push({ path: `${path}.${req}`, message: `Required property "${req}" is missing.` });
      }
    }

    // properties
    for (const [key, propSchema] of Object.entries(schema.properties ?? {})) {
      if (key in obj) {
        validateValue(obj[key], propSchema, `${path}.${key}`, issues);
      }
    }

    // additionalProperties
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const key of Object.keys(obj)) {
        if (!allowed.has(key)) {
          issues.push({ path: `${path}.${key}`, message: `Additional property "${key}" is not allowed.` });
        }
      }
    }
  }

  // array
  if (schema.type === "array" || Array.isArray(value)) {
    const arr = value as unknown[];
    if (schema.items) {
      arr.forEach((item, i) => validateValue(item, schema.items!, `${path}[${i}]`, issues));
    }
  }
}

export function validateWithSchema(jsonInput: string, schemaInput: string): SchemaValidationResult {
  if (!jsonInput.trim() || !schemaInput.trim()) return { valid: false, issues: [], error: null };

  let data: unknown;
  let schema: JsonSchema;

  try {
    data = JSON.parse(jsonInput);
  } catch (e) {
    return { valid: false, issues: [], error: `JSON parse error: ${e instanceof Error ? e.message : "Invalid JSON"}` };
  }

  try {
    schema = JSON.parse(schemaInput) as JsonSchema;
  } catch (e) {
    return { valid: false, issues: [], error: `Schema parse error: ${e instanceof Error ? e.message : "Invalid JSON"}` };
  }

  const issues: ValidationIssue[] = [];
  validateValue(data, schema, "$", issues);
  return { valid: issues.length === 0, issues, error: null };
}
