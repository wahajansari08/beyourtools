import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import CaseConverterClient from "./CaseConverterClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("case-converter")!);

export default function Page() {
  const tool = getGeneralTool("case-converter");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<CaseConverterClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "case-converter", __enMetadata);
}
