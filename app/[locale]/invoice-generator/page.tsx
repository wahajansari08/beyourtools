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
