import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import FlattenClient from "./FlattenClient";

export const metadata: Metadata = {
  title: "JSON Flatten / Unflatten - BeYourTools",
  description: "Flatten nested JSON into dot-notation paths, or rebuild nested JSON from flat keys.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Flatten"
      title="JSON Flatten / Unflatten"
      description="Collapse deeply nested JSON into flat dot-notation keys, or expand flat keys back into nested JSON."
      category="Compare & Manipulate"
      currentSlug="json-flatten"
    >
      <FlattenClient />
    </ToolLayout>
  );
}
