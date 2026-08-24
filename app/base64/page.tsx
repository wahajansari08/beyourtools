import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import Base64Client from "./Base64Client";

export const metadata: Metadata = {
  title: "Base64 Encode/Decode - BeYourTools",
  description: "Encode text to Base64 or decode Base64 back to text, fully in your browser.",
  alternates: { canonical: "https://beyourtools.com/base64" },
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="Base64"
      title="Base64 Encode / Decode"
      description="Encode text or JSON to Base64, or decode a Base64 string back to readable text."
      category="Encode & Inspect"
      currentSlug="base64"
    >
      <Base64Client />
    </ToolLayout>
  );
}
