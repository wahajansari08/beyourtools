"use client";

import { useMemo, useState } from "react";
import ToolInput from "@/components/ToolInput";
import ToolOutput from "@/components/ToolOutput";
import StatusBanner from "@/components/StatusBanner";
import FileUploader from "@/components/FileUploader";
import { jsonToExcel } from "@/lib/generators/excel";

const EXAMPLE = `[
  { "name": "Alice", "age": 30, "city": "London",    "active": true  },
  { "name": "Bob",   "age": 25, "city": "New York",  "active": false },
  { "name": "Carol", "age": 35, "city": "Tokyo",     "active": true  }
]`;

export default function JsonToExcelClient() {
  const [input, setInput] = useState(EXAMPLE);

  const result = useMemo(() => jsonToExcel(input), [input]);

  function handleDownload() {
    if (!result.blob) return;
    const blob = new Blob([result.blob as unknown as ArrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Preview: figure out headers & first few rows from the JSON
  const preview = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const parsed = JSON.parse(input);
      const arr: Record<string, unknown>[] = Array.isArray(parsed) ? parsed : [parsed];
      const headerSet = new Set<string>();
      arr.forEach((r) => {
        if (r && typeof r === "object") Object.keys(r).forEach((k) => headerSet.add(k));
      });
      const headers = Array.from(headerSet);
      return { headers, rows: arr.slice(0, 10), total: arr.length };
    } catch {
      return null;
    }
  }, [input]);

  return (
    <div className="space-y-3">
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolInput
          label="JSON Array"
          value={input}
          onChange={setInput}
          placeholder={EXAMPLE}
          error={result.error}
          actions={<FileUploader accept=".json" onFileText={(t) => setInput(t)} />}
        />

        <ToolOutput
          label="Preview"
          placeholder="A spreadsheet preview will appear here."
          actions={
            result.blob ? (
              <button
                type="button"
                onClick={handleDownload}
                className="focus-ring flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-medium transition"
                style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
                Download .xlsx
              </button>
            ) : null
          }
        >
          {preview ? (
            <div className="overflow-auto px-3.5 py-3">
              <table className="min-w-full text-left text-[12px]">
                <thead>
                  <tr>
                    {preview.headers.map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap border-b pb-1.5 pr-4 font-semibold"
                        style={{ borderColor: "var(--border)", color: "var(--accent)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                      {preview.headers.map((h) => {
                        const v = row[h];
                        return (
                          <td key={h} className="whitespace-nowrap py-1.5 pr-4 font-mono" style={{ color: "var(--text-muted)" }}>
                            {v === null || v === undefined
                              ? <span style={{ color: "var(--text-subtle)" }}>-</span>
                              : typeof v === "object"
                              ? <span style={{ color: "var(--text-subtle)" }}>{JSON.stringify(v)}</span>
                              : String(v)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.total > 10 && (
                <p className="mt-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  Showing 10 of {preview.total} rows - all rows are included in the download.
                </p>
              )}
            </div>
          ) : null}
        </ToolOutput>
      </div>

      {result.error && <StatusBanner type="error" message={result.error} />}
      {result.blob && !result.error && (
        <StatusBanner
          type="success"
          message={`Ready to download - ${result.blob.length.toLocaleString()} bytes.`}
        />
      )}
    </div>
  );
}
