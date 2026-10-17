import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import MetaTagGeneratorClient from "./MetaTagGeneratorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("meta-tag-generator")!);

export default function Page() {
  const tool = getGeneralTool("meta-tag-generator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<MetaTagGeneratorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "meta-tag-generator", __enMetadata);
}
