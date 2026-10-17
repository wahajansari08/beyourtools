"use client";

import { useState, useCallback } from "react";
import QRDisplay from "@/components/qr/QRDisplay";
import StatusBanner from "@/components/StatusBanner";
import Btn from "@/components/Btn";

// ─── Types ──────────────────────────────────────────────────────────────────

type InputType = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard" | "location";
type ErrorLevel = "L" | "M" | "Q" | "H";

interface WiFiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  website: string;
  address: string;
}

interface QROptions {
  size: number;
  margin: number;
  errorLevel: ErrorLevel;
  fgColor: string;
  bgColor: string;
}

// ─── WiFi escape ────────────────────────────────────────────────────────────

function escapeWifi(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/"/g, '\\"').replace(/:/g, "\\:");
}

function buildWifiPayload(d: WiFiData): string {
  const s = `WIFI:T:${d.security};S:${escapeWifi(d.ssid)};P:${escapeWifi(d.password)};H:${d.hidden};;`;
  return s;
}

function buildVCardPayload(d: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${d.lastName};${d.firstName};;;`,
    `FN:${d.firstName} ${d.lastName}`,
    d.phone ? `TEL:${d.phone}` : "",
    d.email ? `EMAIL:${d.email}` : "",
    d.company ? `ORG:${d.company}` : "",
    d.website ? `URL:${d.website}` : "",
    d.address ? `ADR:;;${d.address};;;;` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\n");
}

// ─── Component ──────────────────────────────────────────────────────────────

const DEFAULT_OPTS: QROptions = {
  size: 256,
  margin: 4,
  errorLevel: "M",
  fgColor: "#000000",
  bgColor: "#ffffff",
};

const DEFAULT_WIFI: WiFiData = { ssid: "", password: "", security: "WPA", hidden: false };
const DEFAULT_VCARD: VCardData = { firstName: "", lastName: "", phone: "", email: "", company: "", website: "", address: "" };

const INPUT_LABELS: Record<InputType, string> = {
  url: "URL",
  text: "Plain Text",
  email: "Email",
  phone: "Phone",
  sms: "SMS",
  wifi: "WiFi",
  vcard: "vCard",
  location: "Location (lat,lng)",
};

interface QRResult {
  dataUrl: string;
  svgString: string;
  value: string;
}

export default function QRGeneratorClient() {
  const [inputType, setInputType] = useState<InputType>("url");
  const [textValue, setTextValue] = useState("");
  const [wifi, setWifi] = useState<WiFiData>(DEFAULT_WIFI);
  const [vcard, setVcard] = useState<VCardData>(DEFAULT_VCARD);
  const [opts, setOpts] = useState<QROptions>(DEFAULT_OPTS);
  const [result, setResult] = useState<QRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const buildPayload = useCallback((): string => {
    switch (inputType) {
      case "url": {
        const v = textValue.trim();
        if (!v) throw new Error("Please enter a URL.");
        // add protocol if missing
        if (!/^https?:\/\//i.test(v)) return "https://" + v;
        return v;
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
        if (!v || !v.includes(",")) throw new Error('Please enter coordinates as "latitude,longitude".');
        const [lat, lng] = v.split(",").map((x) => parseFloat(x.trim()));
        if (isNaN(lat) || isNaN(lng)) throw new Error("Invalid coordinates. Use format: 48.8566,2.3522");
        return `geo:${lat},${lng}`;
      }
      case "wifi": {
        if (!wifi.ssid.trim()) throw new Error("Please enter the WiFi network name (SSID).");
        return buildWifiPayload(wifi);
      }
      case "vcard": {
        if (!vcard.firstName.trim() && !vcard.lastName.trim()) throw new Error("Please enter at least a first or last name.");
        return buildVCardPayload(vcard);
      }
      default: {
        const v = textValue.trim();
        if (!v) throw new Error("Please enter some text.");
        return v;
      }
    }
  }, [inputType, textValue, wifi, vcard]);

  const generate = useCallback(async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const payload = buildPayload();
      const QRCode = (await import("qrcode")).default;

      const dataUrl = await QRCode.toDataURL(payload, {
        width: opts.size,
        margin: opts.margin,
        errorCorrectionLevel: opts.errorLevel,
        color: { dark: opts.fgColor, light: opts.bgColor },
      });

      const svgString = await QRCode.toString(payload, {
        type: "svg",
        margin: opts.margin,
        errorCorrectionLevel: opts.errorLevel,
        color: { dark: opts.fgColor, light: opts.bgColor },
      });

      setResult({ dataUrl, svgString, value: payload });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  }, [buildPayload, opts]);

  const reset = () => {
    setResult(null);
    setError(null);
  };

  // ── Field helpers ─────────────────────────────────────────────────────────

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/50 transition";
  const inputStyle = {
    borderColor: "var(--border-strong)",
    backgroundColor: "var(--bg-elevated)",
    color: "var(--text-primary)",
  };
  const labelClass = "block mb-1 text-xs font-medium";
  const labelStyle = { color: "var(--text-muted)" };

  return (
    <div className="space-y-6">
      {/* ── Type selector ─────────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
          Content type
        </p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(INPUT_LABELS) as InputType[]).map((t) => (
            <Btn variant="toggle" size="sm" key={t} onClick={() => { setInputType(t); setTextValue(""); setError(null); setResult(null); }} selected={inputType === t}>{INPUT_LABELS[t]}</Btn>
          ))}
        </div>
      </div>

      {/* ── Input fields ──────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        {/* Simple text-based inputs */}
        {(inputType !== "wifi" && inputType !== "vcard") && (
          <div>
            <label htmlFor="qr-value" className={labelClass} style={labelStyle}>
              {INPUT_LABELS[inputType]}
            </label>
            <input
              id="qr-value"
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={
                inputType === "url" ? "https://example.com"
                  : inputType === "email" ? "you@example.com"
                  : inputType === "phone" ? "+1 555 000 1234"
                  : inputType === "sms" ? "+1 555 000 1234"
                  : inputType === "location" ? "48.8566,2.3522"
                  : "Enter your text…"
              }
              className={inputClass}
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && generate()}
            />
          </div>
        )}

        {/* WiFi fields */}
        {inputType === "wifi" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="wifi-ssid" className={labelClass} style={labelStyle}>Network Name (SSID)</label>
              <input id="wifi-ssid" type="text" value={wifi.ssid}
                onChange={(e) => setWifi((w) => ({ ...w, ssid: e.target.value }))}
                placeholder="My WiFi Network" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="wifi-pass" className={labelClass} style={labelStyle}>Password</label>
              <input id="wifi-pass" type="text" value={wifi.password}
                onChange={(e) => setWifi((w) => ({ ...w, password: e.target.value }))}
                placeholder="network password" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="wifi-security" className={labelClass} style={labelStyle}>Security</label>
              <select id="wifi-security" value={wifi.security}
                onChange={(e) => setWifi((w) => ({ ...w, security: e.target.value as WiFiData["security"] }))}
                className={inputClass} style={inputStyle}>
                <option value="WPA">WPA / WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input id="wifi-hidden" type="checkbox" checked={wifi.hidden}
                onChange={(e) => setWifi((w) => ({ ...w, hidden: e.target.checked }))}
                className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
              <label htmlFor="wifi-hidden" className="text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                Hidden network
              </label>
            </div>
          </div>
        )}

        {/* vCard fields */}
        {inputType === "vcard" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["firstName", "First Name", "John"],
                ["lastName", "Last Name", "Doe"],
                ["phone", "Phone", "+1 555 000 1234"],
                ["email", "Email", "john@example.com"],
                ["company", "Company", "Acme Inc."],
                ["website", "Website", "https://example.com"],
                ["address", "Address", "123 Main St, City"],
              ] as const
            ).map(([key, label, placeholder]) => (
              <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                <label htmlFor={`vc-${key}`} className={labelClass} style={labelStyle}>{label}</label>
                <input id={`vc-${key}`} type="text" value={vcard[key]}
                  onChange={(e) => setVcard((v) => ({ ...v, [key]: e.target.value }))}
                  placeholder={placeholder} className={inputClass} style={inputStyle} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Options ───────────────────────────────────────────────────── */}
      <details className="group">
        <summary
          className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide select-none"
          style={{ color: "var(--text-subtle)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
            className="h-3.5 w-3.5 transition-transform group-open:rotate-90" aria-hidden="true">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
          Customize QR code
        </summary>
        <div
          className="mt-3 grid gap-4 rounded-xl border p-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <div>
            <label htmlFor="qr-size" className={labelClass} style={labelStyle}>Size (px): {opts.size}</label>
            <input id="qr-size" type="range" min={128} max={512} step={32} value={opts.size}
              onChange={(e) => setOpts((o) => ({ ...o, size: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="qr-margin" className={labelClass} style={labelStyle}>Margin: {opts.margin}</label>
            <input id="qr-margin" type="range" min={0} max={10} step={1} value={opts.margin}
              onChange={(e) => setOpts((o) => ({ ...o, margin: Number(e.target.value) }))}
              className="w-full cursor-pointer accent-amber-400" />
          </div>
          <div>
            <label htmlFor="qr-ecc" className={labelClass} style={labelStyle}>Error correction</label>
            <select id="qr-ecc" value={opts.errorLevel}
              onChange={(e) => setOpts((o) => ({ ...o, errorLevel: e.target.value as ErrorLevel }))}
              className={inputClass} style={inputStyle}>
              <option value="L">L - Low (7%)</option>
              <option value="M">M - Medium (15%)</option>
              <option value="Q">Q - Quartile (25%)</option>
              <option value="H">H - High (30%)</option>
            </select>
          </div>
          <div>
            <label htmlFor="qr-fg" className={labelClass} style={labelStyle}>Foreground color</label>
            <div className="flex items-center gap-2">
              <input id="qr-fg" type="color" value={opts.fgColor}
                onChange={(e) => setOpts((o) => ({ ...o, fgColor: e.target.value }))}
                className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
              <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{opts.fgColor}</span>
            </div>
          </div>
          <div>
            <label htmlFor="qr-bg" className={labelClass} style={labelStyle}>Background color</label>
            <div className="flex items-center gap-2">
              <input id="qr-bg" type="color" value={opts.bgColor}
                onChange={(e) => setOpts((o) => ({ ...o, bgColor: e.target.value }))}
                className="h-9 w-14 cursor-pointer rounded border" style={{ borderColor: "var(--border-strong)" }} />
              <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{opts.bgColor}</span>
            </div>
          </div>
        </div>
      </details>

      {/* ── Generate button ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <Btn variant="primary" size="lg" onClick={generate} disabled={loading}>
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            "Generate QR Code"
          )}
        </Btn>
        {result && (
          <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
        )}
      </div>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && <StatusBanner type="error" message={error} />}

      {/* ── Result ────────────────────────────────────────────────────── */}
      {result && (
        <QRDisplay dataUrl={result.dataUrl} svgString={result.svgString} value={result.value} />
      )}

      {/* ── Privacy note ──────────────────────────────────────────────── */}
      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 Your data is processed locally in your browser and is never uploaded to any server.
      </p>
    </div>
  );
}
