"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Btn from "@/components/Btn";
import SegmentedControl from "@/components/SegmentedControl";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const AMBIGUOUS = "0O1lI|`'\"";

// Compact word list for memorable passphrases (short, common, unambiguous words).
const WORDS = (
  "apple anchor april atlas bacon badge baker basic beach beard beast begin belly bench berry birth " +
  "blade blank blast blaze blend bless blind block bloom board bonus boost booth bound brain brand brave " +
  "bread break brick bride brief bring broad broke brook brown brush build bunch buyer cabin cable candy " +
  "cargo carry catch cause chain chair charm chart chase cheap check cheese chest chief child chill choir " +
  "chose civil claim class clean clear clerk click cliff climb clock close cloth cloud coach coast color " +
  "comet coral couch could count court cover crack craft crash crazy cream crime cross crowd crown daily " +
  "dance death delay depth diary doing donor doubt dozen draft drain drama dream dress drink drive eager " +
  "early earth eight elbow elder elect empty enemy enjoy enter entry equal error essay event every exact " +
  "exist extra faint fairy faith fancy fault favor feast fence fever field fifth fifty fight final first " +
  "flame flash fleet flesh float floor flour fluid focus force forth forty forum found frame fresh front " +
  "frost fruit funny giant given glass globe glory glove going grace grade grain grand grant grape grass " +
  "great green greet grief group grove guard guess guest guide habit happy heart heavy hello honey honor " +
  "horse hotel house human hurry ideal image index inner input issue ivory joint judge juice knife knock " +
  "known label labor large laser laugh layer learn least leave legal lemon level light limit linen liver " +
  "local logic loose lover lower lucky lunch lyric magic major maker march match maybe mayor meant medal " +
  "media merry metal meter micro midst might minor minus model money month moral motor mount mouse mouth " +
  "movie music nasty never night noble noise north novel nurse ocean offer often older olive onion opera " +
  "order other ought outer owner paint panel paper party patch pause peace penny phase phone photo piano " +
  "piece pilot pitch place plain plane plant plate point pound power press price pride prime print prize " +
  "proof proud prove queen quick quiet quite radar radio raise range rapid ratio reach ready realm rebel " +
  "refer renew reply rider right river roast robot rocky roman rough round route royal rumor rural salad " +
  "scale scene scope score sense serve seven shade shake shall shape share sharp sheep sheet shelf shell " +
  "shift shine shirt shock short shout shown sight silly since sixth sixty skate skill skirt sleep slice " +
  "slide slope small smart smell smile smoke snake solar solid solve sorry sound south space spare speak " +
  "speed spell spend spice spill spoke sport staff stage stair stand start state steam steel steep stick " +
  "still stock stone stood store storm story strip style sugar sunny super sweet table taken taste teach " +
  "teeth thank their theme there thick thing think third those three threw throw thumb tiger tight tired " +
  "title today token tooth topic total touch tough tower town track trade trail train treat trend trial " +
  "tribe trick truck truly trust truth twice under union unite until upper upset urban usual valid value " +
  "video visit vital voice voter waste watch water weary whale wheat wheel where which while white whole " +
  "whose woman women world worry worth would wound write wrong wrote yield young youth zebra"
).split(" ");

const SEPARATORS = [
  { value: "-", label: "Hyphen (-)" },
  { value: " ", label: "Space" },
  { value: "_", label: "Underscore (_)" },
  { value: ".", label: "Dot (.)" },
  { value: "", label: "None" },
];

function strengthLabel(bits: number): string {
  if (bits < 60) return "Weak";
  if (bits < 80) return "OK";
  if (bits < 100) return "Strong";
  return "Excellent";
}

/**
 * Uniform random index in [0, max) using crypto.getRandomValues with
 * rejection sampling (no modulo bias). Never Math.random().
 */
function secureIndex(max: number): number {
  const buf = new Uint32Array(1);
  const range = 0xffffffff;
  const limit = Math.floor((range + 1) / max) * max;
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return v % max;
}

type GenMode = "random" | "passphrase";

export default function PasswordGeneratorClient() {
  const [mode, setMode] = useState<GenMode>("random");
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [minDigits, setMinDigits] = useState(0);
  const [minSpecials, setMinSpecials] = useState(0);
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(false);
  const [includeNumber, setIncludeNumber] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pool = useMemo(() => {
    const strip = (s: string) =>
      excludeAmbiguous ? s.split("").filter((c) => !AMBIGUOUS.includes(c)).join("") : s;
    const sets = [
      upper ? strip(UPPER) : "",
      lower ? strip(LOWER) : "",
      digits ? strip(DIGITS) : "",
      symbols ? strip(SYMBOLS) : "",
    ];
    return { sets: sets.filter((s) => s.length > 0), combined: sets.join("") };
  }, [upper, lower, digits, symbols, excludeAmbiguous]);

  const strip = useCallback(
    (s: string) =>
      excludeAmbiguous ? s.split("").filter((c) => !AMBIGUOUS.includes(c)).join("") : s,
    [excludeAmbiguous]
  );

  const entropyBits = useMemo(() => {
    if (mode === "passphrase") {
      let bits = wordCount * Math.log2(WORDS.length);
      if (capitalize) bits += wordCount; // each word may or may not be capitalized
      if (includeNumber) bits += Math.log2(10) + Math.log2(wordCount + 1);
      return bits;
    }
    return pool.combined.length > 0 ? length * Math.log2(pool.combined.length) : 0;
  }, [pool, length, mode, wordCount, capitalize, includeNumber]);

  const generatePassphrase = useCallback((): string => {
    const picked: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      let w = WORDS[secureIndex(WORDS.length)];
      if (capitalize && secureIndex(2) === 1) w = w.charAt(0).toUpperCase() + w.slice(1);
      picked.push(w);
    }
    if (includeNumber) {
      // Insert a random digit at a random position (start, middle or end).
      const pos = secureIndex(picked.length + 1);
      const digit = String(secureIndex(10));
      const words = [...picked];
      if (pos === picked.length) words.push(digit);
      else words[pos] = words[pos] + digit;
      return words.join(separator);
    }
    return picked.join(separator);
  }, [wordCount, separator, capitalize, includeNumber]);

  const generate = useCallback(() => {
    setError(null);
    setCopiedIdx(null);
    if (mode === "passphrase") {
      const out: string[] = [];
      for (let q = 0; q < quantity; q++) out.push(generatePassphrase());
      setPasswords(out);
      return;
    }
    if (pool.combined.length === 0) {
      setError("Select at least one character set.");
      setPasswords([]);
      return;
    }
    const digitSet = strip(DIGITS);
    const symbolSet = strip(SYMBOLS);
    const needDigits = Math.min(Math.max(0, minDigits), length);
    const needSymbols = Math.min(Math.max(0, minSpecials), Math.max(0, length - needDigits));
    const out: string[] = [];
    for (let q = 0; q < quantity; q++) {
      const chars: string[] = [];
      // Honour explicit minimums first (even if the set toggle is off).
      for (let i = 0; i < needDigits && digitSet.length > 0; i++) chars.push(digitSet[secureIndex(digitSet.length)]);
      for (let i = 0; i < needSymbols && symbolSet.length > 0; i++) chars.push(symbolSet[secureIndex(symbolSet.length)]);
      // Guarantee at least one char from each selected set (shuffled in).
      for (const s of pool.sets) {
        if (!chars.some((c) => s.includes(c))) chars.push(s[secureIndex(s.length)]);
      }
      for (let i = chars.length; i < length; i++) {
        chars.push(pool.combined[secureIndex(pool.combined.length)]);
      }
      // Fisher-Yates with secure randomness
      for (let i = chars.length - 1; i > 0; i--) {
        const j = secureIndex(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      out.push(chars.join(""));
    }
    setPasswords(out);
  }, [pool, length, quantity, mode, minDigits, minSpecials, strip, generatePassphrase]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyOne = async (pw: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(pw);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = pw;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedIdx(idx);
    window.setTimeout(() => setCopiedIdx((c) => (c === idx ? null : c)), 1600);
  };

  const strength = strengthLabel(entropyBits);
  const meterPct = Math.min(100, (entropyBits / 128) * 100);

  const toggleLabel = (name: string, on: boolean) => `${name}: ${on ? "on" : "off"}`;

  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
      <div className="mb-5">
        <SegmentedControl<GenMode>
          label="Type"
          value={mode}
          onChange={setMode}
          options={[
            { value: "random", label: "Random" },
            { value: "passphrase", label: "Passphrase" },
          ]}
        />
      </div>

      {mode === "passphrase" ? (
        <>
          {/* Word count */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="pw-words" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Words
              </label>
              <span className="rounded-md px-2 py-0.5 text-sm font-semibold" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}>
                {wordCount}
              </span>
            </div>
            <input
              id="pw-words"
              type="range"
              min={3}
              max={8}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="focus-ring w-full"
              style={{ accentColor: "var(--accent)" }}
              aria-valuetext={`${wordCount} words`}
            />
          </div>

          {/* Separator + options */}
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="pw-sep" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                Word separator
              </label>
              <select
                id="pw-sep"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="focus-ring w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
              >
                {SEPARATORS.map((s) => (
                  <option key={s.label} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-end gap-2 pb-0.5">
              <Btn variant="toggle" size="sm" selected={capitalize} onClick={() => setCapitalize((v) => !v)} aria-pressed={capitalize}>
                Capitalize words
              </Btn>
              <Btn variant="toggle" size="sm" selected={includeNumber} onClick={() => setIncludeNumber((v) => !v)} aria-pressed={includeNumber}>
                Include a number
              </Btn>
            </div>
          </div>

          <p className="mb-5 text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
            Passphrases like <code style={{ color: "var(--text-secondary)" }}>correct-horse-battery-staple</code> are
            easier to type and remember than random strings, while staying hard to guess.
          </p>
        </>
      ) : (
        <>
      {/* Length */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="pw-length" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Password length
          </label>
          <span className="rounded-md px-2 py-0.5 text-sm font-semibold" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--accent-text)" }}>
            {length}
          </span>
        </div>
        <input
          id="pw-length"
          type="range"
          min={4}
          max={128}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="focus-ring w-full"
          style={{ accentColor: "var(--accent)" }}
          aria-valuetext={`${length} characters`}
        />
        <div className="mt-1 flex justify-between text-[11px]" style={{ color: "var(--text-subtle)" }}>
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Character sets */}
      <div className="mb-5">
        <p className="mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Character sets
        </p>
        <div className="flex flex-wrap gap-2">
          <Btn variant="toggle" size="sm" selected={upper} onClick={() => setUpper((v) => !v)} aria-label={toggleLabel("Uppercase", upper)}>
            ABC
          </Btn>
          <Btn variant="toggle" size="sm" selected={lower} onClick={() => setLower((v) => !v)} aria-label={toggleLabel("Lowercase", lower)}>
            abc
          </Btn>
          <Btn variant="toggle" size="sm" selected={digits} onClick={() => setDigits((v) => !v)} aria-label={toggleLabel("Numbers", digits)}>
            123
          </Btn>
          <Btn variant="toggle" size="sm" selected={symbols} onClick={() => setSymbols((v) => !v)} aria-label={toggleLabel("Symbols", symbols)}>
            #&amp;!
          </Btn>
          <Btn
            variant="toggle"
            size="sm"
            selected={excludeAmbiguous}
            onClick={() => setExcludeAmbiguous((v) => !v)}
            aria-label={toggleLabel("Exclude ambiguous characters like 0 O 1 l I", excludeAmbiguous)}
          >
            No 0O1lI
          </Btn>
        </div>
      </div>

      {/* Minimum counts */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="pw-min-digits" className="mb-1 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Minimum numbers
          </label>
          <input
            id="pw-min-digits"
            type="number"
            min={0}
            max={length}
            value={minDigits}
            onChange={(e) => setMinDigits(Math.min(length, Math.max(0, Number(e.target.value) || 0)))}
            className="focus-ring w-28 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
        <div>
          <label htmlFor="pw-min-specials" className="mb-1 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Minimum symbols
          </label>
          <input
            id="pw-min-specials"
            type="number"
            min={0}
            max={length}
            value={minSpecials}
            onChange={(e) => setMinSpecials(Math.min(length, Math.max(0, Number(e.target.value) || 0)))}
            className="focus-ring w-28 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
      </div>
        </>
      )}

      {/* Quantity + generate */}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="pw-qty" className="mb-1 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            How many
          </label>
          <input
            id="pw-qty"
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="focus-ring w-24 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
        <Btn variant="primary" onClick={generate}>
          Generate passwords
        </Btn>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm font-medium" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}

      {/* Strength meter */}
      {passwords.length > 0 && (
        <div className="mb-5 rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>Entropy</span>
            <span className="font-semibold" style={{ color: "var(--accent-text)" }}>
              {entropyBits.toFixed(0)} bits · {strength}
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--bg-page)" }}
            role="progressbar"
            aria-valuenow={Math.round(entropyBits)}
            aria-valuemin={0}
            aria-valuemax={128}
            aria-label={`Password strength: ${strength}, ${entropyBits.toFixed(0)} bits of entropy`}
          >
            <div className="h-full rounded-full transition-all" style={{ width: `${meterPct}%`, backgroundColor: "var(--accent)" }} />
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--text-subtle)" }}>
            bits = length × log₂(pool size). 80+ bits is strong; 100+ is excellent.
          </p>
        </div>
      )}

      {/* Results */}
      {passwords.length > 0 && (
        <ul className="space-y-2">
          {passwords.map((pw, i) => (
            <li
              key={`${i}-${pw.slice(0, 8)}`}
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
            >
              <code className="min-w-0 flex-1 break-all text-sm" style={{ color: "var(--text-primary)" }}>
                {pw}
              </code>
              <Btn variant="secondary" size="sm" onClick={() => copyOne(pw, i)} aria-label={`Copy password ${i + 1}`}>
                {copiedIdx === i ? "Copied" : "Copy"}
              </Btn>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
