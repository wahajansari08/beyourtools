import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import BmiCalculatorClient from "./BmiCalculatorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("bmi-calculator")!);

export default function Page() {
  const tool = getGeneralTool("bmi-calculator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<BmiCalculatorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "bmi-calculator", __enMetadata);
}
