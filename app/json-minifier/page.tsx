import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MinifierClient from "./MinifierClient";

export const metadata: Metadata = {
  title: "JSON Minifier - BeYourTools",
  description: "Strip whitespace from JSON to shrink payload size. See exactly how many bytes you saved.",
  alternates: { canonical: "https://beyourtools.com/json-minifier" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Minifier"
      title="JSON Minifier"
      description="Remove all unnecessary whitespace from JSON to reduce payload size for APIs and storage."
      category="Format & Validate"
      currentSlug="json-minifier"
    >
      <MinifierClient />
    </ToolLayout>
  );
}
