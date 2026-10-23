"use client";

import { useCallback, useState } from "react";
import PdfDropzone from "@/components/PdfDropzone";
import PdfToolShell, { DownloadBtn, formatBytes } from "@/components/PdfToolShell";
import { mergePdfsWithPages, getPageCount, bytesToBlob } from "@/lib/pdf/engine";
import Btn from "@/components/Btn";

interface FileItem {
  id: string;
  file: File;
  pageCount: number | null; // null while loading
  pageError: string | null;
  excluded: number[]; // 0-based page indices excluded from the merge
  expanded: boolean;
}

interface State {
  status: "idle" | "processing" | "done" | "error";
  url: string;
  size: number;
  info: string | null;
  error: string | null;
  files: FileItem[];
}

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function MergePdf() {
  const [state, setState] = useState<State>({ status: "idle", url: "", size: 0, info: null, error: null, files: [] });

  const reset = useCallback(() => {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ status: "idle", url: "", size: 0, info: null, error: null, files: [] });
  }, [state.url]);

  const addFiles = useCallback((incoming: File[]) => {
    const items: FileItem[] = incoming.map((file) => ({
      id: uid(),
      file,
      pageCount: null,
      pageError: null,
      excluded: [],
      expanded: false,
    }));
    setState((s) => ({ ...s, files: [...s.files, ...items] }));
    // Load page counts in the background so the page picker can render.
    for (const item of items) {
      void item.file.arrayBuffer().then(async (buf) => {
        const res = await getPageCount(new Uint8Array(buf));
        setState((s) => ({
          ...s,
          files: s.files.map((f) =>
            f.id === item.id
              ? { ...f, pageCount: res.count > 0 ? res.count : null, pageError: res.error }
              : f
          ),
        }));
      });
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setState((s) => ({ ...s, files: s.files.filter((f) => f.id !== id) }));
  }, []);

  const moveFile = useCallback((id: string, dir: -1 | 1) => {
    setState((s) => {
      const arr = [...s.files];
      const idx = arr.findIndex((f) => f.id === id);
      const to = idx + dir;
      if (idx < 0 || to < 0 || to >= arr.length) return s;
      const [item] = arr.splice(idx, 1);
      arr.splice(to, 0, item);
      return { ...s, files: arr };
    });
  }, []);

  const sortAZ = useCallback(() => {
    setState((s) => ({
      ...s,
      files: [...s.files].sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { sensitivity: "base" })),
    }));
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      files: s.files.map((f) => (f.id === id ? { ...f, expanded: !f.expanded } : f)),
    }));
  }, []);

  const togglePage = useCallback((id: string, page: number) => {
    setState((s) => ({
      ...s,
      files: s.files.map((f) =>
        f.id === id
          ? { ...f, excluded: f.excluded.includes(page) ? f.excluded.filter((p) => p !== page) : [...f.excluded, page] }
          : f
      ),
    }));
  }, []);

  const setAllPages = useCallback((id: string, include: boolean) => {
    setState((s) => ({
      ...s,
      files: s.files.map((f) => {
        if (f.id !== id || f.pageCount === null) return f;
        return {
          ...f,
          excluded: include ? [] : Array.from({ length: f.pageCount }, (_, i) => i),
        };
      }),
    }));
  }, []);

  const totalSelected = state.files.reduce(
    (n, f) => n + (f.pageCount === null ? 0 : f.pageCount - f.excluded.length),
    0
  );
  const pageInfoPending = state.files.some((f) => f.pageCount === null && !f.pageError);

  const handleMerge = useCallback(async () => {
    if (state.files.length === 0 || pageInfoPending) return;
    setState((s) => ({ ...s, status: "processing", error: null }));
    try {
      const specs = await Promise.all(
        state.files.map(async (f) => {
          const bytes = new Uint8Array(await f.file.arrayBuffer());
          const pages =
            f.pageCount === null
              ? []
              : Array.from({ length: f.pageCount }, (_, i) => i).filter((p) => !f.excluded.includes(p));
          return { bytes, pages };
        })
      );
      const result = await mergePdfsWithPages(specs);
      if (result.error || !result.bytes) {
        setState((s) => ({ ...s, status: "error", error: result.error ?? "Merge failed." }));
        return;
      }
      const blob = bytesToBlob(result.bytes!, "application/pdf");
      const url = URL.createObjectURL(blob);
      setState((s) => ({ ...s, status: "done", url, size: blob.size, info: result.info ?? null }));
    } catch (e) {
      setState((s) => ({
        ...s,
        status: "error",
        error: e instanceof Error ? e.message : "Merge failed.",
      }));
    }
  }, [state.files, pageInfoPending]);

  return (
    <PdfToolShell
      status={state.status}
      processingLabel="Merging PDFs…"
      error={state.error}
      info={state.info}
      onReset={reset}
      resetLabel="Merge more PDFs"
      actions={state.url ? <DownloadBtn href={state.url} filename="merged.pdf" label={`Download merged.pdf (${formatBytes(state.size)})`} /> : null}
      result={
        <div
          className="rounded-lg border p-6 text-center"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{state.info}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatBytes(state.size)}</p>
        </div>
      }
      dropzone={
        <div className="space-y-3">
          <PdfDropzone accept=".pdf,application/pdf" multiple onFiles={addFiles} label="Drop PDF files here" sublabel="Add PDFs, pick pages, reorder, then merge" />
          {state.files.length > 0 && (
            <div
              className="rounded-lg border divide-y"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-subtle)" }}>
                  {state.files.length} file{state.files.length !== 1 ? "s" : ""}
                  {totalSelected > 0 && !pageInfoPending && (
                    <> · {totalSelected} page{totalSelected !== 1 ? "s" : ""} selected</>
                  )}
                </span>
                <Btn variant="ghost" size="sm" onClick={sortAZ} aria-label="Sort files A to Z">
                  Sort A–Z
                </Btn>
              </div>
              {state.files.map((f, i) => (
                <div key={f.id} className="border-b px-3 py-2 last:border-0" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-5 shrink-0 text-center text-[11px]" style={{ color: "var(--text-subtle)" }}>{i + 1}</span>
                    <span className="flex-1 truncate font-mono text-[12px]" style={{ color: "var(--text-secondary)" }}>{f.file.name}</span>
                    <span className="shrink-0 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                      {f.pageError
                        ? "unreadable"
                        : f.pageCount === null
                          ? "reading pages…"
                          : `${f.pageCount} page${f.pageCount !== 1 ? "s" : ""}${f.excluded.length > 0 ? ` · ${f.excluded.length} skipped` : ""}`}
                    </span>
                    <div className="flex shrink-0 gap-1">
                      {f.pageCount !== null && f.pageCount > 1 && (
                        <Btn variant="secondary" size="sm" onClick={() => toggleExpanded(f.id)} aria-expanded={f.expanded} aria-label={`${f.expanded ? "Hide" : "Pick"} pages of ${f.file.name}`}>
                          {f.expanded ? "Hide pages" : "Pick pages"}
                        </Btn>
                      )}
                      {i > 0 && <Btn variant="icon" onClick={() => moveFile(f.id, -1)} aria-label="Move up">↑</Btn>}
                      {i < state.files.length - 1 && <Btn variant="icon" onClick={() => moveFile(f.id, 1)} aria-label="Move down">↓</Btn>}
                      <Btn variant="danger" onClick={() => removeFile(f.id)} aria-label="Remove">✕</Btn>
                    </div>
                  </div>
                  {f.expanded && f.pageCount !== null && (
                    <div className="mt-2 rounded-lg border p-2.5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Tick the pages to include. Unticked pages are left out of the merged file.
                        </span>
                        <div className="flex shrink-0 gap-1">
                          <Btn variant="ghost" size="sm" onClick={() => setAllPages(f.id, true)}>All</Btn>
                          <Btn variant="ghost" size="sm" onClick={() => setAllPages(f.id, false)}>None</Btn>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Pages of ${f.file.name}`}>
                        {Array.from({ length: f.pageCount }, (_, p) => {
                          const off = f.excluded.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => togglePage(f.id, p)}
                              aria-pressed={!off}
                              aria-label={`Page ${p + 1} of ${f.file.name}, ${off ? "excluded" : "included"}`}
                              className="focus-ring h-8 min-w-8 rounded-md border px-2 font-mono text-xs transition"
                              style={{
                                borderColor: off ? "var(--border)" : "var(--accent)",
                                backgroundColor: off ? "transparent" : "color-mix(in srgb, var(--accent) 14%, transparent)",
                                color: off ? "var(--text-subtle)" : "var(--accent-text)",
                                textDecoration: off ? "line-through" : "none",
                              }}
                            >
                              {p + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {state.files.length > 0 && (
            <>
              <Btn
                variant="primary"
                onClick={handleMerge}
                disabled={pageInfoPending || state.files.length === 0 || totalSelected === 0}
              >
                {pageInfoPending
                  ? "Reading pages…"
                  : `Merge ${totalSelected} page${totalSelected !== 1 ? "s" : ""} into one PDF`}
              </Btn>
              {totalSelected === 0 && !pageInfoPending && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Every page is currently excluded. Tick at least one page to enable merging.
                </p>
              )}
            </>
          )}
        </div>
      }
    />
  );
}
