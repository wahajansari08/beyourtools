import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import UuidGeneratorClient from "./UuidGeneratorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("uuid-generator")!);

export default function Page() {
  const tool = getGeneralTool("uuid-generator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<UuidGeneratorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "uuid-generator", __enMetadata);
}
