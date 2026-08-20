"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import BarcodeResultBox from "@/components/barcode/BarcodeResultBox";
import StatusBanner from "@/components/StatusBanner";

type ScanState = "idle" | "requesting" | "scanning" | "done" | "error";

export default function BarcodeScannerClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<ScanState>("idle");
  const [result, setResult] = useState("");
  const [format, setFormat] = useState("");
  const [error, setError] = useState("");
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | undefined>(undefined);
  const [uploadDecoding, setUploadDecoding] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startScanning = useCallback(async (deviceId?: string) => {
    stopCamera();
    setState("requesting");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === "videoinput"));

      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      setState("scanning");

      // Use the continuous callback API
      reader.decodeFromVideoElement(
        videoRef.current!,
        (result, err) => {
          if (result) {
            stopCamera();
            setResult(result.getText());
            setFormat(result.getBarcodeFormat().toString());
            setState("done");
          }
          // err is a NotFoundException when no code is visible — ignore it
          void err;
        }
      ).catch(() => {
        // stream ended or was stopped — ignore
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Permission") || msg.includes("denied") || msg.includes("NotAllowed")) {
        setError("Camera permission was denied. Please allow camera access in your browser settings and try again.");
      } else if (msg.includes("NotFound") || msg.includes("DevicesNotFound")) {
        setError("No camera found on this device. You can still decode barcodes by uploading an image below.");
      } else {
        setError("Could not access camera. Check your browser settings, or use the image upload below.");
      }
      setState("error");
      stopCamera();
    }
  }, [stopCamera]);

  const reset = useCallback(() => {
    stopCamera();
    setState("idle");
    setResult("");
    setFormat("");
    setError("");
  }, [stopCamera]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadDecoding(true);
    setError("");
    try {
      const { decodeBarcodeFromFile } = await import("@/lib/barcode-decode");
      const res = await decodeBarcodeFromFile(file);
      stopCamera();
      setResult(res.text);
      setFormat(res.format);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No barcode found in the image.");
    } finally {
      setUploadDecoding(false);
    }
  }, [stopCamera]);

  const isScanning = state === "scanning" || state === "requesting";

  return (
    <div className="space-y-5">
      {state !== "done" && (
        <div className="flex flex-wrap items-center gap-3">
          {!isScanning ? (
            <button type="button" onClick={() => startScanning(activeCameraId)}
              className="focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
              </svg>
              Start Camera Scan
            </button>
          ) : (
            <button type="button" onClick={reset}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
              Stop Scanning
            </button>
          )}

          {isScanning && cameras.length > 1 && (
            <select value={activeCameraId ?? ""} aria-label="Select camera"
              onChange={(e) => { setActiveCameraId(e.target.value); startScanning(e.target.value); }}
              className="rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}>
              {cameras.map((c, i) => (
                <option key={c.deviceId} value={c.deviceId}>{c.label || `Camera ${i + 1}`}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {isScanning && (
        <div className="relative overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--border)", backgroundColor: "#000", aspectRatio: "4/3", maxHeight: "400px" }}>
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline
            aria-label="Camera feed for barcode scanning" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="relative w-64 h-24">
              <span className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2" style={{ borderColor: "var(--accent)" }} />
              <span className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2" style={{ borderColor: "var(--accent)" }} />
              <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2" style={{ borderColor: "var(--accent)" }} />
              <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2" style={{ borderColor: "var(--accent)" }} />
              <span className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 animate-pulse"
                style={{ backgroundColor: "var(--accent)", opacity: 0.7 }} />
            </div>
          </div>
          <p className="absolute bottom-3 left-0 right-0 text-center text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            {state === "requesting" ? "Requesting camera…" : "Point at a barcode to scan"}
          </p>
        </div>
      )}

      {state === "done" && (
        <BarcodeResultBox value={result} format={format} onReset={reset}
          onScanAgain={() => startScanning(activeCameraId)} />
      )}

      {(state === "error" || error) && state !== "done" && (
        <StatusBanner type="error" message={error} />
      )}

      {state !== "done" && (
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
            Or decode from an image file
          </p>
          <label htmlFor="bc-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            {uploadDecoding ? "Decoding…" : "Upload barcode image"}
          </label>
          <input id="bc-upload" type="file" accept="image/*" className="sr-only"
            onChange={handleUpload} aria-label="Upload barcode image" />
        </div>
      )}

      <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
        🔒 Camera frames and uploaded images are processed locally. Nothing is sent to a server.
        Camera scanning requires HTTPS.
      </p>
    </div>
  );
}
