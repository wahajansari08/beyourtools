import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JsonToCsvClient from "./JsonToCsvClient";

export const metadata: Metadata = {
  title: "JSON to CSV — Jsonifyr",
  description: "Convert a JSON array of objects into CSV, with configurable delimiter.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON → CSV"
      title="JSON to CSV"
      description="Convert a JSON array of flat objects into a CSV file, ready to open in a spreadsheet."
      category="Convert"
      currentSlug="json-to-csv"
    >
      <JsonToCsvClient />
    </ToolLayout>
  );
}
