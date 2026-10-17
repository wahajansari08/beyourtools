import type { Metadata } from "next";
import { localizeMetadata } from "@/lib/i18n-content";
import { getGeneralTool } from "@/lib/general-tools-config";
import { notFound } from "next/navigation";
import GeneralToolPageShell, { generalToolMetadata } from "@/components/general/GeneralToolPageShell";
import PasswordGeneratorClient from "./PasswordGeneratorClient";

const __enMetadata: Metadata = generalToolMetadata(getGeneralTool("password-generator")!);

export default function Page() {
  const tool = getGeneralTool("password-generator");
  if (!tool) notFound();
  return <GeneralToolPageShell tool={tool} client={<PasswordGeneratorClient />} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizeMetadata(locale, "password-generator", __enMetadata);
}
