import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import CsvToJsonClient from "./CsvToJsonClient";

export const metadata: Metadata = {
  title: "CSV to JSON - BeYourTools",
  description: "Convert CSV rows into a JSON array of objects using the first row as headers.",
  alternates: { canonical: "https://beyourtools.com/csv-to-json" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="CSV → JSON"
      title="CSV to JSON"
      description="Paste CSV data and convert it into a JSON array, using the first row as object keys."
      category="Convert"
      currentSlug="csv-to-json"
    >
      <CsvToJsonClient />
    </ToolLayout>
  );
}
