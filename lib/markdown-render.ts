/**
 * markdown-render.ts - Compact, dependency-free Markdown renderer.
 *
 * Security model: user HTML is escaped FIRST, so raw markup can never
 * reach the DOM. Only the tags this module emits (h1-h6, p, strong, em,
 * del, code, pre, a, ul, ol, li, blockquote, hr, table…) are produced.
 * Link/image URLs with dangerous schemes (javascript:, data:, …) are dropped.
 *
 * Used by the markdown-previewer tool. 100% client-side, no dependencies.
 */

/* ── Safe mini Markdown renderer ──────────────────────────────────────────
   HTML is escaped FIRST, so user input can never inject markup or scripts.
   Only the tags this renderer emits (<h1>-<h6>, <p>, <strong>, <em>, <del>,
   <code>, <pre>, <a>, <ul>, <ol>, <li>, <blockquote>, <hr>, <table>…)
   ever reach dangerouslySetInnerHTML. */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function safeUrl(url: string): string | null {
  const u = url.trim();
  if (/^(javascript|data|vbscript|file):/i.test(u)) return null;
  if (u === "") return null;
  return u; // already HTML-escaped by the caller
}

export function renderInline(escaped: string): string {
  const codes: string[] = [];
  // 1. stash inline code spans so * _ ~ inside them are not parsed
  let s = escaped.replace(/`([^`\n]+)`/g, (_m, c: string) => {
    codes.push(`<code>${c}</code>`);
    return `@@MDCODE${codes.length - 1}@@`;
  });
  // 2. images
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (m, alt: string, url: string, title: string) => {
    const safe = safeUrl(url);
    if (!safe) return m;
    return `<img src="${safe}" alt="${alt}"${title ? ` title="${title}"` : ""} loading="lazy" />`;
  });
  // 3. links
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (m, text: string, url: string, title: string) => {
    const safe = safeUrl(url);
    if (!safe) return m;
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ""}>${text}</a>`;
  });
  // 4. bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // 5. italic (avoid matching inside words like snake_case)
  s = s.replace(/(^|[^\w*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/(^|[^\w_])_([^_\n]+)_/g, "$1<em>$2</em>");
  // 6. strikethrough
  s = s.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
  // 7. restore code spans
  s = s.replace(/@@MDCODE(\d+)@@/g, (_m, i: string) => codes[parseInt(i, 10)] ?? "");
  return s;
}

interface ListNode {
  content: string;
  ordered: boolean;
  children: ListNode[];
}

export function renderListNodes(nodes: ListNode[], ordered: boolean): string {
  const tag = ordered ? "ol" : "ul";
  const items = nodes
    .map(
      (n) =>
        `<li>${renderInline(escapeHtml(n.content))}${
          n.children.length ? renderListNodes(n.children, n.children[0].ordered) : ""
        }</li>`
    )
    .join("");
  return `<${tag}>${items}</${tag}>`;
}

export function isBlockStart(line: string): boolean {
  return (
    /^```/.test(line) ||
    /^#{1,6}\s/.test(line) ||
    /^(\*{3,}|-{3,}|_{3,})\s*$/.test(line) ||
    /^>\s?/.test(line) ||
    /^(\s*)([-*+]|\d+[.)])\s+/.test(line)
  );
}

export function splitRow(line: string): string[] {
  let t = line.trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map((c) => c.trim());
}

export function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      const lang = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : "";
      out.push(`<pre><code${lang}>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    // ATX heading
    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${renderInline(escapeHtml(h[2]))}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    // Blockquote (recursive for nested markdown)
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${renderMarkdown(buf.join("\n"))}</blockquote>`);
      continue;
    }

    // Table: header row + delimiter row
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\|?[\s:|-]*:?-{1,}:?[\s:|-]*\|?\s*$/.test(lines[i + 1]) &&
      lines[i + 1].includes("-")
    ) {
      const headers = splitRow(line);
      const delims = splitRow(lines[i + 1]);
      const aligns = delims.map((d) => {
        const left = d.startsWith(":");
        const right = d.endsWith(":");
        if (left && right) return "center";
        if (right) return "right";
        return "left";
      });
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const th = headers
        .map((c, k) => `<th style="text-align:${aligns[k] || "left"}">${renderInline(escapeHtml(c))}</th>`)
        .join("");
      const tb = rows
        .map(
          (r) =>
            `<tr>${headers.map((_, k) => `<td style="text-align:${aligns[k] || "left"}">${renderInline(escapeHtml(r[k] ?? ""))}</td>`).join("")}</tr>`
        )
        .join("");
      out.push(`<table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`);
      continue;
    }

    // List (with nesting by indentation)
    const lm = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (lm) {
      const raw: { indent: number; ordered: boolean; content: string }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
        if (!m) break;
        raw.push({ indent: m[1].replace(/\t/g, "  ").length, ordered: /\d/.test(m[2]), content: m[3] });
        i++;
      }
      const roots: ListNode[] = [];
      const stack: { node: ListNode; indent: number }[] = [];
      for (const r of raw) {
        const node: ListNode = { content: r.content, ordered: r.ordered, children: [] };
        while (stack.length > 0 && r.indent <= stack[stack.length - 1].indent) stack.pop();
        if (stack.length === 0) roots.push(node);
        else stack[stack.length - 1].node.children.push(node);
        stack.push({ node, indent: r.indent });
      }
      if (roots.length > 0) out.push(renderListNodes(roots, roots[0].ordered));
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph: gather consecutive non-block lines, join with <br />
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${buf.map((l) => renderInline(escapeHtml(l))).join("<br />")}</p>`);
  }

  return out.join("\n");
}
