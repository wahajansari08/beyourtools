import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import PercentageCalculatorClient from "./PercentageCalculatorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("percentage-calculator")!);

export default function Page() {
  const tool = getGeneralTool("percentage-calculator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<PercentageCalculatorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "percentage-calculator", __enMetadata);
}
