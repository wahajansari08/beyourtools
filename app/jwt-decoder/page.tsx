import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import JwtDecoderClient from "./JwtDecoderClient";

export const metadata: Metadata = {
  title: "JWT Decoder - BeYourTools",
  description: "Decode a JWT's header and payload instantly. Runs entirely in your browser - your token is never sent anywhere.",
};

export default function Page() {
  return (
    <ToolLayout
      eyebrow="JWT Decoder"
      title="JWT Decoder"
      description="Paste a JWT to decode its header and payload. This does not verify the signature, and nothing is sent off your device."
      category="Encode & Inspect"
      currentSlug="jwt-decoder"
    >
      <JwtDecoderClient />
    </ToolLayout>
  );
}
