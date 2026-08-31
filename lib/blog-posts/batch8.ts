import type { BlogPost } from "@/lib/blog";

export const batch8: BlogPost[] = [
  {
    slug: "base64-encode-decode-guide",
    title: "Base64 Encoding and Decoding: A Developer's Reference",
    excerpt: "Base64 appears in authentication headers, data URLs, email attachments, and API tokens. Here's exactly what it is and how to use it.",
    author: "BeYourTools Team",
    publishedAt: "2027-05-12",
    readingTime: 6,
    category: "JSON",
    tags: ["Base64", "Encoding", "APIs", "Security"],
    content: `<h2>What is Base64?</h2>
<p>Base64 is a way to represent binary data using only printable text characters. It converts any sequence of bytes into a string made up of 64 safe characters: the uppercase and lowercase letters A–Z, the digits 0–9, and the symbols <code>+</code> and <code>/</code>. A <code>=</code> character is used for padding at the end when needed.</p>

<p>It's important to understand that Base64 is <strong>encoding, not encryption</strong>. Anyone with the encoded string can decode it instantly. It's used to safely carry binary data through systems that only handle text - not to protect data.</p>

<h2>Where you'll encounter Base64</h2>
<ul>
<li><strong>Data URLs</strong> - images embedded directly in HTML or CSS as <code>data:image/png;base64,iVBOR...</code></li>
<li><strong>Basic Authentication</strong> - HTTP headers carry <code>username:password</code> encoded as <code>Authorization: Basic dXNlcjpwYXNz</code></li>
<li><strong>JWT tokens</strong> - the header and payload sections of a JWT are Base64URL-encoded (a variant that uses <code>-</code> and <code>_</code> instead of <code>+</code> and <code>/</code>)</li>
<li><strong>Email attachments</strong> - the MIME standard uses Base64 to encode binary file attachments in email messages</li>
<li><strong>Binary data in JSON</strong> - when you need to include image or file data inside a JSON payload</li>
</ul>

<h2>Encode and decode instantly</h2>
<p>Use our <a href="/base64">Base64 Encode/Decode</a> tool for quick conversions. It handles Unicode text including emoji and international characters correctly.</p>

<h2>Base64 and JWTs</h2>
<p>JWT tokens use Base64URL encoding - a slightly modified version of standard Base64 that's safe for use in URLs and HTTP headers. Our <a href="/jwt-decoder">JWT Decoder</a> handles this variant correctly and shows you the full decoded payload including all claims and timestamps.</p>

<h2>Why Base64 makes data larger</h2>
<p>Base64 encodes every 3 bytes of input as 4 text characters. This results in approximately 33% larger output than the original binary. This size increase is the trade-off for making binary data safe to transmit in text-only contexts.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Is Base64 the same as encryption?</dt>
<dd>No. Base64 is encoding - it converts between binary and text representations with no security. Anyone can decode a Base64 string in seconds. Never use Base64 to protect sensitive data; use proper encryption instead.</dd>
<dt>Why does Base64 end with == sometimes?</dt>
<dd>Base64 processes input in groups of 3 bytes. When the input length isn't divisible by 3, padding characters (<code>=</code> or <code>==</code>) are added to complete the final group. This is normal and expected.</dd>
<dt>What is the difference between Base64 and Base64URL?</dt>
<dd>Base64URL replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code>, making the output safe for use in URLs and HTTP headers without percent-encoding. JWTs use Base64URL. Our <a href="/jwt-decoder">JWT Decoder</a> handles Base64URL automatically.</dd>
</dl>
</section>`,
  },
  {
    slug: "jpg-to-webp-migration-guide",
    title: "JPG to WebP Migration: A Step-by-Step Guide for Websites",
    excerpt: "Migrating from JPG to WebP is one of the highest-impact performance improvements available. Here's how to do it systematically.",
    author: "BeYourTools Team",
    publishedAt: "2028-05-11",
    readingTime: 6,
    category: "Image",
    tags: ["JPG", "WebP", "Migration", "Web Performance", "SEO"],
    content: `<h2>Why migrate to WebP?</h2>
<p>WebP files are 25–35% smaller than equivalent JPG files. Smaller images mean faster page loads, better Core Web Vitals scores, and improved search rankings. For a site with dozens or hundreds of images, the cumulative effect on both performance and bandwidth costs is significant.</p>

<h2>Step 1: Identify which images to convert</h2>
<p>Focus first on images that appear above the fold - particularly hero images and any large image that loads immediately when the page opens. These have the greatest impact on perceived load time and on Google's Largest Contentful Paint (LCP) metric.</p>

<h2>Step 2: Convert each JPG to WebP</h2>
<p>Use our <a href="/image-converter/jpg-to-webp">JPG to WebP converter</a> for individual images or small batches. Quality 80–85 produces results visually indistinguishable from the original for most photographic content. Compare the before and after to make sure you're happy with the quality before replacing originals.</p>

<h2>Step 3: Provide a fallback during transition</h2>
<p>Use the HTML <code>&lt;picture&gt;</code> element to serve WebP to supporting browsers and JPG to everything else:</p>
<pre><code>&lt;picture&gt;
  &lt;source type="image/webp" srcset="photo.webp"&gt;
  &lt;img src="photo.jpg" alt="Description"&gt;
&lt;/picture&gt;</code></pre>

<h2>Step 4: Update your references</h2>
<p>Replace direct image references in your HTML, CSS, and CMS with the new WebP versions. If you use a content management system, update the media library entries.</p>

<h2>Step 5: Measure the improvement</h2>
<p>Run a Core Web Vitals check before and after the migration to confirm the improvement. LCP is typically the metric that benefits most from image format optimisation.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Will switching to WebP affect my search rankings?</dt>
<dd>Positively. Smaller images improve Core Web Vitals - particularly LCP - which is a confirmed Google ranking factor. The effect is most pronounced on image-heavy pages where images are the main content.</dd>
<dt>Do I need to keep the original JPG files?</dt>
<dd>Yes. Keep your originals. If you ever need to convert to a different format or the WebP conversion needs to be redone at a different quality setting, you want to start from the original rather than re-encoding an already-compressed file.</dd>
<dt>Can I use WebP for all images on my site?</dt>
<dd>For web images, yes. WebP is supported by all browsers your visitors are likely using in 2026. The only exception is if you know your audience uses very old or non-standard browsers, or if images need to be downloaded and opened in desktop applications that don't support WebP.</dd>
</dl>
</section>`,
  },
];
