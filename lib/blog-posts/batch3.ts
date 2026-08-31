import type { BlogPost } from "@/lib/blog";

export const batch3: BlogPost[] = [
  {
    slug: "what-is-json-and-why-it-matters",
    title: "What is JSON? A Complete Beginner's Guide",
    excerpt: "JSON powers the modern web. From REST APIs to config files, here's everything you need to understand about the world's most popular data format.",
    author: "BeYourTools Team",
    publishedAt: "2026-08-26",
    readingTime: 6,
    category: "JSON",
    tags: ["JSON", "Beginners", "Web Development", "APIs"],
    content: `<h2>JSON stands for JavaScript Object Notation</h2>
<p>Despite its name, JSON is language-independent and is used across virtually every modern programming language - Python, Go, Java, Ruby, PHP, and many others all handle it natively. It was named after JavaScript because it shares the same syntax for objects and arrays, but it's a universal standard, not a JavaScript-specific format.</p>

<h2>The six data types</h2>
<p>JSON supports exactly six value types: <strong>string</strong> (text in double quotes), <strong>number</strong> (integer or decimal), <strong>boolean</strong> (<code>true</code> or <code>false</code>), <strong>null</strong> (representing no value), <strong>array</strong> (an ordered list), and <strong>object</strong> (a set of named values). That's the entire specification.</p>

<pre><code>{"name":"Ada","age":30,"active":true,"score":9.5,"tags":["engineer"],"address":null}</code></pre>

<h2>JSON vs XML vs YAML</h2>
<p>JSON replaced XML as the dominant web data format because it's more compact and easier to read. YAML is popular for configuration files because it supports comments and has cleaner syntax for deeply nested data, but JSON remains the default for APIs and browser storage.</p>

<h2>Tools to work with JSON</h2>
<p>Start with our <a href="/json-formatter">JSON Formatter</a> to make raw or minified JSON readable. Use the <a href="/json-validator">JSON Validator</a> to check whether JSON is well-formed. The <a href="/json-viewer">JSON Viewer</a> renders any JSON as a collapsible tree so you can explore its structure without getting lost in brackets.</p>

<h2>Converting JSON to other formats</h2>
<p>Need your data as a spreadsheet? Use <a href="/json-to-csv">JSON to CSV</a>. Want it as a configuration file? Try <a href="/json-to-yaml">JSON to YAML</a>. Need to generate TypeScript types from a JSON sample? Use <a href="/json-to-typescript">JSON to TypeScript</a>.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>What is JSON used for?</dt>
<dd>JSON is used for REST API responses, application configuration files, document databases, browser storage, and communication between services. It is the most widely used data exchange format on the web.</dd>
<dt>Can JSON have comments?</dt>
<dd>No - standard JSON does not support comments. If you need commented configuration, consider YAML, which supports them fully. Our <a href="/json-to-yaml">JSON to YAML</a> converter makes the switch easy.</dd>
<dt>What is the difference between a JSON object and an array?</dt>
<dd>A JSON object is a collection of named key-value pairs wrapped in curly braces: <code>{"name":"Ada"}</code>. A JSON array is an ordered list of values in square brackets: <code>[1, 2, 3]</code>. Objects and arrays can be nested inside each other to any depth.</dd>
</dl>
</section>`,
  },
  {
    slug: "how-to-reduce-image-file-size",
    title: "How to Reduce Image File Size Without Losing Quality",
    excerpt: "Large images slow down every page on your site. A systematic guide to compressing images for the web while keeping them looking great.",
    author: "BeYourTools Team",
    publishedAt: "2026-09-09",
    readingTime: 6,
    category: "Image",
    tags: ["Image Compression", "Performance", "WebP", "Web Optimisation"],
    content: `<h2>Why image size matters so much</h2>
<p>Images are typically 60–70% of a web page's total weight. Research consistently shows that page load time directly affects bounce rate and conversions. Cutting image size is the highest-return performance improvement available to most websites.</p>

<h2>Choose the right format first</h2>
<p>Format choice has a bigger impact than any quality setting. A photo saved as WebP instead of JPG at equivalent quality saves 25–35% of the file size with no visible difference. Use our <a href="/image-converter/jpg-to-webp">JPG to WebP converter</a> to convert individual images or batches at once.</p>

<h2>Set an appropriate quality level</h2>
<p>For JPG and WebP, quality 80–85 is the sweet spot for photographic content. Going higher gives minimal visual improvement but significantly larger files. Going lower starts introducing visible artifacts. Our <a href="/image-converter">Image Converter</a> has a quality slider so you can find the right balance for each image.</p>

<h2>Convert photographic PNGs to JPG or WebP</h2>
<p>PNG uses lossless compression - excellent for logos and screenshots, but wasteful for photographs. If you have a photographic image saved as PNG, converting it to JPG or WebP with our <a href="/image-converter/png-to-jpg">PNG to JPG converter</a> will typically reduce its size by 70–90%.</p>

<h2>Try AVIF for maximum compression</h2>
<p>AVIF provides roughly 50% smaller files than JPG at equivalent quality. It's well-supported in modern browsers as of 2026. Use our <a href="/image-converter/jpg-to-avif">JPG to AVIF converter</a> for the best compression available.</p>

<h2>Resize before compressing</h2>
<p>Serving a 4000×3000-pixel image that displays at 800×600 pixels wastes roughly 25 times the bandwidth needed. Resize images to their display dimensions before optimising them.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>How much can I compress a JPEG without visible quality loss?</dt>
<dd>At quality 80–85, most photographic JPEGs are visually indistinguishable from the original while being 40–60% smaller. Lower quality settings are appropriate for thumbnails and non-critical images.</dd>
<dt>What is the best image format for websites in 2026?</dt>
<dd>WebP for broad compatibility and AVIF for maximum compression. Always include a JPG fallback for any environments that might not support newer formats.</dd>
<dt>Does compressing an image reduce its resolution?</dt>
<dd>No - compression reduces file size by discarding imperceptible image data. The dimensions (width and height in pixels) stay the same. Resizing is a separate step that actually changes the pixel dimensions.</dd>
</dl>
</section>`,
  },
];
