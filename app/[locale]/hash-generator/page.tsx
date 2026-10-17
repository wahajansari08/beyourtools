import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import HashGeneratorClient from "./HashGeneratorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("hash-generator")!);

export default function Page() {
  const tool = getGeneralTool("hash-generator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<HashGeneratorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "hash-generator", __enMetadata);
}
