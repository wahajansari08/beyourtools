"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";
import Btn from "@/components/Btn";

// ─── Types ────────────────────────────────────────────────────────────────────

type InputType = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard" | "location";
type ErrorLevel = "L" | "M" | "Q" | "H";

interface WiFiData { ssid: string; password: string; security: "WPA" | "WEP" | "nopass"; hidden: boolean }
interface VCardData { firstName: string; lastName: string; phone: string; email: string; company: string; website: string; address: string }

interface QROpts {
  size: number;
  margin: number;
  errorLevel: ErrorLevel;
  fgColor: string;
  bgColor: string;
}

interface LogoOpts {
  source: "none" | "upload" | "social";
  socialId: string;
  uploadDataUrl: string;
  size: number;       // % of QR size
  padding: number;    // px
  paddingColor: string;
  opacity: number;
}

// ─── Social logos (inline SVG, no external requests) ─────────────────────────

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

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function sanitizeSvg(raw: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, "image/svg+xml");
  ["script", "foreignObject", "iframe", "object", "use"].forEach((tag) =>
    doc.querySelectorAll(tag).forEach((el) => el.remove())
  );
  doc.querySelectorAll("*").forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (/^on/i.test(attr.name) || (/^href$/i.test(attr.name) && /^javascript/i.test(attr.value))) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return new XMLSerializer().serializeToString(doc.documentElement);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image."));
    img.src = src;
  });
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a), lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// ─── Payload builders (identical to QRGeneratorClient) ─────────────────────

function escapeWifi(s: string) {
  return s.replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/"/g,'\\"').replace(/:/g,"\\:");
}

function buildPayload(inputType: InputType, textValue: string, wifi: WiFiData, vcard: VCardData): string {
  switch (inputType) {
    case "url": {
      const v = textValue.trim();
      if (!v) throw new Error("Please enter a URL.");
      return /^https?:\/\//i.test(v) ? v : "https://" + v;
    }
    case "email": {
      const v = textValue.trim();
      if (!v || !v.includes("@")) throw new Error("Please enter a valid email address.");
      return `mailto:${v}`;
    }
    case "phone": {
      const v = textValue.trim();
      if (!v) throw new Error("Please enter a phone number.");
      return `tel:${v}`;
    }
    case "sms": {
      const v = textValue.trim();
      if (!v) throw new Error("Please enter a phone number for SMS.");
      return `sms:${v}`;
    }
    case "location": {
      const v = textValue.trim();
      if (!v || !v.includes(",")) throw new Error('Enter coordinates as "latitude,longitude".');
      const [lat, lng] = v.split(",").map((x) => parseFloat(x.trim()));
      if (isNaN(lat) || isNaN(lng)) throw new Error("Invalid coordinates. Use format: 48.8566,2.3522");
      return `geo:${lat},${lng}`;
    }
    case "wifi": {
      if (!wifi.ssid.trim()) throw new Error("Please enter the WiFi network name (SSID).");
      return `WIFI:T:${wifi.security};S:${escapeWifi(wifi.ssid)};P:${escapeWifi(wifi.password)};H:${wifi.hidden};;`;
    }
    case "vcard": {
      if (!vcard.firstName.trim() && !vcard.lastName.trim()) throw new Error("Please enter at least a first or last name.");
      return [
        "BEGIN:VCARD","VERSION:3.0",
        `N:${vcard.lastName};${vcard.firstName};;;`,
        `FN:${vcard.firstName} ${vcard.lastName}`,
        vcard.phone   ? `TEL:${vcard.phone}`    : "",
        vcard.email   ? `EMAIL:${vcard.email}`  : "",
        vcard.company ? `ORG:${vcard.company}`  : "",
        vcard.website ? `URL:${vcard.website}`  : "",
        vcard.address ? `ADR:;;${vcard.address};;;;` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    }
    default: {
      const v = textValue.trim();
      if (!v) throw new Error("Please enter some text.");
      return v;
    }
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INPUT_LABELS: Record<InputType, string> = {
  url: "URL", text: "Plain Text", email: "Email", phone: "Phone",
  sms: "SMS", wifi: "WiFi", vcard: "vCard", location: "Location (lat,lng)",
};

const DEFAULT_QR: QROpts = { size: 300, margin: 4, errorLevel: "H", fgColor: "#000000", bgColor: "#ffffff" };
const DEFAULT_LOGO: LogoOpts = { source: "none", socialId: "instagram", uploadDataUrl: "", size: 20, padding: 4, paddingColor: "#ffffff", opacity: 1 };
const DEFAULT_WIFI: WiFiData = { ssid: "", password: "", security: "WPA", hidden: false };
const DEFAULT_VCARD: VCardData = { firstName: "", lastName: "", phone: "", email: "", company: "", website: "", address: "" };

const inputCls = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/50 transition";
const inputSty = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" };
const lblSty   = { color: "var(--text-muted)" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function QRWithLogoClient() {
  const [inputType,  setInputType]  = useState<InputType>("url");
  const [textValue,  setTextValue]  = useState("");
  const [wifi,       setWifi]       = useState<WiFiData>(DEFAULT_WIFI);
  const [vcard,      setVcard]      = useState<VCardData>(DEFAULT_VCARD);
  const [qrOpts,     setQrOpts]     = useState<QROpts>(DEFAULT_QR);
  const [logoOpts,   setLogoOpts]   = useState<LogoOpts>(DEFAULT_LOGO);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [warnings,   setWarnings]   = useState<string[]>([]);
  const [pngUrl,     setPngUrl]     = useState<string | null>(null);
  const [jpgUrl,     setJpgUrl]     = useState<string | null>(null);
  const [svgString,  setSvgString]  = useState<string | null>(null);
  const [payload,    setPayload]    = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => () => { /* revocation handled inline */ }, []);

  // ── Logo data URL ─────────────────────────────────────────────────────────

  async function getLogoUrl(): Promise<string | null> {
    if (logoOpts.source === "none") return null;
    if (logoOpts.source === "upload" && logoOpts.uploadDataUrl) return logoOpts.uploadDataUrl;
    if (logoOpts.source === "social") {
      const s = SOCIAL_LOGOS.find((s) => s.id === logoOpts.socialId);
      return s ? svgToDataUrl(s.svg) : null;
    }
    return null;
  }

  // ── Logo upload ───────────────────────────────────────────────────────────

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Logo must be under 2 MB."); return; }
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) { setError("Please upload a PNG, JPG, WebP or SVG logo."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      let result = ev.target?.result as string;
      if (file.type === "image/svg+xml") {
        const raw = atob(result.split(",")[1] ?? "");
        const clean = sanitizeSvg(raw);
        result = `data:image/svg+xml;base64,${btoa(clean)}`;
      }
      setLogoOpts((o) => ({ ...o, uploadDataUrl: result, source: "upload" }));
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // ── Generate ──────────────────────────────────────────────────────────────

  const generate = useCallback(async () => {
    setError(null);
    setWarnings([]);
    setPngUrl(null);
    setJpgUrl(null);
    setSvgString(null);

    let builtPayload: string;
    try {
      builtPayload = buildPayload(inputType, textValue, wifi, vcard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid input.");
      return;
    }
    setPayload(builtPayload);

    const warns: string[] = [];

    // Contrast check
    const cr = contrastRatio(qrOpts.fgColor, qrOpts.bgColor);
    if (cr < 4) warns.push("Low contrast between QR color and background may reduce scanability.");

    // Force H error correction when logo is applied - must tolerate damage
    const effectiveErrorLevel: ErrorLevel = logoOpts.source !== "none" ? "H" : qrOpts.errorLevel;
    if (logoOpts.source !== "none" && qrOpts.errorLevel !== "H") {
      warns.push("Error correction has been set to H (30%) automatically - required for reliable scanning with a logo overlay.");
    }

    setLoading(true);
    try {
      const QRCode = (await import("qrcode")).default;

      // 1. Generate QR as PNG data URL (used as base for canvas)
      const qrDataUrl = await QRCode.toDataURL(builtPayload, {
        width: qrOpts.size,
        margin: qrOpts.margin,
        errorCorrectionLevel: effectiveErrorLevel,
        color: { dark: qrOpts.fgColor, light: qrOpts.bgColor },
      });

      // 2. Generate QR as SVG string (for SVG export)
      const qrSvg = await QRCode.toString(builtPayload, {
        type: "svg",
        margin: qrOpts.margin,
        errorCorrectionLevel: effectiveErrorLevel,
        color: { dark: qrOpts.fgColor, light: qrOpts.bgColor },
      });

      // 3. Draw QR onto canvas
      const canvas = canvasRef.current!;
      const qrImg = await loadImage(qrDataUrl);
      canvas.width  = qrImg.width  || qrOpts.size;
      canvas.height = qrImg.height || qrOpts.size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(qrImg, 0, 0);

      // 4. Overlay logo (if selected)
      const logoUrl = await getLogoUrl();
      if (logoUrl) {
        const logoImg = await loadImage(logoUrl);
        const logoW = Math.round(canvas.width * (logoOpts.size / 100));
        const logoH = Math.round(logoW * ((logoImg.naturalHeight || logoImg.height) / (logoImg.naturalWidth || logoImg.width || 1)));
        const lx = Math.round((canvas.width  - logoW) / 2);
        const ly = Math.round((canvas.height - logoH) / 2);

        if (logoOpts.size > 30) {
          warns.push(`Logo covers ${logoOpts.size}% of the QR code. Logos over 30% may prevent reliable scanning even with H error correction.`);
        }

        if (logoOpts.padding > 0) {
          const pad = logoOpts.padding;
          ctx.fillStyle = logoOpts.paddingColor;
          ctx.beginPath();
          const radius = Math.min(pad * 2, 8);
          ctx.roundRect(lx - pad, ly - pad, logoW + pad * 2, logoH + pad * 2, radius);
          ctx.fill();
        }

        ctx.globalAlpha = logoOpts.opacity;
        ctx.drawImage(logoImg, lx, ly, logoW, logoH);
        ctx.globalAlpha = 1;

        // For SVG with logo: embed the logo as a <image> element inside the SVG
        if (logoUrl) {
          const svgWithLogo = embedLogoInSvg(qrSvg, logoUrl, canvas.width, canvas.height, lx, ly, logoW, logoH, logoOpts);
          setSvgString(svgWithLogo);
        } else {
          setSvgString(qrSvg);
        }
      } else {
        setSvgString(qrSvg);
      }

      setPngUrl(canvas.toDataURL("image/png"));
      setJpgUrl(canvas.toDataURL("image/jpeg", 0.95));
      setWarnings(warns);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code. Please check your input.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputType, textValue, wifi, vcard, qrOpts, logoOpts]);

  // ── SVG with embedded logo ─────────────────────────────────────────────────

  function embedLogoInSvg(
    svgStr: string, logoUrl: string,
    cw: number, ch: number,
    lx: number, ly: number, lw: number, lh: number,
    logo: LogoOpts
  ): string {
    // Inject logo <image> (and optional padding rect) before </svg>
    const pad = logo.padding;
    const padRect = pad > 0
      ? `<rect x="${lx - pad}" y="${ly - pad}" width="${lw + pad * 2}" height="${lh + pad * 2}" rx="${Math.min(pad * 2, 8)}" fill="${logo.paddingColor}"/>`
      : "";
    const imgEl = `<image href="${logoUrl}" x="${lx}" y="${ly}" width="${lw}" height="${lh}" opacity="${logo.opacity}" preserveAspectRatio="xMidYMid meet"/>`;
    return svgStr.replace("</svg>", `${padRect}${imgEl}</svg>`);
  }

  // ── Downloads ─────────────────────────────────────────────────────────────

  function downloadDataUrl(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
  }

  function downloadSvg() {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "qrcode-with-logo.svg"; a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    if (!pngUrl) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><body style="margin:0;text-align:center;padding:20px"><img src="${pngUrl}" style="max-width:400px"/></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  const hasResult = pngUrl !== null;

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

        {/* ── Left: controls ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Content type tabs */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Content type
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(INPUT_LABELS) as InputType[]).map((t) => (
                <Btn variant="toggle" size="sm" key={t} onClick={() => { setInputType(t); setTextValue(""); setError(null); }} selected={inputType === t}>{INPUT_LABELS[t]}</Btn>
              ))}
            </div>
          </div>

          {/* Content input */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>

            {inputType !== "wifi" && inputType !== "vcard" && (
              <div>
                <label htmlFor="qrl-value" className="block mb-1 text-xs font-medium" style={lblSty}>
                  {INPUT_LABELS[inputType]}
                </label>
                <input id="qrl-value" type="text" value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder={
                    inputType === "url"      ? "https://example.com"
                    : inputType === "email"  ? "you@example.com"
                    : inputType === "phone"  ? "+1 555 000 1234"
                    : inputType === "sms"    ? "+1 555 000 1234"
                    : inputType === "location" ? "48.8566,2.3522"
                    : "Enter your text…"
                  }
                  className={inputCls} style={inputSty} />
              </div>
            )}

            {inputType === "wifi" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qrl-ssid" className="block mb-1 text-xs font-medium" style={lblSty}>Network Name (SSID)</label>
                  <input id="qrl-ssid" type="text" value={wifi.ssid} placeholder="My WiFi"
                    onChange={(e) => setWifi((w) => ({ ...w, ssid: e.target.value }))}
                    className={inputCls} style={inputSty} />
                </div>
                <div>
                  <label htmlFor="qrl-pass" className="block mb-1 text-xs font-medium" style={lblSty}>Password</label>
                  <input id="qrl-pass" type="text" value={wifi.password} placeholder="password"
                    onChange={(e) => setWifi((w) => ({ ...w, password: e.target.value }))}
                    className={inputCls} style={inputSty} />
                </div>
                <div>
                  <label htmlFor="qrl-sec" className="block mb-1 text-xs font-medium" style={lblSty}>Security</label>
                  <select id="qrl-sec" value={wifi.security}
                    onChange={(e) => setWifi((w) => ({ ...w, security: e.target.value as WiFiData["security"] }))}
                    className={inputCls} style={inputSty}>
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input id="qrl-hidden" type="checkbox" checked={wifi.hidden}
                    onChange={(e) => setWifi((w) => ({ ...w, hidden: e.target.checked }))}
                    className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
                  <label htmlFor="qrl-hidden" className="cursor-pointer text-sm" style={{ color: "var(--text-secondary)" }}>Hidden network</label>
                </div>
              </div>
            )}

            {inputType === "vcard" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {([
                  ["firstName","First Name","John"],["lastName","Last Name","Doe"],
                  ["phone","Phone","+1 555 000 1234"],["email","Email","john@example.com"],
                  ["company","Company","Acme Inc."],["website","Website","https://example.com"],
                  ["address","Address","123 Main St, City"],
                ] as const).map(([key, label, placeholder]) => (
                  <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                    <label htmlFor={`qrl-vc-${key}`} className="block mb-1 text-xs font-medium" style={lblSty}>{label}</label>
                    <input id={`qrl-vc-${key}`} type="text" value={vcard[key]} placeholder={placeholder}
                      onChange={(e) => setVcard((v) => ({ ...v, [key]: e.target.value }))}
                      className={inputCls} style={inputSty} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QR customization */}
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide select-none"
              style={{ color: "var(--text-subtle)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                className="h-3.5 w-3.5 transition-transform group-open:rotate-90" aria-hidden="true">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"/>
              </svg>
              Customize QR code
            </summary>
            <div className="mt-3 grid gap-4 rounded-xl border p-5 sm:grid-cols-2 lg:grid-cols-3"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              <div>
                <label htmlFor="qrl-size" className="block mb-1 text-xs font-medium" style={lblSty}>Size: {qrOpts.size}px</label>
                <input id="qrl-size" type="range" min={128} max={512} step={32} value={qrOpts.size}
                  onChange={(e) => setQrOpts((o) => ({ ...o, size: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-amber-400" />
              </div>
              <div>
                <label htmlFor="qrl-margin" className="block mb-1 text-xs font-medium" style={lblSty}>Margin: {qrOpts.margin}</label>
                <input id="qrl-margin" type="range" min={0} max={10} step={1} value={qrOpts.margin}
                  onChange={(e) => setQrOpts((o) => ({ ...o, margin: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-amber-400" />
              </div>
              <div>
                <label htmlFor="qrl-ecc" className="block mb-1 text-xs font-medium" style={lblSty}>Error correction</label>
                <select id="qrl-ecc" value={qrOpts.errorLevel}
                  onChange={(e) => setQrOpts((o) => ({ ...o, errorLevel: e.target.value as ErrorLevel }))}
                  className={inputCls} style={inputSty}>
                  <option value="L">L - Low (7%)</option>
                  <option value="M">M - Medium (15%)</option>
                  <option value="Q">Q - Quartile (25%)</option>
                  <option value="H">H - High (30%) ★ recommended with logo</option>
                </select>
                {logoOpts.source !== "none" && (
                  <p className="mt-1 text-[11px]" style={{ color: "var(--teal)" }}>
                    H is used automatically when a logo is active.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="qrl-fg" className="block mb-1 text-xs font-medium" style={lblSty}>QR color</label>
                <div className="flex items-center gap-2">
                  <input id="qrl-fg" type="color" value={qrOpts.fgColor}
                    onChange={(e) => setQrOpts((o) => ({ ...o, fgColor: e.target.value }))}
                    className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{qrOpts.fgColor}</span>
                </div>
              </div>
              <div>
                <label htmlFor="qrl-bg" className="block mb-1 text-xs font-medium" style={lblSty}>Background</label>
                <div className="flex items-center gap-2">
                  <input id="qrl-bg" type="color" value={qrOpts.bgColor}
                    onChange={(e) => setQrOpts((o) => ({ ...o, bgColor: e.target.value }))}
                    className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
                  <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{qrOpts.bgColor}</span>
                </div>
              </div>
            </div>
          </details>

          {/* Logo section */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Logo overlay
            </h2>

            {/* Source selector */}
            <div className="flex flex-wrap gap-2">
              {(["none", "social", "upload"] as const).map((src) => (
                <Btn variant="toggle" size="sm" key={src} onClick={() => setLogoOpts((o) => ({ ...o, source: src }))} selected={logoOpts.source === src}>{src === "none" ? "No logo" : src === "social" ? "Social logo" : "Upload logo"}</Btn>
              ))}
            </div>

            {/* Social picker */}
            {logoOpts.source === "social" && (
              <div>
                <p className="mb-2 text-xs font-medium" style={lblSty}>Choose social logo</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_LOGOS.map((s) => (
                    <Btn variant="toggle" size="sm" key={s.id} onClick={() => setLogoOpts((o) => ({ ...o, socialId: s.id }))} selected={logoOpts.socialId === s.id} aria-label={s.label} title={s.label} className="h-10 w-10 p-0">{/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={svgToDataUrl(s.svg)} alt={s.label} className="h-6 w-6" /></Btn>
                  ))}
                </div>
              </div>
            )}

            {/* Upload */}
            {logoOpts.source === "upload" && (
              <div>
                <label htmlFor="qrl-logo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V7H2.75a.75.75 0 0 0 0 1.5H7.25v4.25a.75.75 0 0 0 1.5 0V8.5h4.25a.75.75 0 0 0 0-1.5H8.75V2.75Z"/>
                  </svg>
                  Choose image
                </label>
                <input id="qrl-logo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only" onChange={handleLogoUpload} aria-label="Upload logo image" />
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  PNG, JPG, WebP or SVG - max 2 MB. SVG files are sanitized.
                </p>
                {logoOpts.uploadDataUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoOpts.uploadDataUrl} alt="Uploaded logo" className="h-10 w-10 rounded border object-contain"
                      style={{ borderColor: "var(--border)", backgroundColor: "#fff" }} />
                    <Btn variant="danger" onClick={() => setLogoOpts((o) => ({ ...o, uploadDataUrl: "" }))}>Remove</Btn>
                  </div>
                )}
              </div>
            )}

            {/* Logo size/padding controls */}
            {logoOpts.source !== "none" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="qrl-lsize" className="block mb-1 text-xs font-medium" style={lblSty}>Logo size: {logoOpts.size}%</label>
                  <input id="qrl-lsize" type="range" min={5} max={40} step={1} value={logoOpts.size}
                    onChange={(e) => setLogoOpts((o) => ({ ...o, size: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-amber-400" />
                </div>
                <div>
                  <label htmlFor="qrl-lpad" className="block mb-1 text-xs font-medium" style={lblSty}>Padding: {logoOpts.padding}px</label>
                  <input id="qrl-lpad" type="range" min={0} max={16} step={1} value={logoOpts.padding}
                    onChange={(e) => setLogoOpts((o) => ({ ...o, padding: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-amber-400" />
                </div>
                <div>
                  <label htmlFor="qrl-lopacity" className="block mb-1 text-xs font-medium" style={lblSty}>
                    Opacity: {Math.round(logoOpts.opacity * 100)}%
                  </label>
                  <input id="qrl-lopacity" type="range" min={0.1} max={1} step={0.05} value={logoOpts.opacity}
                    onChange={(e) => setLogoOpts((o) => ({ ...o, opacity: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-amber-400" />
                </div>
                <div>
                  <label htmlFor="qrl-lpadbg" className="block mb-1 text-xs font-medium" style={lblSty}>Padding color</label>
                  <div className="flex items-center gap-2">
                    <input id="qrl-lpadbg" type="color" value={logoOpts.paddingColor}
                      onChange={(e) => setLogoOpts((o) => ({ ...o, paddingColor: e.target.value }))}
                      className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
                    <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{logoOpts.paddingColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate / Reset */}
          <div className="flex flex-wrap gap-3">
            <Btn variant="primary" size="lg" disabled={loading} onClick={generate}>{loading ? (
                <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>Generating…</>
              ) : "Generate QR Code"}</Btn>
            {hasResult && (
              <Btn variant="secondary" size="md" onClick={() => { setPngUrl(null); setJpgUrl(null); setSvgString(null); setWarnings([]); setTextValue(""); }}>Reset</Btn>
            )}
          </div>
        </div>

        {/* ── Right: preview ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="sticky top-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Preview
            </h2>
            <div className="flex min-h-[280px] items-center justify-center rounded-xl border p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
              {hasResult && pngUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pngUrl} alt="Generated QR code with logo" className="max-w-full rounded"
                  style={{ imageRendering: "pixelated" }} />
              ) : (
                <p className="text-center text-xs" style={{ color: "var(--text-subtle)" }}>
                  {loading ? "Generating…" : "Preview will appear here"}
                </p>
              )}
            </div>

            {/* Downloads */}
            {hasResult && pngUrl && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn variant="primary" size="sm" onClick={() => downloadDataUrl(pngUrl, "qrcode-with-logo.png")}>PNG</Btn>
                {jpgUrl && (
                  <Btn variant="secondary" size="sm" onClick={() => downloadDataUrl(jpgUrl, "qrcode-with-logo.jpg")}>JPG</Btn>
                )}
                {svgString && (
                  <Btn variant="secondary" size="sm" onClick={downloadSvg}>SVG</Btn>
                )}
                <Btn variant="secondary" size="sm" onClick={handlePrint}>🖨️ Print</Btn>
                {payload && <CopyButton text={payload} />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Errors & warnings */}
      {error    && <StatusBanner type="error" message={error} />}
      {warnings.map((w, i) => <StatusBanner key={i} type="info" message={w} />)}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 Everything is processed locally in your browser. Your QR data and uploaded logos are never sent to any server.
      </p>
    </div>
  );
}
