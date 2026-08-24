"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";

// ─── Constants ────────────────────────────────────────────────────────────────

const FORMATS = [
  { value: "CODE128", label: "Code 128", hint: "Full ASCII printable characters." },
  { value: "CODE39",  label: "Code 39",  hint: "A–Z, 0–9, space, - . $ / + %" },
  { value: "EAN13",   label: "EAN-13",   hint: "Enter 12 digits - check digit added automatically." },
  { value: "EAN8",    label: "EAN-8",    hint: "Enter 7 digits - check digit added automatically." },
  { value: "UPC",     label: "UPC-A",    hint: "Enter 11 digits - check digit added automatically." },
] as const;

type FormatValue = typeof FORMATS[number]["value"];

// Social logo paths (inline SVG data URLs - brand icons, safe, no network call)
const SOCIAL_LOGOS: { id: string; label: string; svg: string }[] = [
  { id: "instagram", label: "Instagram", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="5" fill="url(#ig)"/><path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="white"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg>` },
  { id: "facebook",  label: "Facebook",  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#1877F2"/><path d="M15.12 12.96H13.2v7.04h-2.88V12.96H9V10.4h1.32V8.88C10.32 7.12 11.2 6 13.2 6h1.92v2.56h-1.2c-.56 0-.72.28-.72.72v1.12h1.96l-.04 2.56z" fill="white"/></svg>` },
  { id: "youtube",   label: "YouTube",   svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#FF0000"/><path d="M19.8 8.2a2.5 2.5 0 0 0-1.76-1.77C16.62 6 12 6 12 6s-4.62 0-6.04.43A2.5 2.5 0 0 0 4.2 8.2 26.2 26.2 0 0 0 3.77 12a26.2 26.2 0 0 0 .43 3.8 2.5 2.5 0 0 0 1.76 1.77C7.38 18 12 18 12 18s4.62 0 6.04-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 20.23 12a26.2 26.2 0 0 0-.43-3.8zM10.2 14.73V9.27L15 12l-4.8 2.73z" fill="white"/></svg>` },
  { id: "tiktok",    label: "TikTok",    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#010101"/><path d="M17 6.5c-.9-.5-1.6-1.4-1.8-2.5H13v11c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.2 0 .4 0 .6.1V10.9c-.2 0-.4-.1-.6-.1-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5V9.3c.9.6 1.9.9 3 .9V7.8c-.5 0-1-.1-1.5-.3-.2-.1-.3-.2-.5-.3v-.7z" fill="white"/></svg>` },
  { id: "x",         label: "X",         svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#000"/><path d="M17.75 4h-2.63L12 8.63 8.88 4H4l5.88 8L4 20h2.63L10 14.8 13.13 20H18l-6.13-8.25L17.75 4z" fill="white"/></svg>` },
  { id: "linkedin",  label: "LinkedIn",  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#0077B5"/><path d="M7.5 9.5H5V19h2.5V9.5zM6.25 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM19 13.5c0-2.5-1.5-4-3.5-4a3.5 3.5 0 0 0-2.5 1V9.5H10.5V19H13v-5c0-1.1.9-2 2-2s2 .9 2 2v5H19v-5.5z" fill="white"/></svg>` },
  { id: "whatsapp",  label: "WhatsApp",  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#25D366"/><path d="M12 4.5a7.5 7.5 0 0 0-6.36 11.46L4.5 19.5l3.65-1.12A7.5 7.5 0 1 0 12 4.5zm3.74 10.4c-.16.44-1.56.87-2.12.9-.56.02-1.08.27-3.62-.75-2.54-1.02-4.1-3.6-4.23-3.77-.13-.16-1.1-1.46-1.1-2.79s.7-1.98.95-2.25c.25-.27.54-.34.72-.34.18 0 .36.01.52.01.16.01.38-.06.6.46.21.52.72 1.76.78 1.89.06.13.1.28.01.45-.09.17-.13.27-.26.42-.13.15-.27.33-.39.44-.13.12-.26.25-.11.5.15.24.67 1.1 1.44 1.78.99.88 1.82 1.15 2.08 1.28.25.13.4.11.55-.07.14-.18.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.56-.1 1z" fill="white"/></svg>` },
  { id: "telegram",  label: "Telegram",  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#2AABEE"/><path d="M5.06 11.62 18.5 6.14c.63-.23 1.18.15.97.85l-2.2 10.37c-.16.74-.6.92-1.22.57l-3.4-2.5-1.64 1.58c-.18.18-.33.33-.67.33l.24-3.42 6.2-5.6c.27-.24-.06-.37-.41-.13l-7.66 4.82-3.3-1.03c-.72-.23-.73-.72.15-1.06z" fill="white"/></svg>` },
  { id: "github",    label: "GitHub",    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#181717"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7.58 4 4 7.68 4 12.2c0 3.62 2.29 6.69 5.47 7.77.4.07.55-.18.55-.39v-1.37c-2.23.49-2.7-1.1-2.7-1.1-.36-.94-.89-1.19-.89-1.19-.73-.51.05-.5.05-.5.81.06 1.24.85 1.24.85.72 1.25 1.89.89 2.35.68.07-.53.28-.89.51-1.09-1.78-.2-3.65-.91-3.65-4.05 0-.89.31-1.63.82-2.2-.08-.2-.36-1.04.08-2.17 0 0 .67-.22 2.2.83A7.54 7.54 0 0 1 12 9.47c.68 0 1.36.09 2 .27 1.52-1.05 2.19-.83 2.19-.83.44 1.13.16 1.97.08 2.17.52.57.82 1.31.82 2.2 0 3.15-1.87 3.85-3.65 4.05.29.25.54.75.54 1.51v2.24c0 .22.14.47.55.39C17.71 18.89 20 15.82 20 12.2 20 7.68 16.42 4 12 4z" fill="white"/></svg>` },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/** Strip script/foreignObject from SVG to prevent XSS */
function sanitizeSvg(raw: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "image/svg+xml");
  // Remove dangerous elements
  ["script", "foreignObject", "iframe", "object", "use"].forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  });
  // Remove event attributes
  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (/^on/i.test(attr.name) || /^href$/i.test(attr.name) && /^javascript/i.test(attr.value)) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return new XMLSerializer().serializeToString(doc.documentElement);
}

/** Load image into an HTMLImageElement, resolving when loaded */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = src;
  });
}

/** Luminance-based contrast check */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ─── Check-digit helpers (inline to keep this file self-contained) ────────────

function ean13CheckDigit(d12: string): string {
  let s = 0;
  for (let i = 0; i < 12; i++) s += parseInt(d12[i], 10) * (i % 2 === 0 ? 1 : 3);
  return String((10 - (s % 10)) % 10);
}

function ean8CheckDigit(d7: string): string {
  let s = 0;
  for (let i = 0; i < 7; i++) s += parseInt(d7[i], 10) * (i % 2 === 0 ? 3 : 1);
  return String((10 - (s % 10)) % 10);
}

function upcACheckDigit(d11: string): string {
  let odd = 0, even = 0;
  for (let i = 0; i < 11; i++) { const d = parseInt(d11[i], 10); if (i % 2 === 0) odd += d; else even += d; }
  return String((10 - ((odd * 3 + even) % 10)) % 10);
}

function validateAndNormalize(value: string, format: FormatValue): { ok: boolean; normalized: string; error: string } {
  const v = value.trim();
  if (!v) return { ok: false, normalized: "", error: "Please enter a barcode value." };

  if (format === "EAN13") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 12) return { ok: true, normalized: digits + ean13CheckDigit(digits), error: "" };
    if (digits.length === 13) return { ok: true, normalized: digits, error: "" };
    return { ok: false, normalized: "", error: "EAN-13 requires 12 or 13 digits." };
  }
  if (format === "EAN8") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 7) return { ok: true, normalized: digits + ean8CheckDigit(digits), error: "" };
    if (digits.length === 8) return { ok: true, normalized: digits, error: "" };
    return { ok: false, normalized: "", error: "EAN-8 requires 7 or 8 digits." };
  }
  if (format === "UPC") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 11) return { ok: true, normalized: digits + upcACheckDigit(digits), error: "" };
    if (digits.length === 12) return { ok: true, normalized: digits, error: "" };
    return { ok: false, normalized: "", error: "UPC-A requires 11 or 12 digits." };
  }
  if (format === "CODE39") {
    if (!/^[A-Z0-9 \-.$/+%]*$/.test(v.toUpperCase())) {
      return { ok: false, normalized: "", error: "Code 39 only supports A–Z, 0–9, space, - . $ / + %." };
    }
    return { ok: true, normalized: v.toUpperCase(), error: "" };
  }
  // CODE128 - any printable ASCII
  for (const ch of v) {
    if (ch.charCodeAt(0) < 32 || ch.charCodeAt(0) > 126) {
      return { ok: false, normalized: "", error: `Character "${ch}" is not supported in Code 128.` };
    }
  }
  return { ok: true, normalized: v, error: "" };
}

// ─── Main component ───────────────────────────────────────────────────────────

interface BarcodeOpts {
  format: FormatValue;
  barWidth: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  margin: number;
  lineColor: string;
  background: string;
}

interface LogoOpts {
  source: "none" | "upload" | "social";
  socialId: string;
  uploadDataUrl: string;
  size: number;        // % of barcode width
  padding: number;     // px around logo
  paddingColor: string;
  opacity: number;     // 0-1
}

const DEFAULT_BARCODE: BarcodeOpts = {
  format: "CODE128", barWidth: 2, height: 100, displayValue: true,
  fontSize: 14, margin: 10, lineColor: "#000000", background: "#ffffff",
};

const DEFAULT_LOGO: LogoOpts = {
  source: "none", socialId: "instagram", uploadDataUrl: "",
  size: 18, padding: 4, paddingColor: "#ffffff", opacity: 1,
};

const inputCls = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/50 transition";
const inputSty = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" };
const labelSty = { color: "var(--text-muted)" };

export default function BarcodeWithLogoClient() {
  const [value,      setValue]      = useState("");
  const [barOpts,    setBarOpts]    = useState<BarcodeOpts>(DEFAULT_BARCODE);
  const [logoOpts,   setLogoOpts]   = useState<LogoOpts>(DEFAULT_LOGO);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [warnings,   setWarnings]   = useState<string[]>([]);
  const [pngUrl,     setPngUrl]     = useState<string | null>(null);
  const [jpgUrl,     setJpgUrl]     = useState<string | null>(null);
  const [svgStr,     setSvgStr]     = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Revoke old object URLs on unmount
  useEffect(() => () => { if (pngUrl) URL.revokeObjectURL(pngUrl); if (jpgUrl) URL.revokeObjectURL(jpgUrl); }, []);

  // ── Logo source helpers ──────────────────────────────────────────────────

  function getActiveSocialSvg(): string | null {
    const s = SOCIAL_LOGOS.find((s) => s.id === logoOpts.socialId);
    return s ? s.svg : null;
  }

  async function logoDataUrl(): Promise<string | null> {
    if (logoOpts.source === "none") return null;
    if (logoOpts.source === "upload" && logoOpts.uploadDataUrl) return logoOpts.uploadDataUrl;
    if (logoOpts.source === "social") {
      const svg = getActiveSocialSvg();
      if (svg) return svgToDataUrl(svg);
    }
    return null;
  }

  // ── File upload ──────────────────────────────────────────────────────────

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo file must be smaller than 2 MB.");
      return;
    }

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setError("Please upload a PNG, JPG, WebP or SVG logo file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      let result = ev.target?.result as string;
      if (file.type === "image/svg+xml") {
        // Sanitize SVG before using as data URL
        const raw = atob(result.split(",")[1] ?? "");
        const clean = sanitizeSvg(raw);
        result = `data:image/svg+xml;base64,${btoa(clean)}`;
      }
      setLogoOpts((o) => ({ ...o, uploadDataUrl: result, source: "upload" }));
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Generate ─────────────────────────────────────────────────────────────

  const generate = useCallback(async () => {
    setError(null);
    setWarnings([]);

    const { ok, normalized, error: valErr } = validateAndNormalize(value, barOpts.format);
    if (!ok) { setError(valErr); return; }

    // Contrast warning
    const warns: string[] = [];
    const cr = contrastRatio(barOpts.lineColor, barOpts.background);
    if (cr < 4) warns.push("Low contrast between bar and background color may reduce scanability.");

    setLoading(true);
    setPngUrl(null);
    setJpgUrl(null);
    setSvgStr(null);

    try {
      const JsBarcode = (await import("jsbarcode")).default;

      // 1. Generate SVG barcode
      const svgNS = "http://www.w3.org/2000/svg";
      const svgEl = document.createElementNS(svgNS, "svg");

      JsBarcode(svgEl, normalized, {
        format: barOpts.format,
        width:        barOpts.barWidth,
        height:       barOpts.height,
        displayValue: barOpts.displayValue,
        fontSize:     barOpts.fontSize,
        margin:       barOpts.margin,
        lineColor:    barOpts.lineColor,
        background:   barOpts.background,
        valid: (v: boolean) => { if (!v) throw new Error(`"${normalized}" is not a valid ${barOpts.format} value.`); },
      });

      const svgSerialized = new XMLSerializer().serializeToString(svgEl);
      setSvgStr(svgSerialized);

      // 2. Render SVG → canvas
      const svgBlob = new Blob([svgSerialized], { type: "image/svg+xml;charset=utf-8" });
      const svgObjectUrl = URL.createObjectURL(svgBlob);
      const barcodeImg = await loadImage(svgObjectUrl);
      URL.revokeObjectURL(svgObjectUrl);

      const canvas = canvasRef.current!;
      canvas.width  = barcodeImg.width  || 300;
      canvas.height = barcodeImg.height || 150;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(barcodeImg, 0, 0);

      // 3. Overlay logo (if selected)
      const lUrl = await logoDataUrl();
      if (lUrl) {
        const logoImg = await loadImage(lUrl);
        const logoW = Math.round(canvas.width * (logoOpts.size / 100));
        const aspectRatio = logoImg.naturalHeight / logoImg.naturalWidth;
        const logoH = Math.round(logoW * (aspectRatio || 1));

        if (logoW > canvas.width * 0.4) {
          warns.push(`Logo is large (${logoOpts.size}% of barcode width). Logos over 20% may prevent reliable scanning.`);
        }

        const lx = Math.round((canvas.width  - logoW) / 2);
        const ly = Math.round((canvas.height - logoH) / 2);

        // Padding background
        if (logoOpts.padding > 0) {
          const pad = logoOpts.padding;
          ctx.fillStyle = logoOpts.paddingColor;
          ctx.beginPath();
          ctx.roundRect(lx - pad, ly - pad, logoW + pad * 2, logoH + pad * 2, pad);
          ctx.fill();
        }

        ctx.globalAlpha = logoOpts.opacity;
        ctx.drawImage(logoImg, lx, ly, logoW, logoH);
        ctx.globalAlpha = 1;
      }

      // 4. Export PNG
      const png = canvas.toDataURL("image/png");
      setPngUrl(png);

      // 5. Export JPG
      const jpg = canvas.toDataURL("image/jpeg", 0.95);
      setJpgUrl(jpg);

      setWarnings(warns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Barcode generation failed. Please check your value.");
    } finally {
      setLoading(false);
    }
  }, [value, barOpts, logoOpts]);

  // ── Download helpers ─────────────────────────────────────────────────────

  function downloadDataUrl(dataUrl: string, filename: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  function downloadSvg() {
    if (!svgStr) return;
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "barcode.svg"; a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    if (!pngUrl) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><body style="margin:0;text-align:center"><img src="${pngUrl}" style="max-width:100%"/></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  const hint = FORMATS.find((f) => f.value === barOpts.format)?.hint ?? "";
  const hasResult = pngUrl !== null;

  return (
    <div className="space-y-6">
      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* ── Main layout: controls + preview ──────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

        {/* Left: controls */}
        <div className="space-y-5">

          {/* Barcode value + format */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Barcode
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="blwl-format" className="block mb-1 text-xs font-medium" style={labelSty}>
                  Format
                </label>
                <select id="blwl-format" value={barOpts.format}
                  onChange={(e) => { setBarOpts((o) => ({ ...o, format: e.target.value as FormatValue })); setError(null); }}
                  className={inputCls} style={inputSty}>
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="blwl-value" className="block mb-1 text-xs font-medium" style={labelSty}>
                  Value
                </label>
                <input id="blwl-value" type="text" value={value}
                  placeholder={barOpts.format === "EAN13" ? "590123412345" : barOpts.format === "EAN8" ? "9638507" : barOpts.format === "UPC" ? "03600029145" : "Enter value…"}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  className={inputCls} style={inputSty} />
                {hint && <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>{hint}</p>}
              </div>
            </div>

            {/* Barcode appearance */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="blwl-bw" className="block mb-1 text-xs font-medium" style={labelSty}>
                  Bar width: {barOpts.barWidth}px
                </label>
                <input id="blwl-bw" type="range" min={1} max={4} step={0.5} value={barOpts.barWidth}
                  onChange={(e) => setBarOpts((o) => ({ ...o, barWidth: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-amber-400" />
              </div>
              <div>
                <label htmlFor="blwl-bh" className="block mb-1 text-xs font-medium" style={labelSty}>
                  Height: {barOpts.height}px
                </label>
                <input id="blwl-bh" type="range" min={40} max={200} step={10} value={barOpts.height}
                  onChange={(e) => setBarOpts((o) => ({ ...o, height: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-amber-400" />
              </div>
              <div>
                <label htmlFor="blwl-margin" className="block mb-1 text-xs font-medium" style={labelSty}>
                  Margin: {barOpts.margin}px
                </label>
                <input id="blwl-margin" type="range" min={0} max={40} step={5} value={barOpts.margin}
                  onChange={(e) => setBarOpts((o) => ({ ...o, margin: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-amber-400" />
              </div>
              <div>
                <label htmlFor="blwl-fg" className="block mb-1 text-xs font-medium" style={labelSty}>Bar color</label>
                <div className="flex items-center gap-2">
                  <input id="blwl-fg" type="color" value={barOpts.lineColor}
                    onChange={(e) => setBarOpts((o) => ({ ...o, lineColor: e.target.value }))}
                    className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{barOpts.lineColor}</span>
                </div>
              </div>
              <div>
                <label htmlFor="blwl-bg" className="block mb-1 text-xs font-medium" style={labelSty}>Background</label>
                <div className="flex items-center gap-2">
                  <input id="blwl-bg" type="color" value={barOpts.background}
                    onChange={(e) => setBarOpts((o) => ({ ...o, background: e.target.value }))}
                    className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{barOpts.background}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input id="blwl-showval" type="checkbox" checked={barOpts.displayValue}
                  onChange={(e) => setBarOpts((o) => ({ ...o, displayValue: e.target.checked }))}
                  className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
                <label htmlFor="blwl-showval" className="cursor-pointer text-sm" style={{ color: "var(--text-secondary)" }}>
                  Show value text
                </label>
              </div>
            </div>
          </div>

          {/* Logo section */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Logo overlay
            </h2>

            {/* Source selector */}
            <div className="flex flex-wrap gap-2">
              {(["none", "social", "upload"] as const).map((src) => (
                <button key={src} type="button"
                  onClick={() => setLogoOpts((o) => ({ ...o, source: src }))}
                  className="focus-ring rounded border px-3 py-1.5 text-xs font-medium transition capitalize"
                  style={{
                    borderColor: logoOpts.source === src ? "var(--accent)" : "var(--border-strong)",
                    backgroundColor: logoOpts.source === src ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                    color: logoOpts.source === src ? "var(--accent)" : "var(--text-muted)",
                  }}>
                  {src === "none" ? "No logo" : src === "social" ? "Social logo" : "Upload logo"}
                </button>
              ))}
            </div>

            {/* Social picker */}
            {logoOpts.source === "social" && (
              <div>
                <p className="mb-2 text-xs font-medium" style={labelSty}>Choose social logo</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_LOGOS.map((s) => (
                    <button key={s.id} type="button"
                      onClick={() => setLogoOpts((o) => ({ ...o, socialId: s.id }))}
                      title={s.label}
                      className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border transition hover:opacity-80"
                      style={{
                        borderColor: logoOpts.socialId === s.id ? "var(--accent)" : "var(--border-strong)",
                        backgroundColor: logoOpts.socialId === s.id ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "var(--bg-elevated)",
                      }}
                      aria-label={s.label}
                      aria-pressed={logoOpts.socialId === s.id}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={svgToDataUrl(s.svg)} alt={s.label} className="h-6 w-6" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Upload */}
            {logoOpts.source === "upload" && (
              <div>
                <label htmlFor="blwl-logo-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V7H2.75a.75.75 0 0 0 0 1.5H7.25v4.25a.75.75 0 0 0 1.5 0V8.5h4.25a.75.75 0 0 0 0-1.5H8.75V2.75Z" />
                  </svg>
                  Choose image
                </label>
                <input id="blwl-logo-upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only" onChange={handleLogoUpload} aria-label="Upload logo image" />
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  PNG, JPG, WebP or SVG - max 2 MB. SVG files are sanitized before use.
                </p>
                {logoOpts.uploadDataUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoOpts.uploadDataUrl} alt="Uploaded logo preview" className="h-10 w-10 rounded border object-contain"
                      style={{ borderColor: "var(--border)", backgroundColor: "#fff" }} />
                    <button type="button" onClick={() => setLogoOpts((o) => ({ ...o, uploadDataUrl: "" }))}
                      className="text-xs" style={{ color: "var(--coral)" }}>Remove</button>
                  </div>
                )}
              </div>
            )}

            {/* Logo size + padding */}
            {logoOpts.source !== "none" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="blwl-lsize" className="block mb-1 text-xs font-medium" style={labelSty}>
                    Logo size: {logoOpts.size}%
                  </label>
                  <input id="blwl-lsize" type="range" min={5} max={40} step={1} value={logoOpts.size}
                    onChange={(e) => setLogoOpts((o) => ({ ...o, size: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-amber-400" />
                </div>
                <div>
                  <label htmlFor="blwl-lpad" className="block mb-1 text-xs font-medium" style={labelSty}>
                    Padding: {logoOpts.padding}px
                  </label>
                  <input id="blwl-lpad" type="range" min={0} max={16} step={1} value={logoOpts.padding}
                    onChange={(e) => setLogoOpts((o) => ({ ...o, padding: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-amber-400" />
                </div>
                <div>
                  <label htmlFor="blwl-lopacity" className="block mb-1 text-xs font-medium" style={labelSty}>
                    Opacity: {Math.round(logoOpts.opacity * 100)}%
                  </label>
                  <input id="blwl-lopacity" type="range" min={0.1} max={1} step={0.05} value={logoOpts.opacity}
                    onChange={(e) => setLogoOpts((o) => ({ ...o, opacity: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-amber-400" />
                </div>
                <div>
                  <label htmlFor="blwl-lpadbg" className="block mb-1 text-xs font-medium" style={labelSty}>
                    Padding color
                  </label>
                  <div className="flex items-center gap-2">
                    <input id="blwl-lpadbg" type="color" value={logoOpts.paddingColor}
                      onChange={(e) => setLogoOpts((o) => ({ ...o, paddingColor: e.target.value }))}
                      className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
                    <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{logoOpts.paddingColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate button */}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={generate} disabled={loading}
              className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
              {loading ? (
                <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>Generating…</>
              ) : "Generate Barcode"}
            </button>
            {hasResult && (
              <button type="button" onClick={() => { setPngUrl(null); setJpgUrl(null); setSvgStr(null); setValue(""); setWarnings([]); }}
                className="focus-ring inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Right: preview */}
        <div className="space-y-4">
          <div className="sticky top-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Preview
            </h2>
            <div className="rounded-xl border p-4 flex items-center justify-center min-h-[200px]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              {hasResult && pngUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pngUrl} alt="Generated barcode with logo" className="max-w-full rounded"
                  style={{ imageRendering: "pixelated" }} />
              ) : (
                <p className="text-xs text-center" style={{ color: "var(--text-subtle)" }}>
                  {loading ? "Generating…" : "Preview will appear here"}
                </p>
              )}
            </div>

            {/* Download + copy + print */}
            {hasResult && pngUrl && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => downloadDataUrl(pngUrl, "barcode-with-logo.png")}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
                  PNG
                </button>
                {jpgUrl && (
                  <button type="button" onClick={() => downloadDataUrl(jpgUrl, "barcode-with-logo.jpg")}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition hover:opacity-80"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    JPG
                  </button>
                )}
                {svgStr && logoOpts.source === "none" && (
                  <button type="button" onClick={downloadSvg}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition hover:opacity-80"
                    style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                    SVG
                  </button>
                )}
                <button type="button" onClick={handlePrint}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition hover:opacity-80"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  🖨️ Print
                </button>
                <CopyButton text={value.trim()} />
              </div>
            )}

            {svgStr && logoOpts.source !== "none" && (
              <p className="mt-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                SVG download is available when no logo is applied. For logo output, use PNG or JPG.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Errors + warnings */}
      {error && <StatusBanner type="error" message={error} />}
      {warnings.map((w, i) => <StatusBanner key={i} type="info" message={w} />)}

      {/* Privacy */}
      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 Everything is processed locally in your browser. Your uploaded logos and barcode values are never sent to any server.
      </p>
    </div>
  );
}
