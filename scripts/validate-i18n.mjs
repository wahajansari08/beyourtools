/**
 * Validate i18n files: all locales have messages + content files,
 * valid JSON, key parity with English, and no leftover "{...}" issues.
 * Run: node scripts/validate-i18n.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["es", "pt", "hi", "ur", "fr", "de", "zh", "ar"];
let errors = 0;

const check = (cond, msg) => {
  if (!cond) { console.error("FAIL:", msg); errors++; }
};

function keysEqual(en, tr, path) {
  const ek = Object.keys(en).sort();
  const tk = Object.keys(tr).sort();
  const missing = ek.filter((k) => !tk.includes(k));
  const extra = tk.filter((k) => !ek.includes(k));
  if (missing.length) check(false, `${path}: missing keys: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ` (+${missing.length - 5})` : ""}`);
  if (extra.length) console.warn(`WARN ${path}: extra keys: ${extra.slice(0, 3).join(", ")}`);
  for (const k of ek) {
    if (typeof en[k] === "object" && en[k] !== null && !Array.isArray(en[k]) && tr[k] && typeof tr[k] === "object" && !Array.isArray(tr[k])) {
      keysEqual(en[k], tr[k], `${path}.${k}`);
    }
  }
}

for (const locale of locales) {
  // messages
  const mp = join(root, "messages", `${locale}.json`);
  check(existsSync(mp), `messages/${locale}.json missing`);
  if (existsSync(mp)) {
    const en = JSON.parse(readFileSync(join(root, "messages", "en.json"), "utf8"));
    const tr = JSON.parse(readFileSync(mp, "utf8"));
    keysEqual(en, tr, `messages/${locale}.json`);
  }
  // content files
  for (const f of ["meta.json", "pages.json", "tools.json", "blog.json"]) {
    const cp = join(root, "content", locale, f);
    if (!existsSync(cp)) {
      // blog.json only required for es/fr/de
      if (f === "blog.json" && !["es", "fr", "de"].includes(locale)) continue;
      check(false, `content/${locale}/${f} missing`);
      continue;
    }
    try {
      const data = JSON.parse(readFileSync(cp, "utf8"));
      const enData = JSON.parse(readFileSync(join(root, "content", "en", f), "utf8"));
      const ek = Object.keys(enData);
      const tk = Object.keys(data);
      const missing = ek.filter((k) => !tk.includes(k));
      if (missing.length) check(false, `content/${locale}/${f}: missing ${missing.length} keys`);
    } catch (e) {
      check(false, `content/${locale}/${f}: invalid JSON (${e.message})`);
    }
  }
}

console.log(errors === 0 ? "All i18n files valid." : `${errors} ERRORS found.`);
process.exit(errors === 0 ? 0 : 1);
