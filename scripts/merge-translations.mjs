/**
 * Merge translated tools.json halves from /tmp/i18n/<locale>/tools-{a,b}.json
 * into content/<locale>/tools.json. Validates keys match the English source.
 * Run: node scripts/merge-translations.mjs [locale]
 * (no arg = all locales)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const enTools = JSON.parse(readFileSync(join(root, "content", "en", "tools.json"), "utf8"));
const enKeys = new Set(Object.keys(enTools));

const locales = process.argv[2] ? [process.argv[2]] : ["es", "pt", "hi", "ur", "fr", "de", "zh", "ar"];

for (const locale of locales) {
  const aPath = `/tmp/i18n/${locale}/tools-a.json`;
  const bPath = `/tmp/i18n/${locale}/tools-b.json`;
  if (!existsSync(aPath) || !existsSync(bPath)) {
    console.warn(`skipping ${locale}: missing ${!existsSync(aPath) ? "tools-a.json" : ""} ${!existsSync(bPath) ? "tools-b.json" : ""}`);
    continue;
  }
  const a = JSON.parse(readFileSync(aPath, "utf8"));
  const b = JSON.parse(readFileSync(bPath, "utf8"));
  const merged = { ...a, ...b };

  // Validate: same key set as English
  const mk = new Set(Object.keys(merged));
  const missing = [...enKeys].filter((k) => !mk.has(k));
  const extra = [...mk].filter((k) => !enKeys.has(k));
  if (missing.length) console.warn(`${locale}: MISSING ${missing.length} keys (e.g. ${missing.slice(0, 3).join(", ")})`);
  if (extra.length) console.warn(`${locale}: EXTRA ${extra.length} keys (e.g. ${extra.slice(0, 3).join(", ")})`);

  // Validate: no untranslated values identical to English (spot check)
  let identical = 0;
  for (const k of Object.keys(merged)) {
    const en = enTools[k];
    const tr = merged[k];
    if (en?.name && tr?.name === en.name && /[a-zA-Z]/.test(en.name)) identical++;
  }

  const outDir = join(root, "content", locale);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "tools.json"), JSON.stringify(merged, null, 2) + "\n");
  console.log(`${locale}: merged ${Object.keys(merged).length} entries (identical-name spot check: ${identical})`);
}
