"use client";

import { useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";

/* ═══════════════ Expression engine: tokenizer + recursive-descent parser ═══════════════ */

type Tok =
  | { t: "num"; v: number }
  | { t: "op"; v: "+" | "-" | "*" | "/" | "^" }
  | { t: "pct" }
  | { t: "fact" }
  | { t: "lp" }
  | { t: "rp" }
  | { t: "func"; v: string }
  | { t: "const"; v: "pi" | "e" };

const FUNCS = ["asin", "acos", "atan", "sin", "cos", "tan", "sqrt", "cbrt", "log", "ln", "abs"];
const OP_MAP: Record<string, "+" | "-" | "*" | "/" | "^"> = {
  "+": "+",
  "-": "-",
  "−": "-",
  "*": "*",
  "×": "*",
  "/": "/",
  "÷": "/",
  "^": "^",
};

function tokenize(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const numRe = /^(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?/;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    const numMatch = numRe.exec(src.slice(i));
    if (numMatch) {
      const v = parseFloat(numMatch[0]);
      if (!Number.isFinite(v)) throw new Error("Number out of range");
      toks.push({ t: "num", v });
      i += numMatch[0].length;
      continue;
    }
    if (ch === "π") {
      toks.push({ t: "const", v: "pi" });
      i++;
      continue;
    }
    if (ch === "e") {
      toks.push({ t: "const", v: "e" });
      i++;
      continue;
    }
    if (ch in OP_MAP) {
      toks.push({ t: "op", v: OP_MAP[ch] });
      i++;
      continue;
    }
    if (ch === "%") {
      toks.push({ t: "pct" });
      i++;
      continue;
    }
    if (ch === "!") {
      toks.push({ t: "fact" });
      i++;
      continue;
    }
    if (ch === "(") {
      toks.push({ t: "lp" });
      i++;
      continue;
    }
    if (ch === ")") {
      toks.push({ t: "rp" });
      i++;
      continue;
    }
    const f = FUNCS.find((fn) => src.slice(i, i + fn.length).toLowerCase() === fn);
    if (f) {
      toks.push({ t: "func", v: f });
      i += f.length;
      continue;
    }
    throw new Error(`Unexpected character "${ch}"`);
  }
  // Insert implicit multiplication: 2π, 3(4+5), )(
  const out: Tok[] = [];
  const leftEnd = (tk: Tok) => tk.t === "num" || tk.t === "const" || tk.t === "rp" || tk.t === "pct" || tk.t === "fact";
  const rightStart = (tk: Tok) => tk.t === "num" || tk.t === "const" || tk.t === "lp" || tk.t === "func";
  for (const tk of toks) {
    if (out.length > 0 && leftEnd(out[out.length - 1]) && rightStart(tk)) out.push({ t: "op", v: "*" });
    out.push(tk);
  }
  return out;
}

// Lanczos approximation of the gamma function, for non-integer factorials
function gamma(z: number): number {
  const g = 7;
  const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = C[0];
  for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function factorial(v: number): number {
  if (Number.isInteger(v) && v >= 0 && v <= 170) {
    let r = 1;
    for (let i = 2; i <= v; i++) r *= i;
    return r;
  }
  if (v > 0 && v <= 170) return gamma(v + 1);
  throw new Error("Factorial needs a value ≥ 0");
}

function applyFunc(name: string, v: number, deg: boolean): number {
  const toRad = (x: number) => (deg ? (x * Math.PI) / 180 : x);
  const toDeg = (x: number) => (deg ? (x * 180) / Math.PI : x);
  switch (name) {
    case "sin":
      return Math.sin(toRad(v));
    case "cos":
      return Math.cos(toRad(v));
    case "tan":
      return Math.tan(toRad(v));
    case "asin":
      if (v < -1 || v > 1) throw new Error("asin needs a value between -1 and 1");
      return toDeg(Math.asin(v));
    case "acos":
      if (v < -1 || v > 1) throw new Error("acos needs a value between -1 and 1");
      return toDeg(Math.acos(v));
    case "atan":
      return toDeg(Math.atan(v));
    case "sqrt":
      if (v < 0) throw new Error("Cannot take the square root of a negative number");
      return Math.sqrt(v);
    case "cbrt":
      return Math.cbrt(v);
    case "log":
      if (v <= 0) throw new Error("log needs a positive value");
      return Math.log10(v);
    case "ln":
      if (v <= 0) throw new Error("ln needs a positive value");
      return Math.log(v);
    case "abs":
      return Math.abs(v);
    default:
      throw new Error(`Unknown function "${name}"`);
  }
}

class Parser {
  private pos = 0;
  constructor(private toks: Tok[], private deg: boolean) {}

  parse(): number {
    const v = this.expr();
    if (this.pos < this.toks.length) throw new Error("Unexpected input at the end");
    return v;
  }

  private peek(): Tok | undefined {
    return this.toks[this.pos];
  }

  private expr(): number {
    let v = this.term();
    for (;;) {
      const t = this.peek();
      if (t && t.t === "op" && (t.v === "+" || t.v === "-")) {
        this.pos++;
        const r = this.term();
        v = t.v === "+" ? v + r : v - r;
      } else return v;
    }
  }

  private term(): number {
    let v = this.factor();
    for (;;) {
      const t = this.peek();
      if (t && t.t === "op" && (t.v === "*" || t.v === "/")) {
        this.pos++;
        const r = this.factor();
        if (t.v === "/") {
          if (r === 0) throw new Error("Division by zero");
          v /= r;
        } else v *= r;
      } else return v;
    }
  }

  private factor(): number {
    // Unary sign binds looser than ^, so -3^2 = -(3^2)
    const t = this.peek();
    if (t && t.t === "op" && (t.v === "-" || t.v === "+")) {
      this.pos++;
      const v = this.factor();
      return t.v === "-" ? -v : v;
    }
    return this.power();
  }

  private power(): number {
    const base = this.postfix();
    const t = this.peek();
    if (t && t.t === "op" && t.v === "^") {
      this.pos++;
      return Math.pow(base, this.factor()); // right-associative
    }
    return base;
  }

  private postfix(): number {
    let v = this.unary();
    for (;;) {
      const t = this.peek();
      if (t && t.t === "pct") {
        this.pos++;
        v = v / 100;
      } else if (t && t.t === "fact") {
        this.pos++;
        v = factorial(v);
      } else return v;
    }
  }

  private unary(): number {
    const t = this.peek();
    if (t && t.t === "op" && (t.v === "-" || t.v === "+")) {
      this.pos++;
      const v = this.unary();
      return t.v === "-" ? -v : v;
    }
    if (t && t.t === "func") {
      this.pos++;
      return applyFunc(t.v, this.unary(), this.deg);
    }
    return this.primary();
  }

  private primary(): number {
    const t = this.toks[this.pos++];
    if (!t) throw new Error("Unexpected end of expression");
    if (t.t === "num") return t.v;
    if (t.t === "const") return t.v === "pi" ? Math.PI : Math.E;
    if (t.t === "lp") {
      const v = this.expr();
      const c = this.toks[this.pos++];
      if (!c || c.t !== "rp") throw new Error("Missing closing parenthesis");
      return v;
    }
    throw new Error("Unexpected input");
  }
}

export function evaluateExpression(src: string, deg: boolean, ans: number | null): number {
  const withAns = ans === null ? src : src.replace(/Ans/g, `(${ans})`);
  const toks = tokenize(withAns);
  if (toks.length === 0) throw new Error("Empty expression");
  const v = new Parser(toks, deg).parse();
  if (!Number.isFinite(v)) throw new Error("Result is not a finite number");
  return v;
}

function formatResult(v: number): string {
  if (Object.is(v, -0)) v = 0;
  const s = String(parseFloat(v.toPrecision(12)));
  return s;
}

/* ═══════════════ UI ═══════════════ */

interface HistoryEntry {
  expr: string;
  result: string;
}

const HISTORY_KEY = "sci-calc-history-v1";

interface PadKey {
  label: string;
  insert?: string;
  action?: "equals" | "clear" | "back" | "deg";
  span?: number;
}

const PAD: PadKey[] = [
  { label: "C", action: "clear" },
  { label: "⌫", action: "back" },
  { label: "(" , insert: "(" },
  { label: ")", insert: ")" },
  { label: "%", insert: "%" },
  { label: "sin", insert: "sin(" },
  { label: "cos", insert: "cos(" },
  { label: "tan", insert: "tan(" },
  { label: "÷", insert: "÷" },
  { label: "×", insert: "×" },
  { label: "asin", insert: "asin(" },
  { label: "acos", insert: "acos(" },
  { label: "atan", insert: "atan(" },
  { label: "−", insert: "−" },
  { label: "+", insert: "+" },
  { label: "√", insert: "sqrt(" },
  { label: "∛", insert: "cbrt(" },
  { label: "log", insert: "log(" },
  { label: "ln", insert: "ln(" },
  { label: "^", insert: "^" },
  { label: "7", insert: "7" },
  { label: "8", insert: "8" },
  { label: "9", insert: "9" },
  { label: "!", insert: "!" },
  { label: "π", insert: "π" },
  { label: "4", insert: "4" },
  { label: "5", insert: "5" },
  { label: "6", insert: "6" },
  { label: "Ans", insert: "Ans" },
  { label: "e", insert: "e" },
  { label: "1", insert: "1" },
  { label: "2", insert: "2" },
  { label: "3", insert: "3" },
  { label: "0", insert: "0" },
  { label: ".", insert: "." },
  { label: "DEG", action: "deg" },
  { label: "=", action: "equals", span: 4 },
];

export default function ScientificCalculatorClient() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [ans, setAns] = useState<number | null>(null);
  const [deg, setDeg] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const ansRef = useRef<number | null>(null);
  ansRef.current = ans;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const p = JSON.parse(raw) as HistoryEntry[];
        if (Array.isArray(p)) setHistory(p.slice(0, 20));
      }
    } catch {
      /* ignore */
    }
  }, []);

  function press(key: PadKey) {
    setError("");
    if (key.action === "clear") {
      setExpr("");
      setResult(null);
      return;
    }
    if (key.action === "back") {
      setExpr((e) => e.slice(0, -1));
      setResult(null);
      return;
    }
    if (key.action === "deg") {
      setDeg((d) => !d);
      return;
    }
    if (key.action === "equals") {
      calculate(expr);
      return;
    }
    if (key.insert !== undefined) {
      setExpr((e) => e + key.insert);
      setResult(null);
    }
  }

  function calculate(source: string) {
    setError("");
    try {
      const v = evaluateExpression(source, deg, ansRef.current);
      const formatted = formatResult(v);
      setResult(formatted);
      setAns(v);
      setHistory((h) => {
        const next = [{ expr: source, result: formatted }, ...h].slice(0, 20);
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not evaluate");
      setResult(null);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (/^[0-9.]$/.test(k)) {
      setExpr((x) => x + k);
      setResult(null);
      setError("");
    } else if (k === "+" || k === "-" || k === "*" || k === "/" || k === "^" || k === "%" || k === "(" || k === ")" || k === "!") {
      const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−" };
      setExpr((x) => x + (map[k] ?? k));
      setResult(null);
      setError("");
    } else if (k === "Enter" || k === "=") {
      e.preventDefault();
      calculate(expr);
    } else if (k === "Backspace") {
      setExpr((x) => x.slice(0, -1));
      setResult(null);
      setError("");
    } else if (k === "Escape") {
      setExpr("");
      setResult(null);
      setError("");
    } else {
      return;
    }
  }

  function loadFromHistory(h: HistoryEntry) {
    setExpr(h.expr);
    setResult(h.result);
    setError("");
  }

  return (
    <div className="space-y-5">
      <div
        className="focus-ring rounded-xl border p-4 outline-none sm:p-6"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Scientific calculator. Type an expression or use the buttons below."
      >
        {/* Display */}
        <div
          className="min-h-[4.5rem] rounded-lg border px-4 py-3 text-right"
          style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)" }}
        >
          <div className="min-h-[1.75rem] break-all font-mono text-xl tabular-nums sm:text-2xl" style={{ color: "var(--text-primary)" }}>
            {expr || <span style={{ color: "var(--text-subtle)" }}>0</span>}
          </div>
          <div className="mt-1 min-h-[1.25rem] break-all font-mono text-sm tabular-nums" style={{ color: "var(--accent)" }}>
            {result !== null ? `= ${result}` : error ? "" : "\u00a0"}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm" role="alert" style={{ color: "var(--color-danger, #e5484d)" }}>
            {error}
          </p>
        )}
        <p className="mt-2 text-xs" style={{ color: "var(--text-subtle)" }}>
          Click here and type, or use the buttons. Enter calculates, Backspace deletes, Esc clears.
        </p>

        {/* Button pad */}
        <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
          {PAD.map((key) => (
            <button
              key={key.label}
              type="button"
              onClick={() => press(key)}
              className="focus-ring rounded-lg border px-1 py-2.5 text-sm font-medium transition hover:opacity-90 active:scale-95"
              style={{
                gridColumn: key.span ? `span ${key.span}` : undefined,
                borderColor: "var(--border)",
                backgroundColor: key.action === "equals" ? "var(--accent)" : "var(--bg-elevated)",
                color: key.action === "equals" ? "var(--on-accent, #1a1207)" : "var(--text-primary)",
              }}
              aria-label={key.action === "deg" ? `Angle mode: ${deg ? "degrees" : "radians"}. Activate to switch.` : key.label}
            >
              {key.action === "deg" ? (deg ? "DEG" : "RAD") : key.label}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>History</h2>
          {history.length > 0 && (
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => {
                setHistory([]);
                try {
                  localStorage.removeItem(HISTORY_KEY);
                } catch {
                  /* ignore */
                }
              }}
            >
              Clear
            </Btn>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Nothing yet. Your calculations will appear here; click one to reuse it.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => loadFromHistory(h)}
                  className="focus-ring w-full rounded-lg border px-3 py-2 text-left transition hover:opacity-90"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}
                >
                  <span className="block truncate font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                    {h.expr}
                  </span>
                  <span className="block font-mono text-sm tabular-nums" style={{ color: "var(--text-primary)" }}>
                    = {h.result}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
