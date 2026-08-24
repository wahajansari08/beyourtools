import type { BlogPost } from "@/lib/blog";

export const batch5: BlogPost[] = [
  {
    slug: "compress-pdf-reduce-file-size",
    title: "How to Compress a PDF and Reduce Its File Size",
    excerpt: "Email attachments too large? PDF files bloated with embedded content? Here's how to shrink them without buying expensive software.",
    author: "BeYourTools Team",
    publishedAt: "2026-10-07",
    readingTime: 5,
    category: "PDF",
    tags: ["PDF", "Compression", "File Size", "Optimise"],
    content: `<h2>Why are PDFs so large?</h2>
<p>PDFs can embed fonts, high-resolution images, colour profiles, and various internal structures. A single scanned page at full resolution can easily reach several megabytes. A 10-page scanned document can top 50 MB — far too large for most email systems.</p>

<h2>What browser-based compression can do</h2>
<p>Our <a href="/pdf-tools/pdf-compressor">PDF Compressor</a> reduces file size by cleaning up and re-organising the PDF's internal data. Redundant content, duplicate objects, and inefficient structures are removed. For text-heavy PDFs, expect reductions in the range of 10–40%. The results vary — some files compress dramatically, others less so, depending on how the original was created.</p>

<h2>What compression can't fix</h2>
<p>If a PDF is large primarily because it contains high-resolution images embedded at print quality, browser-based compression has limited effect on those images. For those cases, desktop tools provide more control over image recompression at the cost of some additional setup.</p>

<h2>Tips to keep PDFs small from the start</h2>
<p>The easiest way to avoid large PDFs is to start with optimised sources. If you're creating a PDF from images, first convert them to WebP using our <a href="/image-converter/jpg-to-webp">JPG to WebP converter</a> to reduce their size before including them in the document.</p>

<h2>Remove metadata to trim a few extra bytes</h2>
<p>PDFs embed creation dates, author names, software details, and other metadata that contributes to file size. Our <a href="/pdf-tools/pdf-metadata-remover">PDF Metadata Remover</a> strips this information while leaving the document content completely intact.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>How much will my PDF compress?</dt>
<dd>Results vary significantly by source. PDFs created from word processors or presentations often compress by 20–40%. Scanned PDFs — which are essentially image files wrapped in a PDF container — see less benefit without also recompressing the images.</dd>
<dt>Does compressing a PDF reduce its visual quality?</dt>
<dd>Our tool uses lossless PDF optimisation. Text and vector content are not degraded. Existing embedded images are not recompressed, so their quality is preserved exactly as in the original.</dd>
<dt>Is it safe to compress confidential PDFs online?</dt>
<dd>With BeYourTools, all processing happens locally in your browser. Your PDF never leaves your device, so there's no risk of sensitive content being transmitted or stored anywhere.</dd>
</dl>
</section>`,
  },
  {
    slug: "json-to-csv-complete-guide",
    title: "JSON to CSV: The Complete Conversion Guide",
    excerpt: "Converting JSON data to CSV for spreadsheets, databases, or analytics. Everything you need to know with practical examples.",
    author: "BeYourTools Team",
    publishedAt: "2026-09-16",
    readingTime: 7,
    category: "JSON",
    tags: ["JSON", "CSV", "Data", "Conversion", "Spreadsheets"],
    content: `<h2>When to convert JSON to CSV</h2>
<p>CSV is the universal format for tabular data. Convert to CSV when you need to open data in Excel or Google Sheets, import it into a relational database, send it to someone who isn't comfortable with JSON, or run analysis in a data tool.</p>

<h2>How the conversion works</h2>
<p>JSON-to-CSV works best on arrays of flat objects. Each object in the array becomes a row. Each unique key across all objects becomes a column header. Values are filled in for each row where the key exists.</p>

<pre><code>[{"name":"Alice","age":30},{"name":"Bob","age":25}]</code></pre>
<p>Becomes:</p>
<pre><code>name,age
Alice,30
Bob,25</code></pre>

<h2>Handling nested objects</h2>
<p>Nested objects don't map cleanly to CSV columns. The best approach is to flatten the JSON first: our <a href="/json-flatten">JSON Flatten</a> tool converts <code>{"user":{"name":"Ada"}}</code> into <code>{"user.name":"Ada"}</code>, which then converts to a proper column header in the CSV.</p>

<h2>Convert instantly</h2>
<p>Use our <a href="/json-to-csv">JSON to CSV</a> tool — paste your JSON array and download the CSV file immediately. If you need to go the other way, our <a href="/csv-to-json">CSV to JSON</a> converter reads the header row and converts each subsequent row into a JSON object.</p>

<h2>What happens to data types?</h2>
<p>CSV is a text-based format — there's no concept of data types. Numbers, booleans, and dates all become text strings in the CSV. When you import the CSV into a database or analysis tool, you'll typically need to specify which columns should be treated as numbers or dates.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Can I convert nested JSON to CSV?</dt>
<dd>Yes, but you need to flatten the JSON first. Use our <a href="/json-flatten">JSON Flatten</a> tool to convert nested objects into dot-notation keys, then convert to CSV. This turns <code>user.name</code> into a column header.</dd>
<dt>What if my JSON objects have different keys?</dt>
<dd>Our converter handles inconsistent objects gracefully. It collects all unique keys from all objects and uses them as column headers. Objects missing a particular key will have an empty cell for that column.</dd>
<dt>How do I open the CSV in Excel?</dt>
<dd>Download the CSV file and double-click it. Excel opens CSV files directly. If numbers are imported as text, use Excel's "Convert to Number" option to fix the type.</dd>
</dl>
</section>`,
  },
];
