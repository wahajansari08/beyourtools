import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import RepairClient from "./RepairClient";

export const metadata: Metadata = {
  title: "JSON Repair - BeYourTools",
  description: "Automatically fix common JSON mistakes: trailing commas, single quotes, unquoted keys, and comments.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Repair"
      title="JSON Repair"
      description="Paste broken or JS-style JSON and BeYourTools will fix trailing commas, single quotes, unquoted keys, comments, and more."
      category="Format & Validate"
      currentSlug="json-repair"
    >
      <RepairClient />
    </ToolLayout>
  );
}
