import { localizeMetadata } from "@/lib/i18n-content";
import type { Metadata } from "next";
import FaviconGeneratorClient from "./FaviconGeneratorClient";
import DesignToolPageShell, { designToolMetadata, getPageTool } from "@/components/design/DesignToolPageShell";

const tool = getPageTool("favicon-generator");

const __enMetadata: Metadata = designToolMetadata(tool);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "favicon-generator", __enMetadata);
}

export default function FaviconGeneratorClientPage() {
  return <DesignToolPageShell tool={tool} client={<FaviconGeneratorClient />} />;
}
