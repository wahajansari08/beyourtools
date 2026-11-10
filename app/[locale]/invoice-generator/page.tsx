import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FinanceToolPage from "@/components/finance/FinanceToolPage";
import InvoiceGeneratorClient from "./InvoiceGeneratorClient";
import { createToolMetadata } from "@/lib/seo";

const __enMetadata: Metadata = createToolMetadata({
  title: "Invoice Generator - Create & Download PDF Invoices | BeYourTools",
  description: "Free invoice generator: add line items, set tax and discounts, and download a professional PDF invoice. Runs in your browser - no sign-up.",
  keywords: "invoice generator, free invoice maker, invoice pdf, create invoice online, freelance invoice",
  path: "/invoice-generator",
});

export default function InvoiceGeneratorPage() {
  return (
    <FinanceToolPage
      slug="invoice-generator"
      title="Invoice Generator"
      cluster="Business Finance"
      tagline="Build a professional invoice in seconds: add line items, set tax and discounts, then download a clean PDF."
      description="Free online invoice generator for freelancers and small businesses. Enter your business and client details, add line items with quantities and rates, apply tax and discounts, and download a professional PDF invoice."
      formulaExplanation={
        <>
          <p><strong style={{ color: "var(--text-secondary)" }}>Subtotal</strong> = Σ (Quantity × Rate) across all line items</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Discount</strong> = Subtotal × Discount %</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Tax</strong> = (Subtotal − Discount) × Tax %</p>
          <p><strong style={{ color: "var(--text-secondary)" }}>Total due</strong> = Subtotal − Discount + Tax</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
            <strong>Example:</strong> 10 hours × $50 = $500 subtotal · 10% discount = $50 · 8% tax on $450 = $36 ·
            Total due = <strong>$486</strong>
          </p>
        </>
      }
      faqs={[
        {
          question: "What should I include on an invoice?",
          answer: "At minimum: your business name and contact details, the client's name, a unique invoice number, the invoice date and due date, a description of each item with quantity and rate, and the total due. Adding payment terms and notes (like bank details) helps you get paid faster.",
        },
        {
          question: "Is a PDF invoice generated here valid for my business?",
          answer: "The PDF is a standard document you can send to clients and keep for your records. Whether it meets your local tax rules depends on your country - some places require specific fields like a VAT or tax ID number. Use the notes field for anything your jurisdiction requires.",
        },
        {
          question: "How is tax calculated on the invoice?",
          answer: "Tax is applied to the discounted subtotal: (Subtotal - Discount) x Tax %. Set the tax rate to 0 if you do not charge tax. The invoice shows each step so your client can see exactly how the total was reached.",
        },
        {
          question: "Can I invoice in a currency other than USD?",
          answer: "Yes. The currency selector covers common currencies (USD, EUR, GBP, PKR and more) and formats all amounts with the right symbol.",
        },
        {
          question: "Is my invoice data stored anywhere?",
          answer: "No. Everything you type stays in your browser, and the PDF is generated locally with pdf-lib. Nothing is uploaded or saved on any server.",
        },
        {
          question: "How do I number my invoices?",
          answer: "Use a simple sequential scheme like INV-001, INV-002 so each invoice has a unique number. Sequential numbering also makes your bookkeeping and tax filing much easier at year end.",
        },
        {
          question: "Is the discount taken off before tax is calculated?",
          answer: "Yes. The discount comes off the subtotal first, and tax is calculated on what is left. For example, a $1,000 subtotal with a 10% discount loses $100, leaving $900, and 8% tax on $900 is $72, so the total due is $972. If tax were charged on the full $1,000 instead, the total would be $980, so the order saves your client $8 on this invoice.",
        },
        {
          question: "What payment terms should I put on the invoice?",
          answer: "Write the terms in the Notes / payment terms field and set the due date on the invoice itself. Common terms are Due on receipt for small jobs and new clients, Net 15 for ongoing work, and Net 30 for larger corporate clients. Put the actual calendar date on the invoice rather than only writing Net 30, so there is no argument about when the 30 days started. Add your bank details or payment link in the notes field so the client can pay without asking.",
        },
        {
          question: "Can I add my company logo to the invoice?",
          answer: "Not yet. The invoice carries your business name, address, and email at the top, but there is no logo upload in this version. If branding matters for a particular client, put your business name and website in the header fields and your payment details in the notes field, which print on the PDF. The PDF itself has no watermark and no BeYourTools branding on it.",
        },
      ]}
    >
      <InvoiceGeneratorClient />
    </FinanceToolPage>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "invoice-generator", __enMetadata);
}
