import type { BlogPost } from "@/lib/blog";

export const batch21: BlogPost[] = [
  {
    slug: "compress-images-wordpress-without-plugin",
    title: "How to Compress Images for WordPress Without a Plugin",
    seoTitle: "How to Compress Images for WordPress Without a Plugin",
    excerpt:
      "You do not need an image plugin to run a fast WordPress site. Compress and resize every image before you upload it, convert photos to WebP, and let WordPress handle the rest. This guide covers the four step workflow, the sizes to aim for, and the mistakes that undo the work.",
    author: "Wahaj Ansari",
    publishedAt: "2026-11-08",
    readingTime: 11,
    category: "Image",
    tags: ["WordPress", "Image Optimization", "WebP", "Image Compression", "Web Performance", "SEO"],
    content: `<p>The short answer: compress and resize every image before you upload it, and WordPress needs no plugin to serve it fast. Crop out what the reader does not need, resize the image to the width it will actually display at, save photographs as WebP at quality 80, and upload that finished file. WordPress then generates the smaller copies and the responsive markup itself. A phone photo that starts at 4 MB lands in your media library at around 130 KB, and no monthly credit limit or plugin update can take that away.</p>
<p>This guide covers the whole no-plugin workflow: what WordPress already does for you, the four steps to run before every upload, the sizes and quality settings that work, the double compression trap that quietly degrades your images, what to do with the images already sitting in your library, and the honest point where a plugin becomes the right call after all. Every step uses free browser tools, including our own <a href="/image-compressor">Image Compressor</a>, <a href="/image-resizer">Image Resizer</a>, and <a href="/image-converter/jpg-to-webp">JPG to WebP converter</a>, which run entirely in your browser with no upload and no account.</p>

<h2>What WordPress already does for you, and what it does not</h2>
<p>Half the confusion about WordPress image optimisation comes from not knowing where core stops and plugins begin. WordPress does a fair amount on its own, and it does it whether or not you install anything. It also leaves three important jobs undone, and those are the jobs this guide covers.</p>
<table>
<tr><th>WordPress does this automatically</th><th>WordPress does not do this</th></tr>
<tr><td>Generates smaller copies of every upload: thumbnail 150 by 150, medium 300 by 300, and large 1024 by 1024 pixels</td><td>Compress the original file you upload. It is stored exactly as you sent it, at full size</td></tr>
<tr><td>Adds srcset markup so browsers pick a smaller copy on small screens</td><td>Convert your JPEGs or PNGs to WebP. Uploading a JPEG means serving a JPEG</td></tr>
<tr><td>Lazy loads images below the fold, so they only download when the reader scrolls near them</td><td>Strip EXIF metadata, including location, from the original file</td></tr>
<tr><td>Accepts WebP uploads natively since version 5.8, and generates WebP thumbnails from a WebP source</td><td>Resize an image to the width your theme actually displays. A 4000 pixel upload stays 4000 pixels in the library</td></tr>
<tr><td>Let you scale a single image down in the built-in media editor</td><td>Fix a whole library of oversized images at once. That is a one by one job without a plugin</td></tr>
</table>
<p>The important row is the first one on the right. WordPress keeps your original file untouched. The resized copies it generates are made at quality 82, but the original stays in the library at whatever size and quality you uploaded. On a large screen, the browser can still be served that original through srcset, because srcset offers the full size image as its largest option. So uploading a 4 MB phone photo and trusting WordPress to sort it out leaves a 4 MB file one click away from every visitor. The fix is to never give WordPress a 4 MB file in the first place.</p>
<p>The same logic applies to metadata. The resized copies WordPress generates lose most EXIF data in the re-encode, but the original keeps it, including the GPS location a phone embeds in every photo. If you share or sell the full size original anywhere, the location goes with it. Our <a href="/blog/remove-exif-metadata-photos-before-sharing">guide to removing EXIF data before sharing</a> explains what is at stake and how to check a file before it goes live.</p>

<h2>The 4-step workflow before every upload</h2>
<p>Run these four steps in this order, on every image, before it touches your media library. The whole thing takes about a minute per image once it becomes a habit, and it replaces everything a compression plugin does for new uploads.</p>
<p><strong>Step 1: crop first.</strong> Cut out the empty space, the photobombing stranger, and the half of the screenshot nobody needs. Cropping is the only step that removes pixels entirely, and it makes every later step cheaper. Our <a href="/image-cropper">Image Cropper</a> shows the live pixel dimensions as you drag, so you can see exactly what you are keeping. Crop before you resize, because resizing first and cropping second means you resized pixels you were about to throw away.</p>
<p><strong>Step 2: resize to the display width.</strong> An image displayed at 700 pixels wide does not need to be 4000 pixels wide, and no format choice fixes that. Resize to the width your theme actually shows, allowing double for retina screens, so a 700 pixel slot gets a 1400 pixel image at most. The widths below cover nearly every WordPress layout. Our <a href="/image-resizer">Image Resizer</a> takes exact pixel dimensions or a percentage, keeps the aspect ratio locked, and downloads as PNG, JPEG, or WebP.</p>
<table>
<tr><th>Where the image appears</th><th>Resize to</th><th>Target file size</th></tr>
<tr><td>Full width hero or banner</td><td>2000 pixels wide</td><td>Under 200 KB</td></tr>
<tr><td>In-post or in-page photo</td><td>1200 pixels wide</td><td>Under 100 KB</td></tr>
<tr><td>Blog featured image or card thumbnail</td><td>1200 pixels wide</td><td>Under 100 KB</td></tr>
<tr><td>Headshot, author photo, or sidebar image</td><td>600 pixels wide</td><td>Under 50 KB</td></tr>
<tr><td>Icon or small badge</td><td>200 pixels wide</td><td>Under 20 KB</td></tr>
</table>
<p><strong>Step 3: pick the right format.</strong> Photographs become WebP. Screenshots, diagrams, and text graphics become lossless WebP or PNG. Logos and icons become SVG where the theme allows it, and PNG where it does not. The format table in the next section gives the full rule. Converting is one step in our <a href="/image-converter/jpg-to-webp">JPG to WebP</a> and <a href="/image-converter/png-to-webp">PNG to WebP</a> converters, which run in the browser with no upload.</p>
<p><strong>Step 4: compress at quality 80.</strong> For photographs, quality 80 is the working starting point across the guides and benchmarks: visually identical to the original for almost every web photo, and dramatically smaller. Our <a href="/image-compressor">Image Compressor</a> has a quality slider from 1 to 100, a format choice, and a max-dimension setting, and it shows the original size against the compressed size with the saving percentage, so you can see the result before you download. Try quality 70 on the same photo as well: if you cannot see a difference at full size, use 70 and keep the saving. If you can, go back to 80. Lower the quality until the difference becomes visible, then step back up one notch.</p>
<p>A worked example, with the assumptions stated. Take a typical phone photo: 4032 by 3024 pixels, saved as a JPEG, about 3.8 MB straight from the camera. Resize it to 1200 pixels wide and the pixel count falls to about 9 percent of the original, because 1200 by 900 is 1,080,000 pixels against 12,192,768. Save that as a JPEG at quality 80 and it lands around 150 to 200 KB. Save it as WebP at quality 80 instead and it lands around 100 to 140 KB, because WebP runs 25 to 35 percent smaller than JPEG at equivalent quality. The same photo, three versions: 3.8 MB, about 180 KB, about 120 KB. The only difference between them is four minutes of work before upload.</p>
<p>Scale that across a post. Eight phone photos at 3.8 MB each is about 30 MB of images on one page. Run the workflow on all eight and the page carries about 1 MB of images instead. That is the difference between a page that loads in seconds on a phone connection and one that makes readers leave before the first image appears. Our <a href="/blog/compress-images-web-without-losing-quality">guide to compressing images for the web without losing quality</a> covers the same workflow for non-WordPress sites, with the quality settings and the lossy versus lossless trade-off in more depth.</p>

<h2>The double compression trap</h2>
<p>The one mistake that quietly undoes this workflow is compressing twice at high strength. WordPress generates its thumbnail, medium, and large copies by re-encoding your upload at quality 82. If you upload a JPEG already compressed hard at quality 60, WordPress re-encodes that quality 60 image again at 82, and the second lossy pass adds artefacts on top of the first. The result looks worse than either pass on its own, and the file is barely smaller than if you had uploaded a cleaner original.</p>
<p>The fix is to pre-compress gently. Compress at quality 78 to 80 before upload, and the quality 82 re-encode WordPress applies to its copies barely touches the image, because 82 is close to the quality you already chose. The copies come out clean and the original you uploaded stays clean too. Two rules follow from this. First, always upload the best version you have, not an already compressed copy downloaded from somewhere else, because every re-encode stacks artefacts. Second, never let two tools compress the same image at low quality: if a plugin or a host is already compressing on upload, turn your pre-compression down or off, because the second pass is where the damage happens.</p>
<p>There is a related trap in the other direction. Quality 100 in lossy mode is not lossless, and it can produce a file larger than the PNG it replaced. If you want exact pixels, choose lossless explicitly, and check the converted file size against the original every time. Tiny or already heavily optimised images sometimes come out larger as WebP. When that happens, keep the original format for that image.</p>

<h2>Which format for which image</h2>
<p>Format choice is the step people overthink. The rule is short: photographs are WebP, graphics with sharp edges are lossless WebP or PNG, and logos are SVG when the theme allows it.</p>
<table>
<tr><th>Image type</th><th>Use this</th><th>Why</th></tr>
<tr><td>Photographs, product shots, hero images</td><td>WebP, lossy, quality 80</td><td>25 to 35 percent smaller than JPEG at the same visible quality, supported by about 97 percent of browsers</td></tr>
<tr><td>Screenshots, diagrams, charts, text graphics</td><td>WebP lossless, or PNG</td><td>Lossy compression smears sharp edges and text. Lossless keeps every pixel exact</td></tr>
<tr><td>Logos and icons with transparency</td><td>SVG, or lossless WebP</td><td>SVG scales to any size with no pixels at all. Lossy alpha can halo around cutouts on dark backgrounds</td></tr>
<tr><td>Images with transparency where SVG is not an option</td><td>WebP lossless, or PNG</td><td>Both keep the alpha channel. WebP is smaller</td></tr>
<tr><td>Social sharing image and email images</td><td>JPEG</td><td>Social platforms and email clients are the two places WebP support is still unreliable. Keep these as JPEG</td></tr>
</table>
<p>Two notes on WebP. First, WordPress has accepted WebP uploads since version 5.8, released in July 2021, so any maintained site takes them. About 97 percent of browsers support WebP, and the ones that do not are Internet Explorer and very old Safari versions. Second, WordPress does not convert your existing JPEGs to WebP on its own. Uploading a WebP is the only way a WebP gets into the library without a plugin. If you are migrating a whole site to WebP rather than handling new uploads, our <a href="/blog/switch-website-to-webp-migration-checklist">WebP migration checklist</a> covers the audit, the fallback code, and the phased rollout. AVIF compresses better still, roughly 40 to 50 percent smaller than JPEG, but WordPress only added experimental AVIF support in version 6.5, and encoding is much slower. Ship WebP now and revisit AVIF later; our <a href="/blog/avif-vs-jpeg-xl-2026">AVIF versus JPEG XL guide</a> has the full comparison.</p>
<p>File names deserve one line. Rename the file before you upload it, because WordPress keeps the file name you give it and uses it in the URL. A name such as red-chair-office.webp tells search engines and readers what the image is. A name such as IMG_4821.webp tells them nothing, and you cannot fix it later without re-uploading.</p>

<h2>What about the images already in your media library?</h2>
<p>The workflow above covers new uploads. It does nothing for the hundreds of oversized images already in your library, and that is the honest weakness of the no-plugin approach. Without a plugin there is no bulk fix, but there are two manual routes, and for most small sites they are enough.</p>
<p><strong>Route one: scale inside WordPress.</strong> Open any image in the media library, click Edit Image, and use Scale Image to reduce it to your target width. WordPress creates the smaller version from the original. This works one image at a time and it only scales, it does not change the format or compress beyond the quality 82 re-encode. Use it for the handful of images that matter most: the homepage hero, the most visited posts, the images above the fold.</p>
<p><strong>Route two: download, optimise, re-upload.</strong> Download the original from the media library, run it through the four step workflow, upload the finished file as a new image, and swap it into the post. This gives you the full saving, including the WebP conversion, but it means editing every post that uses the image, because the new upload has a new URL and WordPress does not replace the old file in place. Prioritise by traffic: fix the images on your five most visited pages first, then work down the list. A site with 50 images can clear the backlog in an afternoon. A site with 5,000 images cannot, and that is the point where the next section applies.</p>
<p>One thing not to do: delete the original from the library to save disk space. The original is the only copy you have at full quality, and it is what you need if a conversion goes wrong or you want to re-encode at a different quality later. Storage is cheap. Regret is not.</p>

<h2>When a plugin is actually the right call</h2>
<p>No-plugin is a workflow, not a religion. There are three situations where a plugin earns its place, and the honest version of this guide names them instead of pretending the manual route fits everyone.</p>
<p><strong>A large backlog.</strong> If your library holds thousands of unoptimised images, the manual routes above would take weeks. A bulk optimisation plugin processes the whole library in one run. That is the job plugins exist for.</p>
<p><strong>Other people upload images.</strong> If clients, contributors, or a team upload to the site, they will not follow your workflow. A plugin that compresses on upload protects the site from the 8 MB phone photo somebody uploads at midnight.</p>
<p><strong>You need a CDN or adaptive serving.</strong> Some plugins serve different sizes per device or convert at the edge. That is a different feature from compression, and the manual workflow cannot replicate it.</p>
<p>If none of those apply, the free tiers below show why paying for compression makes little sense. Every one of these plugins does on its own servers, for a monthly fee or a credit limit, what the four step workflow does in your browser for free before upload.</p>
<table>
<tr><th>Plugin</th><th>Free tier</th><th>The catch</th></tr>
<tr><td>ShortPixel</td><td>100 images a month free</td><td>After 100 images you pay per credit. A single month of phone photos can use the whole allowance</td></tr>
<tr><td>Imagify</td><td>20 MB a month free</td><td>About ten photos from a modern phone. The allowance is gone before the month is</td></tr>
<tr><td>Smush free</td><td>Unlimited lossless compression</td><td>Lossless only, 5 MB maximum per image, and lossy compression needs the paid version</td></tr>
<tr><td>Compress before upload</td><td>Unlimited, no account</td><td>Manual work per image, and no bulk fix for an existing library</td></tr>
</table>
<p>If you do install a plugin later, keep the workflow anyway. Pre-compressed uploads mean the plugin has almost nothing to do, its credits last longer, and the double compression trap never triggers because the plugin is not re-compressing an already clean file.</p>

<h2>How to check it worked</h2>
<p>Take a baseline before you change anything, or the improvement is a feeling rather than a fact. Run PageSpeed Insights on your five most visited pages and record the performance score, the largest contentful paint time, the total page weight, and the total image bytes. Then optimise the images on those five pages and run the same test again. Published migrations report largest contentful paint falling by about a third when image weight drops, for example from 3.1 seconds to 2.1 seconds in one case study, but your number depends on how much of your page weight was images in the first place.</p>
<p>Check two things on the retest. First, the image bytes number should fall by roughly the same proportion as your file savings: if you cut the images on a page from 30 MB to 1 MB, the page weight should fall by nearly 29 MB. If it does not, an unoptimised image is still hiding on the page, often a logo, a background image set in CSS, or an image served by a widget. Second, open the page on a phone and look at the images. If a photo looks soft or blocky, the quality went too low or the image was compressed twice. Re-upload it at quality 80 from the original and the problem goes away.</p>
<p>Keep the habit going with a simple rule: no image enters the media library until it has been through the four steps. The rule is easier to keep than the backlog is to fix, and it is the whole advantage of the no-plugin approach. The optimisation happens once, before upload, instead of every month on a plugin subscription.</p>

<section>
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Does WordPress compress images automatically?</dt>
<dd>Not the original file. WordPress stores your upload exactly as you sent it, and generates smaller copies at quality 82 for its thumbnail, medium, and large sizes. It also adds srcset markup and lazy loads images below the fold. But the original stays full size in the library, and browsers on large screens can still be served it. Compression of the original has to happen before upload, which is what this guide covers.</dd>
<dt>Will compressing before upload hurt image quality?</dt>
<dd>Not if you compress gently. Quality 80 for photographs is visually identical to the original for almost every web photo, and WordPress re-encodes its copies at quality 82, which is close enough to 80 that the second pass barely touches the image. Quality falls apart when an image is compressed twice at low quality, for example a quality 60 upload re-encoded again, or when a lossy JPEG is converted to WebP and back. Compress once, at 78 to 80, from the best original you have, and check the result at full size before you upload it.</dd>
<dt>What size should images be for WordPress?</dt>
<dd>Match the width the image will actually display at, allowing double for retina screens. Full width heroes get 2000 pixels, in-post photos and featured images get 1200 pixels, headshots and sidebar images get 600 pixels, and icons get 200 pixels. Then aim for under 200 KB for a hero, under 100 KB for an in-post photo, and under 50 KB for a thumbnail. An image displayed at 700 pixels wide never needs to be 4000 pixels wide.</dd>
<dt>Can I upload WebP to WordPress?</dt>
<dd>Yes. WordPress has accepted WebP uploads natively since version 5.8, released in July 2021, and about 97 percent of browsers support WebP. Upload the WebP file directly and WordPress stores it, generates WebP thumbnails from it, and serves it like any other image. What WordPress does not do is convert your existing JPEGs to WebP. Converting the old library takes a plugin or the manual download, convert, and re-upload route.</dd>
<dt>How do I compress images already uploaded to WordPress without a plugin?</dt>
<dd>Two manual routes. Open the image in the media library and use Edit Image, then Scale Image, to reduce it to your target width. That works one image at a time and only scales, it does not change the format. Or download the original, run it through the crop, resize, format, and compress steps, upload the finished file as a new image, and swap it into the post. Start with the images on your five most visited pages. A library of thousands of images is the one case where a bulk optimisation plugin is genuinely faster.</dd>
<dt>Do I still need an image optimisation plugin at all?</dt>
<dd>For most small sites, no. If every new image is compressed and resized before upload, a plugin has almost nothing left to do, and the free tiers show the economics: ShortPixel gives 100 images a month free, Imagify gives 20 MB a month, and the free version of Smush only does lossless compression with a 5 MB per image cap. A plugin earns its place when the library is large, when other people upload images, or when you need CDN or adaptive serving. Otherwise the browser workflow in this guide does the same job for free, with no credits and no subscription.</dd>
</dl>
</section>`,
  },
];
