export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "json-tips-every-developer-should-know",
    title: "10 JSON Tips Every Developer Should Know",
    excerpt:
      "From avoiding common pitfalls to formatting tricks, these JSON tips will save you hours of debugging and make your APIs more robust.",
    author: "BeYourTools Team",
    publishedAt: "2026-07-15",
    readingTime: 6,
    category: "JSON",
    tags: ["JSON", "Tips", "APIs", "Debugging"],
    content: `
<h2>1. Always validate before parsing</h2>
<p>Never trust JSON from external sources without validation. Malformed JSON crashes your app at runtime. Use our <a href="/json-validator">JSON Validator</a> to check structure before processing.</p>

<h2>2. Pretty-print during development</h2>
<p>Reading minified JSON like <code>{"a":1,"b":{"c":2}}</code> during debugging is painful. Always pretty-print in development using <code>JSON.stringify(obj, null, 2)</code> or our <a href="/json-formatter">JSON Formatter</a>.</p>

<h2>3. Minify for production</h2>
<p>Every byte counts in HTTP responses. A 100KB JSON payload minified to 75KB saves bandwidth on every request. Use our <a href="/json-minifier">JSON Minifier</a> before deploying static files.</p>

<h2>4. Use JSON Schema for contracts</h2>
<p>Instead of documenting your API shape in comments, write a JSON Schema. It's machine-readable, can be used for validation, and tools can auto-generate documentation from it. Generate one instantly from a sample with our <a href="/json-schema-generator">Schema Generator</a>.</p>

<h2>5. Sort keys for readable diffs</h2>
<p>Git diffs on JSON files are much cleaner when keys are consistently sorted. Our <a href="/json-sorter">JSON Sorter</a> recursively alphabetises all object keys.</p>

<h2>6. Deep-merge carefully</h2>
<p>JavaScript's <code>Object.assign</code> and spread only do shallow merges. Arrays are replaced, not merged. Use our <a href="/json-merge">JSON Merge</a> tool to see exactly how a deep merge behaves before putting it in code.</p>

<h2>7. Flatten nested structures for analytics</h2>
<p>Columnar data stores (BigQuery, Redshift) don't handle nested JSON well. Flatten <code>{"user":{"id":1,"name":"Ada"}}</code> to <code>{"user.id":1,"user.name":"Ada"}</code> with our <a href="/json-flatten">JSON Flatten</a> tool.</p>

<h2>8. Understand JSON's number limits</h2>
<p>JSON numbers are IEEE 754 doubles. Integers larger than <code>2^53 - 1</code> (9007199254740991) lose precision. Use strings for large IDs like Snowflake IDs from Twitter/Discord.</p>

<h2>9. diff before deploying config changes</h2>
<p>Deploying a new app config? Always diff it against the current one. Our <a href="/json-diff">JSON Diff</a> tool shows every added, removed, and changed value clearly.</p>

<h2>10. Use JSONPath to query without coding</h2>
<p>Need to extract <code>$.users[?(@.active == true)].email</code> from a large payload? JSONPath queries let you slice data without writing JavaScript. Try our <a href="/jsonpath-tester">JSONPath Tester</a>.</p>

<hr/>
<p>All tools mentioned in this post are free and run entirely in your browser — no sign-up required.</p>
    `.trim(),
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "image-formats-explained-jpg-png-webp-avif",
    title: "Image Formats Explained: JPG vs PNG vs WebP vs AVIF",
    excerpt:
      "Choosing the wrong image format can double your page load time. Here's a practical guide to picking the right format for every use case.",
    author: "BeYourTools Team",
    publishedAt: "2026-07-22",
    readingTime: 7,
    category: "Image",
    tags: ["Images", "WebP", "AVIF", "Performance", "Web Dev"],
    content: `
<h2>The format decision matters more than you think</h2>
<p>On a typical webpage, images account for 60–70% of total bytes. Picking the right format isn't a micro-optimisation — it's one of the highest-impact performance wins available.</p>

<h2>JPG / JPEG</h2>
<p><strong>Best for:</strong> Photographs, gradients, complex scenes.</p>
<p>JPG uses lossy compression — it discards colour data the eye won't miss. A photo saved as JPG at quality 85 is typically 5–10× smaller than PNG with minimal visible difference. The downside: no transparency support, and high compression creates blocky artefacts.</p>
<p>Convert your photos to JPG with our <a href="/image-converter/png-to-jpg">PNG to JPG converter</a>.</p>

<h2>PNG</h2>
<p><strong>Best for:</strong> Logos, icons, screenshots, images that need transparency.</p>
<p>PNG uses lossless compression — every pixel is preserved exactly. This makes it ideal for images with sharp edges, text, or transparent backgrounds. The trade-off is larger file sizes for photographs.</p>

<h2>WebP</h2>
<p><strong>Best for:</strong> Everything on the modern web.</p>
<p>Developed by Google, WebP provides 25–35% smaller files than JPG at equivalent quality, and supports transparency like PNG. Browser support is now universal (Chrome, Firefox, Safari 14+, Edge). If you're not using WebP in 2026, you're leaving performance on the table.</p>
<p>Convert any image to WebP with our <a href="/image-converter/jpg-to-webp">JPG to WebP converter</a>.</p>

<h2>AVIF</h2>
<p><strong>Best for:</strong> Maximum compression with modern browsers.</p>
<p>AVIF (AV1 Image File Format) is the newest major format. It achieves 50% smaller files than JPG and outperforms WebP by 20–30%. Encoding is slower but browser support has improved significantly. It's the best choice for high-traffic sites where encoding time isn't a concern.</p>

<h2>SVG</h2>
<p><strong>Best for:</strong> Icons, logos, illustrations, anything that needs to scale infinitely.</p>
<p>SVG is XML-based vector graphics. A 2KB SVG logo looks perfect on a 4K monitor and a smartwatch. Use it for UI elements. Convert rasters to SVG with our <a href="/image-converter/png-to-svg">PNG to SVG converter</a>.</p>

<h2>Quick reference table</h2>
<table>
  <thead><tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td>JPG</td><td>Lossy</td><td>No</td><td>Photos</td></tr>
    <tr><td>PNG</td><td>Lossless</td><td>Yes</td><td>UI, logos</td></tr>
    <tr><td>WebP</td><td>Both</td><td>Yes</td><td>General web</td></tr>
    <tr><td>AVIF</td><td>Lossy</td><td>Yes</td><td>Max compression</td></tr>
    <tr><td>SVG</td><td>Vector</td><td>Yes</td><td>Icons, logos</td></tr>
  </tbody>
</table>

<p>Convert between any of these formats instantly with our free <a href="/image-converter">Image Converter</a>.</p>
    `.trim(),
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "pdf-tools-guide-merge-split-compress",
    title: "The Complete Guide to PDF Tools: Merge, Split, Compress & More",
    excerpt:
      "PDFs are everywhere — contracts, reports, invoices. Here's everything you need to work with them efficiently without expensive software.",
    author: "BeYourTools Team",
    publishedAt: "2026-07-29",
    readingTime: 8,
    category: "PDF",
    tags: ["PDF", "Productivity", "Documents", "Free Tools"],
    content: `
<h2>Why you shouldn't need Acrobat for most PDF tasks</h2>
<p>Adobe Acrobat costs $239/year. For the tasks most people actually need — merging files, splitting a chapter out of a manual, compressing a large attachment — free browser-based tools work just as well.</p>

<h2>Merging PDFs</h2>
<p>The most common PDF task: combining multiple files into one. Upload your PDFs to our <a href="/pdf-tools/merge-pdf">PDF Merge</a> tool, drag to reorder, click Merge. Everything runs in your browser — your files are never uploaded to a server.</p>

<h2>Splitting PDFs</h2>
<p>Need just pages 5–12 from a 200-page document? Our <a href="/pdf-tools/split-pdf">PDF Split</a> tool accepts range notation like <code>5-12</code> or <code>1,3,7-9</code>. Download individual page files or a range as a single document.</p>

<h2>Compressing PDFs</h2>
<p>Email attachments often have a 10MB or 25MB limit. Our <a href="/pdf-tools/pdf-compressor">PDF Compressor</a> re-serialises the PDF's object streams to remove redundancy. It won't perform miracles on already-optimised files, but can reduce typical scanned documents by 20–40%.</p>

<h2>Converting PDFs to images</h2>
<p>Need a thumbnail of your PDF cover? Our <a href="/pdf-tools/pdf-to-jpg">PDF to JPG</a> and <a href="/pdf-tools/pdf-to-png">PDF to PNG</a> tools render each page at 2× scale using the browser's built-in PDF renderer (pdf.js). No server, no quality loss from re-encoding.</p>

<h2>Protecting and unlocking PDFs</h2>
<p>Our <a href="/pdf-tools/protect-pdf">PDF Protect</a> tool adds AES-256 encryption with user and owner passwords. To remove a known password, use our <a href="/pdf-tools/unlock-pdf">PDF Unlock</a> tool — you must provide the current password, so this is legal for your own documents.</p>

<h2>Adding watermarks</h2>
<p>Stamp "CONFIDENTIAL" or "DRAFT" diagonally across every page with our <a href="/pdf-tools/pdf-watermark">PDF Watermark</a> tool. Control the text, font size, and opacity.</p>

<h2>Extracting text</h2>
<p>Need to get the text content of a PDF into a spreadsheet? Our <a href="/pdf-tools/pdf-to-text">PDF to Text</a> and <a href="/pdf-tools/pdf-to-csv">PDF to CSV</a> tools extract content from text-based PDFs. Note: scanned PDFs require OCR which runs server-side.</p>

<h2>Viewing metadata</h2>
<p>Every PDF contains hidden metadata: author, creation date, the software it was created with. Our <a href="/pdf-tools/pdf-metadata-viewer">Metadata Viewer</a> exposes all of it. If you're sharing documents externally, use the <a href="/pdf-tools/pdf-metadata-remover">Metadata Remover</a> to strip this before sending.</p>
    `.trim(),
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "json-schema-beginners-guide",
    title: "JSON Schema: A Beginner's Guide to Validating Your Data",
    excerpt:
      "JSON Schema is the most underused tool in API development. Learn how to write schemas, validate data, and generate schemas automatically from examples.",
    author: "BeYourTools Team",
    publishedAt: "2026-08-05",
    readingTime: 9,
    category: "JSON",
    tags: ["JSON Schema", "Validation", "APIs", "TypeScript"],
    content: `
<h2>What is JSON Schema?</h2>
<p>JSON Schema is a vocabulary for annotating and validating JSON documents. Think of it as a type system for JSON — it describes what shape your data must have, what types each field should be, and which fields are required.</p>

<pre><code>{
  "type": "object",
  "properties": {
    "id":    { "type": "integer" },
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["id", "name", "email"]
}</code></pre>

<h2>Why use it?</h2>
<p>Without schema validation, a missing required field causes a NullPointerException deep in your business logic. With schema validation, you catch it at the boundary — where the data enters your system.</p>
<p>Benefits:</p>
<ul>
  <li>Catch bad data at the API boundary, not in production</li>
  <li>Self-documenting APIs — the schema IS the documentation</li>
  <li>Generate TypeScript types, Pydantic models, or database schemas from one source of truth</li>
  <li>Test data generation tools can create valid test payloads from the schema</li>
</ul>

<h2>Core keywords</h2>
<p><strong>type</strong> — the basic JSON type: <code>string</code>, <code>number</code>, <code>integer</code>, <code>boolean</code>, <code>array</code>, <code>object</code>, <code>null</code>.</p>
<p><strong>properties</strong> — defines the schema for each property of an object.</p>
<p><strong>required</strong> — array of property names that must be present.</p>
<p><strong>additionalProperties: false</strong> — rejects any property not listed in <code>properties</code>. Great for API contracts.</p>
<p><strong>items</strong> — defines the schema for array elements.</p>
<p><strong>anyOf / oneOf</strong> — union types for when a value can be one of several shapes.</p>

<h2>Generate a schema automatically</h2>
<p>You don't have to write schemas by hand. Paste a sample JSON document into our <a href="/json-schema-generator">JSON Schema Generator</a> and it will infer types, detect required fields, and produce a draft-07 schema instantly.</p>

<h2>Validate data against a schema</h2>
<p>Once you have a schema, use our <a href="/json-schema-validator">JSON Schema Validator</a> to check any JSON document against it. Every violation is reported with its JSON path, so you know exactly which field is wrong and why.</p>

<h2>From schema to TypeScript</h2>
<p>If you're using TypeScript, you can go further — our <a href="/json-to-typescript">JSON to TypeScript</a> tool generates matching interfaces from any JSON sample. Combine it with schema generation for a full type-safe API workflow without any code generators.</p>
    `.trim(),
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "convert-images-without-losing-quality",
    title: "How to Convert Images Without Losing Quality",
    excerpt:
      "Image conversion done wrong destroys quality. Learn which formats are lossless, when to use which quality settings, and how to convert without artifacts.",
    author: "BeYourTools Team",
    publishedAt: "2026-08-12",
    readingTime: 5,
    category: "Image",
    tags: ["Image Quality", "Conversion", "Lossless", "WebP"],
    content: `
<h2>Lossless vs lossy — the fundamental distinction</h2>
<p>Every image format is either <strong>lossless</strong> (no data is discarded) or <strong>lossy</strong> (some data is thrown away to save space).</p>
<ul>
  <li><strong>Lossless:</strong> PNG, BMP, TIFF (LZW), WebP (lossless mode), SVG</li>
  <li><strong>Lossy:</strong> JPG, WebP (lossy mode), AVIF, HEIC</li>
</ul>
<p>Converting lossless → lossless preserves every pixel. Converting lossless → lossy introduces compression artifacts. Converting lossy → anything re-encodes already-degraded data, which always makes quality worse.</p>

<h2>The golden rule: start from the highest quality source</h2>
<p>Never convert a JPG to WebP to share, then convert the WebP back to JPG later. Each lossy encode degrades the image further. Always keep your original PNG or RAW file and convert fresh each time.</p>

<h2>Quality settings matter</h2>
<p>For JPG and WebP, "quality" is a 0–100 scale. The sweet spots:</p>
<ul>
  <li><strong>JPG quality 85:</strong> Indistinguishable from lossless for most photos at ~40% the file size</li>
  <li><strong>JPG quality 60:</strong> Visible artifacts on close inspection, but fine for thumbnails</li>
  <li><strong>WebP quality 80:</strong> Better than JPG 85 in both quality and size</li>
  <li><strong>WebP quality 90+:</strong> Near-lossless, roughly equivalent to PNG for most content</li>
</ul>
<p>Our <a href="/image-converter">Image Converter</a> lets you set quality for JPG, WebP, and AVIF exports.</p>

<h2>Converting PNG logos to SVG</h2>
<p>Converting a raster PNG to SVG doesn't auto-trace it into vector paths — it embeds the raster image inside an SVG container. This is useful for scalable presentation in HTML/CSS but doesn't create true vector graphics. For true vectorisation, use a dedicated tool like Inkscape's "Trace Bitmap" or Adobe Illustrator.</p>

<h2>ICO files for favicons</h2>
<p>ICO files can embed multiple resolutions (16×16, 32×32, 48×48). Our <a href="/image-converter/png-to-ico">PNG to ICO converter</a> creates a single-image ICO from any PNG. For production favicons, 32×32 is the sweet spot.</p>

<h2>Converting for print vs web</h2>
<p>Print typically requires 300 DPI and often prefers TIFF for lossless archiving. Web images are displayed at 72–96 DPI and should use WebP or AVIF for fastest loading. Convert between these with our <a href="/image-converter">Image Converter</a>.</p>
    `.trim(),
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    slug: "jwt-explained-what-developers-need-to-know",
    title: "JWTs Explained: What Every Developer Needs to Know",
    excerpt:
      "JSON Web Tokens are everywhere — authentication, API keys, session management. Here's how they work, how to decode them, and the common security mistakes to avoid.",
    author: "BeYourTools Team",
    publishedAt: "2026-08-19",
    readingTime: 7,
    category: "JSON",
    tags: ["JWT", "Authentication", "Security", "APIs"],
    content: `
<h2>What is a JWT?</h2>
<p>A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties. The token encodes a JSON payload and signs it cryptographically so the receiver can verify it wasn't tampered with.</p>
<p>A JWT looks like three Base64URL-encoded segments joined by dots:</p>
<pre><code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code></pre>

<h2>The three parts</h2>
<p><strong>Header</strong> — Algorithm and token type:</p>
<pre><code>{ "alg": "HS256", "typ": "JWT" }</code></pre>
<p><strong>Payload</strong> — The claims (user data, expiry, etc.):</p>
<pre><code>{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }</code></pre>
<p><strong>Signature</strong> — HMAC of header + payload using the secret key. This is what prevents tampering.</p>

<h2>Common claims</h2>
<ul>
  <li><code>sub</code> — Subject (usually user ID)</li>
  <li><code>iat</code> — Issued at (Unix timestamp)</li>
  <li><code>exp</code> — Expiry time (Unix timestamp) — your server should always check this</li>
  <li><code>iss</code> — Issuer (who created the token)</li>
  <li><code>aud</code> — Audience (who the token is intended for)</li>
</ul>

<h2>Decoding vs verifying</h2>
<p>Anyone can <em>decode</em> a JWT — it's just Base64. But only someone with the secret key can <em>verify</em> the signature. This is a critical distinction: decoded ≠ verified. Never trust JWT claims without verifying the signature on your server.</p>
<p>To inspect a token during debugging, use our <a href="/jwt-decoder">JWT Decoder</a> — it decodes header and payload instantly and shows the expiry status.</p>

<h2>Security mistakes to avoid</h2>
<p><strong>1. Accepting "alg: none"</strong> — Some libraries historically accepted unsigned tokens. Explicitly whitelist algorithms in your JWT library config.</p>
<p><strong>2. Storing JWTs in localStorage</strong> — Vulnerable to XSS attacks. Store in httpOnly cookies instead.</p>
<p><strong>3. Ignoring expiry</strong> — Always validate <code>exp</code>. Short-lived tokens (15 minutes) with refresh tokens is the safest pattern.</p>
<p><strong>4. Putting sensitive data in the payload</strong> — The payload is readable by anyone. Never put passwords, credit card numbers, or PII in JWT claims.</p>
<p><strong>5. Weak secrets</strong> — HS256 with a short secret can be brute-forced. Use at least 256 bits of entropy, or switch to RS256 with asymmetric keys.</p>

<h2>RS256 vs HS256</h2>
<p><strong>HS256</strong> — Symmetric: same secret signs and verifies. Simple but requires sharing the secret with every service that verifies tokens.</p>
<p><strong>RS256</strong> — Asymmetric: private key signs, public key verifies. Services can verify without ever seeing the private key. Preferred in microservice architectures.</p>

<p>Debug your tokens in seconds with our free <a href="/jwt-decoder">JWT Decoder</a>.</p>
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRecentPosts(count = 3, excludeSlug?: string): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== excludeSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
