"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface CounterProps {
  value: string;
  limit: number;
}

function Counter({ value, limit }: CounterProps) {
  const len = value.length;
  const over = len > limit;
  return (
    <span className="text-xs tabular-nums" style={{ color: over ? "var(--color-danger, #e5484d)" : "var(--text-subtle)" }}>
      {len}/{limit}{over ? " - will be cut off" : ""}
    </span>
  );
}

export default function MetaTagGeneratorClient() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [canonical, setCanonical] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImage, setTwitterImage] = useState("");
  const [copied, setCopied] = useState(false);

  const tags = useMemo(() => {
    const lines: string[] = [];
    if (title) {
      lines.push(`<title>${esc(title)}</title>`);
      lines.push(`<meta name="title" content="${esc(title)}" />`);
    }
    if (description) lines.push(`<meta name="description" content="${esc(description)}" />`);
    if (keywords) lines.push(`<meta name="keywords" content="${esc(keywords)}" />`);
    if (author) lines.push(`<meta name="author" content="${esc(author)}" />`);
    if (robots) lines.push(`<meta name="robots" content="${esc(robots)}" />`);
    if (canonical) lines.push(`<link rel="canonical" href="${esc(canonical)}" />`);
    // Open Graph
    const ogT = ogTitle || title;
    const ogD = ogDescription || description;
    if (ogT) lines.push(`<meta property="og:title" content="${esc(ogT)}" />`);
    if (ogD) lines.push(`<meta property="og:description" content="${esc(ogD)}" />`);
    if (ogImage) lines.push(`<meta property="og:image" content="${esc(ogImage)}" />`);
    if (ogType) lines.push(`<meta property="og:type" content="${esc(ogType)}" />`);
    if (canonical) lines.push(`<meta property="og:url" content="${esc(canonical)}" />`);
    // Twitter
    lines.push(`<meta name="twitter:card" content="${esc(twitterCard)}" />`);
    const twT = twitterTitle || ogT;
    const twD = twitterDescription || ogD;
    if (twT) lines.push(`<meta name="twitter:title" content="${esc(twT)}" />`);
    if (twD) lines.push(`<meta name="twitter:description" content="${esc(twD)}" />`);
    const twI = twitterImage || ogImage;
    if (twI) lines.push(`<meta name="twitter:image" content="${esc(twI)}" />`);
    return lines.join("\n");
  }, [title, description, keywords, author, robots, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard, twitterTitle, twitterDescription, twitterImage]);

  async function copy() {
    if (!tags) return;
    try {
      await navigator.clipboard.writeText(tags);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const inputCls = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
  const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" } as const;
  const labelCls = "mb-1 flex items-center justify-between text-xs font-medium";

  const displayUrl = canonical || "https://example.com/your-page";
  let shortUrl = displayUrl.replace(/^https?:\/\//, "");
  if (shortUrl.length > 60) shortUrl = shortUrl.slice(0, 57) + "...";

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>SEO tags</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="mt-title" className={labelCls} style={{ color: "var(--text-muted)" }}>
                Page title <Counter value={title} limit={TITLE_LIMIT} />
              </label>
              <input id="mt-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your page title" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-desc" className={labelCls} style={{ color: "var(--text-muted)" }}>
                Meta description <Counter value={description} limit={DESC_LIMIT} />
              </label>
              <textarea id="mt-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A sentence or two describing the page" rows={3} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-keywords" className={labelCls} style={{ color: "var(--text-muted)" }}>Keywords (optional)</label>
              <input id="mt-keywords" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keyword one, keyword two" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-author" className={labelCls} style={{ color: "var(--text-muted)" }}>Author</label>
              <input id="mt-author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" className={inputCls} style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mt-robots" className={labelCls} style={{ color: "var(--text-muted)" }}>Robots</label>
                <select id="mt-robots" value={robots} onChange={(e) => setRobots(e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>
              <div>
                <label htmlFor="mt-canonical" className={labelCls} style={{ color: "var(--text-muted)" }}>Canonical URL</label>
                <input id="mt-canonical" type="url" value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="https://example.com/page" className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Social cards</h2>
          <div className="space-y-3">
            <div>
              <label htmlFor="mt-ogtitle" className={labelCls} style={{ color: "var(--text-muted)" }}>
                OG title <span className="text-xs" style={{ color: "var(--text-subtle)" }}>falls back to page title</span>
              </label>
              <input id="mt-ogtitle" type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="Leave empty to reuse page title" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-ogdesc" className={labelCls} style={{ color: "var(--text-muted)" }}>
                OG description <span className="text-xs" style={{ color: "var(--text-subtle)" }}>falls back to meta description</span>
              </label>
              <textarea id="mt-ogdesc" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} placeholder="Leave empty to reuse meta description" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-ogimage" className={labelCls} style={{ color: "var(--text-muted)" }}>OG image URL</label>
              <input id="mt-ogimage" type="url" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/og-image.jpg (1200x630)" className={inputCls} style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="mt-ogtype" className={labelCls} style={{ color: "var(--text-muted)" }}>OG type</label>
                <select id="mt-ogtype" value={ogType} onChange={(e) => setOgType(e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="product">product</option>
                </select>
              </div>
              <div>
                <label htmlFor="mt-twcard" className={labelCls} style={{ color: "var(--text-muted)" }}>Twitter card</label>
                <select id="mt-twcard" value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="mt-twtitle" className={labelCls} style={{ color: "var(--text-muted)" }}>
                Twitter title <span className="text-xs" style={{ color: "var(--text-subtle)" }}>falls back to OG title</span>
              </label>
              <input id="mt-twtitle" type="text" value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} placeholder="Leave empty to reuse OG title" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-twdesc" className={labelCls} style={{ color: "var(--text-muted)" }}>
                Twitter description <span className="text-xs" style={{ color: "var(--text-subtle)" }}>falls back to OG description</span>
              </label>
              <textarea id="mt-twdesc" value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} rows={2} placeholder="Leave empty to reuse OG description" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="mt-twimage" className={labelCls} style={{ color: "var(--text-muted)" }}>
                Twitter image URL <span className="text-xs" style={{ color: "var(--text-subtle)" }}>falls back to OG image</span>
              </label>
              <input id="mt-twimage" type="url" value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} placeholder="https://example.com/twitter-image.jpg" className={inputCls} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* SERP preview */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Google preview</h2>
        <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-elevated)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{shortUrl}</p>
          <p className="mt-0.5 cursor-pointer text-lg leading-snug hover:underline" style={{ color: "#1a0dab" }}>
            {title || <span style={{ color: "var(--text-subtle)" }}>Your page title appears here</span>}
          </p>
          <p className="mt-0.5 text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
            {description || <span style={{ color: "var(--text-subtle)" }}>Your meta description appears here. Aim for roughly 160 characters that sell the click.</span>}
          </p>
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--text-subtle)" }}>
          Google truncates titles around {TITLE_LIMIT} characters and descriptions around {DESC_LIMIT}. The counters turn red when you pass the limit.
        </p>
      </div>

      {/* Output */}
      <div className="rounded-xl border p-4 sm:p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Generated HTML</h2>
          <Btn variant="primary" size="sm" onClick={copy} disabled={!tags}>
            {copied ? "Copied!" : "Copy tags"}
          </Btn>
        </div>
        {tags ? (
          <pre className="max-h-96 overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed" style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)" }}>
            {tags}
          </pre>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Fill in the form above and your meta tags will appear here, ready to paste into your page&apos;s <code>&lt;head&gt;</code>.
          </p>
        )}
      </div>
    </div>
  );
}
