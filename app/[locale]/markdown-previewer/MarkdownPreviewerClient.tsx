"use client";

import { useMemo, useRef, useState } from "react";
import Btn from "@/components/Btn";
import { renderMarkdown } from "@/lib/markdown-render";

function downloadFile(text: string, filename: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


const SAMPLE = `# Markdown Previewer

Type **Markdown** on the left and watch it render here *live*.

## Text styles

**Bold**, *italic*, ***both***, and ~~strikethrough~~. Inline \`code\` looks like this.

## Lists

- Unordered item one
- Unordered item two
  - Nested item
  - Another nested item
- Back to top level

## Task list

- [ ] Draft the outline
- [x] Write the introduction
- [ ] Add examples

1. First ordered item
2. Second ordered item
3. Third ordered item

## Links and quotes

A [link to BeYourTools](https://beyourtools.com) opens in a new tab.

> Blockquotes highlight quoted text.
> They can span multiple lines.

## Code block

\`\`\`js
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

## Table

| Feature | Supported |
| :------ | :-------: |
| Headings | Yes |
| Tables | Yes |

## Footnotes

Footnotes work too.[^1] Hover the number, or jump to the note below.

[^1]: This footnote is rendered at the bottom of the preview, with a back link.

---

Raw HTML like <script>alert("x")</script> is escaped and shown as text, never executed.`;

const PREVIEW_CSS = `
.mdp { font-size: 0.9rem; line-height: 1.7; color: var(--text-secondary); overflow-wrap: break-word; }
.mdp h1, .mdp h2, .mdp h3, .mdp h4, .mdp h5, .mdp h6 { color: var(--text-primary); font-weight: 700; line-height: 1.3; margin: 1.1em 0 0.5em; }
.mdp h1 { font-size: 1.6rem; border-bottom: 1px solid var(--border); padding-bottom: 0.35em; }
.mdp h2 { font-size: 1.35rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
.mdp h3 { font-size: 1.15rem; }
.mdp p { margin: 0.7em 0; }
.mdp a { color: var(--accent-text); text-decoration: underline; }
.mdp strong { color: var(--text-primary); }
.mdp code { font-family: ui-monospace, monospace; font-size: 0.85em; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 4px; padding: 0.1em 0.35em; color: var(--text-primary); }
.mdp pre { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; padding: 0.9em 1em; overflow-x: auto; margin: 0.8em 0; }
.mdp pre code { background: none; border: none; padding: 0; }
.mdp ul, .mdp ol { margin: 0.7em 0; padding-left: 1.6em; }
.mdp ul { list-style: disc; } .mdp ol { list-style: decimal; }
.mdp li { margin: 0.25em 0; } .mdp li ul, .mdp li ol { margin: 0.25em 0; }
.mdp li:has(> input[type="checkbox"]) { list-style: none; margin-left: -1.6em; }
.mdp li input[type="checkbox"] { margin-right: 0.45em; accent-color: var(--accent); vertical-align: -1px; }
.mdp blockquote { border-left: 3px solid var(--accent); margin: 0.8em 0; padding: 0.2em 0 0.2em 1em; color: var(--text-muted); }
.mdp blockquote p { margin: 0.3em 0; }
.mdp hr { border: none; border-top: 1px solid var(--border-strong); margin: 1.2em 0; }
.mdp table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 0.85rem; }
.mdp th, .mdp td { border: 1px solid var(--border-strong); padding: 0.45em 0.7em; }
.mdp th { background: var(--bg-elevated); color: var(--text-primary); font-weight: 600; }
.mdp img { max-width: 100%; border-radius: 8px; }
.mdp del { color: var(--text-muted); }
.mdp sup a { color: var(--accent-text); text-decoration: none; font-size: 0.8em; }
.mdp .footnotes { font-size: 0.85rem; color: var(--text-muted); }
.mdp .footnotes ol { padding-left: 1.4em; }
.mdp .footnotes-sep { margin-top: 1.5em; }
.mdp a.footnote-backref { color: var(--accent-text); text-decoration: none; }
`;

export default function MarkdownPreviewerClient() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [syncScroll, setSyncScroll] = useState(true);
  const [view, setView] = useState<"split" | "editor" | "preview">("split");
  const [fullscreen, setFullscreen] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => renderMarkdown(text), [text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const [htmlCopied, setHtmlCopied] = useState(false);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setHtmlCopied(true);
      setTimeout(() => setHtmlCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onEditorScroll = () => {
    if (!syncScroll) return;
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;
    const editorRange = editor.scrollHeight - editor.clientHeight;
    const previewRange = preview.scrollHeight - preview.clientHeight;
    if (editorRange <= 0 || previewRange <= 0) return;
    preview.scrollTop = (editor.scrollTop / editorRange) * previewRange;
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingMinutes = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;
  const lines = text === "" ? 0 : text.split("\n").length;

  return (
    <div
      className={fullscreen ? "fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6" : undefined}
      style={fullscreen ? { backgroundColor: "var(--bg-page)" } : undefined}
    >
      <style>{PREVIEW_CSS}</style>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Btn variant="secondary" size="sm" onClick={() => setText(SAMPLE)}>
          Load sample
        </Btn>
        <Btn variant="secondary" size="sm" onClick={copy} disabled={text.length === 0}>
          {copied ? "Copied!" : "Copy Markdown"}
        </Btn>
        <Btn variant="secondary" size="sm" onClick={copyHtml} disabled={text.length === 0}>
          {htmlCopied ? "HTML copied!" : "Copy HTML"}
        </Btn>
        <Btn variant="secondary" size="sm" onClick={() => downloadFile(text, "document.md", "text/markdown")} disabled={text.length === 0}>
          Download .md
        </Btn>
        <Btn variant="secondary" size="sm" onClick={() => downloadFile(html, "document.html", "text/html")} disabled={text.length === 0}>
          Download HTML
        </Btn>
        <Btn
          variant="toggle"
          size="sm"
          selected={syncScroll}
          onClick={() => setSyncScroll((v) => !v)}
          aria-pressed={syncScroll}
          title="Scroll the preview together with the editor"
        >
          Sync scroll {syncScroll ? "on" : "off"}
        </Btn>
        <Btn variant="toggle" size="sm" selected={view === "editor"} onClick={() => setView("editor")} aria-pressed={view === "editor"}>
          Editor only
        </Btn>
        <Btn variant="toggle" size="sm" selected={view === "split"} onClick={() => setView("split")} aria-pressed={view === "split"}>
          Split view
        </Btn>
        <Btn variant="toggle" size="sm" selected={view === "preview"} onClick={() => setView("preview")} aria-pressed={view === "preview"}>
          Preview only
        </Btn>
        <Btn variant="toggle" size="sm" selected={fullscreen} onClick={() => setFullscreen((v) => !v)} aria-pressed={fullscreen}>
          {fullscreen ? "Exit fullscreen" : "Fullscreen"}
        </Btn>
        <Btn variant="ghost" size="sm" onClick={() => setText("")} disabled={text.length === 0}>
          Clear
        </Btn>
        <span className="ml-auto text-xs" style={{ color: "var(--text-subtle)" }}>
          {words.toLocaleString("en-US")} words · {lines.toLocaleString("en-US")} lines · {text.length.toLocaleString("en-US")} characters
          {readingMinutes > 0 && ` · ~${readingMinutes} min read`}
        </span>
      </div>

      <div className={view === "split" ? "grid gap-4 lg:grid-cols-2" : "grid gap-4"}>
        {view !== "preview" && (
        <div>
          <label htmlFor="md-input" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Markdown
          </label>
          <textarea
            id="md-input"
            ref={editorRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onScroll={onEditorScroll}
            placeholder="Write Markdown here… (# Heading, **bold**, - list, ``` code)"
            rows={22}
            spellCheck={false}
            className="focus-ring w-full resize-y rounded-xl border px-3 py-2.5 font-mono text-sm leading-relaxed"
            style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}
          />
        </div>
        )}
        {view !== "editor" && (
        <div>
          <p className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }} aria-hidden="true">
            Preview
          </p>
          <div
            ref={previewRef}
            className="h-[548px] overflow-y-auto rounded-xl border p-4 sm:p-5"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            aria-live="polite"
            aria-label="Rendered Markdown preview"
          >
            {text.trim() === "" ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Your rendered preview will appear here. Try the sample button above to see what this previewer supports.
              </p>
            ) : (
              <div className="mdp" dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
        </div>
        )}
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--text-subtle)" }}>
        Rendering is done locally with a built-in parser. Task lists (- [ ] / - [x]), tables, footnotes ([^1]), code blocks and blockquotes all render live. Raw HTML in your Markdown is escaped and shown as text, never executed.
      </p>
    </div>
  );
}
