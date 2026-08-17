import { XMLParser, XMLBuilder } from "fast-xml-parser";

export interface ConvertResult {
  output: string;
  error: string | null;
}

export function jsonToXml(input: string, rootName = "root"): ConvertResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = JSON.parse(input);
    const builder = new XMLBuilder({
      format: true,
      indentBy: "  ",
      ignoreAttributes: false,
    });
    const wrapped = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : { item: parsed };
    const xml = builder.build({ [rootName]: wrapped });
    return { output: `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

export function xmlToJson(input: string): ConvertResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(input);
    return { output: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid XML" };
  }
}
