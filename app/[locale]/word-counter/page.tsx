import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import WordCounterClient from "./WordCounterClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("word-counter")!);

export default function Page() {
  const tool = getGeneralTool("word-counter");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<WordCounterClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "word-counter", __enMetadata);
}
