import type { BlogPost } from "@/lib/blog";

export const batch2: BlogPost[] = [
  {
    slug: "pdf-tools-guide-merge-split-compress",
    title: "The Complete Guide to Working with PDFs Online",
    excerpt: "PDFs are everywhere — contracts, reports, invoices. Work with them efficiently without expensive software or complicated installs.",
    author: "BeYourTools Team",
    publishedAt: "2026-07-29",
    readingTime: 8,
    category: "PDF",
    tags: ["PDF", "Productivity", "Documents", "Free Tools"],
    content: `<h2>Merging PDFs</h2>
<p>When you have several related documents — a cover letter, a resume, and supporting certificates, for example — combining them into one file makes sharing easier. Our <a href="/pdf-tools/merge-pdf">PDF Merge</a> tool lets you drag in multiple PDFs, reorder them, and download a single combined file. Nothing is uploaded to a server.</p>

<h2>Splitting PDFs</h2>
<p>Long documents are often more useful in smaller pieces. Our <a href="/pdf-tools/split-pdf">PDF Split</a> tool lets you define ranges like <code>1-5</code> or <code>6-10</code> and extract those pages as separate PDF files. You can also split into individual pages with a single click.</p>

<h2>Compressing PDFs</h2>
<p>Email attachments often have size limits and large PDFs get rejected. Our <a href="/pdf-tools/pdf-compressor">PDF Compressor</a> reduces file size by removing redundant internal data. Results vary depending on the source file — text-heavy PDFs typically compress noticeably; scanned image PDFs less so.</p>

<h2>Converting PDFs to images</h2>
<p>Sometimes you need an image of a PDF page — for a thumbnail, a preview, or a presentation slide. Our <a href="/pdf-tools/pdf-to-jpg">PDF to JPG</a> and <a href="/pdf-tools/pdf-to-png">PDF to PNG</a> tools render each page at high resolution directly in your browser.</p>

<h2>Protecting PDFs</h2>
<p>Before sharing sensitive documents, add password protection. Our <a href="/pdf-tools/protect-pdf">PDF Protect</a> tool encrypts the file so only people with the password can open it. The password is never transmitted anywhere.</p>

<h2>Adding watermarks</h2>
<p>Stamp "CONFIDENTIAL", "DRAFT", or your company name across every page with our <a href="/pdf-tools/pdf-watermark">PDF Watermark</a> tool. Useful for marking draft versions or deterring unauthorised sharing.</p>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>How do I merge PDF files for free?</dt>
<dd>Use our <a href="/pdf-tools/merge-pdf">free PDF Merge tool</a>. Upload your PDFs, drag to reorder them, and click Merge. No account or installation required.</dd>
<dt>Is it safe to process PDFs in a browser tool?</dt>
<dd>With BeYourTools, your files never leave your device. All PDF operations happen locally in your browser — nothing is sent to any server.</dd>
<dt>How much can I reduce a PDF's file size?</dt>
<dd>It depends on the source. Text-heavy PDFs often compress by 10–40%. PDFs made primarily from scanned images see less benefit without also recompressing the images themselves.</dd>
</dl>
</section>`,
  },
  {
    slug: "jwt-explained-what-developers-need-to-know",
    title: "JWTs Explained: What Every Developer Needs to Know",
    excerpt: "JSON Web Tokens are everywhere — authentication, API keys, session management. How they work, how to read them, and common security mistakes.",
    author: "BeYourTools Team",
    publishedAt: "2026-08-19",
    readingTime: 7,
    category: "JSON",
    tags: ["JWT", "Authentication", "Security", "APIs"],
    content: `<h2>What is a JWT?</h2>
<p>A JWT (JSON Web Token) is a compact, URL-safe string used to represent claims between two parties. It consists of three Base64URL-encoded sections separated by dots: a header, a payload, and a signature. The signature allows the receiver to verify that the contents haven't been tampered with.</p>

<h2>The three parts</h2>
<p><strong>Header</strong> — specifies the algorithm used to sign the token and the token type.</p>
<p><strong>Payload</strong> — contains claims: facts about the user and session, such as user ID, roles, and expiry time.</p>
<p><strong>Signature</strong> — a cryptographic hash of the header and payload that proves the token hasn't been modified.</p>

<h2>Common claims</h2>
<p>The payload typically includes: <code>sub</code> (the subject — usually a user ID), <code>iat</code> (issued at), <code>exp</code> (expiry timestamp), <code>iss</code> (issuer), and <code>aud</code> (intended audience).</p>

<h2>Decoding vs verifying</h2>
<p>Anyone can decode a JWT — the payload is only encoded, not encrypted. Use our <a href="/jwt-decoder">JWT Decoder</a> to inspect the header and payload of any token during development. Verification (checking the signature) requires the secret key and happens on your server.</p>

<h2>Common security mistakes to avoid</h2>
<ul>
<li>Never accept tokens with <code>"alg": "none"</code> — this disables signature verification entirely</li>
<li>Store tokens in httpOnly cookies, not browser localStorage (which is vulnerable to cross-site scripting)</li>
<li>Always validate the <code>exp</code> claim — expired tokens should be rejected</li>
<li>Never put passwords or sensitive personal data in the payload — it can be read by anyone who has the token</li>
</ul>

<section class="faq">
<h2>Frequently Asked Questions</h2>
<dl>
<dt>How do I inspect a JWT without writing code?</dt>
<dd>Paste the token into our <a href="/jwt-decoder">JWT Decoder</a>. It splits the token into its three sections, decodes each one, and shows the full payload including all claims and the expiry time.</dd>
<dt>Is the JWT payload encrypted?</dt>
<dd>No — the payload is Base64URL-encoded, which anyone can decode. Never store passwords, credit card numbers, or other sensitive data in a JWT payload.</dd>
<dt>What is the difference between a JWT and an API key?</dt>
<dd>An API key is an opaque string — the server must look it up in a database to know what permissions it grants. A JWT is self-contained — the server can verify it and read the permissions from the payload without a database lookup.</dd>
</dl>
</section>`,
  },
];
