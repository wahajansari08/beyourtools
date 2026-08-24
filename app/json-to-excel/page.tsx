import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToExcelClient from "./JsonToExcelClient";

export const metadata: Metadata = {
  title: "JSON to Excel - BeYourTools",
  description: "Export a JSON array as a downloadable .xlsx spreadsheet directly in your browser.",
  alternates: { canonical: "https://beyourtools.com/json-to-excel" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → Excel"
      title="JSON to Excel"
      description="Paste a JSON array of objects and download a fully-formatted .xlsx spreadsheet - no server, no sign-up."
      category="Convert"
      currentSlug="json-to-excel"
    >
      <JsonToExcelClient />
    </ToolLayout>
  );
}
