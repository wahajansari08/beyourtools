import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import ScientificCalculatorClient from "./ScientificCalculatorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("scientific-calculator")!);

export default function Page() {
  const tool = getGeneralTool("scientific-calculator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<ScientificCalculatorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "scientific-calculator", __enMetadata);
}
