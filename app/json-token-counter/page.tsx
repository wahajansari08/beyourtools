import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import TokenCounterClient from "./TokenCounterClient";

export const metadata: Metadata = {
  title: "JSON Token Counter - BeYourTools",
  description: "Estimate the LLM token count of a JSON payload before sending it to an API.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="Token Counter"
      title="JSON Token Counter"
      description="Paste JSON to estimate how many LLM tokens it will cost - useful for sizing prompts and API payloads."
      category="Encode & Inspect"
      currentSlug="json-token-counter"
    >
      <TokenCounterClient />
    </ToolLayout>
  );
}
