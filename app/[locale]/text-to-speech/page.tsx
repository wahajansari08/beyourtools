import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import TextToSpeechClient from "./TextToSpeechClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("text-to-speech")!);

export default function Page() {
  const tool = getGeneralTool("text-to-speech");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<TextToSpeechClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "text-to-speech", __enMetadata);
}
