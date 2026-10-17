/**
 * Codemod: convert static `export const metadata = <RHS>;` in page.tsx files
 * into a locale-aware `generateMetadata` that localizes title/description
 * via lib/i18n-content `localizeMetadata`, keyed by route slug.
 *
 * Run: node scripts/codemod-metadata.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { relative, dirname, sep } from "node:path";

const DRY = process.argv.includes("--dry");
const files = execSync(`git -C /home/hatch/workspace/beyourtools-src ls-files "app/\\[locale\\]/**/page.tsx"`, { encoding: "utf8" })
  .trim().split("\n").filter(Boolean);

let converted = 0, skipped = 0;

for (const f of files) {
  const src = readFileSync(f, "utf8");
  if (src.includes("generateMetadata")) { skipped++; continue; }
  const m = src.match(/export const metadata(:[^\n=;]+)? =/);
  if (!m) { skipped++; continue; }

  const startIdx = m.index;
  // find the '=' that ends the match, then scan to terminating ';' at depth 0
  let i = startIdx + m[0].length;
  let depth = 0, inStr = null, inTpl = false, tplDepth = 0, esc = false;
  let end = -1;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; continue; }
    if (inTpl) {
      if (ch === "\\") { i++; continue; }
      if (ch === "`" && tplDepth === 0) { inTpl = false; continue; }
      if (ch === "$" && src[i + 1] === "{") { tplDepth++; i++; continue; }
      if (ch === "{") { if (tplDepth > 0) tplDepth++; continue; }
      if (ch === "}") { if (tplDepth > 0) { tplDepth--; } continue; }
      continue;
    }
    if (ch === "`") { inTpl = true; tplDepth = 0; continue; }
    if (ch === "{" || ch === "(" || ch === "[") depth++;
    else if (ch === "}" || ch === ")" || ch === "]") depth--;
    else if (ch === ";" && depth === 0) { end = i; break; }
  }
  if (end === -1) { console.log("NO-END:", f); skipped++; continue; }

  const decl = src.slice(startIdx, end); // `export const metadata[: T] = <RHS>`
  const newDecl = decl.replace("export const metadata", "const __enMetadata");

  const rel = relative("app/[locale]", dirname(f)).split(sep).join("/");
  const slug = rel === "" ? "home" : rel;

  const fn = `
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, ${JSON.stringify(slug)}, __enMetadata);
}
`;

  let out = src.slice(0, startIdx) + newDecl + src.slice(end);
  out = `import { localizeMetadata } from "@/lib/i18n-content";\n` + out + "\n" + fn;

  // ensure Metadata type import exists
  if (!/import type \{ Metadata \}|import \{[^}]*Metadata[^}]*\} from "next"/.test(out)) {
    out = `import type { Metadata } from "next";\n` + out;
  }

  if (!DRY) writeFileSync(f, out);
  converted++;
}

console.log({ converted, skipped });
