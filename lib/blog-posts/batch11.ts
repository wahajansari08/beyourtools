import type { BlogPost } from "@/lib/blog";

export const batch11: BlogPost[] = [
  {
    slug: "compress-images-web-without-losing-quality",
    title: "How to Compress Images for the Web Without Losing Quality",
    seoTitle: "Compress Images for Web Without Quality Loss",
    excerpt: "Large images are the #1 cause of slow websites. Here's how to shrink them by 70-90% while keeping them sharp. Free, in your browser.",
    author: "Be",
    publishedAt: "2026-09-08",
    readingTime: 6,
    category: "Image",
    tags: ["Image Compression", "Web Performance", "WebP", "SEO"],
    content: `<h2>Why image size matters more than you think</h2>
<p>I once audited a friend's portfolio site that took 11 seconds to load. The culprit wasn't the code or the hosting. It was six uncompressed PNG screenshots totalling 24 MB. After compressing them properly, the same page loaded in under 2 seconds and looked identical. Images are almost always the biggest bytes on a page, which makes compression the highest-leverage performance win available to most site owners.</p>

<h2>The 3-step compression workflow</h2>
<p><strong>1. Pick the right format first.</strong> Format choice matters more than any quality slider. Photographs should be WebP or AVIF. Graphics with flat colours and text should be PNG (or SVG if they're vector). Never use BMP or TIFF on the web. If you're unsure, convert with our <a href="/image-converter/jpg-to-webp">JPG to WebP converter</a> and compare.</p>
<p><strong>2. Resize before you compress.</strong> A 4000px photo displayed at 800px wide is carrying 25x more pixels than it needs. Resize to the display size first with our <a href="/image-resizer">Image Resizer</a>. This alone often cuts 80% of the file size.</p>
<p><strong>3. Dial in quality with our compressor.</strong> Upload the resized image to our <a href="/image-compressor">Image Compressor</a>, set quality to 80, and compare before/after. For most photos, quality 75-85 is visually indistinguishable from 100 at a fraction of the size.</p>

<h2>How low can you go?</h2>
<p>Here's my practical rule of thumb from compressing thousands of images:</p>
<ul>
<li><strong>Hero/banner photos:</strong> WebP at quality 80 (sharp on retina displays, typically 100-200 KB)</li>
<li><strong>Blog content images:</strong> WebP at quality 75 (around 50-100 KB each)</li>
<li><strong>Thumbnails:</strong> WebP at quality 70 (under 30 KB)</li>
<li><strong>Logos/icons:</strong> SVG if possible, otherwise PNG. Never JPEG for these</li>
</ul>

<h2>Lossy vs lossless: what actually happens</h2>
<p>Lossy compression (JPEG, WebP at quality &lt;100) permanently discards image data the human eye barely notices: subtle colour gradients get simplified. Lossless (PNG, WebP at 100) preserves every pixel but produces larger files. For the web, lossy at sensible quality settings wins every time. The "loss" is invisible; the speed gain is very visible in your bounce rate.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Will compressing my images make them look blurry?</dt>
<dd>Not if you do it right. At WebP quality 80, differences from the original are essentially invisible to the human eye. Problems only appear below quality 60 or when you upscale a small image. Always keep your originals as backup.</dd>
<dt>Should I compress PNG or convert to WebP instead?</dt>
<dd>Convert to WebP. A PNG compressed as far as possible is still usually 2-3x larger than a WebP at equivalent visual quality. The only reason to keep PNG is when you need maximum compatibility with very old software.</dd>
<dt>Does image compression affect SEO?</dt>
<dd>Yes, positively. Google uses page speed (Core Web Vitals) as a ranking factor, and images are typically the largest contributor to slow loads. Compressed images also reduce bandwidth costs.</dd>
</dl>
</section>`,
  },
  {
    slug: "pdf-metadata-what-it-reveals-how-to-remove",
    title: "PDF Metadata: What Your Files Reveal About You (and How to Remove It)",
    seoTitle: "PDF Metadata Privacy: What It Reveals & Removal",
    excerpt: "That PDF you just shared might contain your name, software, and edit history. Here's what metadata leaks and how to strip it in seconds.",
    author: "Be",
    publishedAt: "2026-09-18",
    readingTime: 5,
    category: "PDF",
    tags: ["PDF", "Privacy", "Metadata", "Security"],
    content: `<h2>Your PDFs are talking behind your back</h2>
<p>Every PDF carries a hidden passenger: metadata. Open almost any PDF's document properties and you'll find the author's name, the software that created it, and often creation and modification timestamps. I've seen job applications that revealed the candidate was still employed (creation software: company-licensed Acrobat), and "anonymous" leaked documents that named their author outright. Before you share any PDF outside your circle of trust, check what's inside it.</p>

<h2>What metadata typically contains</h2>
<ul>
<li><strong>Author</strong>, often your full name, pulled from your OS or Office account</li>
<li><strong>Creator / Producer</strong>, the exact software and version (e.g. "Microsoft Word 2021", "macOS Quartz PDFContext")</li>
<li><strong>Creation and modification dates</strong>, when the file was made and last touched</li>
<li><strong>Title, subject, keywords</strong>, sometimes leftover from templates</li>
<li><strong>Edit history traces</strong>, some workflows embed revision info</li>
</ul>

<h2>How to check your PDF's metadata</h2>
<p>Upload your file to our <a href="/pdf-tools/pdf-metadata-viewer">PDF Metadata Viewer</a>. It reads every metadata field instantly, in your browser. The file never leaves your device, which matters because you're inspecting a file you consider sensitive.</p>

<h2>How to remove it</h2>
<p>Once you've seen what's there, strip it with our <a href="/pdf-tools/pdf-metadata-remover">PDF Metadata Remover</a>. One click clears author, creator, producer, dates, and keyword fields. The visible content of your PDF is completely untouched. Only the hidden fields are wiped. I recommend making this a habit for anything you publish: resumes, quotes, reports, contracts.</p>

<h2>When metadata is actually useful</h2>
<p>To be fair, metadata isn't evil. In publishing workflows it helps with cataloguing, and "created by" attribution matters for creative work. The rule is simple: metadata you <em>choose</em> to include is fine; metadata leaking by accident is a privacy bug. Check before you share.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Does removing metadata affect how my PDF looks?</dt>
<dd>Not at all. Metadata lives in the file's document info dictionary, completely separate from page content. Text, images, fonts, and layout are identical after removal.</dd>
<dt>Can metadata be recovered after removal?</dt>
<dd>No. The remover overwrites the fields with empty values and re-saves the file. There's nothing to recover, but this is also why you should keep an original copy if you want the metadata for your own records.</dd>
<dt>Is it safe to upload my PDF to check metadata?</dt>
<dd>With our tools, yes. Everything runs locally in your browser tab. Your file is never uploaded to any server. This is precisely why browser-based tools are the right choice for sensitive documents.</dd>
</dl>
</section>`,
  },
  {
    slug: "json-vs-yaml-vs-toml-config-formats",
    title: "JSON vs YAML vs TOML: Which Config Format Should You Actually Use?",
    seoTitle: "JSON vs YAML vs TOML: Config Format Comparison",
    excerpt: "Every project needs config files, and every format has opinions. A practical, hype-free comparison from someone who's debugged all three at 2am.",
    author: "Be",
    publishedAt: "2026-09-29",
    readingTime: 7,
    category: "JSON",
    tags: ["JSON", "YAML", "TOML", "Configuration", "DevOps"],
    content: `<h2>The short answer</h2>
<p>Use <strong>TOML</strong> for app configuration, <strong>YAML</strong> when a tool demands it (Kubernetes, CI pipelines), and <strong>JSON</strong> for data interchange between systems. If you only remember one sentence from this article, that's the one. Now here's why.</p>

<h2>JSON: the data format cosplaying as config</h2>
<p>JSON's strengths are universality and predictability: every language parses it, and there's exactly one way to write anything. Its weaknesses as a <em>human-written</em> config format are real: no comments, strict quoting, trailing commas are fatal, and deeply nested braces get hard to scan. JSON is the right choice when machines write and read the file (API payloads, package.json, tsconfig). For files humans edit daily, it fights you. Validate yours with our <a href="/json-validator">JSON Validator</a> before you blame your app.</p>

<h2>YAML: powerful, popular, and quietly dangerous</h2>
<p>YAML won DevOps because it's readable. Compare a Kubernetes manifest in YAML vs JSON and there's no contest. But YAML's flexibility is its trap: significant whitespace, the infamous Norway problem (<code>NO</code> parsing as boolean false), and multiple ways to write the same thing mean subtle bugs. My rule: use YAML where the ecosystem requires it, keep files small, and always validate. Converting between the two? Our <a href="/json-to-yaml">JSON to YAML</a> and <a href="/yaml-to-json">YAML to JSON</a> converters handle it in one paste.</p>

<h2>TOML: the config format done right</h2>
<p>TOML was designed from scratch for configuration: obvious syntax, native dates, comments, no significant whitespace, and a spec small enough to implement correctly. It's why Cargo, Poetry, and Hugo adopted it. Its weakness is verbosity for deeply nested data and weaker ecosystem support in some languages, but for app settings, it's the best-designed option of the three.</p>

<h2>Quick comparison</h2>
<ul>
<li><strong>Comments:</strong> YAML ✓, TOML ✓, JSON ✗</li>
<li><strong>Trailing commas:</strong> all ✗ (JSON strictest about it)</li>
<li><strong>Human readability:</strong> TOML ≥ YAML &gt; JSON</li>
<li><strong>Machine universality:</strong> JSON &gt; YAML &gt; TOML</li>
<li><strong>Footguns:</strong> YAML (whitespace, type coercion) &gt; JSON (syntax strictness) &gt; TOML (fewest)</li>
</ul>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Can I convert my JSON config to YAML or TOML?</dt>
<dd>JSON to YAML is straightforward with our <a href="/json-to-yaml">converter</a>: the data model maps cleanly. TOML conversion is trickier because TOML's table structure doesn't map 1:1 to arbitrary JSON nesting; for complex configs, a manual rewrite is safer.</dd>
<dt>Why do so many tools still use YAML despite its problems?</dt>
<dd>Momentum and readability. Kubernetes, Ansible, and GitHub Actions standardized on YAML early, and the readability advantage for large manifests is genuine. The ecosystem isn't switching, so the pragmatic move is to learn YAML's sharp edges rather than fight it.</dd>
<dt>Is JSON5 a good middle ground?</dt>
<dd>JSON5 (comments, trailing commas, unquoted keys) fixes JSON's biggest config annoyances and is worth considering for greenfield projects where you control the parser. Adoption is the limitation: most tools expect strict JSON.</dd>
</dl>
</section>`,
  },
  {
    slug: "extract-audio-from-video-mp3-free",
    title: "How to Extract Audio from Video (MP4 to MP3): Free, No Software",
    seoTitle: "Extract Audio from Video: MP4 to MP3 Free",
    excerpt: "Need just the audio from a video? Pull out MP3 audio from any MP4 in seconds, right in your browser: lectures, music, podcasts, voice memos.",
    author: "Be",
    publishedAt: "2026-10-08",
    readingTime: 5,
    category: "Video",
    tags: ["MP4 to MP3", "Audio Extraction", "Video Tools", "Podcast"],
    content: `<h2>Why extract audio instead of converting whole files</h2>
<p>Maybe it's a lecture you want to listen to on a walk, a song from a video, or audio you need to edit separately. Whatever the reason, you don't need desktop software or sketchy "free converter" sites plastered with download buttons. Your browser can already do this. The audio track inside an MP4 is usually already MP3 or AAC, so extraction is fast and lossless.</p>

<h2>The 3-step process</h2>
<p><strong>1.</strong> Open our <a href="/mp4-to-mp3">MP4 to MP3 converter</a> and drop in your video file. Everything happens locally. Your video is never uploaded anywhere, which matters for personal recordings.</p>
<p><strong>2.</strong> The tool reads the file, extracts the audio stream, and encodes it as MP3. For a typical 5-minute video this takes a few seconds.</p>
<p><strong>3.</strong> Download the MP3. Done. Play it anywhere: phone, car, audio editor.</p>

<h2>What about quality?</h2>
<p>Here's the good news: when the source video already contains MP3 or AAC audio (which covers the vast majority of MP4s from phones, cameras, and screen recorders), extraction doesn't re-encode. It copies the original audio stream untouched. Zero quality loss, and it's nearly instant. If the source uses an unusual codec, the tool re-encodes to MP3 at a high bitrate, which is audibly transparent for speech and music alike.</p>

<h2>Handy follow-ups</h2>
<ul>
<li>Long lecture with silence? Run the MP3 through our <a href="/remove-silence-from-audio">silence remover</a> to tighten it up.</li>
<li>Only need one part? <a href="/mp3-cutter">Cut the MP3</a> to the exact segment.</li>
<li>Combining several clips? <a href="/mp3-merger">Merge MP3s</a> into one file.</li>
<li>Audio too quiet? Try the <a href="/mp3-volume-booster">volume booster</a>.</li>
</ul>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Is there a file size limit?</dt>
<dd>No hard limit, but very large videos (multi-GB) need enough RAM in your browser tab. For typical phone videos and screen recordings up to a few hundred MB, it works smoothly.</dd>
<dt>Will the MP3 work in my car / phone / editor?</dt>
<dd>Yes. MP3 is the most universally compatible audio format ever made. If a device plays audio at all, it plays MP3.</dd>
<dt>Can I extract audio from YouTube videos or DVDs?</dt>
<dd>Our tool works on video <em>files</em> you have: MP4, MOV, MKV, WebM. It can't download from streaming sites or rip copy-protected DVDs; that's a different (and legally murkier) problem.</dd>
</dl>
</section>`,
  },
  {
    slug: "favicon-guide-sizes-formats-how-to-make",
    title: "Favicon Guide 2026: Sizes, Formats, and How to Make One That Looks Sharp",
    seoTitle: "Favicon Guide: Sizes, Formats & Creation",
    excerpt: "That tiny icon in the browser tab matters more than you think. Every size you need, which formats still matter, and how to generate them free.",
    author: "Be",
    publishedAt: "2026-10-15",
    readingTime: 6,
    category: "Image",
    tags: ["Favicon", "Web Design", "ICO", "PNG", "Branding"],
    content: `<h2>The 16-pixel first impression</h2>
<p>Favicons are the smallest branding surface you own (16×16 pixels in a browser tab) and one of the most visible. Users identify your site among 30 open tabs by that tiny square. A missing or blurry favicon quietly signals "unfinished". The good news: getting it right takes about two minutes.</p>

<h2>Which sizes do you actually need in 2026?</h2>
<ul>
<li><strong>16×16 and 32×32</strong>, browser tabs and bookmarks (inside the .ico file)</li>
<li><strong>48×48</strong>, Windows taskbar shortcuts (inside the .ico file)</li>
<li><strong>180×180</strong>, Apple touch icon for iOS home screen</li>
<li><strong>192×192 and 512×512</strong>, Android / PWA manifest icons</li>
<li><strong>SVG</strong> (optional but nice), infinitely sharp in modern browsers with one tiny file</li>
</ul>
<p>The classic <code>favicon.ico</code> is actually a container holding 16, 32, and 48px versions. Browsers pick the right one. Our <a href="/favicon-generator">Favicon Generator</a> builds the proper multi-size ICO plus all the PNGs from a single source image.</p>

<h2>Start from the right source image</h2>
<p>This is where most favicons fail. Don't shrink your full detailed logo. At 16px it becomes mud. Instead:</p>
<ul>
<li>Use a <strong>simplified mark</strong>: just the icon part of your logo, or even a single letter on a brand-colour background</li>
<li>Start from a <strong>512×512 or larger</strong> square PNG with the mark centred and padded (keep ~15% margin so it doesn't touch the edges)</li>
<li>Design at small size mentally: bold shapes, high contrast, no thin lines or small text</li>
</ul>
<p>Test at 16px early and often. If it's not readable there, simplify further.</p>

<h2>Dark mode tabs: the gotcha</h2>
<p>Browser chrome now follows system dark mode, so a dark favicon on a dark tab background vanishes. Two fixes: add a subtle light background or rounded square behind your mark, or provide a <code>prefers-color-scheme</code>-aware SVG favicon. At minimum, preview your favicon against both light and dark tab bars before shipping.</p>

<h2>Generate yours in one go</h2>
<p>Upload your source image to our <a href="/favicon-generator">Favicon Generator</a>. It produces the multi-size ICO, all PNG sizes, and a live preview at real tab sizes. Download individually or grab everything as a ZIP, drop the files in your site root, and add the link tags. Two minutes, done properly.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Is ICO still necessary, or is PNG enough?</dt>
<dd>ICO is still the safest default. Every browser supports it, including older ones, and it bundles multiple sizes in one request. Serve PNG sizes alongside for mobile/PWA. Belt and suspenders, negligible cost.</dd>
<dt>Why does my favicon look blurry?</dt>
<dd>Almost always one of two causes: you upscaled a small source image (start from 512px+), or the browser is stretching your 16px icon to 32px on a retina display (ship the multi-size ICO so it picks correctly).</dd>
<dt>How do I add the favicon to my site?</dt>
<dd>Place <code>favicon.ico</code> in your site root (browsers check there automatically) and add <code>&lt;link rel="icon"&gt;</code> tags for the PNG sizes plus <code>apple-touch-icon</code>. If you're on Next.js, the <code>app/icon.png</code> convention handles most of this for you.</dd>
</dl>
</section>`,
  },
];
