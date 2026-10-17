import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import SignatureMakerClient from "./SignatureMakerClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("signature-maker");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "signature-maker", __enMetadata);
}

export default function SignatureMakerPage() {
  return <DesignToolPageShell tool={tool} client={<SignatureMakerClient />} />;
}
