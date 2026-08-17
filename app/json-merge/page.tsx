import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MergeClient from "./MergeClient";

export const metadata: Metadata = {
  title: "JSON Merge — Jsonifyr",
  description: "Deep-merge two JSON objects into one, with the second object's values taking precedence.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JSON Merge"
      title="JSON Merge"
      description="Deep-merge two JSON objects. Where keys overlap, values from the second object win."
      category="Compare & Manipulate"
      currentSlug="json-merge"
    >
      <MergeClient />
    </ToolLayout>
  );
}
