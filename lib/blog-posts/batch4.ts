import type { BlogPost } from "@/lib/blog";

export const batch4: BlogPost[] = [
  {
    slug: "json-to-sql-database-guide",
    title: "JSON to SQL: Generate CREATE TABLE and INSERT Statements",
    excerpt: "Importing JSON data into a relational database? Auto-generate SQL schema and insert statements from any JSON array.",
    author: "BeYourTools Team", publishedAt: "2027-02-10", readingTime: 6, category: "JSON",
    tags: ["JSON", "SQL", "Database", "Schema"],
    content: `<h2>When to convert JSON to SQL</h2><p>When seeding a PostgreSQL/MySQL/SQLite database with JSON data, or when migrating from a document store (MongoDB) to a relational database.</p><h2>How our tool works</h2><p>Our <a href="/json-to-sql">JSON to SQL</a> tool inspects field values to infer SQL types: strings become VARCHAR(255), integers become INTEGER, dates become TIMESTAMP.</p><h2>Generated output</h2><pre><code>CREATE TABLE IF NOT EXISTS records (
  id INTEGER,
  name VARCHAR(255),
  created TIMESTAMP
);
INSERT INTO records (id, name, created) VALUES (1, 'Ada', '2026-01-15');</code></pre><h2>Preparing your JSON</h2><p>For best results, first <a href="/json-flatten">flatten nested JSON</a> and ensure your array is clean with the <a href="/json-validator">JSON Validator</a>.</p><section class="faq"><h2>FAQs</h2><dl><dt>Which SQL dialects does the output work with?</dt><dd>The generated SQL uses ANSI-standard syntax compatible with PostgreSQL, MySQL, SQLite, and most other relational databases.</dd></dl></section>`,
  },
  {
    slug: "bmp-image-format-guide",
    title: "BMP Image Format: When to Use It and When to Avoid It",
    excerpt: "BMP is the oldest raster format and still has legitimate uses. Learn what it is, when it makes sense, and how to convert to and from it.",
    author: "BeYourTools Team", publishedAt: "2027-02-17", readingTime: 4, category: "Image",
    tags: ["BMP", "Image Format", "Conversion", "Legacy"],
    content: `<h2>What is BMP?</h2><p>BMP (Bitmap) is Microsoft's native raster image format. It stores raw pixel data without compression - every pixel takes exactly the same space regardless of image content.</p><h2>When BMP makes sense</h2><ul><li>Intermediate format in graphics processing pipelines</li><li>Windows application icons (though ICO is preferred)</li><li>Images that need zero compression artifacts</li><li>Legacy Windows software that only accepts BMP</li></ul><h2>When to avoid BMP</h2><p>Never use BMP for web images - a 1920×1080 BMP is ~6MB vs ~200KB for an equivalent WebP. Always convert for web use.</p><h2>Convert BMP to web formats</h2><p>Use our converter: <a href="/image-converter/bmp-to-webp">BMP to WebP</a>, <a href="/image-converter/bmp-to-png">BMP to PNG</a>, or <a href="/image-converter/bmp-to-jpg">BMP to JPG</a>.</p><section class="faq"><h2>FAQs</h2><dl><dt>Is BMP lossless?</dt><dd>Yes - standard BMP uses no compression, preserving every pixel exactly. This is why the files are so large.</dd></dl></section>`,
  },
  {
    slug: "json-merge-deep-merge-guide",
    title: "JSON Merge: Understanding Deep vs Shallow Merging",
    excerpt: "JavaScript's spread operator does shallow merges. Here's why that causes bugs and how to do a proper deep merge of JSON objects.",
    author: "BeYourTools Team", publishedAt: "2027-02-24", readingTime: 6, category: "JSON",
    tags: ["JSON", "Merge", "JavaScript", "Deep Merge"],
    content: `<h2>Shallow merge vs deep merge</h2><p><strong>Shallow merge</strong> (<code>{...a, ...b}</code>) - top-level keys from B override A entirely. Nested objects are replaced, not merged.</p><p><strong>Deep merge</strong> - recursively merges nested objects. B's values override A's only at leaf level.</p><h2>The problem with spread</h2><pre><code>const a = {user: {name: "Ada", age: 30}};
const b = {user: {name: "Grace"}};
{...a, ...b} // {user: {name: "Grace"}} - age is LOST</code></pre><h2>Visualise before coding</h2><p>Use our <a href="/json-merge">JSON Merge</a> tool to see exactly how two JSON objects merge before putting it in code. It shows the merged result instantly.</p><h2>Array merge behaviour</h2><p>In deep merge, arrays are typically replaced rather than concatenated. Verify this matches your expectation with the merge tool.</p><section class="faq"><h2>FAQs</h2><dl><dt>Does JSON merge handle circular references?</dt><dd>JSON doesn't support circular references by definition - JSON.stringify would fail. Standard JSON objects are always safe to deep-merge.</dd></dl></section>`,
  },
  {
    slug: "pdf-to-html-conversion",
    title: "PDF to HTML: Convert Documents for the Web",
    excerpt: "Make your PDF content searchable, indexable, and web-friendly by converting it to HTML. Here's how and when to do it.",
    author: "BeYourTools Team", publishedAt: "2027-03-03", readingTime: 5, category: "PDF",
    tags: ["PDF", "HTML", "Web", "SEO", "Conversion"],
    content: `<h2>Why convert PDF to HTML?</h2><p>PDFs are not crawlable by search engines as well as HTML. Converting annual reports, whitepapers, and manuals to HTML makes content discoverable and accessible.</p><h2>What our tool extracts</h2><p>Our <a href="/pdf-tools/pdf-to-html">PDF to HTML</a> tool extracts text content and wraps it in a clean HTML document with proper <code>&lt;title&gt;</code>, headings, and metadata.</p><h2>Limitations</h2><p>Browser-based extraction works well for text-heavy PDFs. Complex layouts with columns, tables, and images require server-side tools for accurate reconstruction.</p><h2>SEO benefits</h2><p>HTML content is fully indexable. Add the converted HTML to your CMS alongside the original PDF download for maximum discoverability.</p><h2>Also try: PDF to Text</h2><p>For simpler use cases, <a href="/pdf-tools/pdf-to-text">PDF to Text</a> extracts plain content without HTML markup.</p><section class="faq"><h2>FAQs</h2><dl><dt>Does Google index PDF files?</dt><dd>Yes, but HTML is indexed more reliably. For important content, publish in both formats.</dd></dl></section>`,
  },
  {
    slug: "tiff-format-professional-guide",
    title: "TIFF Format: The Professional's Guide to High-Quality Images",
    excerpt: "TIFF is the standard for print, archiving, and professional photography. Learn when to use it and how to convert between TIFF and web formats.",
    author: "BeYourTools Team", publishedAt: "2027-03-10", readingTime: 5, category: "Image",
    tags: ["TIFF", "Image Format", "Print", "Photography"],
    content: `<h2>What is TIFF?</h2><p>TIFF (Tagged Image File Format) is a flexible raster format designed for high-quality image storage. It supports lossless compression, multiple layers, 16-bit colour depth, and CMYK colour space - making it the standard for print and professional workflows.</p><h2>When to use TIFF</h2><ul><li>Print publishing (magazines, books, posters)</li><li>Medical imaging (DICOM TIFF)</li><li>Document archiving and scanning</li><li>Professional photography masters</li></ul><h2>Converting TIFF for the web</h2><p>TIFF files are too large for web use. Convert to WebP with our <a href="/image-converter/tiff-to-webp">TIFF to WebP</a> converter, or to JPG with <a href="/image-converter/tiff-to-jpg">TIFF to JPG</a>.</p><h2>Browser support note</h2><p>Most browsers cannot display TIFF natively. Convert to a web format before embedding in HTML.</p><section class="faq"><h2>FAQs</h2><dl><dt>Is TIFF lossless?</dt><dd>TIFF supports both lossless (LZW, ZIP) and lossy (JPEG) compression internally. Uncompressed TIFF is entirely lossless.</dd></dl></section>`,
  },
  {
    slug: "json-viewer-tree-explorer",
    title: "JSON Viewer: How to Explore Complex Nested JSON",
    excerpt: "A JSON viewer makes large, deeply nested JSON human-readable. Learn how to navigate API responses and complex data structures visually.",
    author: "BeYourTools Team", publishedAt: "2027-03-17", readingTime: 4, category: "JSON",
    tags: ["JSON", "Viewer", "Debug", "Tree View"],
    content: `<h2>Why use a JSON viewer?</h2><p>Deeply nested JSON like API responses, database exports, and config files are nearly impossible to read as plain text. A tree viewer lets you expand/collapse nodes and navigate the structure.</p><h2>Our JSON Viewer features</h2><p>Our <a href="/json-viewer">JSON Viewer</a> renders any valid JSON as a collapsible tree with colour-coded types: strings in amber, numbers in teal, booleans in coral, null in grey.</p><h2>Workflow tip</h2><p>Use the viewer alongside the <a href="/json-formatter">JSON Formatter</a> - formatter for copying/editing, viewer for understanding structure. The <a href="/json-editor">JSON Editor</a> combines both with live preview.</p><h2>Extract data with JSONPath</h2><p>Once you understand the structure visually, use our <a href="/jsonpath-tester">JSONPath Tester</a> to write queries that extract exactly what you need.</p><section class="faq"><h2>FAQs</h2><dl><dt>What's the difference between JSON Viewer and JSON Editor?</dt><dd>The <a href="/json-viewer">JSON Viewer</a> is read-only tree exploration. The <a href="/json-editor">JSON Editor</a> adds live editing with the tree updating as you type.</dd></dl></section>`,
  },
  {
    slug: "heic-to-jpg-conversion",
    title: "HEIC to JPG: Convert iPhone Photos for Universal Compatibility",
    excerpt: "iPhones shoot in HEIC format, but not all apps accept it. Here's how to convert HEIC photos to JPG for universal compatibility.",
    author: "BeYourTools Team", publishedAt: "2027-03-24", readingTime: 4, category: "Image",
    tags: ["HEIC", "JPG", "iPhone", "Conversion", "Apple"],
    content: `<h2>Why iPhones use HEIC</h2><p>Apple adopted HEIC (High Efficiency Image Container) in iOS 11 to cut file sizes roughly in half compared to JPG at the same quality.</p><h2>The compatibility problem</h2><p>HEIC isn't universally supported. Many Windows applications, web upload forms, and older Android devices can't open HEIC files.</p><h2>Convert HEIC to JPG</h2><p>Use our <a href="/image-converter/heic-to-jpg">HEIC to JPG converter</a>. Note: HEIC decoding is not yet natively supported in all browsers - if the conversion fails, your browser may need updating.</p><h2>Alternative: Send as JPG from iPhone</h2><p>In iOS Settings → Camera → Formats → switch to "Most Compatible" to shoot in JPG by default.</p><h2>Convert to other formats</h2><p>Also available: <a href="/image-converter/heic-to-png">HEIC to PNG</a> and <a href="/image-converter/heic-to-webp">HEIC to WebP</a>.</p><section class="faq"><h2>FAQs</h2><dl><dt>Is HEIC better quality than JPG?</dt><dd>Yes - HEIC achieves roughly the same visual quality as JPG at about half the file size, using the more efficient HEVC codec.</dd></dl></section>`,
  },
  {
    slug: "json-token-counter-llm-guide",
    title: "JSON Token Counter: Optimise LLM Prompts and Payloads",
    excerpt: "LLM APIs charge by the token. Large JSON payloads can cost hundreds of tokens. Here's how to measure and optimise before sending.",
    author: "BeYourTools Team", publishedAt: "2027-03-31", readingTime: 5, category: "JSON",
    tags: ["JSON", "LLM", "Tokens", "OpenAI", "Cost Optimisation"],
    content: `<h2>Why token count matters for JSON</h2><p>GPT-4, Claude, and other LLMs charge per token. JSON with extra whitespace, verbose keys, or redundant structure wastes tokens and increases cost.</p><h2>Count tokens before sending</h2><p>Our <a href="/json-token-counter">JSON Token Counter</a> estimates token count using a character-based approximation (roughly 1 token per 3.7 characters for English text).</p><h2>Reduce token count</h2><ol><li>Minify the JSON with our <a href="/json-minifier">JSON Minifier</a> - removes all whitespace tokens</li><li>Shorten verbose keys: <code>userIdentifier</code> → <code>uid</code></li><li>Remove null/empty values before sending</li><li>Use integers instead of strings where possible</li></ol><h2>Typical savings</h2><p>Minifying a formatted JSON payload typically saves 15–30% of tokens. Combined with key shortening, savings of 40%+ are achievable.</p><section class="faq"><h2>FAQs</h2><dl><dt>Is the token count exact?</dt><dd>The estimate is approximate - exact counts depend on the specific tokenizer (tiktoken for OpenAI, Claude's own tokenizer). Use it for ballpark estimates and optimisation decisions.</dd></dl></section>`,
  },
  {
    slug: "svg-scalable-vector-guide",
    title: "SVG Images: The Complete Guide to Scalable Vector Graphics",
    excerpt: "SVG files stay crisp at any size, making them perfect for logos and icons. Learn when to use SVG and how to convert between SVG and other formats.",
    author: "BeYourTools Team", publishedAt: "2027-04-07", readingTime: 6, category: "Image",
    tags: ["SVG", "Vector", "Icons", "Web Design", "CSS"],
    content: `<h2>Why SVG is different</h2><p>SVG (Scalable Vector Graphics) isn't a raster format - it stores shapes as XML math. This means it scales to any size without pixelation, making it perfect for logos, icons, and diagrams.</p><h2>SVG advantages</h2><ul><li>Resolution-independent - perfect on 4K displays</li><li>Tiny file sizes for simple shapes</li><li>Animatable with CSS and JavaScript</li><li>Accessible (screen readers can read SVG text)</li><li>Inline-able directly in HTML</li></ul><h2>Converting rasters to SVG</h2><p>Our <a href="/image-converter/png-to-svg">PNG to SVG</a> converter wraps the raster image in an SVG container - useful for scalable presentation but not true vector tracing. For traced vectors, use Inkscape.</p><h2>Converting SVG to raster</h2><p>Convert SVG for use in apps that don't support vector: <a href="/image-converter/svg-to-png">SVG to PNG</a>, <a href="/image-converter/svg-to-jpg">SVG to JPG</a>, <a href="/image-converter/svg-to-webp">SVG to WebP</a>.</p><section class="faq"><h2>FAQs</h2><dl><dt>Should I use SVG or PNG for my website logo?</dt><dd>SVG for all logos and icons - it looks perfect on retina displays and is typically 10× smaller than an equivalent PNG. Use PNG only for fallback in very old browsers.</dd></dl></section>`,
  },
  {
    slug: "pdf-repair-fix-corrupted-pdf",
    title: "How to Repair a Corrupted or Damaged PDF",
    excerpt: "PDF files can become corrupted from incomplete downloads, storage errors, or software bugs. Here's how to recover them.",
    author: "BeYourTools Team", publishedAt: "2027-04-14", readingTime: 4, category: "PDF",
    tags: ["PDF", "Repair", "Corrupted", "Recovery"],
    content: `<h2>Signs of a damaged PDF</h2><ul><li>Error: "File not found or this file cannot be opened"</li><li>Pages display as blank or scrambled</li><li>PDF reader crashes on opening</li><li>File size is unexpectedly 0 bytes</li></ul><h2>How browser-based repair works</h2><p>Our <a href="/pdf-tools/pdf-repair">PDF Repair</a> tool uses pdf-lib to re-parse and re-serialise the PDF's internal object structure, often recovering files with minor corruption.</p><h2>What it can fix</h2><p>Works for: incomplete cross-reference tables, corrupted object streams, minor file truncation. Does not work for: severely corrupted files, encrypted files you don't have the password for, or zero-byte files.</p><h2>Complement with compare</h2><p>If you have a backup, use our <a href="/pdf-tools/pdf-compare">PDF Compare</a> tool to check what changed before and after repair.</p><section class="faq"><h2>FAQs</h2><dl><dt>What causes PDF corruption?</dt><dd>Incomplete downloads, interrupted saves, storage device errors, email encoding issues, and software bugs are the most common causes.</dd></dl></section>`,
  },
];
