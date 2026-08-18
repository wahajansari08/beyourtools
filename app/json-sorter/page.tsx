import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import SorterClient from "./SorterClient";

export const metadata: Metadata = {
  title: "JSON Sorter - BeYourTools",
  description: "Sort JSON object keys alphabetically, recursively, ascending or descending.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Sorter"
      title="JSON Sorter"
      description="Recursively sort object keys alphabetically to make two JSON documents easier to compare or diff."
      category="Compare & Manipulate"
      currentSlug="json-sorter"
    >
      <SorterClient />
    </ToolLayout>
  );
}
