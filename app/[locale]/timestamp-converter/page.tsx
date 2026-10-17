import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import TimestampConverterClient from "./TimestampConverterClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("timestamp-converter")!);

export default function Page() {
  const tool = getGeneralTool("timestamp-converter");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<TimestampConverterClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "timestamp-converter", __enMetadata);
}
