"use client";

import { useState, useCallback } from "react";
import QRDisplay from "@/components/qr/QRDisplay";
import StatusBanner from "@/components/StatusBanner";
import CopyButton from "@/components/CopyButton";

type Security = "WPA" | "WEP" | "nopass";

interface WiFiForm {
  ssid: string;
  password: string;
  security: Security;
  hidden: boolean;
}

function escapeWifi(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/"/g, '\\"')
    .replace(/:/g, "\\:");
}

function buildPayload(f: WiFiForm): string {
  return `WIFI:T:${f.security};S:${escapeWifi(f.ssid)};P:${escapeWifi(f.password)};H:${f.hidden};;`;
}

interface QRResult { dataUrl: string; svgString: string; value: string }

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400/50 transition";
const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" };

export default function WiFiQRClient() {
  const [form, setForm] = useState<WiFiForm>({ ssid: "", password: "", security: "WPA", hidden: false });
  const [result, setResult] = useState<QRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const generate = useCallback(async () => {
    setError(null);
    if (!form.ssid.trim()) { setError("Please enter the WiFi network name (SSID)."); return; }
    if (form.security !== "nopass" && !form.password) { setError("Please enter the WiFi password."); return; }
    setLoading(true);
    try {
      const payload = buildPayload(form);
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(payload, { width: 256, margin: 4, errorCorrectionLevel: "M" });
      const svgString = await QRCode.toString(payload, { type: "svg", margin: 4, errorCorrectionLevel: "M" });
      setResult({ dataUrl, svgString, value: payload });
    } catch {
      setError("Failed to generate QR code. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  }, [form]);

  const reset = () => { setResult(null); setError(null); setForm({ ssid: "", password: "", security: "WPA", hidden: false }); };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* SSID */}
          <div className="sm:col-span-2">
            <label htmlFor="wifi-ssid" className="block mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Network Name (SSID) <span style={{ color: "var(--coral)" }}>*</span>
            </label>
            <input id="wifi-ssid" type="text" value={form.ssid} placeholder="My Home WiFi"
              onChange={(e) => setForm((f) => ({ ...f, ssid: e.target.value }))}
              className={inputClass} style={inputStyle} />
          </div>

          {/* Security */}
          <div>
            <label htmlFor="wifi-sec" className="block mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Security type
            </label>
            <select id="wifi-sec" value={form.security}
              onChange={(e) => setForm((f) => ({ ...f, security: e.target.value as Security }))}
              className={inputClass} style={inputStyle}>
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None (open network)</option>
            </select>
          </div>

          {/* Password */}
          {form.security !== "nopass" && (
            <div>
              <label htmlFor="wifi-pass" className="block mb-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Password <span style={{ color: "var(--coral)" }}>*</span>
              </label>
              <div className="relative">
                <input id="wifi-pass" type={showPass ? "text" : "password"} value={form.password}
                  placeholder="network password"
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputClass + " pr-10"} style={inputStyle} />
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--text-subtle)" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {/* Hidden */}
          <div className="flex items-center gap-3 pt-1">
            <input id="wifi-hidden" type="checkbox" checked={form.hidden}
              onChange={(e) => setForm((f) => ({ ...f, hidden: e.target.checked }))}
              className="h-4 w-4 cursor-pointer rounded accent-amber-400" />
            <label htmlFor="wifi-hidden" className="cursor-pointer text-sm" style={{ color: "var(--text-secondary)" }}>
              Hidden network
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={generate} disabled={loading}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
          {loading ? "Generating…" : "Generate WiFi QR Code"}
        </button>
        {result && (
          <button type="button" onClick={reset}
            className="focus-ring inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium transition"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            Reset
          </button>
        )}
      </div>

      {error && <StatusBanner type="error" message={error} />}

      {result && (
        <div className="space-y-4">
          <QRDisplay dataUrl={result.dataUrl} svgString={result.svgString} value={result.value} />

          {/* Payload preview */}
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>WiFi payload</span>
              <CopyButton text={result.value} />
            </div>
            <code className="block break-all font-mono text-xs" style={{ color: "var(--teal)" }}>{result.value}</code>
          </div>

          {/* Tip */}
          <div className="rounded-lg border p-4 text-xs leading-relaxed"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>How to use: </span>
            Print or display this QR code near your router. Guests can open their phone&apos;s camera, point at the code, and tap the notification to join your WiFi — no typing required.
          </div>
        </div>
      )}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 Your WiFi credentials are never uploaded — all processing happens locally in your browser.
      </p>
    </div>
  );
}
