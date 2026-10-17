"use client";

import { useMemo, useState } from "react";
import Btn from "@/components/Btn";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface LineItem {
  id: number;
  description: string;
  qty: string;
  rate: string;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR - Euro" },
  { code: "GBP", symbol: "£", label: "GBP - British Pound" },
  { code: "PKR", symbol: "₨", label: "PKR - Pakistani Rupee" },
  { code: "INR", symbol: "₹", label: "INR - Indian Rupee" },
  { code: "AED", symbol: "د.إ", label: "AED - UAE Dirham" },
  { code: "SAR", symbol: "﷼", label: "SAR - Saudi Riyal" },
  { code: "CAD", symbol: "$", label: "CAD - Canadian Dollar" },
  { code: "AUD", symbol: "$", label: "AUD - Australian Dollar" },
];

let nextId = 1;

const fieldCls = "focus-ring w-full rounded-lg border px-3 py-2 text-sm";
const fieldStyle = {
  borderColor: "var(--border-strong)",
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
};
const labelCls = "mb-1 block text-xs font-medium";
const labelStyle = { color: "var(--text-muted)" };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function InvoiceGeneratorClient() {
  const [business, setBusiness] = useState({ name: "", address: "", email: "" });
  const [client, setClient] = useState({ name: "", address: "", email: "" });
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [issueDate, setIssueDate] = useState(today());
  const [dueDate, setDueDate] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [items, setItems] = useState<LineItem[]>([
    { id: nextId++, description: "", qty: "1", rate: "" },
  ]);
  const [taxPct, setTaxPct] = useState("0");
  const [discountPct, setDiscountPct] = useState("0");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);

  const currency = CURRENCIES.find((c) => c.code === currencyCode)!;

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => {
      const q = parseFloat(it.qty) || 0;
      const r = parseFloat(it.rate) || 0;
      return sum + q * r;
    }, 0);
    const discount = subtotal * ((parseFloat(discountPct) || 0) / 100);
    const tax = (subtotal - discount) * ((parseFloat(taxPct) || 0) / 100);
    return { subtotal, discount, tax, total: subtotal - discount + tax };
  }, [items, taxPct, discountPct]);

  const fmt = (n: number) =>
    `${currency.symbol}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const updateItem = (id: number, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const removeItem = (id: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const addItem = () =>
    setItems((prev) => [...prev, { id: nextId++, description: "", qty: "1", rate: "" }]);

  const downloadPdf = async () => {
    setGenerating(true);
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);

      const page = doc.addPage([595.28, 841.89]); // A4
      const { width } = page.getSize();
      const margin = 50;
      const gold = rgb(0.85, 0.6, 0.08);
      const dark = rgb(0.12, 0.14, 0.18);
      const gray = rgb(0.42, 0.46, 0.53);
      let y = 800;

      const text = (t: string, x: number, yy: number, size: number, f = font, c = dark) =>
        page.drawText(t, { x, y: yy, size, font: f, color: c, maxWidth: width - margin - x });

      // Header
      text("INVOICE", margin, y, 28, bold, gold);
      text(business.name || "Your Business", margin, y - 28, 13, bold);
      y -= 44;
      if (business.address) {
        for (const line of business.address.split("\n").slice(0, 2)) {
          text(line, margin, y, 10, font, gray);
          y -= 14;
        }
      }
      if (business.email) {
        text(business.email, margin, y, 10, font, gray);
        y -= 14;
      }

      // Invoice meta (right side)
      let my = 800;
      const rightX = width - margin - 170;
      text(`Invoice no: ${invoiceNo || "-"}`, rightX, my, 10, bold); my -= 16;
      text(`Issue date: ${issueDate || "-"}`, rightX, my, 10); my -= 16;
      text(`Due date: ${dueDate || "-"}`, rightX, my, 10); my -= 16;

      y = Math.min(y, my) - 24;
      text("Bill to", margin, y, 11, bold, gray);
      y -= 16;
      text(client.name || "-", margin, y, 12, bold); y -= 15;
      if (client.address) {
        for (const line of client.address.split("\n").slice(0, 2)) {
          text(line, margin, y, 10, font, gray);
          y -= 13;
        }
      }
      if (client.email) {
        text(client.email, margin, y, 10, font, gray);
        y -= 13;
      }
      y -= 14;

      // Table header
      const cols = { desc: margin, qty: width - margin - 210, rate: width - margin - 140, amt: width - margin - 70 };
      page.drawRectangle({ x: margin, y: y - 6, width: width - margin * 2, height: 24, color: rgb(0.95, 0.96, 0.98) });
      text("Description", cols.desc, y, 10, bold);
      text("Qty", cols.qty, y, 10, bold);
      text("Rate", cols.rate, y, 10, bold);
      text("Amount", cols.amt, y, 10, bold);
      y -= 26;

      // Table rows
      for (const it of items) {
        const q = parseFloat(it.qty) || 0;
        const r = parseFloat(it.rate) || 0;
        const amt = q * r;
        if (y < 160) break; // keep it to one page; overflow rows are skipped
        text(it.description || "-", cols.desc, y, 10);
        text(it.qty || "0", cols.qty, y, 10);
        text(fmt(r), cols.rate, y, 10);
        text(fmt(amt), cols.amt, y, 10, bold);
        page.drawLine({ start: { x: margin, y: y - 8 }, end: { x: width - margin, y: y - 8 }, thickness: 0.5, color: rgb(0.88, 0.9, 0.93) });
        y -= 24;
      }

      // Totals
      y -= 6;
      const totalX = width - margin - 170;
      const row = (label: string, val: number, isTotal = false) => {
        text(label, totalX, y, isTotal ? 12 : 10, isTotal ? bold : font, isTotal ? dark : gray);
        const valStr = fmt(val);
        text(valStr, width - margin - bold.widthOfTextAtSize(valStr, isTotal ? 12 : 10), y, isTotal ? 12 : 10, isTotal ? bold : font);
        y -= isTotal ? 22 : 17;
      };
      row("Subtotal", totals.subtotal);
      if (totals.discount > 0) row(`Discount (${discountPct || 0}%)`, -totals.discount);
      if (totals.tax > 0) row(`Tax (${taxPct || 0}%)`, totals.tax);
      page.drawLine({ start: { x: totalX, y: y + 6 }, end: { x: width - margin, y: y + 6 }, thickness: 1, color: gold });
      row("Total due", totals.total, true);

      // Notes
      if (notes.trim() && y > 120) {
        y -= 8;
        text("Notes", margin, y, 11, bold, gray);
        y -= 15;
        for (const line of notes.split("\n").slice(0, 6)) {
          text(line, margin, y, 10, font, gray);
          y -= 14;
          if (y < 80) break;
        }
      }

      // Footer
      text("Generated with BeYourTools", margin, 40, 9, font, gray);

      const bytes = await doc.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNo || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      {/* Form */}
      <div className="space-y-4">
        {/* Business + client */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Your business</h2>
            <div className="space-y-2.5">
              <div>
                <label className={labelCls} style={labelStyle} htmlFor="inv-biz-name">Business name</label>
                <input id="inv-biz-name" className={fieldCls} style={fieldStyle} value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })} placeholder="Acme Studio" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle} htmlFor="inv-biz-addr">Address</label>
                <textarea id="inv-biz-addr" className={fieldCls} style={fieldStyle} rows={2} value={business.address}
                  onChange={(e) => setBusiness({ ...business, address: e.target.value })} placeholder="Street, city, country" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle} htmlFor="inv-biz-email">Email</label>
                <input id="inv-biz-email" type="email" className={fieldCls} style={fieldStyle} value={business.email}
                  onChange={(e) => setBusiness({ ...business, email: e.target.value })} placeholder="you@business.com" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Bill to</h2>
            <div className="space-y-2.5">
              <div>
                <label className={labelCls} style={labelStyle} htmlFor="inv-cli-name">Client name</label>
                <input id="inv-cli-name" className={fieldCls} style={fieldStyle} value={client.name}
                  onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="Client Co." />
              </div>
              <div>
                <label className={labelCls} style={labelStyle} htmlFor="inv-cli-addr">Address</label>
                <textarea id="inv-cli-addr" className={fieldCls} style={fieldStyle} rows={2} value={client.address}
                  onChange={(e) => setClient({ ...client, address: e.target.value })} placeholder="Street, city, country" />
              </div>
              <div>
                <label className={labelCls} style={labelStyle} htmlFor="inv-cli-email">Email</label>
                <input id="inv-cli-email" type="email" className={fieldCls} style={fieldStyle} value={client.email}
                  onChange={(e) => setClient({ ...client, email: e.target.value })} placeholder="client@company.com" />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice meta */}
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className={labelCls} style={labelStyle} htmlFor="inv-no">Invoice no.</label>
              <input id="inv-no" className={fieldCls} style={fieldStyle} value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle} htmlFor="inv-cur">Currency</label>
              <select id="inv-cur" className={fieldCls} style={fieldStyle} value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle} htmlFor="inv-issue">Issue date</label>
              <input id="inv-issue" type="date" className={fieldCls} style={fieldStyle} value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle} htmlFor="inv-due">Due date</label>
              <input id="inv-due" type="date" className={fieldCls} style={fieldStyle} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Line items</h2>
            <Btn variant="secondary" size="sm" onClick={addItem}>+ Add item</Btn>
          </div>
          <div className="space-y-2.5">
            {items.map((it) => {
              const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
              return (
                <div key={it.id} className="grid grid-cols-[1fr_64px_96px_auto] items-center gap-2">
                  <input
                    className={fieldCls}
                    style={fieldStyle}
                    value={it.description}
                    onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    placeholder="Service or product description"
                    aria-label="Item description"
                  />
                  <input
                    className={fieldCls}
                    style={{ ...fieldStyle, textAlign: "center" }}
                    value={it.qty}
                    onChange={(e) => updateItem(it.id, { qty: e.target.value.replace(/[^0-9.]/g, "") })}
                    placeholder="Qty"
                    aria-label="Quantity"
                    inputMode="decimal"
                  />
                  <input
                    className={fieldCls}
                    style={{ ...fieldStyle, textAlign: "right" }}
                    value={it.rate}
                    onChange={(e) => updateItem(it.id, { rate: e.target.value.replace(/[^0-9.]/g, "") })}
                    placeholder="Rate"
                    aria-label="Rate"
                    inputMode="decimal"
                  />
                  <div className="flex items-center gap-1">
                    <span className="hidden w-20 text-right text-sm tabular-nums sm:block" style={{ color: "var(--text-secondary)" }}>
                      {fmt(amt)}
                    </span>
                    <Btn variant="icon" size="sm" onClick={() => removeItem(it.id)} aria-label="Remove item" title="Remove item">
                      ×
                    </Btn>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle} htmlFor="inv-tax">Tax %</label>
              <input id="inv-tax" className={fieldCls} style={fieldStyle} value={taxPct}
                onChange={(e) => setTaxPct(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" inputMode="decimal" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle} htmlFor="inv-disc">Discount %</label>
              <input id="inv-disc" className={fieldCls} style={fieldStyle} value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" inputMode="decimal" />
            </div>
          </div>
          <div className="mt-3">
            <label className={labelCls} style={labelStyle} htmlFor="inv-notes">Notes / payment terms</label>
            <textarea id="inv-notes" className={fieldCls} style={fieldStyle} rows={3} value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment due within 14 days. Bank details, tax ID, thank-you note…" />
          </div>
        </div>
      </div>

      {/* Live summary + download */}
      <div>
        <div className="rounded-xl border p-4 sm:p-5 lg:sticky lg:top-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}>
          <h2 className="mb-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Invoice summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt style={{ color: "var(--text-muted)" }}>Subtotal</dt>
              <dd className="tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between">
                <dt style={{ color: "var(--text-muted)" }}>Discount ({discountPct}%)</dt>
                <dd className="tabular-nums" style={{ color: "var(--teal)" }}>−{fmt(totals.discount)}</dd>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between">
                <dt style={{ color: "var(--text-muted)" }}>Tax ({taxPct}%)</dt>
                <dd className="tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt(totals.tax)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t pt-2" style={{ borderColor: "var(--border)" }}>
              <dt className="font-semibold" style={{ color: "var(--text-primary)" }}>Total due</dt>
              <dd className="text-lg font-bold tabular-nums" style={{ color: "var(--accent-text)" }}>{fmt(totals.total)}</dd>
            </div>
          </dl>
          <Btn variant="primary" size="lg" className="mt-4 w-full" onClick={downloadPdf} disabled={generating || items.every((i) => !i.description && !(parseFloat(i.rate) > 0))}>
            {generating ? "Generating…" : "Download PDF"}
          </Btn>
          <p className="mt-2 text-center text-xs" style={{ color: "var(--text-subtle)" }}>
            The PDF is generated in your browser. Nothing is uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
