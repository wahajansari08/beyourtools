export type PdfToolCategory =
  | "Convert"
  | "Edit & Organize"
  | "Security"
  | "Extract & Analyze"
  | "Repair & Compare";

export type PdfEngine =
  | "pdf-lib"   // pure-JS, fully client-side via pdf-lib
  | "canvas"    // pdf.js render → canvas (pdf→image)
  | "jspdf"     // jsPDF (image/html → pdf)
  | "limited";  // browser-limited (Word, Excel, PPT, OCR - show honest UI)

export interface PdfToolDef {
  slug: string;
  name: string;
  description: string;
  category: PdfToolCategory;
  engine: PdfEngine;
  /** Accept string for the primary file input */
  accept: string;
  /** Human label for the primary input */
  inputLabel: string;
  /** Icon emoji */
  icon: string;
  /** Optional per-tool FAQs, appended to the generic FAQ list and schema */
  faqs?: { question: string; answer: string }[];
}

export const pdfTools: PdfToolDef[] = [
  // ── Convert ────────────────────────────────────────────────────────────────
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert every PDF page into a JPG image.",
    category: "Convert",
    engine: "canvas",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🖼",
    faqs: [
      { question: "Do I get one JPG per page?", answer: "Yes. Every page of your PDF is rendered as its own JPG, and each one downloads separately, named after the original file with a page number, so a 12 page PDF gives you 12 JPGs you can use individually." },
      { question: "Can I convert only some pages to JPG?", answer: "The tool renders every page, but you download only the pages you need. Open the PDF, let it render, then download just the page JPGs you want and ignore the rest." },
      { question: "Will the text in my PDF stay selectable in the JPG?", answer: "No. A JPG is a flat image, so text becomes pixels and is no longer selectable or searchable. If you need the text, keep the original PDF or use a text extraction tool instead." },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Combine one or more JPG images into a single PDF.",
    category: "Convert",
    engine: "jspdf",
    accept: ".jpg,.jpeg,image/jpeg",
    inputLabel: "JPG Image(s)",
    icon: "📄",
    faqs: [
      { question: "How many pages will my PDF have?", answer: "One page per image. Drop in five JPGs and you get a five page PDF, ready to download as a single file." },
      { question: "Can I mix JPG and PNG images in one PDF?", answer: "No, this tool accepts JPG and JPEG files only. For PNG images, use the separate PNG to PDF tool, which works the same way." },
      { question: "Does converting JPG to PDF change the image quality?", answer: "The images are placed into the PDF rather than recompressed from scratch, so what you see in the JPG is what ends up on the page. Very large photos still make a large PDF, so resize oversized images before converting if file size matters." },
    ],
  },
  {
    slug: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert every PDF page into a PNG image.",
    category: "Convert",
    engine: "canvas",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🖼",
    faqs: [
      { question: "Should I choose PDF to PNG or PDF to JPG?", answer: "Choose PNG when you need crisp edges, screenshots, diagrams, or text pages, since PNG is lossless. Choose JPG for photographs, where it gives a much smaller file at visually identical quality." },
      { question: "Do I get one PNG per page?", answer: "Yes. Every page is rendered as its own PNG and each downloads separately, named after the original file with a page number." },
      { question: "Will a PNG of a scanned page be searchable text?", answer: "No. Like JPG, PNG is a flat image, so scanned text becomes pixels. The image will look identical to the page, but the words are not selectable until the page goes through OCR." },
    ],
  },
  {
    slug: "png-to-pdf",
    name: "PNG to PDF",
    description: "Combine one or more PNG images into a single PDF.",
    category: "Convert",
    engine: "jspdf",
    accept: ".png,image/png",
    inputLabel: "PNG Image(s)",
    icon: "📄",
    faqs: [
      { question: "How many pages will my PDF have?", answer: "One page per image. Drop in five PNGs and you get a five page PDF, ready to download as a single file." },
      { question: "Can I mix PNG and JPG images in one PDF?", answer: "No, this tool accepts PNG files only. For JPG images, use the separate JPG to PDF tool, which works the same way." },
      { question: "Will my PNG images lose quality in the PDF?", answer: "The images are placed into the PDF rather than recompressed from scratch, so what you see in the PNG is what ends up on the page. Very large screenshots still make a large PDF, so resize oversized images before converting if file size matters." },
    ],
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Extract PDF content as a .docx document.",
    category: "Convert",
    engine: "limited",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "📝",
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert a Word document (.docx) to PDF.",
    category: "Convert",
    engine: "limited",
    accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    inputLabel: "Word Document",
    icon: "📄",
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract tables from a PDF into an Excel spreadsheet.",
    category: "Convert",
    engine: "limited",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "📊",
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert an Excel spreadsheet (.xlsx) to PDF.",
    category: "Convert",
    engine: "limited",
    accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    inputLabel: "Excel File",
    icon: "📄",
  },
  {
    slug: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Convert a PDF into a PowerPoint presentation.",
    category: "Convert",
    engine: "limited",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "📊",
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Convert a PowerPoint file (.pptx) to PDF.",
    category: "Convert",
    engine: "limited",
    accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
    inputLabel: "PowerPoint File",
    icon: "📄",
  },
  {
    slug: "pdf-to-html",
    name: "PDF to HTML",
    description: "Convert PDF text content to an HTML document.",
    category: "Convert",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🌐",
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert an HTML snippet or file to a PDF document.",
    category: "Convert",
    engine: "jspdf",
    accept: ".html,.htm,text/html",
    inputLabel: "HTML File",
    icon: "📄",
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    description: "Extract all plain text from a PDF file.",
    category: "Convert",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "📃",
  },
  {
    slug: "pdf-to-json",
    name: "PDF to JSON",
    description: "Extract PDF structure and text into a JSON object.",
    category: "Convert",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "{ }",
  },
  {
    slug: "pdf-to-csv",
    name: "PDF to CSV",
    description: "Extract text from each PDF page into a CSV file.",
    category: "Convert",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "📊",
  },

  // ── Edit & Organize ───────────────────────────────────────────────────────
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one document - pick individual pages per file, reorder files, and sort A-Z before merging.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF Files",
    icon: "🔀",
    faqs: [
      { question: "Can I merge only some pages from each PDF?", answer: "Yes. Expand a file to pick individual pages, include or exclude them, and merge just the pages you chose. A single file can even be merged on its own, which is a handy way to extract a page selection into a new document." },
      { question: "Does merging change the order of my files?", answer: "No, files merge in the order you arrange them, and you can reorder them before merging or sort them A to Z. Check the order in the list before you click merge, because the merged document keeps exactly that sequence." },
      { question: "Will merging reduce the quality of my PDFs?", answer: "No. Merging copies whole pages into a new document without re-encoding them, so text, images, and formatting come out exactly as they were. A merged file is larger because it contains more pages, not because anything was degraded." },
    ],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Split a PDF into individual pages or custom ranges.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "✂️",
    faqs: [
      { question: "How do I split a PDF into specific page ranges?", answer: "Type ranges in the Page ranges box using the pattern 1-3, 5, 7-9: each comma-separated group becomes its own file. Leave the box blank and the tool splits every page into its own file instead. Out-of-range numbers are ignored, so 1-3 on a 2-page document simply gives you pages 1 and 2." },
      { question: "Can I split out just the middle pages of a PDF?", answer: "Yes. Enter only the pages you want, for example 4-6, and the tool returns just that section as a new PDF. The original file is never changed, so you can run several different splits from the same source document." },
      { question: "Do split pages keep their original quality?", answer: "Yes. Splitting copies whole pages into new documents without re-encoding them, so text, images, and formatting come out exactly as they were. If a split file looks smaller, that is because it contains fewer pages, not because anything was compressed." },
    ],
  },
  {
    slug: "pdf-editor",
    name: "PDF Editor",
    description: "View, annotate, and inspect a PDF in your browser.",
    category: "Edit & Organize",
    engine: "canvas",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "✏️",
    faqs: [
      { question: "What does the PDF Editor actually do?", answer: "It renders every page of your PDF as a thumbnail in your browser, so you can inspect the whole document at a glance and click any page for a closer preview. The info bar shows the file name, page count, and file size. Your original file is never changed." },
      { question: "Can the PDF Editor change existing text in a PDF?", answer: "No. This editor is for viewing and inspecting, not for rewriting text that is already in the document. If you need to change the document itself, use the page tools instead: split, extract, delete, rotate, or watermark pages, or edit the source document and export a fresh PDF." },
      { question: "Is my PDF uploaded when I inspect it?", answer: "No. Pages are rendered in your browser with pdf.js and the file never leaves your device, which is why the editor is safe for confidential documents. If a file fails to load, check that it is a valid PDF and try again with the original file." },
    ],
  },
  {
    slug: "extract-pdf-pages",
    name: "Extract PDF Pages",
    description: "Pull specific pages out of a PDF into a new file.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "📤",
    faqs: [
      { question: "Do extracted pages stay in their original order?", answer: "Yes. Pages are copied in the order you list them, so listing pages 5, 2, and 9 gives you a new PDF in that order. If you want the original order, list the pages in increasing order." },
      { question: "Is the original PDF changed when I extract pages?", answer: "No. Extraction copies the chosen pages into a brand new file and leaves your original untouched, so you can extract several different selections from the same source document." },
      { question: "What happens if I list a page that does not exist?", answer: "Pages outside the document are ignored. If none of the pages you listed exist, the tool reports that instead of producing an empty file, so check the page count first if you get that message." },
    ],
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    description: "Remove specific pages from a PDF.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🗑",
    faqs: [
      { question: "Can I delete all pages from a PDF?", answer: "No. The tool refuses to delete every page, because a PDF with no pages is not a usable document. Delete all but one page if you need a single page file, or extract the pages you want instead." },
      { question: "Does deleting pages shrink the file by the same amount each time?", answer: "Not necessarily. Each page contributes a different amount depending on its images and content, so deleting a photo heavy page saves far more than deleting a plain text page. The saving comes from the removed pages, not from any compression." },
      { question: "Is the original PDF changed when I delete pages?", answer: "No. Deleting produces a new file with the remaining pages, and your original stays exactly as it was, so you can always go back if you removed the wrong page." },
    ],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate individual pages or the whole PDF.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🔄",
    faqs: [
      { question: "Can I rotate only some pages, not the whole PDF?", answer: "Yes. Choose the pages you want to rotate and leave the rest alone. If you list no pages, the rotation applies to every page in the document." },
      { question: "What rotation angles are available?", answer: "90, 180, and 270 degrees. The rotation adds to a page's existing rotation, so rotating a page that is already sideways by 90 degrees brings it upright rather than flipping it upside down." },
      { question: "Does rotating a PDF change its quality?", answer: "No. Rotation only changes each page's rotation setting in the document, it does not re-encode text or images, so the content comes out exactly as it was, just turned." },
    ],
  },
  {
    slug: "pdf-watermark",
    name: "PDF Watermark",
    description: "Add a text watermark to every page of a PDF.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "💧",
    faqs: [
      { question: "Where does the watermark appear on each page?", answer: "The text is drawn once per page, centred and rotated at 45 degrees, in grey Helvetica Bold. It sits on the page content itself, not as a removable annotation layer, so it travels with the file when you share it." },
      { question: "What opacity and size should I use?", answer: "The defaults are 25 percent opacity at size 48, which reads clearly without hiding the page. The tool lets you set opacity from 5 to 80 percent and size from 16 to 96. For a draft mark, keep opacity low; for a confidential stamp, go higher, but check that the underlying text stays readable." },
      { question: "Does watermarking change my original PDF?", answer: "No. Watermarking builds a new file, downloaded as your file name plus -watermarked, and leaves the original untouched. Keep the original: once a watermark is baked into the page content, removing it cleanly is difficult, which is the point of a watermark." },
    ],
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    description: "Reduce PDF file size by re-encoding embedded content.",
    category: "Edit & Organize",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🗜",
    faqs: [
      { question: "How much can the PDF Compressor shrink my file?", answer: "It depends on what is inside the PDF. Scanned or image-heavy documents usually shrink the most, because re-serialising the file drops unused objects and tightens the structure. A short text-only PDF may barely shrink at all, and the tool will tell you so instead of pretending: it reports that the file is already optimally compressed when no further reduction is possible." },
      { question: "Will compressing my PDF lower its quality?", answer: "No. This compressor re-serialises the document structure rather than downsampling images or re-encoding pages, so fonts, images, and layout come out unchanged. Always compare the reported before and after sizes, and keep your original until you have checked the output." },
      { question: "Does compressing a PDF also remove its metadata?", answer: "Only if you turn on the strip-metadata option in the toolbar. Without it, document properties such as title and author stay in the file. For a dedicated cleanup, use the PDF Metadata Remover, which clears the standard properties (title, author, subject, keywords, creator, producer) and re-saves the file." },
    ],
  },

  // ── Security ───────────────────────────────────────────────────────────────
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description: "Add a password to prevent unauthorised access.",
    category: "Security",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🔒",
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove the owner password from a PDF (requires the password).",
    category: "Security",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "Protected PDF",
    icon: "🔓",
  },

  // ── Extract & Analyze ─────────────────────────────────────────────────────
  {
    slug: "pdf-ocr",
    name: "PDF OCR",
    description: "Run OCR on scanned PDFs to extract text.",
    category: "Extract & Analyze",
    engine: "limited",
    accept: ".pdf,application/pdf",
    inputLabel: "Scanned PDF",
    icon: "🔍",
  },
  {
    slug: "pdf-metadata-viewer",
    name: "PDF Metadata Viewer",
    description: "Inspect title, author, dates, and other metadata.",
    category: "Extract & Analyze",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🔎",
  },
  {
    slug: "pdf-metadata-remover",
    name: "PDF Metadata Remover",
    description: "Strip all metadata from a PDF before sharing.",
    category: "Extract & Analyze",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF File",
    icon: "🧹",
    faqs: [
      { question: "Exactly which metadata does the PDF Metadata Remover clear?", answer: "It clears the standard document properties: title, author, subject, keywords, creator, and producer, then re-saves the file. After downloading, open the cleaned file in the PDF Metadata Viewer to confirm the fields are empty before you share it." },
      { question: "Does it remove hidden XMP metadata too?", answer: "Not explicitly. The remover clears the standard properties listed above, but extended XMP packets are a separate layer that some authoring tools embed. If your document came from a professional publishing workflow, verify the output with the PDF Metadata Viewer and treat any remaining XMP as a reason to re-export from your authoring app with metadata off." },
      { question: "Photos have metadata too. How do I clean those?", answer: "Phone photos carry EXIF data, including GPS location, which is often more revealing than PDF metadata. Our guide to removing EXIF metadata from photos before sharing covers iPhone, Android, Windows, and Mac step by step, plus the browser re-save shortcut that drops EXIF when an image is re-encoded." },
    ],
  },

  // ── Repair & Compare ──────────────────────────────────────────────────────
  {
    slug: "pdf-repair",
    name: "PDF Repair",
    description: "Attempt to recover and re-save a damaged PDF.",
    category: "Repair & Compare",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "Damaged PDF",
    icon: "🔧",
  },
  {
    slug: "pdf-compare",
    name: "PDF Compare",
    description: "Compare two PDFs and highlight text differences.",
    category: "Repair & Compare",
    engine: "pdf-lib",
    accept: ".pdf,application/pdf",
    inputLabel: "PDF Files",
    icon: "⚖️",
  },
];

export function getPdfTool(slug: string): PdfToolDef | undefined {
  return pdfTools.find((t) => t.slug === slug);
}

export function pdfToolsByCategory(cat: PdfToolCategory): PdfToolDef[] {
  return pdfTools.filter((t) => t.category === cat);
}

export const pdfToolCategories: PdfToolCategory[] = [
  "Convert",
  "Edit & Organize",
  "Security",
  "Extract & Analyze",
  "Repair & Compare",
];
