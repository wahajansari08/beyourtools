import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import ViewerClient from "./ViewerClient";

export const metadata: Metadata = {
  title: "JSON Viewer / Tree - BeYourTools",
  description: "Explore JSON as a collapsible tree. Paste large JSON and drill into exactly the part you need.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Viewer"
      title="JSON Viewer / Tree"
      description="Paste JSON and browse it as a collapsible tree instead of a wall of text."
      category="Format & Validate"
      currentSlug="json-viewer"
    >
      <ViewerClient />
    </ToolLayout>
  );
}
