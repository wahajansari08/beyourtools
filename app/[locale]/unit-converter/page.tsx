import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import UnitConverterClient from "./UnitConverterClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("unit-converter")!);

export default function Page() {
  const tool = getGeneralTool("unit-converter");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<UnitConverterClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "unit-converter", __enMetadata);
}
