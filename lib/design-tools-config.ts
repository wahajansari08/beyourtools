/**
 * Design tools configuration: color tools + favicon generator.
 * (Image Resizer/Cropper/Compressor live in lib/image-tools-config.ts.)
 * All tools are 100% client-side (canvas-based).
 */

export interface DesignTool {
  slug: string;
  name: string;
  description: string;
  category: "Color Tools" | "Favicons" | "Signature Tools";
  title: string;
  metaDescription: string;
  tagline: string;
  keywords: string[];
  howTo: { name: string; description: string; steps: { name: string; text: string }[] };
  features: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  related: string[];
}

export const designCategories = ["Color Tools", "Favicons", "Signature Tools"] as const;

export const designTools: DesignTool[] = [
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick any color from an image - click to get HEX, RGB and HSL with copy buttons and a magnifier.",
    category: "Color Tools",
    title: "Free Color Picker from Image - Sample Any Color | BeYourTools",
    metaDescription:
      "Pick colors from any image online. Click to sample a pixel and get HEX, RGB and HSL values with copy buttons, magnifier and pick history.",
    tagline:
      "See a color in a photo you wish you could name? Upload the image, click the pixel, and grab its exact HEX code in one click.",
    keywords: ["color picker from image", "eyedropper tool", "pick color from photo", "image color sampler", "hex color picker", "rgb picker", "hsl picker"],
    howTo: {
      name: "How to pick a color from an image",
      description: "Steps to sample a color using BeYourTools.",
      steps: [
        { name: "Upload an image", text: "Drop in any photo, screenshot or design file." },
        { name: "Click any pixel", text: "Click (or tap) anywhere on the image to sample that exact pixel's color." },
        { name: "Read the values", text: "See the color as HEX, RGB and HSL, with a live swatch." },
        { name: "Copy the code", text: "Hit any copy button to grab the format you need for your design tool or CSS." },
        { name: "Use the magnifier", text: "Hover the image to zoom the area around your cursor for pixel-precise picks." },
      ],
    },
    features: [
      { title: "Pixel-exact sampling", desc: "Reads the true pixel color via canvas - no guessing, no approximation." },
      { title: "HEX, RGB & HSL", desc: "All three formats shown together, each with a one-click copy button." },
      { title: "Magnifier preview", desc: "A zoomed loupe shows the pixel grid around your cursor for precise picks." },
      { title: "Pick history", desc: "Your recent colors stay in a row so you can go back and re-copy any of them." },
      { title: "Works on any image", desc: "Photos, screenshots, logos - if you can open it in a browser, you can pick from it." },
      { title: "100% private", desc: "The image is processed in your browser. No uploads, ever." },
    ],
    faqs: [
      { question: "How accurate is the color picker?", answer: "Completely accurate - it reads the exact RGB value of the pixel you click using the canvas pixel API. What you see is what you get." },
      { question: "Can I pick a color from a screenshot?", answer: "Yes. Take a screenshot, upload it here, and click any pixel. It's the fastest way to grab a color from anything on your screen." },
      { question: "What's the difference between HEX, RGB and HSL?", answer: "HEX and RGB describe the same color for screens and CSS. HSL describes it as hue, saturation and lightness, which is easier to adjust by eye when tweaking shades." },
      { question: "Why does my picked color look different in Photoshop?", answer: "Color-managed apps can interpret profiles differently, and JPEG compression can shift edge pixels slightly. The picker reports the actual stored pixel value, which is the ground truth." },
      { question: "Is the color picker free?", answer: "Yes - unlimited picks, no sign-up, everything runs in your browser." },
    ],
    related: ["color-palette-generator", "image-resizer", "image-cropper"],
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    description: "Extract 6 dominant colors from any image, copy HEX codes, export CSS variables or a PNG strip.",
    category: "Color Tools",
    title: "Free Color Palette Generator from Image | BeYourTools",
    metaDescription:
      "Generate a color palette from any image. Extract 6 dominant colors, click to copy HEX, export as CSS variables or download a PNG palette strip.",
    tagline:
      "Love the mood of a photo? Pull its 6 dominant colors out in one click and drop them straight into your next design.",
    keywords: ["color palette generator", "palette from image", "dominant colors", "image color extractor", "css variables palette", "color scheme generator"],
    howTo: {
      name: "How to generate a color palette",
      description: "Steps to extract a palette using BeYourTools.",
      steps: [
        { name: "Upload an image", text: "Any photo, artwork or screenshot works - colorful images give the best palettes." },
        { name: "Generate the palette", text: "The tool samples the image and quantizes its pixels into 6 dominant colors." },
        { name: "Click to copy", text: "Click any swatch to copy its HEX code instantly." },
        { name: "Copy CSS variables", text: "Use the button to grab all six colors as ready-to-paste CSS custom properties." },
        { name: "Download the strip", text: "Save the palette as a PNG strip to share with clients or teammates." },
      ],
    },
    features: [
      { title: "6 dominant colors", desc: "Smart quantization finds the colors that actually define your image." },
      { title: "Click-to-copy HEX", desc: "Tap any swatch to copy its HEX code to your clipboard." },
      { title: "CSS variables export", desc: "One button copies all six colors as --color-1 ... --color-6 custom properties." },
      { title: "PNG strip download", desc: "Save a shareable palette strip image for moodboards and presentations." },
      { title: "Instant regeneration", desc: "Upload another image and get a fresh palette in seconds." },
      { title: "100% private", desc: "Pixel analysis runs locally in your browser. Images are never uploaded." },
    ],
    faqs: [
      { question: "How does the palette generator find dominant colors?", answer: "It samples thousands of pixels from your image, groups similar colors together (quantization), and ranks them by how often they appear - so the six winners genuinely represent the image." },
      { question: "Why are my 6 colors so similar to each other?", answer: "Images with a narrow color range (like a foggy landscape) naturally produce similar tones. Try a more colorful image for a more varied palette." },
      { question: "What does 'copy as CSS variables' give me?", answer: "A ready-to-paste snippet like :root { --color-1: #a3b18a; ... } that you can drop into any stylesheet and reference throughout your CSS." },
      { question: "Can I use these palettes commercially?", answer: "Yes - colors aren't copyrightable, and the tool just reads pixels from your own image. Use the palettes anywhere." },
      { question: "Do my images get uploaded?", answer: "No. The analysis runs entirely in your browser on a canvas. Your images never leave your device." },
    ],
    related: ["color-picker", "image-resizer", "image-compressor"],
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    description: "Turn any image into favicons: 16/32/48/180/192/512 PNGs plus a multi-size ICO, or all as ZIP.",
    category: "Favicons",
    title: "Free Favicon Generator - Create ICO & PNG Favicons | BeYourTools",
    metaDescription:
      "Create favicons from any image online. Generates 16, 32, 48, 180, 192, 512 px PNGs and a multi-size ICO file. Download individually or as a ZIP.",
    tagline:
      "One logo, every favicon size. Upload your image and get browser-ready ICO and PNG favicons in seconds - no design software needed.",
    keywords: ["favicon generator", "favicon maker", "create favicon", "png to ico", "ico generator", "favicon sizes", "apple touch icon", "website icon generator"],
    howTo: {
      name: "How to generate favicons",
      description: "Steps to generate favicons using BeYourTools.",
      steps: [
        { name: "Upload your image", text: "A square logo or icon works best - it gets scaled to every size automatically." },
        { name: "Preview the sizes", text: "See your icon rendered at 16, 32, 48, 180, 192 and 512 px, including how tiny browser tabs will show it." },
        { name: "Download individually", text: "Grab any single PNG size, or the multi-size favicon.ico file." },
        { name: "Or download the ZIP", text: "Get all PNGs plus the ICO in one archive for easy deployment." },
        { name: "Add to your site", text: "Place favicon.ico at your site root and link the PNGs in your HTML head." },
      ],
    },
    features: [
      { title: "6 PNG sizes", desc: "16, 32, 48, 180, 192 and 512 px - covering tabs, shortcuts and mobile icons." },
      { title: "Real multi-size ICO", desc: "A proper favicon.ico with 16, 32 and 48 px layers, built in your browser." },
      { title: "Live size previews", desc: "See exactly how your icon looks at browser-tab size before downloading." },
      { title: "ZIP download", desc: "All PNGs plus the ICO bundled in one archive." },
      { title: "Square-friendly scaling", desc: "Non-square images are centered and scaled - upload a square logo for best results." },
      { title: "100% private", desc: "Everything is rendered on canvas in your browser. No uploads." },
    ],
    faqs: [
      { question: "What is a favicon.ico file?", answer: "It's the classic browser tab icon format. A single favicon.ico can hold multiple sizes (16, 32, 48 px) and browsers automatically pick the right one. It's still the most widely supported favicon format." },
      { question: "What image should I upload?", answer: "A square image (like 512 x 512) with a simple, bold design works best. Tiny details disappear at 16 px, so bold shapes and high contrast win." },
      { question: "Do I need all these sizes?", answer: "Not all, but they cover the common cases: 16/32 for browser tabs, 180 for Apple touch icons, 192/512 for Android and PWA manifests. The ICO covers legacy browsers." },
      { question: "How do I add the favicons to my website?", answer: "Put favicon.ico in your site's root folder, then add <link rel=\"icon\" href=\"/favicon.ico\"> and <link rel=\"apple-touch-icon\" href=\"/icon-180.png\"> to your page's <head>." },
      { question: "Is the favicon generator free?", answer: "Yes - unlimited generations, no sign-up, no watermark. All rendering happens in your browser." },
    ],
    related: ["image-resizer", "image-compressor", "image-cropper"],
  },
  {
    slug: "signature-maker",
    name: "Signature Maker",
    description:
      "Draw your signature with a mouse or finger, or type it in a script font, then download a transparent PNG.",
    // Placeholder category: the DesignTool union only allows "Color Tools" | "Favicons".
    // Extend the union on merge (e.g. "Signature Tools") and update this value.
    category: "Color Tools",
    title: "Free Signature Maker - Draw or Type Your Signature | BeYourTools",
    metaDescription:
      "Create a signature online: draw with your mouse or finger, or type your name in a script font. Transparent PNG download, normal and 2x sizes.",
    tagline:
      "Need a signature for a document? Draw it freehand or type it in a script font, then download a transparent PNG that drops onto any form.",
    keywords: [
      "signature maker",
      "online signature",
      "draw signature",
      "electronic signature png",
      "signature generator",
      "transparent signature",
    ],
    howTo: {
      name: "How to create your signature",
      description: "Steps to make a signature using BeYourTools.",
      steps: [
        { name: "Pick draw or type", text: "Draw mode for a freehand signature, Type mode for a clean script look." },
        { name: "Create it", text: "Sign with your mouse, trackpad or finger - or type your name and pick a font." },
        { name: "Adjust the ink", text: "Change stroke width and ink color to match your style." },
        { name: "Download the PNG", text: "Save with a transparent background, normal size or 2x for sharper documents." },
      ],
    },
    features: [
      { title: "Draw mode", desc: "Sign freehand with mouse, trackpad, stylus or finger using smooth pointer events." },
      { title: "Type mode", desc: "Type your name and render it in one of several cursive and script styles." },
      { title: "Adjustable ink", desc: "Control stroke width and ink color to get the exact look you want." },
      { title: "Transparent PNG", desc: "Downloads have no background, so the signature sits cleanly on any document." },
      { title: "2x size option", desc: "Export at double resolution for crisp printing and high-DPI screens." },
      { title: "100% private", desc: "Your signature is drawn on a canvas in your browser and never uploaded." },
    ],
    faqs: [
      { question: "Is a drawn signature legally valid?", answer: "In many places, yes - electronic signatures are legally recognized in the US (ESIGN Act), the EU (eIDAS) and many other regions for most everyday documents. Rules vary by document type and country, so check what applies to your specific paperwork." },
      { question: "Why is the PNG background transparent?", answer: "A transparent background lets you place the signature directly over contracts, PDFs and forms without a white box around it. It behaves like a digital stamp." },
      { question: "Which looks better, draw or type mode?", answer: "Draw mode looks like a real handwritten signature and is harder to forge. Type mode gives a clean, consistent script style. For formal documents, most people prefer their drawn signature." },
      { question: "Can I use the signature in Word or Google Docs?", answer: "Yes. Download the PNG, then insert it as an image in your document. Because the background is transparent, it blends in like you signed the page." },
      { question: "Is my signature stored anywhere?", answer: "No. It lives only on the canvas in your browser tab. Clear the canvas or close the tab and it is gone." },
    ],
    related: ["favicon-generator", "color-picker", "image-cropper"],
  },
];
export function getDesignTool(slug: string): DesignTool | undefined {
  return designTools.find((t) => t.slug === slug);
}

export function designByCategory(category: "Color Tools" | "Favicons" | "Signature Tools"): DesignTool[] {
  return designTools.filter((t) => t.category === category);
}

export function relatedDesignTools(slug: string, max = 4): DesignTool[] {
  const tool = getDesignTool(slug);
  if (!tool) return [];
  return tool.related
    .map((s) => getDesignTool(s))
    .filter((t): t is DesignTool => Boolean(t))
    .slice(0, max);
}

/**
 * Cross-category related-tool resolver: design tools' `related` arrays may
 * reference image tools (and vice versa) since the resizer/cropper/compressor
 * moved to lib/image-tools-config.ts. Falls back to design-only lookup.
 */
export function relatedToolsCrossCategory(
  slug: string,
  related: string[],
  max = 4
): { slug: string; name: string; description: string }[] {
  // Lazy import to avoid a hard dependency cycle at module scope.
  const { imageTools } = require("./image-tools-config") as {
    imageTools: { slug: string; name: string; description: string }[];
  };
  const pool: { slug: string; name: string; description: string }[] = [...designTools, ...imageTools];
  return related
    .map((s) => pool.find((t) => t.slug === s))
    .filter((t): t is { slug: string; name: string; description: string } => Boolean(t))
    .slice(0, max);
}
