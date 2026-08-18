export interface ExcelResult {
  blob: Uint8Array | null;
  error: string | null;
}

/**
 * Convert a JSON array of flat objects to an XLSX file (pure-JS, no server).
 * Returns a Uint8Array of the .xlsx bytes which the client can download.
 *
 * The XLSX format is essentially a ZIP containing several XML files.
 * We produce the minimal set needed for a single-sheet workbook that
 * Excel / LibreOffice / Google Sheets will open without errors.
 */
export function jsonToExcel(input: string): ExcelResult {
  if (!input.trim()) return { blob: null, error: null };

  let rows: Record<string, unknown>[];
  try {
    const parsed: unknown = JSON.parse(input);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    rows = arr.map((r) => (r && typeof r === "object" && !Array.isArray(r) ? (r as Record<string, unknown>) : {}));
  } catch (e) {
    return { blob: null, error: e instanceof Error ? e.message : "Invalid JSON" };
  }

  if (rows.length === 0) return { blob: null, error: "Input array is empty." };

  const headerSet = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);

  // Build shared-strings table
  const strings: string[] = [];
  const strIndex: Map<string, number> = new Map();
  function si(s: string): number {
    if (strIndex.has(s)) return strIndex.get(s)!;
    const idx = strings.length;
    strings.push(s);
    strIndex.set(s, idx);
    return idx;
  }

  // Column letter helper (A, B, …, Z, AA, …)
  function colLetter(n: number): string {
    let s = "";
    n++;
    while (n > 0) {
      n--;
      s = String.fromCharCode(65 + (n % 26)) + s;
      n = Math.floor(n / 26);
    }
    return s;
  }

  // Build worksheet XML
  function xmlEscape(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  const sheetRows: string[] = [];

  // Header row
  const headerCells = headers.map((h, ci) => {
    const ref = `${colLetter(ci)}1`;
    const idx = si(h);
    return `<c r="${ref}" t="s"><v>${idx}</v></c>`;
  });
  sheetRows.push(`<row r="1">${headerCells.join("")}</row>`);

  // Data rows
  rows.forEach((row, ri) => {
    const cells = headers.map((h, ci) => {
      const ref = `${colLetter(ci)}${ri + 2}`;
      const val = row[h];
      if (val === null || val === undefined) return `<c r="${ref}"/>`;
      if (typeof val === "boolean") {
        return `<c r="${ref}" t="b"><v>${val ? 1 : 0}</v></c>`;
      }
      if (typeof val === "number") {
        return `<c r="${ref}"><v>${val}</v></c>`;
      }
      const str = typeof val === "object" ? JSON.stringify(val) : String(val);
      const idx = si(str);
      return `<c r="${ref}" t="s"><v>${idx}</v></c>`;
    });
    sheetRows.push(`<row r="${ri + 2}">${cells.join("")}</row>`);
  });

  const lastCol = colLetter(headers.length - 1);
  const lastRow = rows.length + 1;
  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastCol}${lastRow}"/>
  <sheetData>
    ${sheetRows.join("\n    ")}
  </sheetData>
</worksheet>`;

  const ssXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">
${strings.map((s) => `  <si><t>${xmlEscape(s)}</t></si>`).join("\n")}
</sst>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;

  const topRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  // Build a ZIP manually (stored - no compression, keeps it simple)
  const files: { name: string; data: string }[] = [
    { name: "[Content_Types].xml", data: contentTypes },
    { name: "_rels/.rels", data: topRels },
    { name: "xl/workbook.xml", data: workbookXml },
    { name: "xl/_rels/workbook.xml.rels", data: workbookRels },
    { name: "xl/worksheets/sheet1.xml", data: sheetXml },
    { name: "xl/sharedStrings.xml", data: ssXml },
  ];

  const blob = buildZip(files);
  return { blob, error: null };
}

// ─── Minimal ZIP builder (stored, no compression) ─────────────────────────────

function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function u16le(n: number): number[] {
  return [n & 0xff, (n >> 8) & 0xff];
}
function u32le(n: number): number[] {
  return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff];
}

function crc32(data: Uint8Array): number {
  const table = makeCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

let _crcTable: number[] | null = null;
function makeCrcTable(): number[] {
  if (_crcTable) return _crcTable;
  _crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    _crcTable[n] = c;
  }
  return _crcTable;
}

function buildZip(files: { name: string; data: string }[]): Uint8Array {
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  const offsets: number[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = strToBytes(file.name);
    const dataBytes = strToBytes(file.data);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    // Local file header
    const local = new Uint8Array([
      0x50, 0x4b, 0x03, 0x04, // signature
      ...u16le(20),            // version needed
      ...u16le(0),             // flags
      ...u16le(0),             // compression: stored
      ...u16le(0),             // mod time
      ...u16le(0),             // mod date
      ...u32le(crc),
      ...u32le(size),          // compressed size
      ...u32le(size),          // uncompressed size
      ...u16le(nameBytes.length),
      ...u16le(0),             // extra field length
      ...nameBytes,
      ...dataBytes,
    ]);

    // Central directory header
    const central = new Uint8Array([
      0x50, 0x4b, 0x01, 0x02, // signature
      ...u16le(20),            // version made by
      ...u16le(20),            // version needed
      ...u16le(0),             // flags
      ...u16le(0),             // compression: stored
      ...u16le(0),             // mod time
      ...u16le(0),             // mod date
      ...u32le(crc),
      ...u32le(size),
      ...u32le(size),
      ...u16le(nameBytes.length),
      ...u16le(0),             // extra
      ...u16le(0),             // comment
      ...u16le(0),             // disk start
      ...u16le(0),             // int attr
      ...u32le(0),             // ext attr
      ...u32le(offset),        // relative offset
      ...nameBytes,
    ]);

    offsets.push(offset);
    offset += local.length;
    localHeaders.push(local);
    centralHeaders.push(central);
  }

  const centralSize = centralHeaders.reduce((s, h) => s + h.length, 0);

  const eocd = new Uint8Array([
    0x50, 0x4b, 0x05, 0x06,  // signature
    ...u16le(0),              // disk number
    ...u16le(0),              // disk with central dir
    ...u16le(files.length),
    ...u16le(files.length),
    ...u32le(centralSize),
    ...u32le(offset),         // offset of central dir
    ...u16le(0),              // comment length
  ]);

  const totalSize = offset + centralSize + eocd.length;
  const result = new Uint8Array(totalSize);
  let pos = 0;
  for (const h of localHeaders) { result.set(h, pos); pos += h.length; }
  for (const h of centralHeaders) { result.set(h, pos); pos += h.length; }
  result.set(eocd, pos);
  return result;
}
