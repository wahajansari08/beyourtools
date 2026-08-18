import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import DiffClient from "./DiffClient";

export const metadata: Metadata = {
  title: "JSON Diff / Compare - BeYourTools",
  description: "Compare two JSON documents and see every added, removed, and changed value.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Diff"
      title="JSON Diff / Compare"
      description="Paste two JSON documents to see exactly what was added, removed, or changed between them."
      category="Compare & Manipulate"
      currentSlug="json-diff"
    >
      <DiffClient />
    </ToolLayout>
  );
}
