import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import LoremIpsumGeneratorClient from "./LoremIpsumGeneratorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("lorem-ipsum-generator")!);

export default function Page() {
  const tool = getGeneralTool("lorem-ipsum-generator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<LoremIpsumGeneratorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "lorem-ipsum-generator", __enMetadata);
}
