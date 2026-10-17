"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Btn from "@/components/Btn";

type Mode = "draw" | "type";

const CANVAS_W = 640;
const CANVAS_H = 220;

const TYPE_FONTS = [
  { id: "brush", label: "Brush Script", css: '"Brush Script MT", "Segoe Script", cursive' },
  { id: "snell", label: "Snell Roundhand", css: '"Snell Roundhand", "Brush Script MT", cursive' },
  { id: "lucida", label: "Lucida Handwriting", css: '"Lucida Handwriting", "Segoe Script", cursive' },
  { id: "chancery", label: "Chancery", css: '"Apple Chancery", "URW Chancery L", cursive' },
  { id: "georgia", label: "Georgia Italic", css: 'italic Georgia, "Times New Roman", serif' },
  { id: "palatino", label: "Palatino Italic", css: 'italic "Palatino Linotype", Palatino, serif' },
];

const INK_COLORS = [
  { id: "#1a1a1a", label: "Black" },
  { id: "#1e3a8a", label: "Navy" },
  { id: "#0f766e", label: "Teal" },
  { id: "#7c2d12", label: "Brown" },
  { id: "#374151", label: "Gray" },
];

const checkerStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, var(--bg-elevated) 25%, transparent 25%, transparent 75%, var(--bg-elevated) 75%)," +
    "linear-gradient(45deg, var(--bg-elevated) 25%, transparent 25%, transparent 75%, var(--bg-elevated) 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 10px 10px",
};

export default function SignatureMakerClient() {
  const [mode, setMode] = useState<Mode>("draw");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [ink, setInk] = useState(INK_COLORS[0].id);
  const [typedName, setTypedName] = useState("");
  const [typedFont, setTypedFont] = useState(TYPE_FONTS[0].css);
  const [typedSize, setTypedSize] = useState(64);
  const [hasInk, setHasInk] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return { canvas, ctx };
  }, []);

  // Set up the canvas backing store once (DPR-aware), keep it transparent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = CANVAS_W * dpr;
    canvas.height = CANVAS_H * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  const canvasPoint = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (mode !== "draw") return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastRef.current = canvasPoint(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || mode !== "draw") return;
    e.preventDefault();
    const g = getCtx();
    const last = lastRef.current;
    if (!g || !last) return;
    const p = canvasPoint(e);
    g.ctx.strokeStyle = ink;
    g.ctx.lineWidth = strokeWidth;
    g.ctx.beginPath();
    g.ctx.moveTo(last.x, last.y);
    g.ctx.quadraticCurveTo(last.x, last.y, (last.x + p.x) / 2, (last.y + p.y) / 2);
    g.ctx.lineTo(p.x, p.y);
    g.ctx.stroke();
    lastRef.current = p;
    setHasInk(true);
  };

  const endStroke = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const clearCanvas = useCallback(() => {
    const g = getCtx();
    if (!g) return;
    g.ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    setHasInk(false);
  }, [getCtx]);

  // Render typed signature whenever its inputs change
  useEffect(() => {
    if (mode !== "type") return;
    const g = getCtx();
    if (!g) return;
    g.ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    const name = typedName.trim();
    if (!name) {
      setHasInk(false);
      return;
    }
    g.ctx.fillStyle = ink;
    g.ctx.font = `${typedSize}px ${typedFont}`;
    g.ctx.textAlign = "center";
    g.ctx.textBaseline = "middle";
    // Shrink to fit if the name is long
    let size = typedSize;
    while (g.ctx.measureText(name).width > CANVAS_W - 40 && size > 20) {
      size -= 4;
      g.ctx.font = `${size}px ${typedFont}`;
    }
    g.ctx.fillText(name, CANVAS_W / 2, CANVAS_H / 2 + 4);
    setHasInk(true);
  }, [mode, typedName, typedFont, typedSize, ink, getCtx]);

  const switchMode = (m: Mode) => {
    clearCanvas();
    setMode(m);
  };

  const download = (scale: 1 | 2) => {
    const src = canvasRef.current;
    if (!src || !hasInk) return;
    const out = document.createElement("canvas");
    out.width = CANVAS_W * scale;
    out.height = CANVAS_H * scale;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(src, 0, 0, out.width, out.height); // transparent background preserved
    out.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signature${scale === 2 ? "-2x" : ""}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
  };

  const sliderStyle = { accentColor: "var(--accent)" } as React.CSSProperties;

  return (
    <div>
      {/* Mode tabs */}
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Signature mode">
        <Btn variant="toggle" selected={mode === "draw"} onClick={() => switchMode("draw")} role="tab" aria-selected={mode === "draw"}>
          Draw it
        </Btn>
        <Btn variant="toggle" selected={mode === "type"} onClick={() => switchMode("type")} role="tab" aria-selected={mode === "type"}>
          Type it
        </Btn>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Canvas area */}
        <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="overflow-hidden rounded-lg border" style={{ ...checkerStyle, borderColor: "var(--border-strong)" }}>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "auto", display: "block", touchAction: "none", cursor: mode === "draw" ? "crosshair" : "default" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={endStroke}
              aria-label={mode === "draw" ? "Signature drawing area. Draw with your mouse, trackpad or finger." : "Signature preview"}
              role="img"
            />
          </div>
          <p className="mt-2 text-center text-xs" style={{ color: "var(--text-subtle)" }}>
            {mode === "draw"
              ? "Draw above with your mouse, trackpad, stylus or finger. The checkerboard means transparent background."
              : "Your typed signature appears above. The checkerboard means transparent background."}
          </p>

          {/* Type-mode inputs */}
          {mode === "type" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="sig-name" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Your name
                </label>
                <input
                  id="sig-name"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  maxLength={60}
                  className="focus-ring w-full rounded-lg border px-3 py-2.5 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                />
              </div>
              <div>
                <label htmlFor="sig-font" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Script style
                </label>
                <select
                  id="sig-font"
                  value={typedFont}
                  onChange={(e) => setTypedFont(e.target.value)}
                  className="focus-ring w-full rounded-lg border px-3 py-2.5 text-sm"
                  style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
                >
                  {TYPE_FONTS.map((f) => (
                    <option key={f.id} value={f.css} style={{ fontFamily: f.css }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sig-size" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Size <span className="font-normal" style={{ color: "var(--text-muted)" }}>{typedSize}px</span>
                </label>
                <input
                  id="sig-size"
                  type="range"
                  min={32}
                  max={110}
                  value={typedSize}
                  onChange={(e) => setTypedSize(parseInt(e.target.value, 10))}
                  className="mt-2.5 w-full"
                  style={sliderStyle}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Ink</h2>
            {mode === "draw" && (
              <div className="mb-4">
                <label htmlFor="sig-width" className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Stroke width <span style={{ color: "var(--text-subtle)" }}>{strokeWidth}px</span>
                </label>
                <input
                  id="sig-width"
                  type="range"
                  min={1}
                  max={12}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
                  className="w-full"
                  style={sliderStyle}
                />
              </div>
            )}
            <p className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Ink color</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ink color">
              {INK_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={ink === c.id}
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => setInk(c.id)}
                  className="focus-ring h-9 w-9 rounded-full border-2 transition"
                  style={{
                    backgroundColor: c.id,
                    borderColor: ink === c.id ? "var(--accent)" : "var(--border-strong)",
                    boxShadow: ink === c.id ? "0 0 0 2px var(--accent)" : "none",
                  }}
                />
              ))}
            </div>
            <Btn variant="secondary" size="sm" className="mt-4 w-full" onClick={clearCanvas} disabled={!hasInk && mode === "draw"}>
              Clear
            </Btn>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Download</h2>
            <div className="space-y-2">
              <Btn variant="primary" className="w-full" onClick={() => download(1)} disabled={!hasInk}>
                PNG - standard
              </Btn>
              <Btn variant="secondary" className="w-full" onClick={() => download(2)} disabled={!hasInk}>
                PNG - 2x size
              </Btn>
            </div>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
              Transparent background, ready to drop onto documents and forms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
