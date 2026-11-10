import type { BlogPost } from "@/lib/blog";

export const batch23: BlogPost[] = [
  {
    slug: "what-is-a-qr-code-how-to-make-one-that-scans",
    title: "What Is a QR Code and How to Make One That Still Scans",
    seoTitle: "What Is a QR Code and How to Make One That Still Scans",
    excerpt:
      "A QR code is a square pattern that stores text a phone camera can read in a fraction of a second. Here is what goes inside one, how error correction, size, and the quiet zone decide whether it scans, and how to make a code that works the first time it is printed.",
    author: "Wahaj Ansari",
    publishedAt: "2026-11-10",
    readingTime: 12,
    category: "Image",
    tags: ["QR Code", "QR Code Generator", "Barcode", "Print", "WiFi", "Scanning"],
    content: `<p>The short answer: a QR code is a square pattern of black and white modules that stores a piece of text, usually a web link, in a form a phone camera can read in a fraction of a second. Making one that still scans is a small set of choices, not luck. Keep the content short and point it at a stable page, pick error correction M for screens and Q for print, print it at least 2 cm wide for close reading, leave the blank border around it alone, keep the modules dark on a light background, and test the finished code on two phones at the real size and distance before you print a thousand copies. Get those six things right and the code scans the first time, on almost any phone, in almost any light.</p>
<p>This guide covers the whole picture. It explains what a QR code actually stores, how a phone reads one, what you can put inside it, how error correction and size really work with worked numbers, when a logo is safe, the difference between a static code and a dynamic one, and the testing checklist that catches the failures before your customers do. It also says plainly what our own generator does and does not do, so you can judge whether it fits the job.</p>

<h2>What a QR code actually is</h2>
<p>QR stands for Quick Response. The code was invented in 1994 by Masahiro Hara and his team at Denso Wave, a subsidiary of Toyota, to track car parts on a factory floor faster than a one dimensional barcode could. A traditional barcode stores data along a single horizontal line and holds only around 20 characters. A QR code stores data in two dimensions, across a grid of small black and white squares called modules, so it holds far more: up to 7,089 numeric characters, up to 4,296 alphanumeric characters, or up to 2,953 bytes of binary data, all at the largest size, version 40 with the lowest error correction level.</p>
<p>Versions run from 1 to 40. Version 1 is a 21 by 21 grid of modules, and each version adds 4 modules per side, up to version 40 at 177 by 177. The more data you encode, and the higher the error correction level you choose, the larger the version the code needs, and the denser and harder to scan it becomes at a small size. That trade off is the whole design problem of a QR code: enough data, enough redundancy, and still big enough for a camera to resolve every module.</p>
<p>Reading one needs no special app on a modern phone. iPhones have read QR codes from the built-in Camera app since iOS 11, and most Android phones have done the same from the camera app or Google Lens for several years. Point the camera, hold still for a second, and the phone offers the action: open the link, join the network, save the contact, or send the message. The code itself does nothing. It is only text, and the phone decides what the text means.</p>

<h2>How a phone reads one</h2>
<p>A QR code is not a random scatter of squares. It has a fixed anatomy, and every part has a job. The three large squares in the corners are finder patterns. The camera finds those first, and they tell it where the code is, how big it is, and which way up it sits, which is why a code scans from any angle, even upside down. Between the finders runs the timing pattern, an alternating row of modules that tells the reader how many rows and columns the grid has. Smaller alignment patterns scattered across larger codes correct for skew and curves, so a code on a slightly bent label still reads.</p>
<p>Around the data sits the format information, which records the error correction level and the mask pattern used, and the quiet zone, the blank border that frames the whole code. The data itself is stored as codewords, and interleaved with them are error correction codewords, extra data computed from the original by Reed-Solomon mathematics. If part of the code is dirty, scratched, or covered, the reader uses those extra codewords to rebuild the missing pieces, up to the limit of the level you chose. That is why a code with a coffee stain on it can still scan, and why a code with a logo in the middle can too, if the level is high enough.</p>

<h2>What you can put in a QR code</h2>
<p>A QR code stores text, and phones recognise certain text formats and offer the matching action. The formats below are the ones people actually use, with the exact text that goes inside the code.</p>
<table>
<tr><th>What you want</th><th>What goes in the code</th><th>What the phone does</th></tr>
<tr><td>Open a website</td><td>https://beyourtools.com/qr-code-generator</td><td>Opens the page in the browser</td></tr>
<tr><td>Plain text</td><td>Any short message</td><td>Shows the text on screen</td></tr>
<tr><td>Join a Wi-Fi network</td><td>WIFI:T:WPA;S:NetworkName;P:password;;</td><td>Offers to join the network without typing the password</td></tr>
<tr><td>Send an email</td><td>mailto:hello@example.com</td><td>Opens a new message to that address</td></tr>
<tr><td>Call a number</td><td>tel:+15551234567</td><td>Offers to dial the number</td></tr>
<tr><td>Send a text message</td><td>smsto:+15551234567:Hello</td><td>Opens a message with the text filled in</td></tr>
<tr><td>Share a contact</td><td>A vCard block starting BEGIN:VCARD</td><td>Offers to save the contact</td></tr>
<tr><td>Share a location</td><td>geo:37.7749,-122.4194</td><td>Opens the spot in a maps app</td></tr>
<tr><td>Share a calendar event</td><td>An ICS block starting BEGIN:VEVENT</td><td>Offers to add the event</td></tr>
</table>
<p>Two rules follow from the table. First, shorter content makes a less dense code, and a less dense code scans more easily at a small size, so use the shortest link that works and strip tracking parameters you do not need. Second, a Wi-Fi code contains the network password in plain text, readable by anyone who scans it or photographs it. That is convenient for a guest network and a bad idea for a network you want to keep private. The same warning applies to anything sensitive: a code is not a safe, it is a label, and anyone who can see it can read it.</p>

<h2>Error correction: the setting that decides whether a damaged code still scans</h2>
<p>Every QR code carries built-in redundancy, and the standard defines four levels. The level decides how much of the code can be destroyed and still recovered, and it also decides how dense the code becomes, because the redundancy takes up modules.</p>
<table>
<tr><th>Level</th><th>Damage it can recover from</th><th>Use it for</th></tr>
<tr><td>L, Low</td><td>About 7 percent</td><td>Clean screens only, where space is tight and the code will never be touched</td></tr>
<tr><td>M, Medium</td><td>About 15 percent</td><td>Most uses: screens, clean print, the default choice</td></tr>
<tr><td>Q, Quartile</td><td>About 25 percent</td><td>Print that will be handled, outdoor signs, matte or textured paper</td></tr>
<tr><td>H, High</td><td>About 30 percent</td><td>Codes with a logo in the middle, industrial labels, anything likely to be scratched</td></tr>
</table>
<p>A worked example makes the cost concrete. Take one typical short link and generate it at each level. At L and M it fits in version 3, a 29 by 29 grid. At Q it needs version 4, 33 by 33. At H it needs version 5, 37 by 37. Same link, same phone, but the H code has about 60 percent more modules than the L code, so each module is smaller at the same printed size, and the code needs to be printed larger to scan as easily. That is the trade: resilience costs size. The practical rule is to use M for anything shown on a screen or printed cleanly indoors, Q for print that will be handled or left outside, and H only when a logo overlaps the code or the surface is genuinely rough. Our <a href="/qr-code-generator">QR Code Generator</a> defaults to M and lets you pick any of the four levels.</p>

<h2>Size and distance: the one tenth rule</h2>
<p>A camera can only read a code if it can resolve every module, and the further away the camera is, the bigger each module has to be. The print world uses a simple rule of thumb for this: the code should be at least one tenth as wide as the distance it will be scanned from. It is a rule of thumb, not part of the standard, but it is the planning number most printers and guides agree on.</p>
<table>
<tr><th>Where the code goes</th><th>Typical scanning distance</th><th>Minimum code width</th></tr>
<tr><td>Business card or table card</td><td>About 30 cm</td><td>2 to 3 cm</td></tr>
<tr><td>Flyer or menu</td><td>About 50 cm</td><td>About 5 cm</td></tr>
<tr><td>A4 poster</td><td>About 1 m</td><td>About 10 cm</td></tr>
<tr><td>Shop window</td><td>About 3 m</td><td>About 30 cm</td></tr>
<tr><td>Billboard</td><td>About 10 m</td><td>About 1 m</td></tr>
</table>
<p>For close range scanning, about 2 cm square is the practical floor most guides cite, and 3 cm is safer because it leaves margin for bad angles and dim light. The module maths shows why going smaller fails. A 2 cm code at version 3 has 29 modules across, so each module is about 0.69 mm wide, and the required quiet zone of 4 modules adds about 2.8 mm of blank space on every side. Shrink that code to 1 cm and the modules are 0.35 mm, smaller than most phone cameras can resolve reliably at arm's length. A dense code, one holding a long URL at level H, needs to be bigger still, because it has more modules in the same width. If a code will not scan, making it bigger is the first fix to try, and it works more often than any other.</p>
<p>Print resolution matters as much as size. For raster print, the usual target is 300 DPI at the final printed size. A 2 cm code at 300 DPI needs about 236 pixels across, so a 256 pixel PNG is roughly right for a business card, and nothing more is needed. For a poster, export bigger: our generator offers print-size PNG downloads at 1024 pixels, which covers about 8.7 cm at 300 DPI, and 2048 pixels, which covers about 17.3 cm. For anything larger than that, use the SVG download instead. A vector file has no pixels to run out of, so it stays sharp at any size, from a business card to a billboard.</p>

<h2>Colour, contrast, and the quiet zone</h2>
<p>Scanners expect dark modules on a light background, and the standard aims for at least about 70 percent reflectance difference between the two. Black on white is ideal. Brand colours work if the foreground is much darker than the background, navy on cream for example, but pale colours on white, or two mid tones with little difference between them, will fail on some phones and in dim light. Inverted codes, light modules on a dark background, fail on some phones outright, because many readers assume dark on light, so do not invert a code to match a dark design. Never place a code on top of a busy photograph or a gradient either. The camera cannot tell where the code ends and the background begins.</p>
<p>The quiet zone is the empty border around the code, and it is not decoration. The standard requires at least 4 modules of clear space on all four sides, in the same light colour as the background, because the reader uses that empty frame to find the code edges. Our generator sets the margin to 4 modules by default and warns you to keep it there. Never crop the quiet zone off to save space, never let text, a border, or another graphic touch the code edge, and never print a code right up against the edge of a page. A code with no quiet zone often fails to scan at all, even when everything else is perfect.</p>

<h2>Putting a logo in the middle</h2>
<p>A logo in the centre of a QR code looks good and it costs reliability, because the logo covers data modules that the reader then has to reconstruct. The rule is simple: only do it at error correction level H, which can recover about 30 percent of the code, keep the logo small and centred, and never let it cover any of the three finder patterns in the corners. A logo that covers a finder pattern breaks scanning no matter what level you chose, because the camera cannot find the code in the first place.</p>
<p>Our <a href="/qr-code-generator-with-logo">QR Code Generator with Logo</a> enforces the safe version of this for you: the moment you add a logo, whether you upload your own or pick a social icon, it sets error correction to H automatically and tells you it has done so. That is the right default, but it is not a substitute for testing. Always scan the finished code with the logo in place, on two phones, at the size it will actually be printed, before you commit to a print run. A logo that looks fine on screen can still be too big once the code shrinks to business card size.</p>

<h2>Static versus dynamic: pick before you print</h2>
<table>
<tr><th></th><th>Static code</th><th>Dynamic code</th></tr>
<tr><td>What is stored</td><td>The content itself, baked into the pattern</td><td>A short redirect link managed by a service</td></tr>
<tr><td>Can the destination change after printing</td><td>No, it is fixed forever</td><td>Yes, the service can point the redirect somewhere else</td></tr>
<tr><td>Does it expire</td><td>No, it works as long as the content works</td><td>Yes, it stops if the service or subscription ends</td></tr>
<tr><td>Scan statistics</td><td>None</td><td>Usually included</td></tr>
<tr><td>Cost</td><td>Free, no account needed</td><td>Usually a paid subscription</td></tr>
<tr><td>Privacy</td><td>Nothing is tracked</td><td>Every scan passes through the service</td></tr>
</table>
<p>The choice is really about whether the destination might change. A code on a restaurant menu that points at a page you control, a business card, or a Wi-Fi password will never need to change, so a static code is the right answer: it costs nothing, needs no account, and cannot be switched off by a company going out of business. A code on packaging for a product page that gets redesigned every year, or a campaign where you need to count scans, is the case for a dynamic code, and then the subscription is the price of that flexibility. Our generator makes static codes only. It runs entirely in your browser, stores nothing, and tracks no scans, which is the honest trade: free and permanent, with no way to change the destination after the code is printed. So print a static code only when you are sure the destination is final, and double check the link before you print, because a typo in a static code is permanent too.</p>

<h2>Make one in about a minute</h2>
<p>Here is the whole workflow on this site, using the free generator. Nothing is uploaded and no account is needed.</p>
<p><strong>Step 1: pick the content type.</strong> Open the <a href="/qr-code-generator">QR Code Generator</a> and choose what the code should do: URL, text, email, phone, SMS, Wi-Fi, vCard, location, or a calendar event. For a Wi-Fi network, use the dedicated <a href="/wifi-qr-code-generator">WiFi QR Code Generator</a> instead, which builds the Wi-Fi format for you and handles hidden networks.</p>
<p><strong>Step 2: enter the content.</strong> Type or paste the final destination. For a website, use the full HTTPS link to the exact page, not the homepage and not a shortened link you do not control. Shorten the URL first if you can: fewer characters means a less dense code, and a less dense code scans more easily.</p>
<p><strong>Step 3: set the error correction.</strong> Open Customize and pick the level for where the code will live. M for screens and clean print, Q for print that will be handled, H if you are adding a logo. Leave the margin at 4 modules or more, because that is the quiet zone, and set the size to at least 256 pixels for a small print.</p>
<p><strong>Step 4: download the right file.</strong> Download PNG for a business card or flyer, or SVG if the code will be printed large or placed in a design file. For posters and packaging, use the print-size PNG at 1024 or 2048 pixels. If you need a logo, make the code in the <a href="/qr-code-generator-with-logo">logo generator</a> instead, which forces level H for you.</p>
<p><strong>Step 5: scan it before you print it.</strong> Point your phone camera at the code on screen first, then print one copy at the real size and scan that too. If you want a second opinion, upload a photo of the printed code to our <a href="/qr-code-scanner">QR Code Scanner</a> and check that it decodes to exactly the text you intended. Only then print the run.</p>

<h2>Test before you print: the checklist</h2>
<p>Most QR failures are found in five minutes of testing and cost nothing to fix then. The same failure found after a print run costs the whole run. Work through this list on the finished code, at the finished size, before you commit.</p>
<p>Scan it with at least two different phones, ideally one iPhone and one Android, because their cameras and decoding differ. Scan the printed copy, not just the screen, because print adds blur, dot gain, and paper texture that a screen never shows. Scan it from the distance people will actually stand at, not from six inches away. Scan it in the light it will live in, including the dim corner of the restaurant and the glare of the shop window. Scan it at a slight angle, the way a real person holds a phone, not dead straight. Check that the quiet zone is intact and that nothing touches the code edge. Confirm the destination opens the right page over HTTPS, and that the page works on a phone, because a code that opens a desktop-only page is a failure too. Finally, scuff the test copy a little, or cover a corner with a thumb, and scan it again: that is what error correction is for, and it is better to learn it works now than to hope it works later.</p>

<h2>QR code safety, in one paragraph each</h2>
<p><strong>Check before you open.</strong> A QR code is plain text, and a phone shows you the destination before it opens it. Read that preview every time, especially for codes in public places. Fake codes pasted over real ones on parking meters, restaurant tables, and posters, a trick sometimes called quishing, can point at a phishing page that looks exactly like the real one. If the preview URL looks wrong, or the code is a sticker stuck over a printed one, do not scan it.</p>
<p><strong>Do not encode secrets.</strong> Anyone who can see a code can read it, including anyone who photographs it. Never put a password, a private key, a session token, or personal data in a code unless the surrounding system specifically protects it. A Wi-Fi code is the common exception people accept knowingly: it hands the network password to anyone who scans it, so use it for a guest network, not for your main one.</p>
<p><strong>A code in a photo is still a code.</strong> If you share a photo of a parcel, a ticket, a whiteboard, or a desk, check whether a QR code or barcode is visible in the frame. A code in the background can be scanned straight out of the image, and it may carry a tracking number, a ticket, or a login link you did not mean to share. Our <a href="/blog/blur-hide-sensitive-details-photos-before-sharing">guide to blurring sensitive details in photos</a> covers how to cover one properly: a solid box, edge to edge, because error correction means a half covered code may still scan. And if the photo also carries location data, our <a href="/blog/remove-exif-metadata-photos-before-sharing">guide to removing EXIF data before sharing</a> covers that side of it.</p>

<section>
<h2>Frequently Asked Questions</h2>
<dl>
<dt>Do QR codes expire?</dt>
<dd>A static QR code never expires. It is only encoded text, so it works as long as the content it points to still works: the page is live, the Wi-Fi password is unchanged, the phone number is still yours. A dynamic code is different: it points at a redirect run by a service, and it stops working if that service shuts down or the subscription lapses. If you print a code on something meant to last, a static code is the safe choice, and it is the only kind our generator makes.</dd>
<dt>What is the smallest size a QR code can be printed?</dt>
<dd>About 2 cm square for close range scanning, and 3 cm is safer because it leaves margin for bad angles and dim light. That floor assumes a short link at a low or medium error correction level. A dense code, one holding a long URL at level H, needs to be bigger, because it has more modules in the same width. For anything scanned from further away, use the one tenth rule: the code should be at least a tenth as wide as the scanning distance, so 10 cm for a poster read from 1 metre and 30 cm for a window read from 3 metres.</dd>
<dt>Why will my QR code not scan?</dt>
<dd>Work through the usual causes in order. The quiet zone was cropped or something touches the code edge. The contrast is too low, or the code is inverted to light on dark. The code is too small for the distance, or too dense for its size because the content is long and the error correction is high. The print is low resolution or glossy enough to glare. Or a logo was added without raising the error correction to H. Fix the most likely one first, regenerate, and test the new code on two phones at the real size before printing again.</dd>
<dt>Can I put a logo in the middle of a QR code?</dt>
<dd>Yes, if you do it at error correction level H and keep the logo small and centred. Level H can recover about 30 percent of the code, so a modest logo is safe, but a large one is not, and a logo that covers any of the three finder patterns in the corners breaks scanning completely. Our logo generator sets level H automatically when you add a logo. Test the finished code at its printed size on two phones before you commit to a print run.</dd>
<dt>Should I choose a static or a dynamic QR code?</dt>
<dd>Choose static unless you have a specific reason to change the destination after printing. A static code stores the content directly, costs nothing, needs no account, never expires, and tracks nothing. A dynamic code stores a short redirect that a paid service manages, so you can change the destination and see scan counts, but it stops working if the service ends. Use dynamic for campaigns and product pages that get redesigned; use static for menus, business cards, Wi-Fi, and anything meant to last.</dd>
<dt>Do I need an app to scan a QR code?</dt>
<dd>No. Modern phones read QR codes from the built-in camera app: iPhones since iOS 11 and most Android phones from the last several years. Point the camera at the code, hold still for a second, and tap the notification that appears. If nothing appears, check that QR scanning is turned on in the camera settings, clean the lens, move closer, and make sure the code is well lit and not glaring. If it still will not scan, the code itself is the problem, and the troubleshooting answer above is where to start.</dd>
</dl>
</section>`,
  },
];
