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
