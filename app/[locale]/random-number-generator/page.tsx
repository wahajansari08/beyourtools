import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import RandomNumberGeneratorClient from "./RandomNumberGeneratorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("random-number-generator")!);

export default function Page() {
  const tool = getGeneralTool("random-number-generator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<RandomNumberGeneratorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "random-number-generator", __enMetadata);
}
