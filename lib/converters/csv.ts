export interface ConvertResult {
  output: string;
  error: string | null;
}

function parseCsvRows(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (char === "\r") {
        // skip, handled by \n
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

export function csvToJson(input: string, delimiter = ","): ConvertResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const rows = parseCsvRows(input, delimiter);
    if (rows.length === 0) return { output: "[]", error: null };
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, idx) => {
        obj[header] = row[idx] ?? "";
      });
      return obj;
    });
    return { output: JSON.stringify(data, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Could not parse CSV" };
  }
}

function csvEscape(value: unknown, delimiter: string): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function jsonToCsv(input: string, delimiter = ","): ConvertResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = JSON.parse(input);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.length === 0) return { output: "", error: null };

    const headerSet = new Set<string>();
    arr.forEach((row) => {
      if (row && typeof row === "object" && !Array.isArray(row)) {
        Object.keys(row).forEach((k) => headerSet.add(k));
      }
    });
    const headers = Array.from(headerSet);
    if (headers.length === 0) {
      return { output: "", error: "Expected an array of flat objects." };
    }

    const lines = [headers.map((h) => csvEscape(h, delimiter)).join(delimiter)];
    for (const row of arr) {
      const values = headers.map((h) => {
        const v = (row as Record<string, unknown>)?.[h];
        const flat = v !== null && typeof v === "object" ? JSON.stringify(v) : v;
        return csvEscape(flat, delimiter);
      });
      lines.push(values.join(delimiter));
    }
    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
