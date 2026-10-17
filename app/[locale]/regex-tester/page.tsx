import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import RegexTesterClient from "./RegexTesterClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("regex-tester")!);

export default function Page() {
  const tool = getGeneralTool("regex-tester");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<RegexTesterClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "regex-tester", __enMetadata);
}
