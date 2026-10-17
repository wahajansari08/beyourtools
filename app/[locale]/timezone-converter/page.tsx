import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import TimezoneConverterClient from "./TimezoneConverterClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("timezone-converter")!);

export default function Page() {
  const tool = getGeneralTool("timezone-converter");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<TimezoneConverterClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "timezone-converter", __enMetadata);
}
