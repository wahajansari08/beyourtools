import yaml from "js-yaml";

export interface ConvertResult {
  output: string;
  error: string | null;
}

export function jsonToYaml(input: string): ConvertResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = JSON.parse(input);
    const output = yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true });
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

export function yamlToJson(input: string): ConvertResult {
  if (!input.trim()) return { output: "", error: null };
  try {
    const parsed = yaml.load(input);
    return { output: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid YAML" };
  }
}
