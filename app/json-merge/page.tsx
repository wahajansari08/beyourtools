import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import MergeClient from "./MergeClient";

export const metadata: Metadata = {
  title: "JSON Merge - BeYourTools",
  description: "Deep-merge two JSON objects into one, with the second object's values taking precedence.",
  alternates: { canonical: "https://beyourtools.com/json-merge" },
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
