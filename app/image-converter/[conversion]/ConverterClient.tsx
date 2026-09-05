"use client";

import { useCallback, useRef, useState } from "react";
import { convertImage, suggestFilename } from "@/lib/converters/image";
import type { ImageFormat } from "@/lib/image-tools-config";
import Btn from "@/components/Btn";

// ─── Types ────────────────────────────────────────────────────────────────────

type FileStatus = "queued" | "converting" | "done" | "error";

interface FileItem {
  id: string;
  file: File;
  inputPreview: string; // object URL of source
  status: FileStatus;
  outputUrl: string;      // object URL of converted blob
  outputFilename: string;
  outputExt: string;
  outputMime: string;
  outputSize: number;
  outputBlob: Blob | null; // kept for ZIP
  error: string | null;
  warning: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2);
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1_048_576).toFixed(2)} MB`;
}

// Strip extension, append _2, _3 … for duplicates.
// We pre-build the final filename set so every item gets a unique name upfront.
function deduplicateFilenames(items: { outputFilename: string; outputExt: string }[]): string[] {
  const count = new Map<string, number>();
  // First pass: count occurrences of each base name
  for (const { outputFilename } of items) {
    count.set(outputFilename, (count.get(outputFilename) ?? 0) + 1);
  }
  // Second pass: assign unique names to duplicates
  const seen = new Map<string, number>();
  return items.map(({ outputFilename, outputExt }) => {
    if ((count.get(outputFilename) ?? 0) <= 1) return outputFilename;
    const next = (seen.get(outputFilename) ?? 1) + 1;
    seen.set(outputFilename, next);
    const base = outputFilename.replace(/\.[^/.]+$/, "");
    return `${base}_${next}.${outputExt}`;
  });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
    className="h-3.5 w-3.5" aria-hidden="true">
    <path d="M8.75 2.75a.75.75 0 0 0-1.5 0V8.44L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
    <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
    className="h-3.5 w-3.5" aria-hidden="true">
    <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
  </svg>
);

const RetryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
    className="h-3.5 w-3.5" aria-hidden="true">
    <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08 1.01.75.75 0 1 1-1.3-.75 6 6 0 0 1 9.44-1.344l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.344l-.842-.84v1.378a.75.75 0 0 1-1.5 0V9.7a.75.75 0 0 1 .75-.75h3.182a.75.75 0 0 1 0 1.5H4.013l.84.841a4.5 4.5 0 0 0 7.08-1.01.75.75 0 0 1 1.992.696Z" clipRule="evenodd" />
  </svg>
);

// ─── Drop zone ────────────────────────────────────────────────────────────────

function MultiDropzone({
  accept,
  fromLabel,
  onFiles,
}: {
  accept: string;
  fromLabel: string;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFiles(Array.from(files));
    },
    [onFiles]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className="focus-ring flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition"
      style={{
        borderColor: dragging ? "var(--accent)" : "var(--border-strong)",
        backgroundColor: dragging
          ? "color-mix(in srgb, var(--accent) 5%, transparent)"
          : "var(--bg-surface)",
      }}
      aria-label={`Add ${fromLabel} files`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 transition"
        style={{ color: dragging ? "var(--accent)" : "var(--text-subtle)" }}
        aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
      <div>
        <p className="text-sm font-medium"
          style={{ color: dragging ? "var(--accent)" : "var(--text-secondary)" }}>
          Drop {fromLabel} files here
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
          or click to browse - select multiple files at once
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        aria-hidden="true"
        tabIndex={-1}
      />
    </button>
  );
}

// ─── File row ─────────────────────────────────────────────────────────────────

function FileRow({
  item,
  isRasterOutput,
  onRemove,
  onRetry,
}: {
  item: FileItem;
  isRasterOutput: boolean;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  const statusColor =
    item.status === "done"      ? "var(--teal)"
    : item.status === "error"   ? "var(--coral)"
    : item.status === "converting" ? "var(--accent)"
    : "var(--text-subtle)";

  // BUG 5 FIX: show both input size and output size
  const sizeLine =
    item.status === "done"
      ? `${formatBytes(item.file.size)} → ${formatBytes(item.outputSize)}`
      : item.status === "queued" || item.status === "converting"
      ? formatBytes(item.file.size)
      : formatBytes(item.file.size);

  const statusLabel =
    item.status === "queued"     ? "Queued"
    : item.status === "converting" ? "Converting…"
    : item.status === "done"     ? "Done"
    : "Failed";

  return (
    <div
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2.5"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      role="listitem"
    >
      {/* Thumbnail */}
      <div
        className="h-12 w-12 shrink-0 overflow-hidden rounded"
        style={{ backgroundColor: "var(--bg-elevated)" }}
      >
        {item.inputPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              item.status === "done" && item.outputUrl && isRasterOutput
                ? item.outputUrl
                : item.inputPreview
            }
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        {/* Filename - show output name once done */}
        <p
          className="truncate text-xs font-medium"
          style={{ color: "var(--text-primary)" }}
          title={item.status === "done" ? item.outputFilename : item.file.name}
        >
          {item.status === "done" ? item.outputFilename : item.file.name}
        </p>

        {/* Status line */}
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {item.status === "converting" && (
            <span style={{ color: "var(--accent)" }}><SpinnerIcon /></span>
          )}
          <span className="text-[11px]" style={{ color: statusColor }}>
            {statusLabel}
          </span>
          {/* BUG 5 FIX: size info on same line */}
          <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
            · {sizeLine}
          </span>
        </div>

        {/* Inline warning (no duplicate banner elsewhere) */}
        {item.warning && (
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--accent)" }}>
            ⚠ {item.warning}
          </p>
        )}

        {/* Inline error */}
        {item.error && (
          <p className="mt-0.5 text-[11px]" style={{ color: "var(--coral)" }}>
            {item.error}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Download individual file */}
        {item.status === "done" && item.outputUrl && (
          <a
            href={item.outputUrl}
            download={item.outputFilename}
            className="focus-ring inline-flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-medium transition hover:opacity-80"
            style={{
              borderColor: "var(--border-strong)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--teal)",
            }}
            aria-label={`Download ${item.outputFilename}`}
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Download</span>
          </a>
        )}

        {/* BUG 6 FIX: retry button for failed files */}
        {item.status === "error" && (
          <Btn variant="secondary" size="sm" aria-label={`Retry ${item.file.name}`} onClick={() => onRetry(item.id)}><RetryIcon /><span className="hidden sm:inline">Retry</span></Btn>
        )}

        {/* Remove - available unless actively converting */}
        {item.status !== "converting" && (
          <Btn variant="icon" aria-label={`Remove ${item.file.name}`} onClick={() => onRemove(item.id)}><TrashIcon /></Btn>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConverterClient({
  fromFormat,
  toFormat,
  fromLabel,
  toLabel,
  acceptMimes,
  acceptExts,
}: {
  fromFormat: ImageFormat;
  toFormat: ImageFormat;
  fromLabel: string;
  toLabel: string;
  acceptMimes: string;
  acceptExts: string;
}) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [quality, setQuality] = useState(92);
  const [zipping, setZipping] = useState(false);

  // BUG 1 FIX: a single persistent loop flag. True = worker is already running.
  const workerRunning = useRef(false);
  // Ref to always-current items so the worker loop reads live state.
  // We use a functional-ref pattern: the worker reads via getItems().
  const itemsRef = useRef<FileItem[]>([]);

  const accept = `${acceptMimes},${acceptExts}`;
  const isRasterOutput = !["svg", "pdf"].includes(toFormat);
  const showQuality = isRasterOutput && ["jpg", "webp", "avif"].includes(toFormat);

  // Keep itemsRef in sync with every state update.
  const setItemsSync = useCallback((updater: (prev: FileItem[]) => FileItem[]) => {
    setItems((prev) => {
      const next = updater(prev);
      itemsRef.current = next;
      return next;
    });
  }, []);

  // ── Queue worker ──────────────────────────────────────────────────────────
  // Drains ALL queued items, not just a passed-in snapshot.
  // BUG 1 + BUG 2 FIX:
  //   • Only one instance runs at a time (workerRunning guard).
  //   • When a new batch is added while the worker is running, it continues
  //     looping because after finishing the current item it re-reads
  //     itemsRef.current for the next queued item.
  //   • Removed items are skipped because their status won't be "queued"
  //     in the live ref.

  const startWorker = useCallback(async () => {
    if (workerRunning.current) return; // already draining
    workerRunning.current = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // BUG 2 FIX: read live state every iteration, not a stale closure snapshot
      const next = itemsRef.current.find((it) => it.status === "queued");
      if (!next) break; // nothing left to do

      // Mark as converting
      setItemsSync((prev) =>
        prev.map((it) => it.id === next.id ? { ...it, status: "converting" } : it)
      );

      const result = await convertImage(next.file, toFormat, quality / 100);

      // Check the item still exists (user may have removed it while converting)
      const stillExists = itemsRef.current.some((it) => it.id === next.id);
      if (!stillExists) continue; // was removed mid-flight, skip update

      if (result.error || !result.blob) {
        setItemsSync((prev) =>
          prev.map((it) =>
            it.id === next.id
              ? { ...it, status: "error", error: result.error ?? "Conversion failed." }
              : it
          )
        );
        continue;
      }

      const outputUrl = URL.createObjectURL(result.blob);
      const outputFilename = suggestFilename(next.file.name, result.ext);

      setItemsSync((prev) =>
        prev.map((it) =>
          it.id === next.id
            ? {
                ...it,
                status: "done",
                outputUrl,
                outputFilename,
                outputExt: result.ext,
                outputMime: result.mime,
                outputSize: result.blob!.size,
                outputBlob: result.blob,
                warning: result.warning ?? null,
                error: null,
              }
            : it
        )
      );
    }

    workerRunning.current = false;
  }, [toFormat, quality, setItemsSync]);

  // ── Add files ─────────────────────────────────────────────────────────────
  // BUG 3 FIX: dropzone no longer disabled during conversion.
  // New files are just appended; the worker picks them up on its next
  // iteration because it re-reads itemsRef.current each loop.

  const handleFiles = useCallback(
    (files: File[]) => {
      const newItems: FileItem[] = files.map((file) => ({
        id: uid(),
        file,
        inputPreview: URL.createObjectURL(file),
        status: "queued",
        outputUrl: "",
        outputFilename: "",
        outputExt: "",
        outputMime: "",
        outputSize: 0,
        outputBlob: null,
        error: null,
        warning: null,
      }));

      setItemsSync((prev) => [...prev, ...newItems]);

      // Kick the worker. If it's already running it returns immediately;
      // it will naturally pick up the new queued items on its next loop tick.
      setTimeout(startWorker, 0);
    },
    [setItemsSync, startWorker]
  );

  // ── Retry a failed file ───────────────────────────────────────────────────
  // BUG 6 FIX: reset status → queued, then kick the worker.

  const retryItem = useCallback(
    (id: string) => {
      setItemsSync((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, status: "queued", error: null, warning: null } : it
        )
      );
      setTimeout(startWorker, 0);
    },
    [setItemsSync, startWorker]
  );

  // ── Remove a single item ──────────────────────────────────────────────────

  const removeItem = useCallback(
    (id: string) => {
      setItemsSync((prev) => {
        const item = prev.find((it) => it.id === id);
        if (item) {
          if (item.inputPreview) URL.revokeObjectURL(item.inputPreview);
          if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
        }
        return prev.filter((it) => it.id !== id);
      });
    },
    [setItemsSync]
  );

  // ── Clear all ─────────────────────────────────────────────────────────────

  const clearAll = useCallback(() => {
    setItemsSync((prev) => {
      prev.forEach((it) => {
        if (it.inputPreview) URL.revokeObjectURL(it.inputPreview);
        if (it.outputUrl) URL.revokeObjectURL(it.outputUrl);
      });
      return [];
    });
  }, [setItemsSync]);

  // ── Download all as ZIP ───────────────────────────────────────────────────
  // BUG 4 FIX: two-pass deduplication via deduplicateFilenames().

  const downloadAllZip = useCallback(async () => {
    const done = items.filter((it) => it.status === "done" && it.outputBlob);
    if (done.length === 0) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Build deduplicated filename list
      const uniqueNames = deduplicateFilenames(
        done.map((it) => ({ outputFilename: it.outputFilename, outputExt: it.outputExt }))
      );

      done.forEach((item, i) => {
        zip.file(uniqueNames[i], item.outputBlob!);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted-images.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ZIP failed silently - individual downloads still work
    } finally {
      setZipping(false);
    }
  }, [items]);

  // ── Derived counts ────────────────────────────────────────────────────────

  const doneCount      = items.filter((it) => it.status === "done").length;
  const errorCount     = items.filter((it) => it.status === "error").length;
  const activeCount    = items.filter((it) => it.status === "converting" || it.status === "queued").length;
  const hasItems       = items.length > 0;
  const hasAnyDone     = doneCount > 0;
  const allSettled     = hasItems && activeCount === 0;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Quality slider */}
      {showQuality && (
        <div
          className="flex items-center gap-3 rounded-lg border px-4 py-3"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <label htmlFor="quality-slider" className="shrink-0 text-xs font-medium"
            style={{ color: "var(--text-muted)" }}>
            Quality
          </label>
          <input
            id="quality-slider"
            type="range" min={10} max={100} step={1} value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-amber-400"
            aria-valuetext={`${quality}%`}
          />
          <span className="w-8 shrink-0 text-right font-mono text-xs"
            style={{ color: "var(--accent)" }}>
            {quality}%
          </span>
        </div>
      )}

      {/* BUG 3 FIX: drop zone always enabled - no disabled prop */}
      <MultiDropzone
        accept={accept}
        fromLabel={fromLabel}
        onFiles={handleFiles}
      />

      {/* File list */}
      {hasItems && (
        <div className="space-y-3">

          {/* List header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-3 text-xs"
              style={{ color: "var(--text-subtle)" }}>
              <span>{items.length} file{items.length !== 1 ? "s" : ""}</span>

              {doneCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--teal)" }} />
                  {doneCount} done
                </span>
              )}
              {activeCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }} />
                  {activeCount} in progress
                </span>
              )}
              {errorCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--coral)" }} />
                  {errorCount} failed
                </span>
              )}
            </div>

            {/* Bulk actions */}
            <div className="flex items-center gap-2">
              {hasAnyDone && allSettled && (
                <Btn variant="primary" size="sm" disabled={zipping} onClick={downloadAllZip}>{zipping ? <><SpinnerIcon /> Zipping…</> : <><DownloadIcon /> Download all ({doneCount}) as ZIP</>}</Btn>
              )}
              {/* Show ZIP button while converting too, labelled clearly */}
              {hasAnyDone && !allSettled && (
                <Btn variant="primary" size="sm" disabled={zipping} onClick={downloadAllZip}>{zipping ? <><SpinnerIcon /> Zipping…</> : <><DownloadIcon /> ZIP {doneCount} so far</>}</Btn>
              )}
              <Btn variant="secondary" size="sm" onClick={clearAll}>Clear all</Btn>
            </div>
          </div>

          {/* Rows */}
          {/* BUG 7 FIX: StatusBanner block below was removed - warnings render inline in FileRow */}
          <div className="space-y-2" role="list" aria-label="Files to convert">
            {items.map((item) => (
              <FileRow
                key={item.id}
                item={item}
                isRasterOutput={isRasterOutput}
                onRemove={removeItem}
                onRetry={retryItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info cards */}
      <div className="grid gap-3 pt-2 sm:grid-cols-3">
        {[
          { icon: "🔒", title: "Private",
            body: "Files never leave your device. Conversion runs entirely in your browser." },
          { icon: "⚡", title: "Batch",
            body: "Add as many files as you need - they queue automatically. Add more at any time." },
          { icon: "🆓", title: "Free",
            body: "No account, no limits, no watermarks. Always free." },
        ].map(({ icon, title, body }) => (
          <div key={title} className="rounded-lg border p-4"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <div className="mb-1.5 flex items-center gap-2">
              <span aria-hidden="true">{icon}</span>
              <span className="text-xs font-semibold"
                style={{ color: "var(--text-secondary)" }}>{title}</span>
            </div>
            <p className="text-xs leading-relaxed"
              style={{ color: "var(--text-muted)" }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
