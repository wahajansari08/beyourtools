import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import BeautifierClient from "./BeautifierClient";

export const metadata: Metadata = {
  title: "JSON Beautifier - BeYourTools",
  description: "Clean up messy or single-line JSON into a readable layout, with optional key sorting.",
  alternates: { canonical: "https://beyourtools.com/json-beautifier" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Beautifier"
      title="JSON Beautifier"
      description="Turn cramped or inconsistently formatted JSON into something easy to read, with optional alphabetical key sorting."
      category="Format & Validate"
      currentSlug="json-beautifier"
    >
      <BeautifierClient />
    </ToolLayout>
  );
}
